"use client";

// Planı pasife alma düğmesi. Yalnızca manager'a gösterilir.
// Asıl yetki kontrolü sunucuda, planPasifeAl() içinde yapılır.

import { useActionState } from "react";
import Dugme from "@/components/ui/Dugme";
import IslemMesaji from "@/components/ui/IslemMesaji";
import { BASLANGIC_DURUMU } from "@/lib/islem";
import { planPasifeAl } from "./actions";

type Props = { id: string; ad: string; aktif: boolean };

export default function PasifeAlDugmesi({ id, ad, aktif }: Props) {
  const [durum, formIslemi, bekliyor] = useActionState(
    planPasifeAl,
    BASLANGIC_DURUMU
  );

  return (
    <div className="space-y-3">
      {aktif ? (
        <>
          <p className="text-sm text-slate-600">
            Pasife alınan plan varsayılan listede görünmez. Kayıt silinmez,
            ancak geri aktifleştirilemez.
          </p>
          <form
            action={formIslemi}
            onSubmit={(olay) => {
              if (!window.confirm(`"${ad}" planı pasife alınsın mı? Bu işlem geri alınamaz.`)) {
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
        <p className="text-sm text-slate-600">Bu plan pasif durumda.</p>
      )}

      <IslemMesaji durum={durum} />
    </div>
  );
}