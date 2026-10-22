// EKRAN BİÇİMLENDİRME BİRİM TESTİ (Gün 9)
//
// Çalıştırmak için: npm test
// Dashboard'da görünecek metinlerin elle test senaryosuyla birebir aynı olduğunu kilitler.

import { test } from "node:test";
import assert from "node:assert/strict";
import { tlMetni, yuzdeMetni, sayiMetni, ayEtiketi } from "./bicim.ts";

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