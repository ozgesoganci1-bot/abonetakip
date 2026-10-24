// GEÇMİŞ MRR DEMO VERİSİ (Gün 11) - YALNIZCA TEST DALI
//
// Çalıştırma: npm run demo:gecmis -- kullanici@example.com
//
// Ne yapar? Test dalında VAR OLAN bir kullanıcının firmasına, aylık MRR grafiğini
// elle sınamak için 14 aya yayılan sahte veri ekler. Tarihler çalıştırıldığı aya göre
// kaydırılır; böylece beklenen değerler her ay aynıdır. Senaryo, metrikler.test.ts
// içindeki "Gün 11 senaryosu" ile aynıdır ("bu ay" = 0, "1 ay önce" = geçen ay).
// Bütün saatler Türkiye saatidir:
//   A: aylık 1.000,   14 ay önce ayın 10'u, kalıyor                   (12 aydan eski veri)
//   B: yıllık 12.000,  9 ay önce ayın 15'i, kalıyor                   (yıllık plan)
//   C: aylık 500,      7 ay önce ayın 5'i, 4 ay önce ayın 10'u iptal  (ay içinde iptal)
//   D: yıllık 1.000,   5 ay önce ayın 1'i 00:30, kalıyor              (ay sınırı + küsurat)
//   E: aylık 2.000,   11 ay önce ayın 20'si, 1 ay önce ayın 1'i 00:00 iptal (tam sınırda iptal)
// Ne yapmaz? Firma veya kullanıcı oluşturmaz, parola yazmaz, CAC'ye dokunmaz,
// canlı veritabanına bağlanmaz. Kendiliğinden çalışmaz, yalnızca elle çalıştırılır.
//
// Güvenceler (demo-verisi.ts ile aynı):
// 1. canli-koruma.ts: TEST_VERITABANI=evet yoksa ya da DATABASE_URL canlı (.env) ile
//    aynı sunucuyu gösteriyorsa veritabanına HİÇ bağlanmadan durur.
// 2. veri.ts kendi TEST_VERITABANI kontrolünü ayrıca yapar.
// 3. Yazma işlemleri tenant filtresinden geçer (tenantaBagliDb).
// 4. Firmada zaten abonelik varsa (iptal edilmişler dahil) hiçbir şey yazmadan durur.
// 5. Bütün kayıtlar tek işlemde (transaction) yazılır: ya hepsi ya hiçbiri.
// 6. Ekrana hiçbir adres veya kişisel bilgi yazılmaz.

import { testDaliKontrolu } from "./canli-koruma.ts";
import { epostaDogrula } from "../lib/validation.ts";
import { ayAraligi, sonAylar } from "../lib/metrikler.ts";
import { ayEtiketi, tlMetni } from "../lib/bicim.ts";
import { donemleriIlerlet } from "./donem-ilerlet.ts";

const DAKIKA = 60 * 1000;
const SAAT = 60 * DAKIKA;
const GUN = 24 * SAAT;

// Elle hesaplanmış beklenen grafik: eskiden yeniye, son eleman bu ay.
// Bilerek kodla hesaplanmaz; ekrandaki grafik bağımsız bir sonuçla karşılaştırılır.
// Örnek (5 ay önceki ay, en yüksek): 1.000 + 1.000 + 500 + 1.000/12 + 2.000 = 4.583,33 -> 4.583
const BEKLENEN_MRR = [3000, 3000, 4000, 4000, 4500, 4500, 4583, 4083, 4083, 4083, 2083, 2083];

// 1. güvence: veritabanı modülleri yüklenmeden ÖNCE.
const kontrol = testDaliKontrolu();
if (!kontrol.ok) {
  console.error(`Durduruldu: ${kontrol.hata}`);
  process.exit(1);
}

const eposta = epostaDogrula(process.argv[2]);
if (!eposta.ok) {
  console.error("Kullanım: npm run demo:gecmis -- kullanici@example.com");
  process.exit(1);
}

// Kontroller geçildikten SONRA veritabanı modülleri yüklenir.
const { kullanicininFirmaKimligi, baglantiyiKapat } = await import("./veri.ts");
const { tenantaBagliDb } = await import("../lib/tenant.ts");

// "geri" ay önceki ayın "gun". günü, Türkiye saatiyle saat:dakika (UTC Date olarak).
// Ay, sonAylar ile bulunur (yıl geçişi ve Türkiye saati orada çözülmüştür).
function ayinGunu(simdi: Date, geri: number, gun: number, saat = 10, dakika = 0): Date {
  const { yil, ay } = sonAylar(simdi, geri + 1)[0];
  const ayBasi = ayAraligi(yil, ay).baslangic; // ayın 1'i 00:00 (TR)
  return new Date(ayBasi.getTime() + (gun - 1) * GUN + saat * SAAT + dakika * DAKIKA);
}

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
      "Bu firmada zaten abonelik var. Geçmiş MRR verisi yalnızca aboneliği olmayan bir firmaya eklenir (test dalında yeni bir kullanıcıyla kayıt olun)."
    );
    return 1;
  }

  const simdi = new Date();

  const senaryo = [
    { musteri: "Geçmiş Müşteri A", plan: "Geçmiş Aylık 1.000", fiyat: 1000, aralik: "MONTHLY", baslangic: ayinGunu(simdi, 14, 10), iptal: null },
    { musteri: "Geçmiş Müşteri B", plan: "Geçmiş Yıllık 12.000", fiyat: 12000, aralik: "YEARLY", baslangic: ayinGunu(simdi, 9, 15), iptal: null },
    { musteri: "Geçmiş Müşteri C", plan: "Geçmiş Aylık 500", fiyat: 500, aralik: "MONTHLY", baslangic: ayinGunu(simdi, 7, 5), iptal: ayinGunu(simdi, 4, 10) },
    { musteri: "Geçmiş Müşteri D", plan: "Geçmiş Yıllık 1.000", fiyat: 1000, aralik: "YEARLY", baslangic: ayinGunu(simdi, 5, 1, 0, 30), iptal: null },
    { musteri: "Geçmiş Müşteri E", plan: "Geçmiş Aylık 2.000", fiyat: 2000, aralik: "MONTHLY", baslangic: ayinGunu(simdi, 11, 20), iptal: ayinGunu(simdi, 1, 1, 0, 0) },
  ] as const;

  // 5. güvence: tek işlem.
  await db.$transaction(
    async (tx) => {
      for (const s of senaryo) {
        // tenantId burada TypeScript istediği için yazılır; tenant filtresi zaten ezer.
        const plan = await tx.plan.create({
          data: { tenantId, name: s.plan, price: s.fiyat, interval: s.aralik, createdAt: s.baslangic },
          select: { id: true },
        });
        const musteri = await tx.customer.create({
          data: { tenantId, name: s.musteri, email: null, createdAt: s.baslangic },
          select: { id: true },
        });

        const sinir = s.iptal ?? simdi;
        const { yenilemeler, currentPeriodEnd } = donemleriIlerlet(s.baslangic, s.aralik, sinir);

        const abonelik = await tx.subscription.create({
          data: {
            tenantId,
            customerId: musteri.id,
            planId: plan.id,
            status: s.iptal ? "CANCELED" : "ACTIVE",
            startedAt: s.baslangic,
            currentPeriodEnd,
            canceledAt: s.iptal,
            createdAt: s.baslangic,
          },
          select: { id: true },
        });

        // Her durum değişikliği olay tablosuna (iş kuralı).
        const olaylar = [
          { type: "STARTED" as const, createdAt: s.baslangic },
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

  console.log("Geçmiş MRR demo verisi eklendi (test dalı): 5 plan, 5 müşteri, 5 abonelik (2'si geçmişte iptal).");
  console.log("Dashboard'da beklenen grafik (son 12 ay, elle hesaplanmış):");
  sonAylar(simdi, BEKLENEN_MRR.length).forEach(({ yil, ay }, i) => {
    const buAy = i === BEKLENEN_MRR.length - 1 ? " (bu ay)" : "";
    console.log(`  ${ayEtiketi(yil, ay)}${buAy}: ${tlMetni(BEKLENEN_MRR[i])}`);
  });
  console.log("MRR kartı: 2.083 TL (grafiğin son noktasıyla aynı olmalı).");
  return 0;
}

try {
  process.exitCode = await calistir();
} catch {
  // Ayrıntı yazılmaz (adres veya veri sızmasın).
  console.error("Geçmiş MRR demo verisi eklenemedi. Hiçbir kayıt yazılmadı (işlem geri alındı).");
  process.exitCode = 1;
} finally {
  await baglantiyiKapat();
}