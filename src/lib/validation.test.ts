// DOĞRULAMA BİRİM TESTİ (Gün 9)
//
// Çalıştırmak için: npm test
// Veritabanı gerekmez.
// İki amacı var:
//   1. Gün 9'da fiyat kontrolü ortak bir iç fonksiyona taşındı. Fiyat mesajlarının
//      Gün 4'teki hâliyle HARFİ HARFİNE aynı kaldığını kilitler.
//   2. Yeni CAC kontrolünü test eder: fiyatla aynı kurallar, tek fark 0 kabul edilir.

import { test } from "node:test";
import assert from "node:assert/strict";
import { fiyatDogrula, cacDogrula, type Sonuc } from "./validation.ts";

// Sonuç başarılıysa değeri döner, değilse testi durdurur.
function deger(sonuc: Sonuc<number>): number {
  assert.ok(sonuc.ok, `başarılı olmalıydı, hata geldi: ${sonuc.ok ? "" : sonuc.hata}`);
  return sonuc.deger;
}

// Sonuç hatalıysa mesajı döner, değilse testi durdurur.
function hata(sonuc: Sonuc<number>): string {
  assert.ok(!sonuc.ok, "hata vermeliydi, başarılı oldu");
  return sonuc.hata;
}

// ---------- Fiyat (mesajlar Gün 4'teki gibi kalmalı) ----------

test("fiyat: geçerli tam sayılar kabul edilir", () => {
  assert.equal(deger(fiyatDogrula("1000")), 1000);
  assert.equal(deger(fiyatDogrula("  1000  ")), 1000); // baştaki/sondaki boşluk silinir
  assert.equal(deger(fiyatDogrula("10000000")), 10_000_000); // üst sınır dahil
});

test("fiyat: 0 ve negatif reddedilir (mesaj değişmedi)", () => {
  assert.equal(hata(fiyatDogrula("0")), "Fiyat 0'dan büyük olmalıdır.");
  assert.equal(hata(fiyatDogrula("-5")), "Fiyat 0'dan büyük olmalıdır.");
});

test("fiyat: boş, ayıraçlı, rakam dışı ve çok büyük değerler (mesajlar değişmedi)", () => {
  assert.equal(hata(fiyatDogrula("")), "Fiyat boş bırakılamaz.");
  assert.equal(hata(fiyatDogrula(null)), "Fiyat boş bırakılamaz.");
  const ayiracMesaji =
    "Fiyatı nokta veya virgül kullanmadan, tam sayı olarak yazın (ör. 1000). Kuruş girilmez.";
  assert.equal(hata(fiyatDogrula("12,5")), ayiracMesaji);
  assert.equal(hata(fiyatDogrula("1.000")), ayiracMesaji);
  assert.equal(hata(fiyatDogrula("abc")), "Fiyat yalnızca rakamlardan oluşmalıdır.");
  assert.equal(hata(fiyatDogrula("10000001")), "Fiyat en fazla 10.000.000 TL olabilir.");
  assert.equal(hata(fiyatDogrula("12345678901")), "Fiyat en fazla 10.000.000 TL olabilir.");
});

// ---------- CAC ----------

test("CAC: 0 kabul edilir ('girilmedi' anlamında)", () => {
  assert.equal(deger(cacDogrula("0")), 0);
  assert.equal(deger(cacDogrula("00")), 0);
});

test("CAC: geçerli tam sayılar kabul edilir", () => {
  assert.equal(deger(cacDogrula("5000")), 5000);
  assert.equal(deger(cacDogrula("  5000  ")), 5000);
  assert.equal(deger(cacDogrula("10000000")), 10_000_000); // üst sınır dahil
});

test("CAC: boş, negatif, ayıraçlı, rakam dışı ve çok büyük değerler reddedilir", () => {
  assert.equal(hata(cacDogrula("")), "CAC boş bırakılamaz. Girmek istemiyorsanız 0 yazın.");
  assert.equal(hata(cacDogrula("-5")), "CAC negatif olamaz.");
  assert.equal(hata(cacDogrula("-0")), "CAC negatif olamaz.");
  const ayiracMesaji =
    "CAC değerini nokta veya virgül kullanmadan, tam sayı olarak yazın (ör. 5000). Kuruş girilmez.";
  assert.equal(hata(cacDogrula("12,5")), ayiracMesaji);
  assert.equal(hata(cacDogrula("1.000")), ayiracMesaji);
  assert.equal(hata(cacDogrula("abc")), "CAC yalnızca rakamlardan oluşmalıdır.");
  assert.equal(hata(cacDogrula("+5000")), "CAC yalnızca rakamlardan oluşmalıdır.");
  assert.equal(hata(cacDogrula("10000001")), "CAC en fazla 10.000.000 TL olabilir.");
});

test("CAC: metin olmayan girdi (null, sayı) boş sayılır", () => {
  // Formdan her zaman metin gelir. Başka bir şey gelirse (formla oynanmışsa) boş sayılır.
  assert.equal(hata(cacDogrula(null)), "CAC boş bırakılamaz. Girmek istemiyorsanız 0 yazın.");
  assert.equal(hata(cacDogrula(5000)), "CAC boş bırakılamaz. Girmek istemiyorsanız 0 yazın.");
});