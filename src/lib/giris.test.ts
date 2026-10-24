// GİRİŞ DENEME SINIRI VERİTABANI TESTİ (Gün 12, bulgu B1)
//
// Ne test edilir? src/lib/auth.ts içindeki girisYap fonksiyonunun, kayıtlı ve
// kayıtsız e-postaya HER denemede aynı cevabı verdiği ve 6. denemede bloğa geçtiği.
// Sayacın kendi kuralları giris-siniri.test.ts içinde veritabanısız test edilir.
//
// Kayıtlı e-posta: test-destek/veri.ts'in oluşturduğu sahte firmanın yöneticisi.
// Bu kullanıcının parola özeti gerçek değildir; yalnızca yanlış parola denenir.
// Kayıtsız e-posta: bu çalışmaya özel, hiçbir yerde kayıtlı olmayan bir adres.
// Başarılı giriş burada denenmez: oturum çerezi yalnızca bir Next.js isteği içinde
// yazılabilir. Başarılı girişin sayacı sıfırlaması giris-siniri.test.ts'te test edilir.
//
// Veri: bir sahte firma oluşturulur, testler bitince silinir.
// Çalıştırmak için: npm run test:db

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { testDaliKontrolu } from "../test-destek/canli-koruma.ts";

// KORUMA 1: TEST_VERITABANI=evet yoksa ya da DATABASE_URL canlı (.env) ile aynı
// Neon sunucusunu gösteriyorsa veritabanına hiç bağlanmadan dur.
const kontrol = testDaliKontrolu();
if (!kontrol.ok) {
  throw new Error(kontrol.hata);
}

// Koruma geçildikten SONRA içe aktarılır: db.ts yüklenince veritabanı nesnesi oluşur.
// (KORUMA 2: veri.ts de yüklenirken TEST_VERITABANI kontrolünü ayrıca yapar.)
const { CALISMA, testFirmasiOlustur, testVerisiniTemizle, baglantiyiKapat } = await import(
  "../test-destek/veri.ts"
);
const { girisYap, GIRIS_HATASI } = await import("./auth.ts");
const { BLOK_MESAJI, EN_COK_DENEME } = await import("./giris-siniri.ts");

const YANLIS_PAROLA = "yanlis-parola-123";

// veri.ts yöneticinin e-postasını "<çalışma etiketi>-<firma etiketi>-manager@example.com"
// biçiminde oluşturur.
const KAYITLI_EPOSTA = `${CALISMA}-giris-manager@example.com`;
const KAYITSIZ_EPOSTA = `${CALISMA}-kayitsiz@example.com`;

before(async () => {
  await testFirmasiOlustur("giris");
});

after(async () => {
  try {
    await testVerisiniTemizle();
  } finally {
    await baglantiyiKapat();
  }
});

test("kayıtlı ve kayıtsız e-postaya her denemede aynı cevap verilir, 6. denemede blok", async () => {
  for (let deneme = 1; deneme <= EN_COK_DENEME + 1; deneme++) {
    const kayitli = await girisYap(KAYITLI_EPOSTA, YANLIS_PAROLA);
    const kayitsiz = await girisYap(KAYITSIZ_EPOSTA, YANLIS_PAROLA);

    assert.deepEqual(kayitli, kayitsiz, `${deneme}. denemede iki cevap farklı.`);

    const beklenen = deneme <= EN_COK_DENEME ? GIRIS_HATASI : BLOK_MESAJI;
    assert.deepEqual(kayitli, { ok: false, hata: beklenen }, `${deneme}. denemede beklenmeyen cevap.`);
  }
});

test("büyük harfle yazılan e-posta da aynı blokta kalır", async () => {
  const sonuc = await girisYap(KAYITLI_EPOSTA.toUpperCase(), YANLIS_PAROLA);
  assert.deepEqual(sonuc, { ok: false, hata: BLOK_MESAJI });
});

test("başka bir e-postanın denemesi bu bloktan etkilenmez", async () => {
  const sonuc = await girisYap(`${CALISMA}-baska@example.com`, YANLIS_PAROLA);
  assert.deepEqual(sonuc, { ok: false, hata: GIRIS_HATASI });
});