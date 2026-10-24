"use client";

import { useActionState } from "react";
import { girisAction } from "../actions";
import Dugme from "@/components/ui/Dugme";
import FormAlani from "@/components/ui/FormAlani";
import IslemMesaji from "@/components/ui/IslemMesaji";
import { BASLANGIC_DURUMU } from "@/lib/islem";

// Giriş formu. Hata mesajı sunucudan gelir ve formun altında gösterilir.
// Gün 11 (Parça B): panel formlarıyla aynı yapı.
//   - noValidate: tarayıcının kendi uyarı balonları kapalı; mesaj her zaman
//     sunucudan, Türkçe gelir. "required" ve "type" ekran okuyucular için kalır.
//   - Mesaj ortak IslemMesaji bileşeniyle gösterilir.
//   - Hatadan sonra e-posta korunur; parola bilerek boş kalır.
export default function GirisFormu() {
  const [durum, formAction, bekliyor] = useActionState(
    girisAction,
    BASLANGIC_DURUMU
  );

  return (
    <form action={formAction} noValidate className="mt-6 space-y-4">
      <FormAlani
        etiket="E-posta"
        name="eposta"
        type="email"
        autoComplete="email"
        defaultValue={durum.degerler?.eposta ?? ""}
        required
      />

      <FormAlani
        etiket="Parola"
        name="parola"
        type="password"
        autoComplete="current-password"
        required
      />

      <IslemMesaji durum={durum} />

      <Dugme type="submit" tamGenislik disabled={bekliyor}>
        {bekliyor ? "Giriş yapılıyor..." : "Giriş yap"}
      </Dugme>
    </form>
  );
}