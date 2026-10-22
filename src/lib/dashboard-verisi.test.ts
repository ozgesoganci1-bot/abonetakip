// KİRACI TESTİ: DASHBOARD VERİSİ (Gün 9)
//
// Ne test edilir? src/lib/dashboard-verisi.ts: dashboard sayılarının yalnızca
// oturumdaki firmanın kayıtlarından hesaplandığı.
// Test firmalarının her birinde 1 ACTIVE abonelik vardır (aylık PLAN_FIYATI TL,
// bu çalışmada, yani bu ay başlamış). CAC başlangıçta 0'dır.
// Hesap kurallarının ayrıntısı metrikler.test.ts içindedir; burada yalnızca
// veritabanından okuma ve kiracı ayrımı kontrol edilir.
//
// Sıra önemlidir: B'nin CAC'sini değiştiren test en sondadır.
// Çalıştırmak için: npm run test:db

import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
// Önce test verisi yardımcısı: TEST_VERITABANI kontrolü onun içinde yapılır.
import {
  testFirmasiOlustur,
  testVerisiniTemizle,
  baglantiyiKapat,
  PLAN_FIYATI,
  type TestFirmasi,
} from "../test-destek/veri.ts";
import { tenantaBagliDb, type TenantDb } from "./tenant.ts";
import { dashboardVerisiniGetir } from "./dashboard-verisi.ts";
import { turkiyeAyi } from "./metrikler.ts";

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

describe("dashboard verisi", () => {
  test("A'nın verisi yalnızca A'nın aboneliğini içerir (B'ninki sayılmaz)", async () => {
    const simdi = new Date();
    const veri = await dashboardVerisiniGetir(dbA, simdi);

    assert.equal(veri.aboneVarMi, true);
    // B'nin aboneliği de sayılsaydı MRR 2.000 ve aktif müşteri 2 olurdu.
    assert.equal(veri.ozet.mrr, PLAN_FIYATI);
    assert.equal(veri.ozet.aktifMusteri, 1);
    assert.deepEqual({ yil: veri.yil, ay: veri.ay }, turkiyeAyi(simdi));
  });

  test("bu ay başlayan abonelik 'yeni' sayılır; ay başında müşteri yoksa churn hesaplanamaz", async () => {
    const veri = await dashboardVerisiniGetir(dbA);

    assert.deepEqual(veri.hareket, { yeni: 1, iptal: 0 });
    assert.equal(veri.ozet.churn, null);
    assert.ok(veri.ozet.nedenler.churn);
  });

  test("CAC her firmanın kendi ayarından okunur", async () => {
    // B'nin CAC'si girilir. A etkilenmemeli.
    await dbB.tenant.update({
      where: { id: B.tenantId },
      data: { cac: 5000 },
      select: { id: true },
    });

    assert.equal((await dashboardVerisiniGetir(dbA)).cacGirildiMi, false);
    assert.equal((await dashboardVerisiniGetir(dbB)).cacGirildiMi, true);
  });
});