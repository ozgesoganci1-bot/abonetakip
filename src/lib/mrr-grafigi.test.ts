// MRR GRAFİĞİ YARDIMCILARI BİRİM TESTİ (Gün 11)
//
// Çalıştırmak için: npm test
// Veritabanı gerekmez. Grafik noktaları elle yazılmıştır; Gün 11 senaryosunun
// değerleri metrikler.test.ts içindeki "Gün 11 senaryosu" testiyle aynıdır.

import { test } from "node:test";
import assert from "node:assert/strict";
import type { MrrNoktasi } from "./metrikler.ts";
import { eksenUstSiniri, eksenDegerleri, grafikOzeti } from "./mrr-grafigi.ts";

// Kısa yardımcı: [yil, ay, mrr] üçlülerinden nokta listesi üretir.
function noktalar(liste: [number, number, number][]): MrrNoktasi[] {
  return liste.map(([yil, ay, mrr]) => ({ yil, ay, mrr }));
}

// Gün 11 senaryosu: Kasım 2025 - Ekim 2026
const GUN11 = noktalar([
  [2025, 11, 3000],
  [2025, 12, 3000],
  [2026, 1, 4000],
  [2026, 2, 4000],
  [2026, 3, 4500],
  [2026, 4, 4500],
  [2026, 5, 4583],
  [2026, 6, 4083],
  [2026, 7, 4083],
  [2026, 8, 4083],
  [2026, 9, 2083],
  [2026, 10, 2083],
]);

// =====================================================================
// EKSEN
// =====================================================================

test("eksenUstSiniri: değere eşit ya da büyük ilk yuvarlak sayı", () => {
  assert.equal(eksenUstSiniri(4583), 5000); // Gün 11 en yüksek değer
  assert.equal(eksenUstSiniri(2083), 2500);
  assert.equal(eksenUstSiniri(3000), 5000);
  assert.equal(eksenUstSiniri(5000), 5000); // tam eşitse kendisi
  assert.equal(eksenUstSiniri(150), 200);
  assert.equal(eksenUstSiniri(12000), 20000);
});

test("eksenUstSiniri: 0, küçük değer ve sayı olmayan değerde en az 100", () => {
  assert.equal(eksenUstSiniri(0), 100);
  assert.equal(eksenUstSiniri(83), 100);
  assert.equal(eksenUstSiniri(100), 100);
  assert.equal(eksenUstSiniri(Number.NaN), 100);
});

test("eksenDegerleri: 0, yarısı ve üst sınır; yarısı tam sayı", () => {
  assert.deepEqual(eksenDegerleri(2500), [0, 1250, 2500]);
  assert.deepEqual(eksenDegerleri(100), [0, 50, 100]);
  assert.deepEqual(eksenDegerleri(5000), [0, 2500, 5000]);
});

// =====================================================================
// ÖZET CÜMLE
// =====================================================================

test("grafikOzeti: Gün 11 senaryosu (düşüş, en yüksek Mayıs)", () => {
  assert.equal(
    grafikOzeti(GUN11),
    "Son 12 ayda MRR 3.000 TL'den 2.083 TL'ye düştü (Kasım 2025 – Ekim 2026). " +
      "En yüksek değer 4.583 TL (Mayıs 2026)."
  );
});

test("grafikOzeti: artış", () => {
  assert.equal(
    grafikOzeti(noktalar([[2026, 9, 1000], [2026, 10, 2000]])),
    "Son 2 ayda MRR 1.000 TL'den 2.000 TL'ye yükseldi (Eylül 2026 – Ekim 2026). " +
      "En yüksek değer 2.000 TL (Ekim 2026)."
  );
});

test("grafikOzeti: ilk ve son ay aynı (arada değişse bile 'değişmedi' denmez)", () => {
  assert.equal(
    grafikOzeti(noktalar([[2026, 8, 3000], [2026, 9, 4000], [2026, 10, 3000]])),
    "Son 3 ayda MRR ilk ve son ayda aynı: 3.000 TL (Ağustos 2026 – Ekim 2026). " +
      "En yüksek değer 4.000 TL (Eylül 2026)."
  );
});

test("grafikOzeti: bütün aylar 0 ise en yüksek değer yazılmaz", () => {
  const sifirlar = GUN11.map((n) => ({ ...n, mrr: 0 }));
  assert.equal(grafikOzeti(sifirlar), "Son 12 ayda MRR 0 TL (Kasım 2025 – Ekim 2026).");
});

test("grafikOzeti: en yüksek değer birden çok ayda varsa en eski ay yazılır", () => {
  assert.equal(
    grafikOzeti(noktalar([[2026, 8, 1000], [2026, 9, 5000], [2026, 10, 5000]])),
    "Son 3 ayda MRR 1.000 TL'den 5.000 TL'ye yükseldi (Ağustos 2026 – Ekim 2026). " +
      "En yüksek değer 5.000 TL (Eylül 2026)."
  );
});

test("grafikOzeti: tek nokta ve boş liste", () => {
  assert.equal(grafikOzeti(noktalar([[2026, 10, 2083]])), "MRR 2.083 TL (Ekim 2026).");
  assert.equal(grafikOzeti([]), "MRR verisi yok.");
});