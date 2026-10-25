import { requireManager } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import { kullanicilariListele, type KullaniciSatiri } from "@/lib/kullanici-yonetimi";
import { tarihMetni } from "@/lib/bicim";
import YetkiYok from "../YetkiYok";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import Rozet from "@/components/ui/Rozet";
import KullaniciFormu from "./KullaniciFormu";

// Kullanıcı yönetimi (Gün 14): firmanın kullanıcılarını listeleme ve yeni finance
// kullanıcısı ekleme. Yalnızca manager görür, finance kullanıcısına "yetkiniz yok"
// mesajı gösterilir.
// Not: Sayfayı gizlemek yetki kontrolü değildir. Ekleme işlemi sunucuda ayrıca rol
// kontrolü yapar (src/lib/kullanici-yonetimi.ts).
// Kapsam dışı (ADR Gün 14): silme, rol değiştirme, pasife alma, parola sıfırlama,
// davet e-postası.

// Rolün ekrandaki Türkçe karşılığı ve rozet rengi.
const ROL_GORUNUMU: Record<KullaniciSatiri["role"], { metin: string; ton: "indigo" | "gri" }> = {
  manager: { metin: "Yönetici", ton: "indigo" },
  finance: { metin: "Finans", ton: "gri" },
};

export default async function KullanicilarSayfasi() {
  const kullanici = await requireManager();
  if (!kullanici) return <YetkiYok />;

  // Liste tenant filtresinden geçer: yalnızca kullanıcının kendi firması.
  const db = await getTenantDb();
  const kullanicilar = await kullanicilariListele(db);

  return (
    <div className="space-y-8">
      <SayfaBasligi
        baslik="Kullanıcılar"
        aciklama="Firmanızın kullanıcıları ve rolleri. Bu sayfayı yalnızca firma yöneticisi görür."
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Yeni finans kullanıcısı</h2>
        <div className="mt-4">
          <KullaniciFormu />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900">
          Kullanıcı listesi ({kullanicilar.length})
        </h2>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Ad soyad</th>
                <th className="px-4 py-3 font-medium">E-posta</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium">Eklenme tarihi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kullanicilar.map((k) => (
                <tr key={k.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{k.name ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{k.email}</td>
                  <td className="px-4 py-3">
                    <Rozet ton={ROL_GORUNUMU[k.role].ton}>{ROL_GORUNUMU[k.role].metin}</Rozet>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{tarihMetni(k.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}