import { requireUser } from "@/lib/auth";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import BosDurum from "@/components/ui/BosDurum";

// Yer tutucu sayfa. Müşteri yönetimi 4. günde yapılacak.
export default async function MusterilerSayfasi() {
  await requireUser();

  return (
    <div>
      <SayfaBasligi
        baslik="Müşteriler"
        aciklama="Firmanızın müşteri kayıtları."
      />
      <BosDurum
        baslik="Henüz müşteri yok"
        aciklama="Müşteri yönetimi ilerleyen günlerde eklenecek."
      />
    </div>
  );
}