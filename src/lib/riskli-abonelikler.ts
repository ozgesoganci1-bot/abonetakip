// RİSKLİ ABONELİKLER (Gün 10, issue #6)
//
// KURAL (issue #6 kabul kriteri): "bitiş dönemine 7 günden az kalmış, henüz
// yenilenmemiş ACTIVE abonelik".
//   Koşul: status = ACTIVE ve currentPeriodEnd < şimdi + 7 gün
// Süresi geçmiş ama hâlâ ACTIVE olanlar bu tek koşula zaten girer, ayrı koşul
// yoktur. Ayrım yalnızca ekrandaki etikettir (riskEtiketi).
// Yenileme currentPeriodEnd'i ileri taşıdığı için yenilenmiş abonelik listeye
// girmez. İptal edilmiş abonelik status koşuluna takılır.
// Tam 7 gün kalmış abonelik listeye GİRMEZ ("7 günden az").
//
// Sorgu tenant filtresinden geçen db ile yapılır: başka firmanın kaydı gelmez.
// db ve simdi parametre olarak alınır: uygulamada getTenantDb() ve şu an,
// testlerde tenantaBagliDb() ve sabit bir an. Bu dosya Next.js'e bağlı değildir.

import type { TenantDb } from "./tenant.ts";

// Riskli sayılma eşiği (gün). issue #6'dan gelir, yalnızca burada tanımlıdır.
export const RISK_GUN = 7;

const GUN_MS = 24 * 60 * 60 * 1000;

export type RiskEtiketiSonucu = {
  metin: string;
  // true: bitiş tarihi geçmiş (ekranda kırmızı); false: henüz geçmemiş (sarı).
  gecmis: boolean;
};

// Bitiş tarihine göre ekranda gösterilecek etiket. Süre, takvim gününe göre değil
// milisaniye farkına göre hesaplanır; tam gün sayısı aşağı yuvarlanır.
export function riskEtiketi(bitis: Date, simdi: Date): RiskEtiketiSonucu {
  const kalan = bitis.getTime() - simdi.getTime();
  if (kalan < 0) return { metin: "Süresi geçmiş", gecmis: true };

  const gun = Math.floor(kalan / GUN_MS);
  if (gun < 1) return { metin: "1 günden az kaldı", gecmis: false };
  return { metin: `${gun} gün kaldı`, gecmis: false };
}

export type RiskliAbonelik = {
  id: string;
  musteriAdi: string;
  planAdi: string;
  bitis: Date;
  etiket: RiskEtiketiSonucu;
};

// Riskli abonelikleri bitişi en yakın olandan (süresi geçmişler en başta) sıralar.
export async function riskliAbonelikler(
  db: TenantDb,
  simdi: Date = new Date()
): Promise<RiskliAbonelik[]> {
  const sinir = new Date(simdi.getTime() + RISK_GUN * GUN_MS);

  const kayitlar = await db.subscription.findMany({
    where: { status: "ACTIVE", currentPeriodEnd: { lt: sinir } },
    orderBy: { currentPeriodEnd: "asc" },
    select: {
      id: true,
      currentPeriodEnd: true,
      customer: { select: { name: true } },
      plan: { select: { name: true } },
    },
  });

  return kayitlar.map((k) => ({
    id: k.id,
    musteriAdi: k.customer.name,
    planAdi: k.plan.name,
    bitis: k.currentPeriodEnd,
    etiket: riskEtiketi(k.currentPeriodEnd, simdi),
  }));
}