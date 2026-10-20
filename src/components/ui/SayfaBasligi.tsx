import type { ReactNode } from "react";

// Sayfa başlığı, alt açıklama ve sağda isteğe bağlı işlem düğmeleri alanı
type SayfaBasligiProps = {
  baslik: string;
  aciklama?: string;
  children?: ReactNode;
};

export default function SayfaBasligi({
  baslik,
  aciklama,
  children,
}: SayfaBasligiProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {baslik}
        </h1>
        {aciklama && <p className="mt-1 text-sm text-slate-500">{aciklama}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}