// METRİK HESAPLAMA FONKSİYONLARI (MRR, churn, ARPU, ömür, LTV, LTV/CAC)
//
// Bu dosyadaki bütün fonksiyonlar "saf"tır:
//   - Veritabanına dokunmaz, Prisma'yı içe aktarmaz.
//   - Saate kendisi bakmaz. "Şu an" gerekiyorsa parametre olarak alır.
//   - Aynı girdiye her zaman aynı sonucu verir.
// Kiracı (tenant) filtresi bu dosyada YOKTUR ve olmamalıdır. Veriyi okuyan sunucu kodu,
// kayıtları merkezi tenant yardımcısıyla zaten filtrelenmiş olarak buraya verir.
//
// "HESAPLANAMADI" KURALI (null):
// Sıfıra bölme gereken her durumda sonuç null döner.
//   - 0 döndürmüyoruz: "LTV = 0 TL" yöneticiye "müşteriler değersiz" gibi yanlış bir mesaj verir.
//   - Infinity döndürmüyoruz: ekranda anlamsız görünür ve JSON'a çevrilemez (null olur).
// null "bu değer şu an hesaplanamıyor" demektir. Nedeni metrikOzeti içinde metin olarak verilir.
//
// YUVARLAMA KURALI:
// İç hesaplarda hiç yuvarlama yapılmaz (ör. yıllık 1.000 TL -> aylık 83,333...).
// Yuvarlama yalnızca dışarıya sonuç veren iki fonksiyonda (metrikOzeti, mrrGecmisi)
// ve yalnızca tek bir yardımcıyla (yuvarla) yapılır:
//   - Para (MRR, ARPU, LTV): en yakın tam TL
//   - Churn: 4 ondalık (Gün 9). Ekranda yüzde olarak 1 ondalıkla gösterilir:
//     2/3 -> 0,6667 -> "%66,7". 2 ondalık olsaydı 0,67 -> "%67,0" görünürdü.
//   - LTV/CAC: 2 ondalık
//   - Ortalama ömür (ay): 1 ondalık
// Not: Ömür, LTV ve LTV/CAC yuvarlanmış churn'den değil HAM churn'den hesaplanır.
// Bu yüzden churn yuvarlamasını değiştirmek bu üç değeri etkilemez.

import type { Aralik } from "./donem";

// ---------- Tipler ----------

// Hesaplama için gereken düz abonelik verisi. Prisma kaydından sunucu tarafında üretilir.
export type AbonelikGirdisi = {
  customerId: string;
  fiyat: number; // Planın fiyatı, TL, tam sayı
  aralik: Aralik; // "MONTHLY" | "YEARLY"
  status: "ACTIVE" | "CANCELED";
  startedAt: Date;
  canceledAt: Date | null;
};

// Bir takvim ayının sınırları: baslangic dahil, bitis hariç.
export type AyAraligi = {
  baslangic: Date;
  bitis: Date;
};

// MRR grafiğinin bir noktası
export type MrrNoktasi = {
  yil: number;
  ay: number; // 1-12
  mrr: number; // tam TL
};

// Dashboard'a gidecek özet
export type MetrikOzeti = {
  mrr: number; // tam TL, hiçbir zaman null değil
  aktifMusteri: number;
  churn: number | null; // 0,04 = %4. 4 ondalık (ör. 0,6667)
  arpu: number | null;
  ortalamaOmurAy: number | null;
  ltv: number | null;
  ltvCac: number | null;
  // Yalnızca null olan alanlar için Türkçe açıklama
  nedenler: Partial<Record<"churn" | "arpu" | "ortalamaOmurAy" | "ltv" | "ltvCac", string>>;
};

// ---------- Yardımcılar ----------

// Türkiye saati UTC'nin 3 saat ilerisidir (2016'dan beri yaz saati uygulanmıyor).
const TURKIYE_FARKI_MS = 3 * 60 * 60 * 1000;

// Türkiye saatine göre bir takvim ayının başını ve sonunu UTC tarih olarak verir.
// ay: 1 (Ocak) ... 12 (Aralık).
// Örnek: Kasım 2026 -> baslangic 31 Ekim 21:00 UTC (= 1 Kasım 00:00 TR),
//                      bitis      30 Kasım 21:00 UTC (= 1 Aralık 00:00 TR).
// Aralık için Date.UTC ayı 12 alınca kendiliğinden sonraki yılın Ocak ayına geçer.
export function ayAraligi(yil: number, ay: number): AyAraligi {
  const baslangic = new Date(Date.UTC(yil, ay - 1, 1) - TURKIYE_FARKI_MS);
  const bitis = new Date(Date.UTC(yil, ay, 1) - TURKIYE_FARKI_MS);
  return { baslangic, bitis };
}

// Ayın son anı: bitişten 1 milisaniye önce. Ay sonu durumları bu ana göre değerlendirilir.
// Neden bitis değil? Tam bitis anında (1'inin 00:00'ı) yapılan bir iptal SONRAKİ aya aittir;
// bitis anına bakarsak o iptali yanlışlıkla bu aya yazardık.
function ayinSonAni(aralik: AyAraligi): Date {
  return new Date(aralik.bitis.getTime() - 1);
}

// Tek yuvarlama noktası. basamak = ondalık basamak sayısı (0 = tam sayı).
// Not: Math.round yarımları yukarı yuvarlar (2,5 -> 3). Negatif değer beklenmiyor.
function yuvarla(deger: number, basamak: number): number {
  const carpan = 10 ** basamak;
  return Math.round(deger * carpan) / carpan;
}

// Aynı değeri null'ı koruyarak yuvarlar.
function yuvarlaVeyaNull(deger: number | null, basamak: number): number | null {
  return deger === null ? null : yuvarla(deger, basamak);
}

// ---------- Hesap fonksiyonları ----------

// Aylık fiyat = aylık planda fiyatın kendisi, yıllık planda fiyat / 12.
// Yuvarlanmaz: 1.000 / 12 = 83,333... olarak taşınır.
export function aylikFiyat(fiyat: number, aralik: Aralik): number {
  return aralik === "YEARLY" ? fiyat / 12 : fiyat;
}

// Bir abonelik bir tarihte aktif mi?
// Kural: startedAt <= tarih VE (canceledAt boş VEYA canceledAt > tarih).
// Yani başladığı an aktif sayılır, iptal edildiği an artık aktif sayılmaz.
// Not: Geçmişe bakarken status alanına değil tarihlere bakılır.
export function tarihteAktifMi(abonelik: AbonelikGirdisi, tarih: Date): boolean {
  const basladi = abonelik.startedAt.getTime() <= tarih.getTime();
  const iptalOlmadi =
    abonelik.canceledAt === null || abonelik.canceledAt.getTime() > tarih.getTime();
  return basladi && iptalOlmadi;
}

// MRR (bugün) = status'u ACTIVE olan aboneliklerin aylık fiyatlarının toplamı.
// Liste boşsa 0 döner: "hiç gelir yok" gerçek bir değerdir, null değildir.
export function mrrHesapla(abonelikler: AbonelikGirdisi[]): number {
  return abonelikler
    .filter((a) => a.status === "ACTIVE")
    .reduce((toplam, a) => toplam + aylikFiyat(a.fiyat, a.aralik), 0);
}

// Belirli bir tarihteki MRR = o tarihte aktif olan aboneliklerin aylık fiyat toplamı.
// Grafik için kullanılır. Aktiflik tarihteAktifMi kuralıyla belirlenir.
export function tarihtekiMrr(abonelikler: AbonelikGirdisi[], tarih: Date): number {
  return abonelikler
    .filter((a) => tarihteAktifMi(a, tarih))
    .reduce((toplam, a) => toplam + aylikFiyat(a.fiyat, a.aralik), 0);
}

// Aylık MRR geçmişi (grafik). Her ay için ayın son anındaki MRR alınır.
// İçinde bulunulan ay (veya gelecek bir ay) için ayın sonu yerine "şimdi" kullanılır.
// simdi parametre olarak gelir, böylece fonksiyon saf kalır ve test edilebilir.
// Para değeri olduğu için sonuç tam TL'ye yuvarlanır.
export function mrrGecmisi(
  abonelikler: AbonelikGirdisi[],
  aylar: { yil: number; ay: number }[],
  simdi: Date
): MrrNoktasi[] {
  return aylar.map(({ yil, ay }) => {
    const sonAn = ayinSonAni(ayAraligi(yil, ay));
    const bakilacakAn = sonAn.getTime() < simdi.getTime() ? sonAn : simdi;
    return { yil, ay, mrr: yuvarla(tarihtekiMrr(abonelikler, bakilacakAn), 0) };
  });
}

// Aktif müşteri sayısı = ACTIVE aboneliği olan FARKLI müşteri sayısı.
// Kural: bir müşterinin aynı anda tek ACTIVE aboneliği olur. Yine de sayım
// müşteri kimliğine göre yapılır; böylece veri hatalı olsa bile müşteri iki kez sayılmaz.
export function aktifMusteriSayisi(abonelikler: AbonelikGirdisi[]): number {
  const musteriler = new Set(
    abonelikler.filter((a) => a.status === "ACTIVE").map((a) => a.customerId)
  );
  return musteriler.size;
}

// Belirli bir anda aktif aboneliği olan müşterilerin kimlikleri (iç yardımcı).
function andaAktifMusteriler(abonelikler: AbonelikGirdisi[], an: Date): Set<string> {
  return new Set(abonelikler.filter((a) => tarihteAktifMi(a, an)).map((a) => a.customerId));
}

// Aylık churn = ay içinde iptal eden müşteriler / ay başındaki aktif müşteriler.
// Müşteri bazlı yorum (ADR kararı):
//   - Payda: ay başında aktif aboneliği olan farklı müşteriler.
//   - Pay: bunlardan ayın son anında HİÇ aktif aboneliği kalmayanlar.
// Sonuçları:
//   - Ay içinde gelip aynı ay giden müşteri sayılmaz (paydada yok, paya da girmez).
//   - Ay içinde iptal edip yeni abonelik başlatan (plan değiştiren) müşteri churn değildir.
// "Ay başı" olarak ay başlangıcından 1 ms önceki an (önceki ayın son anı) kullanılır.
// Böylece iki ay boşluksuz birbirine bağlanır: tam 1'i 00:00'da yapılan bir iptal
// yeni ayın churn'üne girer. Ay başlangıcının kendisine baksaydık bu iptal hiçbir aya sayılmazdı.
// Ay başında aktif müşteri yoksa sıfıra bölme olur -> null.
export function aylikChurn(abonelikler: AbonelikGirdisi[], aralik: AyAraligi): number | null {
  const ayBasiAni = new Date(aralik.baslangic.getTime() - 1);
  const ayBasindakiler = andaAktifMusteriler(abonelikler, ayBasiAni);
  if (ayBasindakiler.size === 0) return null;

  const aySonundakiler = andaAktifMusteriler(abonelikler, ayinSonAni(aralik));
  let kaybedilen = 0;
  for (const musteriId of ayBasindakiler) {
    if (!aySonundakiler.has(musteriId)) kaybedilen++;
  }
  return kaybedilen / ayBasindakiler.size;
}

// ARPU = MRR / aktif müşteri sayısı. Aktif müşteri yoksa null.
export function arpuHesapla(mrr: number, aktifMusteri: number): number | null {
  if (aktifMusteri <= 0) return null;
  return mrr / aktifMusteri;
}

// Ortalama ömür (ay) = 1 / churn.
// churn null ise (hesaplanamadıysa) null.
// churn 0 ise null: bu ay kimse ayrılmadı diye müşterilerin "sonsuza kadar" kalacağı
// söylenemez; ömür bu veriyle tahmin edilemez.
export function ortalamaOmur(churn: number | null): number | null {
  if (churn === null || churn <= 0) return null;
  return 1 / churn;
}

// LTV = ARPU x ortalama ömür. İkisinden biri null ise null.
export function ltvHesapla(arpu: number | null, omurAy: number | null): number | null {
  if (arpu === null || omurAy === null) return null;
  return arpu * omurAy;
}

// LTV/CAC = LTV / CAC. CAC tenant ayarından gelir (veritabanında varsayılan 0).
// LTV null ise veya CAC girilmemişse (null ya da 0) null. 3 ve üzeri sağlıklı kabul edilir.
export function ltvCacOrani(ltv: number | null, cac: number | null): number | null {
  if (ltv === null || cac === null || cac <= 0) return null;
  return ltv / cac;
}

// Bütün metrikleri tek seferde hesaplar, yuvarlar ve null olanlara neden ekler.
// Dashboard bu fonksiyonun sonucunu doğrudan gösterebilir.
//   - mrr, aktifMusteri, arpu: bugünkü duruma (status = ACTIVE) göre
//   - churn ve ona bağlı ömür/LTV: verilen ay aralığına göre
export function metrikOzeti(
  abonelikler: AbonelikGirdisi[],
  churnAyi: AyAraligi,
  cac: number | null
): MetrikOzeti {
  // 1) Ham (yuvarlanmamış) değerler
  const mrr = mrrHesapla(abonelikler);
  const aktifMusteri = aktifMusteriSayisi(abonelikler);
  const churn = aylikChurn(abonelikler, churnAyi);
  const arpu = arpuHesapla(mrr, aktifMusteri);
  const omur = ortalamaOmur(churn);
  const ltv = ltvHesapla(arpu, omur);
  const ltvCac = ltvCacOrani(ltv, cac);

  // 2) Null olanlar için ekranda gösterilecek nedenler
  const nedenler: MetrikOzeti["nedenler"] = {};
  if (churn === null) nedenler.churn = "Ay başında aktif müşteri yok, churn hesaplanamadı.";
  if (arpu === null) nedenler.arpu = "Aktif müşteri yok, ARPU hesaplanamadı.";
  if (omur === null) {
    nedenler.ortalamaOmurAy =
      churn === null
        ? "Churn hesaplanamadığı için ömür hesaplanamadı."
        : "Bu ay iptal yok, ortalama ömür tahmin edilemiyor.";
  }
  if (ltv === null) {
    nedenler.ltv =
      arpu === null
        ? "Aktif müşteri yok, LTV hesaplanamadı."
        : "Ortalama ömür hesaplanamadığı için LTV hesaplanamadı.";
  }
  if (ltvCac === null) {
    nedenler.ltvCac =
      ltv === null
        ? "LTV hesaplanamadığı için LTV/CAC hesaplanamadı."
        : "CAC girilmemiş. Ayarlardan CAC girin.";
  }

  // 3) Yuvarlama: yalnızca burada ve yalnızca yuvarla ile
  return {
    mrr: yuvarla(mrr, 0),
    aktifMusteri,
    churn: yuvarlaVeyaNull(churn, 4),
    arpu: yuvarlaVeyaNull(arpu, 0),
    ortalamaOmurAy: yuvarlaVeyaNull(omur, 1),
    ltv: yuvarlaVeyaNull(ltv, 0),
    ltvCac: yuvarlaVeyaNull(ltvCac, 2),
    nedenler,
  };
}