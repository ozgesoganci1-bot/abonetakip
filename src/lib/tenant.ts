// MERKEZİ KİRACI (TENANT) FİLTRESİ
//
// Uygulamadaki bütün veri sorguları bu dosyadaki getTenantDb() üzerinden yapılır.
// Bu nesne, her sorguya aktif kullanıcının tenantId değerini OTOMATİK ekler:
//   - Okuma, sayma, güncelleme, silme: filtreye "tenantId = oturumdaki değer" eklenir.
//   - Kayıt ekleme: tenantId, oturumdaki değerle zorla üzerine yazılır.
//   - Tanımadığı bir işlemle karşılaşırsa hata verir ("izin ver" değil "durdur").
// tenantId hiçbir zaman istemciden (form, URL) alınmaz, yalnızca oturumdan gelir.
//
// YAZMA KORUMASI (Gün 6): Ekleme ve güncelleme verisinde YALNIZCA tablonun kendi
// sütunları kullanılabilir (beyaz liste). İlişki alanları (ör. "tenant", "customer",
// "subscriptions") reddedilir. Neden? Prisma'da bir kayıt ilişki üzerinden de başka
// firmaya bağlanabilir: data: { tenant: { connect: { id: "B" } } }. Gün 6 testleri bu
// yolla bir müşterinin başka firmaya taşınabildiğini gösterdi. İç içe yazımlar
// (connect, create, connectOrCreate ...) yalnızca ilişki alanlarının altında yazılabildiği
// için beyaz liste hepsini en üst düzeyde durdurur.
// Ayrıca güncellemede "id" ve "tenantId" değiştirilemez.
// Sütun listeleri Prisma'nın şemadan ürettiği koddan okunur; şemaya yeni sütun
// eklenince ayrıca güncellemek gerekmez.
//
// SİLME KORUMASI (Gün 7): İş kuralına göre müşteri ve plan silinmez, pasife alınır;
// abonelik silinmez, iptal edilir; olay kayıtları hiç silinmez. Bu tablolarda
// "delete" ve "deleteMany" veritabanına gitmeden durdurulur. Kullanıcı (User)
// tablosunda silme serbesttir. Firma (Tenant) tablosu ayrıca aşağıda korunur.
// Test verisinin temizliği (src/test-destek/veri.ts) ham "prisma" ile yapıldığı
// için bu korumadan etkilenmez.
//
// FİRMA TABLOSU KİMLİK KURALI (Gün 12, issue #24): Firma tablosunda "where" içinde
// başka bir firmanın kimliği istenirse kimlik oturumdakiyle ezilmez, sonuç
// "bulunamadı" olur (bkz. firmaKosulu). Diğer tablolarda "where" içine yazılan
// tenantId hâlâ oturumdakiyle ezilir; uygulama kodu "where" içinde tenantId
// kullanmadığı için bu, ADR'de bilinen sınır olarak bırakıldı.
//
// YASAK: prisma.$queryRaw / $executeRaw. Ham SQL bu filtreden geçmez.

import { prisma } from "./db";
import { requireUser } from "./auth";
import {
  TenantScalarFieldEnum,
  UserScalarFieldEnum,
  CustomerScalarFieldEnum,
  PlanScalarFieldEnum,
  SubscriptionScalarFieldEnum,
  SubscriptionEventScalarFieldEnum,
} from "../../generated/prisma/internal/prismaNamespace";

// Okuma türü işlemler.
const OKUMA = new Set([
  "findUnique",
  "findUniqueOrThrow",
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "count",
  "aggregate",
  "groupBy",
]);

// Mevcut kayıtları değiştiren veya silen işlemler.
const GUNCELLEME_SILME = new Set([
  "update",
  "updateMany",
  "updateManyAndReturn",
  "delete",
  "deleteMany",
]);

// Silme işlemleri (silme korumasında kullanılır).
const SILME = new Set(["delete", "deleteMany"]);

// Kayıtları silinemeyen tablolar ve hata mesajında gösterilecek neden.
// Bu listede olmayan tablolarda (User) silme serbesttir.
const SILINEMEZ = new Map<string, string>([
  ["Customer", "kayıtlar silinmez, pasife alınır"],
  ["Plan", "kayıtlar silinmez, pasife alınır"],
  ["Subscription", "abonelikler silinmez, iptal edilir"],
  ["SubscriptionEvent", "olay kayıtları silinmez"],
]);

// Çoklu kayıt ekleme işlemleri.
const COKLU_EKLEME = new Set(["createMany", "createManyAndReturn"]);

// Her tablonun yazılabilir sütunları (Prisma'nın ürettiği listelerden).
// Bu listede olmayan bir tablo için yazma işlemi durdurulur.
const SUTUNLAR: Record<string, ReadonlySet<string>> = {
  Tenant: new Set<string>(Object.values(TenantScalarFieldEnum)),
  User: new Set<string>(Object.values(UserScalarFieldEnum)),
  Customer: new Set<string>(Object.values(CustomerScalarFieldEnum)),
  Plan: new Set<string>(Object.values(PlanScalarFieldEnum)),
  Subscription: new Set<string>(Object.values(SubscriptionScalarFieldEnum)),
  SubscriptionEvent: new Set<string>(Object.values(SubscriptionEventScalarFieldEnum)),
};

// Değerin düz bir nesne olup olmadığını kontrol eder.
function nesneMi(deger: unknown): deger is Record<string, unknown> {
  return typeof deger === "object" && deger !== null && !Array.isArray(deger);
}

// Ekleme ve güncelleme verisini denetler. Kurala uymayan ilk alanda durdurur.
//   ekleme:     yalnızca tablonun sütunları (tenantId yazılabilir, sonra zaten ezilir)
//   guncelleme: yalnızca tablonun sütunları, "id" ve "tenantId" hariç
// veri: tek bir nesne ya da (createMany için) nesne dizisi.
function veriyiDenetle(
  model: string,
  veri: unknown,
  tur: "ekleme" | "guncelleme"
): void {
  const sutunlar = SUTUNLAR[model];
  if (!sutunlar) {
    throw new Error(`"${model}" tablosu kiracı filtresi tarafından tanınmıyor.`);
  }

  const satirlar = Array.isArray(veri) ? veri : [veri];
  for (const satir of satirlar) {
    // Nesne değilse (ör. eksik veri) Prisma kendi doğrulamasıyla reddeder.
    if (!nesneMi(satir)) continue;

    for (const alan of Object.keys(satir)) {
      if (tur === "guncelleme" && alan === "tenantId") {
        // Bir kayıt başka firmaya taşınamaz.
        throw new Error("tenantId değiştirilemez.");
      }
      if (tur === "guncelleme" && alan === "id") {
        throw new Error('"id" alanı bu işlemde kullanılamaz: kayıt kimliği değiştirilemez.');
      }
      if (!sutunlar.has(alan)) {
        throw new Error(
          `"${alan}" alanı bu işlemde kullanılamaz: yalnızca tablonun kendi sütunları yazılabilir.`
        );
      }
    }
  }
}

// Firma (Tenant) tablosu için sorgu koşulu (Gün 12, bulgu B6, issue #24).
//
// Oturumdaki firma kimliği her zaman zorunludur. Kod "where" içinde ayrıca bir "id"
// gönderirse bu kimlik EZİLMEZ: AND içinde oturumdaki kimlikle BİRLİKTE uygulanır.
// İkisi aynı anda sağlanamıyorsa veritabanı "bulunamadı" cevabı verir:
//   okumada null / boş liste / 0, güncellemede "kayıt bulunamadı" hatası.
// Eskiden gönderilen kimlik oturumdakiyle değiştiriliyordu: B istenince sessizce
// A'nın kaydı dönüyor ya da A güncelleniyordu (sızıntı yoktu ama yanıltıcıydı).
//
// "id" bir nesne olsa da (in, not, equals ...) aynı kural geçerlidir:
//   { id: { in: [A, B] } } -> yalnızca A; { id: { not: A } } -> hiçbiri.
// Koşulda daha önceden AND varsa korunur, yeni koşul listenin sonuna eklenir.
// "id" hiç verilmemişse ya da tam olarak oturumdaki kimlikse davranış değişmez.
function firmaKosulu(
  kosul: Record<string, unknown>,
  tenantId: string
): Record<string, unknown> {
  if (kosul.id === undefined || kosul.id === tenantId) {
    return { ...kosul, id: tenantId };
  }
  const oncekiAnd =
    kosul.AND === undefined ? [] : Array.isArray(kosul.AND) ? kosul.AND : [kosul.AND];
  return { ...kosul, id: tenantId, AND: [...oncekiAnd, { id: kosul.id }] };
}

// Verilen kiracıya bağlı bir veritabanı nesnesi üretir.
// Doğrudan test edilebilmesi için dışarı açıktır; uygulama kodu getTenantDb() kullanır.
export function tenantaBagliDb(tenantId: string) {
  return prisma.$extends({
    name: "tenantFiltresi",
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const a: Record<string, unknown> = nesneMi(args) ? { ...args } : {};
          const kosul = nesneMi(a.where) ? a.where : {};

          // Firma (Tenant) tablosu: yalnızca kullanıcının kendi firması.
          // Okunabilir ve güncellenebilir (ör. CAC ayarı). Eklenemez, silinemez.
          // Koşul firmaKosulu() ile kurulur (Gün 12, issue #24).
          if (model === "Tenant") {
            if (OKUMA.has(operation)) {
              a.where = firmaKosulu(kosul, tenantId);
              return query(a as typeof args);
            }
            if (operation === "update") {
              veriyiDenetle(model, a.data, "guncelleme");
              a.where = firmaKosulu(kosul, tenantId);
              return query(a as typeof args);
            }
            throw new Error(`Firma tablosunda "${operation}" işlemine izin verilmez.`);
          }

          // Silme koruması: listedeki tablolarda silme veritabanına hiç gitmez.
          const silmeNedeni = SILINEMEZ.get(model);
          if (silmeNedeni && SILME.has(operation)) {
            throw new Error(
              `"${model}" tablosunda "${operation}" işlemine izin verilmez: ${silmeNedeni}.`
            );
          }

          // Diğer bütün tablolar: tenantId filtresi zorunlu.
          if (OKUMA.has(operation)) {
            a.where = { ...kosul, tenantId };
            return query(a as typeof args);
          }

          if (GUNCELLEME_SILME.has(operation)) {
            // Silme işlemlerinde "data" yoktur; denetim yalnızca güncellemede çalışır.
            if (a.data !== undefined) veriyiDenetle(model, a.data, "guncelleme");
            a.where = { ...kosul, tenantId };
            return query(a as typeof args);
          }

          if (operation === "create") {
            veriyiDenetle(model, a.data, "ekleme");
            const veri = nesneMi(a.data) ? a.data : {};
            a.data = { ...veri, tenantId };
            return query(a as typeof args);
          }

          if (COKLU_EKLEME.has(operation)) {
            veriyiDenetle(model, a.data, "ekleme");
            const liste = Array.isArray(a.data) ? a.data : [a.data];
            a.data = liste.map((satir) => ({
              ...(nesneMi(satir) ? satir : {}),
              tenantId,
            }));
            return query(a as typeof args);
          }

          if (operation === "upsert") {
            veriyiDenetle(model, a.create, "ekleme");
            veriyiDenetle(model, a.update, "guncelleme");
            const olustur = nesneMi(a.create) ? a.create : {};
            a.where = { ...kosul, tenantId };
            a.create = { ...olustur, tenantId };
            return query(a as typeof args);
          }

          // Tanımadığımız işlem: güvenli tarafta kal ve durdur.
          throw new Error(`"${operation}" işlemi kiracı filtresi tarafından tanınmıyor.`);
        },
      },
    },
  });
}

// Aktif kullanıcının kiracısına bağlı veritabanı nesnesi.
// Giriş yapılmamışsa kullanıcı giriş sayfasına yönlendirilir.
export async function getTenantDb() {
  const kullanici = await requireUser();
  return tenantaBagliDb(kullanici.tenantId);
}

export type TenantDb = ReturnType<typeof tenantaBagliDb>;