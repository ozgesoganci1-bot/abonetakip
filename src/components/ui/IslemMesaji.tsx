import type { FormDurumu } from "@/lib/islem";

// Bir form işleminin sonucunu gösterir: başarılıysa yeşil, hatalıysa kırmızı kutu.
// Henüz işlem yapılmadıysa hiçbir şey göstermez.
export default function IslemMesaji({ durum }: { durum: FormDurumu }) {
  if (durum.durum === "bos" || !durum.mesaj) return null;

  const basarili = durum.durum === "basarili";
  const renk = basarili
    ? "border-green-200 bg-green-50 text-green-800"
    : "border-red-200 bg-red-50 text-red-700";

  return (
    <p
      role={basarili ? "status" : "alert"}
      className={`rounded-lg border px-3 py-2 text-sm ${renk}`}
    >
      {durum.mesaj}
    </p>
  );
}