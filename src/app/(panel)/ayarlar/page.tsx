import { requireManager } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import YetkiYok from "../YetkiYok";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import Kart from "@/components/ui/Kart";
import CacFormu from "./CacFormu";

// Firma ayarları (Gün 9): müşteri edinme maliyeti (CAC).
// Yalnızca manager görür, finance kullanıcısına "yetkiniz yok" mesajı gösterilir.
// Not: Sayfayı gizlemek yetki kontrolü değildir. Kaydetme işlemi sunucuda
// ayrıca rol kontrolü yapar (src/lib/cac-ayari.ts).
export default async function AyarlarSayfasi() {
  const kullanici = await requireManager();
  if (!kullanici) return <YetkiYok />;

  // Firma bilgisi tenant filtresinden geçer: yalnızca kullanıcının kendi firması.
  const db = await getTenantDb();
  const firma = await db.tenant.findFirst({ select: { cac: true } });
  const mevcutCac = firma?.cac ?? 0;

  return (
    <div>
      <SayfaBasligi
        baslik="Ayarlar"
        aciklama="Firma ayarları. Bu sayfayı yalnızca firma yöneticisi görür."
      />
      <Kart className="max-w-xl">
        <h2 className="text-base font-semibold text-slate-900">
          Müşteri edinme maliyeti (CAC)
        </h2>
        <p className="mb-4 mt-1 text-sm text-slate-500">
          Dashboard&apos;daki LTV/CAC oranı bu değerle hesaplanır. 3 ve üzeri sağlıklı
          kabul edilir.
        </p>
        <CacFormu mevcutCac={mevcutCac} />
      </Kart>
    </div>
  );
}