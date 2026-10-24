import type { NextConfig } from "next";

// GÜVENLİK BAŞLIKLARI (Gün 12, bulgu B10)
// Bütün yanıtlara (sayfalar, sunucu işlemleri, /api/events dahil) eklenir.
//
// - X-Frame-Options ve CSP frame-ancestors: site başka bir sayfanın içine çerçeve
//   olarak gömülemez (tıklama tuzağı). İkisi birlikte: eski ve yeni tarayıcılar için.
//   CSP'de BİLEREK yalnızca frame-ancestors vardır. Betik ve bağlantı kuralı yoktur:
//   Next.js'in satır içi betikleri ve geliştirme modunun anında yenileme (HMR)
//   bağlantısı etkilenmez. Tam CSP 2 haftalık kapsam için ağır bulundu (ADR, Gün 12).
// - X-Content-Type-Options: tarayıcı dosya türünü tahmin etmez. SSE yanıtının türü
//   (text/event-stream) route içinde açıkça yazıldığı için etkilenmez.
// - Referrer-Policy: başka sitelere giden isteklerde tam adres gönderilmez.
// - Permissions-Policy: uygulamanın kullanmadığı kamera, mikrofon ve konum kapalı.
// HSTS (Strict-Transport-Security) BİLEREK eklenmedi (ADR, Gün 12).
const guvenlikBasliklari = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Yanıtlarda "X-Powered-By: Next.js" başlığı gönderilmez (Gün 12, B10).
  poweredByHeader: false,

  async headers() {
    return [
      {
        // "/:path*" kök adres (/) dahil bütün yolları kapsar.
        source: "/:path*",
        headers: guvenlikBasliklari,
      },
    ];
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;