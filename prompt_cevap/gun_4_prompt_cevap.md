# Gün 4: Müşteri ve plan yönetimi

> **Araç:** Claude (claude.ai), "SUNUCU TABANLI PROGRAMLAMA - SaaS PROJESİ" Project'i içindeki sohbetler.
> **Tarih:** 21 Eki 2026 (Türkiye saati). **Kapsam:** 64 prompt ve 64 cevap.
> Kutulardaki metin benim yazdığım prompttur (olduğu gibi). Girintili (`>` ile başlayan) alanlar Claude'un cevabıdır, başlık, tablo ve kod blokları orijinal Markdown'dır. Ekran görüntüleri metin olmadığı için `[ekran görüntüsü]` satırı olarak işaretlenmiştir. Yapay zekânın iç düşünme adımları ve araç çağrıları dahil değildir.
> Gizli bilgi taraması yapılmıştır. Mac kullanıcı adı, okul kısaltması, veritabanı sunucu adı ve parola benzeri değerler maskelenmiştir.
> Bu dosyada tamamen selamlaşma olan 1 mesaj çifti (teşekkür, iyi geceler, görüşürüz) çıkarılmış, yerinde not bırakılmıştır. İşle ilgili hiçbir mesaj çıkarılmamıştır.


## Bu günün özeti

_Bu bölümü ben yazdım, yapay zekâ cevabı değildir. Kaynağı Prompt Günlüğü'dür._

| | |
|---|---|
| **Ne istendi** | Müşteri ve plan yönetimi için plan ve kod |
| **Ne üretildi** | Müşteri/plan ekleme, düzenleme ve pasife alma, sunucu tarafı doğrulama, firma bazında benzersiz e-posta (`@@unique([tenantId, email])`), plan fiyatı kontrolleri ve "Kayıt bulunamadı" sayfası üretildi |
| **Düzeltme gerekti mi** | Evet: plandaki yinelenen doğrulama yerine mevcut `validation.ts` yeniden kullanıldı, `abonelik-kontrol.ts` ham `prisma` yerine `getTenantDb()` kullanacak şekilde düzeltildi. ESLint `react/no-unescaped-entities` hatası `&apos;` ile giderildi. Migration'daki `DROP INDEX` kontrolü yapıldı. Fiyat, e-posta tekrarı, pasife alma ve tenant izolasyonu (URL ve gizli alan oynama) testleri geçti, canlıda ekleme/listeleme çalıştı |

## Gün 4 plan sohbeti (Müşteri ve plan yönetimi)

_Plan ve kod ayrı bir sohbette üretildi._

### Prompt 1 · 21 Eki 2026 07:14

````text
Durum: Gün 1-3 ve arayüz katmanı tamamlandı, main'de ve canlıda (abonetakip.onrender.com).
Yığın: Next.js 16.4.2 (App Router), Prisma 7.10.1 (driver adapter), Neon, Tailwind 4.
Oturum: imzalı çerez. requireUser(), requireManager() (finance için null döner) ve getTenantDb() (src/lib/tenant.ts, tenantId'yi otomatik ekler; ham prisma yalnızca db.ts, auth.ts, tenant.ts içinde kullanılır) hazır.
Arayüz bileşenleri: src/components/ui altında Dugme, Kart, FormAlani, SayfaBasligi, BosDurum, Rozet. Kenar menülü panel, sayfalar (panel) klasöründe.
musteriler ve planlar sayfaları şu an yer tutucu.
Bugün Gün 4: müşteri ve plan yönetimi. Önce plan yaz, onayımı bekle. ## Gün 4 • Müşteri ve plan yönetimi
Amaç: Müşteri ve plan CRUD'u (silme yerine pasife alma), rol kontrolleriyle.

```
[Görev] Müşteri ve plan yönetimini yaz: listeleme, ekleme, düzenleme ve
pasife alma. Her ikisi için ayrı sayfa.

Kurallar:
- Müşteri alanları: ad, e-posta. Plan alanları: ad, fiyat (TL, tam sayı,
  0'dan büyük), aralık (aylık veya yıllık).
- Kayıtlar silinmez, isActive=false yapılır. Pasif kayıtlar varsayılan
  listede gizlenir, "pasifleri göster" seçeneği olur.
- Hem manager hem finance ekleyip düzenleyebilir. Pasife alma yalnızca
  manager yapabilir.
- Aktif aboneliği olan müşteri veya plan pasife alınamaz, anlaşılır bir
  mesaj gösterilir (abonelikler Gün 5'te yazılacak, şimdilik bu kontrolü
  eklemeye hazır bırak ve nerede yapılacağını yorumla belirt).

[Kısıtlar]
- Tüm sorgular merkezi tenant yardımcısından geçer. Yeni elle filtre yazma.
- Başka kiracının kaydının kimliğiyle (id) erişim denenirse "bulunamadı"
  dönülür.
- Girdiler sunucuda doğrulanır. Başarılı ve hatalı işlemlerde kullanıcıya
  Türkçe mesaj gösterilir.
- Sayfalama veya gelişmiş arama ekleme.
- Gereksiz paket ekleme.

[Format] 1) Plan (dosyalar, veri akışı, yetki tablosu), onay bekle.
2) Dosyalar tam yollarıyla. 3) Elle test senaryoları: finance pasife
almayı denerse ne olur, aynı e-posta iki müşteri, negatif fiyat.
4) Tenant izolasyonu için üç test senaryosu.

[Doğrulama] Etkilenen tablolar, yetki ve tenant kontrolleri, hata
durumlarını sırayla düşün. Varsayımlarını listele, emin olmadığın yeri
belirt.

```

Bitiş kontrolü

* [ ] Müşteri ve plan ekleniyor, düzenleniyor, pasife alınıyor
* [ ] Finance rolüyle pasife alma engelleniyor (ikinci kullanıcıyı Gün 6'da test edeceksin, şimdi kodda mantığı oku)
* [ ] Sunucu tarafı yetki kontrolü var (yalnızca düğmeyi gizlemek yetmez)
* Commit: `feat: müşteri ve plan yönetimi.  `kullanici@bilgisayar abonetakip %    cat prisma/schema.prisma
// AboneTakip veritabanı şeması (Prisma 7)
// Veritabanı adresi burada yazmaz, prisma.config.ts üzerinden .env'den okunur.

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// ---------- Sabit değer listeleri ----------

enum Role {
  manager
  finance
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
}

enum PlanInterval {
  MONTHLY
  YEARLY
}

enum EventType {
  STARTED
  RENEWED
  CANCELED
}

// ---------- Tablolar ----------

// Firma (kiracı). Bu tabloda tenantId yoktur, id'nin kendisi kiracıdır.
model Tenant {
  id        String   @id @default(cuid())
  name      String
  cac       Int      @default(0) // Müşteri edinme maliyeti (TL, tam sayı)
  createdAt DateTime @default(now())

  users         User[]
  customers     Customer[]
  plans         Plan[]
  subscriptions Subscription[]
  events        SubscriptionEvent[]

  @@map("tenants")
}

// Firma kullanıcısı (manager veya finance)
model User {
  id           String   @id @default(cuid())
  tenantId     String
  email        String   @unique
  passwordHash String // bcrypt ile özetlenmiş parola, düz metin saklanmaz
  name         String?
  role         Role
  createdAt    DateTime @default(now())

  tenant Tenant @relation(fields: [tenantId], references: [id])

  @@index([tenantId])
  @@map("users")
}

// Firmanın müşterisi. Silinmez, isActive=false ile pasife alınır.
model Customer {
  id        String   @id @default(cuid())
  tenantId  String
  name      String
  email     String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  tenant        Tenant         @relation(fields: [tenantId], references: [id])
  subscriptions Subscription[]

  // Aynı firmaya ait olduğunu veritabanında garanti etmek için (id + tenantId) birlikte benzersiz
  @@unique([id, tenantId])
  @@index([tenantId])
  @@map("customers")
}

// Abonelik planı. Fiyat TL cinsinden tam sayıdır. Silinmez, pasife alınır.
model Plan {
  id        String       @id @default(cuid())
  tenantId  String
  name      String
  price     Int // TL, kuruş yok
  interval  PlanInterval
  isActive  Boolean      @default(true)
  createdAt DateTime     @default(now())

  tenant        Tenant         @relation(fields: [tenantId], references: [id])
  subscriptions Subscription[]

  @@unique([id, tenantId])
  @@index([tenantId])
  @@map("plans")
}

// Müşterinin bir plana aboneliği
model Subscription {
  id         String             @id @default(cuid())
  tenantId   String
  customerId String
  planId     String
  status     SubscriptionStatus @default(ACTIVE)
  startedAt  DateTime           @default(now())
  canceledAt DateTime?
  createdAt  DateTime           @default(now())

  tenant   Tenant   @relation(fields: [tenantId], references: [id])
  // Müşteri ve plan, aboneliğin firmasıyla aynı firmaya ait olmak zorunda
  customer Customer @relation(fields: [customerId, tenantId], references: [id, tenantId])
  plan     Plan     @relation(fields: [planId, tenantId], references: [id, tenantId])

  events SubscriptionEvent[]

  @@unique([id, tenantId])
  @@index([tenantId, status])
  @@index([tenantId, customerId])
  @@index([tenantId, planId])
  @@map("subscriptions")
}

// Aboneliğin yaşam döngüsü olayları (başladı, yenilendi, iptal edildi)
model SubscriptionEvent {
  id             String    @id @default(cuid())
  tenantId       String
  subscriptionId String
  type           EventType
  createdAt      DateTime  @default(now())

  tenant       Tenant       @relation(fields: [tenantId], references: [id])
  subscription Subscription @relation(fields: [subscriptionId, tenantId], references: [id, tenantId])

  @@index([tenantId, type, createdAt])
  @@index([subscriptionId])
  @@map("subscription_events")
}
````

_[yapıştırılan metin]_

````text
kullanici@bilgisayar abonetakip %    cat src/lib/tenant.ts
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

export type TenantDb = ReturnType<typeof tenantaBagliDb>;%
````

_[yapıştırılan metin]_

````text
kullanici@bilgisayar abonetakip %    cat src/lib/tenant.ts
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

export type TenantDb = ReturnType<typeof tenantaBagliDb>;%
````

### Claude cevabı 1 · 21 Eki 2026 07:16

> # Gün 4 Planı: Müşteri ve plan yönetimi
>
> Kod yazmadan önce planı ve senin karar vermen gereken birkaç noktayı aşağıya yazdım. Onay verdiğinde dosyaları tam yollarıyla yazacağım.
>
> ## 1. Etkilenen tablolar
>
> | Tablo | İşlem |
> |---|---|
> | `customers` | okuma, ekleme, güncelleme, pasife alma (`isActive=false`) |
> | `plans` | okuma, ekleme, güncelleme, pasife alma |
> | `subscriptions` | yalnızca **sayma**: pasife almadan önce aktif abonelik var mı diye bakılır |
>
> `tenants`, `users` ve `subscription_events` tablolarına dokunulmaz. Şema değişikliği olup olmayacağı aşağıdaki 1. karara bağlı.
>
> ## 2. Dosyalar
>
> Müşteriler ve planlar aynı yapıyı kullanır. Aşağıdaki yollar müşteriler içindir, planlar için aynı dosyalar `planlar` klasöründe olur.
>
> | Dosya | Durum | Görevi |
> |---|---|---|
> | `src/lib/dogrulama.ts` | yeni | Saf doğrulama fonksiyonları: ad, e-posta, fiyat, aralık. Paket kullanılmaz, Türkçe hata mesajı döner. |
> | `src/lib/abonelik-kontrol.ts` | yeni | `aktifAbonelikVarMi()`: pasife alma kontrolünün yapıldığı tek yer (aşağıdaki 3. karara bak). |
> | `src/app/(panel)/musteriler/actions.ts` | yeni | Sunucu işlemleri (`"use server"`): `musteriEkle`, `musteriGuncelle`, `musteriPasifeAl` |
> | `src/app/(panel)/musteriler/page.tsx` | değişir | Liste ve ekleme formu, "pasifleri göster" seçeneği (`?pasif=1`). Sunucu bileşenidir. |
> | `src/app/(panel)/musteriler/MusteriFormu.tsx` | yeni | İstemci bileşeni. Ekleme ve düzenleme için ortak form, başarı ve hata mesajlarını gösterir. |
> | `src/app/(panel)/musteriler/PasifeAlDugmesi.tsx` | yeni | Onay sorar, sonucu mesaj olarak gösterir. Yalnızca manager'a görünür. |
> | `src/app/(panel)/musteriler/[id]/page.tsx` | yeni | Düzenleme sayfası. Kayıt bulunamazsa `notFound()` çağrılır. |
> | `src/app/(panel)/not-found.tsx` | yeni | Türkçe "Kayıt bulunamadı" sayfası. |
>
> Toplam 13 dosya: 2 ortak dosya, her iki modül için 5'er dosya ve 1 bulunamadı sayfası.
>
> ## 3. Veri akışı
>
> **Listeleme**
> 1. `page.tsx` önce `getTenantDb()` çağırır.
> 2. Ardından `customer.findMany` çalışır. `?pasif=1` yoksa sorguya `isActive: true` eklenir.
> 3. Kiracı filtresi otomatik eklenir. `?pasif` yalnızca görünüm filtresidir, kiracıyla ilgisi yoktur.
>
> **Ekleme ve düzenleme**
> 1. Form sunucu işlemine gönderilir.
> 2. `requireUser()` çağrılır.
> 3. Sunucuda doğrulama yapılır. Hata varsa alan bazında Türkçe mesaj döner.
> 4. `getTenantDb()` alınır.
> 5. Ekleme için `create` çalışır, `tenantId` uzantı tarafından zorla yazılır.
> 6. Düzenleme için `updateMany({ where: { id } })` çalışır. Sonuç 0 satırsa "Kayıt bulunamadı." döner.
> 7. `revalidatePath()` çağrılır ve başarı mesajı gösterilir.
>
> **Pasife alma**
> 1. `requireManager()` çağrılır. Sonuç `null` ise "Bu işlemi yalnızca firma yöneticisi yapabilir." döner.
> 2. Kayıt `findFirst({ where: { id } })` ile aranır. Yoksa "bulunamadı" döner.
> 3. `aktifAbonelikVarMi()` kontrol edilir. Aktif abonelik varsa "Bu müşterinin aktif aboneliği var, önce aboneliği iptal edin." mesajı döner.
> 4. `updateMany({ isActive: false })` çalışır ve başarı mesajı gösterilir.
>
> **Önemli:** Sunucu işlemleri dışarıdan doğrudan çağrılabilen uç noktalardır. Bu yüzden yetki kontrolü sayfada değil, her işlemin **kendi içinde** yapılır. Düğmeyi gizlemek yalnızca arayüz kolaylığıdır.
>
> **Neden `updateMany`?** Başka firmanın id'si gönderilirse kiracı filtresi yüzünden 0 satır eşleşir. Bunu hata fırlatmadan "bulunamadı" olarak yakalarız. Düz `update` ise bu durumda P2025 hatası fırlatır.
>
> ## 4. Yetki tablosu
>
> | İşlem | manager | finance | Kontrol yeri |
> |---|---|---|---|
> | Listeleme ve pasifleri gösterme | ✅ | ✅ | `getTenantDb()` |
> | Ekleme | ✅ | ✅ | `requireUser()` (işlem içinde) |
> | Düzenleme | ✅ | ✅ | `requireUser()` (işlem içinde) |
> | Pasife alma | ✅ | ❌ | `requireManager()` (işlem içinde) ve düğme gizlenir |
> | Başka firmanın kaydı | ❌ | ❌ | Kiracı uzantısı, "bulunamadı" döner |
>
> ## 5. Doğrulama kuralları
>
> - **Ad:** baştaki ve sondaki boşluklar kırpılır, 1 ile 100 karakter arası olmalı.
> - **E-posta:** kırpılır ve küçük harfe çevrilir, basit biçim kontrolünden geçer.
> - **Fiyat:** sayı olmalı, tam sayı olmalı (`12.5` reddedilir), 0'dan büyük olmalı ve en fazla 10.000.000 TL olabilir. Üst sınır, veritabanındaki `Int` sütununun taşmasını önlemek içindir.
> - **Aralık:** yalnızca `MONTHLY` veya `YEARLY` kabul edilir. Formdan gelen başka bir değer reddedilir.
>
> ## 6. Senin karar vermen gerekenler
>
> 1. **Aynı e-posta ile iki müşteri.** Önerim: aynı firmada aynı e-posta yasak olsun, büyük ve küçük harf fark etmesin. Farklı firmalarda aynı e-posta serbest kalsın. Bunu sağlamanın en sağlam yolu veritabanına `@@unique([tenantId, email])` eklemektir. Bu bir migration gerektirir; `--create-only` ile çalıştırıp `DROP INDEX` satırını kontrol ederiz. Uygulama içinde ayrıca kontrol ederek anlaşılır bir mesaj veririz. Alternatif olarak yalnızca uygulama içinde kontrol edebiliriz. Bu migration gerektirmez ama iki eşzamanlı istekte nadiren çift kayıt oluşabilir. Hangisini seçiyorsun?
> 2. **E-posta zorunlu mu?** Şemada isteğe bağlı (`String?`). Görevde "ad, e-posta" yazıyor. Önerim: isteğe bağlı kalsın, girilirse doğrulansın.
> 3. **Aktif abonelik kontrolü.** `subscriptions` tablosu şemada zaten var. Bu yüzden `aktifAbonelikVarMi()` fonksiyonunu şimdiden gerçek bir `count` sorgusuyla yazmayı öneriyorum; şu an her zaman 0 döner. Gün 5'te dokunmaya gerek kalmaz. Ayrıca Gün 5'e not düşeceğim: abonelik başlatırken müşterinin ve planın aktif olup olmadığı da kontrol edilmeli. Aksi halde pasife alma ile abonelik başlatma aynı anda olursa kural delinebilir. Onaylıyor musun, yoksa yalnızca yorum mu bırakayım?
> 4. **Plan fiyatı değişince MRR değişir.** MRR, planın *şu anki* fiyatından hesaplanıyor. Aktif abonelikleri olan bir planın fiyatı düzenlenirse geçmiş ve şimdiki MRR birden değişir. Seçenekler:
>    - (a) Aktif aboneliği olan planda fiyat ve aralık değişikliği engellensin, ad değişikliği serbest kalsın. Bu benim önerim.
>    - (b) Serbest bırakılsın.
>    - (c) Abonelik kaydına fiyat kopyası eklensin. Bu bir şema değişikliğidir ve kapsamı büyütür.
> 5. **Pasif kaydı geri aktifleştirme** olsun mu? Görevde yok. Önerim: yok. Gerekirse ileride manager'a özel olarak eklenir.
>
> ## 7. Senden görmem gerekenler
>
> Mevcut yapıya uymak için şu dosyaların içeriğini görmem gerekiyor. Komutları Terminal'de tek tek çalıştır.
>
> Oturum fonksiyonlarının imzalarını görmek için:
> ```
> cat src/lib/auth.ts
> ```
> Form alanı bileşeninin özelliklerini görmek için:
> ```
> cat src/components/ui/FormAlani.tsx
> ```
> Düğme bileşeninin özelliklerini görmek için:
> ```
> cat src/components/ui/Dugme.tsx
> ```
> Mevcut yer tutucu sayfanın yapısını görmek için:
> ```
> cat "src/app/(panel)/musteriler/page.tsx"
> ```
> Panel düzenini görmek için. Dosya bu yolda değilse hata verir, sorun değil:
> ```
> cat "src/app/(panel)/layout.tsx"
> ```
> Kurulu paketleri görmek için. Doğrulama kütüphanesi olarak zod var mı, test aracı var mı, ona bakacağım:
> ```
> cat package.json
> ```
>
> Bu komutların hiçbiri `.env` içeriğini göstermez.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - `requireManager()` fonksiyonunun giriş yapılmamışsa yönlendirdiğini, finance kullanıcısı için `null` döndüğünü varsayıyorum. `auth.ts` dosyasında doğrulayacağım.
> - Next.js 16'da sayfa bileşenlerinin `params` ve `searchParams` değerlerinin Promise olarak geldiğini ve formlar için React 19'un `useActionState` kancasını kullanacağımı varsayıyorum. 16.4.2 sürümünün ayrıntılarından tam emin değilim, `package.json` dosyasına bakınca netleştireceğim.
> - Prisma 7'de `findUnique` sorgusuna benzersiz olmayan bir alan eklenebildiği için kiracı uzantısı sorunsuz çalışır. Yine de düzenleme sayfasında güvenli tarafta kalmak için `findFirst` kullanacağım.
> - Pasif kayıtların düzenlenmesi serbest kalacak. Sayfalama ve arama eklenmeyecek, yeni paket eklenmeyecek.
>
> Kararlarını (1 ile 5 arası) ve komut çıktılarını gönderdiğinde dosyaları yazmaya başlarım.

### Prompt 2 · 21 Eki 2026 07:21

````text
Kararlarım:
1. Aynı firmada aynı e-posta yasak olsun, veritabanında @@unique([tenantId, email]) ekle. Uygulama içinde de önceden kontrol et. Migration'ı --create-only ile çalıştıracağız ve subscriptions_one_active_per_customer dizinini silen DROP INDEX satırı çıkarsa o satırı sileceğiz.
2. E-posta isteğe bağlı kalsın, girilirse doğrulansın.
3. aktifAbonelikVarMi() şimdiden gerçek count sorgusuyla yazılsın, ACTIVE durumunu saysın. Gün 5'e not düş.
4. (a): aktif aboneliği olan planda fiyat ve aralık değişikliği engellensin, ad serbest olsun.
5. Geri aktifleştirme olmasın.

İki düzeltme:
- src/lib/dogrulama.ts yeni dosya açma. Projede zaten src/lib/validation.ts var, doğrulamaları oraya ekle (mevcut kod yapısına uy).
- aktifAbonelikVarMi() ham prisma yerine getTenantDb() kullansın. Ham prisma yalnızca db.ts, auth.ts ve tenant.ts içinde kullanılabilir. src/lib/tenant.ts içindeki uzantının count işlemini desteklediğini kontrol et.

İstediğin dosyaların çıktıları aşağıda. Ek olarak validation.ts, tenant.ts ve prisma/schema.prisma içeriklerini de ekledim.
````

_[yapıştırılan metin]_

````text
${operation}" işlemi kiracı filtresi tarafından tanınmıyor.`);
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

export type TenantDb = ReturnType<typeof tenantaBagliDb>;%                                                              kullanici@bilgisayar abonetakip % cat src/lib/auth.ts
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
}%                                                                                                                      kullanici@bilgisayar abonetakip % cat src/components/ui/FormAlani.tsx
import type { InputHTMLAttributes } from "react";

// Etiketli giriş kutusu. Hata varsa kırmızı çerçeve ve hata mesajı gösterir.
type FormAlaniProps = InputHTMLAttributes<HTMLInputElement> & {
  etiket: string;
  name: string;
  hata?: string | null;
  yardim?: string;
};

export default function FormAlani({
  etiket,
  name,
  hata,
  yardim,
  className = "",
  ...diger
}: FormAlaniProps) {
  const hataId = `${name}-hata`;
  const yardimId = `${name}-yardim`;
  const aciklamaId = hata ? hataId : yardim ? yardimId : undefined;

  const cerceve = hata
    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
    : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200";

  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {etiket}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={hata ? true : undefined}
        aria-describedby={aciklamaId}
        className={`block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 ${cerceve} ${className}`}
        {...diger}
      />
      {yardim && !hata && (
        <p id={yardimId} className="text-xs text-slate-500">
          {yardim}
        </p>
      )}
      {hata && (
        <p id={hataId} role="alert" className="text-sm text-red-600">
          {hata}
        </p>
      )}
    </div>
  );
}%                                                                                                                      kullanici@bilgisayar abonetakip % cat src/components/ui/Dugme.tsx
import type { ButtonHTMLAttributes } from "react";

// Düğme görünümleri: birincil (ana işlem), ikincil (vazgeç/geri), tehlike (silme/iptal)
type Gorunum = "birincil" | "ikincil" | "tehlike";

type DugmeProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  gorunum?: Gorunum;
  tamGenislik?: boolean;
};

const temel =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const gorunumler: Record<Gorunum, string> = {
  birincil: "bg-indigo-600 text-white hover:bg-indigo-700",
  ikincil: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
  tehlike: "bg-red-600 text-white hover:bg-red-700",
};

export default function Dugme({
  gorunum = "birincil",
  tamGenislik = false,
  className = "",
  type = "button", // Form gönderen düğmelerde type="submit" açıkça yazılmalı
  ...diger
}: DugmeProps) {
  const sinif = [temel, gorunumler[gorunum], tamGenislik ? "w-full" : "", className]
    .filter(Boolean)
    .join(" ");

  return <button type={type} className={sinif} {...diger} />;
}%                                                                                                                      kullanici@bilgisayar abonetakip % cat "src/app/(panel)/musteriler/page.tsx"
import { requireUser } from "@/lib/auth";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import BosDurum from "@/components/ui/BosDurum";

// Yer tutucu sayfa. Müşteri yönetimi 4. günde yapılacak.
export default async function MusterilerSayfasi() {
  await requireUser();

  return (
    <div>
      <SayfaBasligi
        baslik="Müşteriler"
        aciklama="Firmanızın müşteri kayıtları."
      />
      <BosDurum
        baslik="Henüz müşteri yok"
        aciklama="Müşteri yönetimi ilerleyen günlerde eklenecek."
      />
    </div>
  );
}%                                                                                                                      kullanici@bilgisayar abonetakip % cat "src/app/(panel)/layout.tsx"
import { requireUser } from "@/lib/auth";
import { cikisAction } from "@/app/(auth)/actions";
import Dugme from "@/components/ui/Dugme";
import Rozet from "@/components/ui/Rozet";
import MenuBaglantisi from "./MenuBaglantisi";

// Menü bağlantıları. "sadeceManager" olanlar finance kullanıcısına gösterilmez.
// DİKKAT: Menüde bir bağlantıyı gizlemek yetki kontrolü DEĞİLDİR.
// Asıl kontrol, ilgili sayfanın kendi içinde sunucuda yapılır.
const MENU = [
  { href: "/dashboard", etiket: "Dashboard", sadeceManager: false },
  { href: "/musteriler", etiket: "Müşteriler", sadeceManager: false },
  { href: "/planlar", etiket: "Planlar", sadeceManager: false },
  { href: "/abonelikler", etiket: "Abonelikler", sadeceManager: false },
  { href: "/ayarlar", etiket: "Ayarlar", sadeceManager: true },
  { href: "/kullanicilar", etiket: "Kullanıcılar", sadeceManager: true },
];

// Panel çerçevesi. Giriş yapmamış kullanıcı giriş sayfasına yönlendirilir.
// Masaüstünde sol kenar menü, küçük ekranda üstte yatay menü gösterilir.
export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const kullanici = await requireUser();
  const menu = MENU.filter(
    (oge) => !oge.sadeceManager || kullanici.role === "manager"
  );
  const yonetici = kullanici.role === "manager";
  const gorunenAd = kullanici.adSoyad ?? kullanici.eposta;

  return (
    <div className="min-h-screen md:flex">
      {/* Masaüstü: sol kenar menü */}
      <aside className="hidden border-r border-slate-200 bg-white md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="border-b border-slate-100 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            AboneTakip
          </p>
          <p className="mt-1 truncate text-base font-semibold text-slate-900">
            {kullanici.firmaAdi}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <MenuBaglantisi menu={menu} yon="dikey" />
        </nav>

        <div className="border-t border-slate-100 p-4">
          <p className="truncate text-sm font-medium text-slate-900">
            {gorunenAd}
          </p>
          <div className="mt-1">
            <Rozet ton={yonetici ? "indigo" : "gri"}>
              {yonetici ? "Yönetici" : "Finans"}
            </Rozet>
          </div>
          <form action={cikisAction} className="mt-3">
            <Dugme type="submit" gorunum="ikincil" tamGenislik>
              Çıkış yap
            </Dugme>
          </form>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:pl-64">
        {/* Küçük ekran: üst çubuk ve yatay menü */}
        <header className="border-b border-slate-200 bg-white md:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                AboneTakip
              </p>
              <p className="truncate text-sm font-semibold text-slate-900">
                {kullanici.firmaAdi}
              </p>
            </div>
            <form action={cikisAction}>
              <Dugme type="submit" gorunum="ikincil">
                Çıkış yap
              </Dugme>
            </form>
          </div>
          <nav className="overflow-x-auto px-3 pb-3">
            <MenuBaglantisi menu={menu} yon="yatay" />
          </nav>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}%                                                                                                                      kullanici@bilgisayar abonetakip % cat package.json
{
  "name": "abonetakip",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@prisma/adapter-pg": "^7.10.1",
    "@prisma/client": "^7.10.1",
    "bcryptjs": "^3.0.3",
    "next": "16.4.2",
    "react": "19.3.0",
    "react-dom": "19.3.0"
  },
  "devDependencies": {
    "@tailwindcss/turbopack": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "dotenv": "^18.0.8",
    "eslint": "^9",
    "eslint-config-next": "16.4.2",
    "prisma": "^7.10.1",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
kullanici@bilgisayar abonetakip % cat src/lib/validation.ts
// Kayıt ve giriş formlarının sunucu tarafı doğrulaması.
// Bu dosyadaki fonksiyonlar "saf"tır: veritabanına veya çereze dokunmazlar,
// aynı girdiye her zaman aynı sonucu verirler. Bu yüzden kolay test edilirler.

// Doğrulama sonucu: ya temiz değer döner, ya da kullanıcıya gösterilecek hata.
export type Sonuc<T> = { ok: true; deger: T } | { ok: false; hata: string };

// Basit e-posta biçimi: boşluk içermez, "@" ve noktalı bir alan adı vardır.
const EPOSTA_DESENI = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Parola sınırları. bcrypt en fazla 72 baytı dikkate alır, bu yüzden üst sınır var.
const PAROLA_EN_AZ = 8;
const PAROLA_EN_COK_BAYT = 72;

// Başındaki ve sonundaki boşlukları siler. Metin değilse boş metin döner.
function temizle(girdi: unknown): string {
  return typeof girdi === "string" ? girdi.trim() : "";
}

// Genel metin alanı kontrolü (firma adı, ad soyad).
export function metinDogrula(
  girdi: unknown,
  alanAdi: string,
  enAz: number,
  enCok: number
): Sonuc<string> {
  const metin = temizle(girdi);
  if (metin.length === 0) {
    return { ok: false, hata: `${alanAdi} boş bırakılamaz.` };
  }
  if (metin.length < enAz) {
    return { ok: false, hata: `${alanAdi} en az ${enAz} karakter olmalıdır.` };
  }
  if (metin.length > enCok) {
    return { ok: false, hata: `${alanAdi} en fazla ${enCok} karakter olabilir.` };
  }
  return { ok: true, deger: metin };
}

// E-posta kontrolü. Başarılıysa küçük harfe çevrilmiş hâli döner.
// Neden küçük harf? PostgreSQL'de "Ali@x.com" ile "ali@x.com" farklı sayılır,
// bu yüzden aynı kişi iki kez kayıt olabilirdi.
export function epostaDogrula(girdi: unknown): Sonuc<string> {
  const eposta = temizle(girdi).toLowerCase();
  if (eposta.length === 0) {
    return { ok: false, hata: "E-posta adresi boş bırakılamaz." };
  }
  if (eposta.length > 254 || !EPOSTA_DESENI.test(eposta)) {
    return { ok: false, hata: "Lütfen geçerli bir e-posta adresi girin." };
  }
  return { ok: true, deger: eposta };
}

// Parola kontrolü. Parolanın başı ve sonu ASLA kırpılmaz (kullanıcı ne yazdıysa o).
export function parolaDogrula(girdi: unknown): Sonuc<string> {
  if (typeof girdi !== "string" || girdi.length === 0) {
    return { ok: false, hata: "Parola boş bırakılamaz." };
  }
  if (girdi.length < PAROLA_EN_AZ) {
    return {
      ok: false,
      hata: `Parola en az ${PAROLA_EN_AZ} karakter olmalıdır.`,
    };
  }
  // Türkçe karakterler (ğ, ş, ı gibi) 2 bayt sayılır, bu yüzden bayt olarak ölçülür.
  if (new TextEncoder().encode(girdi).length > PAROLA_EN_COK_BAYT) {
    return { ok: false, hata: "Parola çok uzun. Daha kısa bir parola seçin." };
  }
  return { ok: true, deger: girdi };
}

// Kayıt formundan gelen temizlenmiş ve doğrulanmış değerler.
export type KayitGirdisi = {
  firmaAdi: string;
  adSoyad: string;
  eposta: string;
  parola: string;
};

// Kayıt formunun tamamını kontrol eder. İlk bulduğu hatayı döner.
export function kayitGirdisiniDogrula(girdi: {
  firmaAdi: unknown;
  adSoyad: unknown;
  eposta: unknown;
  parola: unknown;
}): Sonuc<KayitGirdisi> {
  const firma = metinDogrula(girdi.firmaAdi, "Firma adı", 2, 100);
  if (!firma.ok) return firma;

  const ad = metinDogrula(girdi.adSoyad, "Ad soyad", 2, 100);
  if (!ad.ok) return ad;

  const eposta = epostaDogrula(girdi.eposta);
  if (!eposta.ok) return eposta;

  const parola = parolaDogrula(girdi.parola);
  if (!parola.ok) return parola;

  return {
    ok: true,
    deger: {
      firmaAdi: firma.deger,
      adSoyad: ad.deger,
      eposta: eposta.deger,
      parola: parola.deger,
    },
  };
}%                                                                                                                      kullanici@bilgisayar abonetakip % cat src/lib/tenant.ts
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

export type TenantDb = ReturnType<typeof tenantaBagliDb>;%                                                              kullanici@bilgisayar abonetakip % cat prisma/schema.prisma
// AboneTakip veritabanı şeması (Prisma 7)
// Veritabanı adresi burada yazmaz, prisma.config.ts üzerinden .env'den okunur.

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// ---------- Sabit değer listeleri ----------

enum Role {
  manager
  finance
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
}

enum PlanInterval {
  MONTHLY
  YEARLY
}

enum EventType {
  STARTED
  RENEWED
  CANCELED
}

// ---------- Tablolar ----------

// Firma (kiracı). Bu tabloda tenantId yoktur, id'nin kendisi kiracıdır.
model Tenant {
  id        String   @id @default(cuid())
  name      String
  cac       Int      @default(0) // Müşteri edinme maliyeti (TL, tam sayı)
  createdAt DateTime @default(now())

  users         User[]
  customers     Customer[]
  plans         Plan[]
  subscriptions Subscription[]
  events        SubscriptionEvent[]

  @@map("tenants")
}

// Firma kullanıcısı (manager veya finance)
model User {
  id           String   @id @default(cuid())
  tenantId     String
  email        String   @unique
  passwordHash String // bcrypt ile özetlenmiş parola, düz metin saklanmaz
  name         String?
  role         Role
  createdAt    DateTime @default(now())

  tenant Tenant @relation(fields: [tenantId], references: [id])

  @@index([tenantId])
  @@map("users")
}

// Firmanın müşterisi. Silinmez, isActive=false ile pasife alınır.
model Customer {
  id        String   @id @default(cuid())
  tenantId  String
  name      String
  email     String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  tenant        Tenant         @relation(fields: [tenantId], references: [id])
  subscriptions Subscription[]

  // Aynı firmaya ait olduğunu veritabanında garanti etmek için (id + tenantId) birlikte benzersiz
  @@unique([id, tenantId])
  @@index([tenantId])
  @@map("customers")
}

// Abonelik planı. Fiyat TL cinsinden tam sayıdır. Silinmez, pasife alınır.
model Plan {
  id        String       @id @default(cuid())
  tenantId  String
  name      String
  price     Int // TL, kuruş yok
  interval  PlanInterval
  isActive  Boolean      @default(true)
  createdAt DateTime     @default(now())

  tenant        Tenant         @relation(fields: [tenantId], references: [id])
  subscriptions Subscription[]

  @@unique([id, tenantId])
  @@index([tenantId])
  @@map("plans")
}

// Müşterinin bir plana aboneliği
model Subscription {
  id         String             @id @default(cuid())
  tenantId   String
  customerId String
  planId     String
  status     SubscriptionStatus @default(ACTIVE)
  startedAt  DateTime           @default(now())
  canceledAt DateTime?
  createdAt  DateTime           @default(now())

  tenant   Tenant   @relation(fields: [tenantId], references: [id])
  // Müşteri ve plan, aboneliğin firmasıyla aynı firmaya ait olmak zorunda
  customer Customer @relation(fields: [customerId, tenantId], references: [id, tenantId])
  plan     Plan     @relation(fields: [planId, tenantId], references: [id, tenantId])

  events SubscriptionEvent[]

  @@unique([id, tenantId])
  @@index([tenantId, status])
  @@index([tenantId, customerId])
  @@index([tenantId, planId])
  @@map("subscriptions")
}

// Aboneliğin yaşam döngüsü olayları (başladı, yenilendi, iptal edildi)
model SubscriptionEvent {
  id             String    @id @default(cuid())
  tenantId       String
  subscriptionId String
  type           EventType
  createdAt      DateTime  @default(now())

  tenant       Tenant       @relation(fields: [tenantId], references: [id])
  subscription Subscription @relation(fields: [subscriptionId, tenantId], references: [id, tenantId])

  @@index([tenantId, type, createdAt])
  @@index([subscriptionId])
  @@map("subscription_events")
}
````

### Claude cevabı 2 · 21 Eki 2026 07:29

> Kararlarına göre dosyaları yazdım.
>
> **`tenant.ts` kontrolü:** `count` işlemi dosyadaki `OKUMA` kümesinde var. Bu yüzden `db.subscription.count(...)` çağrısına `tenantId` filtresi otomatik eklenir. `findFirst` ve `updateMany` de aynı şekilde korunuyor, uzantıda değişiklik gerekmiyor.
>
> **Plandan üç küçük sapma (nedenleriyle):**
> 1. **`src/lib/islem.ts` (yeni):** `"use server"` dosyaları yalnızca async fonksiyon dışa açabilir, sabit değer açamaz. Formların başlangıç durumu ve ortak mesajlar bu yüzden ayrı bir dosyada. `auth.ts` içindeki `tekrarEdenKayitMi` dışa açık olmadığı için benzerini de buraya koydum, `auth.ts` dosyasına dokunmadım.
> 2. **`src/components/ui/IslemMesaji.tsx` (yeni):** Başarı ve hata mesajı kutusu dört yerde kullanılıyor, tek bileşen yaptım.
> 3. **"Pasife al" düğmesi listede değil, düzenleme sayfasında.** Listede olsaydı pasife alınan satır listeden kaybolur, başarı mesajı da onunla birlikte giderdi. Düzenleme sayfasında kayıt yerinde kalır, mesaj görünür.
>
> ---
>
> ## Adım 1 • Şema ve migration
>
> ### `prisma/schema.prisma`: dosyanın içeriğini tamamen şununla değiştir
>
> Yalnızca `Customer` modeline `@@unique([tenantId, email])` ve açıklaması eklendi.
>
> ```prisma
> // AboneTakip veritabanı şeması (Prisma 7)
> // Veritabanı adresi burada yazmaz, prisma.config.ts üzerinden .env'den okunur.
>
> generator client {
>   provider = "prisma-client"
>   output   = "../generated/prisma"
> }
>
> datasource db {
>   provider = "postgresql"
> }
>
> // ---------- Sabit değer listeleri ----------
>
> enum Role {
>   manager
>   finance
> }
>
> enum SubscriptionStatus {
>   ACTIVE
>   CANCELED
> }
>
> enum PlanInterval {
>   MONTHLY
>   YEARLY
> }
>
> enum EventType {
>   STARTED
>   RENEWED
>   CANCELED
> }
>
> // ---------- Tablolar ----------
>
> // Firma (kiracı). Bu tabloda tenantId yoktur, id'nin kendisi kiracıdır.
> model Tenant {
>   id        String   @id @default(cuid())
>   name      String
>   cac       Int      @default(0) // Müşteri edinme maliyeti (TL, tam sayı)
>   createdAt DateTime @default(now())
>
>   users         User[]
>   customers     Customer[]
>   plans         Plan[]
>   subscriptions Subscription[]
>   events        SubscriptionEvent[]
>
>   @@map("tenants")
> }
>
> // Firma kullanıcısı (manager veya finance)
> model User {
>   id           String   @id @default(cuid())
>   tenantId     String
>   email        String   @unique
>   passwordHash String // bcrypt ile özetlenmiş parola, düz metin saklanmaz
>   name         String?
>   role         Role
>   createdAt    DateTime @default(now())
>
>   tenant Tenant @relation(fields: [tenantId], references: [id])
>
>   @@index([tenantId])
>   @@map("users")
> }
>
> // Firmanın müşterisi. Silinmez, isActive=false ile pasife alınır.
> model Customer {
>   id        String   @id @default(cuid())
>   tenantId  String
>   name      String
>   email     String?
>   isActive  Boolean  @default(true)
>   createdAt DateTime @default(now())
>
>   tenant        Tenant         @relation(fields: [tenantId], references: [id])
>   subscriptions Subscription[]
>
>   // Aynı firmaya ait olduğunu veritabanında garanti etmek için (id + tenantId) birlikte benzersiz
>   @@unique([id, tenantId])
>   // Aynı firmada aynı e-posta iki müşteride kullanılamaz. Büyük/küçük harf farkı,
>   // uygulamada e-posta küçük harfe çevrilerek giderilir. E-postası boş (NULL) olan
>   // müşteriler bu kurala takılmaz: PostgreSQL birden fazla NULL değere izin verir.
>   // Farklı firmalar aynı e-postayı kullanabilir.
>   @@unique([tenantId, email])
>   @@index([tenantId])
>   @@map("customers")
> }
>
> // Abonelik planı. Fiyat TL cinsinden tam sayıdır. Silinmez, pasife alınır.
> model Plan {
>   id        String       @id @default(cuid())
>   tenantId  String
>   name      String
>   price     Int // TL, kuruş yok
>   interval  PlanInterval
>   isActive  Boolean      @default(true)
>   createdAt DateTime     @default(now())
>
>   tenant        Tenant         @relation(fields: [tenantId], references: [id])
>   subscriptions Subscription[]
>
>   @@unique([id, tenantId])
>   @@index([tenantId])
>   @@map("plans")
> }
>
> // Müşterinin bir plana aboneliği
> model Subscription {
>   id         String             @id @default(cuid())
>   tenantId   String
>   customerId String
>   planId     String
>   status     SubscriptionStatus @default(ACTIVE)
>   startedAt  DateTime           @default(now())
>   canceledAt DateTime?
>   createdAt  DateTime           @default(now())
>
>   tenant   Tenant   @relation(fields: [tenantId], references: [id])
>   // Müşteri ve plan, aboneliğin firmasıyla aynı firmaya ait olmak zorunda
>   customer Customer @relation(fields: [customerId, tenantId], references: [id, tenantId])
>   plan     Plan     @relation(fields: [planId, tenantId], references: [id, tenantId])
>
>   events SubscriptionEvent[]
>
>   @@unique([id, tenantId])
>   @@index([tenantId, status])
>   @@index([tenantId, customerId])
>   @@index([tenantId, planId])
>   @@map("subscriptions")
> }
>
> // Aboneliğin yaşam döngüsü olayları (başladı, yenilendi, iptal edildi)
> model SubscriptionEvent {
>   id             String    @id @default(cuid())
>   tenantId       String
>   subscriptionId String
>   type           EventType
>   createdAt      DateTime  @default(now())
>
>   tenant       Tenant       @relation(fields: [tenantId], references: [id])
>   subscription Subscription @relation(fields: [subscriptionId, tenantId], references: [id, tenantId])
>
>   @@index([tenantId, type, createdAt])
>   @@index([subscriptionId])
>   @@map("subscription_events")
> }
> ```
>
> ### Migration komutları
>
> Migration dosyasını uygulamadan yalnızca oluşturur:
> ```
> npx prisma migrate dev --create-only --name musteri_eposta_benzersiz
> ```
>
> Yeni dosyada silinmesi gereken `DROP INDEX` satırı var mı, onu gösterir. Çıktı boşsa sorun yok.
> ```
> grep -n "DROP INDEX" prisma/migrations/*_musteri_eposta_benzersiz/migration.sql
> ```
>
> Satır çıkarsa dosyayı editörde aç (`prisma/migrations/<tarih>_musteri_eposta_benzersiz/migration.sql`). `subscriptions_one_active_per_customer` geçen `DROP INDEX` satırını sil ve kaydet (Cmd+S). Dosyada kalması gereken tek satır aşağı yukarı şöyle:
> ```sql
> CREATE UNIQUE INDEX "customers_tenantId_email_key" ON "customers"("tenantId", "email");
> ```
>
> Bekleyen migration'ı fark hesaplamadan olduğu gibi uygular. Kuralımız gereği burada `migrate dev` kullanmıyoruz, çünkü o komut elle eklenen dizini tekrar silmeye çalışır.
> ```
> npx prisma migrate deploy
> ```
>
> Prisma istemci kodunu yeni şemaya göre yeniden üretir. Prisma 7'de `migrate` komutları bunu kendiliğinden yapmayabilir, bu yüzden elle çalıştırıyoruz.
> ```
> npx prisma generate
> ```
>
> ---
>
> ## Adım 2 • Ortak dosyalar
>
> ### `src/lib/validation.ts`: dosyanın içeriğini tamamen şununla değiştir
>
> Eski içerik aynen duruyor. Altına Gün 4 bölümü eklendi.
>
> ```ts
> // Kayıt ve giriş formlarının sunucu tarafı doğrulaması.
> // Bu dosyadaki fonksiyonlar "saf"tır: veritabanına veya çereze dokunmazlar,
> // aynı girdiye her zaman aynı sonucu verirler. Bu yüzden kolay test edilirler.
>
> // Doğrulama sonucu: ya temiz değer döner, ya da kullanıcıya gösterilecek hata.
> export type Sonuc<T> = { ok: true; deger: T } | { ok: false; hata: string };
>
> // Basit e-posta biçimi: boşluk içermez, "@" ve noktalı bir alan adı vardır.
> const EPOSTA_DESENI = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
>
> // Parola sınırları. bcrypt en fazla 72 baytı dikkate alır, bu yüzden üst sınır var.
> const PAROLA_EN_AZ = 8;
> const PAROLA_EN_COK_BAYT = 72;
>
> // Başındaki ve sonundaki boşlukları siler. Metin değilse boş metin döner.
> function temizle(girdi: unknown): string {
>   return typeof girdi === "string" ? girdi.trim() : "";
> }
>
> // Genel metin alanı kontrolü (firma adı, ad soyad).
> export function metinDogrula(
>   girdi: unknown,
>   alanAdi: string,
>   enAz: number,
>   enCok: number
> ): Sonuc<string> {
>   const metin = temizle(girdi);
>   if (metin.length === 0) {
>     return { ok: false, hata: `${alanAdi} boş bırakılamaz.` };
>   }
>   if (metin.length < enAz) {
>     return { ok: false, hata: `${alanAdi} en az ${enAz} karakter olmalıdır.` };
>   }
>   if (metin.length > enCok) {
>     return { ok: false, hata: `${alanAdi} en fazla ${enCok} karakter olabilir.` };
>   }
>   return { ok: true, deger: metin };
> }
>
> // E-posta kontrolü. Başarılıysa küçük harfe çevrilmiş hâli döner.
> // Neden küçük harf? PostgreSQL'de "Ali@x.com" ile "ali@x.com" farklı sayılır,
> // bu yüzden aynı kişi iki kez kayıt olabilirdi.
> export function epostaDogrula(girdi: unknown): Sonuc<string> {
>   const eposta = temizle(girdi).toLowerCase();
>   if (eposta.length === 0) {
>     return { ok: false, hata: "E-posta adresi boş bırakılamaz." };
>   }
>   if (eposta.length > 254 || !EPOSTA_DESENI.test(eposta)) {
>     return { ok: false, hata: "Lütfen geçerli bir e-posta adresi girin." };
>   }
>   return { ok: true, deger: eposta };
> }
>
> // Parola kontrolü. Parolanın başı ve sonu ASLA kırpılmaz (kullanıcı ne yazdıysa o).
> export function parolaDogrula(girdi: unknown): Sonuc<string> {
>   if (typeof girdi !== "string" || girdi.length === 0) {
>     return { ok: false, hata: "Parola boş bırakılamaz." };
>   }
>   if (girdi.length < PAROLA_EN_AZ) {
>     return {
>       ok: false,
>       hata: `Parola en az ${PAROLA_EN_AZ} karakter olmalıdır.`,
>     };
>   }
>   // Türkçe karakterler (ğ, ş, ı gibi) 2 bayt sayılır, bu yüzden bayt olarak ölçülür.
>   if (new TextEncoder().encode(girdi).length > PAROLA_EN_COK_BAYT) {
>     return { ok: false, hata: "Parola çok uzun. Daha kısa bir parola seçin." };
>   }
>   return { ok: true, deger: girdi };
> }
>
> // Kayıt formundan gelen temizlenmiş ve doğrulanmış değerler.
> export type KayitGirdisi = {
>   firmaAdi: string;
>   adSoyad: string;
>   eposta: string;
>   parola: string;
> };
>
> // Kayıt formunun tamamını kontrol eder. İlk bulduğu hatayı döner.
> export function kayitGirdisiniDogrula(girdi: {
>   firmaAdi: unknown;
>   adSoyad: unknown;
>   eposta: unknown;
>   parola: unknown;
> }): Sonuc<KayitGirdisi> {
>   const firma = metinDogrula(girdi.firmaAdi, "Firma adı", 2, 100);
>   if (!firma.ok) return firma;
>
>   const ad = metinDogrula(girdi.adSoyad, "Ad soyad", 2, 100);
>   if (!ad.ok) return ad;
>
>   const eposta = epostaDogrula(girdi.eposta);
>   if (!eposta.ok) return eposta;
>
>   const parola = parolaDogrula(girdi.parola);
>   if (!parola.ok) return parola;
>
>   return {
>     ok: true,
>     deger: {
>       firmaAdi: firma.deger,
>       adSoyad: ad.deger,
>       eposta: eposta.deger,
>       parola: parola.deger,
>     },
>   };
> }
>
> // ---------- Müşteri ve plan formları (Gün 4) ----------
>
> // Form doğrulama sonucu: ya temiz değerler, ya da alan bazında hatalar.
> // Kayıt formundan farkı: ilk hatada durmaz, bütün alanların hatasını birlikte döner.
> export type AlanSonucu<T, Alan extends string> =
>   | { ok: true; deger: T }
>   | { ok: false; alanHatalari: Partial<Record<Alan, string>> };
>
> // Kayıt kimliği (id) kontrolü. Kimlikler cuid biçimindedir: küçük harf ve rakam.
> // Biçimi bozuk kimlik için de "bulunamadı" denir; neyin yanlış olduğu söylenmez.
> const KIMLIK_DESENI = /^[a-z0-9]{1,50}$/;
>
> export function kimlikDogrula(girdi: unknown): Sonuc<string> {
>   const kimlik = temizle(girdi);
>   if (!KIMLIK_DESENI.test(kimlik)) {
>     return { ok: false, hata: "Kayıt bulunamadı." };
>   }
>   return { ok: true, deger: kimlik };
> }
>
> // İsteğe bağlı e-posta: boşsa null döner, doluysa normal e-posta kontrolü yapılır.
> export function istegeBagliEpostaDogrula(girdi: unknown): Sonuc<string | null> {
>   if (temizle(girdi).length === 0) {
>     return { ok: true, deger: null };
>   }
>   return epostaDogrula(girdi);
> }
>
> // Fiyat sınırı. Veritabanındaki Int sütunu yaklaşık 2,1 milyara kadar sayı alır;
> // gerçekçi bir üst sınır koyarak taşmayı ve yazım hatalarını önlüyoruz.
> export const FIYAT_EN_COK = 10_000_000;
>
> // Fiyat kontrolü: TL cinsinden, 0'dan büyük tam sayı (kuruş yok).
> export function fiyatDogrula(girdi: unknown): Sonuc<number> {
>   const metin = temizle(girdi);
>   if (metin.length === 0) {
>     return { ok: false, hata: "Fiyat boş bırakılamaz." };
>   }
>   if (metin.startsWith("-")) {
>     return { ok: false, hata: "Fiyat 0'dan büyük olmalıdır." };
>   }
>   // "1.000" (binlik) ile "12,5" (kuruş) yazımı karışmasın diye ikisi de reddedilir.
>   if (/[.,]/.test(metin)) {
>     return {
>       ok: false,
>       hata: "Fiyatı nokta veya virgül kullanmadan, tam sayı olarak yazın (ör. 1000). Kuruş girilmez.",
>     };
>   }
>   if (!/^\d+$/.test(metin)) {
>     return { ok: false, hata: "Fiyat yalnızca rakamlardan oluşmalıdır." };
>   }
>   // Çok uzun rakam dizilerini sayıya çevirmeden önce eleriz.
>   const fiyat = metin.length > 9 ? Infinity : Number(metin);
>   if (fiyat === 0) {
>     return { ok: false, hata: "Fiyat 0'dan büyük olmalıdır." };
>   }
>   if (fiyat > FIYAT_EN_COK) {
>     return {
>       ok: false,
>       hata: `Fiyat en fazla ${FIYAT_EN_COK.toLocaleString("tr-TR")} TL olabilir.`,
>     };
>   }
>   return { ok: true, deger: fiyat };
> }
>
> // Plan aralıkları ve ekranda gösterilen Türkçe karşılıkları.
> export const PLAN_ARALIKLARI = ["MONTHLY", "YEARLY"] as const;
> export type PlanAraligi = (typeof PLAN_ARALIKLARI)[number];
> export const ARALIK_ETIKETI: Record<PlanAraligi, string> = {
>   MONTHLY: "Aylık",
>   YEARLY: "Yıllık",
> };
>
> // Aralık kontrolü: yalnızca listedeki değerler kabul edilir.
> export function aralikDogrula(girdi: unknown): Sonuc<PlanAraligi> {
>   const metin = temizle(girdi);
>   const gecerli = (PLAN_ARALIKLARI as readonly string[]).includes(metin);
>   if (!gecerli) {
>     return { ok: false, hata: "Lütfen aylık veya yıllık aralığı seçin." };
>   }
>   return { ok: true, deger: metin as PlanAraligi };
> }
>
> // Müşteri formundan gelen temizlenmiş değerler.
> export type MusteriGirdisi = {
>   ad: string;
>   eposta: string | null;
> };
>
> // Müşteri formunun tamamını kontrol eder.
> export function musteriGirdisiniDogrula(girdi: {
>   ad: unknown;
>   eposta: unknown;
> }): AlanSonucu<MusteriGirdisi, "ad" | "eposta"> {
>   const ad = metinDogrula(girdi.ad, "Müşteri adı", 2, 100);
>   const eposta = istegeBagliEpostaDogrula(girdi.eposta);
>
>   if (ad.ok && eposta.ok) {
>     return { ok: true, deger: { ad: ad.deger, eposta: eposta.deger } };
>   }
>
>   const alanHatalari: Partial<Record<"ad" | "eposta", string>> = {};
>   if (!ad.ok) alanHatalari.ad = ad.hata;
>   if (!eposta.ok) alanHatalari.eposta = eposta.hata;
>   return { ok: false, alanHatalari };
> }
>
> // Plan formundan gelen temizlenmiş değerler.
> export type PlanGirdisi = {
>   ad: string;
>   fiyat: number;
>   aralik: PlanAraligi;
> };
>
> // Plan formunun tamamını kontrol eder.
> export function planGirdisiniDogrula(girdi: {
>   ad: unknown;
>   fiyat: unknown;
>   aralik: unknown;
> }): AlanSonucu<PlanGirdisi, "ad" | "fiyat" | "aralik"> {
>   const ad = metinDogrula(girdi.ad, "Plan adı", 2, 100);
>   const fiyat = fiyatDogrula(girdi.fiyat);
>   const aralik = aralikDogrula(girdi.aralik);
>
>   if (ad.ok && fiyat.ok && aralik.ok) {
>     return {
>       ok: true,
>       deger: { ad: ad.deger, fiyat: fiyat.deger, aralik: aralik.deger },
>     };
>   }
>
>   const alanHatalari: Partial<Record<"ad" | "fiyat" | "aralik", string>> = {};
>   if (!ad.ok) alanHatalari.ad = ad.hata;
>   if (!fiyat.ok) alanHatalari.fiyat = fiyat.hata;
>   if (!aralik.ok) alanHatalari.aralik = aralik.hata;
>   return { ok: false, alanHatalari };
> }
> ```
>
> ### `src/lib/islem.ts`: yeni dosya oluştur
>
> ```ts
> // Sunucu işlemlerinin (server actions) ortak türü, mesajları ve yardımcıları.
> // Bu dosya hem sunucuda hem tarayıcıda kullanılabilir: veritabanına dokunmaz.
>
> // Bir form işleminin sonucu. Form bileşeni bu değere göre mesaj gösterir.
> export type FormDurumu = {
>   durum: "bos" | "basarili" | "hata";
>   mesaj?: string;
>   // Alan bazında hatalar (ör. { fiyat: "Fiyat 0'dan büyük olmalıdır." })
>   alanHatalari?: Partial<Record<string, string>>;
>   // Hata durumunda formun kullanıcının yazdıklarıyla yeniden doldurulması için
>   degerler?: Record<string, string>;
> };
>
> // Form ilk açıldığında henüz bir işlem yapılmamıştır.
> export const BASLANGIC_DURUMU: FormDurumu = { durum: "bos" };
>
> // Kullanıcıya gösterilen ortak Türkçe mesajlar.
> export const MESAJ = {
>   formHatali: "Lütfen işaretli alanları düzeltin.",
>   bulunamadi: "Kayıt bulunamadı.",
>   yetkiYok: "Bu işlemi yalnızca firma yöneticisi yapabilir.",
>   beklenmeyen: "İşlem tamamlanamadı. Lütfen tekrar deneyin.",
> } as const;
>
> // Formdan bir alanı metin olarak okur. Alan yoksa veya dosyaysa boş metin döner.
> export function formMetni(formData: FormData, alan: string): string {
>   const deger = formData.get(alan);
>   return typeof deger === "string" ? deger : "";
> }
>
> // Prisma'nın "tekrar eden kayıt" hatasını (P2002) tanır.
> // (auth.ts içinde de aynı mantık var; o dosyaya dokunmamak için burada da tanımlı.)
> export function tekrarEdenKayitMi(hata: unknown): boolean {
>   return (
>     typeof hata === "object" &&
>     hata !== null &&
>     "code" in hata &&
>     (hata as { code: unknown }).code === "P2002"
>   );
> }
> ```
>
> ### `src/lib/abonelik-kontrol.ts`: yeni dosya oluştur
>
> ```ts
> // AKTİF ABONELİK KONTROLÜ
> //
> // Bir müşteri veya plan pasife alınmadan önce ve aktif aboneliği olan bir planın
> // fiyatı veya aralığı değiştirilmek istendiğinde bu fonksiyon çağrılır.
> // Bu kontrolün yapıldığı TEK yer burasıdır.
> //
> // Sorgu getTenantDb() üzerinden yapılır. "count" işlemi tenant.ts içindeki OKUMA
> // listesinde olduğu için filtreye tenantId otomatik eklenir: başka firmanın
> // abonelikleri hiçbir zaman sayılmaz.
> //
> // Abonelikler Gün 5'te yazılacak. O zamana kadar tablo boş olduğu için sonuç
> // her zaman "yok" (false) çıkar.
> //
> // GÜN 5 NOTU:
> // - Abonelik BAŞLATILIRKEN müşterinin ve planın isActive=true olduğu kontrol edilmeli.
> //   Pasife alma "önce kontrol et, sonra güncelle" şeklinde iki adımdır. Aynı anda biri
> //   pasife alırken diğeri abonelik başlatırsa pasif kayda aktif abonelik bağlanabilir.
> //   Abonelik başlatmadaki isActive kontrolü bu açığı karşı taraftan kapatır.
> // - Aynı kısa pencere plan fiyatı değiştirilirken de vardır. Gün 5'te abonelik
> //   başlatma ve bu kontrol aynı veritabanı işlemi (transaction) içinde düşünülebilir.
>
> import { getTenantDb } from "./tenant";
>
> type Hedef = { musteriId: string } | { planId: string };
>
> // Verilen müşterinin veya planın ACTIVE durumda aboneliği var mı?
> export async function aktifAbonelikVarMi(hedef: Hedef): Promise<boolean> {
>   const db = await getTenantDb();
>
>   const kosul =
>     "musteriId" in hedef
>       ? { customerId: hedef.musteriId }
>       : { planId: hedef.planId };
>
>   const sayi = await db.subscription.count({
>     where: { ...kosul, status: "ACTIVE" },
>   });
>
>   return sayi > 0;
> }
> ```
>
> ### `src/components/ui/IslemMesaji.tsx`: yeni dosya oluştur
>
> ```tsx
> import type { FormDurumu } from "@/lib/islem";
>
> // Bir form işleminin sonucunu gösterir: başarılıysa yeşil, hatalıysa kırmızı kutu.
> // Henüz işlem yapılmadıysa hiçbir şey göstermez.
> export default function IslemMesaji({ durum }: { durum: FormDurumu }) {
>   if (durum.durum === "bos" || !durum.mesaj) return null;
>
>   const basarili = durum.durum === "basarili";
>   const renk = basarili
>     ? "border-green-200 bg-green-50 text-green-800"
>     : "border-red-200 bg-red-50 text-red-700";
>
>   return (
>     <p
>       role={basarili ? "status" : "alert"}
>       className={`rounded-lg border px-3 py-2 text-sm ${renk}`}
>     >
>       {durum.mesaj}
>     </p>
>   );
> }
> ```
>
> ---
>
> ## Adım 3 • Müşteriler
>
> Düzenleme sayfasının klasörünü oluşturur. Köşeli parantez zsh'de özel anlam taşıdığı için yol tırnak içinde yazılıyor.
> ```
> mkdir -p "src/app/(panel)/musteriler/[id]"
> ```
>
> ### `src/app/(panel)/musteriler/actions.ts`: yeni dosya oluştur
>
> ```ts
> "use server";
>
> // MÜŞTERİ SUNUCU İŞLEMLERİ: ekleme, düzenleme, pasife alma.
> //
> // Sunucu işlemleri dışarıdan doğrudan çağrılabilen uç noktalardır. Bu yüzden
> // yetki kontrolü her işlemin KENDİ İÇİNDE yapılır; düğmeyi gizlemek yetmez.
> // Bütün sorgular getTenantDb() üzerinden yapılır, tenantId otomatik eklenir.
> // Başka firmanın kaydı hiçbir sorguda eşleşmez, sonuç "Kayıt bulunamadı." olur.
> //
> // DİKKAT: requireUser() ve getTenantDb() giriş yapılmamışsa yönlendirme (redirect)
> // yapar. Yönlendirme bir hata olarak fırlatıldığı için bu çağrılar try/catch
> // bloklarının DIŞINDA tutulur.
>
> import { revalidatePath } from "next/cache";
> import { requireManager, requireUser } from "@/lib/auth";
> import { getTenantDb } from "@/lib/tenant";
> import { kimlikDogrula, musteriGirdisiniDogrula } from "@/lib/validation";
> import { aktifAbonelikVarMi } from "@/lib/abonelik-kontrol";
> import {
>   MESAJ,
>   formMetni,
>   tekrarEdenKayitMi,
>   type FormDurumu,
> } from "@/lib/islem";
>
> const EPOSTA_TEKRAR =
>   "Bu e-posta adresi başka bir müşteride kayıtlı (pasif müşteriler dahil).";
>
> // Formdan gelen ham değerler. Hata olursa form bu değerlerle yeniden doldurulur.
> function formDegerleri(formData: FormData) {
>   return {
>     ad: formMetni(formData, "ad"),
>     eposta: formMetni(formData, "eposta"),
>   };
> }
>
> // Bu firmada aynı e-postayı kullanan başka bir müşteri var mı?
> // Kullanıcıya anlaşılır mesaj vermek için önceden bakılır. Asıl garanti
> // veritabanındaki @@unique([tenantId, email]) kuralıdır.
> // haricId: düzenlemede kaydın kendisi sayılmasın diye.
> async function epostaKullaniliyorMu(
>   eposta: string | null,
>   haricId?: string
> ): Promise<boolean> {
>   if (!eposta) return false;
>   const db = await getTenantDb();
>   const mevcut = await db.customer.findFirst({
>     where: {
>       email: eposta,
>       ...(haricId ? { id: { not: haricId } } : {}),
>     },
>     select: { id: true },
>   });
>   return mevcut !== null;
> }
>
> // Yeni müşteri ekler. manager ve finance yapabilir.
> export async function musteriEkle(
>   _onceki: FormDurumu,
>   formData: FormData
> ): Promise<FormDurumu> {
>   const kullanici = await requireUser();
>   const degerler = formDegerleri(formData);
>
>   const sonuc = musteriGirdisiniDogrula(degerler);
>   if (!sonuc.ok) {
>     return {
>       durum: "hata",
>       mesaj: MESAJ.formHatali,
>       alanHatalari: sonuc.alanHatalari,
>       degerler,
>     };
>   }
>   const { ad, eposta } = sonuc.deger;
>
>   if (await epostaKullaniliyorMu(eposta)) {
>     return {
>       durum: "hata",
>       mesaj: MESAJ.formHatali,
>       alanHatalari: { eposta: EPOSTA_TEKRAR },
>       degerler,
>     };
>   }
>
>   const db = await getTenantDb();
>   try {
>     await db.customer.create({
>       // tenantId burada yalnızca TypeScript'in istediği alan olduğu için yazılır
>       // ve OTURUMDAN gelir, formdan değil. tenant.ts uzantısı bu değeri zaten
>       // oturumdaki değerle zorla üzerine yazar.
>       data: { tenantId: kullanici.tenantId, name: ad, email: eposta },
>     });
>   } catch (hata) {
>     // İki kişi aynı anda aynı e-postayı eklerse veritabanı engeller.
>     if (tekrarEdenKayitMi(hata)) {
>       return {
>         durum: "hata",
>         mesaj: MESAJ.formHatali,
>         alanHatalari: { eposta: EPOSTA_TEKRAR },
>         degerler,
>       };
>     }
>     console.error("Müşteri eklenirken beklenmeyen hata.");
>     return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler };
>   }
>
>   revalidatePath("/musteriler");
>   // Başarılı eklemede "degerler" dönülmez: form boşalır, yeni kayda hazır olur.
>   return { durum: "basarili", mesaj: `"${ad}" müşterisi eklendi.` };
> }
>
> // Müşteri bilgilerini günceller. manager ve finance yapabilir.
> export async function musteriGuncelle(
>   _onceki: FormDurumu,
>   formData: FormData
> ): Promise<FormDurumu> {
>   await requireUser();
>   const degerler = formDegerleri(formData);
>
>   const kimlik = kimlikDogrula(formData.get("id"));
>   if (!kimlik.ok) {
>     return { durum: "hata", mesaj: MESAJ.bulunamadi, degerler };
>   }
>
>   const sonuc = musteriGirdisiniDogrula(degerler);
>   if (!sonuc.ok) {
>     return {
>       durum: "hata",
>       mesaj: MESAJ.formHatali,
>       alanHatalari: sonuc.alanHatalari,
>       degerler,
>     };
>   }
>   const { ad, eposta } = sonuc.deger;
>
>   if (await epostaKullaniliyorMu(eposta, kimlik.deger)) {
>     return {
>       durum: "hata",
>       mesaj: MESAJ.formHatali,
>       alanHatalari: { eposta: EPOSTA_TEKRAR },
>       degerler,
>     };
>   }
>
>   const db = await getTenantDb();
>   let guncellenenSayisi: number;
>   try {
>     // updateMany: kayıt bu firmaya ait değilse hata fırlatmaz, 0 satır döner.
>     const sonucSatir = await db.customer.updateMany({
>       where: { id: kimlik.deger },
>       data: { name: ad, email: eposta },
>     });
>     guncellenenSayisi = sonucSatir.count;
>   } catch (hata) {
>     if (tekrarEdenKayitMi(hata)) {
>       return {
>         durum: "hata",
>         mesaj: MESAJ.formHatali,
>         alanHatalari: { eposta: EPOSTA_TEKRAR },
>         degerler,
>       };
>     }
>     console.error("Müşteri güncellenirken beklenmeyen hata.");
>     return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler };
>   }
>
>   // Kayıt yok ya da başka firmaya ait: ikisinde de aynı cevap.
>   if (guncellenenSayisi === 0) {
>     return { durum: "hata", mesaj: MESAJ.bulunamadi, degerler };
>   }
>
>   revalidatePath("/musteriler");
>   revalidatePath(`/musteriler/${kimlik.deger}`);
>   return {
>     durum: "basarili",
>     mesaj: "Değişiklikler kaydedildi.",
>     degerler: { ad, eposta: eposta ?? "" },
>   };
> }
>
> // Müşteriyi pasife alır. YALNIZCA manager yapabilir. Geri alınamaz.
> export async function musteriPasifeAl(
>   _onceki: FormDurumu,
>   formData: FormData
> ): Promise<FormDurumu> {
>   // Sunucu tarafı yetki kontrolü: finance kullanıcısı için null döner.
>   const yonetici = await requireManager();
>   if (!yonetici) {
>     return { durum: "hata", mesaj: MESAJ.yetkiYok };
>   }
>
>   const kimlik = kimlikDogrula(formData.get("id"));
>   if (!kimlik.ok) {
>     return { durum: "hata", mesaj: MESAJ.bulunamadi };
>   }
>
>   const db = await getTenantDb();
>   const musteri = await db.customer.findFirst({
>     where: { id: kimlik.deger },
>     select: { isActive: true },
>   });
>   if (!musteri) {
>     return { durum: "hata", mesaj: MESAJ.bulunamadi };
>   }
>   if (!musteri.isActive) {
>     return { durum: "hata", mesaj: "Bu müşteri zaten pasif." };
>   }
>
>   // Aktif aboneliği olan müşteri pasife alınamaz (bkz. src/lib/abonelik-kontrol.ts).
>   if (await aktifAbonelikVarMi({ musteriId: kimlik.deger })) {
>     return {
>       durum: "hata",
>       mesaj:
>         "Bu müşterinin aktif aboneliği var. Önce aboneliği iptal edin, sonra müşteriyi pasife alın.",
>     };
>   }
>
>   try {
>     const sonucSatir = await db.customer.updateMany({
>       where: { id: kimlik.deger, isActive: true },
>       data: { isActive: false },
>     });
>     if (sonucSatir.count === 0) {
>       return { durum: "hata", mesaj: MESAJ.bulunamadi };
>     }
>   } catch {
>     console.error("Müşteri pasife alınırken beklenmeyen hata.");
>     return { durum: "hata", mesaj: MESAJ.beklenmeyen };
>   }
>
>   revalidatePath("/musteriler");
>   revalidatePath(`/musteriler/${kimlik.deger}`);
>   return { durum: "basarili", mesaj: "Müşteri pasife alındı." };
> }
> ```
>
> ### `src/app/(panel)/musteriler/MusteriFormu.tsx`: yeni dosya oluştur
>
> ```tsx
> "use client";
>
> // Müşteri ekleme ve düzenleme için ortak form.
> // noValidate: tarayıcının kendi kontrolü kapalıdır. Böylece bütün doğrulama
> // sunucuda yapılır ve Türkçe mesajlar her zaman aynı yerden gelir.
>
> import { useActionState } from "react";
> import FormAlani from "@/components/ui/FormAlani";
> import Dugme from "@/components/ui/Dugme";
> import IslemMesaji from "@/components/ui/IslemMesaji";
> import { BASLANGIC_DURUMU } from "@/lib/islem";
> import { musteriEkle, musteriGuncelle } from "./actions";
>
> type Props =
>   | { mod: "ekle" }
>   | { mod: "duzenle"; musteri: { id: string; ad: string; eposta: string } };
>
> export default function MusteriFormu(props: Props) {
>   const islem = props.mod === "ekle" ? musteriEkle : musteriGuncelle;
>   const [durum, formIslemi, bekliyor] = useActionState(islem, BASLANGIC_DURUMU);
>
>   // Formun ilk değerleri: düzenlemede kayıttaki bilgiler, eklemede boş.
>   const ilk =
>     props.mod === "duzenle"
>       ? { ad: props.musteri.ad, eposta: props.musteri.eposta }
>       : { ad: "", eposta: "" };
>
>   // İşlemden dönen değer varsa onu, yoksa ilk değeri kullan.
>   const deger = (alan: "ad" | "eposta") => durum.degerler?.[alan] ?? ilk[alan];
>
>   return (
>     <form action={formIslemi} noValidate className="space-y-4">
>       {props.mod === "duzenle" && (
>         <input type="hidden" name="id" value={props.musteri.id} />
>       )}
>
>       <div className="grid gap-4 sm:grid-cols-2">
>         <FormAlani
>           etiket="Müşteri adı"
>           name="ad"
>           defaultValue={deger("ad")}
>           hata={durum.alanHatalari?.ad}
>           maxLength={100}
>           autoComplete="off"
>         />
>         <FormAlani
>           etiket="E-posta (isteğe bağlı)"
>           name="eposta"
>           type="email"
>           defaultValue={deger("eposta")}
>           hata={durum.alanHatalari?.eposta}
>           yardim="Aynı firmada iki müşteri aynı e-postayı kullanamaz."
>           autoComplete="off"
>         />
>       </div>
>
>       <IslemMesaji durum={durum} />
>
>       <Dugme type="submit" disabled={bekliyor}>
>         {bekliyor
>           ? "Kaydediliyor..."
>           : props.mod === "ekle"
>             ? "Müşteri ekle"
>             : "Değişiklikleri kaydet"}
>       </Dugme>
>     </form>
>   );
> }
> ```
>
> ### `src/app/(panel)/musteriler/PasifeAlDugmesi.tsx`: yeni dosya oluştur
>
> ```tsx
> "use client";
>
> // Müşteriyi pasife alma düğmesi. Yalnızca manager'a gösterilir.
> // Asıl yetki kontrolü sunucuda, musteriPasifeAl() içinde yapılır.
> // Kayıt pasife alındıktan sonra da bu bileşen yerinde kalır; böylece
> // başarı mesajı ekranda görünmeye devam eder.
>
> import { useActionState } from "react";
> import Dugme from "@/components/ui/Dugme";
> import IslemMesaji from "@/components/ui/IslemMesaji";
> import { BASLANGIC_DURUMU } from "@/lib/islem";
> import { musteriPasifeAl } from "./actions";
>
> type Props = { id: string; ad: string; aktif: boolean };
>
> export default function PasifeAlDugmesi({ id, ad, aktif }: Props) {
>   const [durum, formIslemi, bekliyor] = useActionState(
>     musteriPasifeAl,
>     BASLANGIC_DURUMU
>   );
>
>   return (
>     <div className="space-y-3">
>       {aktif ? (
>         <>
>           <p className="text-sm text-slate-600">
>             Pasife alınan müşteri varsayılan listede görünmez. Kayıt silinmez,
>             ancak geri aktifleştirilemez.
>           </p>
>           <form
>             action={formIslemi}
>             onSubmit={(olay) => {
>               // Kullanıcı onay vermezse form gönderilmez.
>               if (!window.confirm(`"${ad}" müşterisi pasife alınsın mı? Bu işlem geri alınamaz.`)) {
>                 olay.preventDefault();
>               }
>             }}
>           >
>             <input type="hidden" name="id" value={id} />
>             <Dugme type="submit" gorunum="tehlike" disabled={bekliyor}>
>               {bekliyor ? "İşleniyor..." : "Pasife al"}
>             </Dugme>
>           </form>
>         </>
>       ) : (
>         <p className="text-sm text-slate-600">Bu müşteri pasif durumda.</p>
>       )}
>
>       <IslemMesaji durum={durum} />
>     </div>
>   );
> }
> ```
>
> ### `src/app/(panel)/musteriler/page.tsx`: dosyanın içeriğini tamamen şununla değiştir
>
> ```tsx
> import Link from "next/link";
> import { requireUser } from "@/lib/auth";
> import { getTenantDb } from "@/lib/tenant";
> import SayfaBasligi from "@/components/ui/SayfaBasligi";
> import BosDurum from "@/components/ui/BosDurum";
> import Rozet from "@/components/ui/Rozet";
> import MusteriFormu from "./MusteriFormu";
>
> // Müşteri listesi ve yeni müşteri formu. manager ve finance görebilir.
> // "?pasif=1" yalnızca görünüm filtresidir; kiracı filtresi getTenantDb() ile
> // her durumda otomatik uygulanır.
>
> type SayfaProps = {
>   searchParams: Promise<{ pasif?: string | string[] }>;
> };
>
> export default async function MusterilerSayfasi({ searchParams }: SayfaProps) {
>   await requireUser();
>   const { pasif } = await searchParams;
>   const pasifleriGoster = pasif === "1";
>
>   const db = await getTenantDb();
>   const musteriler = await db.customer.findMany({
>     where: pasifleriGoster ? {} : { isActive: true },
>     orderBy: [{ isActive: "desc" }, { name: "asc" }],
>     select: { id: true, name: true, email: true, isActive: true },
>   });
>
>   return (
>     <div className="space-y-8">
>       <SayfaBasligi
>         baslik="Müşteriler"
>         aciklama="Firmanızın müşteri kayıtları."
>       />
>
>       <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
>         <h2 className="text-base font-semibold text-slate-900">Yeni müşteri</h2>
>         <div className="mt-4">
>           <MusteriFormu mod="ekle" />
>         </div>
>       </section>
>
>       <section className="space-y-4">
>         <div className="flex items-center justify-between gap-3">
>           <h2 className="text-base font-semibold text-slate-900">
>             Müşteri listesi ({musteriler.length})
>           </h2>
>           <Link
>             href={pasifleriGoster ? "/musteriler" : "/musteriler?pasif=1"}
>             className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
>           >
>             {pasifleriGoster ? "Pasifleri gizle" : "Pasifleri göster"}
>           </Link>
>         </div>
>
>         {musteriler.length === 0 ? (
>           <BosDurum
>             baslik="Henüz müşteri yok"
>             aciklama={
>               pasifleriGoster
>                 ? "Bu firmada kayıtlı müşteri bulunmuyor."
>                 : "Yukarıdaki formdan ilk müşterinizi ekleyin."
>             }
>           />
>         ) : (
>           <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
>             <table className="min-w-full divide-y divide-slate-200 text-sm">
>               <thead className="bg-slate-50 text-left text-slate-600">
>                 <tr>
>                   <th className="px-4 py-3 font-medium">Ad</th>
>                   <th className="px-4 py-3 font-medium">E-posta</th>
>                   <th className="px-4 py-3 font-medium">Durum</th>
>                   <th className="px-4 py-3">
>                     <span className="sr-only">İşlemler</span>
>                   </th>
>                 </tr>
>               </thead>
>               <tbody className="divide-y divide-slate-100">
>                 {musteriler.map((musteri) => (
>                   <tr key={musteri.id}>
>                     <td className="px-4 py-3 font-medium text-slate-900">
>                       {musteri.name}
>                     </td>
>                     <td className="px-4 py-3 text-slate-600">
>                       {musteri.email ?? "—"}
>                     </td>
>                     <td className="px-4 py-3">
>                       <Rozet ton={musteri.isActive ? "indigo" : "gri"}>
>                         {musteri.isActive ? "Aktif" : "Pasif"}
>                       </Rozet>
>                     </td>
>                     <td className="px-4 py-3 text-right">
>                       <Link
>                         href={`/musteriler/${musteri.id}`}
>                         className="font-medium text-indigo-600 hover:text-indigo-700"
>                       >
>                         Düzenle
>                       </Link>
>                     </td>
>                   </tr>
>                 ))}
>               </tbody>
>             </table>
>           </div>
>         )}
>       </section>
>     </div>
>   );
> }
> ```
>
> ### `src/app/(panel)/musteriler/[id]/page.tsx`: yeni dosya oluştur
>
> ```tsx
> import Link from "next/link";
> import { notFound } from "next/navigation";
> import { requireUser } from "@/lib/auth";
> import { getTenantDb } from "@/lib/tenant";
> import { kimlikDogrula } from "@/lib/validation";
> import SayfaBasligi from "@/components/ui/SayfaBasligi";
> import Rozet from "@/components/ui/Rozet";
> import MusteriFormu from "../MusteriFormu";
> import PasifeAlDugmesi from "../PasifeAlDugmesi";
>
> // Müşteri düzenleme sayfası.
> // Kayıt yoksa ya da BAŞKA FİRMAYA aitse aynı cevap verilir: "bulunamadı" (404).
> // Böylece başka firmada böyle bir kaydın var olup olmadığı da anlaşılamaz.
>
> type SayfaProps = { params: Promise<{ id: string }> };
>
> export default async function MusteriDuzenleSayfasi({ params }: SayfaProps) {
>   const kullanici = await requireUser();
>   const { id } = await params;
>
>   const kimlik = kimlikDogrula(id);
>   if (!kimlik.ok) notFound();
>
>   const db = await getTenantDb();
>   const musteri = await db.customer.findFirst({
>     where: { id: kimlik.deger },
>     select: { id: true, name: true, email: true, isActive: true },
>   });
>   if (!musteri) notFound();
>
>   const yonetici = kullanici.role === "manager";
>
>   return (
>     <div className="space-y-8">
>       <Link
>         href="/musteriler"
>         className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
>       >
>         ← Müşterilere dön
>       </Link>
>
>       <div className="space-y-2">
>         <SayfaBasligi
>           baslik={musteri.name}
>           aciklama="Müşteri bilgilerini düzenleyin."
>         />
>         {!musteri.isActive && <Rozet ton="gri">Pasif</Rozet>}
>       </div>
>
>       <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
>         <h2 className="text-base font-semibold text-slate-900">Bilgiler</h2>
>         <div className="mt-4">
>           <MusteriFormu
>             mod="duzenle"
>             musteri={{
>               id: musteri.id,
>               ad: musteri.name,
>               eposta: musteri.email ?? "",
>             }}
>           />
>         </div>
>       </section>
>
>       <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
>         <h2 className="text-base font-semibold text-slate-900">Pasife alma</h2>
>         <div className="mt-4">
>           {yonetici ? (
>             <PasifeAlDugmesi
>               id={musteri.id}
>               ad={musteri.name}
>               aktif={musteri.isActive}
>             />
>           ) : (
>             // Düğmeyi gizlemek yalnızca kolaylıktır. Asıl engel sunucudadır.
>             <p className="text-sm text-slate-600">
>               Pasife alma yalnızca firma yöneticisi tarafından yapılabilir.
>             </p>
>           )}
>         </div>
>       </section>
>     </div>
>   );
> }
> ```
>
> ---
>
> ## Adım 4 • Planlar
>
> Plan düzenleme sayfasının klasörünü oluşturur:
> ```
> mkdir -p "src/app/(panel)/planlar/[id]"
> ```
>
> ### `src/app/(panel)/planlar/actions.ts`: yeni dosya oluştur
>
> ```ts
> "use server";
>
> // PLAN SUNUCU İŞLEMLERİ: ekleme, düzenleme, pasife alma.
> // Kurallar müşteri işlemleriyle aynıdır (bkz. musteriler/actions.ts).
> // Ek kural: aktif aboneliği olan planın fiyatı ve aralığı değiştirilemez,
> // çünkü MRR planın ŞU ANKİ fiyatından hesaplanır. Fiyat değişirse geçmiş
> // ve bugünkü MRR bir anda değişir. Ad değişikliği serbesttir.
>
> import { revalidatePath } from "next/cache";
> import { requireManager, requireUser } from "@/lib/auth";
> import { getTenantDb } from "@/lib/tenant";
> import { kimlikDogrula, planGirdisiniDogrula } from "@/lib/validation";
> import { aktifAbonelikVarMi } from "@/lib/abonelik-kontrol";
> import { MESAJ, formMetni, type FormDurumu } from "@/lib/islem";
>
> const KILITLI_MESAJ =
>   "Bu planın aktif abonelikleri var. Fiyat ve aralık değiştirilemez, yalnızca ad değiştirilebilir.";
>
> // Formdan gelen ham değerler. Hata olursa form bu değerlerle yeniden doldurulur.
> function formDegerleri(formData: FormData) {
>   return {
>     ad: formMetni(formData, "ad"),
>     fiyat: formMetni(formData, "fiyat"),
>     aralik: formMetni(formData, "aralik"),
>   };
> }
>
> // Yeni plan ekler. manager ve finance yapabilir.
> export async function planEkle(
>   _onceki: FormDurumu,
>   formData: FormData
> ): Promise<FormDurumu> {
>   const kullanici = await requireUser();
>   const degerler = formDegerleri(formData);
>
>   const sonuc = planGirdisiniDogrula(degerler);
>   if (!sonuc.ok) {
>     return {
>       durum: "hata",
>       mesaj: MESAJ.formHatali,
>       alanHatalari: sonuc.alanHatalari,
>       degerler,
>     };
>   }
>   const { ad, fiyat, aralik } = sonuc.deger;
>
>   const db = await getTenantDb();
>   try {
>     await db.plan.create({
>       // tenantId OTURUMDAN gelir; tenant.ts uzantısı da zorla üzerine yazar.
>       data: {
>         tenantId: kullanici.tenantId,
>         name: ad,
>         price: fiyat,
>         interval: aralik,
>       },
>     });
>   } catch {
>     console.error("Plan eklenirken beklenmeyen hata.");
>     return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler };
>   }
>
>   revalidatePath("/planlar");
>   return { durum: "basarili", mesaj: `"${ad}" planı eklendi.` };
> }
>
> // Planı günceller. manager ve finance yapabilir.
> export async function planGuncelle(
>   _onceki: FormDurumu,
>   formData: FormData
> ): Promise<FormDurumu> {
>   await requireUser();
>   const degerler = formDegerleri(formData);
>
>   const kimlik = kimlikDogrula(formData.get("id"));
>   if (!kimlik.ok) {
>     return { durum: "hata", mesaj: MESAJ.bulunamadi, degerler };
>   }
>
>   const sonuc = planGirdisiniDogrula(degerler);
>   if (!sonuc.ok) {
>     return {
>       durum: "hata",
>       mesaj: MESAJ.formHatali,
>       alanHatalari: sonuc.alanHatalari,
>       degerler,
>     };
>   }
>   const { ad, fiyat, aralik } = sonuc.deger;
>
>   const db = await getTenantDb();
>   const mevcut = await db.plan.findFirst({
>     where: { id: kimlik.deger },
>     select: { price: true, interval: true },
>   });
>   if (!mevcut) {
>     return { durum: "hata", mesaj: MESAJ.bulunamadi, degerler };
>   }
>
>   // Fiyat veya aralık değişiyorsa aktif abonelik kontrolü yapılır.
>   const fiyatVeyaAralikDegisti =
>     mevcut.price !== fiyat || mevcut.interval !== aralik;
>   if (
>     fiyatVeyaAralikDegisti &&
>     (await aktifAbonelikVarMi({ planId: kimlik.deger }))
>   ) {
>     return { durum: "hata", mesaj: KILITLI_MESAJ, degerler };
>   }
>
>   try {
>     const sonucSatir = await db.plan.updateMany({
>       where: { id: kimlik.deger },
>       data: { name: ad, price: fiyat, interval: aralik },
>     });
>     if (sonucSatir.count === 0) {
>       return { durum: "hata", mesaj: MESAJ.bulunamadi, degerler };
>     }
>   } catch {
>     console.error("Plan güncellenirken beklenmeyen hata.");
>     return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler };
>   }
>
>   revalidatePath("/planlar");
>   revalidatePath(`/planlar/${kimlik.deger}`);
>   return {
>     durum: "basarili",
>     mesaj: "Değişiklikler kaydedildi.",
>     degerler: { ad, fiyat: String(fiyat), aralik },
>   };
> }
>
> // Planı pasife alır. YALNIZCA manager yapabilir. Geri alınamaz.
> export async function planPasifeAl(
>   _onceki: FormDurumu,
>   formData: FormData
> ): Promise<FormDurumu> {
>   // Sunucu tarafı yetki kontrolü: finance kullanıcısı için null döner.
>   const yonetici = await requireManager();
>   if (!yonetici) {
>     return { durum: "hata", mesaj: MESAJ.yetkiYok };
>   }
>
>   const kimlik = kimlikDogrula(formData.get("id"));
>   if (!kimlik.ok) {
>     return { durum: "hata", mesaj: MESAJ.bulunamadi };
>   }
>
>   const db = await getTenantDb();
>   const plan = await db.plan.findFirst({
>     where: { id: kimlik.deger },
>     select: { isActive: true },
>   });
>   if (!plan) {
>     return { durum: "hata", mesaj: MESAJ.bulunamadi };
>   }
>   if (!plan.isActive) {
>     return { durum: "hata", mesaj: "Bu plan zaten pasif." };
>   }
>
>   // Aktif aboneliği olan plan pasife alınamaz (bkz. src/lib/abonelik-kontrol.ts).
>   if (await aktifAbonelikVarMi({ planId: kimlik.deger })) {
>     return {
>       durum: "hata",
>       mesaj:
>         "Bu planın aktif abonelikleri var. Önce abonelikleri iptal edin, sonra planı pasife alın.",
>     };
>   }
>
>   try {
>     const sonucSatir = await db.plan.updateMany({
>       where: { id: kimlik.deger, isActive: true },
>       data: { isActive: false },
>     });
>     if (sonucSatir.count === 0) {
>       return { durum: "hata", mesaj: MESAJ.bulunamadi };
>     }
>   } catch {
>     console.error("Plan pasife alınırken beklenmeyen hata.");
>     return { durum: "hata", mesaj: MESAJ.beklenmeyen };
>   }
>
>   revalidatePath("/planlar");
>   revalidatePath(`/planlar/${kimlik.deger}`);
>   return { durum: "basarili", mesaj: "Plan pasife alındı." };
> }
> ```
>
> ### `src/app/(panel)/planlar/PlanFormu.tsx`: yeni dosya oluştur
>
> ```tsx
> "use client";
>
> // Plan ekleme ve düzenleme için ortak form.
> // kilitli: planın aktif abonelikleri varsa fiyat ve aralık salt okunur gösterilir.
> // Bu yalnızca kolaylıktır; asıl engel sunucudaki planGuncelle() içindedir.
>
> import { useActionState } from "react";
> import FormAlani from "@/components/ui/FormAlani";
> import Dugme from "@/components/ui/Dugme";
> import IslemMesaji from "@/components/ui/IslemMesaji";
> import { BASLANGIC_DURUMU } from "@/lib/islem";
> import { ARALIK_ETIKETI, PLAN_ARALIKLARI, type PlanAraligi } from "@/lib/validation";
> import { planEkle, planGuncelle } from "./actions";
>
> type Props =
>   | { mod: "ekle" }
>   | {
>       mod: "duzenle";
>       plan: { id: string; ad: string; fiyat: string; aralik: PlanAraligi };
>       kilitli: boolean;
>     };
>
> export default function PlanFormu(props: Props) {
>   const islem = props.mod === "ekle" ? planEkle : planGuncelle;
>   const [durum, formIslemi, bekliyor] = useActionState(islem, BASLANGIC_DURUMU);
>
>   const kilitli = props.mod === "duzenle" && props.kilitli;
>   const ilk =
>     props.mod === "duzenle"
>       ? { ad: props.plan.ad, fiyat: props.plan.fiyat, aralik: props.plan.aralik }
>       : { ad: "", fiyat: "", aralik: "MONTHLY" };
>
>   const deger = (alan: "ad" | "fiyat" | "aralik") =>
>     durum.degerler?.[alan] ?? ilk[alan];
>
>   const aralikHatasi = durum.alanHatalari?.aralik;
>   const aralikCerceve = aralikHatasi
>     ? "border-red-400 focus:border-red-500 focus:ring-red-200"
>     : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200";
>
>   return (
>     <form action={formIslemi} noValidate className="space-y-4">
>       {props.mod === "duzenle" && (
>         <input type="hidden" name="id" value={props.plan.id} />
>       )}
>
>       <div className="grid gap-4 sm:grid-cols-3">
>         <FormAlani
>           etiket="Plan adı"
>           name="ad"
>           defaultValue={deger("ad")}
>           hata={durum.alanHatalari?.ad}
>           maxLength={100}
>           autoComplete="off"
>         />
>
>         {/* type="text": tarayıcı eksi veya ondalıklı değeri silmesin, kontrolü sunucu yapsın */}
>         <FormAlani
>           etiket="Fiyat (TL)"
>           name="fiyat"
>           type="text"
>           inputMode="numeric"
>           defaultValue={deger("fiyat")}
>           hata={durum.alanHatalari?.fiyat}
>           readOnly={kilitli}
>           yardim={
>             kilitli
>               ? "Aktif abonelikler olduğu için değiştirilemez."
>               : "Tam sayı, kuruş yok (ör. 1000)."
>           }
>           autoComplete="off"
>         />
>
>         <div className="space-y-1.5">
>           <label htmlFor="aralik" className="block text-sm font-medium text-slate-700">
>             Aralık
>           </label>
>           <select
>             id="aralik"
>             name="aralik"
>             defaultValue={deger("aralik")}
>             disabled={kilitli}
>             aria-invalid={aralikHatasi ? true : undefined}
>             aria-describedby={aralikHatasi ? "aralik-hata" : undefined}
>             className={`block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 ${aralikCerceve}`}
>           >
>             {PLAN_ARALIKLARI.map((aralik) => (
>               <option key={aralik} value={aralik}>
>                 {ARALIK_ETIKETI[aralik]}
>               </option>
>             ))}
>           </select>
>           {/* Devre dışı alanlar forma eklenmez; kilitliyken değer gizli alanla gönderilir. */}
>           {kilitli && <input type="hidden" name="aralik" value={deger("aralik")} />}
>           {aralikHatasi && (
>             <p id="aralik-hata" role="alert" className="text-sm text-red-600">
>               {aralikHatasi}
>             </p>
>           )}
>         </div>
>       </div>
>
>       <IslemMesaji durum={durum} />
>
>       <Dugme type="submit" disabled={bekliyor}>
>         {bekliyor
>           ? "Kaydediliyor..."
>           : props.mod === "ekle"
>             ? "Plan ekle"
>             : "Değişiklikleri kaydet"}
>       </Dugme>
>     </form>
>   );
> }
> ```
>
> ### `src/app/(panel)/planlar/PasifeAlDugmesi.tsx`: yeni dosya oluştur
>
> ```tsx
> "use client";
>
> // Planı pasife alma düğmesi. Yalnızca manager'a gösterilir.
> // Asıl yetki kontrolü sunucuda, planPasifeAl() içinde yapılır.
>
> import { useActionState } from "react";
> import Dugme from "@/components/ui/Dugme";
> import IslemMesaji from "@/components/ui/IslemMesaji";
> import { BASLANGIC_DURUMU } from "@/lib/islem";
> import { planPasifeAl } from "./actions";
>
> type Props = { id: string; ad: string; aktif: boolean };
>
> export default function PasifeAlDugmesi({ id, ad, aktif }: Props) {
>   const [durum, formIslemi, bekliyor] = useActionState(
>     planPasifeAl,
>     BASLANGIC_DURUMU
>   );
>
>   return (
>     <div className="space-y-3">
>       {aktif ? (
>         <>
>           <p className="text-sm text-slate-600">
>             Pasife alınan plan varsayılan listede görünmez. Kayıt silinmez,
>             ancak geri aktifleştirilemez.
>           </p>
>           <form
>             action={formIslemi}
>             onSubmit={(olay) => {
>               if (!window.confirm(`"${ad}" planı pasife alınsın mı? Bu işlem geri alınamaz.`)) {
>                 olay.preventDefault();
>               }
>             }}
>           >
>             <input type="hidden" name="id" value={id} />
>             <Dugme type="submit" gorunum="tehlike" disabled={bekliyor}>
>               {bekliyor ? "İşleniyor..." : "Pasife al"}
>             </Dugme>
>           </form>
>         </>
>       ) : (
>         <p className="text-sm text-slate-600">Bu plan pasif durumda.</p>
>       )}
>
>       <IslemMesaji durum={durum} />
>     </div>
>   );
> }
> ```
>
> ### `src/app/(panel)/planlar/page.tsx`: dosyanın içeriğini tamamen şununla değiştir
>
> ```tsx
> import Link from "next/link";
> import { requireUser } from "@/lib/auth";
> import { getTenantDb } from "@/lib/tenant";
> import { ARALIK_ETIKETI } from "@/lib/validation";
> import SayfaBasligi from "@/components/ui/SayfaBasligi";
> import BosDurum from "@/components/ui/BosDurum";
> import Rozet from "@/components/ui/Rozet";
> import PlanFormu from "./PlanFormu";
>
> // Plan listesi ve yeni plan formu. manager ve finance görebilir.
>
> type SayfaProps = {
>   searchParams: Promise<{ pasif?: string | string[] }>;
> };
>
> // 12500 -> "12.500 TL"
> function tlBicimle(tutar: number): string {
>   return `${new Intl.NumberFormat("tr-TR").format(tutar)} TL`;
> }
>
> export default async function PlanlarSayfasi({ searchParams }: SayfaProps) {
>   await requireUser();
>   const { pasif } = await searchParams;
>   const pasifleriGoster = pasif === "1";
>
>   const db = await getTenantDb();
>   const planlar = await db.plan.findMany({
>     where: pasifleriGoster ? {} : { isActive: true },
>     orderBy: [{ isActive: "desc" }, { name: "asc" }],
>     select: { id: true, name: true, price: true, interval: true, isActive: true },
>   });
>
>   return (
>     <div className="space-y-8">
>       <SayfaBasligi
>         baslik="Planlar"
>         aciklama="Müşterilerinize sunduğunuz abonelik planları."
>       />
>
>       <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
>         <h2 className="text-base font-semibold text-slate-900">Yeni plan</h2>
>         <div className="mt-4">
>           <PlanFormu mod="ekle" />
>         </div>
>       </section>
>
>       <section className="space-y-4">
>         <div className="flex items-center justify-between gap-3">
>           <h2 className="text-base font-semibold text-slate-900">
>             Plan listesi ({planlar.length})
>           </h2>
>           <Link
>             href={pasifleriGoster ? "/planlar" : "/planlar?pasif=1"}
>             className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
>           >
>             {pasifleriGoster ? "Pasifleri gizle" : "Pasifleri göster"}
>           </Link>
>         </div>
>
>         {planlar.length === 0 ? (
>           <BosDurum
>             baslik="Henüz plan yok"
>             aciklama={
>               pasifleriGoster
>                 ? "Bu firmada kayıtlı plan bulunmuyor."
>                 : "Yukarıdaki formdan ilk planınızı ekleyin."
>             }
>           />
>         ) : (
>           <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
>             <table className="min-w-full divide-y divide-slate-200 text-sm">
>               <thead className="bg-slate-50 text-left text-slate-600">
>                 <tr>
>                   <th className="px-4 py-3 font-medium">Ad</th>
>                   <th className="px-4 py-3 font-medium">Fiyat</th>
>                   <th className="px-4 py-3 font-medium">Aralık</th>
>                   <th className="px-4 py-3 font-medium">Durum</th>
>                   <th className="px-4 py-3">
>                     <span className="sr-only">İşlemler</span>
>                   </th>
>                 </tr>
>               </thead>
>               <tbody className="divide-y divide-slate-100">
>                 {planlar.map((plan) => (
>                   <tr key={plan.id}>
>                     <td className="px-4 py-3 font-medium text-slate-900">
>                       {plan.name}
>                     </td>
>                     <td className="px-4 py-3 text-slate-600">
>                       {tlBicimle(plan.price)}
>                     </td>
>                     <td className="px-4 py-3 text-slate-600">
>                       {ARALIK_ETIKETI[plan.interval]}
>                     </td>
>                     <td className="px-4 py-3">
>                       <Rozet ton={plan.isActive ? "indigo" : "gri"}>
>                         {plan.isActive ? "Aktif" : "Pasif"}
>                       </Rozet>
>                     </td>
>                     <td className="px-4 py-3 text-right">
>                       <Link
>                         href={`/planlar/${plan.id}`}
>                         className="font-medium text-indigo-600 hover:text-indigo-700"
>                       >
>                         Düzenle
>                       </Link>
>                     </td>
>                   </tr>
>                 ))}
>               </tbody>
>             </table>
>           </div>
>         )}
>       </section>
>     </div>
>   );
> }
> ```
>
> ### `src/app/(panel)/planlar/[id]/page.tsx`: yeni dosya oluştur
>
> ```tsx
> import Link from "next/link";
> import { notFound } from "next/navigation";
> import { requireUser } from "@/lib/auth";
> import { getTenantDb } from "@/lib/tenant";
> import { kimlikDogrula } from "@/lib/validation";
> import { aktifAbonelikVarMi } from "@/lib/abonelik-kontrol";
> import SayfaBasligi from "@/components/ui/SayfaBasligi";
> import Rozet from "@/components/ui/Rozet";
> import PlanFormu from "../PlanFormu";
> import PasifeAlDugmesi from "../PasifeAlDugmesi";
>
> // Plan düzenleme sayfası.
> // Kayıt yoksa ya da başka firmaya aitse aynı cevap verilir: "bulunamadı" (404).
>
> type SayfaProps = { params: Promise<{ id: string }> };
>
> export default async function PlanDuzenleSayfasi({ params }: SayfaProps) {
>   const kullanici = await requireUser();
>   const { id } = await params;
>
>   const kimlik = kimlikDogrula(id);
>   if (!kimlik.ok) notFound();
>
>   const db = await getTenantDb();
>   const plan = await db.plan.findFirst({
>     where: { id: kimlik.deger },
>     select: { id: true, name: true, price: true, interval: true, isActive: true },
>   });
>   if (!plan) notFound();
>
>   // Aktif abonelik varsa fiyat ve aralık alanları salt okunur gösterilir.
>   const kilitli = await aktifAbonelikVarMi({ planId: plan.id });
>   const yonetici = kullanici.role === "manager";
>
>   return (
>     <div className="space-y-8">
>       <Link
>         href="/planlar"
>         className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
>       >
>         ← Planlara dön
>       </Link>
>
>       <div className="space-y-2">
>         <SayfaBasligi baslik={plan.name} aciklama="Plan bilgilerini düzenleyin." />
>         {!plan.isActive && <Rozet ton="gri">Pasif</Rozet>}
>       </div>
>
>       <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
>         <h2 className="text-base font-semibold text-slate-900">Bilgiler</h2>
>         <div className="mt-4">
>           <PlanFormu
>             mod="duzenle"
>             plan={{
>               id: plan.id,
>               ad: plan.name,
>               fiyat: String(plan.price),
>               aralik: plan.interval,
>             }}
>             kilitli={kilitli}
>           />
>         </div>
>       </section>
>
>       <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
>         <h2 className="text-base font-semibold text-slate-900">Pasife alma</h2>
>         <div className="mt-4">
>           {yonetici ? (
>             <PasifeAlDugmesi id={plan.id} ad={plan.name} aktif={plan.isActive} />
>           ) : (
>             <p className="text-sm text-slate-600">
>               Pasife alma yalnızca firma yöneticisi tarafından yapılabilir.
>             </p>
>           )}
>         </div>
>       </section>
>     </div>
>   );
> }
> ```
>
> ### `src/app/(panel)/not-found.tsx`: yeni dosya oluştur
>
> ```tsx
> import Link from "next/link";
> import BosDurum from "@/components/ui/BosDurum";
>
> // Panel içinde notFound() çağrıldığında gösterilir (ör. başka firmanın kaydı).
> // Kaydın var olup olmadığı veya kime ait olduğu hakkında bilgi verilmez.
> export default function KayitBulunamadi() {
>   return (
>     <div className="space-y-4">
>       <BosDurum
>         baslik="Kayıt bulunamadı"
>         aciklama="Aradığınız kayıt bulunamadı. Bağlantı hatalı olabilir."
>       />
>       <Link
>         href="/dashboard"
>         className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
>       >
>         ← Dashboard'a dön
>       </Link>
>     </div>
>   );
> }
> ```
>
> ---
>
> ## Adım 5 • Kontrol ve çalıştırma
>
> TypeScript tür hatalarını, dosya üretmeden kontrol eder:
> ```
> npx tsc --noEmit
> ```
>
> Kod kurallarını (ESLint) kontrol eder:
> ```
> npm run lint
> ```
>
> Render'ın yapacağı derlemeyi yerelde dener. Canlıda kırılmayı önceden yakalar.
> ```
> npm run build
> ```
>
> Geliştirme sunucusunu başlatır. Tarayıcıda `http://localhost:3000/musteriler` adresini aç.
> ```
> npm run dev
> ```
>
> Herhangi bir adımda hata çıkarsa hata mesajının tamamını gönder.
>
> ---
>
> ## Adım 6 • Elle test senaryoları
>
> **1. Finance pasife almayı denerse.** İkinci kullanıcı Gün 6'da gelecek. Şimdilik mantığı kodda okuyoruz, iki katmanlı:
> - **Arayüz:** `[id]/page.tsx` içinde `yonetici` false ise düğme hiç çizilmez, yerine bilgi metni çıkar.
> - **Sunucu:** `musteriPasifeAl` ve `planPasifeAl` işlemlerinin ilk satırı `requireManager()`. Sonuç `null` ise veritabanına hiç gidilmeden "Bu işlemi yalnızca firma yöneticisi yapabilir." döner. Düğme biri tarafından elle gönderilse bile kayıt değişmez.
> - **Gün 6'da beklenen:** finance olarak düzenleme sayfasında düğme görünmez. Ekleme ve düzenleme çalışır.
>
> **2. Aynı e-posta ile iki müşteri.**
> - "Ayşe Demir" adıyla ve `ayse@ornek.com` e-postasıyla müşteri ekle. Beklenen: başarılı.
> - "Ayşe D." adıyla ve ` AYSE@ornek.com ` e-postasıyla (büyük harfli, başında ve sonunda boşluk) ekle. Beklenen: e-posta alanında "Bu e-posta adresi başka bir müşteride kayıtlı" hatası, yazdıkların formda kalır.
> - Başka bir müşteriyi düzenleyip e-postasını `ayse@ornek.com` yap. Beklenen: aynı hata.
> - E-postası boş iki müşteri ekle. Beklenen: ikisi de başarılı.
> - İlk müşteriyi pasife al, sonra aynı e-postayla yeni müşteri eklemeyi dene. Beklenen: yine hata, çünkü kural pasif müşterileri de kapsar.
>
> **3. Negatif ve hatalı fiyat.** Plan eklerken fiyat alanına sırayla şunları yaz:
>
> | Girdi | Beklenen mesaj |
> |---|---|
> | `-100` | Fiyat 0'dan büyük olmalıdır. |
> | `0` | Fiyat 0'dan büyük olmalıdır. |
> | `12,5` veya `1.000` | Nokta veya virgül kullanmadan tam sayı yazın. |
> | `abc` | Fiyat yalnızca rakamlardan oluşmalıdır. |
> | `20000000` | Fiyat en fazla 10.000.000 TL olabilir. |
> | `1000` | Başarılı, listede "1.000 TL" görünür. |
>
> ---
>
> ## Adım 7 • Tenant izolasyonu: üç test
>
> Önce gizli bir pencere aç (Safari ve Chrome'da Cmd+Shift+N). O pencerede sahte bilgilerle **Firma B** kaydı oluştur. Normal penceren **Firma A** olarak kalsın. İki pencere ayrı oturum taşır.
>
> **Test 1: URL ile başka firmanın kaydına erişim.**
> - Firma A'da bir müşterinin düzenleme sayfasını aç ve adres çubuğundaki adresi kopyala (`/musteriler/<id>`).
> - Gizli pencerede (Firma B) bu adresi aç. Beklenen: "Kayıt bulunamadı" sayfası.
> - Aynısını bir plan için tekrarla.
>
> **Test 2: Formu değiştirip başka firmanın kaydını güncellemeye çalışmak.**
> - Firma B'de kendi müşterinin düzenleme sayfasını aç.
> - Geliştirici araçlarını aç (Chrome: Cmd+Option+I; Safari'de önce Ayarlar > Gelişmiş > "Web geliştirici özelliklerini göster"). Elements sekmesinde `name="id"` olan gizli alanı bul, değerini Firma A'daki müşterinin id'siyle değiştir.
> - Ad alanına "DEĞİŞTİRİLDİ" yazıp kaydet. Beklenen: "Kayıt bulunamadı."
> - Firma A penceresinde sayfayı yenile (Cmd+R). Beklenen: müşteri aynen duruyor.
>
> **Test 3: Liste ve e-posta ayrımı.**
> - Firma B'nin müşteri listesinde Firma A'nın müşterileri görünmemeli.
> - Firma B'de `ayse@ornek.com` e-postasıyla müşteri ekle. Beklenen: başarılı. Benzersizlik kuralı firma bazındadır ve "bu e-posta başka firmada var" bilgisi sızmaz.
>
> ---
>
> ## Adım 8 • Commit
>
> Değişen ve yeni dosyaları listeler. `.env` listede **olmamalı**.
> ```
> git status
> ```
>
> Repoya Neon adresi veya parola girmediğini kontrol eder. Çıktı boş olmalı.
> ```
> git grep -n -e "neon.tech" -e "npg_"
> ```
>
> Bütün değişiklikleri commit'e hazırlar:
> ```
> git add -A
> ```
>
> Commit'i oluşturur:
> ```
> git commit -m "feat: müşteri ve plan yönetimi"
> ```
>
> GitHub'a gönderir. Render buradan otomatik yayına alır.
> ```
> git push
> ```
>
> ---
>
> ## Bitiş kontrolü
>
> - [ ] Müşteri ve plan ekleniyor, düzenleniyor, pasife alınıyor (Adım 6)
> - [ ] Finance rolüyle pasife alma engelleniyor: her iki `PasifeAl` işleminin ilk satırında `requireManager()` var
> - [ ] Sunucu tarafı yetki kontrolü var: düğme gizleme yalnızca arayüzde, engel işlemin içinde
> - [ ] Tenant izolasyonu üç testten geçti (Adım 7)
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **Canlı veritabanı:** Yerelde `migrate deploy` hangi Neon veritabanına bağlıysa migration oraya uygulanır. Canlı site aynı veritabanını kullanıyorsa ek bir şey gerekmez. Ayrı bir canlı veritabanın varsa, önceki günlerde migration'ı canlıya nasıl uyguladıysan aynı yolu izle. Render'daki derleme komutunda `migrate deploy` var mı, bilmiyorum.
> - **Form sıfırlama:** React 19, işlem bittikten sonra formu kendiliğinden sıfırlar. Hata durumunda değerlerin korunmasını, `degerler` alanını `defaultValue` olarak geri vererek sağladım. Hata sonrasında yazdıkların silinirse bana söyle, farklı bir yönteme geçeriz.
> - **Not found sayfası:** `(panel)/not-found.tsx` dosyasının `notFound()` çağrılarında kullanılacağını varsayıyorum. Kullanılmazsa Next'in varsayılan 404 sayfası çıkar; güvenlik açısından fark yok.
> - **Rozet tonları:** `Rozet` bileşeninde yalnızca `"indigo"` ve `"gri"` tonlarını gördüğüm için Aktif ve Pasif için bunları kullandım. `SayfaBasligi` ve `BosDurum` için de yalnızca senin kodunda gördüğüm özellikleri kullandım.
> - **Ad uzunluğu:** Müşteri ve plan adları kayıt formuyla tutarlı olsun diye en az 2, en çok 100 karakter. Planda 1 yazmıştım.
> - **Kısa yarış penceresi:** Pasife alma ve plan fiyatı kilidi "önce kontrol, sonra güncelleme" şeklinde iki adımdır. Abonelik başlatmayla aynı anda olursa küçük bir pencere kalır. Bu Gün 5'te kapanacak, notu `abonelik-kontrol.ts` dosyasına yazdım.
> - **Elle eklenen dizin:** `subscriptions_one_active_per_customer` bu migration'da da `DROP INDEX` olarak çıkabilir. Silmeyi unutma, `grep` adımı bunun için.


## Ana sohbet: Gün 4 uygulaması

_Kod bu sohbette adım adım uygulatıldı._

### Prompt 1 · 21 Eki 2026 07:07

````text
günaydın gün 4 e geçebiliriz ne yapmam gerektiğini adım adım anlat konudan sapma
````

### Claude cevabı 1 · 21 Eki 2026 07:08

> Günaydın! Gün 4 müşteri ve plan yönetimi (issue #3). Önce hazırlık, sonra planı yazacağım. Sen onaylamadan kod yazmayacağım.
>
> ## Adım 1: Projeyi güncelle ve branch aç
> Terminalde sırayla:
>
> 1. Proje klasörüne geç:
>    ```
>    cd ~/Projeler/abonetakip
>    ```
> 2. `main`'e geç:
>    ```
>    git switch main
>    ```
> 3. GitHub'daki son halini indir:
>    ```
>    git pull
>    ```
> 4. Gün 4 için yeni branch aç:
>    ```
>    git switch -c feat/gun-04-musteri-plan
>    ```
>
> ## Adım 2: Gün 4'ün planını göster
> Gün 4'ü, daha önce hazırladığımız 14 günlük plana göre yapacağım, konudan sapmamak için. O dosyadan Gün 4 bölümünü çıktıya ver:
>
> ```
> sed -n '/^## Gün 4/,/^## Gün 5/p' docs/04_14_Gunluk_Prompt_Plani.md
> ```
>
> Çıktıyı yapıştır. Gizli bilgi içermiyor. Çıktıya göre Gün 4'ün planını (etkilenen tablolar, sayfalar, rol kuralları, veri akışı) yazıp onayına sunacağım.

### Prompt 2 · 21 Eki 2026 07:10

````text
yeni sohbete yazacağım gün 4 promptunu onun öncesinde bir şey yazmam gerekiyor mu
````

### Claude cevabı 2 · 21 Eki 2026 07:10

> Evet, yeni sohbet bu sohbette konuştuklarımızı bilmez. Başlamadan önce üç şeye dikkat et:
>
> 1. **Yeni sohbeti aynı Project'in içinde aç.** Böylece `CLAUDE.md` kuralları (Türkçe, adım adım, plan önce) otomatik gelir.
> 2. **İlk mesajına, Gün 4 promptundan önce şu durum özetini ekle:**
>    ```
>    Durum: Gün 1-3 ve arayüz katmanı tamamlandı, main'de ve canlıda (abonetakip.onrender.com).
>    Yığın: Next.js 16.4.2 (App Router), Prisma 7.10.1 (driver adapter), Neon, Tailwind 4.
>    Oturum: imzalı çerez. requireUser(), requireManager() (finance için null döner) ve getTenantDb() (src/lib/tenant.ts, tenantId'yi otomatik ekler; ham prisma yalnızca db.ts, auth.ts, tenant.ts içinde kullanılır) hazır.
>    Arayüz bileşenleri: src/components/ui altında Dugme, Kart, FormAlani, SayfaBasligi, BosDurum, Rozet. Kenar menülü panel, sayfalar (panel) klasöründe.
>    musteriler ve planlar sayfaları şu an yer tutucu.
>    Bugün Gün 4: müşteri ve plan yönetimi. Önce plan yaz, onayımı bekle.
>    ```
> 3. **Şu iki dosyanın içeriğini de mesaja ekle** (gizli bilgi yok), çünkü yeni sohbet veri modelini bilmiyor:
>    ```
>    cat prisma/schema.prisma
>    ```
>    ```
>    cat src/lib/tenant.ts
>    ```
>
> `.env` içeriğini ya da bağlantı adreslerini yapıştırma.
>
> Daha kolay yol: bu sohbette devam et. Kodu zaten ben yazdım, dosya yapısını, alan adlarını ve kuralları biliyorum, bu yüzden özet ve dosya yapıştırmana gerek kalmaz. Ben yeni sohbette kaybolacak bağlamı korurum. Karar senin. Bu sohbette devam edeceksen, önceki mesajımdaki Adım 2'nin çıktısını yapıştır.

### Prompt 3 · 21 Eki 2026 07:17

````text
en son yazdığına ne cevap vereyim
````

_[yapıştırılan metin]_

````text
# Gün 4 Planı: Müşteri ve plan yönetimi

Kod yazmadan önce planı ve senin karar vermen gereken birkaç noktayı aşağıya yazdım. Onay verdiğinde dosyaları tam yollarıyla yazacağım.

## 1. Etkilenen tablolar

| Tablo | İşlem |
|---|---|
| `customers` | okuma, ekleme, güncelleme, pasife alma (`isActive=false`) |
| `plans` | okuma, ekleme, güncelleme, pasife alma |
| `subscriptions` | yalnızca **sayma**: pasife almadan önce aktif abonelik var mı diye bakılır |

`tenants`, `users` ve `subscription_events` tablolarına dokunulmaz. Şema değişikliği olup olmayacağı aşağıdaki 1. karara bağlı.

## 2. Dosyalar

Müşteriler ve planlar aynı yapıyı kullanır. Aşağıdaki yollar müşteriler içindir, planlar için aynı dosyalar `planlar` klasöründe olur.

| Dosya | Durum | Görevi |
|---|---|---|
| `src/lib/dogrulama.ts` | yeni | Saf doğrulama fonksiyonları: ad, e-posta, fiyat, aralık. Paket kullanılmaz, Türkçe hata mesajı döner. |
| `src/lib/abonelik-kontrol.ts` | yeni | `aktifAbonelikVarMi()`: pasife alma kontrolünün yapıldığı tek yer (aşağıdaki 3. karara bak). |
| `src/app/(panel)/musteriler/actions.ts` | yeni | Sunucu işlemleri (`"use server"`): `musteriEkle`, `musteriGuncelle`, `musteriPasifeAl` |
| `src/app/(panel)/musteriler/page.tsx` | değişir | Liste ve ekleme formu, "pasifleri göster" seçeneği (`?pasif=1`). Sunucu bileşenidir. |
| `src/app/(panel)/musteriler/MusteriFormu.tsx` | yeni | İstemci bileşeni. Ekleme ve düzenleme için ortak form, başarı ve hata mesajlarını gösterir. |
| `src/app/(panel)/musteriler/PasifeAlDugmesi.tsx` | yeni | Onay sorar, sonucu mesaj olarak gösterir. Yalnızca manager'a görünür. |
| `src/app/(panel)/musteriler/[id]/page.tsx` | yeni | Düzenleme sayfası. Kayıt bulunamazsa `notFound()` çağrılır. |
| `src/app/(panel)/not-found.tsx` | yeni | Türkçe "Kayıt bulunamadı" sayfası. |

Toplam 13 dosya: 2 ortak dosya, her iki modül için 5'er dosya ve 1 bulunamadı sayfası.

## 3. Veri akışı

**Listeleme**
1. `page.tsx` önce `getTenantDb()` çağırır.
2. Ardından `customer.findMany` çalışır. `?pasif=1` yoksa sorguya `isActive: true` eklenir.
3. Kiracı filtresi otomatik eklenir. `?pasif` yalnızca görünüm filtresidir, kiracıyla ilgisi yoktur.

**Ekleme ve düzenleme**
1. Form sunucu işlemine gönderilir.
2. `requireUser()` çağrılır.
3. Sunucuda doğrulama yapılır. Hata varsa alan bazında Türkçe mesaj döner.
4. `getTenantDb()` alınır.
5. Ekleme için `create` çalışır, `tenantId` uzantı tarafından zorla yazılır.
6. Düzenleme için `updateMany({ where: { id } })` çalışır. Sonuç 0 satırsa "Kayıt bulunamadı." döner.
7. `revalidatePath()` çağrılır ve başarı mesajı gösterilir.

**Pasife alma**
1. `requireManager()` çağrılır. Sonuç `null` ise "Bu işlemi yalnızca firma yöneticisi yapabilir." döner.
2. Kayıt `findFirst({ where: { id } })` ile aranır. Yoksa "bulunamadı" döner.
3. `aktifAbonelikVarMi()` kontrol edilir. Aktif abonelik varsa "Bu müşterinin aktif aboneliği var, önce aboneliği iptal edin." mesajı döner.
4. `updateMany({ isActive: false })` çalışır ve başarı mesajı gösterilir.

**Önemli:** Sunucu işlemleri dışarıdan doğrudan çağrılabilen uç noktalardır. Bu yüzden yetki kontrolü sayfada değil, her işlemin **kendi içinde** yapılır. Düğmeyi gizlemek yalnızca arayüz kolaylığıdır.

**Neden `updateMany`?** Başka firmanın id'si gönderilirse kiracı filtresi yüzünden 0 satır eşleşir. Bunu hata fırlatmadan "bulunamadı" olarak yakalarız. Düz `update` ise bu durumda P2025 hatası fırlatır.

## 4. Yetki tablosu

| İşlem | manager | finance | Kontrol yeri |
|---|---|---|---|
| Listeleme ve pasifleri gösterme | ✅ | ✅ | `getTenantDb()` |
| Ekleme | ✅ | ✅ | `requireUser()` (işlem içinde) |
| Düzenleme | ✅ | ✅ | `requireUser()` (işlem içinde) |
| Pasife alma | ✅ | ❌ | `requireManager()` (işlem içinde) ve düğme gizlenir |
| Başka firmanın kaydı | ❌ | ❌ | Kiracı uzantısı, "bulunamadı" döner |

## 5. Doğrulama kuralları

- **Ad:** baştaki ve sondaki boşluklar kırpılır, 1 ile 100 karakter arası olmalı.
- **E-posta:** kırpılır ve küçük harfe çevrilir, basit biçim kontrolünden geçer.
- **Fiyat:** sayı olmalı, tam sayı olmalı (`12.5` reddedilir), 0'dan büyük olmalı ve en fazla 10.000.000 TL olabilir. Üst sınır, veritabanındaki `Int` sütununun taşmasını önlemek içindir.
- **Aralık:** yalnızca `MONTHLY` veya `YEARLY` kabul edilir. Formdan gelen başka bir değer reddedilir.

## 6. Senin karar vermen gerekenler

1. **Aynı e-posta ile iki müşteri.** Önerim: aynı firmada aynı e-posta yasak olsun, büyük ve küçük harf fark etmesin. Farklı firmalarda aynı e-posta serbest kalsın. Bunu sağlamanın en sağlam yolu veritabanına `@@unique([tenantId, email])` eklemektir. Bu bir migration gerektirir; `--create-only` ile çalıştırıp `DROP INDEX` satırını kontrol ederiz. Uygulama içinde ayrıca kontrol ederek anlaşılır bir mesaj veririz. Alternatif olarak yalnızca uygulama içinde kontrol edebiliriz. Bu migration gerektirmez ama iki eşzamanlı istekte nadiren çift kayıt oluşabilir. Hangisini seçiyorsun?
2. **E-posta zorunlu mu?** Şemada isteğe bağlı (`String?`). Görevde "ad, e-posta" yazıyor. Önerim: isteğe bağlı kalsın, girilirse doğrulansın.
3. **Aktif abonelik kontrolü.** `subscriptions` tablosu şemada zaten var. Bu yüzden `aktifAbonelikVarMi()` fonksiyonunu şimdiden gerçek bir `count` sorgusuyla yazmayı öneriyorum; şu an her zaman 0 döner. Gün 5'te dokunmaya gerek kalmaz. Ayrıca Gün 5'e not düşeceğim: abonelik başlatırken müşterinin ve planın aktif olup olmadığı da kontrol edilmeli. Aksi halde pasife alma ile abonelik başlatma aynı anda olursa kural delinebilir. Onaylıyor musun, yoksa yalnızca yorum mu bırakayım?
4. **Plan fiyatı değişince MRR değişir.** MRR, planın *şu anki* fiyatından hesaplanıyor. Aktif abonelikleri olan bir planın fiyatı düzenlenirse geçmiş ve şimdiki MRR birden değişir. Seçenekler:
   - (a) Aktif aboneliği olan planda fiyat ve aralık değişikliği engellensin, ad değişikliği serbest kalsın. Bu benim önerim.
   - (b) Serbest bırakılsın.
   - (c) Abonelik kaydına fiyat kopyası eklensin. Bu bir şema değişikliğidir ve kapsamı büyütür.
5. **Pasif kaydı geri aktifleştirme** olsun mu? Görevde yok. Önerim: yok. Gerekirse ileride manager'a özel olarak eklenir.

## 7. Senden görmem gerekenler

Mevcut yapıya uymak için şu dosyaların içeriğini görmem gerekiyor. Komutları Terminal'de tek tek çalıştır.

Oturum fonksiyonlarının imzalarını görmek için:
```
cat src/lib/auth.ts
```
Form alanı bileşeninin özelliklerini görmek için:
```
cat src/components/ui/FormAlani.tsx
```
Düğme bileşeninin özelliklerini görmek için:
```
cat src/components/ui/Dugme.tsx
```
Mevcut yer tutucu sayfanın yapısını görmek için:
```
cat "src/app/(panel)/musteriler/page.tsx"
```
Panel düzenini görmek için. Dosya bu yolda değilse hata verir, sorun değil:
```
cat "src/app/(panel)/layout.tsx"
```
Kurulu paketleri görmek için. Doğrulama kütüphanesi olarak zod var mı, test aracı var mı, ona bakacağım:
```
cat package.json
```

Bu komutların hiçbiri `.env` içeriğini göstermez.

## Varsayımlar ve emin olmadığım yerler

- `requireManager()` fonksiyonunun giriş yapılmamışsa yönlendirdiğini, finance kullanıcısı için `null` döndüğünü varsayıyorum. `auth.ts` dosyasında doğrulayacağım.
- Next.js 16'da sayfa bileşenlerinin `params` ve `searchParams` değerlerinin Promise olarak geldiğini ve formlar için React 19'un `useActionState` kancasını kullanacağımı varsayıyorum. 16.4.2 sürümünün ayrıntılarından tam emin değilim, `package.json` dosyasına bakınca netleştireceğim.
- Prisma 7'de `findUnique` sorgusuna benzersiz olmayan bir alan eklenebildiği için kiracı uzantısı sorunsuz çalışır. Yine de düzenleme sayfasında güvenli tarafta kalmak için `findFirst` kullanacağım.
- Pasif kayıtların düzenlenmesi serbest kalacak. Sayfalama ve arama eklenmeyecek, yeni paket eklenmeyecek.

Kararlarını (1 ile 5 arası) ve komut çıktılarını gönderdiğinde dosyaları yazmaya başlarım.
````

### Claude cevabı 3 · 21 Eki 2026 07:18

> Gelen plan genel olarak iyi: tablolar, yetki tablosu, "yetki kontrolü her işlemin kendi içinde" kuralı ve `updateMany` ile "bulunamadı" mantığı projemizin kurallarıyla uyumlu. Planda iki yerde düzeltme isteyeceğiz. Önce onları belirteyim, sonra yapıştıracağın cevabı vereyim.
>
> **İsteyeceğimiz iki düzeltme:**
> 1. Plan yeni bir `src/lib/dogrulama.ts` dosyası açmak istiyor. Bizde zaten `src/lib/validation.ts` var (`metinDogrula`, `epostaDogrula` gibi). Aynı işi yapan ikinci bir dosya açmak, "mevcut kod yapısına uy" kuralına aykırı. Mevcut dosya genişletilmeli.
> 2. `aktifAbonelikVarMi()` ham `prisma` yerine `getTenantDb()` kullanmalı. Ham `prisma` yalnızca `db.ts`, `auth.ts` ve `tenant.ts` içinde kullanılabilir. Ayrıca `tenant.ts` içindeki uzantının `count` işlemini desteklediği doğrulanmalı.
>
> **Beş karara önerim:**
> 1. **Aynı e-posta:** Veritabanında `@@unique([tenantId, email])` olsun, uygulama içinde de önceden kontrol edilsin. Migration'ı daha önce yaptığımız gibi `--create-only` ile çalıştırıp `DROP INDEX "subscriptions_one_active_per_customer"` satırını sileriz.
> 2. **E-posta:** İsteğe bağlı kalsın, girilirse doğrulansın.
> 3. **Aktif abonelik kontrolü:** Şimdiden gerçek `count` sorgusuyla yazılsın, Gün 5'e not düşülsün.
> 4. **Plan fiyatı:** (a) Aktif aboneliği olan planda fiyat ve aralık değişikliği engellensin, ad serbest olsun.
> 5. **Geri aktifleştirme:** Yok.
>
> ## Yapıştıracağın cevap
> ```
> Kararlarım:
> 1. Aynı firmada aynı e-posta yasak olsun, veritabanında @@unique([tenantId, email]) ekle. Uygulama içinde de önceden kontrol et. Migration'ı --create-only ile çalıştıracağız ve subscriptions_one_active_per_customer dizinini silen DROP INDEX satırı çıkarsa o satırı sileceğiz.
> 2. E-posta isteğe bağlı kalsın, girilirse doğrulansın.
> 3. aktifAbonelikVarMi() şimdiden gerçek count sorgusuyla yazılsın, ACTIVE durumunu saysın. Gün 5'e not düş.
> 4. (a): aktif aboneliği olan planda fiyat ve aralık değişikliği engellensin, ad serbest olsun.
> 5. Geri aktifleştirme olmasın.
>
> İki düzeltme:
> - src/lib/dogrulama.ts yeni dosya açma. Projede zaten src/lib/validation.ts var, doğrulamaları oraya ekle (mevcut kod yapısına uy).
> - aktifAbonelikVarMi() ham prisma yerine getTenantDb() kullansın. Ham prisma yalnızca db.ts, auth.ts ve tenant.ts içinde kullanılabilir. src/lib/tenant.ts içindeki uzantının count işlemini desteklediğini kontrol et.
>
> İstediğin dosyaların çıktıları aşağıda. Ek olarak validation.ts, tenant.ts ve prisma/schema.prisma içeriklerini de ekledim.
> ```
>
> ## Çıktıları topla
> Terminalde sırayla çalıştır ve hepsini aynı mesaja yapıştır. Hiçbiri `.env` içeriğini göstermez:
>
> ```
> cat src/lib/auth.ts
> ```
> ```
> cat src/components/ui/FormAlani.tsx
> ```
> ```
> cat src/components/ui/Dugme.tsx
> ```
> ```
> cat "src/app/(panel)/musteriler/page.tsx"
> ```
> ```
> cat "src/app/(panel)/layout.tsx"
> ```
> ```
> cat package.json
> ```
> ```
> cat src/lib/validation.ts
> ```
> ```
> cat src/lib/tenant.ts
> ```
> ```
> cat prisma/schema.prisma
> ```
>
> Yeni sohbette kod gelince bana getirirsen kontrol ederim. Bu sohbette devam etmeyi tercih edersen, plan metnini ve çıktıları buraya da yapıştırabilirsin.

### Prompt 4 · 21 Eki 2026 07:30

````text
ASLA AMA ASLA KONUDAN SAPMADAN BU PLANI BANA YAPTIRT
````

_[yapıştırılan metin]_

````text
Kararlarına göre dosyaları yazdım.

**`tenant.ts` kontrolü:** `count` işlemi dosyadaki `OKUMA` kümesinde var. Bu yüzden `db.subscription.count(...)` çağrısına `tenantId` filtresi otomatik eklenir. `findFirst` ve `updateMany` de aynı şekilde korunuyor, uzantıda değişiklik gerekmiyor.

**Plandan üç küçük sapma (nedenleriyle):**
1. **`src/lib/islem.ts` (yeni):** `"use server"` dosyaları yalnızca async fonksiyon dışa açabilir, sabit değer açamaz. Formların başlangıç durumu ve ortak mesajlar bu yüzden ayrı bir dosyada. `auth.ts` içindeki `tekrarEdenKayitMi` dışa açık olmadığı için benzerini de buraya koydum, `auth.ts` dosyasına dokunmadım.
2. **`src/components/ui/IslemMesaji.tsx` (yeni):** Başarı ve hata mesajı kutusu dört yerde kullanılıyor, tek bileşen yaptım.
3. **"Pasife al" düğmesi listede değil, düzenleme sayfasında.** Listede olsaydı pasife alınan satır listeden kaybolur, başarı mesajı da onunla birlikte giderdi. Düzenleme sayfasında kayıt yerinde kalır, mesaj görünür.

---

## Adım 1 • Şema ve migration

### `prisma/schema.prisma`: dosyanın içeriğini tamamen şununla değiştir

Yalnızca `Customer` modeline `@@unique([tenantId, email])` ve açıklaması eklendi.

```prisma
// AboneTakip veritabanı şeması (Prisma 7)
// Veritabanı adresi burada yazmaz, prisma.config.ts üzerinden .env'den okunur.

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// ---------- Sabit değer listeleri ----------

enum Role {
  manager
  finance
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
}

enum PlanInterval {
  MONTHLY
  YEARLY
}

enum EventType {
  STARTED
  RENEWED
  CANCELED
}

// ---------- Tablolar ----------

// Firma (kiracı). Bu tabloda tenantId yoktur, id'nin kendisi kiracıdır.
model Tenant {
  id        String   @id @default(cuid())
  name      String
  cac       Int      @default(0) // Müşteri edinme maliyeti (TL, tam sayı)
  createdAt DateTime @default(now())

  users         User[]
  customers     Customer[]
  plans         Plan[]
  subscriptions Subscription[]
  events        SubscriptionEvent[]

  @@map("tenants")
}

// Firma kullanıcısı (manager veya finance)
model User {
  id           String   @id @default(cuid())
  tenantId     String
  email        String   @unique
  passwordHash String // bcrypt ile özetlenmiş parola, düz metin saklanmaz
  name         String?
  role         Role
  createdAt    DateTime @default(now())

  tenant Tenant @relation(fields: [tenantId], references: [id])

  @@index([tenantId])
  @@map("users")
}

// Firmanın müşterisi. Silinmez, isActive=false ile pasife alınır.
model Customer {
  id        String   @id @default(cuid())
  tenantId  String
  name      String
  email     String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  tenant        Tenant         @relation(fields: [tenantId], references: [id])
  subscriptions Subscription[]

  // Aynı firmaya ait olduğunu veritabanında garanti etmek için (id + tenantId) birlikte benzersiz
  @@unique([id, tenantId])
  // Aynı firmada aynı e-posta iki müşteride kullanılamaz. Büyük/küçük harf farkı,
  // uygulamada e-posta küçük harfe çevrilerek giderilir. E-postası boş (NULL) olan
  // müşteriler bu kurala takılmaz: PostgreSQL birden fazla NULL değere izin verir.
  // Farklı firmalar aynı e-postayı kullanabilir.
  @@unique([tenantId, email])
  @@index([tenantId])
  @@map("customers")
}

// Abonelik planı. Fiyat TL cinsinden tam sayıdır. Silinmez, pasife alınır.
model Plan {
  id        String       @id @default(cuid())
  tenantId  String
  name      String
  price     Int // TL, kuruş yok
  interval  PlanInterval
  isActive  Boolean      @default(true)
  createdAt DateTime     @default(now())

  tenant        Tenant         @relation(fields: [tenantId], references: [id])
  subscriptions Subscription[]

  @@unique([id, tenantId])
  @@index([tenantId])
  @@map("plans")
}

// Müşterinin bir plana aboneliği
model Subscription {
  id         String             @id @default(cuid())
  tenantId   String
  customerId String
  planId     String
  status     SubscriptionStatus @default(ACTIVE)
  startedAt  DateTime           @default(now())
  canceledAt DateTime?
  createdAt  DateTime           @default(now())

  tenant   Tenant   @relation(fields: [tenantId], references: [id])
  // Müşteri ve plan, aboneliğin firmasıyla aynı firmaya ait olmak zorunda
  customer Customer @relation(fields: [customerId, tenantId], references: [id, tenantId])
  plan     Plan     @relation(fields: [planId, tenantId], references: [id, tenantId])

  events SubscriptionEvent[]

  @@unique([id, tenantId])
  @@index([tenantId, status])
  @@index([tenantId, customerId])
  @@index([tenantId, planId])
  @@map("subscriptions")
}

// Aboneliğin yaşam döngüsü olayları (başladı, yenilendi, iptal edildi)
model SubscriptionEvent {
  id             String    @id @default(cuid())
  tenantId       String
  subscriptionId String
  type           EventType
  createdAt      DateTime  @default(now())

  tenant       Tenant       @relation(fields: [tenantId], references: [id])
  subscription Subscription @relation(fields: [subscriptionId, tenantId], references: [id, tenantId])

  @@index([tenantId, type, createdAt])
  @@index([subscriptionId])
  @@map("subscription_events")
}
```

### Migration komutları

Migration dosyasını uygulamadan yalnızca oluşturur:
```
npx prisma migrate dev --create-only --name musteri_eposta_benzersiz
```

Yeni dosyada silinmesi gereken `DROP INDEX` satırı var mı, onu gösterir. Çıktı boşsa sorun yok.
```
grep -n "DROP INDEX" prisma/migrations/*_musteri_eposta_benzersiz/migration.sql
```

Satır çıkarsa dosyayı editörde aç (`prisma/migrations/<tarih>_musteri_eposta_benzersiz/migration.sql`). `subscriptions_one_active_per_customer` geçen `DROP INDEX` satırını sil ve kaydet (Cmd+S). Dosyada kalması gereken tek satır aşağı yukarı şöyle:
```sql
CREATE UNIQUE INDEX "customers_tenantId_email_key" ON "customers"("tenantId", "email");
```

Bekleyen migration'ı fark hesaplamadan olduğu gibi uygular. Kuralımız gereği burada `migrate dev` kullanmıyoruz, çünkü o komut elle eklenen dizini tekrar silmeye çalışır.
```
npx prisma migrate deploy
```

Prisma istemci kodunu yeni şemaya göre yeniden üretir. Prisma 7'de `migrate` komutları bunu kendiliğinden yapmayabilir, bu yüzden elle çalıştırıyoruz.
```
npx prisma generate
```

---

## Adım 2 • Ortak dosyalar

### `src/lib/validation.ts`: dosyanın içeriğini tamamen şununla değiştir

Eski içerik aynen duruyor. Altına Gün 4 bölümü eklendi.

```ts
// Kayıt ve giriş formlarının sunucu tarafı doğrulaması.
// Bu dosyadaki fonksiyonlar "saf"tır: veritabanına veya çereze dokunmazlar,
// aynı girdiye her zaman aynı sonucu verirler. Bu yüzden kolay test edilirler.

// Doğrulama sonucu: ya temiz değer döner, ya da kullanıcıya gösterilecek hata.
export type Sonuc<T> = { ok: true; deger: T } | { ok: false; hata: string };

// Basit e-posta biçimi: boşluk içermez, "@" ve noktalı bir alan adı vardır.
const EPOSTA_DESENI = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Parola sınırları. bcrypt en fazla 72 baytı dikkate alır, bu yüzden üst sınır var.
const PAROLA_EN_AZ = 8;
const PAROLA_EN_COK_BAYT = 72;

// Başındaki ve sonundaki boşlukları siler. Metin değilse boş metin döner.
function temizle(girdi: unknown): string {
  return typeof girdi === "string" ? girdi.trim() : "";
}

// Genel metin alanı kontrolü (firma adı, ad soyad).
export function metinDogrula(
  girdi: unknown,
  alanAdi: string,
  enAz: number,
  enCok: number
): Sonuc<string> {
  const metin = temizle(girdi);
  if (metin.length === 0) {
    return { ok: false, hata: `${alanAdi} boş bırakılamaz.` };
  }
  if (metin.length < enAz) {
    return { ok: false, hata: `${alanAdi} en az ${enAz} karakter olmalıdır.` };
  }
  if (metin.length > enCok) {
    return { ok: false, hata: `${alanAdi} en fazla ${enCok} karakter olabilir.` };
  }
  return { ok: true, deger: metin };
}

// E-posta kontrolü. Başarılıysa küçük harfe çevrilmiş hâli döner.
// Neden küçük harf? PostgreSQL'de "Ali@x.com" ile "ali@x.com" farklı sayılır,
// bu yüzden aynı kişi iki kez kayıt olabilirdi.
export function epostaDogrula(girdi: unknown): Sonuc<string> {
  const eposta = temizle(girdi).toLowerCase();
  if (eposta.length === 0) {
    return { ok: false, hata: "E-posta adresi boş bırakılamaz." };
  }
  if (eposta.length > 254 || !EPOSTA_DESENI.test(eposta)) {
    return { ok: false, hata: "Lütfen geçerli bir e-posta adresi girin." };
  }
  return { ok: true, deger: eposta };
}

// Parola kontrolü. Parolanın başı ve sonu ASLA kırpılmaz (kullanıcı ne yazdıysa o).
export function parolaDogrula(girdi: unknown): Sonuc<string> {
  if (typeof girdi !== "string" || girdi.length === 0) {
    return { ok: false, hata: "Parola boş bırakılamaz." };
  }
  if (girdi.length < PAROLA_EN_AZ) {
    return {
      ok: false,
      hata: `Parola en az ${PAROLA_EN_AZ} karakter olmalıdır.`,
    };
  }
  // Türkçe karakterler (ğ, ş, ı gibi) 2 bayt sayılır, bu yüzden bayt olarak ölçülür.
  if (new TextEncoder().encode(girdi).length > PAROLA_EN_COK_BAYT) {
    return { ok: false, hata: "Parola çok uzun. Daha kısa bir parola seçin." };
  }
  return { ok: true, deger: girdi };
}

// Kayıt formundan gelen temizlenmiş ve doğrulanmış değerler.
export type KayitGirdisi = {
  firmaAdi: string;
  adSoyad: string;
  eposta: string;
  parola: string;
};

// Kayıt formunun tamamını kontrol eder. İlk bulduğu hatayı döner.
export function kayitGirdisiniDogrula(girdi: {
  firmaAdi: unknown;
  adSoyad: unknown;
  eposta: unknown;
  parola: unknown;
}): Sonuc<KayitGirdisi> {
  const firma = metinDogrula(girdi.firmaAdi, "Firma adı", 2, 100);
  if (!firma.ok) return firma;

  const ad = metinDogrula(girdi.adSoyad, "Ad soyad", 2, 100);
  if (!ad.ok) return ad;

  const eposta = epostaDogrula(girdi.eposta);
  if (!eposta.ok) return eposta;

  const parola = parolaDogrula(girdi.parola);
  if (!parola.ok) return parola;

  return {
    ok: true,
    deger: {
      firmaAdi: firma.deger,
      adSoyad: ad.deger,
      eposta: eposta.deger,
      parola: parola.deger,
    },
  };
}

// ---------- Müşteri ve plan formları (Gün 4) ----------

// Form doğrulama sonucu: ya temiz değerler, ya da alan bazında hatalar.
// Kayıt formundan farkı: ilk hatada durmaz, bütün alanların hatasını birlikte döner.
export type AlanSonucu<T, Alan extends string> =
  | { ok: true; deger: T }
  | { ok: false; alanHatalari: Partial<Record<Alan, string>> };

// Kayıt kimliği (id) kontrolü. Kimlikler cuid biçimindedir: küçük harf ve rakam.
// Biçimi bozuk kimlik için de "bulunamadı" denir; neyin yanlış olduğu söylenmez.
const KIMLIK_DESENI = /^[a-z0-9]{1,50}$/;

export function kimlikDogrula(girdi: unknown): Sonuc<string> {
  const kimlik = temizle(girdi);
  if (!KIMLIK_DESENI.test(kimlik)) {
    return { ok: false, hata: "Kayıt bulunamadı." };
  }
  return { ok: true, deger: kimlik };
}

// İsteğe bağlı e-posta: boşsa null döner, doluysa normal e-posta kontrolü yapılır.
export function istegeBagliEpostaDogrula(girdi: unknown): Sonuc<string | null> {
  if (temizle(girdi).length === 0) {
    return { ok: true, deger: null };
  }
  return epostaDogrula(girdi);
}

// Fiyat sınırı. Veritabanındaki Int sütunu yaklaşık 2,1 milyara kadar sayı alır;
// gerçekçi bir üst sınır koyarak taşmayı ve yazım hatalarını önlüyoruz.
export const FIYAT_EN_COK = 10_000_000;

// Fiyat kontrolü: TL cinsinden, 0'dan büyük tam sayı (kuruş yok).
export function fiyatDogrula(girdi: unknown): Sonuc<number> {
  const metin = temizle(girdi);
  if (metin.length === 0) {
    return { ok: false, hata: "Fiyat boş bırakılamaz." };
  }
  if (metin.startsWith("-")) {
    return { ok: false, hata: "Fiyat 0'dan büyük olmalıdır." };
  }
  // "1.000" (binlik) ile "12,5" (kuruş) yazımı karışmasın diye ikisi de reddedilir.
  if (/[.,]/.test(metin)) {
    return {
      ok: false,
      hata: "Fiyatı nokta veya virgül kullanmadan, tam sayı olarak yazın (ör. 1000). Kuruş girilmez.",
    };
  }
  if (!/^\d+$/.test(metin)) {
    return { ok: false, hata: "Fiyat yalnızca rakamlardan oluşmalıdır." };
  }
  // Çok uzun rakam dizilerini sayıya çevirmeden önce eleriz.
  const fiyat = metin.length > 9 ? Infinity : Number(metin);
  if (fiyat === 0) {
    return { ok: false, hata: "Fiyat 0'dan büyük olmalıdır." };
  }
  if (fiyat > FIYAT_EN_COK) {
    return {
      ok: false,
      hata: `Fiyat en fazla ${FIYAT_EN_COK.toLocaleString("tr-TR")} TL olabilir.`,
    };
  }
  return { ok: true, deger: fiyat };
}

// Plan aralıkları ve ekranda gösterilen Türkçe karşılıkları.
export const PLAN_ARALIKLARI = ["MONTHLY", "YEARLY"] as const;
export type PlanAraligi = (typeof PLAN_ARALIKLARI)[number];
export const ARALIK_ETIKETI: Record<PlanAraligi, string> = {
  MONTHLY: "Aylık",
  YEARLY: "Yıllık",
};

// Aralık kontrolü: yalnızca listedeki değerler kabul edilir.
export function aralikDogrula(girdi: unknown): Sonuc<PlanAraligi> {
  const metin = temizle(girdi);
  const gecerli = (PLAN_ARALIKLARI as readonly string[]).includes(metin);
  if (!gecerli) {
    return { ok: false, hata: "Lütfen aylık veya yıllık aralığı seçin." };
  }
  return { ok: true, deger: metin as PlanAraligi };
}

// Müşteri formundan gelen temizlenmiş değerler.
export type MusteriGirdisi = {
  ad: string;
  eposta: string | null;
};

// Müşteri formunun tamamını kontrol eder.
export function musteriGirdisiniDogrula(girdi: {
  ad: unknown;
  eposta: unknown;
}): AlanSonucu<MusteriGirdisi, "ad" | "eposta"> {
  const ad = metinDogrula(girdi.ad, "Müşteri adı", 2, 100);
  const eposta = istegeBagliEpostaDogrula(girdi.eposta);

  if (ad.ok && eposta.ok) {
    return { ok: true, deger: { ad: ad.deger, eposta: eposta.deger } };
  }

  const alanHatalari: Partial<Record<"ad" | "eposta", string>> = {};
  if (!ad.ok) alanHatalari.ad = ad.hata;
  if (!eposta.ok) alanHatalari.eposta = eposta.hata;
  return { ok: false, alanHatalari };
}

// Plan formundan gelen temizlenmiş değerler.
export type PlanGirdisi = {
  ad: string;
  fiyat: number;
  aralik: PlanAraligi;
};

// Plan formunun tamamını kontrol eder.
export function planGirdisiniDogrula(girdi: {
  ad: unknown;
  fiyat: unknown;
  aralik: unknown;
}): AlanSonucu<PlanGirdisi, "ad" | "fiyat" | "aralik"> {
  const ad = metinDogrula(girdi.ad, "Plan adı", 2, 100);
  const fiyat = fiyatDogrula(girdi.fiyat);
  const aralik = aralikDogrula(girdi.aralik);

  if (ad.ok && fiyat.ok && aralik.ok) {
    return {
      ok: true,
      deger: { ad: ad.deger, fiyat: fiyat.deger, aralik: aralik.deger },
    };
  }

  const alanHatalari: Partial<Record<"ad" | "fiyat" | "aralik", string>> = {};
  if (!ad.ok) alanHatalari.ad = ad.hata;
  if (!fiyat.ok) alanHatalari.fiyat = fiyat.hata;
  if (!aralik.ok) alanHatalari.aralik = aralik.hata;
  return { ok: false, alanHatalari };
}
```

### `src/lib/islem.ts`: yeni dosya oluştur

```ts
// Sunucu işlemlerinin (server actions) ortak türü, mesajları ve yardımcıları.
// Bu dosya hem sunucuda hem tarayıcıda kullanılabilir: veritabanına dokunmaz.

// Bir form işleminin sonucu. Form bileşeni bu değere göre mesaj gösterir.
export type FormDurumu = {
  durum: "bos" | "basarili" | "hata";
  mesaj?: string;
  // Alan bazında hatalar (ör. { fiyat: "Fiyat 0'dan büyük olmalıdır." })
  alanHatalari?: Partial<Record<string, string>>;
  // Hata durumunda formun kullanıcının yazdıklarıyla yeniden doldurulması için
  degerler?: Record<string, string>;
};

// Form ilk açıldığında henüz bir işlem yapılmamıştır.
export const BASLANGIC_DURUMU: FormDurumu = { durum: "bos" };

// Kullanıcıya gösterilen ortak Türkçe mesajlar.
export const MESAJ = {
  formHatali: "Lütfen işaretli alanları düzeltin.",
  bulunamadi: "Kayıt bulunamadı.",
  yetkiYok: "Bu işlemi yalnızca firma yöneticisi yapabilir.",
  beklenmeyen: "İşlem tamamlanamadı. Lütfen tekrar deneyin.",
} as const;

// Formdan bir alanı metin olarak okur. Alan yoksa veya dosyaysa boş metin döner.
export function formMetni(formData: FormData, alan: string): string {
  const deger = formData.get(alan);
  return typeof deger === "string" ? deger : "";
}

// Prisma'nın "tekrar eden kayıt" hatasını (P2002) tanır.
// (auth.ts içinde de aynı mantık var; o dosyaya dokunmamak için burada da tanımlı.)
export function tekrarEdenKayitMi(hata: unknown): boolean {
  return (
    typeof hata === "object" &&
    hata !== null &&
    "code" in hata &&
    (hata as { code: unknown }).code === "P2002"
  );
}
```

### `src/lib/abonelik-kontrol.ts`: yeni dosya oluştur

```ts
// AKTİF ABONELİK KONTROLÜ
//
// Bir müşteri veya plan pasife alınmadan önce ve aktif aboneliği olan bir planın
// fiyatı veya aralığı değiştirilmek istendiğinde bu fonksiyon çağrılır.
// Bu kontrolün yapıldığı TEK yer burasıdır.
//
// Sorgu getTenantDb() üzerinden yapılır. "count" işlemi tenant.ts içindeki OKUMA
// listesinde olduğu için filtreye tenantId otomatik eklenir: başka firmanın
// abonelikleri hiçbir zaman sayılmaz.
//
// Abonelikler Gün 5'te yazılacak. O zamana kadar tablo boş olduğu için sonuç
// her zaman "yok" (false) çıkar.
//
// GÜN 5 NOTU:
// - Abonelik BAŞLATILIRKEN müşterinin ve planın isActive=true olduğu kontrol edilmeli.
//   Pasife alma "önce kontrol et, sonra güncelle" şeklinde iki adımdır. Aynı anda biri
//   pasife alırken diğeri abonelik başlatırsa pasif kayda aktif abonelik bağlanabilir.
//   Abonelik başlatmadaki isActive kontrolü bu açığı karşı taraftan kapatır.
// - Aynı kısa pencere plan fiyatı değiştirilirken de vardır. Gün 5'te abonelik
//   başlatma ve bu kontrol aynı veritabanı işlemi (transaction) içinde düşünülebilir.

import { getTenantDb } from "./tenant";

type Hedef = { musteriId: string } | { planId: string };

// Verilen müşterinin veya planın ACTIVE durumda aboneliği var mı?
export async function aktifAbonelikVarMi(hedef: Hedef): Promise<boolean> {
  const db = await getTenantDb();

  const kosul =
    "musteriId" in hedef
      ? { customerId: hedef.musteriId }
      : { planId: hedef.planId };

  const sayi = await db.subscription.count({
    where: { ...kosul, status: "ACTIVE" },
  });

  return sayi > 0;
}
```

### `src/components/ui/IslemMesaji.tsx`: yeni dosya oluştur

```tsx
import type { FormDurumu } from "@/lib/islem";

// Bir form işleminin sonucunu gösterir: başarılıysa yeşil, hatalıysa kırmızı kutu.
// Henüz işlem yapılmadıysa hiçbir şey göstermez.
export default function IslemMesaji({ durum }: { durum: FormDurumu }) {
  if (durum.durum === "bos" || !durum.mesaj) return null;

  const basarili = durum.durum === "basarili";
  const renk = basarili
    ? "border-green-200 bg-green-50 text-green-800"
    : "border-red-200 bg-red-50 text-red-700";

  return (
    <p
      role={basarili ? "status" : "alert"}
      className={`rounded-lg border px-3 py-2 text-sm ${renk}`}
    >
      {durum.mesaj}
    </p>
  );
}
```

---

## Adım 3 • Müşteriler

Düzenleme sayfasının klasörünü oluşturur. Köşeli parantez zsh'de özel anlam taşıdığı için yol tırnak içinde yazılıyor.
```
mkdir -p "src/app/(panel)/musteriler/[id]"
```

### `src/app/(panel)/musteriler/actions.ts`: yeni dosya oluştur

```ts
"use server";

// MÜŞTERİ SUNUCU İŞLEMLERİ: ekleme, düzenleme, pasife alma.
//
// Sunucu işlemleri dışarıdan doğrudan çağrılabilen uç noktalardır. Bu yüzden
// yetki kontrolü her işlemin KENDİ İÇİNDE yapılır; düğmeyi gizlemek yetmez.
// Bütün sorgular getTenantDb() üzerinden yapılır, tenantId otomatik eklenir.
// Başka firmanın kaydı hiçbir sorguda eşleşmez, sonuç "Kayıt bulunamadı." olur.
//
// DİKKAT: requireUser() ve getTenantDb() giriş yapılmamışsa yönlendirme (redirect)
// yapar. Yönlendirme bir hata olarak fırlatıldığı için bu çağrılar try/catch
// bloklarının DIŞINDA tutulur.

import { revalidatePath } from "next/cache";
import { requireManager, requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import { kimlikDogrula, musteriGirdisiniDogrula } from "@/lib/validation";
import { aktifAbonelikVarMi } from "@/lib/abonelik-kontrol";
import {
  MESAJ,
  formMetni,
  tekrarEdenKayitMi,
  type FormDurumu,
} from "@/lib/islem";

const EPOSTA_TEKRAR =
  "Bu e-posta adresi başka bir müşteride kayıtlı (pasif müşteriler dahil).";

// Formdan gelen ham değerler. Hata olursa form bu değerlerle yeniden doldurulur.
function formDegerleri(formData: FormData) {
  return {
    ad: formMetni(formData, "ad"),
    eposta: formMetni(formData, "eposta"),
  };
}

// Bu firmada aynı e-postayı kullanan başka bir müşteri var mı?
// Kullanıcıya anlaşılır mesaj vermek için önceden bakılır. Asıl garanti
// veritabanındaki @@unique([tenantId, email]) kuralıdır.
// haricId: düzenlemede kaydın kendisi sayılmasın diye.
async function epostaKullaniliyorMu(
  eposta: string | null,
  haricId?: string
): Promise<boolean> {
  if (!eposta) return false;
  const db = await getTenantDb();
  const mevcut = await db.customer.findFirst({
    where: {
      email: eposta,
      ...(haricId ? { id: { not: haricId } } : {}),
    },
    select: { id: true },
  });
  return mevcut !== null;
}

// Yeni müşteri ekler. manager ve finance yapabilir.
export async function musteriEkle(
  _onceki: FormDurumu,
  formData: FormData
): Promise<FormDurumu> {
  const kullanici = await requireUser();
  const degerler = formDegerleri(formData);

  const sonuc = musteriGirdisiniDogrula(degerler);
  if (!sonuc.ok) {
    return {
      durum: "hata",
      mesaj: MESAJ.formHatali,
      alanHatalari: sonuc.alanHatalari,
      degerler,
    };
  }
  const { ad, eposta } = sonuc.deger;

  if (await epostaKullaniliyorMu(eposta)) {
    return {
      durum: "hata",
      mesaj: MESAJ.formHatali,
      alanHatalari: { eposta: EPOSTA_TEKRAR },
      degerler,
    };
  }

  const db = await getTenantDb();
  try {
    await db.customer.create({
      // tenantId burada yalnızca TypeScript'in istediği alan olduğu için yazılır
      // ve OTURUMDAN gelir, formdan değil. tenant.ts uzantısı bu değeri zaten
      // oturumdaki değerle zorla üzerine yazar.
      data: { tenantId: kullanici.tenantId, name: ad, email: eposta },
    });
  } catch (hata) {
    // İki kişi aynı anda aynı e-postayı eklerse veritabanı engeller.
    if (tekrarEdenKayitMi(hata)) {
      return {
        durum: "hata",
        mesaj: MESAJ.formHatali,
        alanHatalari: { eposta: EPOSTA_TEKRAR },
        degerler,
      };
    }
    console.error("Müşteri eklenirken beklenmeyen hata.");
    return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler };
  }

  revalidatePath("/musteriler");
  // Başarılı eklemede "degerler" dönülmez: form boşalır, yeni kayda hazır olur.
  return { durum: "basarili", mesaj: `"${ad}" müşterisi eklendi.` };
}

// Müşteri bilgilerini günceller. manager ve finance yapabilir.
export async function musteriGuncelle(
  _onceki: FormDurumu,
  formData: FormData
): Promise<FormDurumu> {
  await requireUser();
  const degerler = formDegerleri(formData);

  const kimlik = kimlikDogrula(formData.get("id"));
  if (!kimlik.ok) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi, degerler };
  }

  const sonuc = musteriGirdisiniDogrula(degerler);
  if (!sonuc.ok) {
    return {
      durum: "hata",
      mesaj: MESAJ.formHatali,
      alanHatalari: sonuc.alanHatalari,
      degerler,
    };
  }
  const { ad, eposta } = sonuc.deger;

  if (await epostaKullaniliyorMu(eposta, kimlik.deger)) {
    return {
      durum: "hata",
      mesaj: MESAJ.formHatali,
      alanHatalari: { eposta: EPOSTA_TEKRAR },
      degerler,
    };
  }

  const db = await getTenantDb();
  let guncellenenSayisi: number;
  try {
    // updateMany: kayıt bu firmaya ait değilse hata fırlatmaz, 0 satır döner.
    const sonucSatir = await db.customer.updateMany({
      where: { id: kimlik.deger },
      data: { name: ad, email: eposta },
    });
    guncellenenSayisi = sonucSatir.count;
  } catch (hata) {
    if (tekrarEdenKayitMi(hata)) {
      return {
        durum: "hata",
        mesaj: MESAJ.formHatali,
        alanHatalari: { eposta: EPOSTA_TEKRAR },
        degerler,
      };
    }
    console.error("Müşteri güncellenirken beklenmeyen hata.");
    return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler };
  }

  // Kayıt yok ya da başka firmaya ait: ikisinde de aynı cevap.
  if (guncellenenSayisi === 0) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi, degerler };
  }

  revalidatePath("/musteriler");
  revalidatePath(`/musteriler/${kimlik.deger}`);
  return {
    durum: "basarili",
    mesaj: "Değişiklikler kaydedildi.",
    degerler: { ad, eposta: eposta ?? "" },
  };
}

// Müşteriyi pasife alır. YALNIZCA manager yapabilir. Geri alınamaz.
export async function musteriPasifeAl(
  _onceki: FormDurumu,
  formData: FormData
): Promise<FormDurumu> {
  // Sunucu tarafı yetki kontrolü: finance kullanıcısı için null döner.
  const yonetici = await requireManager();
  if (!yonetici) {
    return { durum: "hata", mesaj: MESAJ.yetkiYok };
  }

  const kimlik = kimlikDogrula(formData.get("id"));
  if (!kimlik.ok) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi };
  }

  const db = await getTenantDb();
  const musteri = await db.customer.findFirst({
    where: { id: kimlik.deger },
    select: { isActive: true },
  });
  if (!musteri) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi };
  }
  if (!musteri.isActive) {
    return { durum: "hata", mesaj: "Bu müşteri zaten pasif." };
  }

  // Aktif aboneliği olan müşteri pasife alınamaz (bkz. src/lib/abonelik-kontrol.ts).
  if (await aktifAbonelikVarMi({ musteriId: kimlik.deger })) {
    return {
      durum: "hata",
      mesaj:
        "Bu müşterinin aktif aboneliği var. Önce aboneliği iptal edin, sonra müşteriyi pasife alın.",
    };
  }

  try {
    const sonucSatir = await db.customer.updateMany({
      where: { id: kimlik.deger, isActive: true },
      data: { isActive: false },
    });
    if (sonucSatir.count === 0) {
      return { durum: "hata", mesaj: MESAJ.bulunamadi };
    }
  } catch {
    console.error("Müşteri pasife alınırken beklenmeyen hata.");
    return { durum: "hata", mesaj: MESAJ.beklenmeyen };
  }

  revalidatePath("/musteriler");
  revalidatePath(`/musteriler/${kimlik.deger}`);
  return { durum: "basarili", mesaj: "Müşteri pasife alındı." };
}
```

### `src/app/(panel)/musteriler/MusteriFormu.tsx`: yeni dosya oluştur

```tsx
"use client";

// Müşteri ekleme ve düzenleme için ortak form.
// noValidate: tarayıcının kendi kontrolü kapalıdır. Böylece bütün doğrulama
// sunucuda yapılır ve Türkçe mesajlar her zaman aynı yerden gelir.

import { useActionState } from "react";
import FormAlani from "@/components/ui/FormAlani";
import Dugme from "@/components/ui/Dugme";
import IslemMesaji from "@/components/ui/IslemMesaji";
import { BASLANGIC_DURUMU } from "@/lib/islem";
import { musteriEkle, musteriGuncelle } from "./actions";

type Props =
  | { mod: "ekle" }
  | { mod: "duzenle"; musteri: { id: string; ad: string; eposta: string } };

export default function MusteriFormu(props: Props) {
  const islem = props.mod === "ekle" ? musteriEkle : musteriGuncelle;
  const [durum, formIslemi, bekliyor] = useActionState(islem, BASLANGIC_DURUMU);

  // Formun ilk değerleri: düzenlemede kayıttaki bilgiler, eklemede boş.
  const ilk =
    props.mod === "duzenle"
      ? { ad: props.musteri.ad, eposta: props.musteri.eposta }
      : { ad: "", eposta: "" };

  // İşlemden dönen değer varsa onu, yoksa ilk değeri kullan.
  const deger = (alan: "ad" | "eposta") => durum.degerler?.[alan] ?? ilk[alan];

  return (
    <form action={formIslemi} noValidate className="space-y-4">
      {props.mod === "duzenle" && (
        <input type="hidden" name="id" value={props.musteri.id} />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormAlani
          etiket="Müşteri adı"
          name="ad"
          defaultValue={deger("ad")}
          hata={durum.alanHatalari?.ad}
          maxLength={100}
          autoComplete="off"
        />
        <FormAlani
          etiket="E-posta (isteğe bağlı)"
          name="eposta"
          type="email"
          defaultValue={deger("eposta")}
          hata={durum.alanHatalari?.eposta}
          yardim="Aynı firmada iki müşteri aynı e-postayı kullanamaz."
          autoComplete="off"
        />
      </div>

      <IslemMesaji durum={durum} />

      <Dugme type="submit" disabled={bekliyor}>
        {bekliyor
          ? "Kaydediliyor..."
          : props.mod === "ekle"
            ? "Müşteri ekle"
            : "Değişiklikleri kaydet"}
      </Dugme>
    </form>
  );
}
```

### `src/app/(panel)/musteriler/PasifeAlDugmesi.tsx`: yeni dosya oluştur

```tsx
"use client";

// Müşteriyi pasife alma düğmesi. Yalnızca manager'a gösterilir.
// Asıl yetki kontrolü sunucuda, musteriPasifeAl() içinde yapılır.
// Kayıt pasife alındıktan sonra da bu bileşen yerinde kalır; böylece
// başarı mesajı ekranda görünmeye devam eder.

import { useActionState } from "react";
import Dugme from "@/components/ui/Dugme";
import IslemMesaji from "@/components/ui/IslemMesaji";
import { BASLANGIC_DURUMU } from "@/lib/islem";
import { musteriPasifeAl } from "./actions";

type Props = { id: string; ad: string; aktif: boolean };

export default function PasifeAlDugmesi({ id, ad, aktif }: Props) {
  const [durum, formIslemi, bekliyor] = useActionState(
    musteriPasifeAl,
    BASLANGIC_DURUMU
  );

  return (
    <div className="space-y-3">
      {aktif ? (
        <>
          <p className="text-sm text-slate-600">
            Pasife alınan müşteri varsayılan listede görünmez. Kayıt silinmez,
            ancak geri aktifleştirilemez.
          </p>
          <form
            action={formIslemi}
            onSubmit={(olay) => {
              // Kullanıcı onay vermezse form gönderilmez.
              if (!window.confirm(`"${ad}" müşterisi pasife alınsın mı? Bu işlem geri alınamaz.`)) {
                olay.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={id} />
            <Dugme type="submit" gorunum="tehlike" disabled={bekliyor}>
              {bekliyor ? "İşleniyor..." : "Pasife al"}
            </Dugme>
          </form>
        </>
      ) : (
        <p className="text-sm text-slate-600">Bu müşteri pasif durumda.</p>
      )}

      <IslemMesaji durum={durum} />
    </div>
  );
}
```

### `src/app/(panel)/musteriler/page.tsx`: dosyanın içeriğini tamamen şununla değiştir

```tsx
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import BosDurum from "@/components/ui/BosDurum";
import Rozet from "@/components/ui/Rozet";
import MusteriFormu from "./MusteriFormu";

// Müşteri listesi ve yeni müşteri formu. manager ve finance görebilir.
// "?pasif=1" yalnızca görünüm filtresidir; kiracı filtresi getTenantDb() ile
// her durumda otomatik uygulanır.

type SayfaProps = {
  searchParams: Promise<{ pasif?: string | string[] }>;
};

export default async function MusterilerSayfasi({ searchParams }: SayfaProps) {
  await requireUser();
  const { pasif } = await searchParams;
  const pasifleriGoster = pasif === "1";

  const db = await getTenantDb();
  const musteriler = await db.customer.findMany({
    where: pasifleriGoster ? {} : { isActive: true },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    select: { id: true, name: true, email: true, isActive: true },
  });

  return (
    <div className="space-y-8">
      <SayfaBasligi
        baslik="Müşteriler"
        aciklama="Firmanızın müşteri kayıtları."
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Yeni müşteri</h2>
        <div className="mt-4">
          <MusteriFormu mod="ekle" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">
            Müşteri listesi ({musteriler.length})
          </h2>
          <Link
            href={pasifleriGoster ? "/musteriler" : "/musteriler?pasif=1"}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            {pasifleriGoster ? "Pasifleri gizle" : "Pasifleri göster"}
          </Link>
        </div>

        {musteriler.length === 0 ? (
          <BosDurum
            baslik="Henüz müşteri yok"
            aciklama={
              pasifleriGoster
                ? "Bu firmada kayıtlı müşteri bulunmuyor."
                : "Yukarıdaki formdan ilk müşterinizi ekleyin."
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Ad</th>
                  <th className="px-4 py-3 font-medium">E-posta</th>
                  <th className="px-4 py-3 font-medium">Durum</th>
                  <th className="px-4 py-3">
                    <span className="sr-only">İşlemler</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {musteriler.map((musteri) => (
                  <tr key={musteri.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {musteri.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {musteri.email ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Rozet ton={musteri.isActive ? "indigo" : "gri"}>
                        {musteri.isActive ? "Aktif" : "Pasif"}
                      </Rozet>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/musteriler/${musteri.id}`}
                        className="font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Düzenle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
```

### `src/app/(panel)/musteriler/[id]/page.tsx`: yeni dosya oluştur

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import { kimlikDogrula } from "@/lib/validation";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import Rozet from "@/components/ui/Rozet";
import MusteriFormu from "../MusteriFormu";
import PasifeAlDugmesi from "../PasifeAlDugmesi";

// Müşteri düzenleme sayfası.
// Kayıt yoksa ya da BAŞKA FİRMAYA aitse aynı cevap verilir: "bulunamadı" (404).
// Böylece başka firmada böyle bir kaydın var olup olmadığı da anlaşılamaz.

type SayfaProps = { params: Promise<{ id: string }> };

export default async function MusteriDuzenleSayfasi({ params }: SayfaProps) {
  const kullanici = await requireUser();
  const { id } = await params;

  const kimlik = kimlikDogrula(id);
  if (!kimlik.ok) notFound();

  const db = await getTenantDb();
  const musteri = await db.customer.findFirst({
    where: { id: kimlik.deger },
    select: { id: true, name: true, email: true, isActive: true },
  });
  if (!musteri) notFound();

  const yonetici = kullanici.role === "manager";

  return (
    <div className="space-y-8">
      <Link
        href="/musteriler"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        ← Müşterilere dön
      </Link>

      <div className="space-y-2">
        <SayfaBasligi
          baslik={musteri.name}
          aciklama="Müşteri bilgilerini düzenleyin."
        />
        {!musteri.isActive && <Rozet ton="gri">Pasif</Rozet>}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Bilgiler</h2>
        <div className="mt-4">
          <MusteriFormu
            mod="duzenle"
            musteri={{
              id: musteri.id,
              ad: musteri.name,
              eposta: musteri.email ?? "",
            }}
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Pasife alma</h2>
        <div className="mt-4">
          {yonetici ? (
            <PasifeAlDugmesi
              id={musteri.id}
              ad={musteri.name}
              aktif={musteri.isActive}
            />
          ) : (
            // Düğmeyi gizlemek yalnızca kolaylıktır. Asıl engel sunucudadır.
            <p className="text-sm text-slate-600">
              Pasife alma yalnızca firma yöneticisi tarafından yapılabilir.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
```

---

## Adım 4 • Planlar

Plan düzenleme sayfasının klasörünü oluşturur:
```
mkdir -p "src/app/(panel)/planlar/[id]"
```

### `src/app/(panel)/planlar/actions.ts`: yeni dosya oluştur

```ts
"use server";

// PLAN SUNUCU İŞLEMLERİ: ekleme, düzenleme, pasife alma.
// Kurallar müşteri işlemleriyle aynıdır (bkz. musteriler/actions.ts).
// Ek kural: aktif aboneliği olan planın fiyatı ve aralığı değiştirilemez,
// çünkü MRR planın ŞU ANKİ fiyatından hesaplanır. Fiyat değişirse geçmiş
// ve bugünkü MRR bir anda değişir. Ad değişikliği serbesttir.

import { revalidatePath } from "next/cache";
import { requireManager, requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import { kimlikDogrula, planGirdisiniDogrula } from "@/lib/validation";
import { aktifAbonelikVarMi } from "@/lib/abonelik-kontrol";
import { MESAJ, formMetni, type FormDurumu } from "@/lib/islem";

const KILITLI_MESAJ =
  "Bu planın aktif abonelikleri var. Fiyat ve aralık değiştirilemez, yalnızca ad değiştirilebilir.";

// Formdan gelen ham değerler. Hata olursa form bu değerlerle yeniden doldurulur.
function formDegerleri(formData: FormData) {
  return {
    ad: formMetni(formData, "ad"),
    fiyat: formMetni(formData, "fiyat"),
    aralik: formMetni(formData, "aralik"),
  };
}

// Yeni plan ekler. manager ve finance yapabilir.
export async function planEkle(
  _onceki: FormDurumu,
  formData: FormData
): Promise<FormDurumu> {
  const kullanici = await requireUser();
  const degerler = formDegerleri(formData);

  const sonuc = planGirdisiniDogrula(degerler);
  if (!sonuc.ok) {
    return {
      durum: "hata",
      mesaj: MESAJ.formHatali,
      alanHatalari: sonuc.alanHatalari,
      degerler,
    };
  }
  const { ad, fiyat, aralik } = sonuc.deger;

  const db = await getTenantDb();
  try {
    await db.plan.create({
      // tenantId OTURUMDAN gelir; tenant.ts uzantısı da zorla üzerine yazar.
      data: {
        tenantId: kullanici.tenantId,
        name: ad,
        price: fiyat,
        interval: aralik,
      },
    });
  } catch {
    console.error("Plan eklenirken beklenmeyen hata.");
    return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler };
  }

  revalidatePath("/planlar");
  return { durum: "basarili", mesaj: `"${ad}" planı eklendi.` };
}

// Planı günceller. manager ve finance yapabilir.
export async function planGuncelle(
  _onceki: FormDurumu,
  formData: FormData
): Promise<FormDurumu> {
  await requireUser();
  const degerler = formDegerleri(formData);

  const kimlik = kimlikDogrula(formData.get("id"));
  if (!kimlik.ok) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi, degerler };
  }

  const sonuc = planGirdisiniDogrula(degerler);
  if (!sonuc.ok) {
    return {
      durum: "hata",
      mesaj: MESAJ.formHatali,
      alanHatalari: sonuc.alanHatalari,
      degerler,
    };
  }
  const { ad, fiyat, aralik } = sonuc.deger;

  const db = await getTenantDb();
  const mevcut = await db.plan.findFirst({
    where: { id: kimlik.deger },
    select: { price: true, interval: true },
  });
  if (!mevcut) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi, degerler };
  }

  // Fiyat veya aralık değişiyorsa aktif abonelik kontrolü yapılır.
  const fiyatVeyaAralikDegisti =
    mevcut.price !== fiyat || mevcut.interval !== aralik;
  if (
    fiyatVeyaAralikDegisti &&
    (await aktifAbonelikVarMi({ planId: kimlik.deger }))
  ) {
    return { durum: "hata", mesaj: KILITLI_MESAJ, degerler };
  }

  try {
    const sonucSatir = await db.plan.updateMany({
      where: { id: kimlik.deger },
      data: { name: ad, price: fiyat, interval: aralik },
    });
    if (sonucSatir.count === 0) {
      return { durum: "hata", mesaj: MESAJ.bulunamadi, degerler };
    }
  } catch {
    console.error("Plan güncellenirken beklenmeyen hata.");
    return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler };
  }

  revalidatePath("/planlar");
  revalidatePath(`/planlar/${kimlik.deger}`);
  return {
    durum: "basarili",
    mesaj: "Değişiklikler kaydedildi.",
    degerler: { ad, fiyat: String(fiyat), aralik },
  };
}

// Planı pasife alır. YALNIZCA manager yapabilir. Geri alınamaz.
export async function planPasifeAl(
  _onceki: FormDurumu,
  formData: FormData
): Promise<FormDurumu> {
  // Sunucu tarafı yetki kontrolü: finance kullanıcısı için null döner.
  const yonetici = await requireManager();
  if (!yonetici) {
    return { durum: "hata", mesaj: MESAJ.yetkiYok };
  }

  const kimlik = kimlikDogrula(formData.get("id"));
  if (!kimlik.ok) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi };
  }

  const db = await getTenantDb();
  const plan = await db.plan.findFirst({
    where: { id: kimlik.deger },
    select: { isActive: true },
  });
  if (!plan) {
    return { durum: "hata", mesaj: MESAJ.bulunamadi };
  }
  if (!plan.isActive) {
    return { durum: "hata", mesaj: "Bu plan zaten pasif." };
  }

  // Aktif aboneliği olan plan pasife alınamaz (bkz. src/lib/abonelik-kontrol.ts).
  if (await aktifAbonelikVarMi({ planId: kimlik.deger })) {
    return {
      durum: "hata",
      mesaj:
        "Bu planın aktif abonelikleri var. Önce abonelikleri iptal edin, sonra planı pasife alın.",
    };
  }

  try {
    const sonucSatir = await db.plan.updateMany({
      where: { id: kimlik.deger, isActive: true },
      data: { isActive: false },
    });
    if (sonucSatir.count === 0) {
      return { durum: "hata", mesaj: MESAJ.bulunamadi };
    }
  } catch {
    console.error("Plan pasife alınırken beklenmeyen hata.");
    return { durum: "hata", mesaj: MESAJ.beklenmeyen };
  }

  revalidatePath("/planlar");
  revalidatePath(`/planlar/${kimlik.deger}`);
  return { durum: "basarili", mesaj: "Plan pasife alındı." };
}
```

### `src/app/(panel)/planlar/PlanFormu.tsx`: yeni dosya oluştur

```tsx
"use client";

// Plan ekleme ve düzenleme için ortak form.
// kilitli: planın aktif abonelikleri varsa fiyat ve aralık salt okunur gösterilir.
// Bu yalnızca kolaylıktır; asıl engel sunucudaki planGuncelle() içindedir.

import { useActionState } from "react";
import FormAlani from "@/components/ui/FormAlani";
import Dugme from "@/components/ui/Dugme";
import IslemMesaji from "@/components/ui/IslemMesaji";
import { BASLANGIC_DURUMU } from "@/lib/islem";
import { ARALIK_ETIKETI, PLAN_ARALIKLARI, type PlanAraligi } from "@/lib/validation";
import { planEkle, planGuncelle } from "./actions";

type Props =
  | { mod: "ekle" }
  | {
      mod: "duzenle";
      plan: { id: string; ad: string; fiyat: string; aralik: PlanAraligi };
      kilitli: boolean;
    };

export default function PlanFormu(props: Props) {
  const islem = props.mod === "ekle" ? planEkle : planGuncelle;
  const [durum, formIslemi, bekliyor] = useActionState(islem, BASLANGIC_DURUMU);

  const kilitli = props.mod === "duzenle" && props.kilitli;
  const ilk =
    props.mod === "duzenle"
      ? { ad: props.plan.ad, fiyat: props.plan.fiyat, aralik: props.plan.aralik }
      : { ad: "", fiyat: "", aralik: "MONTHLY" };

  const deger = (alan: "ad" | "fiyat" | "aralik") =>
    durum.degerler?.[alan] ?? ilk[alan];

  const aralikHatasi = durum.alanHatalari?.aralik;
  const aralikCerceve = aralikHatasi
    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
    : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200";

  return (
    <form action={formIslemi} noValidate className="space-y-4">
      {props.mod === "duzenle" && (
        <input type="hidden" name="id" value={props.plan.id} />
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <FormAlani
          etiket="Plan adı"
          name="ad"
          defaultValue={deger("ad")}
          hata={durum.alanHatalari?.ad}
          maxLength={100}
          autoComplete="off"
        />

        {/* type="text": tarayıcı eksi veya ondalıklı değeri silmesin, kontrolü sunucu yapsın */}
        <FormAlani
          etiket="Fiyat (TL)"
          name="fiyat"
          type="text"
          inputMode="numeric"
          defaultValue={deger("fiyat")}
          hata={durum.alanHatalari?.fiyat}
          readOnly={kilitli}
          yardim={
            kilitli
              ? "Aktif abonelikler olduğu için değiştirilemez."
              : "Tam sayı, kuruş yok (ör. 1000)."
          }
          autoComplete="off"
        />

        <div className="space-y-1.5">
          <label htmlFor="aralik" className="block text-sm font-medium text-slate-700">
            Aralık
          </label>
          <select
            id="aralik"
            name="aralik"
            defaultValue={deger("aralik")}
            disabled={kilitli}
            aria-invalid={aralikHatasi ? true : undefined}
            aria-describedby={aralikHatasi ? "aralik-hata" : undefined}
            className={`block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 ${aralikCerceve}`}
          >
            {PLAN_ARALIKLARI.map((aralik) => (
              <option key={aralik} value={aralik}>
                {ARALIK_ETIKETI[aralik]}
              </option>
            ))}
          </select>
          {/* Devre dışı alanlar forma eklenmez; kilitliyken değer gizli alanla gönderilir. */}
          {kilitli && <input type="hidden" name="aralik" value={deger("aralik")} />}
          {aralikHatasi && (
            <p id="aralik-hata" role="alert" className="text-sm text-red-600">
              {aralikHatasi}
            </p>
          )}
        </div>
      </div>

      <IslemMesaji durum={durum} />

      <Dugme type="submit" disabled={bekliyor}>
        {bekliyor
          ? "Kaydediliyor..."
          : props.mod === "ekle"
            ? "Plan ekle"
            : "Değişiklikleri kaydet"}
      </Dugme>
    </form>
  );
}
```

### `src/app/(panel)/planlar/PasifeAlDugmesi.tsx`: yeni dosya oluştur

```tsx
"use client";

// Planı pasife alma düğmesi. Yalnızca manager'a gösterilir.
// Asıl yetki kontrolü sunucuda, planPasifeAl() içinde yapılır.

import { useActionState } from "react";
import Dugme from "@/components/ui/Dugme";
import IslemMesaji from "@/components/ui/IslemMesaji";
import { BASLANGIC_DURUMU } from "@/lib/islem";
import { planPasifeAl } from "./actions";

type Props = { id: string; ad: string; aktif: boolean };

export default function PasifeAlDugmesi({ id, ad, aktif }: Props) {
  const [durum, formIslemi, bekliyor] = useActionState(
    planPasifeAl,
    BASLANGIC_DURUMU
  );

  return (
    <div className="space-y-3">
      {aktif ? (
        <>
          <p className="text-sm text-slate-600">
            Pasife alınan plan varsayılan listede görünmez. Kayıt silinmez,
            ancak geri aktifleştirilemez.
          </p>
          <form
            action={formIslemi}
            onSubmit={(olay) => {
              if (!window.confirm(`"${ad}" planı pasife alınsın mı? Bu işlem geri alınamaz.`)) {
                olay.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={id} />
            <Dugme type="submit" gorunum="tehlike" disabled={bekliyor}>
              {bekliyor ? "İşleniyor..." : "Pasife al"}
            </Dugme>
          </form>
        </>
      ) : (
        <p className="text-sm text-slate-600">Bu plan pasif durumda.</p>
      )}

      <IslemMesaji durum={durum} />
    </div>
  );
}
```

### `src/app/(panel)/planlar/page.tsx`: dosyanın içeriğini tamamen şununla değiştir

```tsx
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import { ARALIK_ETIKETI } from "@/lib/validation";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import BosDurum from "@/components/ui/BosDurum";
import Rozet from "@/components/ui/Rozet";
import PlanFormu from "./PlanFormu";

// Plan listesi ve yeni plan formu. manager ve finance görebilir.

type SayfaProps = {
  searchParams: Promise<{ pasif?: string | string[] }>;
};

// 12500 -> "12.500 TL"
function tlBicimle(tutar: number): string {
  return `${new Intl.NumberFormat("tr-TR").format(tutar)} TL`;
}

export default async function PlanlarSayfasi({ searchParams }: SayfaProps) {
  await requireUser();
  const { pasif } = await searchParams;
  const pasifleriGoster = pasif === "1";

  const db = await getTenantDb();
  const planlar = await db.plan.findMany({
    where: pasifleriGoster ? {} : { isActive: true },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    select: { id: true, name: true, price: true, interval: true, isActive: true },
  });

  return (
    <div className="space-y-8">
      <SayfaBasligi
        baslik="Planlar"
        aciklama="Müşterilerinize sunduğunuz abonelik planları."
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Yeni plan</h2>
        <div className="mt-4">
          <PlanFormu mod="ekle" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">
            Plan listesi ({planlar.length})
          </h2>
          <Link
            href={pasifleriGoster ? "/planlar" : "/planlar?pasif=1"}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            {pasifleriGoster ? "Pasifleri gizle" : "Pasifleri göster"}
          </Link>
        </div>

        {planlar.length === 0 ? (
          <BosDurum
            baslik="Henüz plan yok"
            aciklama={
              pasifleriGoster
                ? "Bu firmada kayıtlı plan bulunmuyor."
                : "Yukarıdaki formdan ilk planınızı ekleyin."
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Ad</th>
                  <th className="px-4 py-3 font-medium">Fiyat</th>
                  <th className="px-4 py-3 font-medium">Aralık</th>
                  <th className="px-4 py-3 font-medium">Durum</th>
                  <th className="px-4 py-3">
                    <span className="sr-only">İşlemler</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {planlar.map((plan) => (
                  <tr key={plan.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {plan.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {tlBicimle(plan.price)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {ARALIK_ETIKETI[plan.interval]}
                    </td>
                    <td className="px-4 py-3">
                      <Rozet ton={plan.isActive ? "indigo" : "gri"}>
                        {plan.isActive ? "Aktif" : "Pasif"}
                      </Rozet>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/planlar/${plan.id}`}
                        className="font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Düzenle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
```

### `src/app/(panel)/planlar/[id]/page.tsx`: yeni dosya oluştur

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getTenantDb } from "@/lib/tenant";
import { kimlikDogrula } from "@/lib/validation";
import { aktifAbonelikVarMi } from "@/lib/abonelik-kontrol";
import SayfaBasligi from "@/components/ui/SayfaBasligi";
import Rozet from "@/components/ui/Rozet";
import PlanFormu from "../PlanFormu";
import PasifeAlDugmesi from "../PasifeAlDugmesi";

// Plan düzenleme sayfası.
// Kayıt yoksa ya da başka firmaya aitse aynı cevap verilir: "bulunamadı" (404).

type SayfaProps = { params: Promise<{ id: string }> };

export default async function PlanDuzenleSayfasi({ params }: SayfaProps) {
  const kullanici = await requireUser();
  const { id } = await params;

  const kimlik = kimlikDogrula(id);
  if (!kimlik.ok) notFound();

  const db = await getTenantDb();
  const plan = await db.plan.findFirst({
    where: { id: kimlik.deger },
    select: { id: true, name: true, price: true, interval: true, isActive: true },
  });
  if (!plan) notFound();

  // Aktif abonelik varsa fiyat ve aralık alanları salt okunur gösterilir.
  const kilitli = await aktifAbonelikVarMi({ planId: plan.id });
  const yonetici = kullanici.role === "manager";

  return (
    <div className="space-y-8">
      <Link
        href="/planlar"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        ← Planlara dön
      </Link>

      <div className="space-y-2">
        <SayfaBasligi baslik={plan.name} aciklama="Plan bilgilerini düzenleyin." />
        {!plan.isActive && <Rozet ton="gri">Pasif</Rozet>}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Bilgiler</h2>
        <div className="mt-4">
          <PlanFormu
            mod="duzenle"
            plan={{
              id: plan.id,
              ad: plan.name,
              fiyat: String(plan.price),
              aralik: plan.interval,
            }}
            kilitli={kilitli}
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Pasife alma</h2>
        <div className="mt-4">
          {yonetici ? (
            <PasifeAlDugmesi id={plan.id} ad={plan.name} aktif={plan.isActive} />
          ) : (
            <p className="text-sm text-slate-600">
              Pasife alma yalnızca firma yöneticisi tarafından yapılabilir.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
```

### `src/app/(panel)/not-found.tsx`: yeni dosya oluştur

```tsx
import Link from "next/link";
import BosDurum from "@/components/ui/BosDurum";

// Panel içinde notFound() çağrıldığında gösterilir (ör. başka firmanın kaydı).
// Kaydın var olup olmadığı veya kime ait olduğu hakkında bilgi verilmez.
export default function KayitBulunamadi() {
  return (
    <div className="space-y-4">
      <BosDurum
        baslik="Kayıt bulunamadı"
        aciklama="Aradığınız kayıt bulunamadı. Bağlantı hatalı olabilir."
      />
      <Link
        href="/dashboard"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        ← Dashboard'a dön
      </Link>
    </div>
  );
}
```

---

## Adım 5 • Kontrol ve çalıştırma

TypeScript tür hatalarını, dosya üretmeden kontrol eder:
```
npx tsc --noEmit
```

Kod kurallarını (ESLint) kontrol eder:
```
npm run lint
```

Render'ın yapacağı derlemeyi yerelde dener. Canlıda kırılmayı önceden yakalar.
```
npm run build
```

Geliştirme sunucusunu başlatır. Tarayıcıda `http://localhost:3000/musteriler` adresini aç.
```
npm run dev
```

Herhangi bir adımda hata çıkarsa hata mesajının tamamını gönder.

---

## Adım 6 • Elle test senaryoları

**1. Finance pasife almayı denerse.** İkinci kullanıcı Gün 6'da gelecek. Şimdilik mantığı kodda okuyoruz, iki katmanlı:
- **Arayüz:** `[id]/page.tsx` içinde `yonetici` false ise düğme hiç çizilmez, yerine bilgi metni çıkar.
- **Sunucu:** `musteriPasifeAl` ve `planPasifeAl` işlemlerinin ilk satırı `requireManager()`. Sonuç `null` ise veritabanına hiç gidilmeden "Bu işlemi yalnızca firma yöneticisi yapabilir." döner. Düğme biri tarafından elle gönderilse bile kayıt değişmez.
- **Gün 6'da beklenen:** finance olarak düzenleme sayfasında düğme görünmez. Ekleme ve düzenleme çalışır.

**2. Aynı e-posta ile iki müşteri.**
- "Ayşe Demir" adıyla ve `ayse@ornek.com` e-postasıyla müşteri ekle. Beklenen: başarılı.
- "Ayşe D." adıyla ve ` AYSE@ornek.com ` e-postasıyla (büyük harfli, başında ve sonunda boşluk) ekle. Beklenen: e-posta alanında "Bu e-posta adresi başka bir müşteride kayıtlı" hatası, yazdıkların formda kalır.
- Başka bir müşteriyi düzenleyip e-postasını `ayse@ornek.com` yap. Beklenen: aynı hata.
- E-postası boş iki müşteri ekle. Beklenen: ikisi de başarılı.
- İlk müşteriyi pasife al, sonra aynı e-postayla yeni müşteri eklemeyi dene. Beklenen: yine hata, çünkü kural pasif müşterileri de kapsar.

**3. Negatif ve hatalı fiyat.** Plan eklerken fiyat alanına sırayla şunları yaz:

| Girdi | Beklenen mesaj |
|---|---|
| `-100` | Fiyat 0'dan büyük olmalıdır. |
| `0` | Fiyat 0'dan büyük olmalıdır. |
| `12,5` veya `1.000` | Nokta veya virgül kullanmadan tam sayı yazın. |
| `abc` | Fiyat yalnızca rakamlardan oluşmalıdır. |
| `20000000` | Fiyat en fazla 10.000.000 TL olabilir. |
| `1000` | Başarılı, listede "1.000 TL" görünür. |

---

## Adım 7 • Tenant izolasyonu: üç test

Önce gizli bir pencere aç (Safari ve Chrome'da Cmd+Shift+N). O pencerede sahte bilgilerle **Firma B** kaydı oluştur. Normal penceren **Firma A** olarak kalsın. İki pencere ayrı oturum taşır.

**Test 1: URL ile başka firmanın kaydına erişim.**
- Firma A'da bir müşterinin düzenleme sayfasını aç ve adres çubuğundaki adresi kopyala (`/musteriler/<id>`).
- Gizli pencerede (Firma B) bu adresi aç. Beklenen: "Kayıt bulunamadı" sayfası.
- Aynısını bir plan için tekrarla.

**Test 2: Formu değiştirip başka firmanın kaydını güncellemeye çalışmak.**
- Firma B'de kendi müşterinin düzenleme sayfasını aç.
- Geliştirici araçlarını aç (Chrome: Cmd+Option+I; Safari'de önce Ayarlar > Gelişmiş > "Web geliştirici özelliklerini göster"). Elements sekmesinde `name="id"` olan gizli alanı bul, değerini Firma A'daki müşterinin id'siyle değiştir.
- Ad alanına "DEĞİŞTİRİLDİ" yazıp kaydet. Beklenen: "Kayıt bulunamadı."
- Firma A penceresinde sayfayı yenile (Cmd+R). Beklenen: müşteri aynen duruyor.

**Test 3: Liste ve e-posta ayrımı.**
- Firma B'nin müşteri listesinde Firma A'nın müşterileri görünmemeli.
- Firma B'de `ayse@ornek.com` e-postasıyla müşteri ekle. Beklenen: başarılı. Benzersizlik kuralı firma bazındadır ve "bu e-posta başka firmada var" bilgisi sızmaz.

---

## Adım 8 • Commit

Değişen ve yeni dosyaları listeler. `.env` listede **olmamalı**.
```
git status
```

Repoya Neon adresi veya parola girmediğini kontrol eder. Çıktı boş olmalı.
```
git grep -n -e "neon.tech" -e "npg_"
```

Bütün değişiklikleri commit'e hazırlar:
```
git add -A
```

Commit'i oluşturur:
```
git commit -m "feat: müşteri ve plan yönetimi"
```

GitHub'a gönderir. Render buradan otomatik yayına alır.
```
git push
```

---

## Bitiş kontrolü

- [ ] Müşteri ve plan ekleniyor, düzenleniyor, pasife alınıyor (Adım 6)
- [ ] Finance rolüyle pasife alma engelleniyor: her iki `PasifeAl` işleminin ilk satırında `requireManager()` var
- [ ] Sunucu tarafı yetki kontrolü var: düğme gizleme yalnızca arayüzde, engel işlemin içinde
- [ ] Tenant izolasyonu üç testten geçti (Adım 7)

## Varsayımlar ve emin olmadığım yerler

- **Canlı veritabanı:** Yerelde `migrate deploy` hangi Neon veritabanına bağlıysa migration oraya uygulanır. Canlı site aynı veritabanını kullanıyorsa ek bir şey gerekmez. Ayrı bir canlı veritabanın varsa, önceki günlerde migration'ı canlıya nasıl uyguladıysan aynı yolu izle. Render'daki derleme komutunda `migrate deploy` var mı, bilmiyorum.
- **Form sıfırlama:** React 19, işlem bittikten sonra formu kendiliğinden sıfırlar. Hata durumunda değerlerin korunmasını, `degerler` alanını `defaultValue` olarak geri vererek sağladım. Hata sonrasında yazdıkların silinirse bana söyle, farklı bir yönteme geçeriz.
- **Not found sayfası:** `(panel)/not-found.tsx` dosyasının `notFound()` çağrılarında kullanılacağını varsayıyorum. Kullanılmazsa Next'in varsayılan 404 sayfası çıkar; güvenlik açısından fark yok.
- **Rozet tonları:** `Rozet` bileşeninde yalnızca `"indigo"` ve `"gri"` tonlarını gördüğüm için Aktif ve Pasif için bunları kullandım. `SayfaBasligi` ve `BosDurum` için de yalnızca senin kodunda gördüğüm özellikleri kullandım.
- **Ad uzunluğu:** Müşteri ve plan adları kayıt formuyla tutarlı olsun diye en az 2, en çok 100 karakter. Planda 1 yazmıştım.
- **Kısa yarış penceresi:** Pasife alma ve plan fiyatı kilidi "önce kontrol, sonra güncelleme" şeklinde iki adımdır. Abonelik başlatmayla aynı anda olursa küçük bir pencere kalır. Bu Gün 5'te kapanacak, notu `abonelik-kontrol.ts` dosyasına yazdım.
- **Elle eklenen dizin:** `subscriptions_one_active_per_customer` bu migration'da da `DROP INDEX` olarak çıkabilir. Silmeyi unutma, `grep` adımı bunun için.
````

### Claude cevabı 4 · 21 Eki 2026 07:31

> Tamam, bu planı sırasıyla ve hiç sapmadan yaptıracağım. Kodları o sohbetteki mesajdan kopyalayacaksın, ben her adımı, kontrolünü ve beklenen sonucu vereceğim. Planı tamamen okudum. Sıra şu:
>
> 1. Şema ve migration
> 2. Ortak dosyalar
> 3. Müşteriler
> 4. Planlar
> 5. Kontrol ve çalıştırma
> 6. Elle test senaryoları
> 7. Tenant izolasyonu testleri
> 8. Commit
>
> Sadece sıradaki adımı vereceğim, sen bitirince bir sonrakine geçeceğiz.
>
> ## Adım 0: Doğru branch'te misin?
> Terminalde, proje klasöründe:
> ```
> git branch --show-current
> ```
> Beklenen: `feat/gun-04-musteri-plan`. `main` yazıyorsa şunları çalıştır:
> ```
> git pull
> ```
> ```
> git switch -c feat/gun-04-musteri-plan
> ```
> Sonra temiz olduğunu doğrula:
> ```
> git status
> ```
> Beklenen: "çalışma ağacı temiz" (değişiklik yok).
>
> ## Adım 1-a: Şemayı değiştir
> 1. VS Code'da **Cmd+P** bas, `schema.prisma` yaz, Enter.
> 2. **Cmd+A** ile hepsini seç.
> 3. O sohbetteki **"Adım 1 • Şema ve migration"** başlığının altındaki, `prisma/schema.prisma` yazan **kod bloğunun tamamını** kopyala ve yapıştır.
> 4. **Cmd+S** ile kaydet.
>
> ### Kontrol
> Bu değişiklik sadece küçük bir ekleme olmalı. Terminalde:
> ```
> git diff prisma/schema.prisma
> ```
> Beklenen: Yalnızca yeşil (`+`) satırlar. `Customer` modelindeki 5-6 yeni satır: üç yorum satırı, `@@unique([tenantId, email])` ve belki bir açıklama satırı. **Kırmızı (`-`) satır olmamalı.**
>
> Kırmızı satır görürsen ya da başka bir model değişmişse dur ve çıktıyı yapıştır. Çıkmak için **q** tuşuna bas.
>
> Migration komutlarını bir sonraki adımda vereceğim. Çıktıyı yapıştır.

### Prompt 5 · 21 Eki 2026 07:33

````text
kullanici@bilgisayar abonetakip % git branch --show-current
feat/gun-04-musteri-plan
kullanici@bilgisayar abonetakip % git pull
Geçerli dal için izleme bilgisi yok.
Lütfen hangi dal ile birleştirmek istediğinizi belirtin.
Ayrıntılar için git-pull(1)'a bakın.

    git pull <uzak-konum> <dal>

Eğer bu dal için izleme bilgisi ayarlamak isterseniz şununla yapabilirsiniz:

    git branch --set-upstream-to=origin/<dal> feat/gun-04-musteri-plan

kullanici@bilgisayar abonetakip % git switch -c feat/gun-04-musteri-plan
onulmaz: "feat/gun-04-musteri-plan" adında bir dal halihazırda var
kullanici@bilgisayar abonetakip % git status
Üzerinde bulunulan dal: feat/gun-04-musteri-plan
İşleme için hazırlanmamış değişiklikler:
  (işlenecekleri güncellemek için "git add <dosya>..." kullanın)
  (çalışma dizinindeki değişiklikleri atmak için
    "git restore <dosya>..." kullanın)
değiştirildi:         docs/04_14_Gunluk_Prompt_Plani.md
değiştirildi:         prisma/schema.prisma

İşlemeye eklenen değişiklik yok ("git add" ve/veya "git commit -a" kullanın)
kullanici@bilgisayar abonetakip % git diff prisma/schema.prisma
diff --git a/prisma/schema.prisma b/prisma/schema.prisma
index 5bd76ca..e3ebd5f 100644
--- a/prisma/schema.prisma
+++ b/prisma/schema.prisma
@@ -81,6 +81,11 @@ model Customer {
 
   // Aynı firmaya ait olduğunu veritabanında garanti etmek için (id + tenantId) birlikte benzersiz
   @@unique([id, tenantId])
+  // Aynı firmada aynı e-posta iki müşteride kullanılamaz. Büyük/küçük harf farkı,
+  // uygulamada e-posta küçük harfe çevrilerek giderilir. E-postası boş (NULL) olan
+  // müşteriler bu kurala takılmaz: PostgreSQL birden fazla NULL değere izin verir.
+  // Farklı firmalar aynı e-postayı kullanabilir.
+  @@unique([tenantId, email])
   @@index([tenantId])
   @@map("customers")
 }
@@ -142,4 +147,4 @@ model SubscriptionEvent {
   @@index([tenantId, type, createdAt])
   @@index([subscriptionId])
   @@map("subscription_events")
-}
+}
\ No newline at end of file
````

### Claude cevabı 5 · 21 Eki 2026 07:34

> Üç şeyi gördüm:
>
> 1. **Branch doğru.** `feat/gun-04-musteri-plan` daha önce açılmıştı, bu yüzden "zaten var" hatası çıktı. `git pull` hatası da normal, çünkü bu branch henüz GitHub'a gönderilmedi. İkisi için de bir şey yapma.
> 2. **Şema değişikliği tam istediğimiz gibi.** Yalnızca `Customer` modeline yeşil satırlar eklenmiş, kırmızı satır yok. Sondaki "No newline at end of file" uyarısı zararsız, sadece dosyanın son satır sonu eksik.
> 3. **Beklemediğim bir şey var:** `git status` `docs/04_14_Gunluk_Prompt_Plani.md` dosyasını da değişmiş gösteriyor. Planda bu dosyayı değiştirmek yok. Bunu commit'e karıştırmadan önce neyin değiştiğine bakalım.
>
> ## Adım 1-a'nın sonu: Beklenmeyen değişikliği kontrol et
> ```
> git diff docs/04_14_Gunluk_Prompt_Plani.md | head -60
> ```
> Çıktıyı yapıştır. Dosyada gizli bilgi yok. Çıkmak için gerekirse **q** bas.
>
> ## Adım 1-b: Migration dosyasını oluştur (uygulamadan)
> Aynı anda bu adıma da geç, ikisi birbirine bağlı değil. Bu komut migration dosyasını yalnızca oluşturur, veritabanına uygulamaz:
> ```
> npx prisma migrate dev --create-only --name musteri_eposta_benzersiz
> ```
> Beklenen: Sonda `Prisma Migrate created the following migration without applying it` ve `prisma/migrations/...musteri_eposta_benzersiz` yazar.
>
> **Dikkat:** Komut "veritabanını sıfırlamamız gerektiğini" söyleyip onay isterse (`reset`, `data will be lost` gibi) **hayır** de, hiçbir şeyi onaylama ve çıktıyı yapıştır.
>
> Sonra silinecek `DROP INDEX` satırı var mı kontrol et:
> ```
> grep -n "DROP INDEX" prisma/migrations/*_musteri_eposta_benzersiz/migration.sql
> ```
> Çıktı boş olabilir ya da bir satır gelebilir. İkisini de yapıştır. Silme işini sen yapmadan önce bana göstereceksin.
>
> İki komutun çıktısını yapıştır.

### Prompt 6 · 21 Eki 2026 07:35

````text
kullanici@bilgisayar abonetakip % git diff docs/04_14_Gunluk_Prompt_Plani.md | head -60
diff --git a/docs/04_14_Gunluk_Prompt_Plani.md b/docs/04_14_Gunluk_Prompt_Plani.md
index a3a62b9..2546f4b 100644
--- a/docs/04_14_Gunluk_Prompt_Plani.md
+++ b/docs/04_14_Gunluk_Prompt_Plani.md
@@ -22,7 +22,7 @@ Bu bir devam oturumu. Proje talimatlarındaki (CLAUDE.md) kurallara uy.
 Ben kod bilmeyen bir YBS öğrencisiyim, Türkçe, sade ve adım adım anlat.
 Önce plan ver, ben onaylamadan dosya değiştirme. Cevabın sonunda
 varsayımlarını ve emin olmadığın yerleri listele.
-Bugünün konusu: [Gün X - konu].
+Bugünün konusu: 
 ```
 
 ## Ortak Başlık (uzun hâl: Project talimatı yoksa veya yeni bir sohbet için)
@@ -793,4 +793,4 @@ doğrula. Bilmediğin bir proje ayrıntısını uydurma, bana sor.
 | 13 | README, seed, belgeler | Teslim |
 | 14 | Son deploy, sunum | Teslim |
 
-**Geri kalma kuralı:** Bir gün aksarsa önce SHOULD maddelerini (Gün 10-11) kısalt, MUST maddelerine ve belgelere dokunma. COULD maddeleri (CSV, plan kırılımı) yalnızca her şey bittiyse yapılır.
+**Geri kalma kuralı:** Bir gün aksarsa önce SHOULD maddelerini (Gün 10-11) kısalt, MUST maddelerine ve belgelere dokunma. COULD maddeleri (CSV, plan kırılımı) yalnızca her şey bittiyse yapılır.
\ No newline at end of file
````

### Claude cevabı 6 · 21 Eki 2026 07:35

> Bu değişiklik büyük ihtimalle yanlışlıkla olmuş. Prompt şablonunu kopyalarken `[Gün X - konu]` yazan yeri silmişsin. Plan dosyasındaki şablon yazısı bozulmuş durumda ve ayrıca son satırın sonundaki satır sonu da gitmiş. Bu değişikliğin Gün 4 işiyle ilgisi yok, commit'e girmemeli.
>
> ## Geri al
> **Yalnızca bu dosyayı** eski haline döndür. Komuttaki dosya adı tam olarak böyle olmalı, `schema.prisma`'ya dokunma:
> ```
> git restore docs/04_14_Gunluk_Prompt_Plani.md
> ```
> Kontrol:
> ```
> git status
> ```
> Beklenen: Değişmiş dosya olarak **yalnızca `prisma/schema.prisma`** görünür.
>
> ## Adım 1-b: Migration dosyasını oluştur (uygulamadan)
> Önceki mesajdaki ikinci kısma henüz geçmemişsin. Bu komut migration dosyasını yalnızca oluşturur, veritabanına uygulamaz:
> ```
> npx prisma migrate dev --create-only --name musteri_eposta_benzersiz
> ```
> Beklenen: Sonda `created the following migration without applying it` ve `musteri_eposta_benzersiz` klasörünün adı yazar.
>
> **Dikkat:** Komut "veritabanını sıfırlamak gerekiyor" ya da "data will be lost" gibi bir onay sorarsa **hayır** de, hiçbir şeyi onaylama ve çıktıyı yapıştır.
>
> Sonra:
> ```
> grep -n "DROP INDEX" prisma/migrations/*_musteri_eposta_benzersiz/migration.sql
> ```
> Çıktı boş olabilir ya da bir satır gelebilir. `git status` ve iki komutun çıktısını yapıştır. Silme işini ben göstermeden yapma.

### Prompt 7 · 21 Eki 2026 07:37

````text
kullanici@bilgisayar abonetakip % npx prisma migrate dev --create-only --name musteri_eposta_benzersiz
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Datasource "db": PostgreSQL database "neondb", schema "public" at "[NEON_HOST]"


⚠️  Warnings for the current datasource:

  • A unique constraint covering the columns `[tenantId,email]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

? Are you sure you want to create this migration? › (y/N)
````

### Claude cevabı 7 · 21 Eki 2026 07:37

> Bu soru önceki uyardığım onay türünden değil. Veritabanını sıfırlama ya da veri kaybı sorusu değil, sadece "bu benzersizlik kuralını ekleyen migration dosyası oluşturulsun mu?" diye soruyor. Uyarıdaki "mevcut tekrar eden değerler varsa bu başarısız olur" kısmı bizi etkilemez, çünkü `customers` tablosu henüz boş (müşteri sayfasını bugün yapıyoruz). Ayrıca `--create-only` kullandığımız için dosya yalnızca oluşturulur, veritabanına uygulanmaz.
>
> Klavyede **y** yaz ve **Enter**'a bas.
>
> Çıktının başında Neon sunucusunun adı göründü. Bu bir parola ya da bağlantı adresi değil, tek başına risk taşımaz. Ama ileride çıktı yapıştırırken bu satırı silmeni tercih ederim.
>
> Komut bitince şunu çalıştır:
> ```
> grep -n "DROP INDEX" prisma/migrations/*_musteri_eposta_benzersiz/migration.sql
> ```
> Çıktıyı (boş olsa bile "boş çıktı" diye) ve `migrate dev` komutunun son satırlarını yapıştır.

### Prompt 8 · 21 Eki 2026 07:38

````text
mig
````

### Claude cevabı 8 · 21 Eki 2026 07:38

> Mesajın "mig" diye kesilmiş gelmiş, sanırım yarım gönderilmiş. Terminalde ne gördüğünü yapıştırır mısın?
>
> Özellikle şunlara bakıyorum:
> 1. `y` yazıp Enter'a bastıktan sonra ekrana ne çıktı? Sonunda `migration without applying it` gibi bir cümle var mı?
> 2. Sonra çalıştırdığın `grep -n "DROP INDEX" ...` komutunun çıktısı. Boşsa "boş" yaz.

### Prompt 9 · 21 Eki 2026 07:38

````text
evet var , boş
````

### Claude cevabı 9 · 21 Eki 2026 07:38

> Güzel, `DROP INDEX` satırı yok, silinecek bir şey çıkmadı. Planda "çıktı boşsa sorun yok" yazıyordu. Veritabanına dokunmadan önce dosyanın içinde başka bir şey olmadığını görelim:
>
> ```
> cat prisma/migrations/*_musteri_eposta_benzersiz/migration.sql
> ```
>
> Beklenen: Sadece şu satırlar (yorum satırları olabilir):
> ```sql
> CREATE UNIQUE INDEX "customers_tenantId_email_key" ON "customers"("tenantId", "email");
> ```
> Başka bir komut (`DROP`, `ALTER`, `CREATE TABLE` gibi) görürsen dur. Çıktıyı yapıştır, onaylamadan veritabanına uygulamayacağız.

### Prompt 10 · 21 Eki 2026 07:39

````text
kullanici@bilgisayar abonetakip % cat prisma/migrations/*_musteri_eposta_benzersiz/migration.sql
/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,email]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "customers_tenantId_email_key" ON "customers"("tenantId", "email");
````

### Claude cevabı 10 · 21 Eki 2026 07:39

> Dosya tam istediğimiz gibi: yalnızca tek bir `CREATE UNIQUE INDEX` satırı var, başka bir komut yok. Başındaki yorum bloğu Prisma'nın kendi uyarısıdır, zararsız.
>
> ## Adım 1-c: Migration'ı uygula
> Bu komut bekleyen migration'ı veritabanına uygular. `migrate dev` değil `migrate deploy` kullanıyoruz, çünkü `dev` elle eklediğimiz `subscriptions_one_active_per_customer` dizinini silmeye çalışabilir:
> ```
> npx prisma migrate deploy
> ```
> Beklenen: `1 migration found`, `Applying migration ... musteri_eposta_benzersiz` ve sonunda `All migrations have been successfully applied.`
>
> Sonra Prisma istemci kodunu yeni şemaya göre yeniden üretir:
> ```
> npx prisma generate
> ```
> Beklenen: `Generated Prisma Client` yazar.
>
> Neon sunucu adı satırını çıktıdan silerek iki komutun çıktısını yapıştır. Bu işlem canlı sitenin kullandığı veritabanına da uygulanır ama sadece yeni bir kural ekler, mevcut hiçbir veriyi değiştirmez, siteyi etkilemez.

### Prompt 11 · 21 Eki 2026 07:41

````text
kullanici@bilgisayar abonetakip % npx prisma migrate deploy
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Datasource "db": PostgreSQL database "neondb", schema "public" at ""

2 migrations found in prisma/migrations

Applying migration `20261021043736_musteri_eposta_benzersiz`

The following migration(s) have been applied:

migrations/
  └─ 20261021043736_musteri_eposta_benzersiz/
    └─ migration.sql

All migrations have been successfully applied.
kullanici@bilgisayar abonetakip % npx prisma generate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.

✔ Generated Prisma Client (7.10.1) to ./generated/prisma in 25ms
````

### Claude cevabı 11 · 21 Eki 2026 07:42

> Adım 1 tamam. Migration uygulandı (`All migrations have been successfully applied`) ve Prisma istemcisi yeniden üretildi.
>
> ## Adım 2: Ortak dosyalar (4 dosya)
> Kodlar o sohbetteki **"Adım 2 • Ortak dosyalar"** başlığının altında. Sırayla yap.
>
> ### 2-a: Üç yeni boş dosya oluştur
> Terminalde, proje klasöründe tek komutla:
> ```
> touch src/lib/islem.ts src/lib/abonelik-kontrol.ts src/components/ui/IslemMesaji.tsx
> ```
>
> ### 2-b: `src/lib/validation.ts`: mevcut içeriği tamamen değiştir
> 1. **Cmd+P**, `validation.ts` yaz, Enter.
> 2. **Cmd+A** ile hepsini seç.
> 3. O sohbette `src/lib/validation.ts` başlıklı bloğun **tamamını** kopyala ve yapıştır.
> 4. **Cmd+S**.
>
> ### 2-c: `src/lib/islem.ts`
> **Cmd+P**, `islem.ts` yaz, aç. İçine o sohbetteki `src/lib/islem.ts` bloğunu yapıştır, **Cmd+S**.
>
> ### 2-d: `src/lib/abonelik-kontrol.ts`
> **Cmd+P**, `abonelik-kontrol.ts` yaz, aç. İçine o sohbetteki `src/lib/abonelik-kontrol.ts` bloğunu yapıştır, **Cmd+S**.
>
> ### 2-e: `src/components/ui/IslemMesaji.tsx`
> **Cmd+P**, `IslemMesaji.tsx` yaz, aç. İçine o sohbetteki `src/components/ui/IslemMesaji.tsx` bloğunu yapıştır, **Cmd+S**.
>
> Her dosyada kodun başındaki üçlü tırnak işaretlerini (```` ``` ````) ve `ts`/`tsx` yazısını **kopyalama**, yalnızca kodu kopyala.
>
> ### Küçük kontrol
> Bu dört dosya birbirine bağlı ve hepsi mevcut dosyalarla uyumlu olmalı. Terminalde:
> ```
> npx tsc --noEmit
> ```
> Beklenen: **çıktı yok.** Hata çıkarsa tam metnini yapıştır, düzeltmeden bir sonraki adıma geçmeyeceğiz.
>
> Sonucu yaz.

### Prompt 12 · 21 Eki 2026 07:51

````text
ÇIKTI YOK
````

### Claude cevabı 12 · 21 Eki 2026 07:51

> Adım 2 tamam, `tsc` temiz.
>
> ## Adım 3: Müşteriler (5 dosya)
> Kodlar o sohbetteki **"Adım 3 • Müşteriler"** başlığının altında. Sırayla yap. Her blokta yalnızca kodu kopyala, üçlü tırnak işaretlerini (```` ``` ````) ve `ts`/`tsx` yazısını kopyalama.
>
> ### 3-a: Klasör ve boş dosyaları oluştur
> Düzenleme sayfasının klasörünü açar (köşeli parantez ve normal parantez yüzünden yol tırnak içinde):
> ```
> mkdir -p "src/app/(panel)/musteriler/[id]"
> ```
> Üç yeni boş dosyayı oluşturur:
> ```
> touch "src/app/(panel)/musteriler/actions.ts" "src/app/(panel)/musteriler/MusteriFormu.tsx" "src/app/(panel)/musteriler/PasifeAlDugmesi.tsx"
> ```
>
> ### 3-b: `actions.ts`
> **Cmd+P**, `musteriler/actions` yaz, aç. İçine o sohbetteki `src/app/(panel)/musteriler/actions.ts` bloğunu yapıştır, **Cmd+S**.
>
> ### 3-c: `MusteriFormu.tsx`
> **Cmd+P**, `MusteriFormu` yaz, aç. İçine o sohbetteki `MusteriFormu.tsx` bloğunu yapıştır, **Cmd+S**.
>
> ### 3-d: `PasifeAlDugmesi.tsx`
> **Cmd+P**, `musteriler/PasifeAl` yaz, aç. İçine o sohbetteki `src/app/(panel)/musteriler/PasifeAlDugmesi.tsx` bloğunu yapıştır, **Cmd+S**.
>
> ### 3-e: `musteriler/page.tsx`: mevcut içeriği tamamen değiştir
> Bu dosyayı, düzenleme sayfasını oluşturmadan **önce** yapıyoruz ki yanlış `page.tsx`'i açmayasın.
> 1. **Cmd+P**, `musteriler/page` yaz. Listede **tek** sonuç çıkmalı: `(panel)/musteriler/page.tsx`. Onu aç.
> 2. **Cmd+A** ile hepsini seç.
> 3. O sohbetteki `src/app/(panel)/musteriler/page.tsx` bloğunu yapıştır, **Cmd+S**.
>
> ### 3-f: `[id]/page.tsx`: yeni dosya
> Boş dosyayı oluştur:
> ```
> touch "src/app/(panel)/musteriler/[id]/page.tsx"
> ```
> Sonra **Cmd+P**, `[id]/page` yaz. Listede **iki** sonuç çıkabilir (`musteriler/[id]/page.tsx` ve henüz oluşturmadığımız plan sürümü yok, o yüzden büyük ihtimalle tek). Yolunda **`musteriler/[id]`** geçen dosyayı aç, o sohbetteki `src/app/(panel)/musteriler/[id]/page.tsx` bloğunu yapıştır, **Cmd+S**.
>
> ### Küçük kontrol
> ```
> npx tsc --noEmit
> ```
> Beklenen: çıktı yok. Hata çıkarsa tam metnini yapıştır.
>
> Sonucu yaz. Henüz `npm run dev` çalıştırma, onu Adım 5'te yapacağız.

### Prompt 13 · 21 Eki 2026 07:55

````text
ÇIKTI YOK
````

### Claude cevabı 13 · 21 Eki 2026 07:56

> Adım 3 tamam, `tsc` temiz.
>
> ## Adım 4: Planlar (6 dosya)
> Kodlar o sohbetteki **"Adım 4 • Planlar"** başlığının altında. Yapı müşterilerle aynı. Yalnızca kodu kopyala, üçlü tırnak işaretlerini (```` ``` ````) ve `ts`/`tsx` yazısını kopyalama.
>
> ### 4-a: Klasör ve boş dosyaları oluştur
> Düzenleme sayfasının klasörünü açar:
> ```
> mkdir -p "src/app/(panel)/planlar/[id]"
> ```
> Üç yeni boş dosyayı ve bulunamadı sayfasını oluşturur:
> ```
> touch "src/app/(panel)/planlar/actions.ts" "src/app/(panel)/planlar/PlanFormu.tsx" "src/app/(panel)/planlar/PasifeAlDugmesi.tsx" "src/app/(panel)/not-found.tsx"
> ```
>
> ### 4-b: `actions.ts`
> **Cmd+P**, `planlar/actions` yaz, aç. İçine o sohbetteki `src/app/(panel)/planlar/actions.ts` bloğunu yapıştır, **Cmd+S**.
>
> ### 4-c: `PlanFormu.tsx`
> **Cmd+P**, `PlanFormu` yaz, aç. İçine o sohbetteki `PlanFormu.tsx` bloğunu yapıştır, **Cmd+S**.
>
> ### 4-d: `PasifeAlDugmesi.tsx`
> **Cmd+P**, `planlar/PasifeAl` yaz. Yolunda **`planlar`** geçen dosyayı aç (`musteriler`'inkini değil). İçine o sohbetteki `src/app/(panel)/planlar/PasifeAlDugmesi.tsx` bloğunu yapıştır, **Cmd+S**.
>
> ### 4-e: `planlar/page.tsx`: mevcut içeriği tamamen değiştir
> Düzenleme sayfasını henüz oluşturmadığımız için tek sonuç çıkacak.
> 1. **Cmd+P**, `planlar/page` yaz, `(panel)/planlar/page.tsx` dosyasını aç.
> 2. **Cmd+A** ile hepsini seç.
> 3. O sohbetteki `src/app/(panel)/planlar/page.tsx` bloğunu yapıştır, **Cmd+S**.
>
> ### 4-f: `planlar/[id]/page.tsx`: yeni dosya
> Boş dosyayı oluştur:
> ```
> touch "src/app/(panel)/planlar/[id]/page.tsx"
> ```
> Sonra **Cmd+P**, `planlar/[id]` yaz. Açacağın dosyanın yolunda **`planlar/[id]/page.tsx`** yazmalı, `musteriler/[id]` olanı değil. İçine o sohbetteki `src/app/(panel)/planlar/[id]/page.tsx` bloğunu yapıştır, **Cmd+S**.
>
> ### 4-g: `not-found.tsx`
> **Cmd+P**, `not-found` yaz, `(panel)/not-found.tsx` dosyasını aç. İçine o sohbetteki `src/app/(panel)/not-found.tsx` bloğunu yapıştır, **Cmd+S**.
>
> ### Küçük kontrol
> ```
> npx tsc --noEmit
> ```
> Beklenen: çıktı yok. Hata çıkarsa tam metnini yapıştır.
>
> Sonucu yaz.

### Prompt 14 · 21 Eki 2026 08:01

````text
ÇIKTI YOK
````

### Claude cevabı 14 · 21 Eki 2026 08:01

> Adım 4 tamam, `tsc` temiz.
>
> ## Adım 5: Kontrol ve çalıştırma
> `tsc` kontrolünü zaten yaptık. Plandaki sıraya göre kalanlar:
>
> ### 5-a: Kod kuralları kontrolü (ESLint)
> ```
> npm run lint
> ```
> Beklenen: hata yok. Birkaç sarı **uyarı** (`warning`) çıkabilir, onlar sorun değil. Kırmızı **hata** (`error`) çıkarsa tam metnini yapıştır.
>
> ### 5-b: Render'ın yapacağı derleme denemesi
> ```
> npm run build
> ```
> Beklenen: Sonda sayfa listesinde yeni yollar görünür: `/musteriler/[id]` ve `/planlar/[id]`. Hata çıkmamalı. Birkaç dakika sürebilir.
>
> İki komutun çıktısını yapıştır. `npm run dev` ile tarayıcıda deneme, çıktıları doğruladıktan sonraki adım.

### Prompt 15 · 21 Eki 2026 08:02

````text
kullanici@bilgisayar abonetakip % npm run lint

> abonetakip@0.1.0 lint
> eslint


/Users/kullanici/Projeler/abonetakip/src/app/(panel)/not-found.tsx
  17:20  error  `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`  react/no-unescaped-entities

✖ 1 problem (1 error, 0 warnings)
````

### Claude cevabı 15 · 21 Eki 2026 08:02

> Lint tek bir hata buldu, bu tam da bu kontrolün işi. Plandaki koddaki bir yazım kuralı: React, metin içinde düz kesme işaretini (`'`) kabul etmiyor. Dosya `src/app/(panel)/not-found.tsx`, satır 17 (`← Dashboard'a dön`). Düzeltme tek satır.
>
> ## Düzeltme
> 1. **Cmd+P**, `not-found` yaz, `(panel)/not-found.tsx` dosyasını aç.
> 2. 17. satırı bul (**Ctrl+G**, `17`, Enter). Şu yazıyor:
>    ```
>    ← Dashboard'a dön
>    ```
> 3. Kesme işaretini şu yazıyla değiştir, geri kalan her şey aynı kalacak:
>    ```
>    ← Dashboard&apos;a dön
>    ```
> 4. **Cmd+S** ile kaydet.
>
> Ekranda yine "Dashboard'a dön" görünecek, `&apos;` kesme işaretinin güvenli yazılışıdır.
>
> ## Tekrar kontrol
> ```
> npm run lint
> ```
> Beklenen: çıktıda `problem` yok. Temiz çıkınca devam edeceğiz. Sonucu yaz.

### Prompt 16 · 21 Eki 2026 08:05

````text
kullanici@bilgisayar abonetakip % npm run lint

> abonetakip@0.1.0 lint
> eslint

kullanici@bilgisayar ab
````

### Claude cevabı 16 · 21 Eki 2026 08:05

> Lint temiz, hata ve uyarı yok. Çıktının sonu kesilmiş ama `problem` satırı görünmüyor.
>
> ## Adım 5-b: Derleme denemesi
> ```
> npm run build
> ```
> Beklenen: Sonda sayfa listesinde yeni yollar görünür: `/musteriler/[id]` ve `/planlar/[id]`. Hata çıkmamalı. Birkaç dakika sürebilir.
>
> Çıktının sonundaki **Route (app)** listesini yapıştır.

### Prompt 17 · 21 Eki 2026 08:06

````text
kullanici@bilgisayar abonetakip % npm run build

> abonetakip@0.1.0 build
> next build

▲ Next.js 16.4.2 (Turbopack)
- Environments: .env
✓ Running next.config.ts took 52ms

  Creating an optimized production build ...
✓ Compiled successfully in 749ms
  Running TypeScript ...
  Finished TypeScript in 1139ms ...
  Collecting page data using 9 workers ...
✓ Collecting page data using 9 workers in 368ms
  Generating static pages using 9 workers (0/12) ...
  Generating static pages using 9 workers (3/12) 
  Generating static pages using 9 workers (6/12) 
  Generating static pages using 9 workers (9/12) 
✓ Generating static pages using 9 workers (12/12) in 68ms
  Finalizing page optimization ...
✓ Finalizing page optimization in 13ms

Route (app)
┌ ƒ /
├ ○ /_not-found
├ ƒ /abonelikler
├ ƒ /ayarlar
├ ƒ /dashboard
├ ƒ /giris
├ ƒ /kayit
├ ƒ /kullanicilar
├ ƒ /musteriler
├ ƒ /musteriler/[id]
├ ƒ /planlar
└ ƒ /planlar/[id]


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
````

### Claude cevabı 17 · 21 Eki 2026 08:06

> Derleme hatasız bitti ve yeni yollar listede: `/musteriler/[id]` ve `/planlar/[id]`.
>
> ## Adım 5-c: Sunucuyu başlat
> ```
> npm run dev
> ```
> `Ready` yazısını görünce tarayıcıda `http://localhost:3000/musteriler` adresini aç. Giriş yapman gerekirse `ayse.deneme@example.com` ile gir.
>
> Beklenen:
> - Üstte "Müşteriler" başlığı.
> - "Yeni müşteri" kartı: **Müşteri adı** ve **E-posta (isteğe bağlı)** alanları, **Müşteri ekle** düğmesi.
> - Altında "Müşteri listesi (0)" ve "Henüz müşteri yok" kutusu, sağda "Pasifleri göster" bağlantısı.
>
> Ardından `http://localhost:3000/planlar` adresini aç. "Yeni plan" kartında **Plan adı**, **Fiyat (TL)**, **Aralık** ve **Plan ekle** düğmesi görünmeli. Altında "Plan listesi (0)" olmalı.
>
> Kırmızı bir `sslmode` uyarı kutusu çıkarsa **Esc** ile kapat, zararsız. Başka bir hata görürsen ekranı ya da hata metnini gönder.
>
> İki sayfanın ekran görüntüsünü at. Sorun yoksa Adım 6'ya (elle testler) geçeceğiz.

### Prompt 18 · 21 Eki 2026 08:08

_[3 ekran görüntüsü eklendi]_

### Claude cevabı 18 · 21 Eki 2026 08:08

> İki sayfa da beklediğimiz gibi açıldı. Müşteri formu, plan formu, boş liste kutuları ve "Pasifleri göster" bağlantısı yerinde. İlk ekran görüntüsündeki kırmızı kutu, daha önce konuştuğumuz `sslmode` uyarısı, zararsız, **Esc** ile kapanıyor. Adım 5 tamam.
>
> ## Adım 6: Elle test senaryoları
> **Test 1 (finance pasife alma):** Planda bu test bugün kodu okuyarak yapılıyor, ikinci kullanıcı Gün 6'da gelecek. Bugün yapılacak bir şey yok.
>
> ## Test 2: Aynı e-posta ile iki müşteri
> `localhost:3000/musteriler` sayfasında sırayla yap. Her adımın sonucunu yaz:
>
> 1. Müşteri adı `Ayşe Demir`, e-posta `ayse@ornek.com`. **Müşteri ekle**. Beklenen: yeşil "Ayşe Demir müşterisi eklendi." mesajı, liste (1) olur ve satır görünür.
> 2. Müşteri adı `Ayşe D.`, e-posta ` AYSE@ornek.com ` (büyük harfli, başında ve sonunda boşluk). **Müşteri ekle**. Beklenen: e-posta alanında "Bu e-posta adresi başka bir müşteride kayıtlı" hatası, yazdıkların formda kalıyor, liste (1) kalıyor.
> 3. Müşteri adı `Mehmet Kaya`, e-posta `mehmet@ornek.com`. Eklenmeli. Sonra listede Mehmet'in **Düzenle** bağlantısına tıkla, e-postayı `ayse@ornek.com` yap, **Değişiklikleri kaydet**. Beklenen: aynı hata.
> 4. Geri dön (`← Müşterilere dön`). Müşteri adı `Boş Bir`, e-posta boş: ekle. Sonra `Boş İki`, e-posta boş: ekle. Beklenen: ikisi de başarılı.
> 5. Ayşe Demir'in **Düzenle** sayfasında "Pasife alma" bölümündeki **Pasife al** düğmesine bas, açılan onay kutusunda **Tamam** de. Beklenen: "Müşteri pasife alındı." Sonra `← Müşterilere dön`: Ayşe Demir listeden kaybolmuş, **Pasifleri göster** ile "Pasif" etiketiyle görünür. Son olarak müşteri adı `Ayşe Yeni`, e-posta `ayse@ornek.com` ekle. Beklenen: yine hata, çünkü kural pasif müşterileri de kapsıyor.
>
> Beklenen gibi olmayan her adımın ekranını ya da mesajını yaz. Hepsi doğruysa "5 adım da beklendiği gibi" yazman yeterli.

### Prompt 19 · 21 Eki 2026 08:10

````text
TEST 1 İÇİN HERHANGİ İR ŞEY YAPMIYIM MI
````

### Claude cevabı 19 · 21 Eki 2026 08:10

> Hayır, Test 1 için bugün hiçbir şey yapma. Planda bu test, ikinci kullanıcı gerektirdiği için Gün 6'ya bırakılmış. İkinci kullanıcı (finance rolü) o gün eklenecek. Şimdilik yalnızca kodda iki katmanlı engel olduğunu biliyoruz:
> - Arayüz: finance kullanıcısına düğme çizilmez.
> - Sunucu: pasife alma işleminin ilk satırı `requireManager()`, finance ise veritabanına hiç gitmeden "yalnızca firma yöneticisi" mesajı döner.
>
> Test 2'ye geç, önceki mesajdaki 5 adımı sırayla yap ve sonuçlarını yaz.

### Prompt 20 · 21 Eki 2026 08:18

````text
çıktılar böyle
````

_[10 ekran görüntüsü eklendi]_

### Claude cevabı 20 · 21 Eki 2026 08:18

> Test 2'nin 5 adımı da beklendiği gibi geçti. Ekran görüntülerine tek tek baktım:
> - Ayşe Demir eklendi, liste (1).
> - `AYSE@ORNEK.COM` ile ikinci ekleme reddedildi, hata e-posta alanında çıktı ve yazdıkların formda kaldı (büyük/küçük harf ve boşluk farkı aşıldı).
> - Mehmet'in e-postasını `ayse@ornek.com` yapmak aynı hatayı verdi.
> - Boş e-postalı iki müşteri eklendi (liste 4).
> - Ayşe Demir pasife alındı. "Pasifleri göster" ile "Pasif" etiketiyle görünüyor.
> - Pasif müşterinin e-postasıyla `Ayşe Yeni` eklemek yine reddedildi, kural pasifleri de kapsıyor.
>
> ## Test 3: Negatif ve hatalı fiyat
> `localhost:3000/planlar` sayfasına git. Plan adı olarak `Başlangıç`, aralık `Aylık` kalsın. **Fiyat (TL)** alanına sırayla şunları yazıp her seferinde **Plan ekle**'ye bas. Yazdığın mesajı beklenenle karşılaştır:
>
> | # | Fiyata yaz | Beklenen mesaj (fiyat alanının altında) |
> |---|---|---|
> | 1 | `-100` | Fiyat 0'dan büyük olmalıdır. |
> | 2 | `0` | Fiyat 0'dan büyük olmalıdır. |
> | 3 | `12,5` | Fiyatı nokta veya virgül kullanmadan, tam sayı olarak yazın (ör. 1000). Kuruş girilmez. |
> | 4 | `1.000` | Aynı mesaj (nokta/virgül uyarısı) |
> | 5 | `abc` | Fiyat yalnızca rakamlardan oluşmalıdır. |
> | 6 | `20000000` | Fiyat en fazla 10.000.000 TL olabilir. |
> | 7 | `1000` | Başarılı: "Başlangıç planı eklendi." mesajı, listede **1.000 TL** ve **Aylık** görünür |
>
> Her hatalı denemede yazdıkların formda kalmalı ve plan listesi (0) olarak kalmalı. Yalnızca 7. satırdan sonra liste (1) olur.
>
> Hepsi beklendiği gibiyse "7 satır da beklendiği gibi" yaz. Farklı çıkan olursa o satırın numarasını ve ekranı gönder.

### Prompt 21 · 21 Eki 2026 08:21

````text
tüm çıktılar beklediğimiz gibi
````

### Claude cevabı 21 · 21 Eki 2026 08:23

> Test 3'ün 7 satırı da geçti: hatalı fiyatlar reddedildi, `1000` kabul edildi ve listede "1.000 TL" göründü.
>
> ## Adım 7: Tenant izolasyonu (3 test)
> Bu adımda ikinci bir firma (Firma B) kuracaksın. Normal tarayıcı penceren **Firma A** olarak kalır, gizli pencere **Firma B** olur. İki pencere ayrı oturum taşır.
>
> ### Hazırlık
> 1. Tarayıcıda gizli pencere aç (Chrome ve Safari'de **Cmd+Shift+N**).
> 2. Gizli pencerede `http://localhost:3000/kayit` adresine git.
> 3. Sahte bilgilerle yeni bir firma kaydı yap. Örnek: firma `Test Firma B`, ad `Burak Test`, e-posta `burak.b@example.com`, parola kendi seçtiğin, gerçek hayatta kullanmadığın bir parola. Gerçek bir parola yazma.
> 4. Kayıttan sonra gizli pencerede Dashboard'u görmelisin.
>
> Firma A penceresinde (normal pencere) en az bir müşteri ve bir plan zaten var. Pasife aldığın "Ayşe Demir" dışında aktif bir müşteri kullan, örneğin "Mehmet Kaya".
>
> ### Test 1: URL ile başka firmanın kaydına erişim
> 1. **Firma A** (normal pencere) `/musteriler` sayfasında bir müşterinin satırına tıkla. Düzenleme sayfası açılır. Adres çubuğundaki adres `http://localhost:3000/musteriler/<uzun-id>` biçimindedir. Adresin tamamını kopyala (Cmd+L, sonra Cmd+C).
> 2. **Firma B** (gizli pencere) yeni sekmede bu adresi yapıştırıp aç.
>    **Beklenen:** "Kayıt bulunamadı" sayfası. Müşteri bilgisi görünmemeli.
> 3. Aynısını plan için yap: Firma A'da `/planlar` sayfasından bir planı aç, adresi (`/planlar/<uzun-id>`) kopyala, gizli pencerede aç.
>    **Beklenen:** yine "Kayıt bulunamadı" sayfası.
>
> ### Test 2: Gizli alanı değiştirip başka firmanın kaydını güncellemeye çalışmak
> 1. **Firma B**'de `/musteriler` sayfasına git ve bir müşteri ekle (örnek: `Deneme Müşteri B`, e-posta boş). Sonra bu müşterinin düzenleme sayfasını aç.
> 2. Geliştirici araçlarını aç: **Chrome'da Cmd+Option+I**. Safari kullanıyorsan önce Safari > Ayarlar > Gelişmiş > "Web geliştirici özelliklerini göster"i işaretle.
> 3. **Elements** sekmesinde (Safari'de "Öğeler"), `name="id"` olan gizli `<input type="hidden">` alanını bul. Cmd+F ile `name="id"` arayabilirsin.
> 4. Bu alanın `value` değerini, Firma A'dan kopyaladığın müşteri id'siyle değiştir (değerin üstüne çift tıkla, düzenle, Enter).
> 5. Sayfadaki **Ad** alanına `DEĞİŞTİRİLDİ` yaz ve kaydet.
>    **Beklenen:** kırmızı "Kayıt bulunamadı." mesajı.
> 6. **Firma A** penceresinde sayfayı yenile (Cmd+R).
>    **Beklenen:** müşteri adı aynen duruyor, `DEĞİŞTİRİLDİ` yazmıyor.
>
> ### Test 3: Liste ve e-posta ayrımı
> 1. **Firma B**'de `/musteriler` listesine bak.
>    **Beklenen:** Firma A'nın müşterileri yok, yalnızca Firma B'nin kendi müşterisi görünür.
> 2. Firma B'de `ayse@ornek.com` e-postasıyla yeni müşteri ekle (örnek ad: `Ayşe B`).
>    **Beklenen:** başarılı, kırmızı hata çıkmaz. Firma A'da bu e-posta kayıtlı, ama benzersizlik kuralı firma bazında olduğu için Firma B etkilenmez ve "bu e-posta başka firmada var" bilgisi de sızmaz.
>
> Üç testin sonucunu yaz. Farklı çıkan olursa hangi test ve adım olduğunu ve ekran görüntüsünü gönder. Hepsi geçerse Adım 8'e (commit) geçeriz.
>
> **Varsayım ve belirsizlik:** Gizli pencerede `localhost:3000` için yeni oturum açılacağını varsayıyorum. Gizli pencere çerezleri normal pencereyle paylaşmaz. Safari'de Elements yerine "Öğeler" sekmesi adı değişebilir. Bulamazsan ekran görüntüsü gönder.

### Prompt 22 · 21 Eki 2026 08:34

````text
elements sekmesinde öyle bir şey ıkmıyor göremiyorum
````

### Claude cevabı 22 · 21 Eki 2026 08:34

> Büyük olasılıkla arama yanlış yerde yapılıyor ya da düzenleme sayfasında değilsin. Önce şunları dene:
>
> 1. Firma B'de adres çubuğu `/musteriler/<uzun-id>` olan düzenleme sayfasında ol. `/musteriler` listesinde bu alan hiç yoktur.
> 2. Geliştirici araçlarında **Elements** sekmesine tıkla, sonra panelin içine bir kez tıkla (arama ancak odak orada olunca çalışır).
> 3. **Cmd+F** bas. Panelin altında küçük bir arama kutusu açılır. Oraya `hidden` yaz ve Enter'a bas. `<input type="hidden" ...>` satırı bulunur.
> 4. Bulamazsan `name="id"` yazıp tekrar dene. Sayfa yenilendiyse aramayı yeniden yap.
>
> Ayrıca bazı satırlar katlıdır (üçgen işaretli). Arama katlı satırların içine de bakar, ama göremezsen `<form` satırının yanındaki üçgene tıklayıp açabilirsin.
>
> Yine bulamazsan terminalde `abonetakip` klasöründeyken şu komutu çalıştır. Kodda bu alanın nasıl kurulduğunu gösterir ve hiçbir secret yazdırmaz:
>
> ```
> grep -n "hidden\|name=\"id\"" "src/app/(panel)/musteriler/MusteriFormu.tsx"
> ```
>
> Çıktıyı gönder. Alan başka bir yöntemle kuruluysa Test 2'yi o yönteme göre yaptırırım. Planı bozmayacağım, sadece aynı testin (başka firmanın id'siyle güncelleme denemesi) doğru yolunu bulacağız.
>
> **Belirsizlik:** Kodundaki gizli alanın adının `id` olduğunu plandan varsayıyorum. Dosyayı bu oturumda göremiyorum.

### Prompt 23 · 21 Eki 2026 08:44

````text
ctrl c yapayıom mı
````

### Claude cevabı 23 · 21 Eki 2026 08:45

> Hayır, Ctrl+C yapma. O terminalde `npm run dev` çalışıyor, durdurursan site kapanır ve testlere devam edemezsin.
>
> Komutu yeni bir terminal sekmesinde çalıştır:
>
> 1. Terminal penceresindeyken **Cmd+T** bas. Yeni bir sekme açılır, eski sekme çalışmaya devam eder.
> 2. Yeni sekmede proje klasörüne geç:
> ```
> cd ~/Projeler/abonetakip
> ```
> 3. Sonra grep komutunu çalıştır:
> ```
> grep -n "hidden\|name=\"id\"" "src/app/(panel)/musteriler/MusteriFormu.tsx"
> ```
>
> Çıktıyı buraya gönder. Dev server sekmesine dokunma.

### Prompt 24 · 21 Eki 2026 08:45

````text
34:        <input type="hidden" name="id" value={props.musteri.id} />
````

### Claude cevabı 24 · 21 Eki 2026 08:45

> Alan kodda var: `<input type="hidden" name="id" value=...>`. Bu alan yalnızca **düzenleme formunda** çıkar. Bu yüzden `/musteriler` listesinde ya da "ekle" formunda arayınca bulunmaz.
>
> Tekrar dene:
>
> 1. **Firma B** (gizli pencere) penceresinde Firma B'nin müşterisine tıkla. Adres çubuğunda `/musteriler/<uzun-id>` yazmalı.
> 2. Geliştirici araçlarında **Elements** sekmesini aç, panelin içine bir kez tıkla.
> 3. **Cmd+F** bas, arama kutusuna `type="hidden"` yaz, Enter'a bas. Şu satır vurgulanır:
>    `<input type="hidden" name="id" value="...">`
> 4. Satırdaki `value="..."` kısmına **çift tıkla**. Değer düzenlenebilir hale gelir. İçindekini sil, Firma A'dan kopyaladığın müşteri id'sini yapıştır (sadece uzun kod, `/musteriler/` kısmı olmadan), Enter'a bas.
> 5. Sayfadaki **Ad** alanına `DEĞİŞTİRİLDİ` yaz, **Kaydet**'e bas.
>    **Beklenen:** "Kayıt bulunamadı." mesajı.
> 6. **Firma A** penceresinde Cmd+R ile yenile. **Beklenen:** müşteri adı aynen duruyor.
>
> Cmd+F yine bulamazsa, Elements'te bir satıra sağ tıkla, sol üstteki **Select element** okuna (imleç simgesi) tıklayıp sayfadaki Ad alanının üstüne gel, tıkla. Seçilen satırın çevresinde `<form>` ve altında bu `hidden` satırı görünür. Ekran görüntüsü gönderirsen yerini söylerim.

### Prompt 25 · 21 Eki 2026 08:53

````text
tamma oldu
````

### Claude cevabı 25 · 21 Eki 2026 08:53

> Test 2 için "Kayıt bulunamadı." mesajını gördüğünü ve Firma A'daki müşterinin değişmediğini varsayıyorum. Farklı bir şey olduysa söyle.
>
> ## Test 3: Liste ve e-posta ayrımı
> 1. **Firma B** (gizli pencere) penceresinde `/musteriler` sayfasına git.
>    **Beklenen:** Firma A'nın müşterileri (Mehmet Kaya, boş e-postalı iki müşteri vb.) listede yok. Yalnızca Firma B'ye eklediğin müşteri var. "Pasifleri göster"i açsan da Firma A'nın pasif müşterisi (Ayşe Demir) çıkmamalı.
> 2. Aynı sayfada **Ekle** formuna şunları yaz:
>    - Ad: `Ayşe B`
>    - E-posta: `ayse@ornek.com`
> 3. **Müşteri ekle**'ye bas.
>    **Beklenen:** yeşil başarı mesajı, liste Firma B'de bir müşteri daha gösterir. "Bu e-posta başka bir müşteride kayıtlı" hatası **çıkmamalı**. Firma A'da bu e-posta kayıtlı, ama kural firma bazında olduğu için Firma B etkilenmez ve başka firmada kayıt olduğu bilgisi sızmaz.
>
> Sonuçları yaz. Test 1 (URL ile erişim, müşteri ve plan) için de "Kayıt bulunamadı" sayfasını gördün mü? Henüz yapmadıysan onu da yap ve sonucu bildir. Üçü de geçince Adım 8'e (commit) geçeriz.

### Prompt 26 · 21 Eki 2026 08:54

````text
adım 8 e geç
````

### Claude cevabı 26 · 21 Eki 2026 08:54

> Tamam. Test 1 ve Test 3'ü onaylamadın ama devam ediyorum. Bu iki test commit'i engellemiyor, istersen sonra tamamlarsın.
>
> ## Adım 8: Commit
>
> Komutları **ikinci terminal sekmesinde** (dev server çalışan sekmede değil) çalıştır. İlk olarak proje klasöründe olduğundan emin ol:
>
> ```
> cd ~/Projeler/abonetakip
> ```
>
> Sonra değişen ve yeni dosyaları listele. Bu komut bir şeyi değiştirmez, yalnızca gösterir:
>
> ```
> git status
> ```
>
> Çıktıyı buraya gönder. Şunlara bakacağım:
> - `.env` listede **olmamalı**.
> - `tsconfig.tsbuildinfo` olmamalı.
> - `docs/04_14_Gunluk_Prompt_Plani.md` olmamalı.
> - Beklenen dosyalar: `prisma/schema.prisma`, yeni migration klasörü, `src/lib/validation.ts`, `src/lib/islem.ts`, `src/lib/abonelik-kontrol.ts`, `src/components/ui/IslemMesaji.tsx`, `src/app/(panel)/musteriler/...`, `src/app/(panel)/planlar/...`, `src/app/(panel)/not-found.tsx`.
>
> Çıktıyı görmeden `git add` yapma.

### Prompt 27 · 21 Eki 2026 08:55

````text
kullanici@bilgisayar abonetakip % git status
Üzerinde bulunulan dal: feat/gun-04-musteri-plan
İşleme için hazırlanmamış değişiklikler:
  (işlenecekleri güncellemek için "git add <dosya>..." kullanın)
  (çalışma dizinindeki değişiklikleri atmak için
    "git restore <dosya>..." kullanın)
değiştirildi:         prisma/schema.prisma
değiştirildi:         src/app/(panel)/musteriler/page.tsx
değiştirildi:         src/app/(panel)/planlar/page.tsx
değiştirildi:         src/lib/validation.ts

İzlenmeyen dosyalar:
  (işlenecekler arasına koymak için "git add <dosya>..." kullanın)
prisma/migrations/20261021043736_musteri_eposta_benzersiz/
src/app/(panel)/musteriler/MusteriFormu.tsx
src/app/(panel)/musteriler/PasifeAlDugmesi.tsx
src/app/(panel)/musteriler/[id]/
src/app/(panel)/musteriler/actions.ts
src/app/(panel)/not-found.tsx
src/app/(panel)/planlar/PasifeAlDugmesi.tsx
src/app/(panel)/planlar/PlanFormu.tsx
src/app/(panel)/planlar/[id]/
src/app/(panel)/planlar/actions.ts
src/components/ui/IslemMesaji.tsx
src/lib/abonelik-kontrol.ts
src/lib/islem.ts

İşlemeye eklenen değişiklik yok ("git add" ve/veya "git commit -a" kullanın)
````

### Claude cevabı 27 · 21 Eki 2026 08:55

> Liste tam beklediğim gibi: `.env`, `tsconfig.tsbuildinfo` ve `docs/04_14...` yok. 4 dosya değişmiş, 13 yeni dosya ya da klasör var.
>
> Şimdi repoya Neon adresi ya da parola girmediğini kontrol et. Sadece arar, hiçbir şeyi değiştirmez:
>
> ```
> git grep -n -e "neon.tech" -e "npg_"
> ```
>
> **Beklenen:** çıktı tamamen boş, komut hiçbir şey yazmadan biter. Bir satır çıkarsa gönderme. Önce o dosyanın adını söyle, satırın içeriğini yazma, çünkü içinde parola olabilir.
>
> Not: `git grep` yalnızca izlenen dosyalara bakar. Yeni dosyaları `git add` sonrasında da bir kez kontrol edeceğiz.

### Prompt 28 · 21 Eki 2026 08:56

````text
kullanici@bilgisayar abonetakip % git grep -n -e "neon.tech" -e "npg_"
CLAUDE.md:66:- `.env.example` yalnızca yer tutucu içerir (`[NEON_POOLED_URL]`). Gerçek adres veya parola asla yazılmaz. Commit öncesi `git grep -n -e "neon.tech" -e "npg_"` ile kontrol et.
docs/00_Kurulum_Rehberi.md:163:1. https://console.neon.tech adresinde Neon hesabınla giriş yap, **Create project** (veya New project) de.
docs/02_ADR.md:67:- **Güvenlik olayı ve ders:** `.env.example` dosyasına yanlışlıkla gerçek bağlantı adresi yazıldı ve herkese açık depoya gönderildi. Neon parolası değiştirilerek sızıntı etkisiz hâle getirildi, dosya yer tutucularla düzeltildi. Kural: `.env.example` yalnızca yer tutucu içerir, commit öncesi `git grep -n -e "neon.tech" -e "npg_"` ile kontrol edilir.
````

### Claude cevabı 28 · 21 Eki 2026 08:56

> Üç satır da sorun değil. Hiçbirinde gerçek adres ya da parola yok:
> - `CLAUDE.md:66` ve `docs/02_ADR.md:67`: kuralın kendisini anlatan cümle. Komutun metni geçtiği için çıktıya düşüyor.
> - `docs/00_Kurulum_Rehberi.md:163`: sadece `console.neon.tech` giriş sayfası bağlantısı.
>
> Yeni dosyalardan hiçbiri çıktıda yok. Yeni dosyalar henüz izlenmediği için `git grep` onlara bakmadı. Bu yüzden önce dosyaları commit'e hazırla, sonra aynı kontrolü tekrar edeceğiz.
>
> Tüm değişiklikleri commit'e hazırlar. Henüz commit oluşturmaz:
>
> ```
> git add -A
> ```
>
> Çıktı vermezse sorun yok. Bitince yaz, bir sonraki komutu vereyim.

### Prompt 29 · 21 Eki 2026 08:57

````text
çıktı vermedi ,
````

### Claude cevabı 29 · 21 Eki 2026 08:57

> Şimdi kontrolü tekrar yap. Bu kez yeni dosyalar da izleniyor, o yüzden onlara da bakar:
>
> ```
> git grep -n -e "neon.tech" -e "npg_"
> ```
>
> **Beklenen:** önceki üç satır aynen çıkar (`CLAUDE.md:66`, `docs/00_Kurulum_Rehberi.md:163`, `docs/02_ADR.md:67`) ve **başka hiçbir satır çıkmaz**. Yeni dosyalardan (`src/...`, `prisma/...`) tek satır bile çıkarsa dosya adını söyle, satırın içeriğini yazma.

### Prompt 30 · 21 Eki 2026 08:58

````text
kullanici@bilgisayar abonetakip % git grep -n -e "neon.tech" -e "npg_"
CLAUDE.md:66:- `.env.example` yalnızca yer tutucu içerir (`[NEON_POOLED_URL]`). Gerçek adres veya parola asla yazılmaz. Commit öncesi `git grep -n -e "neon.tech" -e "npg_"` ile kontrol et.
docs/00_Kurulum_Rehberi.md:163:1. https://console.neon.tech adresinde Neon hesabınla giriş yap, **Create project** (veya New project) de.
docs/02_ADR.md:67:- **Güvenlik olayı ve ders:** `.env.example` dosyasına yanlışlıkla gerçek bağlantı adresi yazıldı ve herkese açık depoya gönderildi. Neon parolası değiştirilerek sızıntı etkisiz hâle getirildi, dosya yer tutucularla düzeltildi. Kural: `.env.example` yalnızca yer tutucu içerir, commit öncesi `git grep -n -e "neon.tech" -e "npg_"` ile kontrol edilir.
````

### Claude cevabı 30 · 21 Eki 2026 08:59

> Aynı üç satır çıktı, yeni dosyalardan hiçbir şey yok. Yani repoya secret girmiyor.
>
> Şimdi commit'i oluştur. Bu komut değişiklikleri yerel geçmişe kaydeder, henüz GitHub'a göndermez:
>
> ```
> git commit -m "feat: müşteri ve plan yönetimi" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6"
> ```
>
> **Beklenen:** `[feat/gun-04-musteri-plan ...] feat: müşteri ve plan yönetimi` ile başlayan bir özet ve altında "17 files changed" gibi bir satır çıkar. Çıktıyı gönder.

### Prompt 31 · 21 Eki 2026 08:59

````text
kullanici@bilgisayar abonetakip % git commit -m "feat: müşteri ve plan yönetimi" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6"
[feat/gun-04-musteri-plan d654850] feat: müşteri ve plan yönetimi
 17 files changed, 1336 insertions(+), 15 deletions(-)
 create mode 100644 prisma/migrations/20261021043736_musteri_eposta_benzersiz/migration.sql
 create mode 100644 src/app/(panel)/musteriler/MusteriFormu.tsx
 create mode 100644 src/app/(panel)/musteriler/PasifeAlDugmesi.tsx
 create mode 100644 src/app/(panel)/musteriler/[id]/page.tsx
 create mode 100644 src/app/(panel)/musteriler/actions.ts
 create mode 100644 src/app/(panel)/not-found.tsx
 create mode 100644 src/app/(panel)/planlar/PasifeAlDugmesi.tsx
 create mode 100644 src/app/(panel)/planlar/PlanFormu.tsx
 create mode 100644 src/app/(panel)/planlar/[id]/page.tsx
 create mode 100644 src/app/(panel)/planlar/actions.ts
 create mode 100644 src/components/ui/IslemMesaji.tsx
 create mode 100644 src/lib/abonelik-kontrol.ts
 create mode 100644 src/lib/islem.ts
````

### Claude cevabı 31 · 21 Eki 2026 08:59

> Commit oluştu (`d654850`, 17 dosya). Şimdi GitHub'a gönderiyoruz, her zamanki gibi GitHub Desktop ile:
>
> 1. **GitHub Desktop**'ı aç. Üstte dal adı `feat/gun-04-musteri-plan` olmalı.
> 2. Sağ üstteki **Publish branch** düğmesine bas. Bu dalı GitHub'a yükler.
> 3. Yükleme bitince **Create Pull Request** düğmesi çıkar, ona bas. Tarayıcıda GitHub'ın PR sayfası açılır.
> 4. PR başlığı commit mesajından gelir (`feat: müşteri ve plan yönetimi`). Açıklama (description) kutusuna şunu yaz:
>
> ```
> Closes #3
>
> Müşteri ve plan yönetimi: ekleme, düzenleme, pasife alma. Müşteri e-postası firma bazında benzersiz. Plan fiyatı tam sayı TL ve doğrulanır. Tenant izolasyonu testleri geçti.
>
> 🤖 Generated with [Claude Code](https://claude.ai/code)
>
> https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6
> ```
>
> 5. **Create pull request** düğmesine bas. Sayfanın ekran görüntüsünü gönder.
>
> Merge etmeden önce bekle. Render'daki deploy ve testleri onayla ondan sonra yapacağız.
>
> **Not:** PR açıklamasında "Tenant izolasyonu testleri geçti" yazıyor. Test 1 ve Test 3'ü henüz onaylamadın. Onları yapmadıysan o cümleyi silebilirsin.

### Prompt 32 · 21 Eki 2026 09:01

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 32 · 21 Eki 2026 09:01

> PR #16 doğru görünüyor: `feat/gun-04-musteri-plan` → `main`, 1 commit, 17 dosya, "No conflicts with base branch", sağda Development'ta #3 bağlı ("Müşteri ve plan yönetimi"). Checks 0 olması normal, bu repoda otomatik test yok.
>
> Açıklamada "Tenant izolasyonu testleri geçti" yazıyor. Sen Test 1 ve Test 3'ü onaylamadığın için dürüst olması adına önce bunları tamamlamanı öneririm, çünkü merge etmek canlıya Render'ı tetikler.
>
> ## Önce eksik iki testi bitir (yaklaşık 3 dakika)
> Gizli pencerede (Firma B) şunları yap, ikisi de localhost'ta yapılır:
> 1. **Test 1:** Firma A'dan kopyaladığın `/musteriler/<id>` adresini aç → "Kayıt bulunamadı" sayfası çıkmalı. Aynısını `/planlar/<id>` için yap.
> 2. **Test 3:** Firma B `/musteriler` listesinde Firma A'nın müşterileri olmamalı. `ayse@ornek.com` ile "Ayşe B" eklemek başarılı olmalı.
>
> Sonuçları yaz. İkisi de geçerse **Merge pull request** düğmesine bas, sonra **Confirm merge** de. Bir şey farklı çıkarsa merge etme, bana ekran görüntüsünü gönder.

### Prompt 33 · 21 Eki 2026 09:02

````text
ikisini de onaylıyotum
````

### Claude cevabı 33 · 21 Eki 2026 09:02

> Tamam, üç izolasyon testi de geçti, PR açıklaması doğru.
>
> ## Merge
> 1. GitHub PR sayfasında yeşil **Merge pull request** düğmesine bas.
> 2. Çıkan **Confirm merge** düğmesine bas.
> 3. "Pull request successfully merged" yazısını ve #3'ün kapandığını görmelisin. Dal silme önerisi çıkarsa **Delete branch** diyebilirsin.
>
> Sonra ikinci terminal sekmesinde, yerel `main`'i güncelle. İlk komut ana dala geçer:
>
> ```
> git switch main
> ```
>
> Bu komut GitHub'daki yeni halini yerel `main`'e çeker:
>
> ```
> git pull
> ```
>
> **Beklenen:** `git pull` çıktısında 17 dosyanın değiştiği (`17 files changed`) görünür. Çıktıyı gönder.
>
> Merge sonrası Render otomatik deploy başlatır. 3-5 dakika içinde Render panelinde **Live** olmalı. Migration zaten Neon'a uygulandığı için ek bir şey gerekmez, canlı site aynı veritabanını kullanıyor.

### Prompt 34 · 21 Eki 2026 09:03

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 34 · 21 Eki 2026 09:03

> PR #16 merge edildi (`7f0a732`, `main`). #3 kapandı. Şimdi sırayla:
>
> 1. **Dalı sil:** Sayfadaki **Delete branch** düğmesine bas. Değişiklikler `main`'de olduğu için güvenli.
>
> 2. **Yerel `main`'i güncelle.** İkinci terminal sekmesinde, `abonetakip` klasöründeyken, ana dala geç:
> ```
> git switch main
> ```
>
> 3. GitHub'daki yeni halini çek:
> ```
> git pull
> ```
>
> **Beklenen:** çıktıda `Fast-forward` ve 17 dosyanın değiştiği (`17 files changed`) görünür. Çıktıyı gönder.
>
> 4. **Render'ı kontrol et:** Render panelinde `abonetakip` servisinde yeni bir deploy başlamış olmalı. Durum **Live** olunca (3-5 dakika) haber ver.

### Prompt 35 · 21 Eki 2026 09:04

````text
kullanici@bilgisayar abonetakip % git pull
remote: Enumerating objects: 1, done.
remote: Counting objects: 100% (1/1), done.
remote: Total 1 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
Nesneler açılıyor: 100% (1/1), 943 bayt | 943.00 KiB/sn, bitti.
Şu konumdan: https://github.com/ozgesoganci1-bot/abonetakip
   7dda151..7f0a732  main       -> origin/main
Güncelleniyor: 7dda151..7f0a732
Fast-forward
 prisma/migrations/20261021043736_musteri_eposta_benzersiz/migration.sql |   8 ++
 prisma/schema.prisma                                                    |   7 +-
 src/app/(panel)/musteriler/MusteriFormu.tsx                             |  68 ++++++++++++
 src/app/(panel)/musteriler/PasifeAlDugmesi.tsx                          |  52 +++++++++
 src/app/(panel)/musteriler/[id]/page.tsx                                |  83 ++++++++++++++
 src/app/(panel)/musteriler/actions.ts                                   | 234 ++++++++++++++++++++++++++++++++++++++++
 src/app/(panel)/musteriler/page.tsx                                     | 102 ++++++++++++++++--
 src/app/(panel)/not-found.tsx                                           |  21 ++++
 src/app/(panel)/planlar/PasifeAlDugmesi.tsx                             |  49 +++++++++
 src/app/(panel)/planlar/PlanFormu.tsx                                   | 114 ++++++++++++++++++++
 src/app/(panel)/planlar/[id]/page.tsx                                   |  79 ++++++++++++++
 src/app/(panel)/planlar/actions.ts                                      | 185 +++++++++++++++++++++++++++++++
 src/app/(panel)/planlar/page.tsx                                        | 110 +++++++++++++++++--
 src/components/ui/IslemMesaji.tsx                                       |  21 ++++
 src/lib/abonelik-kontrol.ts                                             |  40 +++++++
 src/lib/islem.ts                                                        |  40 +++++++
 src/lib/validation.ts                                                   | 138 ++++++++++++++++++++++++
 17 files changed, 1336 insertions(+), 15 deletions(-)
 create mode 100644 prisma/migrations/20261021043736_musteri_eposta_benzersiz/migration.sql
 create mode 100644 src/app/(panel)/musteriler/MusteriFormu.tsx
 create mode 100644 src/app/(panel)/musteriler/PasifeAlDugmesi.tsx
 create mode 100644 src/app/(panel)/musteriler/[id]/page.tsx
 create mode 100644 src/app/(panel)/musteriler/actions.ts
 create mode 100644 src/app/(panel)/not-found.tsx
 create mode 100644 src/app/(panel)/planlar/PasifeAlDugmesi.tsx
 create mode 100644 src/app/(panel)/planlar/PlanFormu.tsx
 create mode 100644 src/app/(panel)/planlar/[id]/page.tsx
 create mode 100644 src/app/(panel)/planlar/actions.ts
 create mode 100644 src/components/ui/IslemMesaji.tsx
 create mode 100644 src/lib/abonelik-kontrol.ts
 create mode 100644 src/lib/islem.ts
kullanici@bilgisayar abonetakip %
````

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 35 · 21 Eki 2026 09:05

> Hem yerel hem canlı taraf tamam:
> - `git pull` Fast-forward ile `7dda151..7f0a732` aldı, 17 dosya, 1336 ekleme.
> - Render'da `7f0a732` **Live**, deploy 1 dk 11 sn'de bitti.
>
> ## Canlı site testi (kısa)
> Terminal sekmesine ihtiyacın yok, sadece tarayıcı:
>
> 1. `https://abonetakip.onrender.com` adresini aç. Ücretsiz sunucu uyumuş olabilir, ilk açılış 50 saniye sürebilir.
> 2. Giriş yap (Firma A hesabınla).
> 3. `/musteriler` sayfasına git. **Beklenen:** Yerel testte eklediğin müşteriler burada da görünür (aynı Neon veritabanını kullanıyoruz), ekle formu çalışır.
> 4. `/planlar` sayfasına git. **Beklenen:** `Başlangıç` planı **1.000 TL / Aylık** olarak görünür.
> 5. Bir müşteriye tıkla. **Beklenen:** düzenleme sayfası açılır.
>
> Çıkan sonucu yaz ("canlıda da çalışıyor" yeterli). Sorun olursa ekran görüntüsü gönder.
>
> Bunu onaylayınca Gün 4 kayıtlarına geçeceğiz: Prompt Günlüğü satırı, README/ADR notları ve proje panosu (#3 Done).

### Prompt 36 · 21 Eki 2026 09:06

````text
şey müşterlerde ve planlarda bir şey göükmüyor boş olarak gözüküyor
````

### Claude cevabı 36 · 21 Eki 2026 09:06

> Bu büyük olasılıkla bir hata değil, tenant izolasyonunun çalışması. Her firma yalnızca kendi kayıtlarını görür. Canlıda farklı bir firma hesabıyla giriş yapmış olabilirsin, o firmanın henüz müşterisi ve planı yoktur.
>
> Şunu kontrol et:
>
> 1. Canlı sitede, sol menüde (ya da üstte) **firma adına ve kullanıcı e-postasına** bak. Hangi firma olduğunu not et.
> 2. Yerel sitede (`localhost:3000`), Firma A hesabında aynı yere bak. Müşteri ve planların olduğu firma bu.
> 3. İkisi **farklı firmaysa**: canlıda çıkış yap, yerelde kullandığın Firma A hesabının e-postasıyla giriş yap. Müşteriler ve plan görünmeli. Bu, iki ortamın aynı veritabanını kullandığını doğrular.
> 4. İkisi **aynı firmaysa** (aynı ad, aynı e-posta) ve canlıda hâlâ boşsa: canlı site ayrı bir veritabanına bağlı demektir. Bu durumda dur, ekran görüntüsü gönder. Render'daki `DATABASE_URL` ile ilgili bir şey olabilir. Değerini asla yazma ya da gönderme, ekran görüntüsünde de görünmesin.
>
> Canlıdaki sayfanın ekran görüntüsünü (sol menüdeki firma adı görünecek şekilde) ve yerel sayfanın aynı bölümünü gönder, karşılaştırayım.
>
> **Belirsizlik:** Gün 2'de yerel ve Render'ın aynı Neon veritabanını kullandığını not almıştım. Doğrulamadan emin olamam, o yüzden 4. maddeyi ekledim.

### Prompt 37 · 21 Eki 2026 09:08

````text
canlıda çıkış yap derken ne yapmam gerekiyor tam olarak
````

### Claude cevabı 37 · 21 Eki 2026 09:08

> Canlı sitede (`https://abonetakip.onrender.com`) panelin sol menüsünün en altında (ya da üst köşede) **Çıkış** düğmesi var. Ona bas, giriş sayfasına yönlendirilirsin.
>
> Sonra aynı sayfada şunları yap:
> 1. **E-posta** alanına yerelde (localhost) Firma A için kullandığın e-postayı yaz. Mehmet Kaya ve plan kayıtlarını eklediğin hesap bu.
> 2. Parolanı yaz ve **Giriş yap**'a bas.
> 3. `/musteriler` ve `/planlar` sayfalarına bak.
>
> **Beklenen:** Yerelde eklediğin müşteriler ve `Başlangıç` planı görünür.
>
> Hangi e-postayı kullandığını hatırlamıyorsan, yerel sitede (`localhost:3000`) sol menüde ya da kullanıcı alanında e-postanın yazıp yazmadığına bak. Yazmıyorsa söyle, başka bir yoldan bulalım. Parolanı bana yazma.

### Prompt 38 · 21 Eki 2026 09:09

````text
ben ayşe denemyi eklemişim yerele
````

### Claude cevabı 38 · 21 Eki 2026 09:09

> Tamam, yerelde kullandığın hesap `ayse.deneme@example.com`. Canlıda çıkış yaptıktan sonra bu e-postayla giriş yap (parolayı bana yazma) ve `/musteriler` ile `/planlar` sayfalarına bak.
>
> Şu iki sonuçtan birini bekliyorum:
>
> - **Müşteriler ve plan görünürse:** önceki giriş başka bir firmanın hesabıydı, her şey yolunda. Haber ver, kayıtlara geçeriz.
> - **Hâlâ boşsa ya da bu e-postayla giriş yapamıyorsan:** canlı site muhtemelen ayrı bir veritabanına bağlı. Ekran görüntüsü gönder (sol menüde firma adı görünsün). `DATABASE_URL` değerini asla yazma ya da gösterme.
>
> Giriş yaparken e-posta/parola hatası alırsan bunu da yaz, çünkü o da canlının ayrı veritabanı kullandığına işaret eder.

### Prompt 39 · 21 Eki 2026 09:10

````text
evet hata aldım
````

### Claude cevabı 39 · 21 Eki 2026 09:10

> Hata aldıysan bunun iki olası nedeni var: canlı site ayrı bir veritabanına bağlı olabilir ya da canlıda farklı bir parola yazmış olabilirsin. Veritabanına bakarak ayırt edeceğiz.
>
> ## Adım 1: Neon'da hangi kullanıcılar var
> 1. Tarayıcıda **Neon Console** sekmesine git, projeni ve veritabanını seç.
> 2. Soldan **SQL Editor**'ü aç.
> 3. Şu sorguyu yapıştır ve **Run**'a bas. Parola özetini getirmez, yalnızca e-posta ve rolü gösterir:
>
> ```
> SELECT email, role FROM users;
> ```
>
> **Beklenen:** `ayse.deneme@example.com` (manager) ve az önce Firma B için kaydettiğin e-posta (manager) listelenir.
>
> Tablo adı `users` değilse hata verir. Hata mesajını gönder, doğru adı bulalım.
>
> Sonucu buraya gönder. Neon'da kaç farklı veritabanı (ya da branch) olduğunu da yaz: sol üstte ya da Branches kısmında birden fazla var mı?
>
> Bir de canlıda aldığın hata mesajının tam metnini yaz (örneğin "E-posta veya parola hatalı").

### Prompt 40 · 21 Eki 2026 09:12

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 40 · 21 Eki 2026 09:13

> Veritabanı tek ve ortak. Neon'da `production` branch'inde 3 kullanıcı var, yerel ve canlı aynı yere bakıyor:
>
> - `ali.canli@example.com`: büyük olasılıkla canlıda daha önce kaydolup girdiğin hesap (başka bir firma)
> - `ayse.deneme@example.com`: yerelde kullandığın Firma A
> - `burak.b@example.com`: bugün açtığın Firma B
>
> Yani canlıda boş görmen bozuk bir şey olduğunu göstermiyor. Muhtemelen `ali.canli` hesabıyla girmiştin, o firmanın müşterisi ve planı yok. `ayse.deneme` ile aldığın hata da büyük olasılıkla parola farkı: yerelde ve canlıda aynı parolayı yazman gerekiyor, çünkü hesap tek.
>
> ## Canlıyı şöyle test edelim
> 1. Canlı sitede `ali.canli@example.com` ile (hatırladığın parolayla) giriş yap. Sol menüde firma adına bak.
> 2. `/planlar` sayfasında `Canlı Test` adıyla **500** TL, **Aylık** bir plan ekle. **Beklenen:** yeşil başarı mesajı ve listede **500 TL**.
> 3. `/musteriler` sayfasında `Canlı Müşteri` adıyla (e-posta boş) bir müşteri ekle. **Beklenen:** başarı mesajı ve listede görünür.
>
> Bunlar canlıda ekleme, listeleme ve doğrulamanın çalıştığını gösterir. Eklediklerin `ali.canli` firmasında kalır, `ayse.deneme` firmasının verisine karışmaz.
>
> `ali.canli` ile de giriş yapamazsan hata mesajının tam metnini yaz. Parolayı unuttuysan söyle, çünkü projede parola sıfırlama özelliği yok (kapsam dışı). Hangi hesapla devam edeceğimizi birlikte seçeriz.
>
> **Varsayım:** `ali.canli` hesabını Gün 3'te canlıda sen açtın. Emin değilsen söyle.

### Prompt 41 · 21 Eki 2026 09:14

````text
tamam müşteri ve planı başarıyla kaydettim ali hesabında
````

### Claude cevabı 41 · 21 Eki 2026 09:14

> Canlıda ekleme, listeleme ve doğrulama çalışıyor, canlı test tamam. Gün 4'ün kodu bitti.
>
> Sırada Gün 4 kayıtları var. Önce hangi dosyaların nasıl durduğuna bakmam gerekiyor, çünkü o dosyalar senin bilgisayarında. Terminalde, ikinci sekmede, `abonetakip` klasöründeyken şunu çalıştır. Dosyanın sonundaki son satırları gösterir, hiçbir şeyi değiştirmez:
>
> ```
> tail -n 15 docs/03_Prompt_Gunlugu.md
> ```
>
> Çıktıyı gönder. Mevcut satır biçimini (sütunları) görüp Gün 4 satırını aynı biçimde yazacağım. Bu arada yeni bir dal da açacağız (`docs/gun-04-kayitlar`), çünkü `main`'e doğrudan değişiklik yapmıyoruz.

### Prompt 42 · 21 Eki 2026 09:15

````text
kullanici@bilgisayar abonetakip % tail -n 15 docs/03_Prompt_Gunlugu.md
## Sonuç notları

- **Hangi turda çıktı en çok değişti?** [doldur]
- **Hangi bileşen (rol, bağlam, kısıt, format, doğrulama) en fazla fark yarattı?** [doldur]
- **Çıktıdaki hangi varsayım benim için yanlıştı?** [doldur]
- **Zero shot, few shot ve chain of thought'tan hangisini kullandım?** (Tur 3'teki "önce şunları düşün" kısmı chain of thought'tur.) [doldur]

## Proje boyunca ek kayıtlar

Her günün promptu ve çıktısı için aşağıya kısa kayıt ekle (ayrıntı `04_14_Gunluk_Prompt_Plani.md` dosyasında).

| 1 | Gün 1 promptu: 7 issue ve README taslağı istendi | 7 issue ve README üretildi | Evet: gün aralıkları, README bağlantıları, riskli abonelik kuralı ve MRR grafiği süresi planımıza göre düzeltildi |
| 2 | Gün 2 promptu: Prisma şeması, Neon bağlantısı ve ilk deploy istendi | Prisma 7 şeması, geçiş adımları ve Render kurulumu üretildi | Evet: dosya yolu `~/Projeler/abonetakip`, git adımları GitHub Desktop'a uyarlandı, README/ADR dosya adları düzeltildi. Süreçte `.env.example` içine yanlışlıkla gerçek adres girdi, fark edilip Neon parolası yenilendi |
| 3 | Gün 3 promptu: kayıt, giriş, roller ve merkezi tenant filtresi için plan istendi. Plan ayrı bir sohbette onaylandı, kod bu sohbette parça parça üretildi | İmzalı çerezle oturum, bcrypt ile parola, kayıt/giriş sayfaları, panel iskeleti ve merkezi tenant filtresi üretildi | Evet: dosya yolları hatalıydı (db.ts, auth.ts ve tenant.ts yanlış klasöre açılmıştı, taşındı), tsc ile doğrulandı. Prisma Studio hata verdi, kontroller Neon SQL Editor ile yapıldı. 8 manuel test ve canlıda kayıt testi geçti |
| 3b | Arayüzü profesyonelleştirme fikri soruldu. Plan sohbette yazıldı ve onaylandı (sol kenar menü, yumuşak indigo, ek paket yok), kod 4 parçada üretildi | Ortak arayüz bileşenleri, kenar menülü panel yerleşimi, yeni giriş/kayıt ve panel sayfaları üretildi | Evet: Tailwind 4 ve Geist kullanımı kontrol edildi, mevcut dosyaların içeriği gösterilip alan adları korundu. Geliştirme modunda pg sslmode uyarısı çıktı, zararsız bulunup Gün 12e ertelendi. tsc, build, finance rol testi ve canlı kontrol geçti |
````

### Claude cevabı 42 · 21 Eki 2026 09:15

> Biçimi gördüm: tablo `| numara | prompt | çıktı | düzeltmeler |` sütunlarından oluşuyor ve en son satır 3b. Gün 4 satırını onun altına ekleyeceğiz.
>
> ## Adım 1: Yeni dal aç
> İkinci terminal sekmesinde, `abonetakip` klasöründeyken. Bu komut `main`'den `docs/gun-04-kayitlar` adında yeni bir dal açar ve ona geçer:
>
> ```
> git switch -c docs/gun-04-kayitlar
> ```
>
> **Beklenen:** `Yeni bir '...' dalına geçildi` benzeri bir mesaj. Sonucu yaz.
>
> ## Adım 2: Prompt Günlüğüne Gün 4 satırını ekle
> Dal açıldıktan sonra:
>
> 1. VS Code'da **Cmd+P** bas, `03_Prompt_Gunlugu` yaz, Enter'a bas.
> 2. En alta in (Cmd+Aşağı ok). Son satır `| 3b | ...` ile başlayan satır. İmleci o satırın **en sonuna** koy (satırdayken Cmd+Sağ ok), **Enter** bas ve aşağıdaki satırı yapıştır. Mevcut satırlara dokunma:
>
> ```
> | 4 | Gün 4 promptu: müşteri ve plan yönetimi için plan ve kod istendi. Plan ve kod ayrı bir sohbette üretildi, bu sohbette adım adım uygulatıldı | Müşteri/plan ekleme, düzenleme ve pasife alma, sunucu tarafı doğrulama, firma bazında benzersiz e-posta (`@@unique([tenantId, email])`), plan fiyatı kontrolleri ve "Kayıt bulunamadı" sayfası üretildi | Evet: plandaki yinelenen doğrulama yerine mevcut `validation.ts` yeniden kullanıldı, `abonelik-kontrol.ts` ham `prisma` yerine `getTenantDb()` kullanacak şekilde düzeltildi. ESLint `react/no-unescaped-entities` hatası `&apos;` ile giderildi. Migration'daki `DROP INDEX` kontrolü yapıldı. Fiyat, e-posta tekrarı, pasife alma ve tenant izolasyonu (URL ve gizli alan oynama) testleri geçti, canlıda ekleme/listeleme çalıştı |
> ```
>
> 3. **Cmd+S** ile kaydet.
>
> Satırı eklediğinde `tail -n 3 docs/03_Prompt_Gunlugu.md` ile kontrol edelim. Bitince yaz.
>
> **Not:** "Plandaki yinelenen doğrulama" ve `abonelik-kontrol.ts` düzeltmeleri önceki özetimdeki kayda dayanıyor. Gerçekte farklıysa söyle, satırı düzeltiriz.

### Prompt 43 · 21 Eki 2026 09:18

````text
gerçekte aynı ,
````

_[yapıştırılan metin]_

````text
kullanici@bilgisayar abonetakip % tail -n 15 docs/03_Prompt_Gunlugu.md
## Sonuç notları

- **Hangi turda çıktı en çok değişti?** [doldur]
- **Hangi bileşen (rol, bağlam, kısıt, format, doğrulama) en fazla fark yarattı?** [doldur]
- **Çıktıdaki hangi varsayım benim için yanlıştı?** [doldur]
- **Zero shot, few shot ve chain of thought'tan hangisini kullandım?** (Tur 3'teki "önce şunları düşün" kısmı chain of thought'tur.) [doldur]

## Proje boyunca ek kayıtlar

Her günün promptu ve çıktısı için aşağıya kısa kayıt ekle (ayrıntı `04_14_Gunluk_Prompt_Plani.md` dosyasında).

| 1 | Gün 1 promptu: 7 issue ve README taslağı istendi | 7 issue ve README üretildi | Evet: gün aralıkları, README bağlantıları, riskli abonelik kuralı ve MRR grafiği süresi planımıza göre düzeltildi |
| 2 | Gün 2 promptu: Prisma şeması, Neon bağlantısı ve ilk deploy istendi | Prisma 7 şeması, geçiş adımları ve Render kurulumu üretildi | Evet: dosya yolu `~/Projeler/abonetakip`, git adımları GitHub Desktop'a uyarlandı, README/ADR dosya adları düzeltildi. Süreçte `.env.example` içine yanlışlıkla gerçek adres girdi, fark edilip Neon parolası yenilendi |
| 3 | Gün 3 promptu: kayıt, giriş, roller ve merkezi tenant filtresi için plan istendi. Plan ayrı bir sohbette onaylandı, kod bu sohbette parça parça üretildi | İmzalı çerezle oturum, bcrypt ile parola, kayıt/giriş sayfaları, panel iskeleti ve merkezi tenant filtresi üretildi | Evet: dosya yolları hatalıydı (db.ts, auth.ts ve tenant.ts yanlış klasöre açılmıştı, taşındı), tsc ile doğrulandı. Prisma Studio hata verdi, kontroller Neon SQL Editor ile yapıldı. 8 manuel test ve canlıda kayıt testi geçti |
| 3b | Arayüzü profesyonelleştirme fikri soruldu. Plan sohbette yazıldı ve onaylandı (sol kenar menü, yumuşak indigo, ek paket yok), kod 4 parçada üretildi | Ortak arayüz bileşenleri, kenar menülü panel yerleşimi, yeni giriş/kayıt ve panel sayfaları üretildi | Evet: Tailwind 4 ve Geist kullanımı kontrol edildi, mevcut dosyaların içeriği gösterilip alan adları korundu. Geliştirme modunda pg sslmode uyarısı çıktı, zararsız bulunup Gün 12e ertelendi. tsc, build, finance rol testi ve canlı kontrol geçti |
kullanici@bilgisayar abonetakip % git switch -c docs/gun-04-kayitlar
Yeni 'docs/gun-04-kayitlar' dalına geçildi.
kullanici@bilgisayar abonetakip % tail -n 3 docs/03_Prompt_Gunlugu.md
| 3 | Gün 3 promptu: kayıt, giriş, roller ve merkezi tenant filtresi için plan istendi. Plan ayrı bir sohbette onaylandı, kod bu sohbette parça parça üretildi | İmzalı çerezle oturum, bcrypt ile parola, kayıt/giriş sayfaları, panel iskeleti ve merkezi tenant filtresi üretildi | Evet: dosya yolları hatalıydı (db.ts, auth.ts ve tenant.ts yanlış klasöre açılmıştı, taşındı), tsc ile doğrulandı. Prisma Studio hata verdi, kontroller Neon SQL Editor ile yapıldı. 8 manuel test ve canlıda kayıt testi geçti |
| 3b | Arayüzü profesyonelleştirme fikri soruldu. Plan sohbette yazıldı ve onaylandı (sol kenar menü, yumuşak indigo, ek paket yok), kod 4 parçada üretildi | Ortak arayüz bileşenleri, kenar menülü panel yerleşimi, yeni giriş/kayıt ve panel sayfaları üretildi | Evet: Tailwind 4 ve Geist kullanımı kontrol edildi, mevcut dosyaların içeriği gösterilip alan adları korundu. Geliştirme modunda pg sslmode uyarısı çıktı, zararsız bulunup Gün 12e ertelendi. tsc, build, finance rol testi ve canlı kontrol geçti |
| 4 | Gün 4 promptu: müşteri ve plan yönetimi için plan ve kod istendi. Plan ve kod ayrı bir sohbette üretildi, bu sohbette adım adım uygulatıldı | Müşteri/plan ekleme, düzenleme ve pasife alma, sunucu tarafı doğrulama, firma bazında benzersiz e-posta (`@@unique([tenantId, email])`), plan fiyatı kontrolleri ve "Kayıt bulunamadı" sayfası üretildi | Evet: plandaki yinelenen doğrulama yerine mevcut `validation.ts` yeniden kullanıldı, `abonelik-kontrol.ts` ham `prisma` yerine `getTenantDb()` kullanacak şekilde düzeltildi. ESLint `react/no-unescaped-entities` hatası `&apos;` ile giderildi. Migration'daki `DROP INDEX` kontrolü yapıldı. Fiyat, e-posta tekrarı, pasife alma ve tenant izolasyonu (URL ve gizli alan oynama) testleri geçti, canlıda ekleme/listeleme çalıştı |%                                                                   kullanici@bilgisayar abonetakip %
````

### Claude cevabı 43 · 21 Eki 2026 09:18

> Gün 4 satırı doğru eklenmiş (`tail` çıktısında satır 4 görünüyor). "Gerçekte aynı" dediğin için içeriği olduğu gibi bırakıyoruz.
>
> ## Adım 3: ADR'ye Gün 4 kararlarını ekle
> Önce ADR dosyasının bölüm başlıklarına bakalım, böylece Gün 4'ü Gün 2 ve Gün 3 bölümleriyle aynı biçimde ekleriz. Bu komut yalnızca başlık satırlarını listeler, hiçbir şeyi değiştirmez:
>
> ```
> grep -n "^#" docs/02_ADR.md
> ```
>
> Çıktıyı gönder. Ayrıca ADR'nin en son bölümünün (Arayüz) son satırlarını da görmek için şunu çalıştır:
>
> ```
> tail -n 12 docs/02_ADR.md
> ```
>
> İkisinin çıktısını birlikte gönder. Gün 4 bölümüne şu kararları yazacağım: firma bazında benzersiz e-posta, plan fiyatı kilidi, pasife alma kuralları ve yeniden aktifleştirme yok, "bulunamadı" yanıtı, Gün 5 notu.

### Prompt 44 · 21 Eki 2026 09:19

````text
kullanici@bilgisayar abonetakip % grep -n "^#" docs/02_ADR.md
1:# Mimari Karar Kaydı (ADR) • AboneTakip
6:## 1. Mimari Karar Kartı
15:## 2. Değişen kararlar ve nedenleri
28:## 3. Ek kararlar
42:## 4. Bilinen riskler ve sınırlar
52:## 5. Değişiklik geçmişi
60:## Gün 2 kararları (veri modeli ve ilk yayın)
69:## Gün 3 kararları (20 Ekim 2026)
71:### Oturum: imzalı çerez, ek paket yok
76:### Koruma: middleware yok
80:### Kiracı izolasyonu: merkezi `getTenantDb()`
85:### Kimlik doğrulama
90:### Paketler
94:### Bilinen açık
97:## Arayüz kararları (20 Ekim 2026)
99:### Yerleşim ve renk
104:### Ortak bileşenler, ek paket yok
108:### Değişmeyenler
111:### Bilinen açıklar.                                                  kullanici@bilgisayar abonetakip % tail -n 12 docs/02_ADR.md
- Küçük ekran menüsü ek JavaScript gerektirmez: iki ayrı menü çizilir, ekran boyutuna göre biri CSS ile gizlenir.

### Ortak bileşenler, ek paket yok
- Karar: `src/components/ui` altında `Dugme`, `Kart`, `FormAlani`, `SayfaBasligi`, `BosDurum` ve `Rozet` bileşenleri. Yeni sayfalar bunları kullanır.
- Neden: Her sayfada stili tekrar yazmamak. Tailwind 4 sınıfları yeterli, ikon ya da arayüz kütüphanesi eklenmedi.

### Değişmeyenler
- Sunucu kodu ve yetki kontrolleri aynı kaldı. Menüde bir bağlantıyı gizlemek yetki kontrolü sayılmaz, her sayfa kendi kontrolünü yapar.

### Bilinen açıklar
- Geliştirme modunda `pg` kütüphanesi Neon adresindeki `sslmode=require` için uyarı veriyor. Çalışmayı etkilemiyor. Gün 12'de `sslmode=verify-full` ile test edilecek.
- Ev klasöründe yanlışlıkla kalmış bir `package-lock.json` Next.js uyarısına yol açıyordu. 20 Ekim günü `~/_eski_npm` klasörüne taşınarak çözüldü.
````

### Claude cevabı 44 · 21 Eki 2026 09:19

> Biçim: `## Gün N kararları` başlığı, altında `###` alt başlıklar, her birinde "Karar" ve "Neden". Gün 4'ü aynı biçimde en sona ekliyoruz.
>
> ## ADR'ye Gün 4 bölümünü ekle
> 1. VS Code'da **Cmd+P** bas, `02_ADR` yaz, Enter'a bas.
> 2. **Cmd+Aşağı ok** ile en alta in. Son satır `... package-lock.json ... klasörüne taşınarak çözüldü.` ile biten satır. İmleci o satırın sonuna koy (Cmd+Sağ ok), **Enter** iki kere bas (araya boş satır girsin) ve aşağıdaki metni yapıştır:
>
> ```
> ## Gün 4 kararları (21 Ekim 2026)
>
> ### E-posta benzersizliği firma bazında
> - Karar: `Customer` tablosunda `@@unique([tenantId, email])`. E-postalar küçük harfe çevrilip kırpılarak kaydedilir. E-posta isteğe bağlıdır, boş e-postalı birden fazla müşteri olabilir. Ek olarak uygulamada önceden kontrol yapılır ve pasif müşteriler de bu kontrole dahildir.
> - Neden: Aynı e-posta farklı firmalarda bulunabilir, firmalar birbirinden bağımsızdır. Veritabanı kuralı, iki isteğin aynı anda gelmesi durumunda da tekrarı engeller. Başka firmada aynı e-posta olup olmadığı bilgisi hiçbir zaman gösterilmez.
>
> ### Kayıt bulunamadı yanıtı
> - Karar: Başka firmanın ya da var olmayan bir kayda erişim denemesi "Kayıt bulunamadı" sayfası (`notFound()`) ya da "Kayıt bulunamadı." mesajı döndürür. Güncelleme ve pasife alma `updateMany` ile yapılır, başka firmanın kimliği 0 satır etkiler.
> - Neden: "Yetkin yok" demek kaydın var olduğunu ele verir. Tek tip yanıt bilgi sızdırmaz.
>
> ### Pasife alma kuralları
> - Karar: Müşteri ve plan silinmez, `isActive=false` olur. Pasife alma yalnızca `manager` yapabilir. Aktif aboneliği olan müşteri ya da plan pasife alınamaz. Pasife alınan kayıt yeniden aktifleştirilemez.
> - Neden: Geçmiş abonelik ve metrik verisi korunur. Yeniden aktifleştirme bu hafta kapsam dışı, gerekirse sonra eklenir.
>
> ### Plan fiyat ve aralık kilidi
> - Karar: Fiyat pozitif tam sayı TL, en çok 10.000.000. Nokta ve virgül kabul edilmez. Planın aktif aboneliği varsa fiyat ve aralık değiştirilemez, yalnızca ad değişir.
> - Neden: Aktif abonelerin fiyatı sessizce değişirse MRR hesabı bozulur.
>
> ### Doğrulama ve yetki
> - Karar: Tüm girdiler sunucuda `src/lib/validation.ts` içindeki saf fonksiyonlarla doğrulanır, alan bazlı hata mesajı döner. Her sunucu eylemi kendi yetki kontrolünü yapar, düğmeyi gizlemek yetki sayılmaz. `tenantId` yalnızca oturumdan okunur.
> - Neden: Gün 3'teki kurallarla aynı. Ek paket eklenmedi.
>
> ### Bilinen açıklar
> - Pasife alma ve plan fiyat kilidi "önce kontrol, sonra güncelleme" iki adımıdır. Abonelik başlatmayla aynı anda gelirse küçük bir yarış penceresi vardır. Gün 5'te abonelik başlatılırken kapatılacak, not `src/lib/abonelik-kontrol.ts` içinde.
> - Abonelik başlatılırken müşteri ve planın `isActive` olduğu Gün 5'te kontrol edilecek.
> ```
>
> 3. **Cmd+S** ile kaydet.
>
> Bitince terminalde şu komutla kontrol edelim (yalnızca başlıkları gösterir):
>
> ```
> grep -n "^#" docs/02_ADR.md | tail -n 8
> ```
>
> Çıktıyı gönder.
>
> **Varsayım:** E-posta alanının isteğe bağlı olduğunu ve `manager`'ın pasife alma yetkisinin tek sahibi olduğunu plana göre yazdım. Farklı olduğunu düşünüyorsan söyle.

### Prompt 45 · 21 Eki 2026 09:22

````text
kullanici@bilgisayar abonetakip % grep -n "^#" docs/02_ADR.md | tail -n 8
111:### Bilinen açıklar
115:## Gün 4 kararları (21 Ekim 2026)
117:### E-posta benzersizliği firma bazında
121:### Kayıt bulunamadı yanıtı
125:### Pasife alma kuralları
129:### Plan fiyat ve aralık kilidi
133:### Doğrulama ve yetki
137:### Bilinen açıklar
````

### Claude cevabı 45 · 21 Eki 2026 09:22

> ADR'de Gün 4 bölümü doğru yerde ve altı alt başlığıyla duruyor.
>
> ## Adım 4: README'ye Gün 4 ilerlemesini ekle
> Önce README'de durumu gösteren bir bölüm var mı bakalım. Bu komut yalnızca başlıkları ve gün/ilerleme satırlarını listeler, bir şey değiştirmez:
>
> ```
> grep -n "^#\|Gün 3\|Gün 4" README.md
> ```
>
> Çıktıyı gönder. Gün 3 için nasıl yazdığımızı görüp Gün 4'ü aynı biçimde ekleyeceğim, yeni bir yapı icat etmeyeceğim.

### Prompt 46 · 21 Eki 2026 09:22

````text
1:# AboneTakip
3:## Proje özeti
8:## Teknoloji
14:## Kurulum
17:## Canlı adres
22:## Veritabanı geçişi
25:## Rol ve yetkiler
37:## Giriş, kayıt ve oturum
44:## Kapsam (MoSCoW)
49:## Dokümanlar
kullanici@bilgisayar aboneta
````

### Claude cevabı 46 · 21 Eki 2026 09:23

> README'de gün gün ilerleme tablosu yok, konu başlıkları var. Gün 3'ün karşılığı `## Giriş, kayıt ve oturum` bölümü. Aynı şekilde Gün 4 için de konu bölümü ekleyeceğiz, yeni bir yapı icat etmiyoruz.
>
> ## README'ye "Müşteri ve plan yönetimi" bölümünü ekle
> 1. VS Code'da **Cmd+P** bas, `README` yaz, Enter'a bas.
> 2. **Cmd+F** ile `## Kapsam (MoSCoW)` satırını bul, imleci o satırın **en başına** koy (Cmd+Sol ok).
> 3. Aşağıdaki metni yapıştır. Sonunda bir boş satır kalacak, böylece `## Kapsam (MoSCoW)` satırı onun altında başlar:
>
> ```
> ## Müşteri ve plan yönetimi
>
> - **Müşteriler** (`/musteriler`): ekleme, düzenleme ve pasife alma. E-posta isteğe bağlıdır. Doluysa firma içinde benzersizdir (pasif müşteriler dahil), başka firmada aynı e-posta olması sorun değildir.
> - **Planlar** (`/planlar`): ad, aylık ya da yıllık aralık ve fiyat (tam sayı TL). Aktif aboneliği olan planın fiyatı ve aralığı değiştirilemez.
> - **Pasife alma:** kayıtlar silinmez. Yalnızca `manager` pasife alabilir. Aktif aboneliği olan müşteri ya da plan pasife alınamaz. Pasife alınan kayıt yeniden aktifleştirilemez.
> - **Yetki:** `manager` ve `finance` müşteri ile plan ekleyip düzenleyebilir. Kontroller sunucuda yapılır.
> - **Kiracı izolasyonu:** başka firmanın kaydına erişim denemesi "Kayıt bulunamadı" yanıtı verir.
>
> ```
>
> 4. **Cmd+S** ile kaydet.
>
> Bitince kontrol et, bu komut README'nin başlıklarını listeler:
>
> ```
> grep -n "^#" README.md
> ```
>
> **Beklenen:** `## Müşteri ve plan yönetimi` satırı `## Giriş, kayıt ve oturum` ile `## Kapsam (MoSCoW)` arasında görünür. Çıktıyı gönder.
>
> **Varsayım:** `finance` rolünün müşteri ve planı ekleyip düzenleyebildiğini proje kurallarından yazdım. Bunu finance hesabıyla Gün 6'da test edeceğiz, o zamana kadar doğrulanmış sayılmaz.

### Prompt 47 · 21 Eki 2026 09:25

````text
kullanici@bilgisayar abonetakip % grep -n "^#" README.md
1:# AboneTakip
3:## Proje özeti
8:## Teknoloji
14:## Kurulum
17:## Canlı adres
22:## Veritabanı geçişi
25:## Rol ve yetkiler
37:## Giriş, kayıt ve oturum
44:## Müşteri ve plan yönetimi
51:## Kapsam (MoSCoW)
56:## Dokümanlar
````

### Claude cevabı 47 · 21 Eki 2026 09:25

> README'de bölüm doğru yerde. Şimdi bu üç doküman değişikliğini commit'leyelim.
>
> ## Adım 5: Kontrol ve commit
> Önce hangi dosyaların değiştiğine bak. `.env` ya da `docs/04_14_Gunluk_Prompt_Plani.md` listede olmamalı:
>
> ```
> git status
> ```
>
> **Beklenen:** yalnızca `README.md`, `docs/02_ADR.md`, `docs/03_Prompt_Gunlugu.md` değişmiş görünür. Çıktıyı gönder, `git add` yapma.

### Prompt 48 · 21 Eki 2026 09:26

````text
kullanici@bilgisayar abonetakip % git status
Üzerinde bulunulan dal: docs/gun-04-kayitlar
İşleme için hazırlanmamış değişiklikler:
  (işlenecekleri güncellemek için "git add <dosya>..." kullanın)
  (çalışma dizinindeki değişiklikleri atmak için
    "git restore <dosya>..." kullanın)
değiştirildi:         README.md
değiştirildi:         docs/02_ADR.md
değiştirildi:         docs/03_Prompt_Gunlugu.md

İşlemeye eklenen değişiklik yok ("git add" ve/veya "git commit -a" kullanın)
````

### Claude cevabı 48 · 21 Eki 2026 09:26

> Tam beklediğim gibi: yalnızca üç doküman değişmiş, `.env` ve `docs/04_14...` yok.
>
> Dosyaları commit'e hazırla:
>
> ```
> git add -A
> ```
>
> Sonra secret kontrolü yap. Önceki üç satır (`CLAUDE.md:66`, `docs/00_Kurulum_Rehberi.md:163`, `docs/02_ADR.md:67`) yine çıkabilir, ADR'ye yeni satır eklediğimiz için **başka satır çıkmamalı**:
>
> ```
> git grep -n -e "neon.tech" -e "npg_"
> ```
>
> Çıktıyı gönder, commit'i ondan sonra yapacağız.

### Prompt 49 · 21 Eki 2026 09:27

````text
kullanici@bilgisayar abonetakip % git grep -n -e "neon.tech" -e "npg_"
CLAUDE.md:66:- `.env.example` yalnızca yer tutucu içerir (`[NEON_POOLED_URL]`). Gerçek adres veya parola asla yazılmaz. Commit öncesi `git grep -n -e "neon.tech" -e "npg_"` ile kontrol et.
docs/00_Kurulum_Rehberi.md:163:1. https://console.neon.tech adresinde Neon hesabınla giriş yap, **Create project** (veya New project) de.
docs/02_ADR.md:67:- **Güvenlik olayı ve ders:** `.env.example` dosyasına yanlışlıkla gerçek bağlantı adresi yazıldı ve herkese açık depoya gönderildi. Neon parolası değiştirilerek sızıntı etkisiz hâle getirildi, dosya yer tutucularla düzeltildi. Kural: `.env.example` yalnızca yer tutucu içerir, commit öncesi `git grep -n -e "neon.tech" -e "npg_"` ile kontrol edilir.
````

### Claude cevabı 49 · 21 Eki 2026 09:27

> Yine aynı üç zararsız satır, yeni bir şey yok. Commit'i oluştur:
>
> ```
> git commit -m "docs: Gün 4 kayıtları" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6"
> ```
>
> **Beklenen:** `[docs/gun-04-kayitlar ...] docs: Gün 4 kayıtları` ve `3 files changed`. Çıktıyı gönder. Sonra GitHub Desktop'tan **Publish branch** ve **Create Pull Request** yapacağız.

### Prompt 50 · 21 Eki 2026 09:27

````text
kullanici@bilgisayar abonetakip % git commit -m "docs: Gün 4 kayıtları" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6"
[docs/gun-04-kayitlar c3ea521] docs: Gün 4 kayıtları
 3 files changed, 34 insertions(+)
````

### Claude cevabı 50 · 21 Eki 2026 09:27

> Commit oluştu (`c3ea521`, 3 dosya, 34 satır eklendi). Şimdi GitHub'a gönderelim:
>
> 1. **GitHub Desktop**'ı aç. Üstte dal adı `docs/gun-04-kayitlar` olmalı.
> 2. **Publish branch**'e bas.
> 3. Yükleme bitince **Create Pull Request** düğmesine bas, tarayıcıda PR sayfası açılır.
> 4. Açıklama kutusuna şunu yaz:
>
> ```
> Gün 4 kayıtları: Prompt Günlüğü satırı, ADR Gün 4 kararları ve README müşteri/plan bölümü.
>
> 🤖 Generated with [Claude Code](https://claude.ai/code)
>
> https://claude.ai/code/session_0189rYKu4TpLCx6DdW9AREY6
> ```
>
> 5. **Create pull request**'e bas, sonra **Merge pull request** ve **Confirm merge**. Bu PR yalnızca doküman içerdiği için Render yeniden deploy eder ama uygulama değişmez, test gerekmez.
> 6. **Delete branch**'e bas.
>
> Bitince terminalde `main`'e dönüp güncelle:
>
> ```
> git switch main
> ```
>
> ```
> git pull
> ```
>
> `git pull` çıktısını gönder. Ardından proje panosu adımına geçeriz: #3'ü **Done**'a taşımak.

### Prompt 51 · 21 Eki 2026 09:29

````text
kullanici@bilgisayar abonetakip % git switch main
'main' dalına geçildi.
Dalınız "origin/main" ile güncel.
kullanici@bilgisayar abonetakip % git pull
remote: Enumerating objects: 1, done.
remote: Counting objects: 100% (1/1), done.
remote: Total 1 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
Nesneler açılıyor: 100% (1/1), 927 bayt | 927.00 KiB/sn, bitti.
Şu konumdan: https://github.com/ozgesoganci1-bot/abonetakip
   7f0a732..6e9d426  main       -> origin/main
Güncelleniyor: 7f0a732..6e9d426
Fast-forward
 README.md                 |  7 +++++++
 docs/02_ADR.md            | 26 ++++++++++++++++++++++++++
 docs/03_Prompt_Gunlugu.md |  1 +
 3 files changed, 34 insertions(+)
````

### Claude cevabı 51 · 21 Eki 2026 09:29

> Doküman PR'ı `main`'e girdi (`7f0a732..6e9d426`, 3 dosya, 34 satır). Yerel `main` güncel.
>
> ## Adım 6: Proje panosu
> 1. GitHub'da repoya git, **Projects** sekmesinden panoyu aç (ya da sağ üstteki proje bağlantısından).
> 2. **#3 Müşteri ve plan yönetimi** kartını **Done** sütununa taşı. PR'daki `Closes #3` issue'yu zaten kapattı, kartın otomatik Done'a geçmiş olması da mümkün. Geçmişse dokunma.
> 3. **#2 Kayıt, giriş ve roller** kartı **In Progress**'te kalsın. Finance ile rol testlerini Gün 6'da yapacağız.
>
> Pano sekmesi görünmüyorsa ya da kartlar farklı adlandırılmışsa ekran görüntüsü gönder.
>
> Bunu yapınca Gün 4 tamamdır. Bir sonraki adım Gün 5: **abonelik yaşam döngüsü** (başlatma, yenileme, iptal, olay kaydı). Gün 5 için yeni bir plan gerekecek. Önceki günlerde olduğu gibi planı ayrı sohbette mi yazdıracaksın, yoksa burada mı hazırlayalım? Ona göre devam ederiz.

### Prompt 52 · 21 Eki 2026 09:32

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 52 · 21 Eki 2026 09:32

> Pano doğru durumda: **#3 Müşteri ve plan yönetimi Done**'da (PR #16 bağlı, otomatik taşınmış), dokunmana gerek yok. **#1 Kayıt, giriş ve roller** de Done.
>
> Bir düzeltme: Önceki mesajımda #2'yi "Kayıt, giriş ve roller" diye yazmıştım, yanlışmış. #2 **Kiracı (tenant) izolasyonu** kartı. Bugün Firma B ile izolasyon testlerini geçtik, ama finance rolüyle testler ve genel izolasyon doğrulaması Gün 6'da yapılacağı için kart **In Progress**'te kalsın, doğru olan bu.
>
> Gün 4 tamam. Sırada **#4 Abonelik yaşam döngüsü** var (başlatma, yenileme, iptal, `SUBSCRIPTION_EVENTS` kaydı, bir müşteriye tek aktif abonelik kuralı). Önceki günlerde olduğu gibi planı ayrı bir sohbette mi yazdıracaksın, yoksa Gün 5 planını burada ben hazırlayayım mı? Hangisini istersen yaz, ona göre ilerleyelim. Plan onayından önce kod yazmayacağım.

### Prompt 53 · 21 Eki 2026 09:34

````text
abonelik yaşam döngüsü gün 5 im promptu dimi
````

### Claude cevabı 53 · 21 Eki 2026 09:34

> Evet, Gün 5 = **abonelik yaşam döngüsü** (issue #4). Gün 5 promptu `docs/04_14_Gunluk_Prompt_Plani.md` dosyasında, ama bu dosyaya dokunmuyoruz, yalnızca okuyoruz. Doğru bölümü bulmak için `abonetakip` klasöründe şunu çalıştır. Başlık satırlarını listeler, bir şey değiştirmez:
>
> ```
> grep -n "Gün 5" docs/04_14_Gunluk_Prompt_Plani.md
> ```
>
> Çıktıyı gönder, promptun hangi satırlarda olduğunu söyleyeyim. Sonra Gün 4'teki gibi ilerleriz:
>
> 1. Promptu dosyadan kopyalayıp yeni bir sohbete yapıştırırsın (plan ve kod orada üretilir) ya da bana yapıştırırsın, burada plan çıkarırım.
> 2. Çıkan planı bana getirirsin, ben gözden geçirip adım adım uygulatırım. Kodu planı onaylamadan yazdırmayacağız.
>
> Hangisini istersen yaz.

### Prompt 54 · 21 Eki 2026 09:34

````text
biraz dinleneyim gün 5 i de bugün helledicez
````

### Claude cevabı 54 · 21 Eki 2026 09:34

> Gün 4 bitti, dinlenmeyi hak ettin.
>
> Durum:
> - **Gün 4:** kod canlıda (PR #16), kayıtlar (Prompt Günlüğü, ADR, README) `main`'de, pano güncel.
> - **Gün 5:** hazır olunca `grep -n "Gün 5" docs/04_14_Gunluk_Prompt_Plani.md` çıktısını gönder, oradan devam ederiz. Plan onayından önce kod yazmayacağız.
>
> Kolay gelsin.

### Prompt 55 · 21 Eki 2026 09:38

````text
proje fikir önerisi kısmının altındaki paragraftaki köşeli parantezli alanlar ne zaman doldurulacak
````

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 55 · 21 Eki 2026 09:38

> Gün 14'te, teslim öncesi son kontrolde doldurulacak. Planımızda bu "teslim yer tutucuları" adımı olarak duruyor.
>
> Alanlar ve kimin bilebileceği:
> - **[Ad Soyad] ve [No]:** yalnızca sen biliyorsun.
> - **[Tarih]:** teslim tarihi.
> - **[Depo bağlantısı]:** `https://github.com/ozgesoganci1-bot/abonetakip`
> - **[Render bağlantısı]:** `https://abonetakip.onrender.com`
>
> Depo herkese açık olduğu için ad soyad ve öğrenci numarasını bu dosyaya yazıp yazmayacağına sen karar ver. Hocanın teslim formatı bunları istiyorsa yazarsın. İstemiyorsa ya da çekiniyorsan teslim formuna ayrıca yazıp dosyada yer tutucu bırakabilirsin. Bu kararı Gün 14'te birlikte verelim.
>
> Gün 5'e geçince bu satırlara dokunmayacağız, sadece Gün 14 listesinde duruyorlar.

_[selamlaşma mesajı ve cevabı çıkarıldı]_

### Prompt 56 · 21 Eki 2026 09:42

````text
bu arada benim bilgisyaarımda docker açık ve ekran böyle ne yapmam gerekiyor
````

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 56 · 21 Eki 2026 09:43

> Hiçbir şey yapman gerekmiyor. AboneTakip'in Docker'la ilgisi yok: uygulama Render'da, veritabanı Neon'da çalışıyor ve yerelde `npm run dev` ile açıyoruz. Docker açık ya da kapalı olması projeyi etkilemez.
>
> Ekrandakiler:
> - **`xodochial_wil...` (hello-world):** Docker'ı kurduğunda çalıştırılan deneme kapsayıcısı. Zaten durmuş (boş daire).
> - **`abonetakip` (yeşil nokta, 3 gün önce):** çalışıyor ama projemizin parçası değil. Ne olduğunu bilmiyorum, ders sırasında ya da deneme olarak başlatılmış olabilir. **Silme**, ne olduğunu bilmeden dokunmamak daha güvenli.
>
> Bilgisayarın RAM'ini ve pilini boşa harcamasın istiyorsan Docker Desktop'ı kapatabilirsin: menü çubuğunda **Docker Desktop > Quit Docker Desktop** (ya da pencere açıkken **Cmd+Q**). Kapatınca `abonetakip` kapsayıcısı da durur. Gün 5'te Docker'a ihtiyacımız olmayacak.
>
> Docker'ın "Update available" bildirimi de var. Şimdilik güncelleme yapma, ders sırasında bir şey bozulmasın.

### Prompt 57 · 21 Eki 2026 09:44

````text
TEŞEKKÜR EDERİM CMD Q DİYEREK KAPATTIM BUNU DA GÖZ ÖNÜNDE BULUNDUR EĞER GEEİ KALAN GÜNLERDE YAPACAĞIMIZ ÇALIŞMALARDA DOCKER LAZIM OLURSA MUTLKAA SEBEBİYLE BELİRT
````

### Claude cevabı 57 · 21 Eki 2026 09:44

> Tamam, not aldım: kalan günlerde Docker gerekirse sebebini söyleyip önce açmanı isteyeceğim. Şu anki plana göre (Render, Neon, `npm run dev`) gerekmiyor.
>
> Gün 5'e hazır olunca devam ederiz.

### Prompt 58 · 21 Eki 2026 09:49

````text
BANA BÖYLE BİR MAİL GELDİ
````

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 58 · 21 Eki 2026 09:49

> Bu, `docs: Gün 4 kayıtları` PR'ının (#17) Render'daki deploy'unun hata verdiğini söylüyor. Önce sakin olalım:
>
> - Önceki deploy (`7f0a732`, müşteri ve plan kodu) **Live** idi. Başarısız deploy, çalışan sürümü kapatmaz, canlı site eski sürümle çalışmaya devam eder.
> - #17 yalnızca doküman içeriyordu (README, ADR, Prompt Günlüğü), kod değişmedi. Bu yüzden kod hatası olması düşük ihtimal. Ücretsiz Render'da geçici bir derleme hatası (bellek, ağ, paket indirme) daha olası.
>
> Nedenini loga bakarak görelim:
>
> 1. Mailde **View Logs** düğmesine bas (ya da Render'da `abonetakip` > **Logs**).
> 2. Sayfanın en altına in. Kırmızı satırlar ya da `error`, `failed`, `Exited with status` yazan satırlar önemli.
> 3. Son 30-40 satırı gösteren bir ekran görüntüsü gönder.
>
> Ekran görüntüsünde `DATABASE_URL`, parola ya da `postgresql://` ile başlayan bir adres görünürse gönderme. Önce o satırı kapat ya da kırp. Genelde derleme loglarında bunlar çıkmaz, ama kontrol et.
>
> Aynı zamanda Render **Deploys** sayfasında üstteki deploy'un durumuna (Failed mi, yoksa yeni bir deploy başladı mı) bak. Bazen Render hata sonrası kendiliğinden yeniden dener.

### Prompt 59 · 21 Eki 2026 09:52

_[3 ekran görüntüsü eklendi]_

### Claude cevabı 59 · 21 Eki 2026 09:52

> Loglar sorunun kodda olmadığını gösteriyor, Render tarafında geçici bir takılma gibi duruyor:
>
> - **09:29:37:** yeni deploy `npm run start` ile başladı.
> - **09:44:18:** 15 dakika boyunca hiçbir port açılmadı (`Port scan timeout reached, no open ports detected`), 09:47'de `Timed Out`.
> - **09:47:44:** Render aynı komutu yeniden çalıştırdı ve bu sefer `Next.js 16.4.2 ... Ready in 1600ms`, `port 10000`. Uygulama sorunsuz ayağa kalktı.
>
> #17 yalnızca doküman değişikliği olduğu için kod bozulmuş olamaz. İlk başlatma bir nedenle takılmış, ikinci denemede açılmış. Deploys sayfasında ise `6e9d426` **Failed**, `7f0a732` **Live** görünüyor. Yani canlı site çalışıyor, müşteri ve plan sayfaları duruyor, sadece son dokümanlar henüz "yayında" sayılmıyor. Zaten doküman olduğu için siteyi etkilemez.
>
> Temiz bir görünüm için aynı commit'i yeniden deploy edelim:
>
> 1. Render'da sağ üstteki **Manual Deploy** düğmesine bas.
> 2. **Deploy latest commit**'i seç.
> 3. 2-3 dakika bekle. **Beklenen:** üstte `6e9d426` yeşil tik ve **Live**.
>
> Yine **Failed** olursa yeni logun ekran görüntüsünü gönder. Gün 5'e geçmeden önce `main`'in canlıda yeşil olmasını istiyorum, çünkü Gün 5'te de her merge deploy tetikleyecek.
>
> Ücretsiz Render örnekleri uyuyup uyanırken bazen böyle takılabiliyor. Bunu Gün 12'deki canlı kontrol listesine not edeceğim.

### Prompt 60 · 21 Eki 2026 09:54

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 60 · 21 Eki 2026 09:54

> Yeniden deploy başarılı: `6e9d426` **Deploy succeeded | Live**, 1 dk 14 sn. Uygulama sorunsuz başladı (`next start`, `Next.js 16.4.2`). İlk hata geçici bir Render takılmasıydı, kodda ya da ayarlarda bir sorun yok.
>
> Güncel durum:
> - **Canlı:** `main`'in son hali (`6e9d426`: Gün 4 kodu ve kayıtları).
> - **Gün 4:** tamam.
> - **Not:** Render'da ilk başlatma takılırsa **Manual Deploy > Deploy latest commit** ile yeniden dene, ikinci denemede genelde çözülür. Aynı hata tekrarlanırsa kodda bir sorun olma ihtimaline karşı logları bana gönder.
>
> Bu notu Gün 12'deki canlı kontrol listesine ekleyeceğim. Dinlenmen bittiğinde `grep -n "Gün 5" docs/04_14_Gunluk_Prompt_Plani.md` çıktısıyla Gün 5'e başlayabiliriz.

### Prompt 61 · 21 Eki 2026 10:44

````text
abone takip sistemini açmam lazım da ne yapmam gerekiyordu
````

### Claude cevabı 61 · 21 Eki 2026 10:44

> İki seçenek var, ihtiyacına göre birini kullan.
>
> ## Canlı site (hiçbir şey kurmadan)
> Tarayıcıda `https://abonetakip.onrender.com` adresini aç. Ücretsiz sunucu uyumuş olabilir, ilk açılış 50 saniye sürebilir. Docker gerekmez.
>
> ## Yerel (kendi bilgisayarında, geliştirme için)
> 1. Terminali aç (Cmd+Boşluk, `Terminal` yaz, Enter).
> 2. Proje klasörüne geç:
> ```
> cd ~/Projeler/abonetakip
> ```
> 3. Geliştirme sunucusunu başlat:
> ```
> npm run dev
> ```
> 4. Tarayıcıda `http://localhost:3000` adresini aç.
>
> Kapatmak için terminal penceresinde **Ctrl+C** bas. Terminal sekmesi açık kaldığı sürece site çalışır, kapatırsan site de kapanır.
>
> İkisinde de `ayse.deneme@example.com` (Firma A) ya da `ali.canli@example.com` hesabıyla giriş yapabilirsin. Parolayı bana yazma.
>
> Hangisini açmak istiyordun? Bir hata alırsan terminaldeki çıktıyı gönder.

### Prompt 62 · 21 Eki 2026 10:53

````text
teşekkür ederim hallettim
````

### Claude cevabı 62 · 21 Eki 2026 10:53

> Rica ederim. Gün 5'e hazır olunca `grep -n "Gün 5" docs/04_14_Gunluk_Prompt_Plani.md` çıktısını gönder, oradan devam ederiz.

