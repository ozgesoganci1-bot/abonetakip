// METRİK HESAPLAMA BİRİM TESTİ
//
// Çalıştırmak için: npm test
// Ek paket gerekmez: Node'un yerleşik test aracı kullanılır.
// Veritabanı gerekmez: fonksiyonlar düz veriyle çalışır.
// Bütün tarihler Türkiye saatiyle (+03:00) yazılmıştır. Müşteri kimlikleri sahtedir.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  type AbonelikGirdisi,
  ayAraligi,
  aylikFiyat,
  tarihteAktifMi,
  mrrHesapla,
  tarihtekiMrr,
  mrrGecmisi,
  aktifMusteriSayisi,
  aylikChurn,
  arpuHesapla,
  ortalamaOmur,
  ltvHesapla,
  ltvCacOrani,
  metrikOzeti,
} from "./metrikler.ts";

// ---------- Kısa yardımcılar ----------

// Türkiye saatiyle tarih üretir. Örnek: tr("2026-10-01T00:00") -> 1 Ekim 00:00 TR
function tr(metin: string): Date {
  return new Date(`${metin}:00+03:00`);
}

// Test aboneliği üretir. Verilmeyen alanlar: aylık 1.000 TL, ACTIVE, 1 Ocak 2026'da başlamış.
function abonelik(degisiklik: Partial<AbonelikGirdisi> & { customerId: string }): AbonelikGirdisi {
  return {
    fiyat: 1000,
    aralik: "MONTHLY",
    status: "ACTIVE",
    startedAt: tr("2026-01-01T10:00"),
    canceledAt: null,
    ...degisiklik,
  };
}

// İptal edilmiş abonelik kısayolu
function iptalli(customerId: string, canceledAt: Date, ek: Partial<AbonelikGirdisi> = {}) {
  return abonelik({ customerId, status: "CANCELED", canceledAt, ...ek });
}

const EKIM_2026 = ayAraligi(2026, 10);

// =====================================================================
// DERSTEKİ DOĞRULAMA ÖRNEĞİ
// 50 müşteri, her biri aylık 1.000 TL, aylık churn %4, CAC 5.000 TL.
// Beklenen: MRR 50.000, ömür 25 ay, LTV 25.000, LTV/CAC 5.
// =====================================================================

test("ders örneği (formüllerle): ömür 25, LTV 25.000, LTV/CAC 5", () => {
  const mrr = 50 * 1000;
  assert.equal(mrr, 50000);

  const arpu = arpuHesapla(mrr, 50);
  assert.equal(arpu, 1000);

  const omur = ortalamaOmur(0.04);
  assert.ok(omur !== null);
  // Ondalıklı sayılarda bilgisayar 25,000000000000004 gibi küçük farklar verebilir.
  // Bu yüzden ham değer "25'e çok yakın mı" diye kontrol edilir.
  assert.ok(Math.abs(omur - 25) < 1e-9, `ömür 25 olmalı, ${omur} geldi`);

  const ltv = ltvHesapla(arpu, omur);
  assert.ok(ltv !== null && Math.abs(ltv - 25000) < 1e-6, `LTV 25.000 olmalı, ${ltv} geldi`);

  const oran = ltvCacOrani(ltv, 5000);
  assert.ok(oran !== null && Math.abs(oran - 5) < 1e-9, `LTV/CAC 5 olmalı, ${oran} geldi`);
});

test("ders örneği (gerçekçi veriyle): Ekim'de 50 müşteriden 2'si gider, 2 yeni gelir", () => {
  const liste: AbonelikGirdisi[] = [];

  // Eylül'den beri aktif 48 müşteri (Ekim boyunca kalıyor)
  for (let i = 1; i <= 48; i++) {
    liste.push(abonelik({ customerId: `musteri-${i}`, startedAt: tr("2026-09-01T10:00") }));
  }
  // Eylül'den beri aktif, Ekim içinde iptal eden 2 müşteri
  liste.push(iptalli("musteri-49", tr("2026-10-10T14:00"), { startedAt: tr("2026-09-01T10:00") }));
  liste.push(iptalli("musteri-50", tr("2026-10-20T09:00"), { startedAt: tr("2026-09-01T10:00") }));
  // Ekim içinde gelen 2 yeni müşteri
  liste.push(abonelik({ customerId: "musteri-51", startedAt: tr("2026-10-05T11:00") }));
  liste.push(abonelik({ customerId: "musteri-52", startedAt: tr("2026-10-15T16:00") }));

  const ozet = metrikOzeti(liste, EKIM_2026, 5000);

  assert.equal(ozet.mrr, 50000);
  assert.equal(ozet.aktifMusteri, 50);
  assert.equal(ozet.churn, 0.04); // 2 / 50
  assert.equal(ozet.arpu, 1000);
  assert.equal(ozet.ortalamaOmurAy, 25);
  assert.equal(ozet.ltv, 25000);
  assert.equal(ozet.ltvCac, 5);
  assert.deepEqual(ozet.nedenler, {});
});

// =====================================================================
// SIFIRA BÖLME VE "HESAPLANAMADI" DURUMLARI
// =====================================================================

test("boş liste: MRR 0 (gerçek değer), ARPU/churn/LTV null", () => {
  const ozet = metrikOzeti([], EKIM_2026, 5000);
  assert.equal(ozet.mrr, 0);
  assert.equal(ozet.aktifMusteri, 0);
  assert.equal(ozet.arpu, null);
  assert.equal(ozet.churn, null);
  assert.equal(ozet.ortalamaOmurAy, null);
  assert.equal(ozet.ltv, null);
  assert.equal(ozet.ltvCac, null);
  assert.ok(ozet.nedenler.arpu);
  assert.ok(ozet.nedenler.churn);
});

test("churn 0 (kimse iptal etmedi): ömür ve LTV null, nedeni yazılır", () => {
  const liste = [
    abonelik({ customerId: "a" }),
    abonelik({ customerId: "b" }),
  ];
  const ozet = metrikOzeti(liste, EKIM_2026, 5000);
  assert.equal(ozet.churn, 0);
  assert.equal(ozet.arpu, 1000); // ARPU yine hesaplanır
  assert.equal(ozet.ortalamaOmurAy, null);
  assert.equal(ozet.ltv, null);
  assert.equal(ozet.ltvCac, null);
  assert.equal(ozet.nedenler.ortalamaOmurAy, "Bu ay iptal yok, ortalama ömür tahmin edilemiyor.");
});

test("ay başında aktif müşteri yok: churn null (ay içinde gelen müşteri sayılmaz)", () => {
  const liste = [abonelik({ customerId: "a", startedAt: tr("2026-10-12T10:00") })];
  assert.equal(aylikChurn(liste, EKIM_2026), null);
  assert.equal(ortalamaOmur(null), null);
});

test("CAC girilmemiş (0 veya null): LTV/CAC null, 'CAC girin' nedeni", () => {
  assert.equal(ltvCacOrani(25000, 0), null);
  assert.equal(ltvCacOrani(25000, null), null);
  assert.equal(ltvCacOrani(null, 5000), null);

  // Churn'ü %50 olan küçük bir örnek: LTV hesaplanır ama CAC 0
  const liste = [
    abonelik({ customerId: "a" }),
    iptalli("b", tr("2026-10-10T10:00")),
  ];
  const ozet = metrikOzeti(liste, EKIM_2026, 0);
  assert.ok(ozet.ltv !== null);
  assert.equal(ozet.ltvCac, null);
  assert.equal(ozet.nedenler.ltvCac, "CAC girilmemiş. Ayarlardan CAC girin.");
});

test("aktif müşteri 0: ARPU null", () => {
  assert.equal(arpuHesapla(0, 0), null);
  assert.equal(ltvHesapla(null, 25), null);
});

// =====================================================================
// YILLIK PLAN VE YUVARLAMA
// =====================================================================

test("yıllık plan: 12.000 TL -> aylık 1.000; 1.000 TL -> ham 83,33..., özette 83", () => {
  assert.equal(aylikFiyat(12000, "YEARLY"), 1000);
  assert.equal(aylikFiyat(1000, "MONTHLY"), 1000);

  // İç hesapta yuvarlama yok
  const ham = aylikFiyat(1000, "YEARLY");
  assert.ok(Math.abs(ham - 1000 / 12) < 1e-12);

  // Yuvarlama yalnızca özette
  const ozet = metrikOzeti(
    [abonelik({ customerId: "a", fiyat: 1000, aralik: "YEARLY" })],
    EKIM_2026,
    null
  );
  assert.equal(ozet.mrr, 83);
});

test("ara adımda yuvarlama yok: üç yıllık 1.000 TL plan toplamı 250 (83+83+83=249 değil)", () => {
  const liste = ["a", "b", "c"].map((id) =>
    abonelik({ customerId: id, fiyat: 1000, aralik: "YEARLY" })
  );
  assert.equal(metrikOzeti(liste, EKIM_2026, null).mrr, 250);
});

// =====================================================================
// TARİH SINIRLARI
// =====================================================================

test("tarihteAktifMi: başladığı an aktif, iptal edildiği an aktif değil", () => {
  const an = tr("2026-10-15T12:00");
  assert.equal(tarihteAktifMi(abonelik({ customerId: "a", startedAt: an }), an), true);
  assert.equal(tarihteAktifMi(iptalli("a", an), an), false);
  // İptalden 1 ms önce hâlâ aktif
  assert.equal(tarihteAktifMi(iptalli("a", an), new Date(an.getTime() - 1)), true);
});

test("ayAraligi: Türkiye saatine göre ay başı/sonu, Aralık'tan Ocak'a yıl geçişi", () => {
  const kasim = ayAraligi(2026, 11);
  assert.equal(kasim.baslangic.toISOString(), "2026-10-31T21:00:00.000Z"); // 1 Kasım 00:00 TR
  assert.equal(kasim.bitis.toISOString(), "2026-11-30T21:00:00.000Z"); // 1 Aralık 00:00 TR

  const aralik = ayAraligi(2026, 12);
  assert.equal(aralik.bitis.toISOString(), "2026-12-31T21:00:00.000Z"); // 1 Ocak 2027 00:00 TR
});

test("1 Kasım 01:00 (TR) iptali Kasım'a düşer, Ekim churn'üne girmez", () => {
  // UTC'de bu an hâlâ 31 Ekim 22:00'dir. UTC'ye göre ay ayırsaydık Ekim'e düşerdi.
  const liste = [
    abonelik({ customerId: "kalan" }),
    iptalli("giden", tr("2026-11-01T01:00")),
  ];
  assert.equal(aylikChurn(liste, ayAraligi(2026, 10)), 0);
  assert.equal(aylikChurn(liste, ayAraligi(2026, 11)), 0.5);
});

test("tam ay sınırında (1 Kasım 00:00 TR) yapılan iptal Kasım'a aittir", () => {
  const liste = [abonelik({ customerId: "kalan" }), iptalli("giden", tr("2026-11-01T00:00"))];
  assert.equal(aylikChurn(liste, ayAraligi(2026, 10)), 0);
  assert.equal(aylikChurn(liste, ayAraligi(2026, 11)), 0.5);
});

// =====================================================================
// MÜŞTERİ BAZLI SAYIM (KURAL: müşteri başına tek ACTIVE abonelik)
// =====================================================================

test("aynı müşterinin eski CANCELED + yeni ACTIVE kaydı: tek müşteri sayılır", () => {
  const liste = [
    iptalli("a", tr("2026-05-01T10:00")),
    abonelik({ customerId: "a", startedAt: tr("2026-05-01T10:00") }),
  ];
  assert.equal(aktifMusteriSayisi(liste), 1);
  assert.equal(mrrHesapla(liste), 1000);
});

test("ay içinde gelip aynı ay giden müşteri churn'e girmez", () => {
  const liste = [
    abonelik({ customerId: "a" }),
    abonelik({ customerId: "b" }),
    iptalli("gecici", tr("2026-10-20T10:00"), { startedAt: tr("2026-10-05T10:00") }),
  ];
  assert.equal(aylikChurn(liste, EKIM_2026), 0); // 0 / 2
});

test("ay içinde plan değiştiren müşteri (iptal + yeni abonelik) churn değildir", () => {
  const liste = [
    abonelik({ customerId: "b" }),
    // "a" eski planı 10 Ekim'de iptal etti, aynı anda yeni plana geçti
    iptalli("a", tr("2026-10-10T10:00")),
    abonelik({ customerId: "a", fiyat: 2000, startedAt: tr("2026-10-10T10:00") }),
  ];
  assert.equal(aylikChurn(liste, EKIM_2026), 0);
  assert.equal(mrrHesapla(liste), 3000);
});

// =====================================================================
// MRR GEÇMİŞİ (GRAFİK)
// =====================================================================

test("mrrGecmisi: her ayın son anındaki MRR, içinde bulunulan ay için 'şimdi'", () => {
  const liste = [
    abonelik({ customerId: "a", startedAt: tr("2026-08-10T10:00") }), // Ağustos'tan beri
    iptalli("b", tr("2026-09-20T10:00"), { startedAt: tr("2026-08-15T10:00") }), // Eylül'de gitti
    abonelik({ customerId: "c", startedAt: tr("2026-10-25T10:00") }), // "şimdi"den sonra başlıyor
  ];
  const simdi = tr("2026-10-22T20:00");

  const sonuc = mrrGecmisi(
    liste,
    [
      { yil: 2026, ay: 8 },
      { yil: 2026, ay: 9 },
      { yil: 2026, ay: 10 },
    ],
    simdi
  );

  assert.deepEqual(sonuc, [
    { yil: 2026, ay: 8, mrr: 2000 }, // a + b
    { yil: 2026, ay: 9, mrr: 1000 }, // yalnızca a
    { yil: 2026, ay: 10, mrr: 1000 }, // 22 Ekim'e kadar: c henüz yok
  ]);
  assert.equal(tarihtekiMrr(liste, tr("2026-10-31T23:00")), 2000);
});