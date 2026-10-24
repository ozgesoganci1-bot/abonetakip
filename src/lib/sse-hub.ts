// SSE BAĞLANTI MERKEZİ (Gün 10)
//
// Açık SSE bağlantılarını firmaya (tenant) göre gruplar ve bir firmaya ait uyarıyı
// YALNIZCA o firmanın bağlantılarına iletir.
//
// KİRACI İZOLASYONU: Liste "tenantId → bağlantılar" biçimindedir. Mesaj yalnızca
// verilen tenantId'nin kümesine yazılır; başka firmanın bağlantısı bu kümede
// olmadığı için mesajı alamaz. tenantId'yi çağıran taraf her zaman OTURUMDAN verir
// (api/events/route.ts ve abonelikler/actions.ts), istemciden asla.
//
// BELLEKTE TUTULUR: Liste tek Render süreciyle çalışır (ADR, Gün 10). İkinci bir
// sunucu süreci açılırsa birindeki iptali diğerindeki kullanıcılar duymaz.
//
// FİRMA BAŞINA SINIR: Bir firma en fazla FIRMA_BASINA_SINIR bağlantı açabilir.
// Sınır doluysa YENİ bağlantı reddedilir, açık olanlara dokunulmaz. En eskiyi
// kapatmak döngü yaratırdı: kapatılan sekme kendiliğinden yeniden bağlanır ve
// başka bir sekmeyi düşürürdü.
//
// Bu dosya Next.js'e ve veritabanına bağlı değildir. Bu yüzden "npm test" ile
// veritabanı olmadan test edilir (sse-hub.test.ts).

// Bir firmanın aynı anda açık tutabileceği en fazla bağlantı (sekme) sayısı.
export const FIRMA_BASINA_SINIR = 20;

// Hub'ın bir bağlantıdan beklediği tek şey: metin gönderebilmek.
// Bağlantı kapanmışsa gonder() hata fırlatır; hub bu bağlantıyı listeden çıkarır.
export type Baglanti = {
  gonder: (metin: string) => void;
};

// İstemciye iletilen uyarı. Şimdilik tek tür var: abonelik iptali.
export type UyariOlayi = {
  tur: "iptal";
  musteriAdi: string;
};

// Abone olma sonucu. Sınır doluysa ok: false döner ve bağlantı eklenmez.
export type AboneSonucu = { ok: true; ayril: () => void } | { ok: false };

// Uyarıyı SSE biçimine çevirir:
//   event: iptal
//   data: {"musteriAdi":"..."}
//   (boş satır: mesajın bittiğini gösterir)
// JSON.stringify satır sonlarını "\n" diye kaçırır. Müşteri adında satır sonu
// olsa bile "data:" satırı tek satır kalır ve SSE biçimi bozulmaz.
export function sseMesaji(olay: UyariOlayi): string {
  const { tur, ...veri } = olay;
  return `event: ${tur}\ndata: ${JSON.stringify(veri)}\n\n`;
}

// Yeni bir hub üretir. Uygulama aşağıdaki tek örneği (sseHub) kullanır;
// testler her seferinde temiz bir hub üretir ve isterse küçük bir sınır verir.
export function hubOlustur(sinir: number = FIRMA_BASINA_SINIR) {
  const firmalar = new Map<string, Set<Baglanti>>();

  // Bağlantıyı listeden çıkarır. Firmanın son bağlantısıysa firma anahtarı da
  // silinir (boş kümeler bellekte birikmesin diye).
  function cikar(tenantId: string, baglanti: Baglanti): void {
    const kume = firmalar.get(tenantId);
    if (!kume) return;
    kume.delete(baglanti);
    if (kume.size === 0) firmalar.delete(tenantId);
  }

  // Bağlantıyı firmanın listesine ekler.
  // Sınır kontrolü ve ekleme aynı senkron adımdadır. Node tek iş parçacığında
  // çalıştığı için iki istek bu satırların arasına giremez.
  function abone(tenantId: string, baglanti: Baglanti): AboneSonucu {
    const mevcut = firmalar.get(tenantId);
    if (mevcut && mevcut.size >= sinir) return { ok: false };

    const kume = mevcut ?? new Set<Baglanti>();
    kume.add(baglanti);
    firmalar.set(tenantId, kume);

    let ayrildi = false;
    return {
      ok: true,
      // Birden fazla kez çağrılması zararsızdır (ör. hem tarayıcı kapanması
      // hem 15 dakikalık ömrün dolması aynı anda olursa).
      ayril: () => {
        if (ayrildi) return;
        ayrildi = true;
        cikar(tenantId, baglanti);
      },
    };
  }

  // Uyarıyı yalnızca verilen firmanın bağlantılarına gönderir.
  // Gönderimde hata veren (kapanmış) bağlantı listeden çıkarılır, diğerleri
  // etkilenmez. Dönen değer: mesajın ulaştığı bağlantı sayısı.
  function yayinla(tenantId: string, olay: UyariOlayi): number {
    const kume = firmalar.get(tenantId);
    if (!kume) return 0;

    const metin = sseMesaji(olay);
    let ulasan = 0;
    // Kopya üzerinde dönülür: döngü sırasında bozuk bağlantı kümeden silinebilir.
    for (const baglanti of [...kume]) {
      try {
        baglanti.gonder(metin);
        ulasan++;
      } catch {
        cikar(tenantId, baglanti);
      }
    }
    return ulasan;
  }

  // Firmanın açık bağlantı sayısı (testler ve kontrol için).
  function baglantiSayisi(tenantId: string): number {
    return firmalar.get(tenantId)?.size ?? 0;
  }

  // Listede en az bir bağlantısı olan firma sayısı (testler için).
  function firmaSayisi(): number {
    return firmalar.size;
  }

  return { abone, yayinla, baglantiSayisi, firmaSayisi };
}

export type SseHub = ReturnType<typeof hubOlustur>;

// Uygulamanın kullandığı TEK hub örneği. globalThis üzerinde saklanır. İki nedeni var:
// 1. Geliştirme modunda Next.js dosyaları yeniden yüklediğinde liste kaybolmaz.
// 2. Route dosyası (api/events) ile sunucu işlemi (actions.ts) Next.js tarafından
//    ayrı paketlerde derlenebilir. globalThis, ikisinin aynı listeyi görmesini sağlar.
const depo = globalThis as typeof globalThis & { abonetakipSseHub?: SseHub };
export const sseHub: SseHub = depo.abonetakipSseHub ?? hubOlustur();
depo.abonetakipSseHub = sseHub;