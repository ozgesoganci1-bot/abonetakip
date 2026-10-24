"use client";

// Abonelik başlatma formu: müşteri ve plan seçilir.
// noValidate: tarayıcının kendi kontrolü kapalıdır, doğrulama sunucuda yapılır.
// Listelerde yalnızca bu firmanın AKTİF müşterileri ve planları bulunur
// (sayfa bunları getTenantDb() ile okur). Asıl kontrol yine sunucuda yapılır:
// formu elle değiştirip başka firmanın kimliğini göndermek işe yaramaz.
//
// Gün 11 (Parça B): seçim kutularının hata gösterimi PlanFormu ve FormAlani ile
// aynı yapıya getirildi: hata metni kimlik alır, role="alert" ile duyurulur ve
// kutuya aria-describedby ile bağlanır. Mesajlar değişmedi.

import Link from "next/link";
import { useActionState } from "react";
import Dugme from "@/components/ui/Dugme";
import IslemMesaji from "@/components/ui/IslemMesaji";
import { BASLANGIC_DURUMU } from "@/lib/islem";
import { ARALIK_ETIKETI, type PlanAraligi } from "@/lib/validation";
import { abonelikBaslat } from "./actions";

type Props = {
  musteriler: { id: string; ad: string }[];
  planlar: { id: string; ad: string; fiyat: number; aralik: PlanAraligi }[];
};

const SECIM_SINIFI =
  "block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2";

// Hata varsa kırmızı, yoksa normal çerçeve (PlanFormu'ndaki seçim kutusuyla aynı).
function cerceve(hata: string | undefined): string {
  return hata
    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
    : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200";
}

export default function BaslatFormu({ musteriler, planlar }: Props) {
  const [durum, formIslemi, bekliyor] = useActionState(
    abonelikBaslat,
    BASLANGIC_DURUMU
  );

  // Müşteri veya plan yoksa form gösterilmez, nedeni söylenir.
  if (musteriler.length === 0 || planlar.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        Abonelik başlatmak için önce{" "}
        {musteriler.length === 0 && (
          <Link
            href="/musteriler"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            bir müşteri
          </Link>
        )}
        {musteriler.length === 0 && planlar.length === 0 && " ve "}
        {planlar.length === 0 && (
          <Link
            href="/planlar"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            bir plan
          </Link>
        )}{" "}
        ekleyin.
      </p>
    );
  }

  const musteriHatasi = durum.alanHatalari?.musteriId;
  const planHatasi = durum.alanHatalari?.planId;

  return (
    <form action={formIslemi} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="musteriId" className="block text-sm font-medium text-slate-700">
            Müşteri
          </label>
          <select
            id="musteriId"
            name="musteriId"
            defaultValue={durum.degerler?.musteriId ?? ""}
            aria-invalid={musteriHatasi ? true : undefined}
            aria-describedby={musteriHatasi ? "musteriId-hata" : undefined}
            className={`${SECIM_SINIFI} ${cerceve(musteriHatasi)}`}
          >
            <option value="">Müşteri seçin</option>
            {musteriler.map((musteri) => (
              <option key={musteri.id} value={musteri.id}>
                {musteri.ad}
              </option>
            ))}
          </select>
          {musteriHatasi && (
            <p id="musteriId-hata" role="alert" className="text-sm text-red-600">
              {musteriHatasi}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="planId" className="block text-sm font-medium text-slate-700">
            Plan
          </label>
          <select
            id="planId"
            name="planId"
            defaultValue={durum.degerler?.planId ?? ""}
            aria-invalid={planHatasi ? true : undefined}
            aria-describedby={planHatasi ? "planId-hata" : undefined}
            className={`${SECIM_SINIFI} ${cerceve(planHatasi)}`}
          >
            <option value="">Plan seçin</option>
            {planlar.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.ad} · {plan.fiyat.toLocaleString("tr-TR")} TL ·{" "}
                {ARALIK_ETIKETI[plan.aralik]}
              </option>
            ))}
          </select>
          {planHatasi && (
            <p id="planId-hata" role="alert" className="text-sm text-red-600">
              {planHatasi}
            </p>
          )}
        </div>
      </div>

      <IslemMesaji durum={durum} />

      <Dugme type="submit" disabled={bekliyor}>
        {bekliyor ? "Başlatılıyor..." : "Aboneliği başlat"}
      </Dugme>
    </form>
  );
}