// Kimlik doğrulama: kayıt, giriş, çıkış ve aktif kullanıcıyı bulma.
//
// Bu dosya ham "prisma" nesnesini kullanabilir, çünkü iki işlem kiracı
// (tenant) belli olmadan gerçekleşir:
//   - Kayıt: henüz kiracı yoktur, onu oluşturuyoruz.
//   - Giriş: kullanıcıyı e-postayla buluruz, kiracıyı ancak sonra öğreniriz.
// Diğer bütün veri sorguları src/lib/tenant.ts içindeki getTenantDb() ile yapılır.

import { cache } from "react";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import type { Role } from "../../generated/prisma/enums";
import { prisma } from "./db";
import {
  oturumCerezindenSil,
  oturumCerezineYaz,
  oturumKullaniciIdOku,
} from "./session";
import { epostaDogrula, type KayitGirdisi } from "./validation";

// bcrypt maliyeti: sayı büyüdükçe özetleme yavaşlar ve kırılması zorlaşır.
const BCRYPT_TUR = 12;

// Giriş hatasında hangi alanın yanlış olduğu bilerek söylenmez.
const GIRIS_HATASI = "E-posta veya parola hatalı.";

// İşlem sonucu: başarılı ya da kullanıcıya gösterilecek hata.
export type IslemSonucu = { ok: true } | { ok: false; hata: string };

// Giriş yapmış kullanıcının uygulama içinde kullanılan bilgileri.
export type AktifKullanici = {
  id: string;
  tenantId: string;
  role: Role;
  adSoyad: string | null;
  eposta: string;
  firmaAdi: string;
};

// Oturumdaki kullanıcıyı bulur. tenantId ve rol, ÇEREZDEN DEĞİL veritabanından
// okunur. Böylece çerez değiştirilse bile başka firmaya geçilemez.
// cache(): aynı istek içinde veritabanına yalnızca bir kez gidilir.
export const getCurrentUser = cache(
  async (): Promise<AktifKullanici | null> => {
    const kullaniciId = await oturumKullaniciIdOku();
    if (!kullaniciId) return null;

    const kullanici = await prisma.user.findUnique({
      where: { id: kullaniciId },
      select: {
        id: true,
        tenantId: true,
        role: true,
        name: true,
        email: true,
        tenant: { select: { name: true } },
      },
    });

    // Çerez geçerli ama kullanıcı silinmişse oturum yok sayılır.
    if (!kullanici) return null;

    return {
      id: kullanici.id,
      tenantId: kullanici.tenantId,
      role: kullanici.role,
      adSoyad: kullanici.name,
      eposta: kullanici.email,
      firmaAdi: kullanici.tenant.name,
    };
  }
);

// Giriş yapmamış kullanıcıyı giriş sayfasına gönderir.
export async function requireUser(): Promise<AktifKullanici> {
  const kullanici = await getCurrentUser();
  if (!kullanici) redirect("/giris");
  return kullanici;
}

// Yalnızca manager için. Giriş yapmamışsa giriş sayfasına yönlendirir.
// Kullanıcı finance ise null döner: sayfa "yetkiniz yok" mesajı göstermelidir,
// sunucu işlemi ise işlemi yapmadan durmalıdır.
export async function requireManager(): Promise<AktifKullanici | null> {
  const kullanici = await requireUser();
  return kullanici.role === "manager" ? kullanici : null;
}

// Prisma'nın "tekrar eden kayıt" hatasını (P2002) tanır.
function tekrarEdenKayitMi(hata: unknown): boolean {
  return (
    typeof hata === "object" &&
    hata !== null &&
    "code" in hata &&
    (hata as { code: unknown }).code === "P2002"
  );
}

// Kayıt: yeni firma ve o firmanın ilk kullanıcısı (manager) birlikte oluşturulur.
export async function kayitOl(girdi: KayitGirdisi): Promise<IslemSonucu> {
  // Bu e-posta daha önce kullanılmış mı?
  const mevcut = await prisma.user.findUnique({
    where: { email: girdi.eposta },
    select: { id: true },
  });
  if (mevcut) {
    return { ok: false, hata: "Bu e-posta adresiyle zaten bir hesap var." };
  }

  // Parola düz metin saklanmaz, bcrypt ile özetlenir.
  const passwordHash = await bcrypt.hash(girdi.parola, BCRYPT_TUR);

  try {
    // İç içe oluşturma tek bir işlemdir: ya firma ve kullanıcı birlikte
    // kaydedilir ya da hiçbiri. tenantId'yi Prisma kendisi doldurur.
    const firma = await prisma.tenant.create({
      data: {
        name: girdi.firmaAdi,
        users: {
          create: {
            email: girdi.eposta,
            name: girdi.adSoyad,
            passwordHash,
            role: "manager",
          },
        },
      },
      select: { users: { select: { id: true } } },
    });

    const kullaniciId = firma.users[0]?.id;
    if (!kullaniciId) {
      return { ok: false, hata: "Kayıt tamamlanamadı. Lütfen tekrar deneyin." };
    }

    await oturumCerezineYaz(kullaniciId);
    return { ok: true };
  } catch (hata) {
    // İki kişi aynı anda aynı e-postayla kayıt olursa veritabanı engeller.
    if (tekrarEdenKayitMi(hata)) {
      return { ok: false, hata: "Bu e-posta adresiyle zaten bir hesap var." };
    }
    // Beklenmeyen hatada ayrıntı kullanıcıya gösterilmez, parola loglanmaz.
    console.error("Kayıt sırasında beklenmeyen hata.");
    return { ok: false, hata: "Kayıt tamamlanamadı. Lütfen tekrar deneyin." };
  }
}

// Kullanıcı bulunamasa bile karşılaştırma yapabilmek için sahte bir özet.
// Böylece cevabın süresinden "bu e-posta kayıtlı mı" bilgisi çıkarılamaz.
let sahteOzet: string | undefined;
async function sahteOzetiAl(): Promise<string> {
  if (!sahteOzet) {
    sahteOzet = await bcrypt.hash("sahte-parola-degeri", BCRYPT_TUR);
  }
  return sahteOzet;
}

// Giriş: e-posta ve parola doğruysa oturum çerezi yazılır.
export async function girisYap(
  epostaGirdisi: unknown,
  parolaGirdisi: unknown
): Promise<IslemSonucu> {
  const parola = typeof parolaGirdisi === "string" ? parolaGirdisi : "";
  const eposta = epostaDogrula(epostaGirdisi);

  // Boş ya da biçimi bozuk girdi, makul olmayan uzunluk: tek tip hata.
  if (!eposta.ok || parola.length === 0 || parola.length > 1000) {
    return { ok: false, hata: GIRIS_HATASI };
  }

  const kullanici = await prisma.user.findUnique({
    where: { email: eposta.deger },
    select: { id: true, passwordHash: true },
  });

  // Kullanıcı yoksa da bir karşılaştırma yapılır (süre farkı oluşmasın).
  const ozet = kullanici?.passwordHash ?? (await sahteOzetiAl());
  const dogruMu = await bcrypt.compare(parola, ozet);

  if (!kullanici || !dogruMu) {
    return { ok: false, hata: GIRIS_HATASI };
  }

  await oturumCerezineYaz(kullanici.id);
  return { ok: true };
}

// Çıkış: çerezi siler.
export async function cikisYap(): Promise<void> {
  await oturumCerezindenSil();
}