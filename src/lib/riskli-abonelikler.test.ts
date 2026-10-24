// RİSKLİ ABONELİK SORGUSU TESTLERİ (Gün 10, issue #6)
//
// Veri: iki sahte firma (bkz. test-destek/veri.ts), testler bitince silinir.
// Ek kayıtlar ham prisma ile değil dbA / dbB (tenant filtresi) üzerinden oluşturulur.
// Bir müşterinin aynı anda tek ACTIVE aboneliği olabildiği için her durum için
// yeni bir müşteri açılır.
// "Şimdi" bir kez alınır ve bütün testlerde aynı değer kullanılır.
// Çalıştırmak için: npm run test:db

import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
// Önce test verisi yardımcısı: TEST_VERITABANI kontrolü onun içinde yapılır.
import {
  testFirmasiOlustur,
  testVerisiniTemizle,
  baglantiyiKapat,
  type TestFirmasi,
} from "../test-destek/veri.ts";
import { tenantaBagliDb, type TenantDb } from "./tenant.ts";
import { riskliAbonelikler } from "./riskli-abonelikler.ts";

const GUN = 24 * 60 * 60 * 1000;

let A: TestFirmasi;
let B: TestFirmasi;
let dbA: TenantDb;
let dbB: TenantDb;
let SIMDI: Date;

// Kayıt kimlikleri
let a3Gun: string;
let aGecmis: string;
let a7Gun: string;
let a7GunEksi1Ms: string;
let aYenilenmis: string;
let aIptal: string;
let b3Gun: string;

function sonra(ms: number): Date {
  return new Date(SIMDI.getTime() + ms);
}

// Yeni müşteri ve onun aboneliğini oluşturur, abonelik kimliğini döner.
async function aboneOlustur(
  db: TenantDb,
  firma: TestFirmasi,
  ad: string,
  bitis: Date,
  durum: "ACTIVE" | "CANCELED" = "ACTIVE"
): Promise<string> {
  const musteri = await db.customer.create({
    data: { tenantId: firma.tenantId, name: `Test Risk ${ad}` },
    select: { id: true },
  });
  const abonelik = await db.subscription.create({
    data: {
      tenantId: firma.tenantId,
      customerId: musteri.id,
      planId: firma.abonelikliPlanId,
      status: durum,
      currentPeriodEnd: bitis,
      canceledAt: durum === "CANCELED" ? SIMDI : null,
    },
    select: { id: true },
  });
  return abonelik.id;
}

before(async () => {
  SIMDI = new Date();
  A = await testFirmasiOlustur("a");
  B = await testFirmasiOlustur("b");
  dbA = tenantaBagliDb(A.tenantId);
  dbB = tenantaBagliDb(B.tenantId);

  a3Gun = await aboneOlustur(dbA, A, "3 gün", sonra(3 * GUN));
  aGecmis = await aboneOlustur(dbA, A, "geçmiş", sonra(-2 * GUN));
  a7Gun = await aboneOlustur(dbA, A, "tam 7 gün", sonra(7 * GUN));
  a7GunEksi1Ms = await aboneOlustur(dbA, A, "7 gün eksi 1 ms", sonra(7 * GUN - 1));
  aIptal = await aboneOlustur(dbA, A, "iptal", sonra(3 * GUN), "CANCELED");

  // Yenilenmiş: önce 3 gün kalmış, sonra uygulamadaki gibi (abonelikYenile)
  // bitiş tarihi koşulda verilerek ileri taşınmış.
  const eskiBitis = sonra(3 * GUN);
  aYenilenmis = await aboneOlustur(dbA, A, "yenilenmiş", eskiBitis);
  const yenilendi = await dbA.subscription.updateMany({
    where: { id: aYenilenmis, status: "ACTIVE", currentPeriodEnd: eskiBitis },
    data: { currentPeriodEnd: sonra(33 * GUN) },
  });
  assert.equal(yenilendi.count, 1, "Test verisi: yenileme uygulanamadı.");

  b3Gun = await aboneOlustur(dbB, B, "B 3 gün", sonra(3 * GUN));
});

after(async () => {
  try {
    await testVerisiniTemizle();
  } finally {
    await baglantiyiKapat();
  }
});

describe("Riskli abonelik listesi (issue #6)", () => {
  test("bitişe 7 günden az kalan ve süresi geçmiş ACTIVE abonelikler girer; diğerleri girmez", async () => {
    const idler = (await riskliAbonelikler(dbA, SIMDI)).map((r) => r.id);

    assert.ok(idler.includes(a3Gun), "3 gün kalan abonelik listede olmalı.");
    assert.ok(idler.includes(aGecmis), "Süresi geçmiş ACTIVE abonelik listede olmalı.");
    assert.ok(idler.includes(a7GunEksi1Ms), "7 günden 1 ms az kalan listede olmalı.");

    assert.ok(!idler.includes(a7Gun), "Tam 7 gün kalan listede OLMAMALI (sınır).");
    assert.ok(!idler.includes(A.abonelikId), "30 gün kalan abonelik listede olmamalı.");
    assert.ok(!idler.includes(aYenilenmis), "Yenilenmiş abonelik listede olmamalı.");
    assert.ok(!idler.includes(aIptal), "İptal edilmiş abonelik listede olmamalı.");
  });

  test("süresi geçmiş kayıt 'Süresi geçmiş' etiketi alır ve listenin başında yer alır", async () => {
    const liste = await riskliAbonelikler(dbA, SIMDI);

    const gecmis = liste.find((r) => r.id === aGecmis);
    assert.ok(gecmis);
    assert.equal(gecmis.etiket.metin, "Süresi geçmiş");
    assert.equal(gecmis.etiket.gecmis, true);

    const uc = liste.find((r) => r.id === a3Gun);
    assert.ok(uc);
    assert.equal(uc.etiket.metin, "3 gün kaldı");
    assert.equal(uc.etiket.gecmis, false);

    // Bitişe göre artan sıra: geçmiş olan 3 günlükten önce gelir.
    const idler = liste.map((r) => r.id);
    assert.ok(idler.indexOf(aGecmis) < idler.indexOf(a3Gun));
  });

  test("A'nın listesinde B'nin kaydı yok, B'nin listesinde var", async () => {
    const idlerA = (await riskliAbonelikler(dbA, SIMDI)).map((r) => r.id);
    const idlerB = (await riskliAbonelikler(dbB, SIMDI)).map((r) => r.id);

    assert.ok(!idlerA.includes(b3Gun), "A'nın listesinde B'nin kaydı var: tenant sızıntısı.");
    assert.ok(idlerB.includes(b3Gun), "Karşılaştırma: B'nin kendi listesinde kaydı olmalı.");
    assert.ok(!idlerB.includes(a3Gun), "B'nin listesinde A'nın kaydı var: tenant sızıntısı.");
  });

  test("müşteri ve plan adı kendi firmasının kaydından gelir", async () => {
    const kayit = (await riskliAbonelikler(dbA, SIMDI)).find((r) => r.id === a3Gun);
    assert.ok(kayit);
    assert.equal(kayit.musteriAdi, "Test Risk 3 gün");
    assert.equal(kayit.planAdi, "Test Abonelikli Plan");
  });
});