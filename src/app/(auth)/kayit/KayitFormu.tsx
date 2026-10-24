"use client";

import { useActionState } from "react";
import { kayitAction } from "../actions";
import Dugme from "@/components/ui/Dugme";
import FormAlani from "@/components/ui/FormAlani";
import IslemMesaji from "@/components/ui/IslemMesaji";
import { BASLANGIC_DURUMU } from "@/lib/islem";

// Kayıt formu. Hata mesajı sunucudan gelir ve formun altında gösterilir.
// Gün 11 (Parça B): panel formlarıyla aynı yapı.
//   - noValidate: tarayıcının kendi uyarı balonları kapalı; mesaj her zaman
//     sunucudan, Türkçe gelir. "required", "type" ve "minLength" ekran okuyucular
//     ve parola yöneticileri için kalır.
//   - Mesaj ortak IslemMesaji bileşeniyle gösterilir.
//   - Hatadan sonra firma adı, ad soyad ve e-posta korunur; parola bilerek boş kalır.
export default function KayitFormu() {
  const [durum, formAction, bekliyor] = useActionState(
    kayitAction,
    BASLANGIC_DURUMU
  );

  const deger = (alan: "firmaAdi" | "adSoyad" | "eposta") =>
    durum.degerler?.[alan] ?? "";

  return (
    <form action={formAction} noValidate className="mt-6 space-y-4">
      <FormAlani
        etiket="Firma adı"
        name="firmaAdi"
        type="text"
        defaultValue={deger("firmaAdi")}
        required
      />

      <FormAlani
        etiket="Ad soyad"
        name="adSoyad"
        type="text"
        autoComplete="name"
        defaultValue={deger("adSoyad")}
        required
      />

      <FormAlani
        etiket="E-posta"
        name="eposta"
        type="email"
        autoComplete="email"
        defaultValue={deger("eposta")}
        required
      />

      <FormAlani
        etiket="Parola"
        name="parola"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        yardim="En az 8 karakter olmalıdır."
      />

      <IslemMesaji durum={durum} />

      <Dugme type="submit" tamGenislik disabled={bekliyor}>
        {bekliyor ? "Kaydediliyor..." : "Kayıt ol"}
      </Dugme>
    </form>
  );
}