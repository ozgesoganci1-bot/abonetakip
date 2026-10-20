import { requireManager } from "@/lib/auth";
import YetkiYok from "../YetkiYok";

// Yer tutucu sayfa. CAC ayarı ilerleyen günlerde eklenecek.
// Yalnızca manager görür, finance kullanıcısına "yetkiniz yok" mesajı gösterilir.
export default async function AyarlarSayfasi() {
  const kullanici = await requireManager();
  if (!kullanici) return <YetkiYok />;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Ayarlar</h1>
      <p className="mt-2 text-gray-600">Bu sayfa ilerleyen günlerde doldurulacak.</p>
    </div>
  );
}