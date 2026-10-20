"use client";

import { useActionState } from "react";
import { kayitAction } from "../actions";
import Dugme from "@/components/ui/Dugme";
import FormAlani from "@/components/ui/FormAlani";

// Kayıt formu. Hata mesajı sunucudan gelir ve formun altında gösterilir.
export default function KayitFormu() {
  const [durum, formAction, bekliyor] = useActionState(kayitAction, {
    hata: null as string | null,
  });

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <FormAlani etiket="Firma adı" name="firmaAdi" type="text" required />

      <FormAlani
        etiket="Ad soyad"
        name="adSoyad"
        type="text"
        autoComplete="name"
        required
      />

      <FormAlani
        etiket="E-posta"
        name="eposta"
        type="email"
        autoComplete="email"
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

      {durum.hata && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {durum.hata}
        </p>
      )}

      <Dugme type="submit" tamGenislik disabled={bekliyor}>
        {bekliyor ? "Kaydediliyor..." : "Kayıt ol"}
      </Dugme>
    </form>
  );
}