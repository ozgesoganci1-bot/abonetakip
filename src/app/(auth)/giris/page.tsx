import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Kart from "@/components/ui/Kart";
import GirisFormu from "./GirisFormu";

// Giriş sayfası. Zaten giriş yapmış kullanıcı bu sayfayı görmez.
export default async function GirisSayfasi() {
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
            Giriş yapın
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            E-posta ve parolanızla hesabınıza erişin.
          </p>

          <GirisFormu />
        </Kart>

        <p className="mt-6 text-center text-sm text-slate-600">
          Hesabınız yok mu?{" "}
          <Link
            href="/kayit"
            className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Kayıt olun
          </Link>
        </p>
      </div>
    </main>
  );
}