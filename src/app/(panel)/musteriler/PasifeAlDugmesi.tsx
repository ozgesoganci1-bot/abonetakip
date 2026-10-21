"use client";

// Müşteriyi pasife alma düğmesi. Yalnızca manager'a gösterilir.
// Asıl yetki kontrolü sunucuda, musteriPasifeAl() içinde yapılır.
// Kayıt pasife alındıktan sonra da bu bileşen yerinde kalır; böylece
// başarı mesajı ekranda görünmeye devam eder.

import { useActionState } from "react";
import Dugme from "@/components/ui/Dugme";
import IslemMesaji from "@/components/ui/IslemMesaji";
import { BASLANGIC_DURUMU } from "@/lib/islem";
import { musteriPasifeAl } from "./actions";

type Props = { id: string; ad: string; aktif: boolean };

export default function PasifeAlDugmesi({ id, ad, aktif }: Props) {
  const [durum, formIslemi, bekliyor] = useActionState(
    musteriPasifeAl,
    BASLANGIC_DURUMU
  );

  return (
    <div className="space-y-3">
      {aktif ? (
        <>
          <p className="text-sm text-slate-600">
            Pasife alınan müşteri varsayılan listede görünmez. Kayıt silinmez,
            ancak geri aktifleştirilemez.
          </p>
          <form
            action={formIslemi}
            onSubmit={(olay) => {
              // Kullanıcı onay vermezse form gönderilmez.
              if (!window.confirm(`"${ad}" müşterisi pasife alınsın mı? Bu işlem geri alınamaz.`)) {
                olay.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={id} />
            <Dugme type="submit" gorunum="tehlike" disabled={bekliyor}>
              {bekliyor ? "İşleniyor..." : "Pasife al"}
            </Dugme>
          </form>
        </>
      ) : (
        <p className="text-sm text-slate-600">Bu müşteri pasif durumda.</p>
      )}

      <IslemMesaji durum={durum} />
    </div>
  );
}