// OTURUM BELİRTECİ BİRİM TESTİ (Gün 6)
//
// Ne test edilir? Çerezdeki imzalı belirtecin değiştirilemediği.
// Kullanıcının firması (tenantId) ve rolü çerezde değil veritabanında durur
// (bkz. auth.ts). Bu yüzden başka firmaya geçmenin tek yolu çerezdeki
// kullanıcı kimliğini değiştirmek olurdu. Bu testler bunun işe yaramadığını gösterir.
//
// Veritabanı gerekmez. Çalıştırmak için: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { oturumBelirteciOlustur, oturumBelirteciniCoz } from "./session.ts";

// Yalnızca bu test için geçici bir anahtar. Gerçek SESSION_SECRET değildir.
// session.ts anahtarı her imzada yeniden okuduğu için burada atamak yeterlidir.
const TEST_ANAHTARI = "yalnizca-birim-testi-icin-anahtar-0123456789";
process.env.SESSION_SECRET = TEST_ANAHTARI;

const SIMDI = Date.UTC(2026, 9, 22, 12, 0, 0);
const GUN = 24 * 60 * 60 * 1000;

test("geçerli belirteç kullanıcı kimliğini verir", () => {
  const belirtec = oturumBelirteciOlustur("kullanici1", SIMDI);
  assert.equal(oturumBelirteciniCoz(belirtec, SIMDI + GUN), "kullanici1");
});

test("7 gün sonra süresi dolar", () => {
  const belirtec = oturumBelirteciOlustur("kullanici1", SIMDI);
  assert.equal(oturumBelirteciniCoz(belirtec, SIMDI + 8 * GUN), null);
});

test("içindeki kullanıcı kimliği değiştirilen belirteç geçersizdir", () => {
  const belirtec = oturumBelirteciOlustur("kullanici1", SIMDI);
  const [veri, imza] = belirtec.split(".");
  const yuk = JSON.parse(Buffer.from(veri, "base64url").toString("utf8"));
  yuk.u = "baskaKullanici"; // saldırgan başka kullanıcının kimliğini yazıyor
  const sahteVeri = Buffer.from(JSON.stringify(yuk)).toString("base64url");
  assert.equal(oturumBelirteciniCoz(`${sahteVeri}.${imza}`, SIMDI), null);
});

test("imzası değiştirilen belirteç geçersizdir", () => {
  const belirtec = oturumBelirteciOlustur("kullanici1", SIMDI);
  const [veri, imza] = belirtec.split(".");
  const ilkHarf = imza[0] === "A" ? "B" : "A";
  assert.equal(oturumBelirteciniCoz(`${veri}.${ilkHarf}${imza.slice(1)}`, SIMDI), null);
});

test("başka bir anahtarla imzalanmış belirteç geçersizdir", () => {
  process.env.SESSION_SECRET = "baska-bir-anahtar-0123456789abcdef";
  const yabanci = oturumBelirteciOlustur("kullanici1", SIMDI);
  process.env.SESSION_SECRET = TEST_ANAHTARI;
  assert.equal(oturumBelirteciniCoz(yabanci, SIMDI), null);
});

test("biçimi bozuk belirteçler geçersizdir", () => {
  for (const bozuk of ["", "abc", "a.b.c", ".", "x."]) {
    assert.equal(oturumBelirteciniCoz(bozuk, SIMDI), null, `Kabul edilmemeliydi: "${bozuk}"`);
  }
});