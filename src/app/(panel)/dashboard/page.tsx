import { requireUser } from "@/lib/auth";

// Yer tutucu sayfa. KPI göstergeleri 8-9. günlerde eklenecek.
export default async function DashboardSayfasi() {
  // Layout da giriş kontrolü yapar, ama Next.js layout ile sayfayı birbirinden
  // bağımsız çalıştırır. Bu yüzden her sayfa kendi kontrolünü de yapar.
  await requireUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        KPI göstergeleri ilerleyen günlerde eklenecek.
      </p>
    </div>
  );
}