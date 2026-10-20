import type { ReactNode } from "react";

// "Henüz kayıt yok" gibi boş sayfa kutusu
type BosDurumProps = {
  baslik: string;
  aciklama?: string;
  children?: ReactNode;
};

export default function BosDurum({ baslik, aciklama, children }: BosDurumProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <p className="text-base font-medium text-slate-900">{baslik}</p>
      {aciklama && <p className="mt-1 text-sm text-slate-500">{aciklama}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}