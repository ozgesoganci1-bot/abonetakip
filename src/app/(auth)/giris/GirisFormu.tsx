"use client";

import { useActionState } from "react";
import { girisAction } from "../actions";
import Dugme from "@/components/ui/Dugme";
import FormAlani from "@/components/ui/FormAlani";

// Giriş formu. Hata mesajı sunucudan gelir ve formun altında gösterilir.
export default function GirisFormu() {
  const [durum, formAction, bekliyor] = useActionState(girisAction, {
    hata: null as string | null,
  });

  return (
    <form action={formAction} className="mt-6 space-y-4">
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
        autoComplete="current-password"
        required
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
        {bekliyor ? "Giriş yapılıyor..." : "Giriş yap"}
      </Dugme>
    </form>
  );
}