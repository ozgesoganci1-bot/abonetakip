import type { ReactNode } from "react";
import Kart from "@/components/ui/Kart";

// Tek bir KPI kartı: başlık, dönem, değer, kısa açıklama.
// Değer hesaplanamadıysa (null) sayı yerine "—" ve nedeni gösterilir.
// "NaN" veya "Infinity" hiçbir zaman görünmez: değer ya biçimlenmiş metin ya da null gelir.
type KpiKartiProps = {
  baslik: string;
  donem: string; // "Bugün" ya da "Ay başından bugüne"
  deger: string | null; // biçimlenmiş metin; null = hesaplanamadı
  neden?: ReactNode; // deger null ise gösterilir
  durum?: ReactNode; // ör. "Sağlıklı" / "Dikkat" rozeti
  ekBilgi?: string; // ör. hesabın bileşenleri
  aciklama: string; // metriğin tek cümlelik tanımı
};

export default function KpiKarti({
  baslik,
  donem,
  deger,
  neden,
  durum,
  ekBilgi,
  aciklama,
}: KpiKartiProps) {
  return (
    <Kart className="flex flex-col">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-medium text-slate-600">{baslik}</h2>
        <span className="text-xs text-slate-400">{donem}</span>
      </div>

      {deger !== null ? (
        <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
          {deger}
        </p>
      ) : (
        <>
          <p className="mt-2 text-3xl font-semibold text-slate-300">
            <span aria-hidden="true">—</span>
            <span className="sr-only">Hesaplanamadı</span>
          </p>
          {neden && <p className="mt-1 text-sm text-slate-700">{neden}</p>}
        </>
      )}

      {durum && <div className="mt-2">{durum}</div>}
      {ekBilgi && <p className="mt-2 text-xs text-slate-500 tabular-nums">{ekBilgi}</p>}

      <p className="mt-auto pt-4 text-sm text-slate-500">{aciklama}</p>
    </Kart>
  );
}