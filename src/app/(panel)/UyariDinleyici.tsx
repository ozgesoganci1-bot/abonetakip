"use client";

// CANLI UYARI DİNLEYİCİSİ (Gün 10)
//
// Panelin her sayfasında çalışır (layout içinde durur). Tarayıcıdan /api/events
// adresine SSE bağlantısı açar ve gelen iptal uyarılarını sayfanın üstünde bant
// olarak gösterir. Sayfa yenilenmez.
//
// YENİDEN BAĞLANMA: Ağ ya da sunucu kesilirse EventSource kendiliğinden yeniden
// bağlanır (sunucu "retry: 5000" der). Bu bileşende ek kod gerekmez.
//
// SESSİZ DURMA: Uç nokta 401 (giriş yok), 403 veya 429 (bağlantı sınırı) dönerse
// EventSource bağlantıyı kapatır ve bir daha denemez. Bu bileşen o durumda hata
// göstermez, sessizce durur.
//
// ÇIKIŞ: Çıkış yapan kullanıcı /giris sayfasına gider. O sayfa (panel) layout'unun
// dışında olduğu için bu bileşen kaldırılır ve bağlantı kapanır (ADR, Gün 10).
//
// GÜVENLİK: Müşteri adı React ile METİN olarak basılır, HTML olarak işlenmez.

import { useEffect, useRef, useState } from "react";

type Uyari = { id: number; musteriAdi: string };

// Ekranda aynı anda en fazla bu kadar bant tutulur; en yeni üstte görünür.
const EN_FAZLA_UYARI = 5;

// Sunucudan gelen veriyi doğrular. Beklenmeyen biçim sessizce yok sayılır.
function musteriAdiniOku(veri: string): string | null {
  try {
    const nesne: unknown = JSON.parse(veri);
    if (
      typeof nesne === "object" &&
      nesne !== null &&
      "musteriAdi" in nesne &&
      typeof (nesne as { musteriAdi: unknown }).musteriAdi === "string"
    ) {
      return (nesne as { musteriAdi: string }).musteriAdi;
    }
  } catch {
    // Bozuk veri: uyarı gösterilmez.
  }
  return null;
}

export default function UyariDinleyici() {
  const [uyarilar, setUyarilar] = useState<Uyari[]>([]);
  const sayac = useRef(0);

  useEffect(() => {
    const kaynak = new EventSource("/api/events");

    kaynak.addEventListener("iptal", (olay) => {
      const musteriAdi = musteriAdiniOku((olay as MessageEvent<string>).data);
      if (!musteriAdi) return;
      sayac.current += 1;
      const yeni: Uyari = { id: sayac.current, musteriAdi };
      setUyarilar((onceki) => [yeni, ...onceki].slice(0, EN_FAZLA_UYARI));
    });

    // Bilerek bir şey yapılmaz: bağlantı geçici koptuysa tarayıcı yeniden dener,
    // kalıcı olarak reddedildiyse (401, 403, 429) kendisi kapatır.
    kaynak.addEventListener("error", () => {});

    // Sayfa değişince ya da bileşen kaldırılınca bağlantı kapatılır.
    return () => kaynak.close();
  }, []);

  if (uyarilar.length === 0) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 mx-auto w-full max-w-xl space-y-2 px-4 pt-4"
      role="status"
      aria-live="polite"
    >
      {uyarilar.map((uyari) => (
        <div
          key={uyari.id}
          className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-md"
        >
          {/* Anlam yalnızca renge bırakılmaz: simge + metin */}
          <span aria-hidden="true" className="font-bold">
            ✕
          </span>
          <p className="min-w-0 flex-1 break-words">
            <span className="font-semibold">{uyari.musteriAdi}</span> aboneliğini
            iptal etti.
          </p>
          <button
            type="button"
            aria-label="Uyarıyı kapat"
            className="rounded px-1 font-medium text-red-700 hover:text-red-900"
            onClick={() =>
              setUyarilar((onceki) => onceki.filter((u) => u.id !== uyari.id))
            }
          >
            Kapat
          </button>
        </div>
      ))}
    </div>
  );
}