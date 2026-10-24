import Link from "next/link";
import BosDurum from "@/components/ui/BosDurum";

// KÖK 404 (Gün 11, Parça B)
// Var olmayan bir adres açıldığında gösterilir (ör. /olmayan-sayfa).
// Panelin dışındadır: oturum ve veri okumaz. Panel içindeki kayıtlar için
// ayrı ekran vardır: src/app/(panel)/not-found.tsx ("Kayıt bulunamadı").
// Ana sayfa bağlantısı giriş durumuna göre yönlendirir (src/app/page.tsx).
export default function SayfaBulunamadi() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
      <BosDurum
        baslik="Sayfa bulunamadı"
        aciklama="Aradığınız sayfa yok. Adres hatalı olabilir."
      >
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Ana sayfaya dön
        </Link>
      </BosDurum>
    </main>
  );
}