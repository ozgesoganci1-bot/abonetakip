import { requireUser } from "@/lib/auth";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import BosDurum from "@/components/ui/BosDurum";

// Yer tutucu sayfa. KPI göstergeleri 8-9. günlerde eklenecek.
export default async function DashboardSayfasi() {
  // Layout da giriş kontrolü yapar, ama Next.js layout ile sayfayı birbirinden
  // bağımsız çalıştırır. Bu yüzden her sayfa kendi kontrolünü de yapar.
  await requireUser();

  return (
    <div>
      <SayfaBasligi
        baslik="Dashboard"
        aciklama="Firmanızın abonelik göstergeleri burada görünecek."
      />
      <BosDurum
        baslik="KPI göstergeleri henüz yok"
        aciklama="MRR, churn ve LTV göstergeleri ilerleyen günlerde eklenecek."
      />
    </div>
  );
}