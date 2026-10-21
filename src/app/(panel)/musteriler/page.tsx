import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import BosDurum from "@/components/ui/BosDurum";
import Rozet from "@/components/ui/Rozet";
import MusteriFormu from "./MusteriFormu";

// Müşteri listesi ve yeni müşteri formu. manager ve finance görebilir.
// "?pasif=1" yalnızca görünüm filtresidir; kiracı filtresi getTenantDb() ile
// her durumda otomatik uygulanır.

type SayfaProps = {
  searchParams: Promise<{ pasif?: string | string[] }>;
};

export default async function MusterilerSayfasi({ searchParams }: SayfaProps) {
  await requireUser();
  const { pasif } = await searchParams;
  const pasifleriGoster = pasif === "1";

  const db = await getTenantDb();
  const musteriler = await db.customer.findMany({
    where: pasifleriGoster ? {} : { isActive: true },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    select: { id: true, name: true, email: true, isActive: true },
  });

  return (
    <div className="space-y-8">
      <SayfaBasligi
        baslik="Müşteriler"
        aciklama="Firmanızın müşteri kayıtları."
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Yeni müşteri</h2>
        <div className="mt-4">
          <MusteriFormu mod="ekle" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">
            Müşteri listesi ({musteriler.length})
          </h2>
          <Link
            href={pasifleriGoster ? "/musteriler" : "/musteriler?pasif=1"}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            {pasifleriGoster ? "Pasifleri gizle" : "Pasifleri göster"}
          </Link>
        </div>

        {musteriler.length === 0 ? (
          <BosDurum
            baslik="Henüz müşteri yok"
            aciklama={
              pasifleriGoster
                ? "Bu firmada kayıtlı müşteri bulunmuyor."
                : "Yukarıdaki formdan ilk müşterinizi ekleyin."
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Ad</th>
                  <th className="px-4 py-3 font-medium">E-posta</th>
                  <th className="px-4 py-3 font-medium">Durum</th>
                  <th className="px-4 py-3">
                    <span className="sr-only">İşlemler</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {musteriler.map((musteri) => (
                  <tr key={musteri.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {musteri.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {musteri.email ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Rozet ton={musteri.isActive ? "indigo" : "gri"}>
                        {musteri.isActive ? "Aktif" : "Pasif"}
                      </Rozet>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/musteriler/${musteri.id}`}
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