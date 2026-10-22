// ROL VE KİRACI TESTLERİ: CAC AYARI (Gün 9)
//
// Ne test edilir? src/lib/cac-ayari.ts içindeki cacKaydetCekirdek.
// Sunucu işleminin (ayarlar/actions.ts) çağırdığı fonksiyonun aynısıdır.
// Tek fark: kullanıcı ve veritabanı nesnesi oturumdan değil, testten verilir.
//
// Not: "A, tenant.update ile B'nin kimliğini verse bile B'yi değiştiremez" kontrolü
// tenant.test.ts içinde zaten var ("A, B'nin firma ayarını (CAC) değiştiremez").
// Burada aynı kural çekirdek fonksiyon düzeyinde test edilir.
//
// Sıra önemlidir: CAC değerini gerçekten değiştiren testler sondadır.
// Test firmaları CAC = 0 (varsayılan) ile oluşturulur.
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
import { cacKaydetCekirdek } from "./cac-ayari.ts";
import { MESAJ } from "./islem.ts";

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

// Kısa yardımcı: firmanın kayıtlı CAC değeri
async function cacOku(db: TenantDb): Promise<number | undefined> {
  return (await db.tenant.findFirst({ select: { cac: true } }))?.cac;
}

describe("finance kullanıcısı", () => {
  test("CAC'yi değiştiremez, kayıt değişmez", async () => {
    const sonuc = await cacKaydetCekirdek({ role: "finance" }, dbA, "5000");
    assert.equal(sonuc.durum, "hata");
    assert.equal(sonuc.mesaj, MESAJ.yetkiYok);
    assert.equal(await cacOku(dbA), 0);
  });
});

describe("manager kullanıcısı: geçersiz girdi", () => {
  test("geçersiz değerler alan hatası verir, kayıt değişmez", async () => {
    for (const girdi of ["", "-5", "12,5", "1.000", "abc", "10000001", null]) {
      const sonuc = await cacKaydetCekirdek({ role: "manager" }, dbA, girdi);
      assert.equal(sonuc.durum, "hata", `"${girdi}" reddedilmeliydi`);
      assert.equal(sonuc.mesaj, MESAJ.formHatali);
      assert.ok(sonuc.alanHatalari?.cac, `"${girdi}" için alan hatası yok`);
    }
    assert.equal(await cacOku(dbA), 0);
  });
});

describe("manager kullanıcısı: başarılı kaydetme", () => {
  test("5000 kaydedilir, B'nin CAC'si değişmez", async () => {
    const sonuc = await cacKaydetCekirdek({ role: "manager" }, dbA, "5000");
    assert.equal(sonuc.durum, "basarili");
    assert.equal(sonuc.mesaj, "CAC 5.000 TL olarak kaydedildi.");
    assert.equal(await cacOku(dbA), 5000);
    assert.equal(await cacOku(dbB), 0);
  });

  test("0 ile sıfırlanır ('CAC girilmedi')", async () => {
    const sonuc = await cacKaydetCekirdek({ role: "manager" }, dbA, "0");
    assert.equal(sonuc.durum, "basarili");
    assert.equal(sonuc.mesaj, "CAC sıfırlandı. LTV/CAC oranı, CAC girilene kadar hesaplanmaz.");
    assert.equal(await cacOku(dbA), 0);
  });
});

describe("kiracı izolasyonu", () => {
  test("A ve B kendi CAC değerlerini bağımsız tutar", async () => {
    await cacKaydetCekirdek({ role: "manager" }, dbA, "7000");
    await cacKaydetCekirdek({ role: "manager" }, dbB, "3000");
    assert.equal(await cacOku(dbA), 7000);
    assert.equal(await cacOku(dbB), 3000);
  });
});