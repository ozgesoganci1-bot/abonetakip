"use client";

// CAC (müşteri edinme maliyeti) ayar formu. Yalnızca manager'a gösterilir.
// noValidate: tarayıcının kendi kontrolü kapalıdır. Bütün doğrulama sunucuda
// yapılır ve Türkçe mesajlar her zaman aynı yerden gelir (MusteriFormu ile aynı yapı).

import { useActionState } from "react";
import FormAlani from "@/components/ui/FormAlani";
import Dugme from "@/components/ui/Dugme";
import IslemMesaji from "@/components/ui/IslemMesaji";
import { BASLANGIC_DURUMU } from "@/lib/islem";
import { cacKaydet } from "./actions";

type Props = {
  mevcutCac: number; // veritabanındaki değer (0 = girilmedi)
};

export default function CacFormu({ mevcutCac }: Props) {
  const [durum, formIslemi, bekliyor] = useActionState(cacKaydet, BASLANGIC_DURUMU);

  // İşlemden dönen değer varsa onu, yoksa kayıtlı değeri göster.
  const deger = durum.degerler?.cac ?? String(mevcutCac);

  return (
    <form action={formIslemi} noValidate className="space-y-4">
      <FormAlani
        etiket="Müşteri edinme maliyeti (TL)"
        name="cac"
        inputMode="numeric"
        defaultValue={deger}
        hata={durum.alanHatalari?.cac}
        yardim="Bir yeni müşteri kazanmak için harcanan ortalama tutar. Tam sayı yazın (ör. 5000). 0 yazarsanız CAC girilmemiş sayılır."
        autoComplete="off"
      />

      <IslemMesaji durum={durum} />

      <Dugme type="submit" disabled={bekliyor}>
        {bekliyor ? "Kaydediliyor..." : "CAC'yi kaydet"}
      </Dugme>
    </form>
  );
}