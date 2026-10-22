// STATİK KURAL TESTİ (Gün 6)
//
// Veritabanına bağlanmaz. src/ altındaki dosyaları okuyup iki kuralı kontrol eder:
//   1. Ham "prisma" nesnesi (src/lib/db.ts) yalnızca izin verilen dosyalarda
//      içe aktarılır. Diğer her yer tenant filtresinden geçen getTenantDb()
//      kullanmak zorundadır.
//   2. Ham SQL ($queryRaw, $executeRaw) hiçbir yerde kullanılmaz, çünkü
//      ham SQL tenant filtresinden geçmez.
// Bu test, "bütün sorgular filtreden geçer" varsayımının güvencesidir.
// Yeni bir dosya kuralı bozarsa test hangi dosya olduğunu söyler.
//
// Çalıştırmak için: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BU_DOSYA = fileURLToPath(import.meta.url);
const SRC = path.resolve(path.dirname(BU_DOSYA), "..");

// Ham prisma nesnesini içe aktarmasına izin verilen dosyalar (src/ içindeki yollar).
const HAM_PRISMA_IZINLI = new Set([
  "lib/db.ts", // nesnenin kendisi
  "lib/auth.ts", // kayıt ve giriş: kiracı henüz belli değil
  "lib/tenant.ts", // filtrenin kendisi
  "test-destek/veri.ts", // test verisi oluşturma ve silme (Gün 6 onayı)
]);

// src/ altındaki bütün kod dosyalarını toplar.
function dosyalariTopla(klasor: string): string[] {
  const sonuc: string[] = [];
  for (const oge of readdirSync(klasor, { withFileTypes: true })) {
    const tamYol = path.join(klasor, oge.name);
    if (oge.isDirectory()) {
      sonuc.push(...dosyalariTopla(tamYol));
    } else if (/\.(ts|tsx|js|mjs)$/.test(oge.name)) {
      sonuc.push(tamYol);
    }
  }
  return sonuc;
}

// "src/lib/db.ts" yerine "lib/db.ts" gibi kısa ve her işletim sisteminde aynı yazım.
function kisaYol(dosya: string): string {
  return path.relative(SRC, dosya).split(path.sep).join("/");
}

// Yorum satırları atlanır: yorumda "YASAK: $queryRaw" yazması ihlal değildir.
function kodSatirlari(dosya: string): string[] {
  return readFileSync(dosya, "utf8")
    .split("\n")
    .filter((satir) => {
      const t = satir.trim();
      return !t.startsWith("//") && !t.startsWith("*") && !t.startsWith("/*");
    });
}

// Bu test dosyasının kendisi taranmaz (içinde aranan kelimeler geçiyor).
const DOSYALAR = dosyalariTopla(SRC).filter((d) => d !== BU_DOSYA);

test("tarama gerçekten dosya buluyor (kendini kontrol)", () => {
  const kisalar = DOSYALAR.map(kisaYol);
  assert.ok(kisalar.includes("lib/tenant.ts"), "src/lib/tenant.ts bulunamadı: tarama yolu yanlış.");
  assert.ok(kisalar.includes("app/(panel)/musteriler/actions.ts"));
});

test("ham prisma (db.ts) yalnızca izin verilen dosyalarda içe aktarılır", () => {
  // Yakalar: from "./db", from "../lib/db.ts", from "@/lib/db", import("../lib/db.ts")
  const desen = /(?:from\s+|import\s*\(\s*)["'][^"']*\/db(?:\.ts)?["']/;
  const ihlaller = DOSYALAR.filter(
    (d) => !HAM_PRISMA_IZINLI.has(kisaYol(d)) && kodSatirlari(d).some((s) => desen.test(s))
  ).map(kisaYol);
  assert.deepEqual(ihlaller, [], `Ham prisma şu dosyalarda kullanılıyor: ${ihlaller.join(", ")}`);
});

test("yeni bir Prisma istemcisi yalnızca db.ts içinde oluşturulur", () => {
  const ihlaller = DOSYALAR.filter(
    (d) => kisaYol(d) !== "lib/db.ts" && kodSatirlari(d).some((s) => /new\s+PrismaClient\b/.test(s))
  ).map(kisaYol);
  assert.deepEqual(ihlaller, [], `PrismaClient şu dosyalarda oluşturuluyor: ${ihlaller.join(", ")}`);
});

test("ham SQL ($queryRaw, $executeRaw) hiçbir yerde kullanılmaz", () => {
  const desen = new RegExp("\\$(?:query|execute)Raw");
  const ihlaller = DOSYALAR.filter((d) => kodSatirlari(d).some((s) => desen.test(s))).map(kisaYol);
  assert.deepEqual(ihlaller, [], `Ham SQL şu dosyalarda kullanılıyor: ${ihlaller.join(", ")}`);
});