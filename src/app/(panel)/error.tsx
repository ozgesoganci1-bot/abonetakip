"use client";

// PANEL HATA EKRANI (Gün 11, Parça B)
// Panel sayfalarında beklenmeyen bir hata olursa gösterilir. Sol menü (panel
// yerleşimi) yerinde kalır, yalnızca içerik alanı bu ekranla değişir.
//
// Güvenlik: hata mesajı ve yığın izi ekrana YAZILMAZ (adres, sorgu veya veri
// sızabilir). Yalnızca Next.js'in ürettiği kısa kod (digest) gösterilir; bu kod
// sunucu günlüğündeki kayıtla eşleştirmek içindir, içinde bilgi taşımaz.
//
// "Tekrar dene": hata sunucuda olduysa (ör. veritabanına ulaşılamadı) yalnızca
// ekranı yeniden çizmek yetmez; önce sayfa verisi sunucudan yeniden istenir
// (router.refresh), sonra hata ekranı sıfırlanır (reset).

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import Dugme from "@/components/ui/Dugme";
import { MESAJ } from "@/lib/islem";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PanelHatasi({ error, reset }: Props) {
  const router = useRouter();

  function tekrarDene() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-800"
    >
      <h1 className="text-lg font-semibold">
        <span aria-hidden="true">!&nbsp;</span>Bir şeyler ters gitti
      </h1>
      <p className="mt-1 text-sm">{MESAJ.beklenmeyen}</p>
      {error.digest && (
        <p className="mt-2 text-xs text-red-700">
          Destek için kod: <code>{error.digest}</code>
        </p>
      )}
      <div className="mt-4">
        <Dugme type="button" onClick={tekrarDene}>
          Tekrar dene
        </Dugme>
      </div>
    </div>
  );
}