// DÖNEM HESABI BİRİM TESTİ
//
// Çalıştırmak için: node --test src/lib/donem.test.ts
// Ek paket gerekmez: Node'un yerleşik test aracı kullanılır.

import { test } from "node:test";
import assert from "node:assert/strict";
import { donemSonu } from "./donem.ts";

// Kısa yardımcı: metin olarak verilen UTC tarihine aralık ekler, sonucu metin döner.
function hesapla(baslangic: string, aralik: "MONTHLY" | "YEARLY"): string {
  return donemSonu(new Date(baslangic), aralik).toISOString();
}

test("aylık: sıradan gün bir ay sonraya taşınır", () => {
  assert.equal(hesapla("2026-01-15T10:00:00.000Z", "MONTHLY"), "2026-02-15T10:00:00.000Z");
});

test("aylık: 31 Ocak + 1 ay = 28 Şubat (ay sonu taşmaz)", () => {
  assert.equal(hesapla("2026-01-31T10:00:00.000Z", "MONTHLY"), "2026-02-28T10:00:00.000Z");
});

test("aylık: artık yılda 31 Ocak + 1 ay = 29 Şubat", () => {
  assert.equal(hesapla("2028-01-31T10:00:00.000Z", "MONTHLY"), "2028-02-29T10:00:00.000Z");
});

test("aylık: 31 Mart + 1 ay = 30 Nisan", () => {
  assert.equal(hesapla("2026-03-31T10:00:00.000Z", "MONTHLY"), "2026-04-30T10:00:00.000Z");
});

test("aylık: Aralık'tan Ocak'a yıl atlar", () => {
  assert.equal(hesapla("2026-12-31T10:00:00.000Z", "MONTHLY"), "2027-01-31T10:00:00.000Z");
});

test("yıllık: bir yıl sonraya taşınır", () => {
  assert.equal(hesapla("2026-03-15T10:00:00.000Z", "YEARLY"), "2027-03-15T10:00:00.000Z");
});

test("yıllık: 29 Şubat + 1 yıl = 28 Şubat (artık yıl olmayan yıl)", () => {
  assert.equal(hesapla("2028-02-29T10:00:00.000Z", "YEARLY"), "2029-02-28T10:00:00.000Z");
});

test("saat, dakika, saniye ve milisaniye korunur", () => {
  assert.equal(hesapla("2026-10-21T15:30:45.123Z", "MONTHLY"), "2026-11-21T15:30:45.123Z");
});