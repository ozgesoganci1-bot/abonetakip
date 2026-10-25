// DEMO KURULUM SENARYOSU TESTLERİ (Gün 13)
//
// demo-kurulum.ts veritabanına dokunmadığı için bu test "npm test" ile,
// veritabanı olmadan çalışır. Senaryo, yılın farklı anlarında üretilip kontrol edilir:
// ay ortası, ay sonu, yıl geçişi ve şu an. Kontroller:
//   - Hiçbir tarih gelecekte değil
//   - Bir müşterinin aynı anda iki aktif aboneliği yok
//   - Pasif müşterinin aktif aboneliği yok
//   - Son 12 ayın ortalama churn'ü %3-6 aralığında
//   - Bu ay en az 1 iptal var: churn 0 değil, LTV ve LTV/CAC dolu
//   - Tam 3 riskli abonelik var (dönem sonu 7 günden az kalmış)
//   - Adlar ve e-postalar kiracı içinde benzersiz, kullanıcılar @demo.example
//   - Aynı an için iki çalıştırma aynı veriyi üretir

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  AY_BASI_BEKLEME_MS,
  DEMO_KIRACILAR,
  DEMO_PAROLA,
  DEMO_UZANTI,
  demoSenaryosu,
  type KiraciSenaryosu,
} from "./demo-kurulum.ts";
import {
  type AbonelikGirdisi,
  ayAraligi,
  aylikChurn,
  metrikOzeti,
  mrrGecmisi,
  sonAylar,
  turkiyeAyi,
} from "../lib/metrikler.ts";
import { parolaDogrula } from "../lib/validation.ts";
import { RISK_GUN } from "../lib/riskli-abonelikler.ts";

const GUN = 24 * 60 * 60 * 1000;

// Türkiye saatiyle bir an (UTC+3).
function trAni(yil: number, ay: number, gun: number, saat: number, dakika = 0): Date {
  return new Date(Date.UTC(yil, ay - 1, gun, saat - 3, dakika));
}

// Denenen anlar: 2026'nın her ayının 15'i, ay sonları, yıl geçişi ve şu an.
const ANLAR: Date[] = [
  ...Array.from({ length: 12 }, (_, i) => trAni(2026, i + 1, 15, 12)),
  trAni(2026, 1, 31, 23, 50),
  trAni(2026, 2, 28, 20),
  trAni(2026, 3, 1, 3), // ayın 1'i, 3 saat geçmiş
  trAni(2026, 10, 31, 23, 59),
  trAni(2026, 12, 31, 22),
  trAni(2027, 1, 1, 9),
  trAni(2028, 2, 29, 12), // artık yıl
  new Date(),
];

// Senaryonun aboneliklerini metriklerin beklediği biçime çevirir (dashboard-verisi.ts gibi).
function girdiler(s: KiraciSenaryosu): AbonelikGirdisi[] {
  return s.abonelikler.map((a) => ({
    customerId: a.musteriAdi,
    fiyat: a.fiyat,
    aralik: a.aralik,
    status: a.iptal ? "CANCELED" : "ACTIVE",
    startedAt: a.baslangic,
    canceledAt: a.iptal,
  }));
}

function senaryoAl(kiraciNo: number, simdi: Date): KiraciSenaryosu {
  const sonuc = demoSenaryosu(DEMO_KIRACILAR[kiraciNo], simdi);
  assert.ok(sonuc.ok, `Senaryo üretilemedi (${simdi.toISOString()})`);
  return sonuc.senaryo;
}

test("demo parolası kayıt formundaki parola kuralına uyar", () => {
  assert.equal(parolaDogrula(DEMO_PAROLA).ok, true);
});

test("ayın ilk 2 saatinde senaryo üretilmez (bu ayın iptali sığmaz)", () => {
  const sonuc = demoSenaryosu(DEMO_KIRACILAR[0], trAni(2026, 11, 1, 1, 30));
  assert.equal(sonuc.ok, false);
  assert.ok(AY_BASI_BEKLEME_MS >= 60 * 60 * 1000);
});

test("aynı an için iki çalıştırma aynı veriyi üretir", () => {
  const an = trAni(2026, 10, 25, 12);
  assert.deepEqual(demoSenaryosu(DEMO_KIRACILAR[0], an), demoSenaryosu(DEMO_KIRACILAR[0], an));
});

test("iki kiracının adı, anahtarı ve e-postaları birbirinden farklı", () => {
  const [a, b] = DEMO_KIRACILAR;
  assert.notEqual(a.ad, b.ad);
  assert.notEqual(a.anahtar, b.anahtar);
  const an = trAni(2026, 10, 25, 12);
  const ea = senaryoAl(0, an).kullanicilar.map((k) => k.eposta);
  const eb = senaryoAl(1, an).kullanicilar.map((k) => k.eposta);
  assert.equal(new Set([...ea, ...eb]).size, ea.length + eb.length);
});

for (let kiraciNo = 0; kiraciNo < DEMO_KIRACILAR.length; kiraciNo++) {
  const ad = DEMO_KIRACILAR[kiraciNo].ad;

  test(`${ad}: yapı (kullanıcı, plan, müşteri sayıları ve benzersizlik)`, () => {
    const s = senaryoAl(kiraciNo, trAni(2026, 10, 25, 12));
    assert.deepEqual(
      s.kullanicilar.map((k) => k.rol),
      ["manager", "finance"]
    );
    for (const k of s.kullanicilar) assert.ok(k.eposta.endsWith(DEMO_UZANTI));
    assert.equal(s.planlar.length, 3);
    assert.deepEqual(
      s.planlar.map((p) => p.aralik).sort(),
      ["MONTHLY", "MONTHLY", "YEARLY"]
    );
    for (const p of s.planlar) assert.ok(Number.isInteger(p.fiyat) && p.fiyat > 0);
    assert.ok(s.musteriler.length >= 15 && s.musteriler.length <= 20);
    // seed-demo.ts kayıtları adla eşleştirir: adlar kiracı içinde benzersiz olmalı.
    assert.equal(new Set(s.musteriler.map((m) => m.ad)).size, s.musteriler.length);
    assert.equal(new Set(s.planlar.map((p) => p.ad)).size, s.planlar.length);
    const epostalar = s.musteriler.flatMap((m) => (m.eposta ? [m.eposta] : []));
    assert.equal(new Set(epostalar).size, epostalar.length);
    for (const e of epostalar) assert.ok(e.endsWith(DEMO_UZANTI));
    assert.equal(s.musteriler.filter((m) => !m.aktifMi).length, 2);
    // Her müşterinin en az bir aboneliği var, her abonelik bilinen bir plana bağlı.
    const planAdlari = new Set(s.planlar.map((p) => p.ad));
    for (const m of s.musteriler) {
      assert.ok(s.abonelikler.some((a) => a.musteriAdi === m.ad), `${m.ad} aboneliksiz`);
    }
    for (const a of s.abonelikler) assert.ok(planAdlari.has(a.planAdi));
  });

  for (const simdi of ANLAR) {
    const etiket = `${ad} @ ${simdi.toISOString()}`;

    test(`${etiket}: tarihler ve abonelik kuralları`, () => {
      const s = senaryoAl(kiraciNo, simdi);
      const t = simdi.getTime();
      assert.ok(s.olusturma.getTime() <= t);
      for (const m of s.musteriler) assert.ok(m.olusturma.getTime() <= t);

      for (const a of s.abonelikler) {
        assert.ok(a.baslangic.getTime() <= t, "gelecekte başlangıç");
        assert.ok(a.baslangic.getTime() >= s.olusturma.getTime(), "plan oluşturulmadan abonelik");
        const m = s.musteriler.find((x) => x.ad === a.musteriAdi);
        assert.ok(m && a.baslangic.getTime() >= m.olusturma.getTime());
        if (a.iptal) {
          assert.ok(a.iptal.getTime() <= t, "gelecekte iptal");
          assert.ok(a.iptal.getTime() > a.baslangic.getTime(), "başlamadan iptal");
        }
        for (const y of a.yenilemeler) {
          assert.ok(y.getTime() <= t && y.getTime() > a.baslangic.getTime(), "yenileme tarihi");
          if (a.iptal) assert.ok(y.getTime() <= a.iptal.getTime(), "iptalden sonra yenileme");
        }
        // Aktif aboneliğin dönemi henüz bitmemiş olmalı.
        if (!a.iptal) assert.ok(a.donemSonu.getTime() > t, "süresi geçmiş aktif abonelik");
      }

      // Bir müşterinin abonelikleri üst üste binmez; en fazla bir aktif aboneliği var.
      for (const m of s.musteriler) {
        const liste = s.abonelikler.filter((a) => a.musteriAdi === m.ad);
        assert.ok(liste.filter((a) => !a.iptal).length <= 1, `${m.ad}: iki aktif abonelik`);
        for (let i = 1; i < liste.length; i++) {
          const onceki = liste[i - 1];
          assert.ok(onceki.iptal && onceki.iptal.getTime() < liste[i].baslangic.getTime());
        }
        if (!m.aktifMi) assert.ok(liste.every((a) => a.iptal), `${m.ad}: pasif ama aktif aboneliği var`);
      }

      // İptal edip geri dönen bir müşteri var.
      assert.ok(s.musteriler.some((m) => s.abonelikler.filter((a) => a.musteriAdi === m.ad).length === 2));
    });

    test(`${etiket}: churn, LTV, riskli liste ve MRR eğrisi`, () => {
      const s = senaryoAl(kiraciNo, simdi);
      const g = girdiler(s);

      // Son 12 ayın ortalama churn'ü %3-6 (hesaplanamayan aylar ortalamaya girmez).
      const churnler = sonAylar(simdi, 12)
        .map(({ yil, ay }) => aylikChurn(g, ayAraligi(yil, ay)))
        .filter((c): c is number => c !== null);
      const ortalama = churnler.reduce((t, c) => t + c, 0) / churnler.length;
      assert.ok(ortalama >= 0.03 && ortalama <= 0.06, `ortalama churn ${ortalama}`);

      // Dashboard bu ayı gösterir: churn > 0, LTV ve LTV/CAC dolu.
      const { yil, ay } = turkiyeAyi(simdi);
      const ozet = metrikOzeti(g, ayAraligi(yil, ay), s.kiraci.cac);
      assert.ok(ozet.churn !== null && ozet.churn > 0, "bu ay churn 0");
      assert.notEqual(ozet.ltv, null);
      assert.notEqual(ozet.ltvCac, null);
      assert.ok(ozet.aktifMusteri >= 10);

      // Riskli liste (riskli-abonelikler.ts ile aynı koşul): tam 3 abonelik.
      const sinir = simdi.getTime() + RISK_GUN * GUN;
      const riskli = s.abonelikler.filter((a) => !a.iptal && a.donemSonu.getTime() < sinir);
      assert.equal(riskli.length, 3);

      // MRR eğrisi düz değil.
      const egri = mrrGecmisi(g, sonAylar(simdi, 12), simdi).map((n) => n.mrr);
      assert.ok(Math.max(...egri) > Math.min(...egri), "MRR eğrisi düz");
    });
  }
}
