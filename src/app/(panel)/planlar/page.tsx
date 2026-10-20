import { requireUser } from "@/lib/auth";

// Yer tutucu sayfa. Plan yönetimi 4. günde yapılacak.
export default async function PlanlarSayfasi() {
  await requireUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Planlar</h1>
      <p className="mt-2 text-gray-600">Bu sayfa ilerleyen günlerde doldurulacak.</p>
    </div>
  );
}