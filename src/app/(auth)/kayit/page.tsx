import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import KayitFormu from "./KayitFormu";

// Kayıt sayfası. Zaten giriş yapmış kullanıcı bu sayfayı görmez.
export default async function KayitSayfasi() {
  const kullanici = await getCurrentUser();
  if (kullanici) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 text-gray-900">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold">AboneTakip hesabı oluşturun</h1>
        <p className="mt-1 text-sm text-gray-600">
          Firmanız için hesap açın. İlk kullanıcı yönetici (manager) olur.
        </p>

        <KayitFormu />

        <p className="mt-6 text-center text-sm text-gray-600">
          Zaten hesabınız var mı?{" "}
          <Link href="/giris" className="font-medium text-blue-600 hover:underline">
            Giriş yapın
          </Link>
        </p>
      </div>
    </main>
  );
}