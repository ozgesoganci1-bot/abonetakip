"use client";

// Plan ekleme ve düzenleme için ortak form.
// kilitli: plana bağlı abonelik varsa (iptal edilmişler dahil) fiyat ve aralık salt okunur gösterilir.
// Bu yalnızca kolaylıktır; asıl engel sunucudaki planGuncelle() içindedir.

import { useActionState } from "react";
import FormAlani from "@/components/ui/FormAlani";
import Dugme from "@/components/ui/Dugme";
import IslemMesaji from "@/components/ui/IslemMesaji";
import { BASLANGIC_DURUMU } from "@/lib/islem";
import { ARALIK_ETIKETI, PLAN_ARALIKLARI, type PlanAraligi } from "@/lib/validation";
import { planEkle, planGuncelle } from "./actions";

type Props =
  | { mod: "ekle" }
  | {
      mod: "duzenle";
      plan: { id: string; ad: string; fiyat: string; aralik: PlanAraligi };
      kilitli: boolean;
    };

export default function PlanFormu(props: Props) {
  const islem = props.mod === "ekle" ? planEkle : planGuncelle;
  const [durum, formIslemi, bekliyor] = useActionState(islem, BASLANGIC_DURUMU);

  const kilitli = props.mod === "duzenle" && props.kilitli;
  const ilk =
    props.mod === "duzenle"
      ? { ad: props.plan.ad, fiyat: props.plan.fiyat, aralik: props.plan.aralik }
      : { ad: "", fiyat: "", aralik: "MONTHLY" };

  const deger = (alan: "ad" | "fiyat" | "aralik") =>
    durum.degerler?.[alan] ?? ilk[alan];

  const aralikHatasi = durum.alanHatalari?.aralik;
  const aralikCerceve = aralikHatasi
    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
    : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200";

  return (
    <form action={formIslemi} noValidate className="space-y-4">
      {props.mod === "duzenle" && (
        <input type="hidden" name="id" value={props.plan.id} />
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <FormAlani
          etiket="Plan adı"
          name="ad"
          defaultValue={deger("ad")}
          hata={durum.alanHatalari?.ad}
          maxLength={100}
          autoComplete="off"
        />

        {/* type="text": tarayıcı eksi veya ondalıklı değeri silmesin, kontrolü sunucu yapsın */}
        <FormAlani
          etiket="Fiyat (TL)"
          name="fiyat"
          type="text"
          inputMode="numeric"
          defaultValue={deger("fiyat")}
          hata={durum.alanHatalari?.fiyat}
          readOnly={kilitli}
          yardim={
            kilitli
              ? "Plana bağlı abonelikler olduğu için (iptal edilmişler dahil) değiştirilemez. Yeni fiyat için yeni plan oluşturun."
              : "Tam sayı, kuruş yok (ör. 1000)."
          }
          autoComplete="off"
        />

        <div className="space-y-1.5">
          <label htmlFor="aralik" className="block text-sm font-medium text-slate-700">
            Aralık
          </label>
          <select
            id="aralik"
            name="aralik"
            defaultValue={deger("aralik")}
            disabled={kilitli}
            aria-invalid={aralikHatasi ? true : undefined}
            aria-describedby={aralikHatasi ? "aralik-hata" : undefined}
            className={`block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 ${aralikCerceve}`}
          >
            {PLAN_ARALIKLARI.map((aralik) => (
              <option key={aralik} value={aralik}>
                {ARALIK_ETIKETI[aralik]}
              </option>
            ))}
          </select>
          {/* Devre dışı alanlar forma eklenmez; kilitliyken değer gizli alanla gönderilir. */}
          {kilitli && <input type="hidden" name="aralik" value={deger("aralik")} />}
          {aralikHatasi && (
            <p id="aralik-hata" role="alert" className="text-sm text-red-600">
              {aralikHatasi}
            </p>
          )}
        </div>
      </div>

      <IslemMesaji durum={durum} />

      <Dugme type="submit" disabled={bekliyor}>
        {bekliyor
          ? "Kaydediliyor..."
          : props.mod === "ekle"
            ? "Plan ekle"
            : "Değişiklikleri kaydet"}
      </Dugme>
    </form>
  );
}