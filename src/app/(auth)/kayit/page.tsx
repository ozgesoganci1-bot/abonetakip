import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Kart from "@/components/ui/Kart";
import KayitFormu from "./KayitFormu";

// Kayıt sayfası. Zaten giriş yapmış kullanıcı bu sayfayı görmez.
export default async function KayitSayfasi() {
  const kullanici = await getCurrentUser();
  if (kullanici) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-indigo-600">
          AboneTakip
        </p>

        <Kart className="p-8">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Hesap oluşturun
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Firmanız için hesap açın. İlk kullanıcı yönetici (manager) olur.
          </p>

          <KayitFormu />
        </Kart>

        <p className="mt-6 text-center text-sm text-slate-600">
          Zaten hesabınız var mı?{" "}
          <Link
            href="/giris"
            className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Giriş yapın
          </Link>
        </p>
      </div>
    </main>
  );
}