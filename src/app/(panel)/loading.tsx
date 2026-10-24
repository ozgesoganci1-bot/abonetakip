// PANEL YÜKLENME EKRANI (Gün 11, Parça B)
// Panel sayfaları sunucuda hazırlanırken gösterilir. Sol menü yerinde kalır.
// Tek dosya bütün panel sayfalarını kapsar (sayfa başına ayrı dosya yok).
// Erişilebilirlik: görünür "Yükleniyor…" metni role="status" ile duyurulur;
// iskelet kutuları ekran okuyucudan gizlenir; hareket azaltma tercihinde
// yanıp sönme kapanır.
// Bilinen sınır (ADR K11.10): bu dosya sayfayı akışla gönderdiği için panel
// içinde notFound() çağrılan sayfalar 404 yerine 200 kodu alabilir. Var olmayan
// kayıt ile başka firmanın kaydı yine aynı kodu ve aynı ekranı alır.

export default function PanelYukleniyor() {
  return (
    <div className="space-y-6">
      <p role="status" className="text-sm text-slate-500">
        Yükleniyor…
      </p>
      <div
        aria-hidden="true"
        className="animate-pulse space-y-6 motion-reduce:animate-none"
      >
        <div className="space-y-2">
          <div className="h-7 w-48 rounded bg-slate-200" />
          <div className="h-4 w-72 max-w-full rounded bg-slate-200" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-32 rounded-xl border border-slate-200 bg-white" />
          <div className="h-32 rounded-xl border border-slate-200 bg-white" />
        </div>
        <div className="h-48 rounded-xl border border-slate-200 bg-white" />
      </div>
    </div>
  );
}