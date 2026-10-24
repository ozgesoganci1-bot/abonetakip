// SSE UÇ NOKTASI (Gün 10): GET /api/events
//
// Giriş yapmış manager ve finance kullanıcılarının tarayıcısı bu adrese bağlanır
// ve bağlantıyı açık tutar. Sunucu, kullanıcının firmasına ait uyarıları
// (şimdilik abonelik iptali) bu bağlantıdan gönderir.
//
// KİRACI İZOLASYONU: tenantId yalnızca getCurrentUser() sonucundan, yani
// veritabanından okunur. URL, sorgu parametresi veya çerezden alınmaz.
//
// YANIT KODLARI (bu uç nokta sayfa değil API'dir, bu yüzden requireUser()
// kullanılmaz: o fonksiyon giriş sayfasına yönlendirir):
//   401: giriş yapılmamış
//   403: rol uygun değil
//   429: firmanın bağlantı sınırı dolu (bkz. sse-hub.ts)
// Tarayıcının EventSource nesnesi 200 dışındaki yanıtta yeniden bağlanmayı
// bırakır. UyariDinleyici bu durumda sessizce durur.
//
// BAĞLANTI ÖMRÜ: Her bağlantı en fazla 15 dakika sürer, sonra sunucu kapatır.
// Tarayıcı "retry" değeri kadar (5 sn) bekleyip güncel çerezle yeniden bağlanır.
// Böylece çıkış yapmış ya da silinmiş kullanıcı en geç 15 dakika içinde 401 alır.
// Bu 5 saniyelik aralıkta yapılan iptalin canlı uyarısı kaçabilir (ADR, Gün 10).
// Bu ömür yalnızca bu dosyadadır; sse-hub.ts bilmez.

import { getCurrentUser } from "@/lib/auth";
import { sseHub, type Baglanti } from "@/lib/sse-hub";

// Cevap her istekte yeniden üretilir, önbelleğe alınmaz.
export const dynamic = "force-dynamic";
// Prisma ve oturum kodu Node ister (edge kullanılmaz, ADR).
export const runtime = "nodejs";

const IZINLI_ROLLER = new Set<string>(["manager", "finance"]);

// Tarayıcıya "koparsan 5 saniye sonra yeniden bağlan" der.
const YENIDEN_BAGLANMA_MS = 5_000;
// Boşta duran bağlantıyı proxy ve tarayıcı kesmesin diye gönderilen boş satır aralığı.
const KALP_ATISI_MS = 25_000;
// Bir bağlantının azami ömrü.
const BAGLANTI_OMRU_MS = 15 * 60 * 1000;

// Hata yanıtı: kısa düz metin, önbelleğe alınmaz.
function hataYaniti(durum: number, mesaj: string): Response {
  return new Response(mesaj, {
    status: durum,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(request: Request): Promise<Response> {
  const kullanici = await getCurrentUser();
  if (!kullanici) {
    return hataYaniti(401, "Giriş yapmanız gerekiyor.");
  }
  if (!IZINLI_ROLLER.has(kullanici.role)) {
    return hataYaniti(403, "Bu uyarıları görme yetkiniz yok.");
  }

  const kodlayici = new TextEncoder();
  let akis: ReadableStreamDefaultController<Uint8Array> | null = null;
  let kapandi = false;
  let kalpAtisi: ReturnType<typeof setInterval> | undefined;
  let omurSayaci: ReturnType<typeof setTimeout> | undefined;
  let listedenAyril: () => void = () => {};

  // Her kapanış yolu (tarayıcı kapandı, yazma hatası, 15 dakika doldu) buraya gelir.
  // Birden fazla kez çağrılması zararsızdır.
  function temizle(): void {
    if (kapandi) return;
    kapandi = true;
    clearInterval(kalpAtisi);
    clearTimeout(omurSayaci);
    listedenAyril();
    try {
      akis?.close();
    } catch {
      // Akış zaten kapanmış olabilir.
    }
  }

  // Hub'ın bağlantıdan beklediği tek şey: metin gönderebilmek.
  // Yazma hata verirse bağlantı kopmuştur: zamanlayıcılar durdurulur ve hata
  // yukarı fırlatılır, hub da bağlantıyı listeden çıkarır (yedek temizlik yolu).
  const baglanti: Baglanti = {
    gonder: (metin) => {
      if (!akis || kapandi) throw new Error("Bağlantı kapalı.");
      try {
        akis.enqueue(kodlayici.encode(metin));
      } catch (hata) {
        temizle();
        throw hata;
      }
    },
  };

  // tenantId oturumdan gelir. Sınır doluysa yeni bağlantı reddedilir.
  const sonuc = sseHub.abone(kullanici.tenantId, baglanti);
  if (!sonuc.ok) {
    return hataYaniti(429, "Bu firma için açık bağlantı sınırına ulaşıldı.");
  }
  listedenAyril = sonuc.ayril;

  // Abone olma ile akışın kurulması arasında await yoktur: bu iki adımın arasına
  // başka bir istek ya da yayın giremez.
  const govde = new ReadableStream<Uint8Array>({
    start(controller) {
      akis = controller;
      controller.enqueue(kodlayici.encode(`retry: ${YENIDEN_BAGLANMA_MS}\n\n`));
      kalpAtisi = setInterval(() => {
        try {
          controller.enqueue(kodlayici.encode(": nabiz\n\n"));
        } catch {
          temizle();
        }
      }, KALP_ATISI_MS);
      omurSayaci = setTimeout(temizle, BAGLANTI_OMRU_MS);
    },
    // Tarayıcı sekmeyi kapatınca ya da bağlantıyı bırakınca çağrılır.
    cancel() {
      temizle();
    },
  });

  // İkinci temizlik yolu: isteğin iptal sinyali.
  if (request.signal.aborted) {
    temizle();
  } else {
    request.signal.addEventListener("abort", temizle, { once: true });
  }

  return new Response(govde, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}