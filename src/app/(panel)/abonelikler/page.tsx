import { requireUser } from "@/lib/auth";

// Yer tutucu sayfa. Abonelik yaşam döngüsü 5. günde yapılacak.
export default async function AboneliklerSayfasi() {
  await requireUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Abonelikler</h1>
      <p className="mt-2 text-gray-600">Bu sayfa ilerleyen günlerde doldurulacak.</p>
    </div>
  );
}