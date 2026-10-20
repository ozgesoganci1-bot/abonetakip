import { requireManager } from "@/lib/auth";
import YetkiYok from "../YetkiYok";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import BosDurum from "@/components/ui/BosDurum";

// Yer tutucu sayfa. CAC ayarı ilerleyen günlerde eklenecek.
// Yalnızca manager görür, finance kullanıcısına "yetkiniz yok" mesajı gösterilir.
export default async function AyarlarSayfasi() {
  const kullanici = await requireManager();
  if (!kullanici) return <YetkiYok />;

  return (
    <div>
      <SayfaBasligi
        baslik="Ayarlar"
        aciklama="Firma ayarları (müşteri edinme maliyeti dahil)."
      />
      <BosDurum
        baslik="Ayarlar henüz yok"
        aciklama="Ayar sayfası ilerleyen günlerde doldurulacak."
      />
    </div>
  );
}