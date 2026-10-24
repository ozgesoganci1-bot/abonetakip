// DEMO VERİSİ BETİĞİ (Gün 9) - YALNIZCA TEST DALI
//
// Çalıştırma: npm run demo:veri -- kullanici@ornek.com
//
// Ne yapar? Test dalında VAR OLAN bir kullanıcının firmasına Gün 9 elle test
// senaryosunun sahte verisini ekler:
//   A: aylık 1.000 TL, önceki aydan beri aktif, kalıyor
//   B: yıllık 12.000 TL, önceki aydan beri aktif, bu ay iptal
//   C: aylık 500 TL, önceki aydan beri aktif, bu ay iptal
// Ne yapmaz? Firma veya kullanıcı oluşturmaz, parola yazmaz, CAC'ye dokunmaz,
// canlı veritabanına bağlanmaz. Kendiliğinden çalışmaz, yalnızca elle çalıştırılır.
//
// Güvenceler:
// 1. canli-koruma.ts: TEST_VERITABANI=evet yoksa ya da DATABASE_URL canlı (.env) ile
//    aynı sunucuyu gösteriyorsa veritabanına HİÇ bağlanmadan durur.
// 2. veri.ts kendi TEST_VERITABANI kontrolünü ayrıca yapar.
// 3. Yazma işlemleri tenant filtresinden geçer (tenantaBagliDb).
// 4. Firmada zaten abonelik varsa (iptal edilmişler dahil) hiçbir şey yazmadan durur:
//    rakamlar karışmaz ve betik aynı firmada iki kez çalıştırılamaz.
// 5. Bütün kayıtlar tek işlemde (transaction) yazılır: ya hepsi ya hiçbiri.
// 6. Ekrana hiçbir adres veya kişisel bilgi yazılmaz.
//
// Gün 11: donemleriIlerlet, gecmis-mrr-verisi.ts ile ortak kullanılsın diye
// donem-ilerlet.ts dosyasına taşındı. Bu betiğin davranışı değişmedi.

import { testDaliKontrolu } from "./canli-koruma.ts";
import { epostaDogrula } from "../lib/validation.ts";
import { ayAraligi, turkiyeAyi } from "../lib/metrikler.ts";
import { donemleriIlerlet } from "./donem-ilerlet.ts";

const DAKIKA = 60 * 1000;
const GUN = 24 * 60 * DAKIKA;

// 1. güvence: veritabanı modülleri yüklenmeden ÖNCE.
const kontrol = testDaliKontrolu();
if (!kontrol.ok) {
  console.error(`Durduruldu: ${kontrol.hata}`);
  process.exit(1);
}

const eposta = epostaDogrula(process.argv[2]);
if (!eposta.ok) {
  console.error("Kullanım: npm run demo:veri -- kullanici@ornek.com");
  process.exit(1);
}

// Kontroller geçildikten SONRA veritabanı modülleri yüklenir.
const { kullanicininFirmaKimligi, baglantiyiKapat } = await import("./veri.ts");
const { tenantaBagliDb } = await import("../lib/tenant.ts");

async function calistir(): Promise<number> {
  if (!eposta.ok) return 1;

  const tenantId = await kullanicininFirmaKimligi(eposta.deger);
  if (!tenantId) {
    console.error(
      "Bu e-postayla test dalında kullanıcı bulunamadı. Önce 'npm run dev:test' ile test dalında kayıt olun."
    );
    return 1;
  }

  const db = tenantaBagliDb(tenantId);

  // 4. güvence: firmada hiç abonelik olmamalı.
  if ((await db.subscription.count()) > 0) {
    console.error(
      "Bu firmada zaten abonelik var. Demo verisi yalnızca aboneliği olmayan bir firmaya eklenir (test dalında yeni bir kullanıcıyla kayıt olun)."
    );
    return 1;
  }

  // Tarihler: çalıştırıldığı aya göre.
  const simdi = new Date();
  const { yil, ay } = turkiyeAyi(simdi);
  const buAy = ayAraligi(yil, ay);
  if (simdi.getTime() - buAy.baslangic.getTime() < 15 * DAKIKA) {
    console.error("Ayın ilk 15 dakikasındayız; iptaller bu aya düşmeyebilir. Biraz sonra tekrar deneyin.");
    return 1;
  }
  // Abonelikler önceki ayın ortalarında başlar: ay başında üçü de aktiftir.
  const baslangic = new Date(buAy.baslangic.getTime() - 20 * GUN);

  const senaryo = [
    { musteri: "Demo Müşteri A", plan: "Demo Aylık 1.000", fiyat: 1000, aralik: "MONTHLY", iptal: null },
    { musteri: "Demo Müşteri B", plan: "Demo Yıllık 12.000", fiyat: 12000, aralik: "YEARLY", iptal: new Date(simdi.getTime() - 10 * DAKIKA) },
    { musteri: "Demo Müşteri C", plan: "Demo Aylık 500", fiyat: 500, aralik: "MONTHLY", iptal: new Date(simdi.getTime() - 5 * DAKIKA) },
  ] as const;

  // 5. güvence: tek işlem.
  await db.$transaction(
    async (tx) => {
      for (const s of senaryo) {
        // tenantId burada TypeScript istediği için yazılır; tenant filtresi zaten ezer.
        const plan = await tx.plan.create({
          data: { tenantId, name: s.plan, price: s.fiyat, interval: s.aralik, createdAt: baslangic },
          select: { id: true },
        });
        const musteri = await tx.customer.create({
          data: { tenantId, name: s.musteri, email: null, createdAt: baslangic },
          select: { id: true },
        });

        const sinir = s.iptal ?? simdi;
        const { yenilemeler, currentPeriodEnd } = donemleriIlerlet(baslangic, s.aralik, sinir);

        const abonelik = await tx.subscription.create({
          data: {
            tenantId,
            customerId: musteri.id,
            planId: plan.id,
            status: s.iptal ? "CANCELED" : "ACTIVE",
            startedAt: baslangic,
            currentPeriodEnd,
            canceledAt: s.iptal,
            createdAt: baslangic,
          },
          select: { id: true },
        });

        // Her durum değişikliği olay tablosuna (iş kuralı).
        const olaylar = [
          { type: "STARTED" as const, createdAt: baslangic },
          ...yenilemeler.map((t) => ({ type: "RENEWED" as const, createdAt: t })),
          ...(s.iptal ? [{ type: "CANCELED" as const, createdAt: s.iptal }] : []),
        ];
        await tx.subscriptionEvent.createMany({
          data: olaylar.map((o) => ({
            tenantId,
            subscriptionId: abonelik.id,
            type: o.type,
            createdAt: o.createdAt,
          })),
        });
      }
    },
    { timeout: 20_000 }
  );

  console.log("Demo verisi eklendi (test dalı): 3 plan, 3 müşteri, 3 abonelik (2'si bu ay iptal).");
  console.log("Dashboard'da beklenen (CAC girilmeden önce):");
  console.log("  MRR 1.000 TL | Aylık churn %66,7 | LTV 1.500 TL | LTV/CAC: CAC girilmedi");
  console.log("  Aktif müşteri 1 | Bu ay yeni 0 | Bu ay iptal 2");
  console.log("Ayarlar'dan CAC 5000 girildikten sonra: LTV/CAC 0,3 ve 'Dikkat'.");
  return 0;
}

try {
  process.exitCode = await calistir();
} catch {
  // Ayrıntı yazılmaz (adres veya veri sızmasın).
  console.error("Demo verisi eklenemedi. Hiçbir kayıt yazılmadı (işlem geri alındı).");
  process.exitCode = 1;
} finally {
  await baglantiyiKapat();
}