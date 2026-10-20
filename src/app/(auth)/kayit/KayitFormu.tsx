"use client";

import { useActionState } from "react";
import { kayitAction } from "../actions";

// Giriş alanlarının ortak görünümü.
const alanSinifi =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

// Kayıt formu. Hata mesajı sunucudan gelir ve formun altında gösterilir.
export default function KayitFormu() {
  const [durum, formAction, bekliyor] = useActionState(kayitAction, {
    hata: null as string | null,
  });

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label htmlFor="firmaAdi" className="block text-sm font-medium">
          Firma adı
        </label>
        <input id="firmaAdi" name="firmaAdi" type="text" required className={alanSinifi} />
      </div>

      <div>
        <label htmlFor="adSoyad" className="block text-sm font-medium">
          Ad soyad
        </label>
        <input id="adSoyad" name="adSoyad" type="text" autoComplete="name" required className={alanSinifi} />
      </div>

      <div>
        <label htmlFor="eposta" className="block text-sm font-medium">
          E-posta
        </label>
        <input id="eposta" name="eposta" type="email" autoComplete="email" required className={alanSinifi} />
      </div>

      <div>
        <label htmlFor="parola" className="block text-sm font-medium">
          Parola (en az 8 karakter)
        </label>
        <input
          id="parola"
          name="parola"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={alanSinifi}
        />
      </div>

      {durum.hata && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {durum.hata}
        </p>
      )}

      <button
        type="submit"
        disabled={bekliyor}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {bekliyor ? "Kaydediliyor..." : "Kayıt ol"}
      </button>
    </form>
  );
}