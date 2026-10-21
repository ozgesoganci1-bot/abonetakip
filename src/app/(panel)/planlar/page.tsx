import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import { ARALIK_ETIKETI } from "@/lib/validation";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import BosDurum from "@/components/ui/BosDurum";
import Rozet from "@/components/ui/Rozet";
import PlanFormu from "./PlanFormu";

// Plan listesi ve yeni plan formu. manager ve finance görebilir.

type SayfaProps = {
  searchParams: Promise<{ pasif?: string | string[] }>;
};

// 12500 -> "12.500 TL"
function tlBicimle(tutar: number): string {
  return `${new Intl.NumberFormat("tr-TR").format(tutar)} TL`;
}

export default async function PlanlarSayfasi({ searchParams }: SayfaProps) {
  await requireUser();
  const { pasif } = await searchParams;
  const pasifleriGoster = pasif === "1";

  const db = await getTenantDb();
  const planlar = await db.plan.findMany({
    where: pasifleriGoster ? {} : { isActive: true },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    select: { id: true, name: true, price: true, interval: true, isActive: true },
  });

  return (
    <div className="space-y-8">
      <SayfaBasligi
        baslik="Planlar"
        aciklama="Müşterilerinize sunduğunuz abonelik planları."
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Yeni plan</h2>
        <div className="mt-4">
          <PlanFormu mod="ekle" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">
            Plan listesi ({planlar.length})
          </h2>
          <Link
            href={pasifleriGoster ? "/planlar" : "/planlar?pasif=1"}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            {pasifleriGoster ? "Pasifleri gizle" : "Pasifleri göster"}
          </Link>
        </div>

        {planlar.length === 0 ? (
          <BosDurum
            baslik="Henüz plan yok"
            aciklama={
              pasifleriGoster
                ? "Bu firmada kayıtlı plan bulunmuyor."
                : "Yukarıdaki formdan ilk planınızı ekleyin."
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Ad</th>
                  <th className="px-4 py-3 font-medium">Fiyat</th>
                  <th className="px-4 py-3 font-medium">Aralık</th>
                  <th className="px-4 py-3 font-medium">Durum</th>
                  <th className="px-4 py-3">
                    <span className="sr-only">İşlemler</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {planlar.map((plan) => (
                  <tr key={plan.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {plan.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {tlBicimle(plan.price)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {ARALIK_ETIKETI[plan.interval]}
                    </td>
                    <td className="px-4 py-3">
                      <Rozet ton={plan.isActive ? "indigo" : "gri"}>
                        {plan.isActive ? "Aktif" : "Pasif"}
                      </Rozet>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/planlar/${plan.id}`}
                        className="font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Düzenle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}