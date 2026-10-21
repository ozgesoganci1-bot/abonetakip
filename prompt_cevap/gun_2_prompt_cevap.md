# Gün 2: Prisma şeması ve ilk deploy

> Bu dosya, Gün 2 için yazdığım promptu ve yapay zekânın cevabını içerir.
> **Araç:** Claude (claude.ai, "SUNUCU TABANLI PROGRAMLAMA - SaaS PROJESİ" Project'i içindeki sohbetler).
> Cevabın hiç düzenlenmemiş hâli bu sayfanın "Ham metin" bölümündedir. Kişisel bilgiler (Mac kullanıcı adı) gizlenmiştir, gizli bilgi taraması yapılmıştır.
> Bu sohbetin ortasında benim bir mesajım (terminal çıktısı) vardır, ayrı bölüm olarak gösterilmiştir.

## Prompt

````text
Bu bir devam oturumu. Proje talimatlarındaki (CLAUDE.md) kurallara uy.
Ben kod bilmeyen bir YBS öğrencisiyim, Türkçe, sade ve adım adım anlat.
Önce plan ver, ben onaylamadan dosya değiştirme. Cevabın sonunda
varsayımlarını ve emin olmadığın yerleri listele.
Bugünün konusu: Gün 2 - Prisma şeması ve ilk deploy **Amaç:** Veri modelini kurmak, Neon veritabanına bağlanmak, boş uygulamayı Render'da canlıya almak.
**Önce yap:** Kurulum Rehberi Bölüm 10 tamamlanmış, `.env` içinde Neon'un `DATABASE_URL` adresi var. Yeni dal: `feat/gun-02-veri-modeli`.

```
[Görev] Prisma'yı kur ve veri şemasını oluştur. Tablolar: TENANTS,
USERS, CUSTOMERS, PLANS, SUBSCRIPTIONS, SUBSCRIPTION_EVENTS.

Alan gereksinimleri:
- TENANTS: id, name, cac (müşteri edinme maliyeti, TL, tam sayı, varsayılan 0), createdAt.
- USERS: id, tenantId, name, email (benzersiz), passwordHash, role
  (manager veya finance), createdAt.
- CUSTOMERS: id, tenantId, name, email, isActive, createdAt.
- PLANS: id, tenantId, name, price (TL, tam sayı), interval (MONTHLY veya
  YEARLY), isActive, createdAt.
- SUBSCRIPTIONS: id, tenantId, customerId, planId, status (ACTIVE veya
  CANCELED), startedAt, currentPeriodEnd, canceledAt (boş olabilir).
- SUBSCRIPTION_EVENTS: id, tenantId, subscriptionId, type (STARTED,
  RENEWED veya CANCELED), createdAt.

[Kısıtlar]
- TENANTS dışındaki her tabloda tenantId zorunlu ve ilişkili.
- Rol, durum, aralık ve olay türü için enum kullan.
- Sorgu hızı için tenantId alanlarına uygun indeks ekle.
- Veritabanı adresi yalnızca .env içindeki DATABASE_URL'den okunsun.
- Veritabanı Neon'dadır. Prisma geçişi (migration) için doğrudan (direct)
  mi yoksa havuzlu (pooled) bağlantı adresi mi gerektiğini, benim Prisma
  sürümüme göre açıkla. Gerekirse ikinci bir ortam değişkeni (örn.
  DIRECT_URL) öner ve nedenini yaz.
- Benim Prisma sürümüme uygun sözdizimi kullan. Sürümden emin değilsen
  önce package.json'u istememi söyle.
- Henüz tenant yardımcısı, giriş veya arayüz yazma.

[Format] 1) Önce planı ver: kuracağın paketler, oluşturacağın dosyalar,
tablo ilişkileri ve emin olmadığın noktalar. Onayımı bekle. 2) Onaydan
sonra adım adım terminal komutları ve schema dosyasının tam içeriği.
3) Veritabanına ilk geçişin (migration) nasıl yapılacağı. 4) Başarılı
olduğunu görmek için kontrol yöntemi (örn. Prisma Studio ile tabloları
görmek). 5) Ardından Render'a ilk deploy: GitHub deposundan Web Service
oluşturma adımları (bölgeyi Neon ile aynı seç), Build Command, Start
Command ve Environment Variables ayarları (DATABASE_URL için Neon
adresini ben elle gireceğim, sana göstermeyeceğim).

[Doğrulama] Kodu yazmadan önce sırayla düşün: hangi tablolar etkilenir,
hangi tenant kontrolleri gerekir, hangi hata durumları olabilir. Sonra
varsayımlarını listele. Emin olmadığın sürüm, sözdizimi veya paket
bilgisini açıkça belirt.
**Bitiş kontrolü**
- [ ] npx prisma studio (veya AI'nın verdiği komut) ile 6 tablo görünüyor
- [ ] Her tabloda (TENANTS hariç) tenantId var
- [ ] Render'da boş uygulama canlı adreste açılıyor (ilk açılış yavaş olabilir)
- [ ] .env commit'e **girmedi** (depo herkese açık, GitHub'da depoyu tarayıp .env ve veritabanı adresi göremediğini doğrula)
- [ ] Neon panelinde tablolar görünüyor (Tables / SQL Editor)
- [ ] ADR ve README'ye canlı adres yazıldı
- **Commit:** feat: Prisma şeması ve ilk deploy

```
````

## Yapay zekânın cevabı

### Okunaklı görünüm

_Aşağıdaki görünümde cümleler aynıdır. Yalnızca sohbet kopyalanırken kaybolan kod bloğu işaretleri ve tablolar yeniden kurulmuştur._

_Outlining the full setup and deployment sequence step by step._

Plan onaylandı, B seçeneğiyle başlıyoruz: geçişi kendi bilgisayarından çalıştıracaksın, Render yalnızca generate ve build yapacak.

Bir kural: her adımda bir hata görürsen dur ve hatanın tamamını bana gönder. Sonraki adıma geçme.

#### Adım 0: Yeni dal oluştur

Terminal’i aç ve proje klasörüne geç (klasör adın farklıysa onu yaz):

````bash
cd ~/abonetakip
````

Terminal’i proje klasörüne götürür.

````bash
git status
````

Kaydedilmemiş değişiklik var mı gösterir. “nothing to commit, working tree clean” görmelisin. Görmezsen dur ve bana yaz.

````bash
git checkout main
````

Ana dala geçer.

````bash
git pull
````

GitHub’daki en güncel hâli bilgisayarına çeker.

````bash
git checkout -b feat/gun-02-veri-modeli
````

Bugünün çalışması için yeni dal oluşturur ve o dala geçer.

#### Adım 1: Paketleri kur

````bash
npm install -D prisma@7 dotenv
````

Prisma komut aracını ve .env okuyucuyu geliştirme paketi olarak kurar.

````bash
npm install @prisma/client@7
````

Uygulamanın veritabanıyla konuşacağı Prisma istemcisini kurar.

Sürümü @7 olarak sabitledim. Böylece bu dosyalarda kullandığım sözdizimiyle birebir uyumlu sürüm gelir. Kurulumu kontrol et:

````bash
npx prisma --version
````

Kurulan Prisma sürümünü gösterir. prisma ve @prisma/client satırlarında 7. ile başlayan bir sayı görmelisin. Başka bir sayı görürsen dur ve çıktıyı bana gönder.

npx prisma init komutunu kullanmıyoruz, çünkü mevcut .env dosyana kendi satırlarını ekleyebiliyor. Dosyaları elle oluşturacağız.

#### Adım 2: .env dosyasını düzenle

2a. Doğrudan adresi taşı. Editörde (VS Code) proje kökündeki .env dosyasını aç. Şu an içinde DATABASE_URL="..." satırı var ve bu senin doğrudan adresin. Satırdaki DATABASE_URL adını DIRECT_URL olarak değiştir. Adresin kendisine dokunma.

2b. Havuzlu adresi al. Neon panelinde projeni aç ve Connect düğmesine bas. Açılan pencerede Connection pooling anahtarını aç. Adres değişecek ve sunucu adında -pooler görünecek. Bu adresi kopyala.

2c. .env dosyasına yeni bir satır ekle. Dosyanın son hâli şu yapıda olmalı (gerçek adresler senin dosyanda, burada yer tutucu var):

````env
# Uygulama çalışırken kullanılır (havuzlu, -pooler içerir)
DATABASE_URL="[NEON_POOLED_URL]"

# Prisma geçişleri ve Prisma Studio için kullanılır (doğrudan)
DIRECT_URL="[NEON_DIRECT_URL]"
````

Kaydet: Cmd + S.

#### Adım 3: .env.example dosyası

Yeni dosya oluştur: .env.example (proje kökünde)

````env
# Bu dosya örnektir. Gerçek değerleri .env dosyasına yaz, bu dosyaya yazma.
# Uygulama çalışırken kullanılır (Neon havuzlu adres, -pooler içerir)
DATABASE_URL="[NEON_POOLED_URL]"

# Prisma geçişleri ve Prisma Studio için kullanılır (Neon doğrudan adres)
DIRECT_URL="[NEON_DIRECT_URL]"
````

#### Adım 4: .gitignore kontrolü

.gitignore dosyasını aç. Next.js bu dosyaya genellikle .env* satırını koyar. Bu satır .env dosyasını korur, ama .env.example dosyasını da gizler. Bunu düzeltmek ve Prisma’nın üreteceği klasörü dışarıda bırakmak için dosyanın en sonuna şu satırları ekle:

````gitignore
# Ortam değişkenleri: örnek dosya repoya girebilir, gerçek .env giremez
.env*
!.env.example

# Prisma'nın otomatik ürettiği istemci (her kurulumda yeniden üretilir)
/generated/prisma
````

Kaydet.

#### Adım 5: prisma.config.ts

Yeni dosya oluştur: prisma.config.ts (proje kökünde, package.json ile aynı yerde)

````ts
// Prisma komut aracının (migrate, studio, generate) ayar dosyası.
// Prisma 7'de veritabanı adresi şema dosyasında değil, burada tanımlanır.

// .env dosyasındaki değişkenleri okur. Render'da .env yoktur,
// orada değişkenler panelden gelir ve bu satır sessizce geçer.
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Şema dosyasının yeri
  schema: "prisma/schema.prisma",

  // Geçiş (migration) dosyalarının tutulacağı klasör
  migrations: {
    path: "prisma/migrations",
  },

  // Komut aracı DOĞRUDAN adresi kullanır.
  // Neon'un havuzlu adresi şema değiştiren işlemler için uygun değildir.
  datasource: {
    url: env("DIRECT_URL"),
  },
});
````

#### Adım 6: prisma/schema.prisma

Proje kökünde prisma adında bir klasör oluştur. İçinde yeni dosya oluştur: prisma/schema.prisma

````prisma
// AboneTakip veri şeması
// Kural: TENANTS dışındaki her tabloda tenantId zorunludur.
// Firmalar arası karışmayı engellemek için ilişkiler (id, tenantId) çifti
// üzerinden kurulur. Böylece A firmasının aboneliği B firmasının
// müşterisine veritabanı seviyesinde bağlanamaz.

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

// Adres burada değil, prisma.config.ts dosyasında tanımlıdır (Prisma 7).
datasource db {
  provider = "postgresql"
}

// ---------- Enum'lar (sabit seçenek listeleri) ----------

enum Role {
  manager // firma sahibi
  finance // finans çalışanı
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

// Kiracı: uygulamayı kullanan müşteri firma
model Tenant {
  id        String   @id @default(cuid())
  name      String
  cac       Int      @default(0) // Müşteri edinme maliyeti, TL, tam sayı
  createdAt DateTime @default(now())

  users         User[]
  customers     Customer[]
  plans         Plan[]
  subscriptions Subscription[]
  events        SubscriptionEvent[]

  @@map("tenants")
}

// Uygulamaya giriş yapan kişi
model User {
  id           String   @id @default(cuid())
  tenantId     String
  name         String
  email        String   @unique // Giriş e-postayla yapıldığı için tüm sistemde benzersiz
  passwordHash String // Parolanın bcrypt özeti, düz parola asla saklanmaz
  role         Role
  createdAt    DateTime @default(now())

  tenant Tenant @relation(fields: [tenantId], references: [id])

  @@index([tenantId])
  @@map("users")
}

// Firmanın kendi abone müşterisi
model Customer {
  id        String   @id @default(cuid())
  tenantId  String
  name      String
  email     String
  isActive  Boolean  @default(true) // Silinmez, pasife alınır
  createdAt DateTime @default(now())

  tenant        Tenant         @relation(fields: [tenantId], references: [id])
  subscriptions Subscription[]

  // (id, tenantId) çifti abonelik ilişkisinin firma kontrolü için gerekir
  @@unique([id, tenantId])
  @@index([tenantId])
  @@map("customers")
}

// Firmanın sattığı abonelik planı
model Plan {
  id        String       @id @default(cuid())
  tenantId  String
  name      String
  price     Int // TL, tam sayı (kuruş yok)
  interval  PlanInterval
  isActive  Boolean      @default(true) // Silinmez, pasife alınır
  createdAt DateTime     @default(now())

  tenant        Tenant         @relation(fields: [tenantId], references: [id])
  subscriptions Subscription[]

  @@unique([id, tenantId])
  @@index([tenantId])
  @@map("plans")
}

// Bir müşterinin bir plana aboneliği
model Subscription {
  id               String             @id @default(cuid())
  tenantId         String
  customerId       String
  planId           String
  status           SubscriptionStatus @default(ACTIVE)
  startedAt        DateTime           @default(now())
  currentPeriodEnd DateTime
  canceledAt       DateTime? // Yalnızca iptal edilince dolar

  tenant   Tenant   @relation(fields: [tenantId], references: [id])
  // Müşteri ve plan aynı firmaya ait olmak zorunda
  customer Customer @relation(fields: [customerId, tenantId], references: [id, tenantId])
  plan     Plan     @relation(fields: [planId, tenantId], references: [id, tenantId])
  events   SubscriptionEvent[]

  // Not: "müşteri başına tek ACTIVE abonelik" kuralı geçiş dosyasına
  // elle eklenen SQL ile sağlanır (Prisma bu kuralı şemada yazamaz).

  @@unique([id, tenantId])
  @@index([tenantId, status]) // MRR hesabı için
  @@index([tenantId, customerId])
  @@index([tenantId, planId])
  @@map("subscriptions")
}

// Abonelikteki her durum değişikliğinin kaydı
model SubscriptionEvent {
  id             String    @id @default(cuid())
  tenantId       String
  subscriptionId String
  type           EventType
  createdAt      DateTime  @default(now())

  tenant       Tenant       @relation(fields: [tenantId], references: [id])
  // Olay, aynı firmanın aboneliğine ait olmak zorunda
  subscription Subscription @relation(fields: [subscriptionId, tenantId], references: [id, tenantId])

  @@index([tenantId, type, createdAt]) // Aylık churn hesabı için
  @@index([tenantId, subscriptionId])
  @@map("subscription_events")
}
````

Şemayı kontrol et:

````bash
npx prisma format
````

Şema dosyasını düzenli hizaya sokar ve yazım hatalarını gösterir.

````bash
npx prisma validate
````

Şemanın kurallara uygun olup olmadığını kontrol eder. “The schema ... is valid” görmelisin.

#### Adım 7: İlk geçişi oluştur (ama henüz uygulama)

````bash
npx prisma migrate dev --name init --create-only
````

Tabloları oluşturacak SQL dosyasını yazar, ama veritabanına uygulamaz.

prisma/migrations/ içinde adı tarih ve _init ile biten bir klasör oluşacak. İçinde migration.sql dosyası var. Dosyayı aç, en sonuna şunu ekle ve kaydet:

````sql
-- İş kuralı: bir müşterinin aynı anda yalnızca bir ACTIVE aboneliği olabilir.
-- Koşullu benzersiz indeks: yalnızca status = 'ACTIVE' olan satırlara uygulanır.
CREATE UNIQUE INDEX "subscriptions_one_active_per_customer"
  ON "subscriptions" ("customerId")
  WHERE "status" = 'ACTIVE';
````

#### Adım 8: Geçişi Neon’a uygula ve istemciyi üret

````bash
npx prisma migrate dev
````

Bekleyen geçişi (tabloları ve kuralı) Neon veritabanına uygular.

````bash
npx prisma generate
````

Uygulamanın kullanacağı Prisma istemci kodunu generated/prisma klasörüne üretir.

#### Adım 9: Kontrol et

````bash
npx prisma studio
````

Tarayıcıda tabloları gösteren bir panel açar. 6 tablo görmelisin. Her birine tıkla ve TENANTS dışındakilerde tenantId sütununun olduğunu kontrol et. İşin bitince Terminal’e dönüp Ctrl + C ile kapat (Mac’te de Ctrl, Cmd değil).

Neon panelinde: soldan Tables bölümüne gir. Aynı 6 tabloyu ve Prisma’nın kendi _prisma_migrations tablosunu göreceksin. Bu tablo normaldir.

Kuralın eklendiğini kontrol et: Neon’da SQL Editor’ü aç ve şunu çalıştır:

````sql
SELECT indexname FROM pg_indexes WHERE tablename = 'subscriptions';
````

Listede subscriptions_one_active_per_customer görmelisin.

Uygulamanın hâlâ derlendiğini kontrol et:

````bash
npm run build
````

Uygulamayı Render’ın yapacağı gibi derler. Hatasız bitmeli.

#### Adım 10: Commit ve GitHub

````bash
git status
````

Değişen dosyaları listeler. Listede .env OLMAMALI. .env.example, .gitignore, prisma.config.ts, prisma/ ve package.json olmalı. .env görürsen dur, bana yaz.

````bash
git add .
````

Değişiklikleri commit’e hazırlar.

````bash
git commit -m "feat: Prisma şeması ve ilk deploy"
````

Değişiklikleri kaydeder.

````bash
git push -u origin feat/gun-02-veri-modeli
````

Dalı GitHub’a gönderir.

GitHub’da deponu aç. Çıkan Compare & pull request düğmesine bas, ardından Create pull request ve Merge pull request ile main’e birleştir.

Güvenlik taraması: GitHub’da deponun ana sayfasında dosya listesine bak, .env olmamalı. Sonra sayfanın üstündeki arama kutusuna neon.tech yazıp bu depoda ara. Sonuç çıkmamalı.

#### Adım 11: Render’a ilk deploy

- render.com’da New + → Web Service’i seç.
- GitHub deposunu (abonetakip) seç ve Connect’e bas.
- Ayarları şöyle gir:

| Alan | Değer |
|---|---|
| Name | abonetakip |
| Region | Frankfurt (EU Central) |
| Branch | main |
| Runtime / Language | Node |
| Build Command | npm install && npx prisma generate && npm run build |
| Start Command | npm run start |
| Instance Type | Free |

Environment Variables bölümüne iki değişken ekle ve değerleri .env dosyandan sen kopyala:

- DATABASE_URL = havuzlu adres
- DIRECT_URL = doğrudan adres

Geçişi Render çalıştırmayacak olsa da DIRECT_URL gerekli. Çünkü npx prisma generate komutu prisma.config.ts dosyasını okuyor ve o dosya bu değişkeni arıyor.

NODE_ENV ekleme. Eklersen Render geliştirme paketlerini kurmaz ve derleme bozulur.

- Create Web Service’e bas. Kayıtlar (Logs) akacak. Sonunda “Your service is live” görmelisin.
- Sayfanın üstündeki https://abonetakip-xxxx.onrender.com adresine tıkla. Next.js’in boş başlangıç sayfası açılmalı. İlk açılış yarım dakikayı bulabilir.

#### Adım 12: README ve ADR’ye canlı adresi yaz

Yeni dal açmana gerek yok, küçük bir belge değişikliği:

````bash
git checkout main
````

Ana dala geçer.

````bash
git pull
````

Birleştirdiğin değişiklikleri çeker.

README.md dosyasına şu bölümü ekle (adresi kendininkiyle değiştir):

````markdown
## Canlı adres
https://abonetakip-xxxx.onrender.com
(Ücretsiz planda uygulama uykuya geçer, ilk açılış yavaş olabilir.)

## Veritabanı geçişi
Geçişler geliştiricinin bilgisayarından çalıştırılır, Render çalıştırmaz:
`npx prisma migrate dev`
````

ADR’ye şu kararı ekle:

````markdown
### Karar: Veritabanı bağlantısı ve geçiş yöntemi
- Neon PostgreSQL, Frankfurt bölgesi. Render da Frankfurt'ta (gecikme düşük).
- İki adres: DATABASE_URL (havuzlu, uygulama) ve DIRECT_URL (doğrudan, Prisma geçişleri).
- Geçişler geliştiricinin bilgisayarından elle çalıştırılır. Render build komutu yalnızca generate ve build içerir.
- Firma izolasyonu veritabanı seviyesinde de sağlanır: ilişkiler (id, tenantId) çifti üzerinden kurulur.
- "Müşteri başına tek ACTIVE abonelik" kuralı koşullu benzersiz indeksle veritabanında zorlanır.
````

````bash
git add README.md
````

README değişikliğini hazırlar. ADR dosyasının adı farklıysa onu da aynı şekilde ekle, örneğin git add docs/ADR.md.

````bash
git commit -m "docs: canlı adres ve veritabanı kararları"
````

Belge değişikliğini kaydeder.

````bash
git push
````

GitHub’a gönderir. Render da otomatik olarak yeniden yayınlar.

#### Varsayımlarım ve emin olmadığım yerler

- Önemli uyarı (ileride): Prisma, elle eklediğimiz koşullu indeksi şemada göremez. İleride yeni bir geçiş oluşturduğunda Prisma bu indeksi “fazlalık” sanıp silen bir DROP INDEX "subscriptions_one_active_per_customer" satırı yazabilir. Bundan sonra her geçişi --create-only ile oluştur ve migration.sql’de bu satırı görürsen sil. Bunu CLAUDE.md’ye kural olarak eklemeyi öneririm.
- Emin değilim: migrate dev Neon’da geçici bir “gölge veritabanı” (shadow database) oluşturur. Neon’un varsayılan kullanıcısı buna genellikle izin verir. “permission denied to create database” hatası alırsan bana gönder, ayrı bir ayarla çözeriz.
- Emin değilim: Neon panelindeki düğme adları (“Connect”, “Connection pooling”) arayüz güncellenmişse farklı görünebilir. Bulamazsan ekranda ne gördüğünü yaz.
- Emin değilim: Bir değişken eksik olduğunda env("DIRECT_URL") hata mı verir, boş mu döner. O yüzden Render’a her iki değişkeni de eklettim, güvenli yol bu.
- Emin değilim: Render’ın varsayılan Node sürümü. Next.js 16 ve Prisma 7 için Node 20'nin yeni sürümleri veya 22 gerekir. Render varsayılanı büyük olasılıkla uygun. Derleme kayıtlarında “Node version” hatası çıkarsa söyle.
- Emin değilim: @tailwindcss/turbopack paketi (önceki cevapta söylemiştim). Render derlemesi Tailwind kaynaklı hata verirse ilk bakacağımız yer burası.
- Varsayım: Prisma istemcisini proje kökünde generated/prisma klasörüne ürettim. Projen src/ klasörü kullanıyorsa yarın içe aktarma yolunu (import) buna göre ayarlayacağız.
- Varsayım: Sütun adları veritabanında da camelCase (tenantId), tablo adları küçük harf ve çoğul (subscriptions).

İlk adımlardan sonra npx prisma --version çıktısını ve olası hataları bana gönderebilirsin. Her şey sorunsuz giderse en sonda bitiş kontrol listesini birlikte işaretleriz.

##### Kullanıcı mesajı (terminal çıktısı)

````text
kullanici@bilgisayar abonetakip % git status
Üzerinde bulunulan dal: main
Dalınız "origin/main" ile güncel.

İşleme için hazırlanmamış değişiklikler:
  (işlenecekleri güncellemek için "git add <dosya>..." kullanın)
  (çalışma dizinindeki değişiklikleri atmak için
    "git restore <dosya>..." kullanın)
değiştirildi:         docs/03_Prompt_Gunlugu.md

İşlemeye eklenen değişiklik yok ("git add" ve/veya "git commit -a" kullanın)
````

_Deciding where to commit a pending documentation update._

_Deciding where to commit a pending documentation update._

Sorun yok, bu beklenen bir durum. docs/03_Prompt_Gunlugu.md dosyasında kaydetmediğin bir değişiklik var. Büyük olasılıkla bugünün promptunu günlüğe eklemişsin.

İki yol var. Önerim birinci yol: değişikliği yeni dala taşıyıp bugünün işiyle birlikte commit etmek. Prompt Günlüğü zaten Gün 2 boyunca güncellenmeye devam edecek, bu yüzden bugünün commit’ine aitmiş gibi duruyor.

#### Önce güvenlik kontrolü

Depo herkese açık, o yüzden günlüğe yanlışlıkla bir adres yapıştırılmadığından emin olalım:

````bash
git diff docs/03_Prompt_Gunlugu.md
````

Dosyada neyin değiştiğini gösterir. Yeşil (+) satırlar eklenenler, kırmızı (-) satırlar silinenlerdir. Ekran dolarsa Space ile ilerle, q ile çık.

Bakman gereken: eklenen satırlarda postgresql://, neon.tech ya da parola benzeri bir şey olmamalı. Varsa o satırı günlükten sil ya da [DATABASE_URL] ile değiştir ve kaydet.

#### Sonra dalı oluştur

git pull komutuna gerek yok, çünkü çıktıda “origin/main ile güncel” yazıyor.

````bash
git checkout -b feat/gun-02-veri-modeli
````

Yeni dalı oluşturur ve o dala geçer. Kaydedilmemiş günlük değişikliğin de seninle birlikte yeni dala taşınır, kaybolmaz.

````bash
git status
````

Kontrol için. İlk satırda “Üzerinde bulunulan dal: feat/gun-02-veri-modeli” yazmalı, docs/03_Prompt_Gunlugu.md yine “değiştirildi” olarak görünmeli.

Bu değişiklik, Adım 10'daki git add . ile bugünün commit’ine otomatik olarak girecek. Ayrıca bir şey yapmana gerek yok.

Ardından Adım 1 (paket kurulumu) ile devam et ve npx prisma --version çıktısını bana gönder.

İkinci yol: Günlük değişikliğini ayrı tutmak istersen, dalı açmadan önce main üzerinde git add docs/03_Prompt_Gunlugu.md, git commit -m "docs: prompt günlüğü güncellendi" ve git push komutlarını çalıştırabilirsin. İkisi de doğru, tercih senin.

#### Varsayımlarım

- Varsayım: Günlükteki değişikliği sen yaptın ve korumak istiyorsun. Tanımadığın bir değişiklik görürsen dur ve bana yaz.
- Emin olduğum: git checkout -b kaydedilmemiş değişiklikleri silmez, yeni dala taşır.

### Ham metin

<details>
<summary>Cevabın hiç düzenlenmemiş hâlini göstermek için tıkla</summary>

````text
Outlining the full setup and deployment sequence step by step.
Plan onaylandı, B seçeneğiyle başlıyoruz: geçişi kendi bilgisayarından çalıştıracaksın, Render yalnızca generate ve build yapacak.

Bir kural: her adımda bir hata görürsen dur ve hatanın tamamını bana gönder. Sonraki adıma geçme.

Adım 0: Yeni dal oluştur
Terminal’i aç ve proje klasörüne geç (klasör adın farklıysa onu yaz):

bash
cd ~/abonetakip
Terminal’i proje klasörüne götürür.

bash
git status
Kaydedilmemiş değişiklik var mı gösterir. “nothing to commit, working tree clean” görmelisin. Görmezsen dur ve bana yaz.

bash
git checkout main
Ana dala geçer.

bash
git pull
GitHub’daki en güncel hâli bilgisayarına çeker.

bash
git checkout -b feat/gun-02-veri-modeli
Bugünün çalışması için yeni dal oluşturur ve o dala geçer.

Adım 1: Paketleri kur
bash
npm install -D prisma@7 dotenv
Prisma komut aracını ve .env okuyucuyu geliştirme paketi olarak kurar.

bash
npm install @prisma/client@7
Uygulamanın veritabanıyla konuşacağı Prisma istemcisini kurar.

Sürümü @7 olarak sabitledim. Böylece bu dosyalarda kullandığım sözdizimiyle birebir uyumlu sürüm gelir. Kurulumu kontrol et:

bash
npx prisma --version
Kurulan Prisma sürümünü gösterir. prisma ve @prisma/client satırlarında 7. ile başlayan bir sayı görmelisin. Başka bir sayı görürsen dur ve çıktıyı bana gönder.

npx prisma init komutunu kullanmıyoruz, çünkü mevcut .env dosyana kendi satırlarını ekleyebiliyor. Dosyaları elle oluşturacağız.

Adım 2: .env dosyasını düzenle
2a. Doğrudan adresi taşı. Editörde (VS Code) proje kökündeki .env dosyasını aç. Şu an içinde DATABASE_URL="..." satırı var ve bu senin doğrudan adresin. Satırdaki DATABASE_URL adını DIRECT_URL olarak değiştir. Adresin kendisine dokunma.

2b. Havuzlu adresi al. Neon panelinde projeni aç ve Connect düğmesine bas. Açılan pencerede Connection pooling anahtarını aç. Adres değişecek ve sunucu adında -pooler görünecek. Bu adresi kopyala.

2c. .env dosyasına yeni bir satır ekle. Dosyanın son hâli şu yapıda olmalı (gerçek adresler senin dosyanda, burada yer tutucu var):

env
# Uygulama çalışırken kullanılır (havuzlu, -pooler içerir)
DATABASE_URL="[NEON_POOLED_URL]"

# Prisma geçişleri ve Prisma Studio için kullanılır (doğrudan)
DIRECT_URL="[NEON_DIRECT_URL]"
Kaydet: Cmd + S.

Adım 3: .env.example dosyası
Yeni dosya oluştur: .env.example (proje kökünde)

env
# Bu dosya örnektir. Gerçek değerleri .env dosyasına yaz, bu dosyaya yazma.
# Uygulama çalışırken kullanılır (Neon havuzlu adres, -pooler içerir)
DATABASE_URL="[NEON_POOLED_URL]"

# Prisma geçişleri ve Prisma Studio için kullanılır (Neon doğrudan adres)
DIRECT_URL="[NEON_DIRECT_URL]"
Adım 4: .gitignore kontrolü
.gitignore dosyasını aç. Next.js bu dosyaya genellikle .env* satırını koyar. Bu satır .env dosyasını korur, ama .env.example dosyasını da gizler. Bunu düzeltmek ve Prisma’nın üreteceği klasörü dışarıda bırakmak için dosyanın en sonuna şu satırları ekle:

gitignore
# Ortam değişkenleri: örnek dosya repoya girebilir, gerçek .env giremez
.env*
!.env.example

# Prisma'nın otomatik ürettiği istemci (her kurulumda yeniden üretilir)
/generated/prisma
Kaydet.

Adım 5: prisma.config.ts
Yeni dosya oluştur: prisma.config.ts (proje kökünde, package.json ile aynı yerde)

ts
// Prisma komut aracının (migrate, studio, generate) ayar dosyası.
// Prisma 7'de veritabanı adresi şema dosyasında değil, burada tanımlanır.

// .env dosyasındaki değişkenleri okur. Render'da .env yoktur,
// orada değişkenler panelden gelir ve bu satır sessizce geçer.
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Şema dosyasının yeri
  schema: "prisma/schema.prisma",

  // Geçiş (migration) dosyalarının tutulacağı klasör
  migrations: {
    path: "prisma/migrations",
  },

  // Komut aracı DOĞRUDAN adresi kullanır.
  // Neon'un havuzlu adresi şema değiştiren işlemler için uygun değildir.
  datasource: {
    url: env("DIRECT_URL"),
  },
});
Adım 6: prisma/schema.prisma
Proje kökünde prisma adında bir klasör oluştur. İçinde yeni dosya oluştur: prisma/schema.prisma

prisma
// AboneTakip veri şeması
// Kural: TENANTS dışındaki her tabloda tenantId zorunludur.
// Firmalar arası karışmayı engellemek için ilişkiler (id, tenantId) çifti
// üzerinden kurulur. Böylece A firmasının aboneliği B firmasının
// müşterisine veritabanı seviyesinde bağlanamaz.

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

// Adres burada değil, prisma.config.ts dosyasında tanımlıdır (Prisma 7).
datasource db {
  provider = "postgresql"
}

// ---------- Enum'lar (sabit seçenek listeleri) ----------

enum Role {
  manager // firma sahibi
  finance // finans çalışanı
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

// Kiracı: uygulamayı kullanan müşteri firma
model Tenant {
  id        String   @id @default(cuid())
  name      String
  cac       Int      @default(0) // Müşteri edinme maliyeti, TL, tam sayı
  createdAt DateTime @default(now())

  users         User[]
  customers     Customer[]
  plans         Plan[]
  subscriptions Subscription[]
  events        SubscriptionEvent[]

  @@map("tenants")
}

// Uygulamaya giriş yapan kişi
model User {
  id           String   @id @default(cuid())
  tenantId     String
  name         String
  email        String   @unique // Giriş e-postayla yapıldığı için tüm sistemde benzersiz
  passwordHash String // Parolanın bcrypt özeti, düz parola asla saklanmaz
  role         Role
  createdAt    DateTime @default(now())

  tenant Tenant @relation(fields: [tenantId], references: [id])

  @@index([tenantId])
  @@map("users")
}

// Firmanın kendi abone müşterisi
model Customer {
  id        String   @id @default(cuid())
  tenantId  String
  name      String
  email     String
  isActive  Boolean  @default(true) // Silinmez, pasife alınır
  createdAt DateTime @default(now())

  tenant        Tenant         @relation(fields: [tenantId], references: [id])
  subscriptions Subscription[]

  // (id, tenantId) çifti abonelik ilişkisinin firma kontrolü için gerekir
  @@unique([id, tenantId])
  @@index([tenantId])
  @@map("customers")
}

// Firmanın sattığı abonelik planı
model Plan {
  id        String       @id @default(cuid())
  tenantId  String
  name      String
  price     Int // TL, tam sayı (kuruş yok)
  interval  PlanInterval
  isActive  Boolean      @default(true) // Silinmez, pasife alınır
  createdAt DateTime     @default(now())

  tenant        Tenant         @relation(fields: [tenantId], references: [id])
  subscriptions Subscription[]

  @@unique([id, tenantId])
  @@index([tenantId])
  @@map("plans")
}

// Bir müşterinin bir plana aboneliği
model Subscription {
  id               String             @id @default(cuid())
  tenantId         String
  customerId       String
  planId           String
  status           SubscriptionStatus @default(ACTIVE)
  startedAt        DateTime           @default(now())
  currentPeriodEnd DateTime
  canceledAt       DateTime? // Yalnızca iptal edilince dolar

  tenant   Tenant   @relation(fields: [tenantId], references: [id])
  // Müşteri ve plan aynı firmaya ait olmak zorunda
  customer Customer @relation(fields: [customerId, tenantId], references: [id, tenantId])
  plan     Plan     @relation(fields: [planId, tenantId], references: [id, tenantId])
  events   SubscriptionEvent[]

  // Not: "müşteri başına tek ACTIVE abonelik" kuralı geçiş dosyasına
  // elle eklenen SQL ile sağlanır (Prisma bu kuralı şemada yazamaz).

  @@unique([id, tenantId])
  @@index([tenantId, status]) // MRR hesabı için
  @@index([tenantId, customerId])
  @@index([tenantId, planId])
  @@map("subscriptions")
}

// Abonelikteki her durum değişikliğinin kaydı
model SubscriptionEvent {
  id             String    @id @default(cuid())
  tenantId       String
  subscriptionId String
  type           EventType
  createdAt      DateTime  @default(now())

  tenant       Tenant       @relation(fields: [tenantId], references: [id])
  // Olay, aynı firmanın aboneliğine ait olmak zorunda
  subscription Subscription @relation(fields: [subscriptionId, tenantId], references: [id, tenantId])

  @@index([tenantId, type, createdAt]) // Aylık churn hesabı için
  @@index([tenantId, subscriptionId])
  @@map("subscription_events")
}
Şemayı kontrol et:

bash
npx prisma format
Şema dosyasını düzenli hizaya sokar ve yazım hatalarını gösterir.

bash
npx prisma validate
Şemanın kurallara uygun olup olmadığını kontrol eder. “The schema ... is valid” görmelisin.

Adım 7: İlk geçişi oluştur (ama henüz uygulama)
bash
npx prisma migrate dev --name init --create-only
Tabloları oluşturacak SQL dosyasını yazar, ama veritabanına uygulamaz.

prisma/migrations/ içinde adı tarih ve _init ile biten bir klasör oluşacak. İçinde migration.sql dosyası var. Dosyayı aç, en sonuna şunu ekle ve kaydet:

sql
-- İş kuralı: bir müşterinin aynı anda yalnızca bir ACTIVE aboneliği olabilir.
-- Koşullu benzersiz indeks: yalnızca status = 'ACTIVE' olan satırlara uygulanır.
CREATE UNIQUE INDEX "subscriptions_one_active_per_customer"
  ON "subscriptions" ("customerId")
  WHERE "status" = 'ACTIVE';
Adım 8: Geçişi Neon’a uygula ve istemciyi üret
bash
npx prisma migrate dev
Bekleyen geçişi (tabloları ve kuralı) Neon veritabanına uygular.

bash
npx prisma generate
Uygulamanın kullanacağı Prisma istemci kodunu generated/prisma klasörüne üretir.

Adım 9: Kontrol et
bash
npx prisma studio
Tarayıcıda tabloları gösteren bir panel açar. 6 tablo görmelisin. Her birine tıkla ve TENANTS dışındakilerde tenantId sütununun olduğunu kontrol et. İşin bitince Terminal’e dönüp Ctrl + C ile kapat (Mac’te de Ctrl, Cmd değil).

Neon panelinde: soldan Tables bölümüne gir. Aynı 6 tabloyu ve Prisma’nın kendi _prisma_migrations tablosunu göreceksin. Bu tablo normaldir.

Kuralın eklendiğini kontrol et: Neon’da SQL Editor’ü aç ve şunu çalıştır:

sql
SELECT indexname FROM pg_indexes WHERE tablename = 'subscriptions';
Listede subscriptions_one_active_per_customer görmelisin.

Uygulamanın hâlâ derlendiğini kontrol et:

bash
npm run build
Uygulamayı Render’ın yapacağı gibi derler. Hatasız bitmeli.

Adım 10: Commit ve GitHub
bash
git status
Değişen dosyaları listeler. Listede .env OLMAMALI. .env.example, .gitignore, prisma.config.ts, prisma/ ve package.json olmalı. .env görürsen dur, bana yaz.

bash
git add .
Değişiklikleri commit’e hazırlar.

bash
git commit -m "feat: Prisma şeması ve ilk deploy"
Değişiklikleri kaydeder.

bash
git push -u origin feat/gun-02-veri-modeli
Dalı GitHub’a gönderir.

GitHub’da deponu aç. Çıkan Compare & pull request düğmesine bas, ardından Create pull request ve Merge pull request ile main’e birleştir.

Güvenlik taraması: GitHub’da deponun ana sayfasında dosya listesine bak, .env olmamalı. Sonra sayfanın üstündeki arama kutusuna neon.tech yazıp bu depoda ara. Sonuç çıkmamalı.

Adım 11: Render’a ilk deploy
render.com’da New + → Web Service’i seç.
GitHub deposunu (abonetakip) seç ve Connect’e bas.
Ayarları şöyle gir:
Alan	Değer
Name	abonetakip
Region	Frankfurt (EU Central)
Branch	main
Runtime / Language	Node
Build Command	npm install && npx prisma generate && npm run build
Start Command	npm run start
Instance Type	Free
Environment Variables bölümüne iki değişken ekle ve değerleri .env dosyandan sen kopyala:
DATABASE_URL = havuzlu adres
DIRECT_URL = doğrudan adres
Geçişi Render çalıştırmayacak olsa da DIRECT_URL gerekli. Çünkü npx prisma generate komutu prisma.config.ts dosyasını okuyor ve o dosya bu değişkeni arıyor.

NODE_ENV ekleme. Eklersen Render geliştirme paketlerini kurmaz ve derleme bozulur.

Create Web Service’e bas. Kayıtlar (Logs) akacak. Sonunda “Your service is live” görmelisin.
Sayfanın üstündeki https://abonetakip-xxxx.onrender.com adresine tıkla. Next.js’in boş başlangıç sayfası açılmalı. İlk açılış yarım dakikayı bulabilir.
Adım 12: README ve ADR’ye canlı adresi yaz
Yeni dal açmana gerek yok, küçük bir belge değişikliği:

bash
git checkout main
Ana dala geçer.

bash
git pull
Birleştirdiğin değişiklikleri çeker.

README.md dosyasına şu bölümü ekle (adresi kendininkiyle değiştir):

markdown
## Canlı adres
https://abonetakip-xxxx.onrender.com
(Ücretsiz planda uygulama uykuya geçer, ilk açılış yavaş olabilir.)

## Veritabanı geçişi
Geçişler geliştiricinin bilgisayarından çalıştırılır, Render çalıştırmaz:
`npx prisma migrate dev`
ADR’ye şu kararı ekle:

markdown
### Karar: Veritabanı bağlantısı ve geçiş yöntemi
- Neon PostgreSQL, Frankfurt bölgesi. Render da Frankfurt'ta (gecikme düşük).
- İki adres: DATABASE_URL (havuzlu, uygulama) ve DIRECT_URL (doğrudan, Prisma geçişleri).
- Geçişler geliştiricinin bilgisayarından elle çalıştırılır. Render build komutu yalnızca generate ve build içerir.
- Firma izolasyonu veritabanı seviyesinde de sağlanır: ilişkiler (id, tenantId) çifti üzerinden kurulur.
- "Müşteri başına tek ACTIVE abonelik" kuralı koşullu benzersiz indeksle veritabanında zorlanır.
bash
git add README.md
README değişikliğini hazırlar. ADR dosyasının adı farklıysa onu da aynı şekilde ekle, örneğin git add docs/ADR.md.

bash
git commit -m "docs: canlı adres ve veritabanı kararları"
Belge değişikliğini kaydeder.

bash
git push
GitHub’a gönderir. Render da otomatik olarak yeniden yayınlar.

Varsayımlarım ve emin olmadığım yerler
Önemli uyarı (ileride): Prisma, elle eklediğimiz koşullu indeksi şemada göremez. İleride yeni bir geçiş oluşturduğunda Prisma bu indeksi “fazlalık” sanıp silen bir DROP INDEX "subscriptions_one_active_per_customer" satırı yazabilir. Bundan sonra her geçişi --create-only ile oluştur ve migration.sql’de bu satırı görürsen sil. Bunu CLAUDE.md’ye kural olarak eklemeyi öneririm.
Emin değilim: migrate dev Neon’da geçici bir “gölge veritabanı” (shadow database) oluşturur. Neon’un varsayılan kullanıcısı buna genellikle izin verir. “permission denied to create database” hatası alırsan bana gönder, ayrı bir ayarla çözeriz.
Emin değilim: Neon panelindeki düğme adları (“Connect”, “Connection pooling”) arayüz güncellenmişse farklı görünebilir. Bulamazsan ekranda ne gördüğünü yaz.
Emin değilim: Bir değişken eksik olduğunda env("DIRECT_URL") hata mı verir, boş mu döner. O yüzden Render’a her iki değişkeni de eklettim, güvenli yol bu.
Emin değilim: Render’ın varsayılan Node sürümü. Next.js 16 ve Prisma 7 için Node 20'nin yeni sürümleri veya 22 gerekir. Render varsayılanı büyük olasılıkla uygun. Derleme kayıtlarında “Node version” hatası çıkarsa söyle.
Emin değilim: @tailwindcss/turbopack paketi (önceki cevapta söylemiştim). Render derlemesi Tailwind kaynaklı hata verirse ilk bakacağımız yer burası.
Varsayım: Prisma istemcisini proje kökünde generated/prisma klasörüne ürettim. Projen src/ klasörü kullanıyorsa yarın içe aktarma yolunu (import) buna göre ayarlayacağız.
Varsayım: Sütun adları veritabanında da camelCase (tenantId), tablo adları küçük harf ve çoğul (subscriptions).
İlk adımlardan sonra npx prisma --version çıktısını ve olası hataları bana gönderebilirsin. Her şey sorunsuz giderse en sonda bitiş kontrol listesini birlikte işaretleriz.

kullanici@bilgisayar abonetakip % git status
Üzerinde bulunulan dal: main
Dalınız "origin/main" ile güncel.

İşleme için hazırlanmamış değişiklikler:
  (işlenecekleri güncellemek için "git add <dosya>..." kullanın)
  (çalışma dizinindeki değişiklikleri atmak için
    "git restore <dosya>..." kullanın)
değiştirildi:         docs/03_Prompt_Gunlugu.md

İşlemeye eklenen değişiklik yok ("git add" ve/veya "git commit -a" kullanın)

Deciding where to commit a pending documentation update.
Deciding where to commit a pending documentation update.
Sorun yok, bu beklenen bir durum. docs/03_Prompt_Gunlugu.md dosyasında kaydetmediğin bir değişiklik var. Büyük olasılıkla bugünün promptunu günlüğe eklemişsin.

İki yol var. Önerim birinci yol: değişikliği yeni dala taşıyıp bugünün işiyle birlikte commit etmek. Prompt Günlüğü zaten Gün 2 boyunca güncellenmeye devam edecek, bu yüzden bugünün commit’ine aitmiş gibi duruyor.

Önce güvenlik kontrolü
Depo herkese açık, o yüzden günlüğe yanlışlıkla bir adres yapıştırılmadığından emin olalım:

bash
git diff docs/03_Prompt_Gunlugu.md
Dosyada neyin değiştiğini gösterir. Yeşil (+) satırlar eklenenler, kırmızı (-) satırlar silinenlerdir. Ekran dolarsa Space ile ilerle, q ile çık.

Bakman gereken: eklenen satırlarda postgresql://, neon.tech ya da parola benzeri bir şey olmamalı. Varsa o satırı günlükten sil ya da [DATABASE_URL] ile değiştir ve kaydet.

Sonra dalı oluştur
git pull komutuna gerek yok, çünkü çıktıda “origin/main ile güncel” yazıyor.

bash
git checkout -b feat/gun-02-veri-modeli
Yeni dalı oluşturur ve o dala geçer. Kaydedilmemiş günlük değişikliğin de seninle birlikte yeni dala taşınır, kaybolmaz.

bash
git status
Kontrol için. İlk satırda “Üzerinde bulunulan dal: feat/gun-02-veri-modeli” yazmalı, docs/03_Prompt_Gunlugu.md yine “değiştirildi” olarak görünmeli.

Bu değişiklik, Adım 10'daki git add . ile bugünün commit’ine otomatik olarak girecek. Ayrıca bir şey yapmana gerek yok.

Ardından Adım 1 (paket kurulumu) ile devam et ve npx prisma --version çıktısını bana gönder.

İkinci yol: Günlük değişikliğini ayrı tutmak istersen, dalı açmadan önce main üzerinde git add docs/03_Prompt_Gunlugu.md, git commit -m "docs: prompt günlüğü güncellendi" ve git push komutlarını çalıştırabilirsin. İkisi de doğru, tercih senin.

Varsayımlarım
Varsayım: Günlükteki değişikliği sen yaptın ve korumak istiyorsun. Tanımadığın bir değişiklik görürsen dur ve bana yaz.
Emin olduğum: git checkout -b kaydedilmemiş değişiklikleri silmez, yeni dala taşır.
````

</details>

## Sonuç

| | |
|---|---|
| **Ne istendi** | Prisma şeması, Neon bağlantısı ve ilk deploy |
| **Ne üretildi** | Prisma 7 şeması, geçiş (migration) adımları ve Render kurulumu |
| **Düzeltme gerekti mi** | Evet. Dosya yolu `~/Projeler/abonetakip` olarak düzeltildi, git adımları GitHub Desktop'a uyarlandı, README ve ADR dosya adları düzeltildi |

**Bu günün önemli olayı (güvenlik dersi):** Süreçte `.env.example` dosyasına yanlışlıkla gerçek veritabanı adresi girdi ve herkese açık depoya gitti. Fark edildi, Neon parolası yenilendi ve dosya yer tutucularla düzeltildi. Bu olaydan sonra "commit öncesi `git grep` ile kontrol" kuralı proje talimatına eklendi (ayrıntı için [ADR](../docs/02_ADR.md)).

Bu sayfadaki metinde gerçek adres ya da parola yoktur. Yalnızca "depoda `neon.tech` ara" gibi kontrol talimatı cümleleri geçer.
