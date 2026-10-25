// SEED: DEMO KİRACILARI (Gün 13)
//
// Çalıştırma:
//   npm run seed:demo        -> test dalı (.env.test). canli-koruma.ts kontrolü uygulanır.
//   npm run seed:demo:canli  -> canlı veritabanı (.env). --canli bayrağı ve terminalde
//                               "evet" yazarak onay gerekir.
//
// Ne yapar? İki sahte kiracıyı ("Mavi Yazılım" ve "Kuzey Teknoloji") kurar. Kiracı daha
// önce kurulduysa yalnızca o kiracının kayıtlarını silip aynı veriyi yeniden yazar
// (tekrar çalıştırılabilir). Verinin kendisi demo-kurulum.ts'te hesaplanır.
// Sonunda kendi kontrol özetini yazdırır: kiracı başına sayılar, metrikler ve
// kiracılar arası bağlantı kontrolü (hepsi 0 olmalı).
// Ne yapmaz? Demo olmayan hiçbir firmaya, kullanıcıya veya kayda dokunmaz.
// Kendiliğinden çalışmaz, yalnızca elle çalıştırılır.
//
// DEMO KİRACIYI TANIMA KURALI (ikisi birden sağlanmalı):
//   1. Firma adı birebir "Mavi Yazılım" veya "Kuzey Teknoloji".
//   2. Firmanın en az bir kullanıcısı var ve BÜTÜN kullanıcıları @demo.example uzantılı.
// Aynı adla demo olmayan bir firma varsa (biri bu adla gerçekten kayıt olduysa) betik ona
// dokunmadan durur. Demo e-postalarından biri başka bir firmada kayıtlıysa yine durur.
//
// İSTİSNA (Gün 13 onayı): Bu betik ham Prisma istemcisini kendi bağlantısıyla kullanır.
//   - Firma oluşturma ve silme tenant filtresinden geçemez: tenant.ts bunları ve müşteri,
//     plan, abonelik, olay silmeyi bilerek engeller. tenant.ts'e dokunulmaz.
//   - Bu yüzden her silme yalnızca yukarıdaki kuralla DOĞRULANMIŞ demo kiracının
//     kimliğiyle, açık "where: { tenantId }" koşuluyla yapılır. Joker silme yoktur.
//   - lib/db.ts kullanılmaz (uygulamanın bağlantısıdır). veri.ts kullanılmaz
//     (TEST_VERITABANI=evet zorunlu tutar; korumasını zayıflatmamak için ona dokunulmadı).
//   - Bu bir yönetici betiğidir: tenantId istemciden gelmez, betik kiracıyı kendisi
//     bulur veya oluşturur. "Merkezi tenant filtresi" kuralı uygulama sorguları içindir.
//
// Güvenceler:
// 1. Test modunda canli-koruma.ts: TEST_VERITABANI=evet yoksa ya da DATABASE_URL canlı
//    (.env) ile aynı sunucuyu gösteriyorsa veritabanına HİÇ bağlanmadan durur.
// 2. Canlı modunda: --canli bayrağı, .env.test yüklü OLMAMALI, terminal etkileşimli
//    olmalı ve kullanıcı "evet" yazmalı. Biri eksikse veritabanına hiç bağlanmaz.
// 3. Her kiracı tek işlemde (transaction) kurulur: ya hepsi ya hiçbiri.
// 4. Ekrana hiçbir veritabanı adresi, sunucu adı veya parola özeti yazılmaz.
//    Yalnızca sahte demo e-postaları ve sayılar yazılır.

import { createInterface } from "node:readline/promises";
import bcrypt from "bcryptjs";
import type { PrismaClient } from "../../generated/prisma/client";
import { testDaliKontrolu } from "./canli-koruma.ts";
import {
  DEMO_KIRACILAR,
  DEMO_PAROLA,
  DEMO_UZANTI,
  demoSenaryosu,
  type KiraciSenaryosu,
} from "./demo-kurulum.ts";
import {
  type AbonelikGirdisi,
  ayAraligi,
  aylikChurn,
  ltvCacSaglikliMi,
  metrikOzeti,
  sonAylar,
  turkiyeAyi,
} from "../lib/metrikler.ts";
import { RISK_GUN } from "../lib/riskli-abonelikler.ts";

const GUN = 24 * 60 * 60 * 1000;

// Bilerek durdurulan durumlar. Mesajı ekrana yazmak güvenlidir (adres veya veri içermez).
class Durdur extends Error {}

function dur(mesaj: string): never {
  console.error(`Durduruldu: ${mesaj}`);
  process.exit(1);
}

// ---------- 1. Bağlanmadan ÖNCE yapılan kontroller ----------

const argumanlar = process.argv.slice(2);
if (argumanlar.some((a) => a !== "--canli")) {
  dur("Bilinmeyen seçenek. Kullanım: npm run seed:demo (test dalı) ya da npm run seed:demo:canli (canlı).");
}
const canli = argumanlar.includes("--canli");

if (canli) {
  // .env.test'te TEST_VERITABANI=evet vardır. Canlı modunda bu işaret OLMAMALI:
  // yanlışlıkla "npm run seed:demo -- --canli" yazılırsa burada durur.
  if (process.env.TEST_VERITABANI === "evet") {
    dur("--canli verildi ama test ayarları (.env.test) yüklü. Canlı için: npm run seed:demo:canli");
  }
  if (!process.env.DATABASE_URL) {
    dur("DATABASE_URL bulunamadı. .env dosyasını kontrol edin.");
  }
} else {
  const kontrol = testDaliKontrolu();
  if (!kontrol.ok) dur(kontrol.hata);
}

// Senaryo veritabanına bağlanmadan önce hesaplanır (ay başı kontrolü burada yapılır).
const simdi = new Date();
const senaryolar: KiraciSenaryosu[] = [];
for (const kiraci of DEMO_KIRACILAR) {
  const sonuc = demoSenaryosu(kiraci, simdi);
  if (!sonuc.ok) dur(sonuc.hata);
  senaryolar.push(sonuc.senaryo);
}

// 2. güvence: canlı modunda açık onay.
if (canli) {
  if (!process.stdin.isTTY) {
    dur("Canlı modunda onay terminalden verilmelidir (etkileşimli terminal bulunamadı).");
  }
  const okuyucu = createInterface({ input: process.stdin, output: process.stdout });
  console.log("DİKKAT: CANLI veritabanına demo verisi yazılacak.");
  console.log(
    `Yalnızca ${DEMO_KIRACILAR.map((k) => `"${k.ad}"`).join(" ve ")} demo kiracıları silinip yeniden kurulacak.`
  );
  const cevap = await okuyucu.question('Devam etmek için "evet" yazıp Enter\'a basın: ');
  okuyucu.close();
  if (cevap.trim().toLocaleLowerCase("tr-TR") !== "evet") {
    dur("Onay verilmedi. Hiçbir şey yazılmadı.");
  }
}

// ---------- 2. Bağlantı (kontroller geçildikten SONRA) ----------

const { PrismaPg } = await import("@prisma/adapter-pg");
const { PrismaClient: Istemci } = await import("../../generated/prisma/client");
// Adres yalnızca ortam değişkeninden okunur ve hiçbir yere yazılmaz.
const prisma: PrismaClient = new Istemci({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// Map'ten değer alır; yoksa durdurur (senaryo ile yazılan kayıtlar eşleşmiyorsa).
function bul<T>(harita: Map<string, T>, anahtar: string, ne: string): T {
  const deger = harita.get(anahtar);
  if (deger === undefined) throw new Durdur(`${ne} eşleştirilemedi: ${anahtar}`);
  return deger;
}

// Bir demo kiracıyı tek işlemde kurar. Firma kimliğini ve "yeniden mi kuruldu" bilgisini döner.
async function kiraciyiKur(
  s: KiraciSenaryosu,
  parolaOzetleri: string[]
): Promise<{ tenantId: string; yeniden: boolean }> {
  const ad = s.kiraci.ad;
  const demoEpostalari = s.kullanicilar.map((k) => k.eposta);

  return prisma.$transaction(
    async (tx) => {
      // a) Aynı adlı firmalar: en fazla bir tane olmalı ve demo kuralına uymalı.
      const ayniAdlilar = await tx.tenant.findMany({
        where: { name: ad },
        select: { id: true, users: { select: { email: true } } },
      });
      if (ayniAdlilar.length > 1) {
        throw new Durdur(`"${ad}" adında birden fazla firma var; hangisinin demo olduğu belirsiz.`);
      }
      const mevcut = ayniAdlilar[0];
      if (
        mevcut &&
        (mevcut.users.length === 0 || !mevcut.users.every((u) => u.email.endsWith(DEMO_UZANTI)))
      ) {
        throw new Durdur(
          `"${ad}" adında demo olmayan bir firma var (kullanıcıları ${DEMO_UZANTI} uzantılı değil). Ona dokunulmadı.`
        );
      }

      // b) Demo e-postaları başka bir firmada kayıtlı olmamalı (e-posta bütün firmalarda benzersiz).
      const baskaFirmada = await tx.user.count({
        where: {
          email: { in: demoEpostalari },
          ...(mevcut ? { tenantId: { not: mevcut.id } } : {}),
        },
      });
      if (baskaFirmada > 0) {
        throw new Durdur(`"${ad}" için demo e-postalarından biri başka bir firmada kayıtlı. Ona dokunulmadı.`);
      }

      // c) Firma: varsa yalnızca BU firmanın kayıtları silinir, yoksa oluşturulur.
      //    Silme sırası tablolar arasındaki bağlara göredir: önce olaylar, en son kullanıcılar.
      let tenantId: string;
      if (mevcut) {
        tenantId = mevcut.id;
        await tx.subscriptionEvent.deleteMany({ where: { tenantId } });
        await tx.subscription.deleteMany({ where: { tenantId } });
        await tx.customer.deleteMany({ where: { tenantId } });
        await tx.plan.deleteMany({ where: { tenantId } });
        await tx.user.deleteMany({ where: { tenantId } });
        await tx.tenant.update({ where: { id: tenantId }, data: { cac: s.kiraci.cac } });
      } else {
        const firma = await tx.tenant.create({
          data: { name: ad, cac: s.kiraci.cac, createdAt: s.olusturma },
          select: { id: true },
        });
        tenantId = firma.id;
      }

      // d) Kullanıcılar (parola bcrypt özeti olarak saklanır).
      await tx.user.createMany({
        data: s.kullanicilar.map((k, i) => ({
          tenantId,
          email: k.eposta,
          passwordHash: parolaOzetleri[i],
          name: k.ad,
          role: k.rol,
          createdAt: s.olusturma,
        })),
      });

      // e) Planlar ve müşteriler. Adlar kiracı içinde benzersizdir (testle kontrol edilir);
      //    abonelikler bu adlarla kimliklere bağlanır.
      const planlar = await tx.plan.createManyAndReturn({
        data: s.planlar.map((p) => ({
          tenantId,
          name: p.ad,
          price: p.fiyat,
          interval: p.aralik,
          createdAt: p.olusturma,
        })),
        select: { id: true, name: true },
      });
      const planKimligi = new Map(planlar.map((p) => [p.name, p.id]));

      const musteriler = await tx.customer.createManyAndReturn({
        data: s.musteriler.map((m) => ({
          tenantId,
          name: m.ad,
          email: m.eposta,
          isActive: m.aktifMi,
          createdAt: m.olusturma,
        })),
        select: { id: true, name: true },
      });
      const musteriKimligi = new Map(musteriler.map((m) => [m.name, m.id]));

      // f) Abonelikler. Bir müşterinin aboneliklerini başlangıç anı ayırt eder.
      const abonelikler = await tx.subscription.createManyAndReturn({
        data: s.abonelikler.map((a) => ({
          tenantId,
          customerId: bul(musteriKimligi, a.musteriAdi, "Müşteri"),
          planId: bul(planKimligi, a.planAdi, "Plan"),
          status: a.iptal ? ("CANCELED" as const) : ("ACTIVE" as const),
          startedAt: a.baslangic,
          currentPeriodEnd: a.donemSonu,
          canceledAt: a.iptal,
          createdAt: a.baslangic,
        })),
        select: { id: true, customerId: true, startedAt: true },
      });
      const abonelikKimligi = new Map(
        abonelikler.map((a) => [`${a.customerId}|${a.startedAt.getTime()}`, a.id])
      );

      // g) Olaylar: her durum değişikliği SUBSCRIPTION_EVENTS tablosuna (iş kuralı).
      await tx.subscriptionEvent.createMany({
        data: s.abonelikler.flatMap((a) => {
          const anahtar = `${bul(musteriKimligi, a.musteriAdi, "Müşteri")}|${a.baslangic.getTime()}`;
          const subscriptionId = bul(abonelikKimligi, anahtar, "Abonelik");
          return [
            { tenantId, subscriptionId, type: "STARTED" as const, createdAt: a.baslangic },
            ...a.yenilemeler.map((t) => ({
              tenantId,
              subscriptionId,
              type: "RENEWED" as const,
              createdAt: t,
            })),
            ...(a.iptal
              ? [{ tenantId, subscriptionId, type: "CANCELED" as const, createdAt: a.iptal }]
              : []),
          ];
        }),
      });

      return { tenantId, yeniden: mevcut !== undefined };
    },
    { maxWait: 20_000, timeout: 60_000 }
  );
}

// ---------- 3. Kontrol özeti (okuma) ----------

function tl(deger: number | null): string {
  return deger === null ? "hesaplanamadı" : `${deger.toLocaleString("tr-TR")} TL`;
}
function yuzde(deger: number | null): string {
  return deger === null
    ? "hesaplanamadı"
    : `%${(deger * 100).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
}

// Kiracı başına sayılar ve dashboard'un göstereceği değerler.
// Hesap, dashboard-verisi.ts ile aynı fonksiyonlarla (metrikler.ts) yapılır.
async function kiraciOzeti(tenantId: string, cac: number): Promise<void> {
  const [kullanici, plan, musteriler, abonelikler, olay] = await Promise.all([
    prisma.user.count({ where: { tenantId } }),
    prisma.plan.count({ where: { tenantId } }),
    prisma.customer.findMany({ where: { tenantId }, select: { isActive: true } }),
    prisma.subscription.findMany({
      where: { tenantId },
      select: {
        customerId: true,
        status: true,
        startedAt: true,
        canceledAt: true,
        currentPeriodEnd: true,
        plan: { select: { price: true, interval: true } },
      },
    }),
    prisma.subscriptionEvent.count({ where: { tenantId } }),
  ]);

  const girdiler: AbonelikGirdisi[] = abonelikler.map((k) => ({
    customerId: k.customerId,
    fiyat: k.plan.price,
    aralik: k.plan.interval,
    status: k.status,
    startedAt: k.startedAt,
    canceledAt: k.canceledAt,
  }));
  const { yil, ay } = turkiyeAyi(simdi);
  const ozet = metrikOzeti(girdiler, ayAraligi(yil, ay), cac);
  const churnler = sonAylar(simdi, 12)
    .map((a) => aylikChurn(girdiler, ayAraligi(a.yil, a.ay)))
    .filter((c): c is number => c !== null);
  const ortalamaChurn =
    churnler.length === 0 ? null : churnler.reduce((t, c) => t + c, 0) / churnler.length;
  // riskli-abonelikler.ts ile aynı koşul: ACTIVE ve dönem sonu 7 günden az kalmış.
  const sinir = simdi.getTime() + RISK_GUN * GUN;
  const riskli = abonelikler.filter(
    (a) => a.status === "ACTIVE" && a.currentPeriodEnd.getTime() < sinir
  ).length;
  const aktifAbonelik = abonelikler.filter((a) => a.status === "ACTIVE").length;
  const pasifMusteri = musteriler.filter((m) => !m.isActive).length;
  const ltvCacMetni =
    ozet.ltvCac === null
      ? "hesaplanamadı"
      : `${ozet.ltvCac.toLocaleString("tr-TR")} (${ltvCacSaglikliMi(ozet.ltvCac) ? "sağlıklı" : "Dikkat"})`;

  console.log(
    `  Kullanıcı ${kullanici} | Plan ${plan} | Müşteri ${musteriler.length} (${musteriler.length - pasifMusteri} aktif, ${pasifMusteri} pasif) | Abonelik ${abonelikler.length} (${aktifAbonelik} aktif, ${abonelikler.length - aktifAbonelik} iptal) | Olay ${olay}`
  );
  console.log(
    `  MRR ${tl(ozet.mrr)} | Bu ay churn ${yuzde(ozet.churn)} | Son 12 ay ort. churn ${yuzde(ortalamaChurn)} | LTV ${tl(ozet.ltv)}`
  );
  console.log(`  CAC ${tl(cac)} | LTV/CAC ${ltvCacMetni} | Riskli abonelik ${riskli}`);
}

// Kiracılar arası bağlantı kontrolü. Kayıtların sahibi YALNIZCA kimlikle (tenant
// filtresi olmadan) okunur ve bağlı olduğu kaydın firmasıyla karşılaştırılır.
// Veritabanındaki birleşik yabancı anahtarlar bunu zaten imkânsız kılar; bu ek bir güvencedir.
// Hepsi 0 ise true döner.
async function kiracilarArasiKontrol(idler: string[]): Promise<boolean> {
  const abonelikler = await prisma.subscription.findMany({
    where: { tenantId: { in: idler } },
    select: { id: true, tenantId: true, customerId: true, planId: true },
  });
  const olaylar = await prisma.subscriptionEvent.findMany({
    where: { tenantId: { in: idler } },
    select: { tenantId: true, subscriptionId: true },
  });
  const [musteriSahipleri, planSahipleri, abonelikSahipleri] = await Promise.all([
    prisma.customer.findMany({
      where: { id: { in: [...new Set(abonelikler.map((a) => a.customerId))] } },
      select: { id: true, tenantId: true },
    }),
    prisma.plan.findMany({
      where: { id: { in: [...new Set(abonelikler.map((a) => a.planId))] } },
      select: { id: true, tenantId: true },
    }),
    prisma.subscription.findMany({
      where: { id: { in: [...new Set(olaylar.map((o) => o.subscriptionId))] } },
      select: { id: true, tenantId: true },
    }),
  ]);
  const sahip = (liste: { id: string; tenantId: string }[]) =>
    new Map(liste.map((k) => [k.id, k.tenantId]));
  const musteriSahibi = sahip(musteriSahipleri);
  const planSahibi = sahip(planSahipleri);
  const abonelikSahibi = sahip(abonelikSahipleri);

  const sonuclar: [string, number][] = [
    [
      "Başka kiracının müşterisine bağlı abonelik",
      abonelikler.filter((a) => musteriSahibi.get(a.customerId) !== a.tenantId).length,
    ],
    [
      "Başka kiracının planına bağlı abonelik",
      abonelikler.filter((a) => planSahibi.get(a.planId) !== a.tenantId).length,
    ],
    [
      "Başka kiracının aboneliğine bağlı olay",
      olaylar.filter((o) => abonelikSahibi.get(o.subscriptionId) !== o.tenantId).length,
    ],
    [
      `Demo olmayan firmalardaki ${DEMO_UZANTI} kullanıcısı`,
      await prisma.user.count({
        where: { email: { endsWith: DEMO_UZANTI }, tenantId: { notIn: idler } },
      }),
    ],
    [
      "Demo firmalardaki demo olmayan kullanıcı",
      await prisma.user.count({
        where: { tenantId: { in: idler }, NOT: { email: { endsWith: DEMO_UZANTI } } },
      }),
    ],
  ];

  console.log("Kiracılar arası kontrol (hepsi 0 olmalı):");
  for (const [ad, sayi] of sonuclar) console.log(`  ${ad}: ${sayi}`);
  const tamam = sonuclar.every(([, sayi]) => sayi === 0);
  console.log(`  Sonuç: ${tamam ? "TAMAM" : "HATA"}`);
  return tamam;
}

// ---------- 4. Çalıştırma ----------

// Hata mesajı için: o an kurulan kiracı ve kurulumu tamamlananlar.
let islenenKiraci = "";
const kurulanlar: { s: KiraciSenaryosu; tenantId: string; yeniden: boolean }[] = [];

async function calistir(): Promise<number> {
  console.log(`Ortam: ${canli ? "CANLI" : "TEST DALI"}`);

  // Parola özetleri işlemden ÖNCE hesaplanır (bcrypt yavaştır, işlem süresini doldurmasın).
  for (const s of senaryolar) {
    islenenKiraci = s.kiraci.ad;
    const ozetler = await Promise.all(s.kullanicilar.map(() => bcrypt.hash(DEMO_PAROLA, 10)));
    const { tenantId, yeniden } = await kiraciyiKur(s, ozetler);
    kurulanlar.push({ s, tenantId, yeniden });
  }
  islenenKiraci = "";

  for (const { s, tenantId, yeniden } of kurulanlar) {
    console.log(`${s.kiraci.ad}: ${yeniden ? "silinip yeniden kuruldu" : "ilk kez kuruldu"}`);
    await kiraciOzeti(tenantId, s.kiraci.cac);
    console.log(`  Giriş: ${s.kullanicilar.map((k) => `${k.eposta} (${k.rol})`).join(", ")}`);
  }
  const tamam = await kiracilarArasiKontrol(kurulanlar.map((k) => k.tenantId));
  console.log("Demo parolası README'de yazılıdır. Riskli liste 7 gün sonra boşalır; seed'i yeniden çalıştırın.");
  return tamam ? 0 : 1;
}

try {
  process.exitCode = await calistir();
} catch (hata) {
  if (hata instanceof Durdur) {
    console.error(`Durduruldu: ${hata.message}`);
  } else {
    // Ayrıntı yazılmaz (adres veya veri sızmasın); yalnızca Prisma hata kodu (ör. P2028).
    const kod = (hata as { code?: unknown })?.code;
    const kodMetni = typeof kod === "string" && /^P\d{4}$/.test(kod) ? ` (hata kodu ${kod})` : "";
    console.error(`Demo verisi kurulamadı${kodMetni}.`);
  }
  if (islenenKiraci) {
    console.error(`"${islenenKiraci}" için hiçbir değişiklik yazılmadı (işlem geri alındı).`);
  }
  if (kurulanlar.length > 0) {
    // Daha önce tamamlanan kiracılar yazılmış durumdadır; betik yeniden çalıştırılınca düzelir.
    console.error(
      `Kurulumu tamamlanan kiracılar: ${kurulanlar.map((k) => k.s.kiraci.ad).join(", ")}.` +
        (islenenKiraci ? "" : " Kontrol özeti okunamadı; betiği yeniden çalıştırın.")
    );
  }
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
