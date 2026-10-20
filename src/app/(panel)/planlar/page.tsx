import { requireUser } from "@/lib/auth";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import BosDurum from "@/components/ui/BosDurum";

// Yer tutucu sayfa. Plan yönetimi 4. günde yapılacak.
export default async function PlanlarSayfasi() {
  await requireUser();

  return (
    <div>
      <SayfaBasligi
        baslik="Planlar"
        aciklama="Müşterilerinize sunduğunuz abonelik planları."
      />
      <BosDurum
        baslik="Henüz plan yok"
        aciklama="Plan yönetimi ilerleyen günlerde eklenecek."
      />
    </div>
  );
}