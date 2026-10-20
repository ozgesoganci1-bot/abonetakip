// Finance kullanıcısı yalnızca manager'a açık bir sayfaya girerse gösterilir.
export default function YetkiYok() {
  return (
    <div
      role="alert"
      className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900"
    >
      <h1 className="text-lg font-semibold">Bu sayfaya erişim yetkiniz yok</h1>
      <p className="mt-1 text-sm">
        Bu sayfayı yalnızca firma yöneticisi (manager) görüntüleyebilir.
      </p>
    </div>
  );
}