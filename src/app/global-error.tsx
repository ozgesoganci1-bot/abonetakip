"use client";

// KÖK HATA EKRANI (Gün 11, Parça B)
// Yalnızca kök yerleşimin (src/app/layout.tsx) kendisi çökerse gösterilir; panel
// sayfalarındaki hatalar src/app/(panel)/error.tsx ile yakalanır.
// Kök yerleşimin yerini aldığı için kendi <html> ve <body> etiketleri vardır.
// Genel stiller (Tailwind, yazı tipi) yüklenmemiş olabilir: bu yüzden yalnızca
// satır içi basit stil kullanılır. Hata ayrıntısı ekrana yazılmaz.

type Props = { error: Error & { digest?: string } };

export default function KokHatasi({ error }: Props) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f8fafc",
          color: "#0f172a",
        }}
      >
        <title>AboneTakip</title>
        <div role="alert" style={{ maxWidth: 420, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>Bir şeyler ters gitti</h1>
          <p style={{ fontSize: 14, margin: "0 0 16px", color: "#475569" }}>
            Uygulama yüklenemedi. Lütfen sayfayı yenileyin.
          </p>
          {error.digest && (
            <p style={{ fontSize: 12, margin: "0 0 16px", color: "#64748b" }}>
              Destek için kod: <code>{error.digest}</code>
            </p>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: "8px 16px",
              fontSize: 14,
              border: "none",
              borderRadius: 8,
              background: "#4f46e5",
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            Sayfayı yenile
          </button>
        </div>
      </body>
    </html>
  );
}