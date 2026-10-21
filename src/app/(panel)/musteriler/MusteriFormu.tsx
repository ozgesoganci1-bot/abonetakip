"use client";

// Müşteri ekleme ve düzenleme için ortak form.
// noValidate: tarayıcının kendi kontrolü kapalıdır. Böylece bütün doğrulama
// sunucuda yapılır ve Türkçe mesajlar her zaman aynı yerden gelir.

import { useActionState } from "react";
import FormAlani from "@/components/ui/FormAlani";
import Dugme from "@/components/ui/Dugme";
import IslemMesaji from "@/components/ui/IslemMesaji";
import { BASLANGIC_DURUMU } from "@/lib/islem";
import { musteriEkle, musteriGuncelle } from "./actions";

type Props =
  | { mod: "ekle" }
  | { mod: "duzenle"; musteri: { id: string; ad: string; eposta: string } };

export default function MusteriFormu(props: Props) {
  const islem = props.mod === "ekle" ? musteriEkle : musteriGuncelle;
  const [durum, formIslemi, bekliyor] = useActionState(islem, BASLANGIC_DURUMU);

  // Formun ilk değerleri: düzenlemede kayıttaki bilgiler, eklemede boş.
  const ilk =
    props.mod === "duzenle"
      ? { ad: props.musteri.ad, eposta: props.musteri.eposta }
      : { ad: "", eposta: "" };

  // İşlemden dönen değer varsa onu, yoksa ilk değeri kullan.
  const deger = (alan: "ad" | "eposta") => durum.degerler?.[alan] ?? ilk[alan];

  return (
    <form action={formIslemi} noValidate className="space-y-4">
      {props.mod === "duzenle" && (
        <input type="hidden" name="id" value={props.musteri.id} />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormAlani
          etiket="Müşteri adı"
          name="ad"
          defaultValue={deger("ad")}
          hata={durum.alanHatalari?.ad}
          maxLength={100}
          autoComplete="off"
        />
        <FormAlani
          etiket="E-posta (isteğe bağlı)"
          name="eposta"
          type="email"
          defaultValue={deger("eposta")}
          hata={durum.alanHatalari?.eposta}
          yardim="Aynı firmada iki müşteri aynı e-postayı kullanamaz."
          autoComplete="off"
        />
      </div>

      <IslemMesaji durum={durum} />

      <Dugme type="submit" disabled={bekliyor}>
        {bekliyor
          ? "Kaydediliyor..."
          : props.mod === "ekle"
            ? "Müşteri ekle"
            : "Değişiklikleri kaydet"}
      </Dugme>
    </form>
  );
}