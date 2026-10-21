"use client";

// Abonelik satırındaki Yenile ve İptal düğmeleri.
// Asıl yetki ve durum kontrolü sunucuda (actions.ts) yapılır; düğmenin görünmesi
// yetki sayılmaz. Bu bileşen işlemden sonra da yerinde kalır, böylece başarı veya
// hata mesajı ekranda görünmeye devam eder.

import { useActionState } from "react";
import Dugme from "@/components/ui/Dugme";
import IslemMesaji from "@/components/ui/IslemMesaji";
import { BASLANGIC_DURUMU } from "@/lib/islem";
import { abonelikIptal, abonelikYenile } from "./actions";

type Props = { id: string; musteriAdi: string; aktif: boolean };

export default function SatirIslemleri({ id, musteriAdi, aktif }: Props) {
  const [yenileDurum, yenileIslemi, yenileBekliyor] = useActionState(
    abonelikYenile,
    BASLANGIC_DURUMU
  );
  const [iptalDurum, iptalIslemi, iptalBekliyor] = useActionState(
    abonelikIptal,
    BASLANGIC_DURUMU
  );

  // İşlem sürerken iki düğme de kapanır: çift tıklamayı sınırlar.
  const bekliyor = yenileBekliyor || iptalBekliyor;

  return (
    <div className="space-y-2">
      {aktif ? (
        <div className="flex justify-end gap-2">
          <form action={yenileIslemi}>
            <input type="hidden" name="id" value={id} />
            <Dugme type="submit" disabled={bekliyor}>
              {yenileBekliyor ? "Yenileniyor..." : "Yenile"}
            </Dugme>
          </form>

          <form
            action={iptalIslemi}
            onSubmit={(olay) => {
              // Kullanıcı onay vermezse form gönderilmez.
              if (
                !window.confirm(
                  `"${musteriAdi}" aboneliği iptal edilsin mi? İptal edilen abonelik yenilenemez.`
                )
              ) {
                olay.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={id} />
            <Dugme type="submit" gorunum="tehlike" disabled={bekliyor}>
              {iptalBekliyor ? "İptal ediliyor..." : "İptal et"}
            </Dugme>
          </form>
        </div>
      ) : (
        <p className="text-right text-sm text-slate-400">—</p>
      )}

      <IslemMesaji durum={yenileDurum} />
      <IslemMesaji durum={iptalDurum} />
    </div>
  );
}
