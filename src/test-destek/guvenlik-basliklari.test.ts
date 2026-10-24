// GÜVENLİK BAŞLIKLARI TESTİ (Gün 12, bulgu B10)
//
// next.config.ts dosyasındaki ayarları doğrudan okur. Next.js sunucusu ve veritabanı
// gerekmez: next.config.ts çalışma anında yalnızca bir tür (type) içe aktarır.
// Başlıkların gerçek yanıtlarda göründüğü ayrıca elle curl ile kontrol edilir.
// Çalıştırmak için: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import nextConfig from "../../next.config.ts";

// Beklenen başlıklar ve değerleri. Sıra da önemlidir: değişiklik bilinçli yapılmalı.
const BEKLENEN = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

test("X-Powered-By başlığı kapalıdır", () => {
  assert.equal(nextConfig.poweredByHeader, false);
});

test("güvenlik başlıkları bütün yollara beklenen değerlerle uygulanır", async () => {
  const kurallar = await nextConfig.headers?.();
  assert.ok(kurallar, "headers() ayarı bulunamadı.");
  assert.equal(kurallar.length, 1);
  assert.equal(kurallar[0].source, "/:path*");
  assert.deepEqual(kurallar[0].headers, BEKLENEN);
});

test("HSTS bilerek eklenmemiştir ve CSP yalnızca frame-ancestors içerir", async () => {
  const kurallar = (await nextConfig.headers?.()) ?? [];
  const basliklar = kurallar.flatMap((k) => k.headers);
  const adlar = basliklar.map((b) => b.key.toLowerCase());
  assert.ok(!adlar.includes("strict-transport-security"), "HSTS eklenmiş.");

  const csp = basliklar.find((b) => b.key === "Content-Security-Policy");
  assert.equal(csp?.value, "frame-ancestors 'none'");
});