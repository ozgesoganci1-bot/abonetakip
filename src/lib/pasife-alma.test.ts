// ROL TESTLERİ: PASİFE ALMA (Gün 6)
//
// Ne test edilir? src/lib/pasife-alma.ts içindeki çekirdek fonksiyonlar.
// Bugün kodda var olan rol kısıtlı işlemler yalnızca bunlardır:
//   - müşteri pasife alma (yalnızca manager)
//   - plan pasife alma    (yalnızca manager)
// Testler, sunucu işlemlerinin (actions.ts) çağırdığı fonksiyonun aynısını çağırır.
// Tek fark: kullanıcı ve veritabanı nesnesi oturumdan değil, testten verilir.
//
// Sıra önemlidir: kaydı GERÇEKTEN pasife alan testler en sondadır.
// Çalıştırmak için: npm run test:db

import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
// Önce test verisi yardımcısı: TEST_VERITABANI kontrolü onun içinde yapılır.
import {
  testFirmasiOlustur,
  testVerisiniTemizle,
  baglantiyiKapat,
  type TestFirmasi,
} from "../test-destek/veri.ts";
import { tenantaBagliDb, type TenantDb } from "./tenant.ts";
import { musteriPasifeAlCekirdek, planPasifeAlCekirdek } from "./pasife-alma.ts";
import { MESAJ } from "./islem.ts";

let A: TestFirmasi;
let B: TestFirmasi;
let dbA: TenantDb;
let dbB: TenantDb;

before(async () => {
  A = await testFirmasiOlustur("a");
  B = await testFirmasiOlustur("b");
  dbA = tenantaBagliDb(A.tenantId);
  dbB = tenantaBagliDb(B.tenantId);
});

after(async () => {
  try {
    await testVerisiniTemizle();
  } finally {
    await baglantiyiKapat();
  }
});

// Kısa yardımcılar: kayıt hâlâ aktif mi?
async function musteriAktifMi(db: TenantDb, id: string): Promise<boolean | undefined> {
  return (await db.customer.findFirst({ where: { id }, select: { isActive: true } }))?.isActive;
}
async function planAktifMi(db: TenantDb, id: string): Promise<boolean | undefined> {
  return (await db.plan.findFirst({ where: { id }, select: { isActive: true } }))?.isActive;
}

describe("finance kullanıcısı", () => {
  test("müşteriyi pasife alamaz, kayıt değişmez", async () => {
    const sonuc = await musteriPasifeAlCekirdek({ role: "finance" }, dbA, A.bosMusteriId);
    assert.equal(sonuc.durum, "hata");
    assert.equal(sonuc.mesaj, MESAJ.yetkiYok);
    assert.equal(await musteriAktifMi(dbA, A.bosMusteriId), true);
  });

  test("planı pasife alamaz, kayıt değişmez", async () => {
    const sonuc = await planPasifeAlCekirdek({ role: "finance" }, dbA, A.bosPlanId);
    assert.equal(sonuc.durum, "hata");
    assert.equal(sonuc.mesaj, MESAJ.yetkiYok);
    assert.equal(await planAktifMi(dbA, A.bosPlanId), true);
  });
});

describe("manager kullanıcısı: engellenen durumlar", () => {
  test("B'nin müşterisi için 'Kayıt bulunamadı.' alır, B'nin kaydı değişmez", async () => {
    const sonuc = await musteriPasifeAlCekirdek({ role: "manager" }, dbA, B.bosMusteriId);
    assert.equal(sonuc.mesaj, MESAJ.bulunamadi);
    assert.equal(await musteriAktifMi(dbB, B.bosMusteriId), true);
  });

  test("B'nin planı için 'Kayıt bulunamadı.' alır, B'nin kaydı değişmez", async () => {
    const sonuc = await planPasifeAlCekirdek({ role: "manager" }, dbA, B.bosPlanId);
    assert.equal(sonuc.mesaj, MESAJ.bulunamadi);
    assert.equal(await planAktifMi(dbB, B.bosPlanId), true);
  });

  test("biçimi bozuk kimlik için 'Kayıt bulunamadı.' alır", async () => {
    const sonuc = await musteriPasifeAlCekirdek({ role: "manager" }, dbA, "BOZUK-KIMLIK!");
    assert.equal(sonuc.mesaj, MESAJ.bulunamadi);
  });

  test("aktif aboneliği olan müşteri pasife alınamaz (Gün 5 kuralı)", async () => {
    const sonuc = await musteriPasifeAlCekirdek({ role: "manager" }, dbA, A.abonelikliMusteriId);
    assert.equal(sonuc.durum, "hata");
    assert.match(sonuc.mesaj ?? "", /aktif aboneliği var/);
    assert.equal(await musteriAktifMi(dbA, A.abonelikliMusteriId), true);
  });

  test("aktif aboneliği olan plan pasife alınamaz (Gün 5 kuralı)", async () => {
    const sonuc = await planPasifeAlCekirdek({ role: "manager" }, dbA, A.abonelikliPlanId);
    assert.equal(sonuc.durum, "hata");
    assert.match(sonuc.mesaj ?? "", /aktif abonelikleri var/);
    assert.equal(await planAktifMi(dbA, A.abonelikliPlanId), true);
  });
});

describe("manager kullanıcısı: başarılı pasife alma", () => {
  test("aboneliği olmayan müşteriyi pasife alır, ikinci denemede 'zaten pasif' der", async () => {
    const ilk = await musteriPasifeAlCekirdek({ role: "manager" }, dbA, A.bosMusteriId);
    assert.equal(ilk.durum, "basarili");
    assert.equal(ilk.mesaj, "Müşteri pasife alındı.");
    assert.equal(await musteriAktifMi(dbA, A.bosMusteriId), false);

    const ikinci = await musteriPasifeAlCekirdek({ role: "manager" }, dbA, A.bosMusteriId);
    assert.equal(ikinci.mesaj, "Bu müşteri zaten pasif.");
  });

  test("aboneliği olmayan planı pasife alır, ikinci denemede 'zaten pasif' der", async () => {
    const ilk = await planPasifeAlCekirdek({ role: "manager" }, dbA, A.bosPlanId);
    assert.equal(ilk.durum, "basarili");
    assert.equal(ilk.mesaj, "Plan pasife alındı.");
    assert.equal(await planAktifMi(dbA, A.bosPlanId), false);

    const ikinci = await planPasifeAlCekirdek({ role: "manager" }, dbA, A.bosPlanId);
    assert.equal(ikinci.mesaj, "Bu plan zaten pasif.");
  });
});