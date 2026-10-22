// TEST VERİSİ YARDIMCISI (yalnızca testlerde ve test dalı betiklerinde kullanılır)
//
// Her test dosyası çalışınca iki sahte firma (A ve B) oluşturur ve testler
// bitince yalnızca BU ÇALIŞMADA oluşturduğu kayıtları siler.
// Gün 9: demo-verisi.ts betiği de firma kimliği bulmak için bu dosyayı kullanır.
//
// İSTİSNA (Gün 6 onayı): Bu dosya ham "prisma" nesnesini kullanır. Firma (Tenant)
// oluşturma ve silme işlemleri tenant filtresinden geçemez, çünkü filtre bunları
// bilerek engeller. kurallar.test.ts yalnızca BU dosyaya bu izni verir.
//
// GÜVENLİK:
// 1. TEST_VERITABANI=evet yoksa veritabanına hiç bağlanmadan durur.
//    Bu işaret yalnızca .env.test içinde vardır (Neon test dalı).
// 2. Silme yalnızca bu çalışmada oluşturulan firma kimlikleriyle yapılır ve
//    firmanın adı bu çalışmanın etiketiyle başlamalıdır. Joker silme yoktur.
// 3. Silmeden sonra hiçbir test firmasının kalmadığı kontrol edilir.

import { randomUUID } from "node:crypto";

// 1. güvence: veritabanına bağlanmadan ÖNCE kontrol.
if (process.env.TEST_VERITABANI !== "evet") {
  throw new Error(
    "TEST_VERITABANI=evet bulunamadı. Veritabanı testleri yalnızca .env.test ile (Neon test dalında) çalışır: npm run test:db"
  );
}

// Kontrol geçildikten SONRA içe aktarılır.
const { prisma } = await import("../lib/db.ts");

// Bu çalışmaya özel etiket. Örnek: "test-3f9a1c2b". Firma adları bununla başlar.
export const CALISMA = `test-${randomUUID().slice(0, 8)}`;

// Test planlarının fiyatı (TL, tam sayı).
export const PLAN_FIYATI = 1000;

// Bu çalışmada oluşturulan firmaların kimlikleri. Silme yalnızca bunlarla yapılır.
const olusturulanFirmaIdleri: string[] = [];

// Bir test firmasının kayıtlarının kimlikleri.
export type TestFirmasi = {
  tenantId: string;
  managerId: string;
  financeId: string;
  abonelikliPlanId: string; // aktif aboneliği olan plan
  bosPlanId: string; // aboneliği olmayan plan
  abonelikliMusteriId: string; // aktif aboneliği olan müşteri
  bosMusteriId: string; // aboneliği olmayan müşteri
  abonelikId: string; // abonelikli müşterinin ACTIVE aboneliği
};

// Bir sahte firma ve içindeki kayıtları oluşturur. etiket: "a" ya da "b".
export async function testFirmasiOlustur(etiket: string): Promise<TestFirmasi> {
  const on = `${CALISMA}-${etiket}`;

  const firma = await prisma.tenant.create({
    data: { name: on },
    select: { id: true },
  });
  // Hemen listeye eklenir: sonraki adımlardan biri hata verse bile temizlenir.
  olusturulanFirmaIdleri.push(firma.id);
  const tenantId = firma.id;

  // Kullanıcılar. passwordHash gerçek bir bcrypt özeti DEĞİLDİR:
  // bu kullanıcılarla giriş yapılamaz, yalnızca test verisi olarak vardır.
  const manager = await prisma.user.create({
    data: {
      tenantId,
      email: `${on}-manager@example.com`,
      name: "Test Yönetici",
      passwordHash: "test-giris-yapilamaz",
      role: "manager",
    },
    select: { id: true },
  });
  const finance = await prisma.user.create({
    data: {
      tenantId,
      email: `${on}-finance@example.com`,
      name: "Test Finans",
      passwordHash: "test-giris-yapilamaz",
      role: "finance",
    },
    select: { id: true },
  });

  const abonelikliPlan = await prisma.plan.create({
    data: { tenantId, name: "Test Abonelikli Plan", price: PLAN_FIYATI, interval: "MONTHLY" },
    select: { id: true },
  });
  const bosPlan = await prisma.plan.create({
    data: { tenantId, name: "Test Boş Plan", price: PLAN_FIYATI, interval: "YEARLY" },
    select: { id: true },
  });

  const abonelikliMusteri = await prisma.customer.create({
    data: { tenantId, name: "Test Abonelikli Müşteri", email: `${on}-musteri1@example.com` },
    select: { id: true },
  });
  const bosMusteri = await prisma.customer.create({
    data: { tenantId, name: "Test Boş Müşteri", email: `${on}-musteri2@example.com` },
    select: { id: true },
  });

  // Aktif abonelik ve "başladı" olayı (uygulamadaki gibi ikisi birlikte).
  const abonelik = await prisma.subscription.create({
    data: {
      tenantId,
      customerId: abonelikliMusteri.id,
      planId: abonelikliPlan.id,
      status: "ACTIVE",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    select: { id: true },
  });
  await prisma.subscriptionEvent.create({
    data: { tenantId, subscriptionId: abonelik.id, type: "STARTED" },
  });

  return {
    tenantId,
    managerId: manager.id,
    financeId: finance.id,
    abonelikliPlanId: abonelikliPlan.id,
    bosPlanId: bosPlan.id,
    abonelikliMusteriId: abonelikliMusteri.id,
    bosMusteriId: bosMusteri.id,
    abonelikId: abonelik.id,
  };
}

// Bu çalışmada oluşturulan firmaları ve içlerindeki her şeyi siler.
export async function testVerisiniTemizle(): Promise<void> {
  if (olusturulanFirmaIdleri.length === 0) return;

  // 2. güvence: yalnızca kimliği listede OLAN ve adı bu çalışmanın etiketiyle başlayan firmalar.
  const firmalar = await prisma.tenant.findMany({
    where: { id: { in: olusturulanFirmaIdleri }, name: { startsWith: CALISMA } },
    select: { id: true },
  });
  const idler = firmalar.map((f) => f.id);
  if (idler.length === 0) return;

  // Silme sırası, tablolar arasındaki bağlara göredir: önce olaylar, en son firmalar.
  const kosul = { tenantId: { in: idler } };
  await prisma.subscriptionEvent.deleteMany({ where: kosul });
  await prisma.subscription.deleteMany({ where: kosul });
  await prisma.customer.deleteMany({ where: kosul });
  await prisma.plan.deleteMany({ where: kosul });
  await prisma.user.deleteMany({ where: kosul });
  await prisma.tenant.deleteMany({ where: { id: { in: idler } } });

  // 3. güvence: gerçekten silindi mi?
  const kalan = await prisma.tenant.count({ where: { id: { in: idler } } });
  if (kalan > 0) {
    throw new Error(`Temizlik tamamlanamadı: ${kalan} test firması kaldı (${CALISMA}).`);
  }
  olusturulanFirmaIdleri.length = 0;
}

// Veritabanı bağlantısını kapatır. Kapatılmazsa Node test bitince beklemede kalır.
export async function baglantiyiKapat(): Promise<void> {
  await prisma.$disconnect();
}

// ---------- Demo betiği yardımcısı (Gün 9) ----------

// Test dalında, verilen e-postayla kayıtlı kullanıcının firma kimliğini bulur.
// Kullanıcı e-postası bütün firmalarda benzersizdir ve firma henüz bilinmediği için
// tenant filtresi kullanılamaz; bu yüzden ham prisma ile bu dosyada durur.
// Yalnızca firma kimliği okunur; parola özeti ve diğer alanlar okunmaz.
// Kullanan: src/test-destek/demo-verisi.ts
export async function kullanicininFirmaKimligi(eposta: string): Promise<string | null> {
  const kullanici = await prisma.user.findUnique({
    where: { email: eposta },
    select: { tenantId: true },
  });
  return kullanici?.tenantId ?? null;
}