// RİSK ETİKETİ TESTLERİ (Gün 10)
// Saf fonksiyon testi: veritabanı gerekmez. Çalıştırmak için: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { riskEtiketi } from "./riskli-abonelikler.ts";

const SIMDI = new Date("2026-10-24T09:00:00.000Z");
const SAAT = 60 * 60 * 1000;
const GUN = 24 * SAAT;

function sonra(ms: number): Date {
  return new Date(SIMDI.getTime() + ms);
}

test("bitiş geçmişte: 'Süresi geçmiş' ve gecmis true", () => {
  assert.deepEqual(riskEtiketi(sonra(-2 * GUN), SIMDI), {
    metin: "Süresi geçmiş",
    gecmis: true,
  });
  // 1 milisaniye bile geçmişse süresi geçmiştir.
  assert.equal(riskEtiketi(sonra(-1), SIMDI).metin, "Süresi geçmiş");
});

test("1 günden az kaldıysa '1 günden az kaldı' (bitiş tam şimdi dahil)", () => {
  assert.deepEqual(riskEtiketi(sonra(0), SIMDI), {
    metin: "1 günden az kaldı",
    gecmis: false,
  });
  assert.equal(riskEtiketi(sonra(23 * SAAT), SIMDI).metin, "1 günden az kaldı");
});

test("tam 1 gün kaldıysa '1 gün kaldı'", () => {
  assert.equal(riskEtiketi(sonra(GUN), SIMDI).metin, "1 gün kaldı");
});

test("3 gün kaldıysa '3 gün kaldı'", () => {
  assert.deepEqual(riskEtiketi(sonra(3 * GUN), SIMDI), {
    metin: "3 gün kaldı",
    gecmis: false,
  });
});

test("6 gün 23 saat kaldıysa aşağı yuvarlanır: '6 gün kaldı'", () => {
  assert.equal(riskEtiketi(sonra(6 * GUN + 23 * SAAT), SIMDI).metin, "6 gün kaldı");
});