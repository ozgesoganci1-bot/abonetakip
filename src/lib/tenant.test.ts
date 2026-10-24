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

  // Gün 12 (bulgu B6, issue #24): "where" içinde başka bir firmanın kimliği istenirse
  // kimlik artık oturumdaki firmayla EZİLMEZ; ikisi AND içinde birlikte uygulanır ve
  // sonuç "bulunamadı" olur. Eskiden bu istekler sessizce A'nın kendi kaydına dönüyordu.

  test("B'nin kimliğiyle okuma: bulunamaz (findFirst, findUnique, findMany, count)", async () => {
    assert.equal(await dbA.tenant.findFirst({ where: { id: B.tenantId } }), null);
    assert.equal(await dbA.tenant.findUnique({ where: { id: B.tenantId } }), null);
    assert.deepEqual(await dbA.tenant.findMany({ where: { id: B.tenantId } }), []);
    assert.equal(await dbA.tenant.count({ where: { id: B.tenantId } }), 0);
  });

  test("B'nin kimliğiyle findFirstOrThrow ve findUniqueOrThrow reddedilir", async () => {
    await assert.rejects(dbA.tenant.findFirstOrThrow({ where: { id: B.tenantId } }));
    await assert.rejects(dbA.tenant.findUniqueOrThrow({ where: { id: B.tenantId } }));
  });

  test("kendi kimliğiyle okuma ve güncelleme çalışır (cac-ayari.ts akışı)", async () => {
    const firma = await dbA.tenant.findUnique({
      where: { id: A.tenantId },
      select: { id: true },
    });
    assert.equal(firma?.id, A.tenantId);

    await dbA.tenant.update({
      where: { id: A.tenantId },
      data: { cac: 1234 },
      select: { id: true },
    });
    assert.equal((await dbA.tenant.findFirst({ select: { cac: true } }))?.cac, 1234);

    // Sonraki testler A'nın CAC'sinin 0 olduğunu varsayar: geri alınır.
    await dbA.tenant.update({
      where: { id: A.tenantId },
      data: { cac: 0 },
      select: { id: true },
    });
    assert.equal((await dbA.tenant.findFirst({ select: { cac: true } }))?.cac, 0);
  });

  test("A, B'nin firma ayarını (CAC) değiştiremez: istek reddedilir, iki firma da değişmez", async () => {
    await assert.rejects(
      dbA.tenant.update({ where: { id: B.tenantId }, data: { cac: 999 } })
    );
    // Eskiden bu istek A'nın kendi kaydına uygulanıyordu. Artık ikisi de değişmez.
    assert.equal((await dbA.tenant.findFirst({ select: { cac: true } }))?.cac, 0);
    assert.equal((await dbB.tenant.findFirst({ select: { cac: true } }))?.cac, 0);
  });

  test("kimlik nesne olarak verilirse (in, equals, not) oturumdaki firmayla birlikte uygulanır", async () => {
    // in: B'yi de içeren liste yalnızca A'yı döner; yalnızca B'yi içeren liste boş döner.
    const ikisi = await dbA.tenant.findMany({
      where: { id: { in: [A.tenantId, B.tenantId] } },
      select: { id: true },
    });
    assert.deepEqual(ikisi.map((f) => f.id), [A.tenantId]);
    assert.deepEqual(await dbA.tenant.findMany({ where: { id: { in: [B.tenantId] } } }), []);

    // equals: B bulunamaz, A bulunur.
    assert.equal(await dbA.tenant.findFirst({ where: { id: { equals: B.tenantId } } }), null);
    const esit = await dbA.tenant.findFirst({
      where: { id: { equals: A.tenantId } },
      select: { id: true },
    });
    assert.equal(esit?.id, A.tenantId);

    // not: "B olmayan" A'yı bulur; "A olmayan" hiçbirini bulmaz (B'ye kaçmaz).
    const bOlmayan = await dbA.tenant.findFirst({
      where: { id: { not: B.tenantId } },
      select: { id: true },
    });
    assert.equal(bOlmayan?.id, A.tenantId);
    assert.equal(await dbA.tenant.findFirst({ where: { id: { not: A.tenantId } } }), null);
    assert.equal(await dbA.tenant.count({ where: { id: { not: A.tenantId } } }), 0);
  });

  test("koşulda önceden bulunan AND korunur", async () => {
    const adA = `${CALISMA}-a`;
    const adB = `${CALISMA}-b`;

    // id yokken: AND aynen uygulanır.
    const aBulundu = await dbA.tenant.findFirst({ where: { AND: { name: adA } }, select: { id: true } });
    assert.equal(aBulundu?.id, A.tenantId);
    assert.equal(await dbA.tenant.findFirst({ where: { AND: { name: adB } } }), null);

    // id varken: önceki AND (tek nesne ya da liste) silinmez, yeni koşul eklenir.
    // AND silinseydi "B olmayan" koşulu A'yı bulurdu.
    assert.equal(
      await dbA.tenant.findFirst({ where: { id: { not: B.tenantId }, AND: { name: adB } } }),
      null
    );
    assert.equal(
      await dbA.tenant.findFirst({ where: { id: { not: B.tenantId }, AND: [{ name: adB }] } }),
      null
    );
    assert.equal(await dbA.tenant.findFirst({ where: { id: B.tenantId, AND: { name: adA } } }), null);
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

// Gün 7 (inceleme bulgusu D2): iş kuralına göre müşteri, plan, abonelik ve olay
// kayıtları silinmez. Filtre bu tablolarda silmeyi veritabanına gitmeden durdurur.
// Testler A'nın KENDİ kayıtlarıyla yapılır: kendi firmasında bile silme yasaktır.
// Koşullar dar tutulur (tek kimlik): koruma bozuksa bile zarar test verisiyle sınırlı kalır.
describe("Silme koruması", () => {
  test("müşteri, plan, abonelik ve olaylarda deleteMany reddedilir, kayıtlar yerinde kalır", async () => {
    await assert.rejects(
      dbA.customer.deleteMany({ where: { id: A.bosMusteriId } }),
      /"Customer" tablosunda "deleteMany" işlemine izin verilmez: kayıtlar silinmez, pasife alınır/
    );
    await assert.rejects(
      dbA.plan.deleteMany({ where: { id: A.bosPlanId } }),
      /"Plan" tablosunda "deleteMany" işlemine izin verilmez: kayıtlar silinmez, pasife alınır/
    );
    await assert.rejects(
      dbA.subscription.deleteMany({ where: { id: A.abonelikId } }),
      /"Subscription" tablosunda "deleteMany" işlemine izin verilmez: abonelikler silinmez, iptal edilir/
    );
    await assert.rejects(
      dbA.subscriptionEvent.deleteMany({ where: { subscriptionId: A.abonelikId } }),
      /"SubscriptionEvent" tablosunda "deleteMany" işlemine izin verilmez: olay kayıtları silinmez/
    );

    // Etki kontrolü: kayıtların hepsi hâlâ yerinde.
    assert.equal(await dbA.customer.count({ where: { id: A.bosMusteriId } }), 1);
    assert.equal(await dbA.plan.count({ where: { id: A.bosPlanId } }), 1);
    assert.equal(await dbA.subscription.count({ where: { id: A.abonelikId } }), 1);
    assert.equal(
      await dbA.subscriptionEvent.count({ where: { subscriptionId: A.abonelikId } }),
      1
    );
  });

  test("tek kayıt silme (delete) de reddedilir, kayıtlar yerinde kalır", async () => {
    const olay = await dbA.subscriptionEvent.findFirst({
      where: { subscriptionId: A.abonelikId },
      select: { id: true },
    });
    assert.ok(olay, "Test verisinde A'nın başlangıç olayı bulunamadı.");

    await assert.rejects(
      dbA.customer.delete({ where: { id: A.bosMusteriId } }),
      /kayıtlar silinmez, pasife alınır/
    );
    await assert.rejects(
      dbA.plan.delete({ where: { id: A.bosPlanId } }),
      /kayıtlar silinmez, pasife alınır/
    );
    await assert.rejects(
      dbA.subscription.delete({ where: { id: A.abonelikId } }),
      /abonelikler silinmez, iptal edilir/
    );
    await assert.rejects(
      dbA.subscriptionEvent.delete({ where: { id: olay.id } }),
      /olay kayıtları silinmez/
    );

    assert.equal(await dbA.customer.count({ where: { id: A.bosMusteriId } }), 1);
    assert.equal(await dbA.plan.count({ where: { id: A.bosPlanId } }), 1);
    assert.equal(await dbA.subscription.count({ where: { id: A.abonelikId } }), 1);
    assert.equal(await dbA.subscriptionEvent.count({ where: { id: olay.id } }), 1);
  });

  test("kullanıcı (User) tablosunda silme filtre tarafından engellenmez", async () => {
    // Var olmayan bir kimlikle denenir: hiçbir kullanıcı silinmez, yalnızca
    // filtrenin bu işlemi durdurmadığı görülür.
    const sonuc = await dbA.user.deleteMany({ where: { id: "olmayan-kullanici" } });
    assert.equal(sonuc.count, 0);
  });
});