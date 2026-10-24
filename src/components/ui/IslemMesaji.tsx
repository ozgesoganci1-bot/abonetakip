import type { FormDurumu } from "@/lib/islem";

// Bir form işleminin sonucunu gösterir: başarılıysa yeşil, hatalıysa kırmızı kutu.
// Henüz işlem yapılmadıysa hiçbir şey göstermez.
// Gün 11 (Parça B): anlam yalnızca renge bırakılmaz. Başarıda "✓", hatada "!" simgesi
// gösterilir (dashboard rozetleriyle aynı). Simge ekran okuyucudan gizlenir; anlamı
// mesaj metni ve role (status / alert) taşır.
export default function IslemMesaji({ durum }: { durum: FormDurumu }) {
  if (durum.durum === "bos" || !durum.mesaj) return null;

  const basarili = durum.durum === "basarili";
  const renk = basarili
    ? "border-green-200 bg-green-50 text-green-800"
    : "border-red-200 bg-red-50 text-red-700";

  return (
    <p
      role={basarili ? "status" : "alert"}
      className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${renk}`}
    >
      <span aria-hidden="true" className="font-semibold">
        {basarili ? "✓" : "!"}
      </span>
      <span>{durum.mesaj}</span>
    </p>
  );
}