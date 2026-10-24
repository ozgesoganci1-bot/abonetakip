import Link from "next/link";
import BosDurum from "@/components/ui/BosDurum";

// Panel içinde notFound() çağrıldığında gösterilir (ör. başka firmanın kaydı).
// Kaydın var olup olmadığı veya kime ait olduğu hakkında bilgi verilmez.
export default function KayitBulunamadi() {
  return (
    <div className="space-y-4">
      <BosDurum
        baslik="Kayıt bulunamadı"
        aciklama="Aradığınız kayıt bulunamadı. Bağlantı hatalı olabilir."
      />
      <Link
        href="/dashboard"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        ← Dashboard&apos;a dön
      </Link>
    </div>
  );
}