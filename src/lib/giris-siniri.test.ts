// GİRİŞ DENEME SINIRI TESTLERİ (Gün 12, bulgu B1)
//
// Veritabanı kullanılmaz. Zaman, her çağrıya "simdi" parametresiyle verilir;
// testler gerçekten beklemez. Her test kendi temiz sınırlayıcısını üretir.
// Çalıştırmak için: npm test

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  BLOK_MS,
  EN_COK_DENEME,
  PENCERE_MS,
  sinirlayiciOlustur,
  type GirisSinirlayici,
} from "./giris-siniri.ts";

const EPOSTA = "ornek@example.com";
const DAKIKA = 60 * 1000;
// Testlerde kullanılan başlangıç anı (herhangi bir sabit sayı olabilir).
const T0 = 1_000_000_000;

// Verilen sayıda denemeyi aynı anda yapar ve izin sonuçlarını döner.
function denemeYap(
  sinir: GirisSinirlayici,
  sayi: number,
  simdi: number,
  eposta: string = EPOSTA
): boolean[] {
  const sonuclar: boolean[] = [];
  for (let i = 0; i < sayi; i++) {
    sonuclar.push(sinir.denemeyiKaydet(eposta, simdi).izin);
  }
  return sonuclar;
}

describe("Varsayılan kural", () => {
  test("15 dakika içinde 5 deneme, 15 dakika blok", () => {
    assert.equal(EN_COK_DENEME, 5);
    assert.equal(PENCERE_MS, 15 * DAKIKA);
    assert.equal(BLOK_MS, 15 * DAKIKA);
  });
});

describe("Deneme sayma ve blok", () => {
  test("ilk 5 denemeye izin verilir, 6. reddedilir", () => {
    const sinir = sinirlayiciOlustur();
    assert.deepEqual(denemeYap(sinir, 5, T0), [true, true, true, true, true]);
    assert.equal(sinir.denemeyiKaydet(EPOSTA, T0).izin, false);
  });

  test("blok 15 dakika sürer, dolunca yeniden izin verilir", () => {
    const sinir = sinirlayiciOlustur();
    denemeYap(sinir, 6, T0); // 6. denemede blok başlar
    assert.equal(sinir.denemeyiKaydet(EPOSTA, T0 + 15 * DAKIKA - 1).izin, false);
    assert.equal(sinir.denemeyiKaydet(EPOSTA, T0 + 15 * DAKIKA).izin, true);
  });

  test("blok sırasındaki ek denemeler bloğu uzatmaz", () => {
    const sinir = sinirlayiciOlustur();
    denemeYap(sinir, 6, T0);
    // Blok süresince her dakika bir deneme daha yapılır.
    for (let dk = 1; dk < 15; dk++) {
      assert.equal(sinir.denemeyiKaydet(EPOSTA, T0 + dk * DAKIKA).izin, false);
    }
    assert.equal(sinir.denemeyiKaydet(EPOSTA, T0 + 15 * DAKIKA).izin, true);
  });

  test("ilk denemenin üzerinden 15 dakika geçince sayaç sıfırlanır", () => {
    const sinir = sinirlayiciOlustur();
    denemeYap(sinir, 5, T0); // sınırda, henüz blok yok
    // Pencere doldu: yeni pencere başlar, 5 deneme daha yapılabilir.
    assert.deepEqual(denemeYap(sinir, 5, T0 + 15 * DAKIKA), [true, true, true, true, true]);
    assert.equal(sinir.denemeyiKaydet(EPOSTA, T0 + 15 * DAKIKA).izin, false);
  });
});

describe("Başarılı giriş", () => {
  test("başarılı giriş sayacı sıfırlar", () => {
    const sinir = sinirlayiciOlustur();
    denemeYap(sinir, 4, T0);
    sinir.basarili(EPOSTA);
    assert.equal(sinir.kayitSayisi(), 0);
    assert.deepEqual(denemeYap(sinir, 5, T0), [true, true, true, true, true]);
  });

  test("blok sürerken başarı kaydı bloğu kaldırmaz", () => {
    const sinir = sinirlayiciOlustur();
    denemeYap(sinir, 6, T0);
    sinir.basarili(EPOSTA);
    assert.equal(sinir.denemeyiKaydet(EPOSTA, T0 + DAKIKA).izin, false);
  });
});

describe("E-posta anahtarı", () => {
  test("farklı e-postalar birbirini etkilemez", () => {
    const sinir = sinirlayiciOlustur();
    denemeYap(sinir, 6, T0, "a@example.com");
    assert.equal(sinir.denemeyiKaydet("a@example.com", T0).izin, false);
    assert.equal(sinir.denemeyiKaydet("b@example.com", T0).izin, true);
  });

  test("büyük/küçük harf ve baştaki/sondaki boşluk aynı sayaca düşer", () => {
    const sinir = sinirlayiciOlustur();
    denemeYap(sinir, 3, T0, "Ornek@Example.com");
    denemeYap(sinir, 2, T0, "  ORNEK@example.COM ");
    assert.equal(sinir.denemeyiKaydet("ornek@example.com", T0).izin, false);
    assert.equal(sinir.kayitSayisi(), 1);
  });
});

describe("Bellek temizliği", () => {
  test("süresi dolmuş kayıtlar temizlenir, kayıt sayısı düşer", () => {
    const sinir = sinirlayiciOlustur();
    denemeYap(sinir, 1, T0, "eski@example.com"); // pencere T0 + 15 dk'da biter
    denemeYap(sinir, 6, T0, "bloklu@example.com"); // blok T0 + 15 dk'da biter
    denemeYap(sinir, 1, T0 + 10 * DAKIKA, "yeni@example.com"); // T0 + 25 dk'da biter
    assert.equal(sinir.kayitSayisi(), 3);

    sinir.temizle(T0 + 20 * DAKIKA);
    assert.equal(sinir.kayitSayisi(), 1, "Yalnızca süresi dolmamış kayıt kalmalı.");
  });

  test("üst sınır dolunca kayıt sayısı sınırı aşmaz", () => {
    const sinir = sinirlayiciOlustur({ enCokKayit: 3 });
    for (let i = 0; i < 10; i++) {
      denemeYap(sinir, 1, T0, `kisi${i}@example.com`);
      assert.ok(sinir.kayitSayisi() <= 3, "Kayıt sayısı üst sınırı aştı.");
    }
    // En yeni kayıt listede kalır: sayacı devam eder.
    denemeYap(sinir, 4, T0, "kisi9@example.com");
    assert.equal(sinir.denemeyiKaydet("kisi9@example.com", T0).izin, false);
  });

  test("liste dolunca önce süresi dolmuş kayıtlar silinir", () => {
    const sinir = sinirlayiciOlustur({ enCokKayit: 2 });
    denemeYap(sinir, 1, T0, "eski@example.com"); // süresi dolacak
    denemeYap(sinir, 6, T0 + 10 * DAKIKA, "bloklu@example.com"); // blok sürüyor
    // Yeni kayıt için yer açılırken eski (süresi dolmuş) kayıt silinmeli, bloklu kalmalı.
    denemeYap(sinir, 1, T0 + 20 * DAKIKA, "yeni@example.com");
    assert.equal(sinir.kayitSayisi(), 2);
    assert.equal(sinir.denemeyiKaydet("bloklu@example.com", T0 + 20 * DAKIKA).izin, false);
  });
});