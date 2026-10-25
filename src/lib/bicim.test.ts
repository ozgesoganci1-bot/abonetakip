// EKRAN BİÇİMLENDİRME BİRİM TESTİ (Gün 9, Gün 14'te genişletildi)
//
// Çalıştırmak için: npm test
// Dashboard'da görünecek metinlerin elle test senaryosuyla birebir aynı olduğunu kilitler.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  tlMetni,
  yuzdeMetni,
  sayiMetni,
  ayEtiketi,
  kisaAyEtiketi,
  tarihMetni,
} from "./bicim.ts";

test("tlMetni: binlik ayıracı nokta, kuruş yok", () => {
  assert.equal(tlMetni(1500), "1.500 TL");
  assert.equal(tlMetni(50000), "50.000 TL");
  assert.equal(tlMetni(83), "83 TL");
  assert.equal(tlMetni(0), "0 TL");
});

test("yuzdeMetni: 1 ondalık, yüzde işareti önde", () => {
  assert.equal(yuzdeMetni(0.6667), "%66,7"); // Gün 9 senaryosu
  assert.equal(yuzdeMetni(0.04), "%4,0"); // ders örneği
  assert.equal(yuzdeMetni(0), "%0,0");
  assert.equal(yuzdeMetni(1), "%100,0");
});

test("sayiMetni: en fazla 2 ondalık, gereksiz sıfır yok", () => {
  assert.equal(sayiMetni(0.3), "0,3"); // Gün 9 LTV/CAC
  assert.equal(sayiMetni(5), "5"); // ders örneği LTV/CAC
  assert.equal(sayiMetni(1.5), "1,5"); // Gün 9 ömür
  assert.equal(sayiMetni(3.25), "3,25");
});

test("ayEtiketi: Türkçe ay adı ve yıl", () => {
  assert.equal(ayEtiketi(2026, 10), "Ekim 2026");
  assert.equal(ayEtiketi(2027, 1), "Ocak 2027");
});

test("kisaAyEtiketi (Gün 11): kısa Türkçe ay adı ve yılın son iki hanesi", () => {
  assert.equal(kisaAyEtiketi(2026, 10), "Eki 26");
  assert.equal(kisaAyEtiketi(2025, 11), "Kas 25");
  assert.equal(kisaAyEtiketi(2027, 1), "Oca 27");
  assert.equal(kisaAyEtiketi(2026, 5), "May 26");
  assert.equal(kisaAyEtiketi(2026, 8), "Ağu 26");
});

test("tarihMetni (Gün 14): Türkiye saatiyle gün, ay adı ve yıl", () => {
  assert.equal(tarihMetni(new Date("2026-10-25T09:00:00Z")), "25 Ekim 2026");
  // UTC'de hâlâ 24 Ekim 22.30, Türkiye'de 25 Ekim 01.30: Türkiye tarihi gösterilir.
  assert.equal(tarihMetni(new Date("2026-10-24T22:30:00Z")), "25 Ekim 2026");
  // Yıl sınırı: UTC'de 31 Aralık 21.30, Türkiye'de 1 Ocak 00.30.
  assert.equal(tarihMetni(new Date("2026-12-31T21:30:00Z")), "1 Ocak 2027");
  assert.equal(tarihMetni(new Date("2027-01-05T12:00:00Z")), "5 Ocak 2027");
});