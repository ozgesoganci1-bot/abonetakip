// CANLI VERİTABANI KORUMASI BİRİM TESTİ (Gün 9)
//
// Çalıştırmak için: npm test
// Veritabanına bağlanmaz. Örnek adresler sahtedir (ep-xxxx biçimi, yer tutucu parola).

import { test } from "node:test";
import assert from "node:assert/strict";
import { ucNoktaKimligi } from "./canli-koruma.ts";

const SON_EK = "c-2.eu-central-1.aws.neon.tech/vt?sslmode=require";

test("ucNoktaKimligi: havuzlu ve doğrudan adres AYNI sunucu sayılır", () => {
  const havuzlu = `postgresql://kullanici:[NEON_PAROLA]@ep-xxxx-canli-pooler.${SON_EK}`;
  const dogrudan = `postgresql://kullanici:[NEON_PAROLA]@ep-xxxx-canli.${SON_EK}`;
  assert.equal(ucNoktaKimligi(havuzlu), "ep-xxxx-canli");
  assert.equal(ucNoktaKimligi(havuzlu), ucNoktaKimligi(dogrudan));
});

test("ucNoktaKimligi: farklı dallar farklı sunucudur; okunamayan adres null", () => {
  const canli = `postgresql://kullanici:[NEON_PAROLA]@ep-xxxx-canli-pooler.${SON_EK}`;
  const test = `postgresql://kullanici:[NEON_PAROLA]@ep-xxxx-test-pooler.${SON_EK}`;
  assert.notEqual(ucNoktaKimligi(canli), ucNoktaKimligi(test));

  assert.equal(ucNoktaKimligi(undefined), null);
  assert.equal(ucNoktaKimligi(""), null);
  assert.equal(ucNoktaKimligi("bozuk adres"), null);
});