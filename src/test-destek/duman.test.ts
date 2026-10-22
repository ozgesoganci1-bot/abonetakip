// DUMAN TESTİ (Gün 6, Adım 2)
//
// Amaç: Test altyapısının çalıştığını görmek. Bu test hiçbir kayıt EKLEMEZ,
// DEĞİŞTİRMEZ, SİLMEZ. Yalnızca var olmayan bir firma adına iki sayım yapar ve
// sonucun 0 olduğunu kontrol eder.
//
// Çalıştırmak için:
//   node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test src/test-destek/duman.test.ts

import { test, after } from "node:test";
import assert from "node:assert/strict";

// KORUMA: .env.test yüklenmediyse veritabanına hiç bağlanmadan dur.
// TEST_VERITABANI=evet yalnızca .env.test içinde vardır, canlı .env içinde yoktur.
if (process.env.TEST_VERITABANI !== "evet") {
  throw new Error(
    "TEST_VERITABANI=evet bulunamadı. Testler yalnızca .env.test ile (Neon test dalında) çalışır."
  );
}

// Koruma geçildikten SONRA içe aktarılır: db.ts yüklenince veritabanı nesnesi oluşur.
const { tenantaBagliDb } = await import("../lib/tenant.ts");

// Gerçekte var olmayan bir firma kimliği. Bu kimliğe ait hiçbir kayıt olamaz.
const OLMAYAN_FIRMA = "dumantestiolmayanfirma";
const db = tenantaBagliDb(OLMAYAN_FIRMA);

// Testler bitince bağlantıyı kapat. Kapatılmazsa Node beklemede kalır.
after(async () => {
  await db.$disconnect();
});

test("tenant.ts, auth.ts, db.ts ve Prisma istemcisi Node ile yüklenebiliyor", () => {
  assert.equal(typeof tenantaBagliDb, "function");
});

test("var olmayan firma adına müşteri sayısı 0 (bağlantı ve tenant filtresi çalışıyor)", async () => {
  const sayi = await db.customer.count();
  assert.equal(sayi, 0);
});

test("var olmayan firma adına firma tablosunda hiçbir kayıt görünmez", async () => {
  const sayi = await db.tenant.count();
  assert.equal(sayi, 0);
});