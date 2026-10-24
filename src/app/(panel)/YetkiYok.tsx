import Link from "next/link";

// YETKİSİZ ERİŞİM
// Finance kullanıcısı yalnızca manager'a açık bir sayfaya (Ayarlar, Kullanıcılar)
// girerse gösterilir. Rol kontrolü sayfada, SUNUCUDA ve veri okunmadan ÖNCE yapılır
// (requireManager); bu bileşen yalnızca mesajı gösterir.
// Gün 11 (Parça B): yönlendirme cümlesi ve Dashboard bağlantısı eklendi.
// Bilinen sınır: yanıt HTTP 200 döner, 403 değil (ADR K11.8).
export default function YetkiYok() {
  return (
    <div className="space-y-4">
      <div
        role="alert"
        className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900"
      >
        <h1 className="text-lg font-semibold">Bu sayfaya erişim yetkiniz yok</h1>
        <p className="mt-1 text-sm">
          Bu sayfayı yalnızca firma yöneticisi (manager) görüntüleyebilir. Bir
          değişiklik gerekiyorsa firma yöneticinize başvurun.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        ← Dashboard&apos;a dön
      </Link>
    </div>
  );
}