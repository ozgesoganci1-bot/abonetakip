import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import GirisFormu from "./GirisFormu";

// Giriş sayfası. Zaten giriş yapmış kullanıcı bu sayfayı görmez.
export default async function GirisSayfasi() {
  const kullanici = await getCurrentUser();
  if (kullanici) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 text-gray-900">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold">AboneTakip girişi</h1>
        <p className="mt-1 text-sm text-gray-600">
          E-posta ve parolanızla giriş yapın.
        </p>

        <GirisFormu />

        <p className="mt-6 text-center text-sm text-gray-600">
          Hesabınız yok mu?{" "}
          <Link href="/kayit" className="font-medium text-blue-600 hover:underline">
            Kayıt olun
          </Link>
        </p>
      </div>
    </main>
  );
}