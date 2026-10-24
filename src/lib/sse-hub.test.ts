// SSE BAĞLANTI MERKEZİ TESTLERİ (Gün 10)
//
// Veritabanı kullanılmaz: gerçek bağlantı yerine, gelen mesajları bir diziye
// yazan sahte bağlantılar kullanılır. Her test kendi temiz hub'ını üretir.
// Çalıştırmak için: npm test

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  FIRMA_BASINA_SINIR,
  hubOlustur,
  sseMesaji,
  type AboneSonucu,
  type Baglanti,
  type UyariOlayi,
} from "./sse-hub.ts";

const OLAY: UyariOlayi = { tur: "iptal", musteriAdi: "Örnek Müşteri" };

// Gelen mesajları biriktiren sahte bağlantı.
function sahteBaglanti() {
  const gelenler: string[] = [];
  const baglanti: Baglanti = {
    gonder: (metin) => {
      gelenler.push(metin);
    },
  };
  return { baglanti, gelenler };
}

// Kapanmış bağlantıyı taklit eder: her gönderimde hata fırlatır.
function bozukBaglanti(): Baglanti {
  return {
    gonder: () => {
      throw new Error("bağlantı kapalı");
    },
  };
}

// Bağlantının kabul edildiğini doğrular ve ayrılma fonksiyonunu döner.
function kabulEdildi(sonuc: AboneSonucu): () => void {
  if (!sonuc.ok) throw new Error("Bağlantı beklenmedik biçimde reddedildi.");
  return sonuc.ayril;
}

describe("Kiracı izolasyonu", () => {
  test("A firmasına yayınlanan mesaj B'nin bağlantısına gitmez", () => {
    const hub = hubOlustur();
    const a = sahteBaglanti();
    const b = sahteBaglanti();
    kabulEdildi(hub.abone("A", a.baglanti));
    kabulEdildi(hub.abone("B", b.baglanti));

    assert.equal(hub.yayinla("A", OLAY), 1);
    assert.equal(a.gelenler.length, 1);
    assert.equal(b.gelenler.length, 0, "B'nin bağlantısı A'nın uyarısını aldı.");
  });

  test("aynı firmadaki iki bağlantının ikisi de mesajı alır", () => {
    const hub = hubOlustur();
    const a1 = sahteBaglanti();
    const a2 = sahteBaglanti();
    kabulEdildi(hub.abone("A", a1.baglanti));
    kabulEdildi(hub.abone("A", a2.baglanti));

    assert.equal(hub.yayinla("A", OLAY), 2);
    assert.deepEqual(a1.gelenler, [sseMesaji(OLAY)]);
    assert.deepEqual(a2.gelenler, [sseMesaji(OLAY)]);
  });
});

describe("Bağlantı yaşam döngüsü", () => {
  test("ayrılan bağlantı sonraki mesajı almaz ve listeden silinir", () => {
    const hub = hubOlustur();
    const a1 = sahteBaglanti();
    const a2 = sahteBaglanti();
    const ayril = kabulEdildi(hub.abone("A", a1.baglanti));
    kabulEdildi(hub.abone("A", a2.baglanti));

    ayril();
    assert.equal(hub.baglantiSayisi("A"), 1);

    hub.yayinla("A", OLAY);
    assert.equal(a1.gelenler.length, 0, "Ayrılan bağlantı mesaj aldı.");
    assert.equal(a2.gelenler.length, 1);
  });

  test("firmanın son bağlantısı da ayrılınca firma listeden silinir", () => {
    const hub = hubOlustur();
    const ayril = kabulEdildi(hub.abone("A", sahteBaglanti().baglanti));
    assert.equal(hub.firmaSayisi(), 1);

    ayril();
    assert.equal(hub.firmaSayisi(), 0);
    assert.equal(hub.yayinla("A", OLAY), 0);
  });

  test("gönderimde hata veren bağlantı çıkarılır, diğerleri almaya devam eder", () => {
    const hub = hubOlustur();
    const a = sahteBaglanti();
    kabulEdildi(hub.abone("A", bozukBaglanti()));
    kabulEdildi(hub.abone("A", a.baglanti));

    assert.equal(hub.yayinla("A", OLAY), 1);
    assert.equal(hub.baglantiSayisi("A"), 1, "Bozuk bağlantı listeden çıkarılmadı.");

    // İkinci yayında bozuk bağlantı artık denenmez.
    assert.equal(hub.yayinla("A", OLAY), 1);
    assert.equal(a.gelenler.length, 2);
  });

  test("ayrılma iki kez çağrılırsa başka bağlantıya zarar vermez", () => {
    const hub = hubOlustur();
    const a2 = sahteBaglanti();
    const ayril = kabulEdildi(hub.abone("A", sahteBaglanti().baglanti));
    kabulEdildi(hub.abone("A", a2.baglanti));

    ayril();
    ayril();
    assert.equal(hub.baglantiSayisi("A"), 1);
    hub.yayinla("A", OLAY);
    assert.equal(a2.gelenler.length, 1);
  });
});

describe("Firma başına bağlantı sınırı", () => {
  test("sınıra kadar kabul edilir, fazlası reddedilir ve mesaj almaz", () => {
    const hub = hubOlustur(2);
    kabulEdildi(hub.abone("A", sahteBaglanti().baglanti));
    kabulEdildi(hub.abone("A", sahteBaglanti().baglanti));

    const fazla = sahteBaglanti();
    assert.equal(hub.abone("A", fazla.baglanti).ok, false);
    assert.equal(hub.baglantiSayisi("A"), 2);

    assert.equal(hub.yayinla("A", OLAY), 2);
    assert.equal(fazla.gelenler.length, 0, "Reddedilen bağlantı mesaj aldı.");
  });

  test("bir bağlantı ayrılınca yeni bağlantı tekrar kabul edilir", () => {
    const hub = hubOlustur(2);
    const ayril = kabulEdildi(hub.abone("A", sahteBaglanti().baglanti));
    kabulEdildi(hub.abone("A", sahteBaglanti().baglanti));
    assert.equal(hub.abone("A", sahteBaglanti().baglanti).ok, false);

    ayril();
    assert.equal(hub.abone("A", sahteBaglanti().baglanti).ok, true);
    assert.equal(hub.baglantiSayisi("A"), 2);
  });

  test("A firmasının sınırı dolu olsa da B'nin bağlantısı kabul edilir", () => {
    const hub = hubOlustur(2);
    kabulEdildi(hub.abone("A", sahteBaglanti().baglanti));
    kabulEdildi(hub.abone("A", sahteBaglanti().baglanti));
    assert.equal(hub.abone("A", sahteBaglanti().baglanti).ok, false);

    assert.equal(hub.abone("B", sahteBaglanti().baglanti).ok, true);
  });

  test("varsayılan sınır 20'dir", () => {
    assert.equal(FIRMA_BASINA_SINIR, 20);
    const hub = hubOlustur();
    for (let i = 0; i < FIRMA_BASINA_SINIR; i++) {
      kabulEdildi(hub.abone("A", sahteBaglanti().baglanti));
    }
    assert.equal(hub.abone("A", sahteBaglanti().baglanti).ok, false);
  });
});

describe("Mesaj biçimi", () => {
  test("SSE biçimindedir ve müşteri adındaki satır sonu biçimi bozmaz", () => {
    assert.equal(
      sseMesaji(OLAY),
      'event: iptal\ndata: {"musteriAdi":"Örnek Müşteri"}\n\n'
    );

    // Satır sonu "\n" olarak kaçırılır: tek bir "data:" satırı kalır.
    const metin = sseMesaji({ tur: "iptal", musteriAdi: "Satır 1\nSatır 2" });
    assert.deepEqual(metin.split("\n"), [
      "event: iptal",
      'data: {"musteriAdi":"Satır 1\\nSatır 2"}',
      "",
      "",
    ]);
  });
});