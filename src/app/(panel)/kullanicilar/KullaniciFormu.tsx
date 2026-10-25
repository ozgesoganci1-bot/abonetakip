"use client";

// Kullanıcı ekleme formu (Gün 14). Yalnızca manager'a gösterilir.
// noValidate: tarayıcının kendi kontrolü kapalıdır. Bütün doğrulama sunucuda
// yapılır ve Türkçe mesajlar her zaman aynı yerden gelir (MusteriFormu ile aynı yapı).
// Formda rol alanı YOKTUR: eklenen kullanıcı her zaman finance olur, rolü sunucu yazar.
// Hatadan sonra ad soyad ve e-posta korunur; parola bilerek boş kalır.

import { useActionState } from "react";
import FormAlani from "@/components/ui/FormAlani";
import Dugme from "@/components/ui/Dugme";
import IslemMesaji from "@/components/ui/IslemMesaji";
import { BASLANGIC_DURUMU } from "@/lib/islem";
import { kullaniciEkle } from "./actions";

export default function KullaniciFormu() {
  const [durum, formIslemi, bekliyor] = useActionState(kullaniciEkle, BASLANGIC_DURUMU);

  // İşlemden dönen değer varsa onu, yoksa boş metni kullan. Parola burada yok.
  const deger = (alan: "adSoyad" | "eposta") => durum.degerler?.[alan] ?? "";

  return (
    <form action={formIslemi} noValidate className="space-y-4">
      <p className="text-sm text-slate-500">
        Eklenen kullanıcı finans rolüyle açılır: müşteri, plan ve abonelik kayıtlarını
        yönetir ve dashboard&apos;u görür. Ayarlara ve kullanıcılara erişemez.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormAlani
          etiket="Ad soyad"
          name="adSoyad"
          defaultValue={deger("adSoyad")}
          hata={durum.alanHatalari?.adSoyad}
          maxLength={100}
          autoComplete="off"
        />
        <FormAlani
          etiket="E-posta"
          name="eposta"
          type="email"
          defaultValue={deger("eposta")}
          hata={durum.alanHatalari?.eposta}
          yardim="Kullanıcı bu e-postayla giriş yapar. Bir e-posta yalnızca tek bir hesapta kullanılabilir."
          autoComplete="off"
        />
      </div>

      <FormAlani
        etiket="Parola"
        name="parola"
        type="password"
        hata={durum.alanHatalari?.parola}
        yardim="En az 8 karakter. Parolayı kullanıcıya güvenli bir yoldan iletin."
        autoComplete="new-password"
      />

      <IslemMesaji durum={durum} />

      <Dugme type="submit" disabled={bekliyor}>
        {bekliyor ? "Ekleniyor..." : "Kullanıcı ekle"}
      </Dugme>
    </form>
  );
}