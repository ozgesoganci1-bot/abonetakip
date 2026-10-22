// ROL KURALI BİRİM TESTİ (Gün 6)
// Veritabanı gerekmez. Çalıştırmak için: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { yoneticiMi } from "./yetki.ts";

test("manager yöneticidir", () => {
  assert.equal(yoneticiMi("manager"), true);
});

test("finance yönetici değildir", () => {
  assert.equal(yoneticiMi("finance"), false);
});