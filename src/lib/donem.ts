// ABONELİK DÖNEM HESABI
//
// Bu dosyadaki fonksiyon "saf"tır: veritabanına dokunmaz, saate bakmaz, aynı
// girdiye her zaman aynı sonucu verir. Bu yüzden kolayca test edilir.
//
// Bütün hesap UTC'ye göre yapılır. Ekranda tarih gösterilirken Türkiye saatine
// çevrilir (bkz. abonelikler sayfası).

// Plan aralığı. Veritabanındaki PlanInterval değerleriyle aynıdır.
export type Aralik = "MONTHLY" | "YEARLY";

// Verilen tarihten bir aralık (1 ay veya 1 yıl) sonrasını hesaplar.
//
// Ay sonu taşması önlenir: 31 Ocak + 1 ay = 28 Şubat (artık yılda 29 Şubat).
// JavaScript'in kendi setMonth işlemi 31 Ocak + 1 ay için 3 Mart verirdi;
// bu, müşteriye bir günden fazla ek süre vermek demektir.
//
// Not: Yenilemede yeni bitiş, mevcut bitişten hesaplanır. Bir ay sonu kısaltması
// olduysa (31 Ocak -> 28 Şubat) sonraki dönemler 28'inden sürer. Bu kabul edilmiş
// bir basitleştirmedir.
export function donemSonu(baslangic: Date, aralik: Aralik): Date {
  const eklenecekAy = aralik === "YEARLY" ? 12 : 1;

  const yil = baslangic.getUTCFullYear();
  const ay = baslangic.getUTCMonth();
  const gun = baslangic.getUTCDate();

  // Hedef ayı bul (yıl taşmasını da hesaba kat).
  const hedefSira = ay + eklenecekAy;
  const hedefYil = yil + Math.floor(hedefSira / 12);
  const hedefAy = hedefSira % 12;

  // Hedef ayın son günü: bir sonraki ayın 0. günü.
  const hedefAyinSonGunu = new Date(
    Date.UTC(hedefYil, hedefAy + 1, 0)
  ).getUTCDate();
  const hedefGun = Math.min(gun, hedefAyinSonGunu);

  return new Date(
    Date.UTC(
      hedefYil,
      hedefAy,
      hedefGun,
      baslangic.getUTCHours(),
      baslangic.getUTCMinutes(),
      baslangic.getUTCSeconds(),
      baslangic.getUTCMilliseconds()
    )
  );
}