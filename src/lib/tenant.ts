// MERKEZİ KİRACI (TENANT) FİLTRESİ
//
// Uygulamadaki bütün veri sorguları bu dosyadaki getTenantDb() üzerinden yapılır.
// Bu nesne, her sorguya aktif kullanıcının tenantId değerini OTOMATİK ekler:
//   - Okuma, sayma, güncelleme, silme: filtreye "tenantId = oturumdaki değer" eklenir.
//   - Kayıt ekleme: tenantId, oturumdaki değerle zorla üzerine yazılır.
//   - Tanımadığı bir işlemle karşılaşırsa hata verir ("izin ver" değil "durdur").
// tenantId hiçbir zaman istemciden (form, URL) alınmaz, yalnızca oturumdan gelir.
//
// YASAK: prisma.$queryRaw / $executeRaw. Ham SQL bu filtreden geçmez.

import { prisma } from "./db";
import { requireUser } from "./auth";

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

// Çoklu kayıt ekleme işlemleri.
const COKLU_EKLEME = new Set(["createMany", "createManyAndReturn"]);

// Değerin düz bir nesne olup olmadığını kontrol eder.
function nesneMi(deger: unknown): deger is Record<string, unknown> {
  return typeof deger === "object" && deger !== null && !Array.isArray(deger);
}

// Güncelleme verisi tenantId içeriyorsa durdurur: bir kayıt başka firmaya taşınamaz.
function tenantIdDegistirilmesinDiye(veri: unknown): void {
  if (nesneMi(veri) && "tenantId" in veri) {
    throw new Error("tenantId değiştirilemez.");
  }
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
          if (model === "Tenant") {
            if (OKUMA.has(operation)) {
              a.where = { ...kosul, id: tenantId };
              return query(a as typeof args);
            }
            if (operation === "update") {
              tenantIdDegistirilmesinDiye(a.data);
              a.where = { ...kosul, id: tenantId };
              return query(a as typeof args);
            }
            throw new Error(`Firma tablosunda "${operation}" işlemine izin verilmez.`);
          }

          // Diğer bütün tablolar: tenantId filtresi zorunlu.
          if (OKUMA.has(operation)) {
            a.where = { ...kosul, tenantId };
            return query(a as typeof args);
          }

          if (GUNCELLEME_SILME.has(operation)) {
            tenantIdDegistirilmesinDiye(a.data);
            a.where = { ...kosul, tenantId };
            return query(a as typeof args);
          }

          if (operation === "create") {
            const veri = nesneMi(a.data) ? a.data : {};
            a.data = { ...veri, tenantId };
            return query(a as typeof args);
          }

          if (COKLU_EKLEME.has(operation)) {
            const liste = Array.isArray(a.data) ? a.data : [a.data];
            a.data = liste.map((satir) => ({
              ...(nesneMi(satir) ? satir : {}),
              tenantId,
            }));
            return query(a as typeof args);
          }

          if (operation === "upsert") {
            tenantIdDegistirilmesinDiye(a.update);
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