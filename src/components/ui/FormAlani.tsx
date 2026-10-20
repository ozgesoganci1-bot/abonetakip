import type { InputHTMLAttributes } from "react";

// Etiketli giriş kutusu. Hata varsa kırmızı çerçeve ve hata mesajı gösterir.
type FormAlaniProps = InputHTMLAttributes<HTMLInputElement> & {
  etiket: string;
  name: string;
  hata?: string | null;
  yardim?: string;
};

export default function FormAlani({
  etiket,
  name,
  hata,
  yardim,
  className = "",
  ...diger
}: FormAlaniProps) {
  const hataId = `${name}-hata`;
  const yardimId = `${name}-yardim`;
  const aciklamaId = hata ? hataId : yardim ? yardimId : undefined;

  const cerceve = hata
    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
    : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200";

  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {etiket}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={hata ? true : undefined}
        aria-describedby={aciklamaId}
        className={`block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 ${cerceve} ${className}`}
        {...diger}
      />
      {yardim && !hata && (
        <p id={yardimId} className="text-xs text-slate-500">
          {yardim}
        </p>
      )}
      {hata && (
        <p id={hataId} role="alert" className="text-sm text-red-600">
          {hata}
        </p>
      )}
    </div>
  );
}