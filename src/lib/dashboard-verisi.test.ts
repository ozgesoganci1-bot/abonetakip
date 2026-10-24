// KİRACI TESTİ: DASHBOARD VERİSİ (Gün 9, Gün 11'de MRR geçmişi eklendi)
//
// Ne test edilir? src/lib/dashboard-verisi.ts: dashboard sayılarının yalnızca
// oturumdaki firmanın kayıtlarından hesaplandığı.
// Test firmalarının her birinde 1 ACTIVE abonelik vardır (aylık PLAN_FIYATI TL,
// bu çalışmada, yani bu ay başlamış). CAC başlangıçta 0'dır.
// Hesap kurallarının ayrıntısı metrikler.test.ts içindedir; burada yalnızca
// veritabanından okuma ve kiracı ayrımı kontrol edilir.
// Gün 11: MRR geçmişinin (grafik) de yalnızca firmanın kendi aboneliklerinden
// geldiği ve son noktasının MRR kartıyla aynı olduğu kontrol edilir.
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
import { dashboardVerisiniGetir, GRAFIK_AY_SAYISI } from "./dashboard-verisi.ts";
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

  test("MRR geçmişi (Gün 11): 12 ay, yalnızca A'nın aboneliği, son nokta MRR kartıyla aynı", async () => {
    // "simdi" 1 dakika ileri alınır: abonelik başlangıç anı ile bu bilgisayarın saati
    // arasındaki milisaniyelik farklar testi kararsız yapmasın. Başlangıç "simdi"den
    // sonra kalsaydı tarihe bakan grafik 0, status'a bakan kart PLAN_FIYATI gösterirdi.
    const simdi = new Date(Date.now() + 60_000);
    const veri = await dashboardVerisiniGetir(dbA, simdi);

    assert.equal(veri.mrrGecmisi.length, GRAFIK_AY_SAYISI);

    const son = veri.mrrGecmisi[veri.mrrGecmisi.length - 1];
    assert.deepEqual({ yil: son.yil, ay: son.ay }, turkiyeAyi(simdi));
    // B'nin aboneliği de sayılsaydı son nokta 2 x PLAN_FIYATI olurdu.
    assert.equal(son.mrr, PLAN_FIYATI);
    assert.equal(son.mrr, veri.ozet.mrr);

    // Abonelik bu çalışmada başladı: önceki 11 ayda MRR yok.
    assert.ok(veri.mrrGecmisi.slice(0, -1).every((n) => n.mrr === 0));
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