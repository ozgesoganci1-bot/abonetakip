import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import { kimlikDogrula } from "@/lib/validation";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import Rozet from "@/components/ui/Rozet";
import MusteriFormu from "../MusteriFormu";
import PasifeAlDugmesi from "../PasifeAlDugmesi";

// Müşteri düzenleme sayfası.
// Kayıt yoksa ya da BAŞKA FİRMAYA aitse aynı cevap verilir: "bulunamadı" (404).
// Böylece başka firmada böyle bir kaydın var olup olmadığı da anlaşılamaz.

type SayfaProps = { params: Promise<{ id: string }> };

export default async function MusteriDuzenleSayfasi({ params }: SayfaProps) {
  const kullanici = await requireUser();
  const { id } = await params;

  const kimlik = kimlikDogrula(id);
  if (!kimlik.ok) notFound();

  const db = await getTenantDb();
  const musteri = await db.customer.findFirst({
    where: { id: kimlik.deger },
    select: { id: true, name: true, email: true, isActive: true },
  });
  if (!musteri) notFound();

  const yonetici = kullanici.role === "manager";

  return (
    <div className="space-y-8">
      <Link
        href="/musteriler"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        ← Müşterilere dön
      </Link>

      <div className="space-y-2">
        <SayfaBasligi
          baslik={musteri.name}
          aciklama="Müşteri bilgilerini düzenleyin."
        />
        {!musteri.isActive && <Rozet ton="gri">Pasif</Rozet>}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Bilgiler</h2>
        <div className="mt-4">
          <MusteriFormu
            mod="duzenle"
            musteri={{
              id: musteri.id,
              ad: musteri.name,
              eposta: musteri.email ?? "",
            }}
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Pasife alma</h2>
        <div className="mt-4">
          {yonetici ? (
            <PasifeAlDugmesi
              id={musteri.id}
              ad={musteri.name}
              aktif={musteri.isActive}
            />
          ) : (
            // Düğmeyi gizlemek yalnızca kolaylıktır. Asıl engel sunucudadır.
            <p className="text-sm text-slate-600">
              Pasife alma yalnızca firma yöneticisi tarafından yapılabilir.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}