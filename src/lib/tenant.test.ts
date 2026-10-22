// KİRACI İZOLASYONU TESTLERİ (Gün 6)
//
// Ne test edilir? src/lib/tenant.ts içindeki tenant filtresi. Uygulamadaki bütün
// veri sorguları bu filtreden geçer (bunu kurallar.test.ts kontrol eder).
// Buradaki testler, sunucu işlemlerinin (actions.ts) kullandığı sorgu biçimlerinin
// aynısını "A firmasının kullanıcısı" gibi çalıştırır ve B firmasının kayıtlarına
// ulaşılamadığını gösterir.
//
// dbA: A firmasına bağlı veritabanı nesnesi (uygulamada getTenantDb() bunu üretir).
// dbB: Yalnızca kontrol için. "B'nin kaydı gerçekten değişmedi mi?" sorusuna bakar.
//
// Veri: iki sahte firma oluşturulur, testler bitince silinir (bkz. test-destek/veri.ts).
// Çalıştırmak için: npm run test:db

import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
// Önce test verisi yardımcısı: TEST_VERITABANI kontrolü onun içinde yapılır.
import {
  CALISMA,
  PLAN_FIYATI,
  testFirmasiOlustur,
  testVerisiniTemizle,
  baglantiyiKapat,
  type TestFirmasi,
} from "../test-destek/veri.ts";
import { tenantaBagliDb, type TenantDb } from "./tenant.ts";
import { aktifAbonelikVarMi } from "./abonelik-kontrol.ts";

let A: TestFirmasi;
let B: TestFirmasi;
let dbA: TenantDb;
let dbB: TenantDb;

before(async () => {
  A = await testFirmasiOlustur("a");
  B = await testFirmasiOlustur("b");
  dbA = tenantaBagliDb(A.tenantId);
  dbB = tenantaBagliDb(B.tenantId);
});

after(async () => {
  try {
    await testVerisiniTemizle();
  } finally {
    await baglantiyiKapat();
  }
});

describe("Müşteriler", () => {
  test("liste yalnızca A'nın müşterilerini getirir", async () => {
    const liste = await dbA.customer.findMany({ select: { id: true, tenantId: true } });
    const idler = liste.map((m) => m.id);
    assert.ok(liste.every((m) => m.tenantId === A.tenantId), "Listede başka firmanın kaydı var.");
    assert.ok(idler.includes(A.abonelikliMusteriId));
    assert.ok(!idler.includes(B.abonelikliMusteriId));
    assert.ok(!idler.includes(B.bosMusteriId));
  });

  test("B'nin müşterisi kimlikle aranınca bulunamaz (findFirst ve findUnique)", async () => {
    assert.equal(await dbA.customer.findFirst({ where: { id: B.bosMusteriId } }), null);
    assert.equal(await dbA.customer.findUnique({ where: { id: B.bosMusteriId } }), null);
  });

  test("B'nin müşterisi güncellenemez ve pasife alınamaz, kaydı değişmez", async () => {
    // musteriGuncelle ve pasife alma işlemlerinin kullandığı sorgu biçimi.
    const ad = await dbA.customer.updateMany({
      where: { id: B.bosMusteriId },
      data: { name: "degistirildi" },
    });
    const pasif = await dbA.customer.updateMany({
      where: { id: B.bosMusteriId, isActive: true },
      data: { isActive: false },
    });
    assert.equal(ad.count, 0);
    assert.equal(pasif.count, 0);

    const kayit = await dbB.customer.findFirst({
      where: { id: B.bosMusteriId },
      select: { name: true, isActive: true },
    });
    assert.ok(kayit, "B'nin müşterisi kaybolmuş.");
    assert.notEqual(kayit.name, "degistirildi");
    assert.equal(kayit.isActive, true);
  });

  test("eklerken gönderilen B tenantId'si yok sayılır, kayıt A'ya yazılır", async () => {
    const yeni = await dbA.customer.create({
      data: { tenantId: B.tenantId, name: "Test Yanlış Firma Denemesi" },
      select: { id: true, tenantId: true },
    });
    assert.equal(yeni.tenantId, A.tenantId);
    assert.equal(await dbB.customer.findFirst({ where: { id: yeni.id } }), null);
  });
});

describe("Planlar", () => {
  test("liste yalnızca A'nın planlarını getirir", async () => {
    const liste = await dbA.plan.findMany({ select: { id: true, tenantId: true } });
    const idler = liste.map((p) => p.id);
    assert.ok(liste.every((p) => p.tenantId === A.tenantId), "Listede başka firmanın kaydı var.");
    assert.ok(!idler.includes(B.abonelikliPlanId));
    assert.ok(!idler.includes(B.bosPlanId));
  });

  test("B'nin planı kimlikle aranınca bulunamaz", async () => {
    assert.equal(await dbA.plan.findFirst({ where: { id: B.bosPlanId } }), null);
    assert.equal(await dbA.plan.findUnique({ where: { id: B.bosPlanId } }), null);
  });

  test("B'nin planı güncellenemez ve pasife alınamaz, kaydı değişmez", async () => {
    const sonuc = await dbA.plan.updateMany({
      where: { id: B.bosPlanId },
      data: { price: 1, isActive: false },
    });
    assert.equal(sonuc.count, 0);

    const kayit = await dbB.plan.findFirst({
      where: { id: B.bosPlanId },
      select: { price: true, isActive: true },
    });
    assert.ok(kayit, "B'nin planı kaybolmuş.");
    assert.equal(kayit.price, PLAN_FIYATI);
    assert.equal(kayit.isActive, true);
  });
});

describe("Abonelikler ve olaylar", () => {
  test("liste yalnızca A'nın aboneliklerini getirir", async () => {
    const liste = await dbA.subscription.findMany({ select: { id: true, tenantId: true } });
    assert.ok(liste.every((s) => s.tenantId === A.tenantId), "Listede başka firmanın kaydı var.");
    assert.ok(!liste.some((s) => s.id === B.abonelikId));
  });

  test("B'nin aboneliği kimlikle aranınca bulunamaz", async () => {
    // abonelikYenile işlemindeki sorgu biçimi (plana iç içe bakış dahil).
    const abonelik = await dbA.subscription.findFirst({
      where: { id: B.abonelikId },
      select: { status: true, plan: { select: { interval: true } } },
    });
    assert.equal(abonelik, null);
  });

  test("işlem (transaction) içinde de B'nin aboneliği iptal edilemez ve yenilenemez", async () => {
    // Tenant filtresinin $transaction içindeki "tx" sorgularına da uygulandığını gösterir.
    const iptal = await dbA.$transaction(async (tx) =>
      tx.subscription.updateMany({
        where: { id: B.abonelikId, status: "ACTIVE" },
        data: { status: "CANCELED", canceledAt: new Date() },
      })
    );
    const yenile = await dbA.$transaction(async (tx) =>
      tx.subscription.updateMany({
        where: { id: B.abonelikId, status: "ACTIVE" },
        data: { currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      })
    );
    assert.equal(iptal.count, 0);
    assert.equal(yenile.count, 0);

    const kayit = await dbB.subscription.findFirst({
      where: { id: B.abonelikId },
      select: { status: true },
    });
    assert.equal(kayit?.status, "ACTIVE");
  });

  test("A adına B'nin müşterisi ve planıyla abonelik oluşturulamaz (veritabanı reddeder)", async () => {
    await assert.rejects(
      dbA.subscription.create({
        data: {
          tenantId: A.tenantId,
          customerId: B.bosMusteriId,
          planId: B.bosPlanId,
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
    );
    // B'nin boş müşterisinin hâlâ hiç aboneliği yok.
    assert.equal(await dbB.subscription.count({ where: { customerId: B.bosMusteriId } }), 0);
  });

  test("A adına B'nin aboneliğine olay yazılamaz (veritabanı reddeder)", async () => {
    await assert.rejects(
      dbA.subscriptionEvent.create({
        data: { tenantId: A.tenantId, subscriptionId: B.abonelikId, type: "RENEWED" },
      })
    );
    // B'nin aboneliğinde yalnızca başlangıç olayı var.
    assert.equal(await dbB.subscriptionEvent.count({ where: { subscriptionId: B.abonelikId } }), 1);
  });

  test("aktifAbonelikVarMi, A adına sorulunca B'nin aboneliklerini saymaz", async () => {
    assert.equal(await aktifAbonelikVarMi({ musteriId: B.abonelikliMusteriId }, dbA), false);
    assert.equal(await aktifAbonelikVarMi({ planId: B.abonelikliPlanId }, dbA), false);
    // Karşılaştırma: B adına sorulunca aynı kayıtlar sayılır (test verisi doğru mu?).
    assert.equal(await aktifAbonelikVarMi({ musteriId: B.abonelikliMusteriId }, dbB), true);
    assert.equal(await aktifAbonelikVarMi({ planId: B.abonelikliPlanId }, dbB), true);
  });
});

describe("Firma tablosu", () => {
  test("A yalnızca kendi firmasını görür", async () => {
    const firmalar = await dbA.tenant.findMany({ select: { id: true } });
    assert.deepEqual(firmalar.map((f) => f.id), [A.tenantId]);
  });

  test("A, B'nin firma ayarını (CAC) değiştiremez", async () => {
    // Not: filtre "where" içindeki kimliği oturumdaki firmayla değiştirir.
    // Bu yüzden bu istek B'ye değil A'nın kendi kaydına uygulanır. Önemli olan B'nin değişmemesi.
    // (Bilinen davranış, issue olarak kayıtlı: Ayarlar sayfası yazılırken ele alınacak.)
    await dbA.tenant.update({ where: { id: B.tenantId }, data: { cac: 999 } });
    const b = await dbB.tenant.findFirst({ select: { cac: true } });
    assert.equal(b?.cac, 0);
  });

  test("firma eklenemez ve silinemez", async () => {
    await assert.rejects(
      dbA.tenant.create({ data: { name: `${CALISMA}-sizinti` } }),
      /izin verilmez/
    );
    await assert.rejects(dbA.tenant.deleteMany({}), /izin verilmez/);
  });
});

describe("Filtre korumaları", () => {
  test("güncelleme verisinde tenantId varsa işlem durdurulur", async () => {
    await assert.rejects(
      dbA.customer.updateMany({
        where: { id: A.bosMusteriId },
        data: { tenantId: B.tenantId },
      }),
      /tenantId değiştirilemez/
    );
    assert.notEqual(await dbA.customer.findFirst({ where: { id: A.bosMusteriId } }), null);
  });

  // Gün 6 düzeltmesi (beyaz liste): ekleme ve güncellemede yalnızca tablonun kendi
  // sütunları yazılabilir. Aşağıdaki üç test, ilişki alanlarının reddedildiğini gösterir.

  test("ilişki alanıyla güncelleme reddedilir (tenant: connect)", async () => {
    await assert.rejects(
      dbA.customer.update({
        where: { id: A.bosMusteriId },
        data: { tenant: { connect: { id: B.tenantId } } },
      }),
      /"tenant" alanı bu işlemde kullanılamaz/
    );
  });

  test("ilişki alanıyla ekleme reddedilir (tenant: connect), hiçbir firmada kayıt oluşmaz", async () => {
    const ad = "Test İlişkili Ekleme Denemesi";
    await assert.rejects(
      dbA.customer.create({
        data: { name: ad, tenant: { connect: { id: B.tenantId } } },
      }),
      /"tenant" alanı bu işlemde kullanılamaz/
    );
    assert.equal(await dbA.customer.count({ where: { name: ad } }), 0);
    assert.equal(await dbB.customer.count({ where: { name: ad } }), 0);
  });

  test("iç içe yazma reddedilir (subscriptions: connect), B'nin aboneliği yerinde kalır", async () => {
    // Saldırı örneği: B'nin aboneliğini A'nın müşterisine bağlamaya çalışmak.
    await assert.rejects(
      dbA.customer.update({
        where: { id: A.bosMusteriId },
        data: { subscriptions: { connect: { id: B.abonelikId } } },
      }),
      /"subscriptions" alanı bu işlemde kullanılamaz/
    );
    const kayit = await dbB.subscription.findFirst({
      where: { id: B.abonelikId },
      select: { customerId: true },
    });
    assert.equal(kayit?.customerId, B.abonelikliMusteriId);
  });

  // 11. test (Gün 6'da açığı bulan test): ilk çalıştırmada BAŞARISIZ oldu ve kaydın
  // başka firmaya taşınabildiğini gösterdi. tenant.ts düzeltmesinden sonra geçer.
  // Etkiyi kontrol eder: hata verse de vermese de kayıt A'da kalmalı.
  test("kayıt ilişki üzerinden (tenant: connect) başka firmaya taşınamaz", async () => {
    try {
      await dbA.customer.update({
        where: { id: A.bosMusteriId },
        data: { tenant: { connect: { id: B.tenantId } } },
      });
    } catch {
      // Düzeltmeden sonra beklenen: işlem reddedilir. Amaç kaydın taşınmaması.
    }
    const adaKaldi = await dbA.customer.findFirst({ where: { id: A.bosMusteriId } });
    const bye = await dbB.customer.findFirst({ where: { id: A.bosMusteriId } });
    assert.notEqual(adaKaldi, null, "A'nın müşterisi A'da görünmüyor: kayıt taşınmış olabilir.");
    assert.equal(bye, null, "A'nın müşterisi B'de görünüyor: kayıt başka firmaya taşındı.");
  });
});