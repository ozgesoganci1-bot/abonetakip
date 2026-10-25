// ROL VE KİRACI TESTLERİ: KULLANICI EKLEME (Gün 14)
//
// Ne test edilir? src/lib/kullanici-yonetimi.ts içindeki kullaniciEkleCekirdek ve
// kullanicilariListele. Sunucu işleminin çağırdığı fonksiyonların aynısıdır.
// Tek fark: kullanıcı ve veritabanı nesnesi oturumdan değil, testten verilir.
//
// Testte eklenen bütün kullanıcılar A firmasına yazılır ve e-postaları bu
// çalışmanın etiketiyle başlar (@example.com). testVerisiniTemizle() test
// firmalarının bütün kullanıcılarını sildiği için ayrıca temizlik gerekmez.
//
// Sıra önemlidir: A firması 2 kullanıcıyla başlar (veri.ts: manager ve finance),
// sayılar testler ilerledikçe artar.
// Çalıştırmak için: npm run test:db

import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
// Önce test verisi yardımcısı: TEST_VERITABANI kontrolü onun içinde yapılır.
import {
  testFirmasiOlustur,
  testVerisiniTemizle,
  baglantiyiKapat,
  CALISMA,
  type TestFirmasi,
} from "../test-destek/veri.ts";
import bcrypt from "bcryptjs";
import { tenantaBagliDb, type TenantDb } from "./tenant.ts";
import {
  kullaniciEkleCekirdek,
  kullanicilariListele,
  EPOSTA_KAYITLI,
} from "./kullanici-yonetimi.ts";
import { MESAJ } from "./islem.ts";

let A: TestFirmasi;
let B: TestFirmasi;
let dbA: TenantDb;
let dbB: TenantDb;

// Sahte test parolası (gerçek bir parola değildir).
const PAROLA = "Deneme-parola-123";
const YENI_EPOSTA = `${CALISMA}-a-yeni@example.com`;
// veri.ts'nin B firmasında oluşturduğu finance kullanıcısının e-postası.
const B_EPOSTA = `${CALISMA}-b-finance@example.com`;

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

// Kısa yardımcılar
function yonetici(firma: TestFirmasi) {
  return { role: "manager" as const, tenantId: firma.tenantId };
}
function formGirdisi(ek: Partial<Record<"adSoyad" | "eposta" | "parola", unknown>> = {}) {
  return { adSoyad: "Deneme Finans", eposta: YENI_EPOSTA, parola: PAROLA, ...ek };
}
async function kullaniciSayisi(db: TenantDb): Promise<number> {
  return db.user.count();
}

describe("finance kullanıcısı", () => {
  test("kullanıcı ekleyemez, kayıt sayısı değişmez", async () => {
    const sonuc = await kullaniciEkleCekirdek(
      { role: "finance", tenantId: A.tenantId },
      dbA,
      formGirdisi()
    );
    assert.equal(sonuc.durum, "hata");
    assert.equal(sonuc.mesaj, MESAJ.yetkiYok);
    assert.equal(await kullaniciSayisi(dbA), 2);
  });
});

describe("manager kullanıcısı: geçersiz girdi", () => {
  test("alan hataları döner, parola geri gönderilmez, kayıt sayısı değişmez", async () => {
    const sonuc = await kullaniciEkleCekirdek(
      yonetici(A),
      dbA,
      formGirdisi({ adSoyad: "", eposta: "gecersiz", parola: "kisa1" })
    );
    assert.equal(sonuc.durum, "hata");
    assert.equal(sonuc.mesaj, MESAJ.formHatali);
    assert.deepEqual(Object.keys(sonuc.alanHatalari ?? {}).sort(), [
      "adSoyad",
      "eposta",
      "parola",
    ]);
    // Form yalnızca ad ve e-postayla yeniden doldurulur.
    assert.deepEqual(sonuc.degerler, { adSoyad: "", eposta: "gecersiz" });
    assert.ok(!JSON.stringify(sonuc).includes("kisa1"), "parola sonuçta geçmemeli");
    assert.equal(await kullaniciSayisi(dbA), 2);
  });
});

describe("manager kullanıcısı: başarılı ekleme", () => {
  test("finance olarak A'ya eklenir, e-posta küçük harfe çevrilir, parola özetlenir", async () => {
    const sonuc = await kullaniciEkleCekirdek(
      yonetici(A),
      dbA,
      formGirdisi({ eposta: `  ${YENI_EPOSTA.toUpperCase()}  ` })
    );
    assert.equal(sonuc.durum, "basarili");
    assert.equal(
      sonuc.mesaj,
      '"Deneme Finans" finans rolüyle eklendi. Giriş bilgilerini kendisine güvenli bir yoldan iletin.'
    );
    assert.equal(sonuc.degerler, undefined, "başarıda form boşalmalı");

    const kayit = await dbA.user.findFirst({
      where: { email: YENI_EPOSTA },
      select: { tenantId: true, role: true, name: true, passwordHash: true },
    });
    assert.ok(kayit, "kullanıcı A firmasında bulunmalı");
    assert.equal(kayit.tenantId, A.tenantId);
    assert.equal(kayit.role, "finance");
    assert.equal(kayit.name, "Deneme Finans");
    assert.notEqual(kayit.passwordHash, PAROLA, "parola düz metin saklanmamalı");
    assert.ok(await bcrypt.compare(PAROLA, kayit.passwordHash), "özet parolayla eşleşmeli");
    assert.equal(await kullaniciSayisi(dbA), 3);
  });

  test("liste: A yeni kullanıcıyı görür, B görmez, parola özeti listede yok", async () => {
    const listeA = await kullanicilariListele(dbA);
    assert.ok(listeA.some((k) => k.email === YENI_EPOSTA));
    for (const satir of listeA) {
      assert.ok(!("passwordHash" in satir), "listede parola özeti olmamalı");
    }

    const listeB = await kullanicilariListele(dbB);
    assert.ok(!listeB.some((k) => k.email === YENI_EPOSTA));
    assert.equal(listeB.length, 2);
  });
});

describe("e-posta tekrarı", () => {
  test("aynı firmada kayıtlı e-posta reddedilir (kayıt formuyla aynı mesaj)", async () => {
    assert.equal(EPOSTA_KAYITLI, "Bu e-posta adresiyle zaten bir hesap var.");
    const sonuc = await kullaniciEkleCekirdek(
      yonetici(A),
      dbA,
      formGirdisi({ adSoyad: "Başka Kişi" })
    );
    assert.equal(sonuc.durum, "hata");
    assert.equal(sonuc.mesaj, MESAJ.formHatali);
    assert.deepEqual(sonuc.alanHatalari, { eposta: EPOSTA_KAYITLI });
    assert.deepEqual(sonuc.degerler, { adSoyad: "Başka Kişi", eposta: YENI_EPOSTA });
    assert.equal(await kullaniciSayisi(dbA), 3);
  });

  test("başka firmada kayıtlı e-posta da reddedilir, B'nin kullanıcısı değişmez", async () => {
    const sonuc = await kullaniciEkleCekirdek(
      yonetici(A),
      dbA,
      formGirdisi({ eposta: B_EPOSTA })
    );
    assert.equal(sonuc.durum, "hata");
    assert.deepEqual(sonuc.alanHatalari, { eposta: EPOSTA_KAYITLI });
    assert.equal(await kullaniciSayisi(dbA), 3);

    const bKullanicisi = await dbB.user.findFirst({
      where: { email: B_EPOSTA },
      select: { tenantId: true, role: true, name: true },
    });
    assert.deepEqual(bKullanicisi, {
      tenantId: B.tenantId,
      role: "finance",
      name: "Test Finans",
    });
  });
});

describe("kiracı izolasyonu", () => {
  test("firmayı kullanıcı nesnesindeki tenantId değil, db belirler", async () => {
    // Kullanıcı nesnesinde B yazsa bile A'nın db nesnesiyle yapılan ekleme A'ya gider
    // (tenant.ts ekleme sırasında tenantId'yi oturumdaki değerle ezer).
    const eposta = `${CALISMA}-a-ikinci@example.com`;
    const sonuc = await kullaniciEkleCekirdek(
      { role: "manager", tenantId: B.tenantId },
      dbA,
      formGirdisi({ eposta })
    );
    assert.equal(sonuc.durum, "basarili");

    const kayit = await dbA.user.findFirst({
      where: { email: eposta },
      select: { tenantId: true },
    });
    assert.equal(kayit?.tenantId, A.tenantId);
    assert.equal(await kullaniciSayisi(dbA), 4);
    assert.equal(await kullaniciSayisi(dbB), 2);
  });
});