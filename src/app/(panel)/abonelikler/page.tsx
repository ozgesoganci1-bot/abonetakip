import { requireUser } from "@/lib/auth";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import BosDurum from "@/components/ui/BosDurum";

// Yer tutucu sayfa. Abonelik yaşam döngüsü 5. günde yapılacak.
export default async function AboneliklerSayfasi() {
  await requireUser();

  return (
    <div>
      <SayfaBasligi
        baslik="Abonelikler"
        aciklama="Başlatılan, yenilenen ve iptal edilen abonelikler."
      />
      <BosDurum
        baslik="Henüz abonelik yok"
        aciklama="Abonelik yönetimi ilerleyen günlerde eklenecek."
      />
    </div>
  );
}