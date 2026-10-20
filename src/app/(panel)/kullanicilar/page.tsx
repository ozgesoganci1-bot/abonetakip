import { requireManager } from "@/lib/auth";
import YetkiYok from "../YetkiYok";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import BosDurum from "@/components/ui/BosDurum";

// Yer tutucu sayfa. Kullanıcı yönetimi ilerleyen günlerde eklenecek.
// Yalnızca manager görür, finance kullanıcısına "yetkiniz yok" mesajı gösterilir.
export default async function KullanicilarSayfasi() {
  const kullanici = await requireManager();
  if (!kullanici) return <YetkiYok />;

  return (
    <div>
      <SayfaBasligi
        baslik="Kullanıcılar"
        aciklama="Firmanızın kullanıcıları ve rolleri."
      />
      <BosDurum
        baslik="Kullanıcı yönetimi henüz yok"
        aciklama="Bu sayfa ilerleyen günlerde doldurulacak."
      />
    </div>
  );
}