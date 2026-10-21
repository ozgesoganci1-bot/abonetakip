import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import { ARALIK_ETIKETI } from "@/lib/validation";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import BosDurum from "@/components/ui/BosDurum";
import Rozet from "@/components/ui/Rozet";
import BaslatFormu from "./BaslatFormu";
import SatirIslemleri from "./SatirIslemleri";

// Abonelik listesi ve yeni abonelik formu. manager ve finance görebilir ve
// işlem yapabilir. "?durum=" yalnızca görünüm filtresidir; kiracı filtresi
// getTenantDb() ile her durumda otomatik uygulanır.

type SayfaProps = {
  searchParams: Promise<{ durum?: string | string[] }>;
};

// Tarihler UTC olarak saklanır, ekranda Türkiye saatine göre gösterilir.
const TARIH = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "medium",
  timeZone: "Europe/Istanbul",
});

const FILTRELER = [
  { deger: undefined, etiket: "Tümü", href: "/abonelikler" },
  { deger: "ACTIVE", etiket: "Aktif", href: "/abonelikler?durum=ACTIVE" },
  { deger: "CANCELED", etiket: "İptal edilmiş", href: "/abonelikler?durum=CANCELED" },
] as const;

export default async function AboneliklerSayfasi({ searchParams }: SayfaProps) {
  await requireUser();
  const { durum } = await searchParams;

  // Yalnızca bilinen iki değer kabul edilir, gerisi "tümü" sayılır.
  const durumDegeri = Array.isArray(durum) ? durum[0] : durum;
  const filtre =
    durumDegeri === "ACTIVE" || durumDegeri === "CANCELED"
      ? durumDegeri
      : undefined;

  const db = await getTenantDb();
  const [abonelikler, musteriler, planlar] = await Promise.all([
    db.subscription.findMany({
      where: filtre ? { status: filtre } : {},
      orderBy: [{ status: "asc" }, { startedAt: "desc" }],
      select: {
        id: true,
        status: true,
        startedAt: true,
        currentPeriodEnd: true,
        canceledAt: true,
        customer: { select: { name: true } },
        plan: { select: { name: true, price: true, interval: true } },
      },
    }),
    // Yeni abonelik formunda yalnızca aktif müşteriler ve planlar listelenir.
    db.customer.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    db.plan.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, price: true, interval: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <SayfaBasligi
        baslik="Abonelikler"
        aciklama="Başlatılan, yenilenen ve iptal edilen abonelikler."
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Yeni abonelik</h2>
        <div className="mt-4">
          <BaslatFormu
            musteriler={musteriler.map((m) => ({ id: m.id, ad: m.name }))}
            planlar={planlar.map((p) => ({
              id: p.id,
              ad: p.name,
              fiyat: p.price,
              aralik: p.interval,
            }))}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">
            Abonelik listesi ({abonelikler.length})
          </h2>
          <nav className="flex gap-4 text-sm" aria-label="Duruma göre filtre">
            {FILTRELER.map((f) => (
              <Link
                key={f.etiket}
                href={f.href}
                className={
                  f.deger === filtre
                    ? "font-semibold text-slate-900"
                    : "font-medium text-indigo-600 hover:text-indigo-700"
                }
              >
                {f.etiket}
              </Link>
            ))}
          </nav>
        </div>

        {abonelikler.length === 0 ? (
          <BosDurum
            baslik="Henüz abonelik yok"
            aciklama={
              filtre
                ? "Bu filtreyle eşleşen abonelik bulunmuyor."
                : "Yukarıdaki formdan ilk aboneliği başlatın."
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Müşteri</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Durum</th>
                  <th className="px-4 py-3 font-medium">Başlangıç</th>
                  <th className="px-4 py-3 font-medium">Dönem bitişi</th>
                  <th className="px-4 py-3">
                    <span className="sr-only">İşlemler</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {abonelikler.map((abonelik) => {
                  const aktif = abonelik.status === "ACTIVE";
                  return (
                    <tr key={abonelik.id} className="align-top">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {abonelik.customer.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {abonelik.plan.name}
                        <span className="block text-xs text-slate-500">
                          {abonelik.plan.price.toLocaleString("tr-TR")} TL ·{" "}
                          {ARALIK_ETIKETI[abonelik.plan.interval]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Rozet ton={aktif ? "indigo" : "gri"}>
                          {aktif ? "Aktif" : "İptal edilmiş"}
                        </Rozet>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {TARIH.format(abonelik.startedAt)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {TARIH.format(abonelik.currentPeriodEnd)}
                        {abonelik.canceledAt && (
                          <span className="block text-xs text-slate-500">
                            İptal: {TARIH.format(abonelik.canceledAt)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <SatirIslemleri
                          id={abonelik.id}
                          musteriAdi={abonelik.customer.name}
                          aktif={aktif}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
