import { requireUser } from "@/lib/auth";

// Yer tutucu sayfa. Müşteri yönetimi 4. günde yapılacak.
export default async function MusterilerSayfasi() {
  await requireUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Müşteriler</h1>
      <p className="mt-2 text-gray-600">Bu sayfa ilerleyen günlerde doldurulacak.</p>
    </div>
  );
}