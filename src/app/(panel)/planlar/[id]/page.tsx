import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import { kimlikDogrula } from "@/lib/validation";
import { aktifAbonelikVarMi } from "@/lib/abonelik-kontrol";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import Rozet from "@/components/ui/Rozet";
import PlanFormu from "../PlanFormu";
import PasifeAlDugmesi from "../PasifeAlDugmesi";

// Plan düzenleme sayfası.
// Kayıt yoksa ya da başka firmaya aitse aynı cevap verilir: "bulunamadı" (404).

type SayfaProps = { params: Promise<{ id: string }> };

export default async function PlanDuzenleSayfasi({ params }: SayfaProps) {
  const kullanici = await requireUser();
  const { id } = await params;

  const kimlik = kimlikDogrula(id);
  if (!kimlik.ok) notFound();

  const db = await getTenantDb();
  const plan = await db.plan.findFirst({
    where: { id: kimlik.deger },
    select: { id: true, name: true, price: true, interval: true, isActive: true },
  });
  if (!plan) notFound();

  // Aktif abonelik varsa fiyat ve aralık alanları salt okunur gösterilir.
  const kilitli = await aktifAbonelikVarMi({ planId: plan.id });
  const yonetici = kullanici.role === "manager";

  return (
    <div className="space-y-8">
      <Link
        href="/planlar"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        ← Planlara dön
      </Link>

      <div className="space-y-2">
        <SayfaBasligi baslik={plan.name} aciklama="Plan bilgilerini düzenleyin." />
        {!plan.isActive && <Rozet ton="gri">Pasif</Rozet>}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Bilgiler</h2>
        <div className="mt-4">
          <PlanFormu
            mod="duzenle"
            plan={{
              id: plan.id,
              ad: plan.name,
              fiyat: String(plan.price),
              aralik: plan.interval,
            }}
            kilitli={kilitli}
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Pasife alma</h2>
        <div className="mt-4">
          {yonetici ? (
            <PasifeAlDugmesi id={plan.id} ad={plan.name} aktif={plan.isActive} />
          ) : (
            <p className="text-sm text-slate-600">
              Pasife alma yalnızca firma yöneticisi tarafından yapılabilir.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}