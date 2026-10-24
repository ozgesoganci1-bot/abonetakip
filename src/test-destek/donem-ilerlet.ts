// DÖNEM İLERLETME (demo betikleri için ortak yardımcı)
//
// Gün 11: demo-verisi.ts içinden taşındı; gecmis-mrr-verisi.ts de kullanır.
// Ayrı dosyada durur, çünkü demo-verisi.ts içe aktarıldığında betiğin kendisi çalışır.
// Veritabanına dokunmaz.

import { donemSonu, type Aralik } from "../lib/donem.ts";

// Başlangıçtan sınıra kadar dönem dönem ilerler (uygulamadaki yenileme kuralıyla).
// Sınırdan önce dolan her dönem bir yenilemedir (RENEWED olayı).
export function donemleriIlerlet(baslangic: Date, aralik: Aralik, sinir: Date) {
  const yenilemeler: Date[] = [];
  let bitis = donemSonu(baslangic, aralik);
  while (bitis.getTime() <= sinir.getTime()) {
    yenilemeler.push(bitis);
    bitis = donemSonu(bitis, aralik);
  }
  return { yenilemeler, currentPeriodEnd: bitis };
}