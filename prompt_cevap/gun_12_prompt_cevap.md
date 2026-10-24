# Gün 12: Güvenlik gözden geçirme

> **Araç:** Claude (claude.ai), "SUNUCU TABANLI PROGRAMLAMA - SaaS PROJESİ" Project'i içindeki sohbetler.
> **Tarih:** 24 Eki 2026 (Türkiye saati). **Kapsam:** 32 prompt ve 32 cevap.
> Kutulardaki metin benim yazdığım prompttur (olduğu gibi). Girintili (`>` ile başlayan) alanlar Claude'un cevabıdır, başlık, tablo ve kod blokları orijinal Markdown'dır. Ekran görüntüleri metin olmadığı için `[ekran görüntüsü]` satırı olarak işaretlenmiştir. Yapay zekânın iç düşünme adımları ve araç çağrıları dahil değildir.
> Gizli bilgi taraması yapılmıştır. Ad taramasının kendi arama deseni `[AD_DESENI]` olarak yazılmıştır. Mac kullanıcı adı, okul kısaltması, veritabanı sunucu adı ve parola benzeri değerler maskelenmiştir.
> Bu gün ayrı bir sohbette yürütüldü. Ana sohbette yapılan yönlendirme ve inceleme mesajları bu dosyaya dahil değildir.


## Bu günün özeti

_Bu bölümü ben yazdım, yapay zekâ cevabı değildir. Kaynağı Prompt Günlüğü'dür._

| | |
|---|---|
| **Ne istendi** | Gün 12 promptu: güvenlik gözden geçirmesi. Önce yalnızca bulgu raporu (kod değişikliği yok), onaydan sonra düzeltmeler ve ADR güncellemesi |
| **Ne üretildi** | 12 bulguluk rapor (tek orta bulgu B1, gerisi düşük; yüksek yok). Düzeltmeler: B1 giriş deneme sınırı (15 dakikada 5 deneme, e-posta başına, bellekte; PR #40), B6 issue #24 firma tablosu kimlik kuralı, B10 güvenlik başlıkları ve B12 `fast-uri` güncellemesi (PR #41), B8 `DATABASE_URL` için `sslmode=verify-full` (yalnızca ortam değişkenleri, depoda değişiklik yok); ADR Gün 12 bölümü (PR #42). `npm test` 105 ve `npm run test:db` 57 test, `npm audit --omit=dev` 0 açık |
| **Düzeltme gerekti mi** | Evet: (1) ilk adımda sohbetin çalışma alanında kod yoktu, depo adı verilip kod depodan okundu; (2) IP başına sınır `X-Forwarded-For` belgeli olmadığı için bırakıldı, yalnızca e-posta başına sınır konuldu; (3) B7 (tetikleyici) bilinçli olarak yapılmadı, kabul edilen sınır olarak ADR'ye yazıldı; (4) `DIRECT_URL` değiştirilmedi, çünkü Prisma 7 dokümanı `verify-full` değerini listelemiyor; (5) yapıştırma sırasında bir test dosyasının sonu kesilmiş göründü, commit'teki dosya doğrulanınca tam çıktı; (6) Terminal'de Cmd+F ekran geçmişini de taradığı için `SECURITY WARNING` kontrolü yanıltıcı oldu, kontroller sayarak yapıldı; (7) GitHub squash birleştirmede ekleri yeniden sıraladığı için PR #42'de ekler elle düzeltildi, PR #40.ta düzelmedi (Gün 14 notu) |

## Gün 12 sohbeti (bulgu raporu, düzeltme planları, komutlar, test sonuçları ve ADR)

_Bulgu raporu, üç düzeltme parçası (B1; B6, B10 ve B12; B8) ve ADR güncellemesi bu sohbette yürütüldü._

### Prompt 1 · 24 Eki 2026 08:25

````text
```markdown
Bu bir devam oturumu. Proje talimatlarındaki (CLAUDE.md) kurallara uy.
 sade ve adım adım anlat.
Önce plan ver, ben onaylamadan dosya değiştirme. Cevabın sonunda
varsayımlarını ve emin olmadığın yerleri listele.
Bugünün konusu: 
## Gün 12 • Güvenlik gözden geçirme

**Amaç:** Yetki, tenant ve secret kontrolü; bulguları kapatmak.

```
[Rol] Bu görevde uygulama güvenliği konusunda uzman bir kod gözden
geçirici olarak davran.

[Görev] AboneTakip'in güvenlik gözden geçirmesini yap. Önce yalnızca
bulgu listesi çıkar, kod değiştirme.

Kontrol listesi:
1) Kiracı izolasyonu: tenantId filtresi uygulanmamış bir sorgu var mı?
   Başka kiracının kaydına id ile erişilebiliyor mu?
2) Yetki: rol kontrolleri sunucu tarafında mı? Finance'in manager
   işlemlerine erişimi mümkün mü?
3) Kimlik doğrulama: parola özetleme, oturum çerezi ayarları (httpOnly,
   secure, sameSite), oturum sonlandırma.
4) Girdi doğrulama: tüm formlar ve uç noktalar sunucuda doğrulanıyor mu?
5) Secret yönetimi: koda veya repoya girmiş secret var mı? .gitignore
   doğru mu? (Git geçmişinde .env görünüyorsa bunu ayrıca belirt.)
6) SSE: yetkisiz bağlantı ve tenant sızıntısı.
7) Hata mesajları: iç bilgi (veritabanı hatası, yığın izi) kullanıcıya
   sızıyor mu?
8) Giriş denemesi: tekrarlı yanlış girişe karşı basit bir önlem var mı?
   (Yoksa kapsam dışı mı bırakılsın, basit bir sınırlama mı eklensin?
   Gerekçesiyle öner.)
9) Bağımlılıklar: kullanılan paketlerin hepsi gerçek ve gerekli mi?

[Kısıtlar]
- Her bulgu için: dosya yolu, açıklama, risk (yüksek, orta, düşük),
  önerilen düzeltme.
- Bulgu dışı yorum ve yeni özellik önerisi yapma.
- İncelemediğin bir dosya varsa "bu dosyayı göster" de, tahmin etme.

[Format] Özet tablo, ardından ayrıntı. En sonda en çok 5 maddelik
"önce bunları düzelt" listesi. Onayımdan sonra tek tek düzeltme adımları
vereceksin.

[Doğrulama] Her bulgunun gerçekten koda dayandığını teyit et.
Varsayımlarını listele.
```

**Bitiş kontrolü**
- [ ] Yüksek ve orta öncelikli bulgular kapandı
- [ ] Git geçmişinde veya repoda secret yok (GitHub'da `.env` aratıp doğrula)
- [ ] ADR'de "Değişiklik geçmişi" ve riskler güncellendi
- **Commit:** `fix: güvenlik gözden geçirme düzeltmeleri`

---

```
````

### Claude cevabı 1 · 24 Eki 2026 08:25

> Önce çalışma alanında projenin kodu var mı bakıyorum; inceleme koda dayanmalı.
> Gün 12 için çalışma alanında projenin kodu yok. Bu yüzden şu an bulgu listesi çıkaramıyorum; görmediğim kod hakkında bulgu yazarsam tahmin etmiş olurum. Önce planı ve bana neyin gerektiğini veriyorum.
>
> ## Plan (onayını bekliyor)
>
> **Adım 0: Kodu görmem gerekiyor.** İki yol var, birini seç:
>
> - **Yol A (önerilen):** GitHub deponun adını yaz (`kullaniciadi/repo-adi` biçiminde). Depo herkese açık olduğu için onu bu oturuma bağlayıp tüm dosyaları kendim okuyabilirim. Böylece hiçbir dosyayı atlamam.
> - **Yol B:** Aşağıdaki listedeki dosyaları buraya ekle (sürükle bırak). `.env` dosyasını **ekleme**.
>
> **Adım 1: İnceleme sırası** (kontrol listendeki 9 madde, dosyalara göre):
>
> | Madde | Bakacağım yerler |
> |---|---|
> | 1 Kiracı izolasyonu | `prisma/schema.prisma`, merkezi tenant yardımcı fonksiyonu (ör. `lib/` altı), tüm `app/api/**/route.ts` ve server action dosyaları |
> | 2 Yetki | Oturumdan rol okuyan yardımcı, ayarlar, kullanıcı yönetimi ve CAC uç noktaları, `middleware.ts` varsa |
> | 3 Kimlik doğrulama | Giriş, kayıt, çıkış uç noktaları, çerez ayarlarının yapıldığı dosya |
> | 4 Girdi doğrulama | Her form ve uç noktadaki doğrulama kodu |
> | 5 Secret | `.gitignore`, `.env.example`, kodda `process.env` kullanımları, git geçmişi |
> | 6 SSE | SSE uç noktası ve uyarı gönderen kod |
> | 7 Hata mesajları | `catch` blokları, `error.tsx` dosyaları |
> | 8 Giriş denemesi | Giriş uç noktası |
> | 9 Bağımlılıklar | `package.json` |
>
> **Adım 2:** İstediğin formatta rapor: özet tablo → ayrıntı (dosya yolu, açıklama, risk, düzeltme) → en çok 5 maddelik "önce bunları düzelt" listesi. Kod değiştirmem.
>
> **Adım 3:** Sen onaylayınca bulguları tek tek, tam dosya olarak düzeltirim.
>
> ## Şimdiden kendin çalıştırabileceğin 3 komut (madde 5 için)
>
> Bunlar dosya içeriği basmaz, yalnızca dosya adı ya da kural gösterir. Terminal'de proje klasöründeyken sırayla çalıştır ve çıktıları bana yapıştır.
>
> 1. Git geçmişinde adı `.env` içeren bir dosya hiç commit edilmiş mi diye bakar (çıktıda yalnızca `.env.example` olmalı):
> ```zsh
> git --no-pager log --all --name-only --format="" | grep -i "\.env" | sort -u
> ```
>
> 2. `.env` dosyasının gerçekten git tarafından yok sayıldığını ve hangi kuralla yok sayıldığını gösterir:
> ```zsh
> git check-ignore -v .env
> ```
>
> 3. Proje kurallarındaki iki parola ve sunucu adı taraması (ilkinin çıktısı boş, ikincisinin sonucu `0` olmalı):
> ```zsh
> git --no-pager grep -c -E "npg_[A-Za-z0-9]{6,}"
> git --no-pager grep -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
> ```
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - Proje yapısını (`app/api/...`, `lib/...`) Next.js App Router alışkanlığına göre tahmin ettim. Gerçek dosya adları farklı olabilir. Depoyu görünce düzelteceğim.
> - Oturum yönetimini kendin mi yazdın, yoksa bir kütüphane mi (ör. NextAuth/Auth.js) kullanıyorsun, bilmiyorum. Madde 3 buna göre değişir.
> - 1. komutta `.env` dışında `.env.local` gibi bir ad çıkarsa, o dosya geçmişte repoya girmiş demektir. Bu durumda yalnızca silmek yetmez, Neon parolasını değiştirmek gerekir. Böyle bir şey çıkarsa ayrıca adım adım anlatırım.
>
> Depo adını ya da dosyaları gönderdiğinde incelemeye başlarım.

### Prompt 2 · 24 Eki 2026 14:59

````text
Yol A ile devam: depo ozgesoganci1-bot/abonetakip. Kodu depodan oku, hiçbir dosyayı tahmin etme. Kod değiştirme, yalnızca bulgu raporu ver. Her bulguda dosya yolu ve ilgili kod satırını göster.

Bilinen sınırlar (ADR'de kayıtlı): oturum çerezi çıkışta iptal edilmiyor, giriş denemesi sınırı yok, SSE hub tek süreçte bellekte, issue #24 açık, pg sslmode uyarısı. Bunları da rapora risk derecesiyle dahil et.

Madde 5 için çalıştırdığım komutların sonuçları:
- Git geçmişinde .env adlı dosya hiç commit edilmemiş, yalnızca .env.example ve .env.test.example var.
- .env ve .env.test, .gitignore içindeki ".env*" kuralıyla yok sayılıyor.
- Mevcut dosyalarda parola deseni yok, gerçek Neon sunucu adı yok (tarama sonuçları boş ve 0).
- Git geçmişi taraması: parola ve sunucu adı deseni yalnızca iki eski uzak dalda var (feat/gun-02-veri-modeli, fix/env-yer-tutucu). Bu, Gün 2'deki bilinen sızıntı. Şu anki canlı ve test parolaları geçmişte hiç geçmiyor, yani eski parola yenilenmiş. main dalı temiz. Bunu rapora "kalan düşük risk" olarak yaz.

Onayım olmadan düzeltme yazma. Raporun sonunda en çok 5 maddelik "önce bunları düzelt" listesi ver.
````

### Claude cevabı 2 · 24 Eki 2026 14:59

> Depoyu bu oturuma bağlayıp kodu okuyorum.
> Depoyu (`main`, son commit `c794061`) klonlayıp okudum. Uygulamadaki bütün veritabanı sorgularını (15 dosyada) tek tek inceledim. Kod değiştirmedim.
>
> ## Özet tablo
>
> | No | Madde | Bulgu | Risk |
> |---|---|---|---|
> | B1 | 8 | Giriş ve kayıtta deneme sınırı yok (ADR G1) | **Orta** |
> | B2 | 3 | Oturum çerezi çıkışta sunucuda iptal edilmiyor, 7 gün geçerli (ADR G2) | Düşük |
> | B3 | 6 | Çıkış yapılan sekmenin SSE bağlantısı 15 dakikaya kadar açık kalıyor | Düşük |
> | B4 | 6 | SSE hub tek süreçte, bellekte | Düşük |
> | B5 | 6 | SSE'de toplam bağlantı üst sınırı yok, yalnızca firma başına 20 | Düşük |
> | B6 | 1 | Issue #24: Firma tablosunda başka kimlik istenince sessizce kendi firma dönüyor | Düşük |
> | B7 | 1 | Veritabanı düzeyinde "tenantId değiştirilemez" tetikleyicisi yok | Düşük |
> | B8 | 5 | pg `sslmode` uyarısı (ileride daha zayıf TLS davranışı) | Düşük |
> | B9 | 5 | Eski iki uzak dalda Gün 2 sızıntısı (parola yenilenmiş) | Düşük (kalan) |
> | B10 | 3 | Güvenlik başlıkları yok (çerçeveye gömme, `X-Powered-By`) | Düşük |
> | B11 | 3 | Kayıt formu e-postanın kayıtlı olduğunu söylüyor (ADR G4) | Düşük |
>
> **Yüksek risk bulgusu yok.** Madde 2, 4, 7 ve 9'da bulgu çıkmadı (aşağıda gerekçesi var).
>
> ## Ayrıntı
>
> ### B1. Giriş ve kayıtta deneme sınırı yok (Orta)
> **Dosya:** `src/lib/auth.ts`, satır 154–181 ve 93–104
> ```ts
> 172  const ozet = kullanici?.passwordHash ?? (await sahteOzetiAl());
> 173  const dogruMu = await bcrypt.compare(parola, ozet);
> ```
> **Açıklama:** Aynı e-postaya sınırsız parola denenebilir. Ayrıca her deneme bcrypt (maliyet 12) çalıştırır, bu işlemciyi yoran bir hesaptır. Render'da tek sunucu olduğu için, çok sayıda istek gönderen biri uygulamayı herkes için yavaşlatabilir. Kayıt da sınırsızdır.
> **Madde 8 önerisi:** Kapsam dışı bırakmak yerine **basit bir sınırlama eklensin.** Gerekçe: depo ve site herkese açık, bcrypt pahalı ve sunucu tek. ADR'deki plana uygun: bellek içi sayaç, yeni paket yok. Örnek kural: aynı e-postaya 15 dakikada 5 hatalı denemeden sonra geçici blok. Ek olarak IP başına daha geniş bir sınır, kayıt için de IP başına sınır. Sunucu yeniden başlayınca sayaç sıfırlanır; bu proje için kabul edilebilir.
>
> ### B2. Oturum çıkışta iptal edilmiyor (Düşük, bilinen sınır)
> **Dosya:** `src/lib/session.ts`, satır 11 ve 89–92
> ```ts
> 11  const SURE_SANIYE = 60 * 60 * 24 * 7; // 7 gün
> 91    cerezler.delete(COOKIE_ADI);
> ```
> **Açıklama:** Çıkış yalnızca tarayıcıdaki çerezi siler. Çerezin bir kopyası ele geçirilirse 7 gün geçerli kalır. Çerez `httpOnly`, `sameSite: "lax"`, üretimde `secure`; kodda XSS yolu bulmadım, bu yüzden çalınması zordur.
> **Öneri:** İki seçenek. (a) Kabul edip ADR'de bırakmak. (b) `User` tablosuna bir oturum sürümü sütunu eklemek, çıkışta artırmak ve çerezdeki sürümle karşılaştırmak (geçiş dosyası gerekir). Ayrıca 7 günlük süre kısaltılabilir.
>
> ### B3. Çıkıştan sonra SSE bağlantısı açık kalabiliyor (Düşük, bilinen sınır)
> **Dosya:** `src/app/api/events/route.ts`, satır 39
> ```ts
> 39  const BAGLANTI_OMRU_MS = 15 * 60 * 1000;
> ```
> **Açıklama:** Başka sekmeden çıkış yapılırsa açık kalan sekme en fazla 15 dakika daha aynı firmanın iptal uyarılarını (müşteri adı) alır. B2 çözülürse yeniden bağlanmada zaten 401 alınır.
> **Öneri:** B2'ye bağlı. Ayrıca süre 5 dakikaya indirilebilir.
>
> ### B4. SSE hub tek süreçte, bellekte (Düşük, bilinen sınır)
> **Dosya:** `src/lib/sse-hub.ts`, satır 11–12 ve 129–131
> ```ts
> 130  export const sseHub: SseHub = depo.abonetakipSseHub ?? hubOlustur();
> ```
> **Açıklama:** Güvenlik açığı değil, uyarı kaybı riskidir. Render'da birden fazla sunucu açılırsa bir sunucudaki iptal diğerindeki kullanıcılara gitmez. Firmalar arası sızıntı yoktur.
> **Öneri:** Render'da sunucu sayısını 1'de tutmak ve ADR'de yazılı bırakmak.
>
> ### B5. SSE'de toplam bağlantı sınırı yok (Düşük)
> **Dosya:** `src/lib/sse-hub.ts`, satır 23 ve 68–70
> ```ts
> 23  export const FIRMA_BASINA_SINIR = 20;
> 70    if (mevcut && mevcut.size >= sinir) return { ok: false };
> ```
> **Açıklama:** Sınır yalnızca firma başınadır. Kayıt sınırsız olduğu için (B1) biri çok sayıda firma açıp her biriyle 20 bağlantı tutarak sunucunun belleğini doldurabilir.
> **Öneri:** `abone()` içine sunucu geneli bir üst sınır (ör. 500) eklemek ve aşılırsa 429 dönmek.
>
> ### B6. Issue #24 (Düşük)
> **Dosya:** `src/lib/tenant.ts`, satır 142–153
> ```ts
> 144    if (OKUMA.has(operation)) {
> 145      a.where = { ...kosul, id: tenantId };
> ```
> **Açıklama:** Kod başka bir firma kimliği isterse hata almaz, sessizce kendi firmasının kaydını alır ya da günceller. Sızıntı yoktur; uygulamada firma kimliği hiçbir yerde formdan gelmiyor. Risk, ileride yazılacak kodun yanlış sonucu fark etmemesidir.
> **Öneri:** `where` içinde oturumdakinden farklı bir `id` varsa okumada boş sonuç, güncellemede hata vermek. `tenant.test.ts` içindeki ilgili test beklentisini buna göre güncellemek.
>
> ### B7. Veritabanı düzeyinde ikinci savunma hattı yok (Düşük)
> **Dosya:** `prisma/migrations/*/migration.sql` (üç dosyada da tetikleyici yok)
> **Açıklama:** Kayıtların başka firmaya taşınması yalnızca `tenant.ts` beyaz listesiyle engelleniyor. Abonelik ve olay tabloları bileşik anahtarla ayrıca korunuyor (`schema.prisma` satır 126–127, 147); müşteri, plan ve kullanıcı tablolarında böyle bir koruma yok. ADR'de bu tetikleyici Gün 12 için planlanmıştı.
> **Öneri:** Elle yazılmış bir geçiş dosyasıyla, beş tabloda `tenantId` güncellemesini reddeden bir PostgreSQL tetikleyicisi.
>
> ### B8. pg sslmode uyarısı (Düşük, bilinen sınır)
> **Dosya:** `src/lib/db.ts`, satır 31 (adres ortam değişkeninden geliyor)
> ```ts
> 31  const adapter = new PrismaPg({ connectionString });
> ```
> **Açıklama:** Bugün `sslmode=require` en sıkı modda çalışıyor. Sürücü, gelecek sürümde bu değerin sertifikayı doğrulamayan zayıf davranışa döneceğini bildiriyor. O durumda araya girme saldırısı mümkün olur.
> **Öneri:** Kod değişmez. `.env`, `.env.test` ve Render ortam değişkenlerindeki dört adreste `sslmode=require` yerine `sslmode=verify-full` yazılır, `channel_binding=require` korunur.
>
> ### B9. Git geçmişinde eski sızıntı (Düşük, kalan risk)
> **Konum:** Uzak dallar `feat/gun-02-veri-modeli` ve `fix/env-yer-tutucu` (senin tarama sonucun)
> **Açıklama:** Gün 2'deki parola ve sunucu adı bu dallardaki commit'lerde duruyor. Parola yenilendiği için adres artık bağlanmak için kullanılamaz. `main` temiz. Kalan tek bilgi eski sunucu adıdır.
> **Öneri:** İsteğe bağlı: iki eski dalı GitHub'da silmek. Not: Dal birleştirilmiş bir PR'a aitse commit'ler PR sayfasından görünmeye devam edebilir; geçmişi tamamen temizlemek ek araç ister, gerekli görmüyorum.
>
> ### B10. Güvenlik başlıkları yok (Düşük)
> **Dosya:** `next.config.ts`, satır 3–13 (yalnızca `turbopack` ayarı var)
> **Açıklama:** Site başka bir sitenin içine çerçeve olarak gömülebilir (tıklama tuzağı), ve yanıtlar Next.js kullanıldığını söyleyen `X-Powered-By` başlığını taşır.
> **Öneri:** `next.config.ts` içine `poweredByHeader: false` ve `headers()` ile `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy` eklemek.
>
> ### B11. Kayıtta e-posta varlığı söyleniyor (Düşük, bilinen sınır)
> **Dosya:** `src/lib/auth.ts`, satır 99–101
> ```ts
> 100    return { ok: false, hata: "Bu e-posta adresiyle zaten bir hesap var." };
> ```
> **Açıklama:** Biri bir e-postanın kayıtlı olup olmadığını öğrenebilir. Giriş tarafı bunu doğru biçimde gizliyor. E-posta doğrulaması olmadan bunu kapatmak kullanıcıyı şaşırtır.
> **Öneri:** Bilinen sınır olarak bırakmak; B1'deki kayıt sınırı bu taramayı da yavaşlatır.
>
> ### Bulgu çıkmayan maddeler
> - **1 Kiracı izolasyonu:** Uygulamadaki bütün sorgular `getTenantDb()` üzerinden. Ham `prisma` yalnızca `auth.ts` içinde, kiracı belli olmadan önce kullanılıyor. `tenantId` hiçbir yerde formdan, URL'den ya da istek gövdesinden okunmuyor. Başka firmanın kaydına id ile erişim, `findFirst`/`updateMany` sayesinde "bulunamadı" ile sonuçlanıyor. Ham SQL yok.
> - **2 Yetki:** Pasife alma (`pasife-alma.ts` satır 38, 95) ve CAC kaydetme (`cac-ayari.ts` satır 35) sunucuda, sorgudan önce `yoneticiMi` kontrol ediyor. Ayarlar ve Kullanıcılar sayfaları `requireManager()` kullanıyor. Kullanıcı yönetimi için sunucu işlemi yok, yani finance için açık bir yol da yok.
> - **4 Girdi doğrulama:** Beş sunucu işlem dosyasının hepsi `validation.ts` ile doğruluyor. URL'deki id'ler `kimlikDogrula`, `?durum=` ve `?pasif=` beyaz listeyle kontrol ediliyor. Müşteri adı arayüzde düz metin olarak basılıyor, `dangerouslySetInnerHTML` yok.
> - **5 Secret:** Kodda yalnızca `process.env` okunuyor, `.env.example` dosyaları yalnızca yer tutucu içeriyor, `.gitignore` satır 42–45 doğru.
> - **7 Hata mesajları:** `catch` blokları yalnızca sabit metin logluyor, hata nesnesini yazmıyor. `error.tsx` ve `global-error.tsx` yalnızca kısa kodu (digest) gösteriyor.
> - **9 Bağımlılıklar:** 6 bağımlılık ve 10 geliştirme bağımlılığının hepsi kodda kullanılıyor. `package-lock.json` içinde hepsi `registry.npmjs.org` adresinden geliyor. `npm audit` çalıştıramadım (aşağıya bak).
>
> ## Önce bunları düzelt
>
> 1. **B1:** Giriş ve kayıt için bellek içi deneme sınırı (tek orta bulgu; bitiş kontrolünün koşulu).
> 2. **B8:** Dört bağlantı adresinde `sslmode=verify-full` (kod değişmez, en hızlısı).
> 3. **B6:** Issue #24'ü `tenant.ts` içinde kapatmak.
> 4. **B10:** `next.config.ts` içine güvenlik başlıkları.
> 5. **B7:** `tenantId` değiştirilemez tetikleyicisi (ADR'de Gün 12'ye planlanmıştı).
>
> B2, B3, B4, B5, B9 ve B11 için önerim ADR'de bilinen sınır olarak kalmaları. B2'yi (oturum sürümü) yapmak istersen söyle, B3 de onunla birlikte kapanır.
>
> Onayından sonra seçtiğin maddeler için tek tek düzeltme adımlarını veririm.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **npm audit:** Bu ortamdan npm kayıt sunucusuna erişemedim. Bilinen açık taraması için proje klasöründe şunu çalıştırıp sonucu yapıştır (yalnızca canlıya giden paketlerin bilinen güvenlik açıklarını listeler):
>   ```zsh
>   npm audit --omit=dev
>   ```
> - **IP adresi (B1):** Render'ın istemci IP'sini `X-Forwarded-For` başlığına nasıl yazdığından emin değilim. Bu başlığı istemci de doldurabilir. Bu yüzden B1'de asıl sınırı e-posta başına kurmayı, IP sınırını ikincil tutmayı öneriyorum; Render dokümantasyonundan doğrulamak gerekir.
> - **`secure` çerez:** `NODE_ENV === "production"` koşuluna bağlı. `next start` bunu üretim olarak ayarlar diye varsaydım; canlıda tarayıcı geliştirici araçlarında çerezin `Secure` işaretini bir kez görmek iyi olur.
> - **Dalların PR durumu (B9):** İki eski dalın bir PR'a bağlı olup olmadığını göremedim.
> - **Finance testi:** Kullanıcılar sayfası yer tutucu olduğu için finance kullanıcısı arayüzden eklenemiyor. Rol kurallarını kod ve testler üzerinden değerlendirdim, tarayıcıda denenmiş değil.
> - Raporu Gün 12'nin `prompt_cevap` dosyasına yapıştırırken ad taraması kuralını hatırla; raporda depo adı ve kişisel bilgi geçmiyor.

### Prompt 3 · 24 Eki 2026 15:07

````text
Raporu inceledim. Onay: B1, B6, B10, B8 yapılsın. B7 sona kalsın, ben karar vereceğim. B2, B3, B4, B5, B9, B11 ADR'de bilinen sınır olarak kalsın.
Kod yazma, önce yalnızca Parça 1 (B1) için plan ver: hangi dosyalar değişecek, sayaç nasıl çalışacak, kaç hatalı denemede kaç dakika bloklanacak, bellek nasıl temizlenecek, hangi birim testleri eklenecek. Giriş cevabı e-posta kayıtlı olsun olmasın aynı olmalı. Yeni paket yok. IP sınırı için X-Forwarded-For güvenilir mi, Render dokümanından doğrula, emin değilsen e-posta başına sınırla başla. Plan sonunda varsayımlarını listele.
Sıra: Parça 1 = B1, Parça 2 = B6 + B10, sonra B8, en son ADR güncellemesi.npm audit --omit=dev sonucu: fast-uri 3.0.0-3.1.8 (orta, dolaylı bağımlılık, npm audit fix ile düzelir). Bunu da bulgu listesine B12 olarak ekle. Düzeltme package-lock.json dışında hiçbir dosyayı değiştirmesin, npm audit fix --force kullanılmasın, düzeltmeden sonra npm test, npm run test:db ve npm run build tekrar çalıştırılsın.npm ls sonucu: fast-uri yolu prisma > @prisma/dev > @prisma/streams-local > ajv > fast-uri (Prisma geliştirme aracı, web uygulaması koduyla ilgisi yok). Düzeltmeyi Parça 2 (B6 + B10) PR'ına ayrı bir commit olarak ekle, package.json değişirse dur ve bana sor.
````

### Claude cevabı 3 · 24 Eki 2026 15:08

> Render dokümanında X-Forwarded-For davranışını kontrol ediyorum.
> ## Önce: X-Forwarded-For güvenilir mi?
>
> **Hayır, buna güvenerek başlamıyorum.** Render'ın resmi dokümanında bu başlığın nasıl yazıldığına dair bir sayfa bulamadım. Bulabildiğim tek resmi ifade, 2021 tarihli bir özellik isteğinde bir Render çalışanının "listedeki ilk IP gerçek istemci IP'sidir" demesi. Aynı sayfada bir kullanıcı, Render'ın istemcinin gönderdiği başlığı silmediğini, üstüne eklediğini bildiriyor ve bu soru resmi olarak yanıtlanmamış. Yani istemci kendi yazdığı sahte bir IP'yi başa koyabilir mi, belgeli değil. İnternette `CF-Connecting-IP` ve `True-Client-IP` başlıklarına dayanan örnekler var ama bunlar da Render dokümanında yazmıyor.
>
> Bu yüzden Parça 1 **yalnızca e-posta başına sınırla** başlar.
>
> ## Parça 1 (B1) planı
>
> ### Değişecek dosyalar
>
> | Dosya | İşlem | Ne değişir |
> |---|---|---|
> | `src/lib/giris-siniri.ts` | Yeni dosya | Sayaç. Next.js'e ve veritabanına bağlı değil (sse-hub.ts gibi), bu yüzden veritabanısız test edilir |
> | `src/lib/giris-siniri.test.ts` | Yeni dosya | Sayacın birim testleri (`npm test`) |
> | `src/lib/auth.ts` | Değişir | Yalnızca `girisYap` fonksiyonu sayacı kullanır. Kayıt ve diğer fonksiyonlar değişmez |
> | `src/lib/giris.test.ts` | Yeni dosya | "Kayıtlı ve kayıtsız e-postaya aynı cevap" testi (`npm run test:db`, Neon test dalı) |
> | `package.json` | Değişir | **Yalnızca** `test` ve `test:db` satırlarına iki yeni test dosyasının adı eklenir. Bağımlılık değişmez. Test listesi bu dosyada elle yazıldığı için bu değişiklik kaçınılmaz; onay istiyorum |
>
> ### Sayaç nasıl çalışır
>
> - Bellekte bir liste tutulur: `e-posta → { deneme sayısı, ilk deneme zamanı, blok bitiş zamanı }`. Tek örnek `globalThis` üzerinde saklanır (sse-hub.ts ile aynı yöntem).
> - Anahtar, `epostaDogrula` ile küçük harfe çevrilmiş e-postadır. Böylece `Ali@x.com` ile `ali@x.com` aynı sayaca düşer.
> - **Deneme, parola kontrolünden ÖNCE sayılır.** Kontrol ve sayma aynı senkron adımda yapılır. Neden: bcrypt beklenirken aynı anda 50 istek gönderilirse, sayma sonra yapılsaydı hepsi "engelli değil" görüp geçerdi. Node tek iş parçacığında çalıştığı için önceden saymak bu yarışı kapatır.
> - Başarılı girişte o e-postanın sayacı silinir.
> - Blok sürerken doğru parola da reddedilir; aksi hâlde deneme devam edebilirdi. Blok sırasında bcrypt ve veritabanı sorgusu hiç çalışmaz, işlemci de korunur.
> - Biçimi bozuk e-posta sayılmaz (zaten bcrypt'e ulaşmıyor, bugünkü tek tip hata aynen kalır).
>
> ### Sayılar
>
> - **15 dakika içinde 5 deneme**, 6. denemede **15 dakika blok.**
> - Pencere ilk denemeden başlar. İlk denemenin üzerinden 15 dakika geçtiyse sayaç sıfırdan başlar.
> - Blok mesajı: "Çok fazla hatalı deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyin." Bu mesaj kayıtlı ve kayıtsız e-postada aynı sayıda denemeden sonra çıkar, çünkü sayaç e-postanın kayıtlı olup olmadığına bakmaz. Böylece cevap e-postanın varlığını ele vermez. Bloktan önceki hata mesajı bugünkü gibi "E-posta veya parola hatalı." kalır.
>
> ### Bellek temizliği
>
> - Arka planda zamanlayıcı yok. Her çağrıda yalnızca o e-postanın kaydının süresi dolmuşsa silinir.
> - Listeye üst sınır: **10.000 kayıt.** Sınıra ulaşılınca önce süresi dolmuş bütün kayıtlar silinir. Hâlâ doluysa en eski kayıt silinir.
> - Sunucu yeniden başlarsa sayaç sıfırlanır (ADR'de bilinen sınır olarak yazılacak).
>
> ### Birim testleri (`giris-siniri.test.ts`, zaman parametreyle verilir, bekleme yok)
>
> 1. İlk 5 denemeye izin verilir, 6. reddedilir.
> 2. 15 dakikalık blok dolunca yeniden izin verilir.
> 3. İlk denemenin üzerinden 15 dakika geçince sayaç sıfırlanır.
> 4. Başarılı giriş sayacı sıfırlar.
> 5. Blok sırasında başarı kaydı bloğu kaldırmaz (doğru parola da reddedilir).
> 6. Farklı e-postalar birbirini etkilemez.
> 7. Büyük ve küçük harfli yazım aynı sayaca düşer.
> 8. Süresi dolmuş kayıtlar temizlenir, kayıt sayısı düşer.
> 9. Üst sınır dolunca kayıt sayısı sınırı aşmaz.
>
> **Veritabanı testi (`giris.test.ts`):** Test firmasındaki kayıtlı bir e-postaya ve kayıtsız bir e-postaya 6'şar yanlış parola gönderilir. Her adımda iki cevabın aynı olduğu, 6. adımda blok mesajı geldiği doğrulanır. Test, firmayı ve kullanıcıyı mevcut `veri.ts` yardımcısıyla oluşturup siler.
>
> ### Bilinçli olarak yapılmayanlar
>
> - IP başına sınır (gerekçe yukarıda).
> - Kayıt sınırı: e-posta başına sınır kayıtta anlamsız, IP de güvenilir değil.
>
> ### Senin kararın gereken bir nokta
>
> Kayıt formu ve "her denemede farklı e-posta" saldırısı bu planla korunmuyor; biri sürekli yeni e-postalarla bcrypt'i çalıştırabilir. Seçenekler:
>
> - **A (önerim):** Parça 1'i yukarıdaki gibi bırakmak, bu açığı ADR'de bilinen sınır olarak yazmak.
> - **B:** Sunucu geneli bir kayıt sınırı eklemek (ör. 10 dakikada toplam 20 kayıt). Dezavantajı: biri bu sınırı doldurursa gerçek kullanıcılar da o süre kayıt olamaz.
>
> ## Bulgu listesine ekleme
>
> | No | Madde | Bulgu | Risk |
> |---|---|---|---|
> | B12 | 9 | `fast-uri` 3.0.0–3.1.8 bilinen açık. Yol: `prisma > @prisma/dev > @prisma/streams-local > ajv > fast-uri`. Yalnızca Prisma geliştirme aracında, canlı uygulama kodunda değil | Düşük (npm audit "orta" diyor; çalışan uygulamaya ulaşmadığı için düşük derecelendiriyorum) |
>
> **Düzeltme planı (Parça 2 PR'ında ayrı commit):** `npm audit fix` (`--force` yok). Ardından `git status` ile yalnızca `package-lock.json` değiştiği kontrol edilir; `package.json` değişirse durup sana sorarım. Sonra `npm test`, `npm run test:db`, `npm run build` çalıştırılır.
>
> Not: `npm audit` sonucu `--omit=dev` ile alınmış ama `prisma` bir geliştirme bağımlılığı. Yine de çıktıda görünmesi, `prisma`'nın canlıya da gidecek bir yoldan da kurulduğunu düşündürebilir. Düzeltme adımında `npm ls fast-uri --omit=dev` ile bunu bir kez daha kontrol edeceğiz.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - Render'ın `X-Forwarded-For` davranışı resmi olarak belgeli değil; yalnızca 2021 tarihli bir çalışan cevabına ve kullanıcı gözlemine dayanıyor.
> - E-posta başına sınırın bir yan etkisi var: başkası bir kullanıcının e-postasıyla 6 yanlış deneme yaparsa o kullanıcı 15 dakika giriş yapamaz. Blok kısa tutulduğu için bunu kabul edilebilir buldum.
> - Render'da tek sunucu çalıştığını varsaydım (B4 ile aynı varsayım). Birden fazla sunucu olursa her biri ayrı sayar.
> - `giris.test.ts` içinde `girisYap`'ı Next.js isteği dışında çağırmanın, başarısız giriş yolunda sorun çıkarmayacağını varsaydım; bu yol çereze dokunmuyor. Başarılı giriş testi bu yüzden birim testte (sayaç düzeyinde) yapılır.
> - Sayıları (5 deneme, 15 dakika) yaygın bir varsayılan olarak seçtim; değiştirmek istersen söyle.
>
> Onaylarsan (ve package.json test satırı değişikliğine izin verirsen) Parça 1'in adımlarını tek tek veririm.
>
> Sources:
> - [Send the correct X_FORWARDED_FOR (Render feedback)](https://feedback.render.com/features/p/send-the-correct-xforwardedfor)
> - [Demo of X-Forwarded-For / CF-Connecting-IP / True-Client-IP behind Render](https://github.com/johnbeynon/header-test)

### Prompt 4 · 24 Eki 2026 15:09

````text
Parça 1 planını onaylıyorum. Kayıt sınırı: A seçeneği (ADR'de bilinen sınır). IP sınırı yok. 5 deneme / 15 dakika / 15 dakika blok kabul. package.json'da yalnızca test ve test:db satırlarına iki yeni test dosyası adının eklenmesine izin veriyorum, başka satıra dokunma.
Şimdi Parça 1 adımlarını ver: önce dal aç (gun12-giris-siniri), yeni dosyaları touch ile boş aç, içeriği tam dosya olarak ver, auth.ts için "dosyanın içeriğini tamamen şununla değiştir" de. giris.test.ts mevcut test dosyalarının desenine uysun, yalnızca Neon test dalında çalışsın (canlı koruması). Bitince sırayla: npm test, npm run test:db, lint, build, üç commit öncesi tarama, commit (tek satırlık komut, ekler proje kuralındaki gibi). Her komutu tek tek ve bir cümlelik açıklamayla ver. Son olarak dev:test ile 6 yanlış denemeyi elle deneyeceğim, adımlarını yaz.
````

### Claude cevabı 4 · 24 Eki 2026 15:15

> Mevcut test dosyalarının desenine uymak için önce onları okuyorum.
> Kodu yazmadan önce mantığı burada kendi kopyamda deniyorum: sayaç dosyası ve birim testleri hiçbir pakete bağlı olmadığı için doğrudan çalıştırabilirim.
> 12 test geçti. Şimdi `auth.ts` değişikliklerini yapıp farkı kontrol ediyorum.
> Parça 1 hazır. Sayaç dosyasını ve 12 birim testini kendi ortamımda çalıştırdım, hepsi geçti. `auth.ts` değişikliğini mevcut dosyayla satır satır karşılaştırdım, `package.json` düzenleme komutlarını da bir kopyada denedim: yalnızca iki test satırı değişiyor.
>
> Komutların hepsini Terminal'de proje klasöründeyken çalıştır.
>
> ## 1. Dal aç
>
> `main` dalına geçer:
> ```zsh
> git switch main
> ```
>
> GitHub'daki son hâli indirir:
> ```zsh
> git pull
> ```
>
> Yeni dalı açar ve ona geçer:
> ```zsh
> git switch -c gun12-giris-siniri
> ```
>
> ## 2. Yeni dosyaları boş aç
>
> Üç yeni dosyayı boş olarak oluşturur:
> ```zsh
> touch src/lib/giris-siniri.ts src/lib/giris-siniri.test.ts src/lib/giris.test.ts
> ```
>
> ## 3. Dosya içerikleri
>
> ### `src/lib/giris-siniri.ts` (yeni dosya, aşağıdakini yapıştır)
>
> ```ts
> // GİRİŞ DENEME SINIRI (Gün 12, bulgu B1)
> //
> // Aynı e-postaya kısa sürede çok sayıda parola denenmesini engeller.
> // Kural: 15 dakika içinde en fazla 5 deneme. 6. deneme ve sonrası 15 dakika reddedilir.
> //
> // NASIL ÇALIŞIR?
> // - Bellekte "e-posta -> deneme bilgisi" listesi tutulur. Anahtar, küçük harfe
> //   çevrilmiş e-postadır: "Ali@x.com" ile "ali@x.com" aynı sayaca düşer.
> // - Deneme, parola kontrolünden ÖNCE sayılır (denemeyiKaydet). Kontrol ve sayma
> //   aynı senkron adımdadır, arada await yoktur. Node tek iş parçacığında çalıştığı
> //   için aynı anda gelen 50 istek bu adımın arasına giremez; hepsi sırayla sayılır.
> // - Başarılı girişte o e-postanın sayacı silinir (basarili).
> // - Blok sürerken doğru parola da reddedilir. Blok sırasında parola kontrolü ve
> //   veritabanı sorgusu hiç yapılmaz (işlemci de korunur).
> // - Sayaç e-postanın kayıtlı olup olmadığına BAKMAZ. Bu yüzden kayıtlı ve kayıtsız
> //   e-postalar aynı sayıda denemeden sonra aynı mesajla bloklanır; cevap e-postanın
> //   varlığını ele vermez.
> //
> // BELLEK TEMİZLİĞİ: Arka planda zamanlayıcı yoktur.
> // - Bir e-posta yeniden denendiğinde süresi dolmuş kaydı önce silinir.
> // - Liste üst sınıra (10.000 kayıt) ulaşınca süresi dolmuş bütün kayıtlar silinir.
> //   Hâlâ doluysa en eski kayıt silinir. Böylece bellek sınırsız büyümez.
> //
> // BİLİNEN SINIRLAR (ADR, Gün 12):
> // - Liste tek Render sürecinin belleğindedir. Sunucu yeniden başlarsa sayaç sıfırlanır,
> //   ikinci bir sunucu açılırsa her biri ayrı sayar.
> // - IP başına sınır yoktur: Render'ın X-Forwarded-For davranışı belgeli değildir.
> // - Başkası bir kullanıcının e-postasıyla 6 yanlış deneme yaparsa o kullanıcı 15 dakika
> //   giriş yapamaz.
> //
> // Bu dosya Next.js'e ve veritabanına bağlı değildir. Bu yüzden "npm test" ile
> // veritabanı olmadan test edilir (giris-siniri.test.ts).
>
> // Pencere içinde izin verilen en fazla deneme sayısı.
> export const EN_COK_DENEME = 5;
> // Denemelerin sayıldığı süre: ilk denemeden itibaren 15 dakika.
> export const PENCERE_MS = 15 * 60 * 1000;
> // Sınır aşılınca bloğun süresi.
> export const BLOK_MS = 15 * 60 * 1000;
> // Bellekte tutulacak en fazla kayıt (e-posta) sayısı.
> export const EN_COK_KAYIT = 10_000;
>
> // Blok sırasında kullanıcıya gösterilen mesaj. Kayıtlı ve kayıtsız e-postada aynıdır.
> export const BLOK_MESAJI =
>   "Çok fazla hatalı deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyin.";
>
> // Bir e-postanın deneme bilgisi.
> type Kayit = {
>   deneme: number; // pencere içindeki deneme sayısı
>   ilkDeneme: number; // pencerenin başladığı an (milisaniye)
>   blokBitis: number | null; // blok varsa bitiş anı, yoksa null
> };
>
> // Testlerin küçük değerlerle çalışabilmesi için ayarlar değiştirilebilir.
> export type SinirAyarlari = {
>   enCokDeneme: number;
>   pencereMs: number;
>   blokMs: number;
>   enCokKayit: number;
> };
>
> export type DenemeSonucu = { izin: boolean };
>
> // Yeni bir sınırlayıcı üretir. Uygulama aşağıdaki tek örneği (girisSiniri) kullanır;
> // testler her seferinde temiz bir sınırlayıcı üretir.
> export function sinirlayiciOlustur(ayar: Partial<SinirAyarlari> = {}) {
>   const enCokDeneme = ayar.enCokDeneme ?? EN_COK_DENEME;
>   const pencereMs = ayar.pencereMs ?? PENCERE_MS;
>   const blokMs = ayar.blokMs ?? BLOK_MS;
>   const enCokKayit = ayar.enCokKayit ?? EN_COK_KAYIT;
>
>   const kayitlar = new Map<string, Kayit>();
>
>   // E-postayı anahtara çevirir: baş ve sondaki boşluk silinir, küçük harfe çevrilir.
>   function anahtar(eposta: string): string {
>     return eposta.trim().toLowerCase();
>   }
>
>   // Kaydın süresi doldu mu? Blokluysa blok bitince, değilse pencere bitince dolar.
>   function suresiDolduMu(kayit: Kayit, simdi: number): boolean {
>     if (kayit.blokBitis !== null) return kayit.blokBitis <= simdi;
>     return kayit.ilkDeneme + pencereMs <= simdi;
>   }
>
>   // Süresi dolmuş bütün kayıtları siler.
>   function temizle(simdi: number = Date.now()): void {
>     for (const [a, kayit] of kayitlar) {
>       if (suresiDolduMu(kayit, simdi)) kayitlar.delete(a);
>     }
>   }
>
>   // Yeni kayıt eklemeden önce çağrılır. Liste doluysa yer açar.
>   function yerAc(simdi: number): void {
>     if (kayitlar.size < enCokKayit) return;
>     temizle(simdi);
>     // Hâlâ doluysa en eski kayıtlar silinir (Map, ekleme sırasını korur).
>     while (kayitlar.size >= enCokKayit) {
>       const enEski = kayitlar.keys().next().value;
>       if (enEski === undefined) break;
>       kayitlar.delete(enEski);
>     }
>   }
>
>   // Bir giriş denemesini kaydeder ve denemeye izin verilip verilmediğini söyler.
>   // Parola kontrolünden ÖNCE çağrılır. İçinde await yoktur (bkz. dosya başı).
>   function denemeyiKaydet(eposta: string, simdi: number = Date.now()): DenemeSonucu {
>     const a = anahtar(eposta);
>     let kayit = kayitlar.get(a);
>
>     // Süresi dolmuş kayıt yok sayılır ve silinir.
>     if (kayit && suresiDolduMu(kayit, simdi)) {
>       kayitlar.delete(a);
>       kayit = undefined;
>     }
>
>     // İlk deneme: yeni pencere başlar.
>     if (!kayit) {
>       yerAc(simdi);
>       kayitlar.set(a, { deneme: 1, ilkDeneme: simdi, blokBitis: null });
>       return { izin: true };
>     }
>
>     // Blok sürüyor: reddedilir. Bloğun süresi uzatılmaz.
>     if (kayit.blokBitis !== null) {
>       return { izin: false };
>     }
>
>     // Sınır doldu: bu deneme reddedilir ve blok başlar.
>     if (kayit.deneme >= enCokDeneme) {
>       kayit.blokBitis = simdi + blokMs;
>       return { izin: false };
>     }
>
>     kayit.deneme += 1;
>     return { izin: true };
>   }
>
>   // Başarılı girişten sonra çağrılır: sayaç silinir.
>   // Blok sürüyorsa silinmez (blok sırasında zaten parola kontrolüne gelinmez).
>   function basarili(eposta: string): void {
>     const a = anahtar(eposta);
>     const kayit = kayitlar.get(a);
>     if (kayit && kayit.blokBitis === null) kayitlar.delete(a);
>   }
>
>   // Bellekteki kayıt sayısı (testler ve kontrol için).
>   function kayitSayisi(): number {
>     return kayitlar.size;
>   }
>
>   return { denemeyiKaydet, basarili, temizle, kayitSayisi };
> }
>
> export type GirisSinirlayici = ReturnType<typeof sinirlayiciOlustur>;
>
> // Uygulamanın kullandığı TEK sınırlayıcı. globalThis üzerinde saklanır: geliştirme
> // modunda Next.js dosyaları yeniden yüklediğinde sayaçlar kaybolmaz (sse-hub.ts ile aynı).
> const depo = globalThis as typeof globalThis & {
>   abonetakipGirisSiniri?: GirisSinirlayici;
> };
> export const girisSiniri: GirisSinirlayici =
>   depo.abonetakipGirisSiniri ?? sinirlayiciOlustur();
> depo.abonetakipGirisSiniri = girisSiniri;
> ```
>
> ### `src/lib/giris-siniri.test.ts` (yeni dosya, aşağıdakini yapıştır)
>
> ```ts
> // GİRİŞ DENEME SINIRI TESTLERİ (Gün 12, bulgu B1)
> //
> // Veritabanı kullanılmaz. Zaman, her çağrıya "simdi" parametresiyle verilir;
> // testler gerçekten beklemez. Her test kendi temiz sınırlayıcısını üretir.
> // Çalıştırmak için: npm test
>
> import { describe, test } from "node:test";
> import assert from "node:assert/strict";
> import {
>   BLOK_MS,
>   EN_COK_DENEME,
>   PENCERE_MS,
>   sinirlayiciOlustur,
>   type GirisSinirlayici,
> } from "./giris-siniri.ts";
>
> const EPOSTA = "ornek@example.com";
> const DAKIKA = 60 * 1000;
> // Testlerde kullanılan başlangıç anı (herhangi bir sabit sayı olabilir).
> const T0 = 1_000_000_000;
>
> // Verilen sayıda denemeyi aynı anda yapar ve izin sonuçlarını döner.
> function denemeYap(
>   sinir: GirisSinirlayici,
>   sayi: number,
>   simdi: number,
>   eposta: string = EPOSTA
> ): boolean[] {
>   const sonuclar: boolean[] = [];
>   for (let i = 0; i < sayi; i++) {
>     sonuclar.push(sinir.denemeyiKaydet(eposta, simdi).izin);
>   }
>   return sonuclar;
> }
>
> describe("Varsayılan kural", () => {
>   test("15 dakika içinde 5 deneme, 15 dakika blok", () => {
>     assert.equal(EN_COK_DENEME, 5);
>     assert.equal(PENCERE_MS, 15 * DAKIKA);
>     assert.equal(BLOK_MS, 15 * DAKIKA);
>   });
> });
>
> describe("Deneme sayma ve blok", () => {
>   test("ilk 5 denemeye izin verilir, 6. reddedilir", () => {
>     const sinir = sinirlayiciOlustur();
>     assert.deepEqual(denemeYap(sinir, 5, T0), [true, true, true, true, true]);
>     assert.equal(sinir.denemeyiKaydet(EPOSTA, T0).izin, false);
>   });
>
>   test("blok 15 dakika sürer, dolunca yeniden izin verilir", () => {
>     const sinir = sinirlayiciOlustur();
>     denemeYap(sinir, 6, T0); // 6. denemede blok başlar
>     assert.equal(sinir.denemeyiKaydet(EPOSTA, T0 + 15 * DAKIKA - 1).izin, false);
>     assert.equal(sinir.denemeyiKaydet(EPOSTA, T0 + 15 * DAKIKA).izin, true);
>   });
>
>   test("blok sırasındaki ek denemeler bloğu uzatmaz", () => {
>     const sinir = sinirlayiciOlustur();
>     denemeYap(sinir, 6, T0);
>     // Blok süresince her dakika bir deneme daha yapılır.
>     for (let dk = 1; dk < 15; dk++) {
>       assert.equal(sinir.denemeyiKaydet(EPOSTA, T0 + dk * DAKIKA).izin, false);
>     }
>     assert.equal(sinir.denemeyiKaydet(EPOSTA, T0 + 15 * DAKIKA).izin, true);
>   });
>
>   test("ilk denemenin üzerinden 15 dakika geçince sayaç sıfırlanır", () => {
>     const sinir = sinirlayiciOlustur();
>     denemeYap(sinir, 5, T0); // sınırda, henüz blok yok
>     // Pencere doldu: yeni pencere başlar, 5 deneme daha yapılabilir.
>     assert.deepEqual(denemeYap(sinir, 5, T0 + 15 * DAKIKA), [true, true, true, true, true]);
>     assert.equal(sinir.denemeyiKaydet(EPOSTA, T0 + 15 * DAKIKA).izin, false);
>   });
> });
>
> describe("Başarılı giriş", () => {
>   test("başarılı giriş sayacı sıfırlar", () => {
>     const sinir = sinirlayiciOlustur();
>     denemeYap(sinir, 4, T0);
>     sinir.basarili(EPOSTA);
>     assert.equal(sinir.kayitSayisi(), 0);
>     assert.deepEqual(denemeYap(sinir, 5, T0), [true, true, true, true, true]);
>   });
>
>   test("blok sürerken başarı kaydı bloğu kaldırmaz", () => {
>     const sinir = sinirlayiciOlustur();
>     denemeYap(sinir, 6, T0);
>     sinir.basarili(EPOSTA);
>     assert.equal(sinir.denemeyiKaydet(EPOSTA, T0 + DAKIKA).izin, false);
>   });
> });
>
> describe("E-posta anahtarı", () => {
>   test("farklı e-postalar birbirini etkilemez", () => {
>     const sinir = sinirlayiciOlustur();
>     denemeYap(sinir, 6, T0, "a@example.com");
>     assert.equal(sinir.denemeyiKaydet("a@example.com", T0).izin, false);
>     assert.equal(sinir.denemeyiKaydet("b@example.com", T0).izin, true);
>   });
>
>   test("büyük/küçük harf ve baştaki/sondaki boşluk aynı sayaca düşer", () => {
>     const sinir = sinirlayiciOlustur();
>     denemeYap(sinir, 3, T0, "Ornek@Example.com");
>     denemeYap(sinir, 2, T0, "  ORNEK@example.COM ");
>     assert.equal(sinir.denemeyiKaydet("ornek@example.com", T0).izin, false);
>     assert.equal(sinir.kayitSayisi(), 1);
>   });
> });
>
> describe("Bellek temizliği", () => {
>   test("süresi dolmuş kayıtlar temizlenir, kayıt sayısı düşer", () => {
>     const sinir = sinirlayiciOlustur();
>     denemeYap(sinir, 1, T0, "eski@example.com"); // pencere T0 + 15 dk'da biter
>     denemeYap(sinir, 6, T0, "bloklu@example.com"); // blok T0 + 15 dk'da biter
>     denemeYap(sinir, 1, T0 + 10 * DAKIKA, "yeni@example.com"); // T0 + 25 dk'da biter
>     assert.equal(sinir.kayitSayisi(), 3);
>
>     sinir.temizle(T0 + 20 * DAKIKA);
>     assert.equal(sinir.kayitSayisi(), 1, "Yalnızca süresi dolmamış kayıt kalmalı.");
>   });
>
>   test("üst sınır dolunca kayıt sayısı sınırı aşmaz", () => {
>     const sinir = sinirlayiciOlustur({ enCokKayit: 3 });
>     for (let i = 0; i < 10; i++) {
>       denemeYap(sinir, 1, T0, `kisi${i}@example.com`);
>       assert.ok(sinir.kayitSayisi() <= 3, "Kayıt sayısı üst sınırı aştı.");
>     }
>     // En yeni kayıt listede kalır: sayacı devam eder.
>     denemeYap(sinir, 4, T0, "kisi9@example.com");
>     assert.equal(sinir.denemeyiKaydet("kisi9@example.com", T0).izin, false);
>   });
>
>   test("liste dolunca önce süresi dolmuş kayıtlar silinir", () => {
>     const sinir = sinirlayiciOlustur({ enCokKayit: 2 });
>     denemeYap(sinir, 1, T0, "eski@example.com"); // süresi dolacak
>     denemeYap(sinir, 6, T0 + 10 * DAKIKA, "bloklu@example.com"); // blok sürüyor
>     // Yeni kayıt için yer açılırken eski (süresi dolmuş) kayıt silinmeli, bloklu kalmalı.
>     denemeYap(sinir, 1, T0 + 20 * DAKIKA, "yeni@example.com");
>     assert.equal(sinir.kayitSayisi(), 2);
>     assert.equal(sinir.denemeyiKaydet("bloklu@example.com", T0 + 20 * DAKIKA).izin, false);
>   });
> });
> ```
>
> ### `src/lib/giris.test.ts` (yeni dosya, aşağıdakini yapıştır)
>
> `duman.test.ts` gibi korumayı en başta yapar; ek olarak `canli-koruma.ts` ile canlı veritabanı karşılaştırması da yapılır.
>
> ```ts
> // GİRİŞ DENEME SINIRI VERİTABANI TESTİ (Gün 12, bulgu B1)
> //
> // Ne test edilir? src/lib/auth.ts içindeki girisYap fonksiyonunun, kayıtlı ve
> // kayıtsız e-postaya HER denemede aynı cevabı verdiği ve 6. denemede bloğa geçtiği.
> // Sayacın kendi kuralları giris-siniri.test.ts içinde veritabanısız test edilir.
> //
> // Kayıtlı e-posta: test-destek/veri.ts'in oluşturduğu sahte firmanın yöneticisi.
> // Bu kullanıcının parola özeti gerçek değildir; yalnızca yanlış parola denenir.
> // Kayıtsız e-posta: bu çalışmaya özel, hiçbir yerde kayıtlı olmayan bir adres.
> // Başarılı giriş burada denenmez: oturum çerezi yalnızca bir Next.js isteği içinde
> // yazılabilir. Başarılı girişin sayacı sıfırlaması giris-siniri.test.ts'te test edilir.
> //
> // Veri: bir sahte firma oluşturulur, testler bitince silinir.
> // Çalıştırmak için: npm run test:db
>
> import { test, before, after } from "node:test";
> import assert from "node:assert/strict";
> import { testDaliKontrolu } from "../test-destek/canli-koruma.ts";
>
> // KORUMA 1: TEST_VERITABANI=evet yoksa ya da DATABASE_URL canlı (.env) ile aynı
> // Neon sunucusunu gösteriyorsa veritabanına hiç bağlanmadan dur.
> const kontrol = testDaliKontrolu();
> if (!kontrol.ok) {
>   throw new Error(kontrol.hata);
> }
>
> // Koruma geçildikten SONRA içe aktarılır: db.ts yüklenince veritabanı nesnesi oluşur.
> // (KORUMA 2: veri.ts de yüklenirken TEST_VERITABANI kontrolünü ayrıca yapar.)
> const { CALISMA, testFirmasiOlustur, testVerisiniTemizle, baglantiyiKapat } = await import(
>   "../test-destek/veri.ts"
> );
> const { girisYap, GIRIS_HATASI } = await import("./auth.ts");
> const { BLOK_MESAJI, EN_COK_DENEME } = await import("./giris-siniri.ts");
>
> const YANLIS_PAROLA = "yanlis-parola-123";
>
> // veri.ts yöneticinin e-postasını "<çalışma etiketi>-<firma etiketi>-manager@example.com"
> // biçiminde oluşturur.
> const KAYITLI_EPOSTA = `${CALISMA}-giris-manager@example.com`;
> const KAYITSIZ_EPOSTA = `${CALISMA}-kayitsiz@example.com`;
>
> before(async () => {
>   await testFirmasiOlustur("giris");
> });
>
> after(async () => {
>   try {
>     await testVerisiniTemizle();
>   } finally {
>     await baglantiyiKapat();
>   }
> });
>
> test("kayıtlı ve kayıtsız e-postaya her denemede aynı cevap verilir, 6. denemede blok", async () => {
>   for (let deneme = 1; deneme <= EN_COK_DENEME + 1; deneme++) {
>     const kayitli = await girisYap(KAYITLI_EPOSTA, YANLIS_PAROLA);
>     const kayitsiz = await girisYap(KAYITSIZ_EPOSTA, YANLIS_PAROLA);
>
>     assert.deepEqual(kayitli, kayitsiz, `${deneme}. denemede iki cevap farklı.`);
>
>     const beklenen = deneme <= EN_COK_DENEME ? GIRIS_HATASI : BLOK_MESAJI;
>     assert.deepEqual(kayitli, { ok: false, hata: beklenen }, `${deneme}. denemede beklenmeyen cevap.`);
>   }
> });
>
> test("büyük harfle yazılan e-posta da aynı blokta kalır", async () => {
>   const sonuc = await girisYap(KAYITLI_EPOSTA.toUpperCase(), YANLIS_PAROLA);
>   assert.deepEqual(sonuc, { ok: false, hata: BLOK_MESAJI });
> });
>
> test("başka bir e-postanın denemesi bu bloktan etkilenmez", async () => {
>   const sonuc = await girisYap(`${CALISMA}-baska@example.com`, YANLIS_PAROLA);
>   assert.deepEqual(sonuc, { ok: false, hata: GIRIS_HATASI });
> });
> ```
>
> ### `src/lib/auth.ts`: dosyanın içeriğini tamamen şununla değiştir
>
> Değişen yalnızca dört yer: `giris-siniri` içe aktarması, `GIRIS_HATASI`'nın dışarı açılması, `girisYap` içinde sınır kontrolü ve başarılı girişte sayacın silinmesi. Kayıt, oturum ve çıkış fonksiyonları aynı.
>
> ```ts
> // Kimlik doğrulama: kayıt, giriş, çıkış ve aktif kullanıcıyı bulma.
> //
> // Bu dosya ham "prisma" nesnesini kullanabilir, çünkü iki işlem kiracı
> // (tenant) belli olmadan gerçekleşir:
> //   - Kayıt: henüz kiracı yoktur, onu oluşturuyoruz.
> //   - Giriş: kullanıcıyı e-postayla buluruz, kiracıyı ancak sonra öğreniriz.
> // Diğer bütün veri sorguları src/lib/tenant.ts içindeki getTenantDb() ile yapılır.
>
> import { cache } from "react";
> import { redirect } from "next/navigation";
> import bcrypt from "bcryptjs";
> import type { Role } from "../../generated/prisma/enums";
> import { prisma } from "./db";
> import {
>   oturumCerezindenSil,
>   oturumCerezineYaz,
>   oturumKullaniciIdOku,
> } from "./session";
> import { epostaDogrula, type KayitGirdisi } from "./validation";
> import { yoneticiMi } from "./yetki";
> import { tekrarEdenKayitMi } from "./islem";
> import { BLOK_MESAJI, girisSiniri } from "./giris-siniri";
>
> // bcrypt maliyeti: sayı büyüdükçe özetleme yavaşlar ve kırılması zorlaşır.
> const BCRYPT_TUR = 12;
>
> // Giriş hatasında hangi alanın yanlış olduğu bilerek söylenmez.
> // Dışarı açıktır: giris.test.ts aynı metni karşılaştırır (Gün 12).
> export const GIRIS_HATASI = "E-posta veya parola hatalı.";
>
> // İşlem sonucu: başarılı ya da kullanıcıya gösterilecek hata.
> export type IslemSonucu = { ok: true } | { ok: false; hata: string };
>
> // Giriş yapmış kullanıcının uygulama içinde kullanılan bilgileri.
> export type AktifKullanici = {
>   id: string;
>   tenantId: string;
>   role: Role;
>   adSoyad: string | null;
>   eposta: string;
>   firmaAdi: string;
> };
>
> // Oturumdaki kullanıcıyı bulur. tenantId ve rol, ÇEREZDEN DEĞİL veritabanından
> // okunur. Böylece çerez değiştirilse bile başka firmaya geçilemez.
> // cache(): aynı istek içinde veritabanına yalnızca bir kez gidilir.
> export const getCurrentUser = cache(
>   async (): Promise<AktifKullanici | null> => {
>     const kullaniciId = await oturumKullaniciIdOku();
>     if (!kullaniciId) return null;
>
>     const kullanici = await prisma.user.findUnique({
>       where: { id: kullaniciId },
>       select: {
>         id: true,
>         tenantId: true,
>         role: true,
>         name: true,
>         email: true,
>         tenant: { select: { name: true } },
>       },
>     });
>
>     // Çerez geçerli ama kullanıcı silinmişse oturum yok sayılır.
>     if (!kullanici) return null;
>
>     return {
>       id: kullanici.id,
>       tenantId: kullanici.tenantId,
>       role: kullanici.role,
>       adSoyad: kullanici.name,
>       eposta: kullanici.email,
>       firmaAdi: kullanici.tenant.name,
>     };
>   }
> );
>
> // Giriş yapmamış kullanıcıyı giriş sayfasına gönderir.
> export async function requireUser(): Promise<AktifKullanici> {
>   const kullanici = await getCurrentUser();
>   if (!kullanici) redirect("/giris");
>   return kullanici;
> }
>
> // Yalnızca manager için. Giriş yapmamışsa giriş sayfasına yönlendirir.
> // Kullanıcı finance ise null döner: sayfa "yetkiniz yok" mesajı göstermelidir,
> // sunucu işlemi ise işlemi yapmadan durmalıdır.
> // Rol kararı src/lib/yetki.ts içindeki saf fonksiyonla verilir (Gün 6).
> export async function requireManager(): Promise<AktifKullanici | null> {
>   const kullanici = await requireUser();
>   return yoneticiMi(kullanici.role) ? kullanici : null;
> }
>
> // Kayıt: yeni firma ve o firmanın ilk kullanıcısı (manager) birlikte oluşturulur.
> export async function kayitOl(girdi: KayitGirdisi): Promise<IslemSonucu> {
>   // Bu e-posta daha önce kullanılmış mı?
>   const mevcut = await prisma.user.findUnique({
>     where: { email: girdi.eposta },
>     select: { id: true },
>   });
>   if (mevcut) {
>     return { ok: false, hata: "Bu e-posta adresiyle zaten bir hesap var." };
>   }
>
>   // Parola düz metin saklanmaz, bcrypt ile özetlenir.
>   const passwordHash = await bcrypt.hash(girdi.parola, BCRYPT_TUR);
>
>   try {
>     // İç içe oluşturma tek bir işlemdir: ya firma ve kullanıcı birlikte
>     // kaydedilir ya da hiçbiri. tenantId'yi Prisma kendisi doldurur.
>     const firma = await prisma.tenant.create({
>       data: {
>         name: girdi.firmaAdi,
>         users: {
>           create: {
>             email: girdi.eposta,
>             name: girdi.adSoyad,
>             passwordHash,
>             role: "manager",
>           },
>         },
>       },
>       select: { users: { select: { id: true } } },
>     });
>
>     const kullaniciId = firma.users[0]?.id;
>     if (!kullaniciId) {
>       return { ok: false, hata: "Kayıt tamamlanamadı. Lütfen tekrar deneyin." };
>     }
>
>     await oturumCerezineYaz(kullaniciId);
>     return { ok: true };
>   } catch (hata) {
>     // İki kişi aynı anda aynı e-postayla kayıt olursa veritabanı engeller
>     // (tekrarEdenKayitMi: src/lib/islem.ts).
>     if (tekrarEdenKayitMi(hata)) {
>       return { ok: false, hata: "Bu e-posta adresiyle zaten bir hesap var." };
>     }
>     // Beklenmeyen hatada ayrıntı kullanıcıya gösterilmez, parola loglanmaz.
>     console.error("Kayıt sırasında beklenmeyen hata.");
>     return { ok: false, hata: "Kayıt tamamlanamadı. Lütfen tekrar deneyin." };
>   }
> }
>
> // Kullanıcı bulunamasa bile karşılaştırma yapabilmek için sahte bir özet.
> // Böylece cevabın süresinden "bu e-posta kayıtlı mı" bilgisi çıkarılamaz.
> let sahteOzet: string | undefined;
> async function sahteOzetiAl(): Promise<string> {
>   if (!sahteOzet) {
>     sahteOzet = await bcrypt.hash("sahte-parola-degeri", BCRYPT_TUR);
>   }
>   return sahteOzet;
> }
>
> // Giriş: e-posta ve parola doğruysa oturum çerezi yazılır.
> // Gün 12 (B1): Aynı e-postaya 15 dakikada en fazla 5 deneme yapılabilir
> // (src/lib/giris-siniri.ts). Deneme, parola kontrolünden ÖNCE sayılır.
> export async function girisYap(
>   epostaGirdisi: unknown,
>   parolaGirdisi: unknown
> ): Promise<IslemSonucu> {
>   const parola = typeof parolaGirdisi === "string" ? parolaGirdisi : "";
>   const eposta = epostaDogrula(epostaGirdisi);
>
>   // Boş ya da biçimi bozuk girdi, makul olmayan uzunluk: tek tip hata.
>   if (!eposta.ok || parola.length === 0 || parola.length > 1000) {
>     return { ok: false, hata: GIRIS_HATASI };
>   }
>
>   // Deneme sınırı. Bu adımda await yoktur: aynı anda gelen istekler sırayla sayılır.
>   // Sınır aşıldıysa veritabanına ve bcrypt'e hiç gidilmez. Sayaç e-postanın kayıtlı
>   // olup olmadığına bakmadığı için bu cevap da e-postanın varlığını ele vermez.
>   if (!girisSiniri.denemeyiKaydet(eposta.deger).izin) {
>     return { ok: false, hata: BLOK_MESAJI };
>   }
>
>   const kullanici = await prisma.user.findUnique({
>     where: { email: eposta.deger },
>     select: { id: true, passwordHash: true },
>   });
>
>   // Kullanıcı yoksa da bir karşılaştırma yapılır (süre farkı oluşmasın).
>   const ozet = kullanici?.passwordHash ?? (await sahteOzetiAl());
>   const dogruMu = await bcrypt.compare(parola, ozet);
>
>   if (!kullanici || !dogruMu) {
>     return { ok: false, hata: GIRIS_HATASI };
>   }
>
>   // Başarılı giriş: bu e-postanın deneme sayacı silinir.
>   girisSiniri.basarili(eposta.deger);
>   await oturumCerezineYaz(kullanici.id);
>   return { ok: true };
> }
>
> // Çıkış: çerezi siler.
> export async function cikisYap(): Promise<void> {
>   await oturumCerezindenSil();
> }
> ```
>
> ## 4. package.json: yalnızca iki test satırı
>
> `test` satırının sonuna sayaç testini ekler:
> ```zsh
> perl -pi -e 's#src/lib/mrr-grafigi\.test\.ts"#src/lib/mrr-grafigi.test.ts src/lib/giris-siniri.test.ts"#' package.json
> ```
>
> `test:db` satırının sonuna veritabanı testini ekler:
> ```zsh
> perl -pi -e 's#src/lib/riskli-abonelikler\.test\.ts"#src/lib/riskli-abonelikler.test.ts src/lib/giris.test.ts"#' package.json
> ```
>
> Yalnızca bu iki satırın değiştiğini gösterir (2 satır `-`, 2 satır `+` görmelisin):
> ```zsh
> git --no-pager diff package.json
> ```
>
> ## 5. Testler ve kontroller
>
> Veritabanısız testleri çalıştırır (yeni 12 test dahil, hepsi geçmeli):
> ```zsh
> npm test
> ```
>
> Neon test dalındaki testleri çalıştırır (yeni 3 test dahil, hepsi geçmeli):
> ```zsh
> npm run test:db
> ```
>
> Kod biçimi kurallarını denetler (hata çıkmamalı):
> ```zsh
> npm run lint
> ```
>
> Uygulamayı üretim için derler ve tip kontrolü yapar (başarıyla bitmeli):
> ```zsh
> npm run build
> ```
>
> ## 6. Commit öncesi üç tarama
>
> Beş dosyayı commit'e hazırlar:
> ```zsh
> git add src/lib/giris-siniri.ts src/lib/giris-siniri.test.ts src/lib/giris.test.ts src/lib/auth.ts package.json
> ```
>
> Hazırlanan dosyalarda parola deseni arar (çıktı boş olmalı):
> ```zsh
> git --no-pager grep --cached -c -E "npg_[A-Za-z0-9]{6,}"
> ```
>
> Hazırlanan dosyalarda gerçek Neon sunucu adı arar (sonuç 0 olmalı):
> ```zsh
> git --no-pager grep --cached -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
> ```
>
> Hazırlanan dosyalarda ad taraması yapar (sonuç 0 olmalı):
> ```zsh
> git --no-pager grep --cached -h -i -E "[AD_DESENI]" | sed 's/ozgesoganci1-bot//Ig' | grep -ic -E "[AD_DESENI]"
> ```
>
> Commit'e yalnızca bu beş dosyanın girdiğini gösterir:
> ```zsh
> git status --short
> ```
>
> ## 7. Commit
>
> Değişiklikleri tek commit olarak kaydeder; ekler en sonda tek blokta:
> ```zsh
> git commit -m "fix: giriş deneme sınırı (B1)" -m $'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01ERuUmicCCSJwyX4zWam3oq'
> ```
>
> ## 8. Elle deneme (dev:test)
>
> Uygulamayı Neon test dalında açar (canlı koruması devrede):
> ```zsh
> npm run dev:test
> ```
>
> Sonra tarayıcıda:
>
> 1. Terminalde yazan adresi aç (genelde `http://localhost:3000/giris`).
> 2. Test dalındaki kendi test hesabının e-postasıyla **5 kez yanlış parola** dene. Her seferinde "E-posta veya parola hatalı." görmelisin.
> 3. **6. kez** yanlış dene. "Çok fazla hatalı deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyin." görmelisin.
> 4. Şimdi **doğru parolayı** dene. Yine blok mesajı görmelisin, giriş olmamalı.
> 5. Aynı e-postayı büyük harflerle yaz ve dene. Yine blok mesajı görmelisin.
> 6. Hiç kayıtlı olmayan bir e-postayla (ör. `yok@example.com`) adım 2 ve 3'ü tekrarla. Mesajlar ve sıraları kayıtlı e-postayla birebir aynı olmalı.
> 7. Bloğu beklemeden kaldırmak için sunucuyu durdur (Terminal'de **Control+C**), `npm run dev:test` ile yeniden başlat. Bu kez doğru parolayla girebilmelisin; sayaç bellekte olduğu için sıfırlanmıştır.
>
> Elle deneme de tamamsa GitHub Desktop'ta **Publish branch**, ardından **Create Pull Request**. PR açıklamasının sonu proje kuralındaki gibi:
>
> ```
> 🤖 Generated with [Claude Code](https://claude.com/claude-code)
>
> https://claude.ai/code/session_01ERuUmicCCSJwyX4zWam3oq
> ```
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **Çalıştıramadıklarım:** Sayaç dosyası ve birim testleri burada çalıştı (12/12). `npm run test:db`, `lint` ve `build` çalıştıramadım; bu ortamda paketleri kuramıyorum ve Neon test dalına erişimim yok. Sonuçları senin terminalin gösterecek.
> - **Sahte parola özeti:** `veri.ts`'in test yöneticisinin parola özeti gerçek bir bcrypt özeti değil (`test-giris-yapilamaz`). bcryptjs'in bu durumda hata fırlatmak yerine `false` döndüğünü varsaydım. `giris.test.ts`'in ilk testi bcrypt kaynaklı bir hatayla düşerse çıktıyı gönder; o zaman yalnızca kayıtsız e-postayla ve sayaç düzeyinde test ederiz.
> - **Test süresi:** `giris.test.ts` kayıtsız e-posta için gerçek bcrypt (maliyet 12) çalıştırır; bu test birkaç saniye sürebilir.
> - **Geliştirme modu:** Next.js geliştirme sunucusu dosya değişince kodu yeniden yükler. Sayaç `globalThis` üzerinde durduğu için sıfırlanmaz; bu yüzden adım 7'de sunucuyu tamamen kapatıp açmak gerekiyor.
> - **Sunucu işlemi:** Giriş formu bir sunucu işlemi (server action) olduğu için tarayıcıdan gelen her gönderim bir deneme sayılır. Next.js'in bir gönderimi iki kez çalıştırmadığını varsaydım; elle denemede 6. denemeden önce blok gelirse bunu bana söyle.
>
> Sources:
> - [Send the correct X_FORWARDED_FOR (Render feedback)](https://feedback.render.com/features/p/send-the-correct-xforwardedfor)

### Prompt 5 · 24 Eki 2026 15:34

````text
Parça 1 canlıda doğrulandı (PR #40, main 449afbb). Parça 2'ye geç: B6 (issue #24, tenant.ts), B10 (next.config.ts güvenlik başlıkları), B12 (npm audit fix, yalnızca package-lock.json). Önce kod yazma, plan ver: hangi dosyalar değişecek, B6'da okuma ve güncelleme davranışı tam olarak nasıl değişecek, bunun mevcut hiçbir akışı bozmadığını koddan nasıl teyit ettin, hangi testler eklenecek veya güncellenecek, B10'da hangi başlıklar hangi değerlerle gelecek ve SSE ile Next.js geliştirme modunu bozmayacağını nasıl biliyorsun. Plan sonunda varsayımlarını listele. Onayım olmadan kod yazma.
````

### Claude cevabı 5 · 24 Eki 2026 15:36

> Önce depodaki güncel `main`'i (449afbb) çekip Tenant tablosunun bütün kullanımlarını buluyorum.
> ## Parça 2 planı (B6 + B10 + B12)
>
> Güncel `main` (449afbb) üzerinden inceledim. Dal adı önerim: `gun12-tenant-basliklar`. Üç ayrı commit: B6, B10, B12.
>
> ### Değişecek dosyalar
>
> | Bulgu | Dosya | İşlem |
> |---|---|---|
> | B6 | `src/lib/tenant.ts` | Firma (Tenant) bloğu değişir, başka hiçbir şey değişmez |
> | B6 | `src/lib/tenant.test.ts` | "Firma tablosu" bölümünde bir test güncellenir, yeni testler eklenir |
> | B10 | `next.config.ts` | Güvenlik başlıkları ve `poweredByHeader: false` eklenir |
> | B10 | `src/test-destek/guvenlik-basliklari.test.ts` | Yeni dosya: başlık listesini denetleyen veritabanısız test |
> | B10 | `package.json` | **Yalnızca `test` satırına** yeni test dosyasının adı eklenir (onayın gerekiyor) |
> | B12 | `package-lock.json` | `npm audit fix` ile; başka dosya değişirse durulur |
>
> ## B6: Issue #24
>
> ### Bugün ne oluyor (`tenant.ts`, satır 142–153)
> ```ts
> 145  a.where = { ...kosul, id: tenantId };
> ```
> Kod `where: { id: "B" }` gönderirse `id` sessizce oturumdaki firmanın kimliğiyle **ezilir**. Sonuç: B istenir, A döner (okumada) ya da A güncellenir (güncellemede).
>
> ### Yeni davranış
> Gönderilen `id` artık ezilmez, **ikisi birlikte koşul olur**: "kimlik oturumdaki firma olmalı VE gönderilen kimlik olmalı". Kod tarafında:
>
> - `where` içinde `id` yoksa ya da tam olarak oturumdaki firma kimliğiyse: bugünkü gibi `{ ...kosul, id: tenantId }`.
> - `where` içinde farklı bir `id` varsa: `{ ...kosul, id: tenantId, AND: [...eski AND koşulları, { id: <gönderilen> }] }`.
>
> İki koşul aynı anda sağlanamadığı için sonuç veritabanının doğal "bulunamadı" cevabı olur:
>
> | İşlem | Bugün (B'nin kimliğiyle) | Yeni |
> |---|---|---|
> | `findFirst`, `findUnique` | A'nın kaydı | `null` |
> | `findMany` | `[A]` | `[]` |
> | `count` | 1 | 0 |
> | `findFirstOrThrow`, `findUniqueOrThrow` | A'nın kaydı | "bulunamadı" hatası |
> | `update` | A güncellenir | "güncellenecek kayıt bulunamadı" hatası, A ve B değişmez |
> | `id: { in: [A, B] }` gibi liste koşulu | A | A (yalnızca kendi firması) |
>
> Ekleme ve silme bugünkü gibi reddedilmeye devam eder. Özel bir boş sonuç üretmek yerine veritabanının kendi cevabını kullanmak, her işlem türü için ayrı kod yazmayı gereksiz kılıyor.
>
> ### Mevcut akışları bozmadığını nasıl teyit ettim
> `src` altında Tenant tablosuna yapılan bütün çağrıları taradım (`.tenant.<işlem>(`):
>
> | Yer | Çağrı | Kimlik veriyor mu? | Etkilenir mi? |
> |---|---|---|---|
> | `ayarlar/page.tsx:18` | `findFirst({ select: { cac } })` | Hayır | Hayır |
> | `dashboard-verisi.ts:68` | `findFirst({ select: { cac } })` | Hayır | Hayır |
> | `cac-ayari.ts:56` | `findFirst({ select: { id } })` | Hayır | Hayır |
> | `cac-ayari.ts:60` | `update({ where: { id: firma.id } })` | Evet, ama bir satır önce **aynı filtreden okunan kendi kimliği** | Hayır (kimlik eşit, ilk kural) |
> | `auth.ts:111` | `prisma.tenant.create` | Ham `prisma`, filtre dışı | Hayır |
> | `auth.ts:60` | `user.findUnique` içinde `tenant: { select }` | Ham `prisma`, filtre dışı | Hayır |
>
> Uygulama kodunda `AND`, `OR`, `NOT` hiç kullanılmıyor; dolayısıyla `AND` listesine ekleme yaparken mevcut bir koşulu silme riski de yok (yine de mevcut `AND` korunacak şekilde yazılacak).
>
> Testlerde:
> - `tenant.test.ts:212`, eski davranışı belgeliyor (B'nin kimliğiyle güncelleme A'ya uygulanıyor). **Bu test bozulacak, bilerek güncellenecek.**
> - `dashboard-verisi.test.ts:90`, `dbB.tenant.update({ where: { id: B.tenantId } })`: kendi kimliği, etkilenmez.
> - `cac-ayari.test.ts:50` ve `duman.test.ts:43`: kimlik vermiyor, etkilenmez.
>
> ### Testler (`tenant.test.ts`, "Firma tablosu" bölümü, `npm run test:db`)
> 1. **Güncellenir:** "A, B'nin firma ayarını (CAC) değiştiremez": artık `update` reddedilmeli, **A'nın da B'nin de** CAC'si 0 kalmalı (bugün A'nınki değişiyordu).
> 2. **Yeni:** B'nin kimliğiyle `findFirst` ve `findUnique` `null` döner, `findMany` boş liste, `count` 0.
> 3. **Yeni:** B'nin kimliğiyle `findFirstOrThrow` reddedilir.
> 4. **Yeni:** Kendi kimliğiyle `findFirst` ve `update` çalışır (CAC yazılır, sonra 0'a geri alınır).
> 5. **Yeni:** `id: { in: [A, B] }` ile `findMany` yalnızca A'yı döner.
> 6. **Yeni:** Var olan `AND` koşulu korunur (örnek: `{ id: B, AND: { name: ... } }` yine `null`, `{ AND: { name: A'nın adı } }` A'yı bulur).
>
> ## B10: Güvenlik başlıkları
>
> ### Gelecek başlıklar (bütün yollar için, `source: "/:path*"`)
>
> | Başlık | Değer | Ne işe yarar |
> |---|---|---|
> | `X-Frame-Options` | `DENY` | Site başka bir sayfanın içine çerçeve olarak gömülemez (eski tarayıcılar için) |
> | `Content-Security-Policy` | `frame-ancestors 'none'` | Aynısının güncel tarayıcı karşılığı. **Yalnızca bu kural**, tam bir CSP değil |
> | `X-Content-Type-Options` | `nosniff` | Tarayıcı dosya türünü tahmin etmez, sunucunun söylediğine uyar |
> | `Referrer-Policy` | `strict-origin-when-cross-origin` | Başka sitelere giden isteklerde tam adres (ör. `/musteriler/<id>`) gönderilmez |
> | `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Uygulamanın kullanmadığı tarayıcı izinleri kapatılır |
>
> Ayrıca `poweredByHeader: false`: `X-Powered-By: Next.js` başlığı gönderilmez.
>
> **Bilerek eklenmeyenler:**
> - **Tam CSP (`script-src`, `connect-src` vb.):** Next.js satır içi betikler kullanır, geliştirme modu da kendi bağlantılarını açar. Tam bir CSP bunları bozabilir ve nonce gibi ek iş ister; 2 haftalık kapsam için ağır.
> - **HSTS (`Strict-Transport-Security`):** Render'ın bunu zaten gönderip göndermediğini doğrulamadım. Yanlış bir değer (ör. `includeSubDomains`) geri alınması zor bir tarayıcı kaydı bırakır. Önce canlıda mevcut başlıklara bakmayı öneriyorum.
>
> ### SSE ve geliştirme modunu bozmayacağını nereden biliyorum
> - **SSE (`/api/events`):** Route kendi `Content-Type: text/event-stream` ve `Cache-Control` başlıklarını koyuyor; benim eklediklerimin hiçbiri bu adlarla çakışmıyor. Eklenen başlıklar yalnızca yanıta satır ekler, akışı tamponlamaz ve gövdeye dokunmaz. `nosniff` yalnızca tür belirtilmemiş ya da yanlış belirtilmiş içerikte devreye girer; SSE'nin türü açıkça yazılı. `frame-ancestors` ve `X-Frame-Options` yalnızca sayfanın çerçeveye gömülmesini etkiler, `EventSource` bağlantısını etkilemez.
> - **Geliştirme modu:** Next.js'in anında yenileme (HMR) bağlantısı ve hata ekranı betiklere ve WebSocket'e dayanır. CSP'de yalnızca `frame-ancestors` olduğu için betik ve bağlantı kuralı yok, bunlar kısıtlanmaz.
> - **Çerçeve kullanımı:** Kodda `iframe` yok; uygulama kendini hiçbir yerde çerçeve içinde açmıyor.
>
> Bunları "biliyorum" değil "koddan ve başlıkların tanımından çıkarıyorum"; bu yüzden elle doğrulama da planda var (aşağıda).
>
> ### Test ve doğrulama
> - **Yeni test** (`guvenlik-basliklari.test.ts`, `npm test`): `next.config.ts` dosyasını içe aktarır, `poweredByHeader`'ın `false` olduğunu ve `headers()` sonucunda beş başlığın beklenen değerlerle bütün yollara uygulandığını denetler. `next.config.ts` çalışma zamanında yalnızca bir tür (type) içe aktardığı için veritabanı ya da Next.js sunucusu gerekmez.
> - **Elle** (`npm run dev:test` açıkken):
>   - `curl -s -D - -o /dev/null http://localhost:3000/giris` ile giriş sayfasının başlıklarında beş başlığın olduğu ve `X-Powered-By` olmadığı görülür.
>   - Aynı komut `/api/events` için: oturumsuz 401 yanıtında da başlıkların geldiği görülür.
>   - Tarayıcıda giriş yapıp bir aboneliği iptal et: canlı uyarı bandı yine gelmeli (SSE çalışıyor).
>   - Bir dosyayı kaydet: sayfa anında yenilenmeli (HMR çalışıyor).
> - **Canlıda** (birleştirmeden sonra): aynı `curl` komutu Render adresine; HSTS'in Render tarafından gönderilip gönderilmediği de bu çıktıda görülür.
>
> ## B12: npm audit fix (ayrı commit, aynı PR)
>
> 1. B6 ve B10 commit'lerinden sonra `npm audit fix` (`--force` yok).
> 2. `git status --short`: **yalnızca** `package-lock.json` değişmiş olmalı. `package.json` değiştiyse iki dosya `git restore` ile geri alınır ve sana sorarım.
> 3. `npm ls fast-uri`: yeni sürümün 3.1.8'den büyük olduğu görülür.
> 4. `npm audit --omit=dev`: 0 açık.
> 5. `npm test`, `npm run test:db`, `npm run lint`, `npm run build`.
> 6. Üç tarama, sonra `fix: npm audit fix (B12, fast-uri)` commit'i.
>
> ## Senin kararın gereken iki nokta
>
> 1. **`package.json` test satırı:** B10 testinin `npm test`'e girmesi için `test` satırına bir dosya adı eklenecek. Parça 1'deki gibi izin veriyor musun?
> 2. **Aynı sorun diğer tablolarda da var:** `Customer`, `Plan`, `Subscription` vb. için filtre `{ ...kosul, tenantId }` yazıyor; kod `where: { tenantId: "B" }` gönderirse bu da sessizce A'ya çevrilir. Sızıntı yok ve uygulama kodunda `where` içinde `tenantId` hiç geçmiyor (taradım). İki seçenek:
>    - **A (önerim):** Parça 2'yi yalnızca Tenant tablosuyla sınırlı tutmak, bunu ADR'ye bilinen sınır olarak yazmak.
>    - **B:** Aynı "ezme yerine AND" kuralını diğer tablolardaki `tenantId` için de uygulamak (`tenant.ts` içinde birkaç satır daha, `tenant.test.ts`'e birkaç test daha).
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **Prisma `update` ile `AND`:** `update` ve `findUnique`'in `where` içinde benzersiz alanın (`id`) yanında ek koşul (`AND`) kabul ettiğini varsaydım (Prisma 5'ten beri genel özellik). Prisma 7.10'da çalıştıramadım; `npm run test:db` bunu doğrulayacak. Reddedilirse `update` için önce `findFirst` ile kontrol eden bir yola geçerim.
> - **`update` hatasının metni:** Kimlik uyuşmazsa Prisma'nın "kayıt bulunamadı" hatası (P2025) fırlatacağını varsaydım. Testte hata metnine değil yalnızca reddedildiğine bakacağım; metin sürüme göre değişebilir.
> - **Next.js 16 `headers()`:** `next.config.ts` içindeki `headers()` ayarının Next.js 16.4'te route handler yanıtlarına (SSE dahil) da uygulandığını varsaydım; bu bilgim 16 sürümünden öncesine dayanıyor. Elle `curl` adımı bunu doğrulayacak.
> - **Next.js'in kendi başlıkları:** Next.js'in aynı adla bir başlığı kendisinin gönderip göndermediğini (ör. bazı sürümlerde `X-Frame-Options`) bilmiyorum; çakışma olursa `curl` çıktısında aynı başlık iki kez görünür, o zaman bakarız.
> - **B12:** `npm audit fix`'in `package.json`'a dokunmadan düzeleceğini varsaydım, çünkü sorun dolaylı bağımlılıkta. Prisma'nın kilitlediği sürüm aralığı yeni `fast-uri` sürümüne izin vermiyorsa `npm audit fix` hiçbir şeyi değiştirmeyebilir; o durumda bulguyu ADR'de "Prisma güncellemesini bekliyor" olarak bırakmayı önereceğim.
> - **HSTS:** Render'ın davranışını doğrulamadım; bu yüzden plana almadım.
>
> Onaylarsan (ve iki karar noktasını yanıtlarsan) Parça 2'nin adımlarını tek tek veririm.

### Prompt 6 · 24 Eki 2026 15:37

````text
Parça 2 planını onaylıyorum. package.json: yalnızca test satırına guvenlik-basliklari.test.ts eklenmesine izin veriyorum, başka satıra dokunma. Diğer tablolarda tenantId ezilmesi: A seçeneği, yalnızca Tenant tablosu, gerisi ADR'de bilinen sınır. HSTS eklenmesin.
Ek şartlar: (1) B6'da where içindeki id bir nesne olduğunda da (in, not, equals vb.) oturumdaki firma kimliğiyle birlikte AND içinde uygulansın, bunu da test et. (2) B12'de npm audit fix sonrası package-lock.json farkında fast-uri ve ajv dışında bir paketin sürümü değişmişse dur ve bana göster. (3) PR başlığı fix: güvenlik gözden geçirme düzeltmeleri olsun. (4) Elle denemede ayrıca Ayarlar sayfasında CAC değerini kaydet (cac-ayari.ts update akışı), değişikliğin çalıştığını gör.
Şimdi adımları ver: dal gun12-tenant-basliklar, üç ayrı commit (B6, B10, B12), komutlar tek tek, dosyalar tam içerik. Commit ekleri proje kuralındaki gibi.
````

### Claude cevabı 6 · 24 Eki 2026 15:42

> Önce değişiklikleri kendi kopyamda hazırlayıp çalıştırabildiğim kısmını deniyorum.
> Şimdi `tenant.ts`'teki Firma bloğunu değiştiriyorum.
> Kural fonksiyonunun ürettiği koşulları ayrıca kontrol ediyorum:
> Koşullar beklendiği gibi. Şimdi `tenant.test.ts`'in "Firma tablosu" bölümünü güncelliyorum.
> Şimdi B10: `next.config.ts` ve testi.
> Üç test geçti, `package.json` farkı yalnızca `test` satırında. Şimdi tam dosyaları alıyorum.
> Parça 2 hazır. Burada çalıştırabildiklerimi denedim:
>
> - **B6:** Yeni koşul fonksiyonunun ürettiği sorgu koşullarını 8 örnekle kontrol ettim. `in`, `not`, `equals` ve önceden var olan `AND` (tek nesne ya da liste) beklendiği gibi birleşiyor.
> - **B10:** Başlık testi burada çalıştı (3/3 geçti).
> - **package.json:** Düzenleme komutunu bir kopyada denedim, yalnızca `test` satırı değişiyor.
> - Veritabanı testlerini, `lint` ve `build`'i çalıştıramadım; onları senin terminalin gösterecek.
>
> Komutların hepsini proje klasöründe çalıştır.
>
> ## 1. Dal aç
>
> `main` dalına geçer:
> ```zsh
> git switch main
> ```
>
> GitHub'daki son hâli (449afbb) indirir:
> ```zsh
> git pull
> ```
>
> Yeni dalı açar ve ona geçer:
> ```zsh
> git switch -c gun12-tenant-basliklar
> ```
>
> ## 2. Commit 1: B6 (issue #24)
>
> ### `src/lib/tenant.ts`: dosyanın içeriğini tamamen şununla değiştir
>
> Değişen yalnızca üç yer: dosya başına kuralın açıklaması, yeni `firmaKosulu` fonksiyonu ve Firma bloğundaki iki satır. Diğer tabloların kodu aynı.
>
> ```ts
> // MERKEZİ KİRACI (TENANT) FİLTRESİ
> //
> // Uygulamadaki bütün veri sorguları bu dosyadaki getTenantDb() üzerinden yapılır.
> // Bu nesne, her sorguya aktif kullanıcının tenantId değerini OTOMATİK ekler:
> //   - Okuma, sayma, güncelleme, silme: filtreye "tenantId = oturumdaki değer" eklenir.
> //   - Kayıt ekleme: tenantId, oturumdaki değerle zorla üzerine yazılır.
> //   - Tanımadığı bir işlemle karşılaşırsa hata verir ("izin ver" değil "durdur").
> // tenantId hiçbir zaman istemciden (form, URL) alınmaz, yalnızca oturumdan gelir.
> //
> // YAZMA KORUMASI (Gün 6): Ekleme ve güncelleme verisinde YALNIZCA tablonun kendi
> // sütunları kullanılabilir (beyaz liste). İlişki alanları (ör. "tenant", "customer",
> // "subscriptions") reddedilir. Neden? Prisma'da bir kayıt ilişki üzerinden de başka
> // firmaya bağlanabilir: data: { tenant: { connect: { id: "B" } } }. Gün 6 testleri bu
> // yolla bir müşterinin başka firmaya taşınabildiğini gösterdi. İç içe yazımlar
> // (connect, create, connectOrCreate ...) yalnızca ilişki alanlarının altında yazılabildiği
> // için beyaz liste hepsini en üst düzeyde durdurur.
> // Ayrıca güncellemede "id" ve "tenantId" değiştirilemez.
> // Sütun listeleri Prisma'nın şemadan ürettiği koddan okunur; şemaya yeni sütun
> // eklenince ayrıca güncellemek gerekmez.
> //
> // SİLME KORUMASI (Gün 7): İş kuralına göre müşteri ve plan silinmez, pasife alınır;
> // abonelik silinmez, iptal edilir; olay kayıtları hiç silinmez. Bu tablolarda
> // "delete" ve "deleteMany" veritabanına gitmeden durdurulur. Kullanıcı (User)
> // tablosunda silme serbesttir. Firma (Tenant) tablosu ayrıca aşağıda korunur.
> // Test verisinin temizliği (src/test-destek/veri.ts) ham "prisma" ile yapıldığı
> // için bu korumadan etkilenmez.
> //
> // FİRMA TABLOSU KİMLİK KURALI (Gün 12, issue #24): Firma tablosunda "where" içinde
> // başka bir firmanın kimliği istenirse kimlik oturumdakiyle ezilmez, sonuç
> // "bulunamadı" olur (bkz. firmaKosulu). Diğer tablolarda "where" içine yazılan
> // tenantId hâlâ oturumdakiyle ezilir; uygulama kodu "where" içinde tenantId
> // kullanmadığı için bu, ADR'de bilinen sınır olarak bırakıldı.
> //
> // YASAK: prisma.$queryRaw / $executeRaw. Ham SQL bu filtreden geçmez.
>
> import { prisma } from "./db";
> import { requireUser } from "./auth";
> import {
>   TenantScalarFieldEnum,
>   UserScalarFieldEnum,
>   CustomerScalarFieldEnum,
>   PlanScalarFieldEnum,
>   SubscriptionScalarFieldEnum,
>   SubscriptionEventScalarFieldEnum,
> } from "../../generated/prisma/internal/prismaNamespace";
>
> // Okuma türü işlemler.
> const OKUMA = new Set([
>   "findUnique",
>   "findUniqueOrThrow",
>   "findFirst",
>   "findFirstOrThrow",
>   "findMany",
>   "count",
>   "aggregate",
>   "groupBy",
> ]);
>
> // Mevcut kayıtları değiştiren veya silen işlemler.
> const GUNCELLEME_SILME = new Set([
>   "update",
>   "updateMany",
>   "updateManyAndReturn",
>   "delete",
>   "deleteMany",
> ]);
>
> // Silme işlemleri (silme korumasında kullanılır).
> const SILME = new Set(["delete", "deleteMany"]);
>
> // Kayıtları silinemeyen tablolar ve hata mesajında gösterilecek neden.
> // Bu listede olmayan tablolarda (User) silme serbesttir.
> const SILINEMEZ = new Map<string, string>([
>   ["Customer", "kayıtlar silinmez, pasife alınır"],
>   ["Plan", "kayıtlar silinmez, pasife alınır"],
>   ["Subscription", "abonelikler silinmez, iptal edilir"],
>   ["SubscriptionEvent", "olay kayıtları silinmez"],
> ]);
>
> // Çoklu kayıt ekleme işlemleri.
> const COKLU_EKLEME = new Set(["createMany", "createManyAndReturn"]);
>
> // Her tablonun yazılabilir sütunları (Prisma'nın ürettiği listelerden).
> // Bu listede olmayan bir tablo için yazma işlemi durdurulur.
> const SUTUNLAR: Record<string, ReadonlySet<string>> = {
>   Tenant: new Set<string>(Object.values(TenantScalarFieldEnum)),
>   User: new Set<string>(Object.values(UserScalarFieldEnum)),
>   Customer: new Set<string>(Object.values(CustomerScalarFieldEnum)),
>   Plan: new Set<string>(Object.values(PlanScalarFieldEnum)),
>   Subscription: new Set<string>(Object.values(SubscriptionScalarFieldEnum)),
>   SubscriptionEvent: new Set<string>(Object.values(SubscriptionEventScalarFieldEnum)),
> };
>
> // Değerin düz bir nesne olup olmadığını kontrol eder.
> function nesneMi(deger: unknown): deger is Record<string, unknown> {
>   return typeof deger === "object" && deger !== null && !Array.isArray(deger);
> }
>
> // Ekleme ve güncelleme verisini denetler. Kurala uymayan ilk alanda durdurur.
> //   ekleme:     yalnızca tablonun sütunları (tenantId yazılabilir, sonra zaten ezilir)
> //   guncelleme: yalnızca tablonun sütunları, "id" ve "tenantId" hariç
> // veri: tek bir nesne ya da (createMany için) nesne dizisi.
> function veriyiDenetle(
>   model: string,
>   veri: unknown,
>   tur: "ekleme" | "guncelleme"
> ): void {
>   const sutunlar = SUTUNLAR[model];
>   if (!sutunlar) {
>     throw new Error(`"${model}" tablosu kiracı filtresi tarafından tanınmıyor.`);
>   }
>
>   const satirlar = Array.isArray(veri) ? veri : [veri];
>   for (const satir of satirlar) {
>     // Nesne değilse (ör. eksik veri) Prisma kendi doğrulamasıyla reddeder.
>     if (!nesneMi(satir)) continue;
>
>     for (const alan of Object.keys(satir)) {
>       if (tur === "guncelleme" && alan === "tenantId") {
>         // Bir kayıt başka firmaya taşınamaz.
>         throw new Error("tenantId değiştirilemez.");
>       }
>       if (tur === "guncelleme" && alan === "id") {
>         throw new Error('"id" alanı bu işlemde kullanılamaz: kayıt kimliği değiştirilemez.');
>       }
>       if (!sutunlar.has(alan)) {
>         throw new Error(
>           `"${alan}" alanı bu işlemde kullanılamaz: yalnızca tablonun kendi sütunları yazılabilir.`
>         );
>       }
>     }
>   }
> }
>
> // Firma (Tenant) tablosu için sorgu koşulu (Gün 12, bulgu B6, issue #24).
> //
> // Oturumdaki firma kimliği her zaman zorunludur. Kod "where" içinde ayrıca bir "id"
> // gönderirse bu kimlik EZİLMEZ: AND içinde oturumdaki kimlikle BİRLİKTE uygulanır.
> // İkisi aynı anda sağlanamıyorsa veritabanı "bulunamadı" cevabı verir:
> //   okumada null / boş liste / 0, güncellemede "kayıt bulunamadı" hatası.
> // Eskiden gönderilen kimlik oturumdakiyle değiştiriliyordu: B istenince sessizce
> // A'nın kaydı dönüyor ya da A güncelleniyordu (sızıntı yoktu ama yanıltıcıydı).
> //
> // "id" bir nesne olsa da (in, not, equals ...) aynı kural geçerlidir:
> //   { id: { in: [A, B] } } -> yalnızca A; { id: { not: A } } -> hiçbiri.
> // Koşulda daha önceden AND varsa korunur, yeni koşul listenin sonuna eklenir.
> // "id" hiç verilmemişse ya da tam olarak oturumdaki kimlikse davranış değişmez.
> function firmaKosulu(
>   kosul: Record<string, unknown>,
>   tenantId: string
> ): Record<string, unknown> {
>   if (kosul.id === undefined || kosul.id === tenantId) {
>     return { ...kosul, id: tenantId };
>   }
>   const oncekiAnd =
>     kosul.AND === undefined ? [] : Array.isArray(kosul.AND) ? kosul.AND : [kosul.AND];
>   return { ...kosul, id: tenantId, AND: [...oncekiAnd, { id: kosul.id }] };
> }
>
> // Verilen kiracıya bağlı bir veritabanı nesnesi üretir.
> // Doğrudan test edilebilmesi için dışarı açıktır; uygulama kodu getTenantDb() kullanır.
> export function tenantaBagliDb(tenantId: string) {
>   return prisma.$extends({
>     name: "tenantFiltresi",
>     query: {
>       $allModels: {
>         async $allOperations({ model, operation, args, query }) {
>           const a: Record<string, unknown> = nesneMi(args) ? { ...args } : {};
>           const kosul = nesneMi(a.where) ? a.where : {};
>
>           // Firma (Tenant) tablosu: yalnızca kullanıcının kendi firması.
>           // Okunabilir ve güncellenebilir (ör. CAC ayarı). Eklenemez, silinemez.
>           // Koşul firmaKosulu() ile kurulur (Gün 12, issue #24).
>           if (model === "Tenant") {
>             if (OKUMA.has(operation)) {
>               a.where = firmaKosulu(kosul, tenantId);
>               return query(a as typeof args);
>             }
>             if (operation === "update") {
>               veriyiDenetle(model, a.data, "guncelleme");
>               a.where = firmaKosulu(kosul, tenantId);
>               return query(a as typeof args);
>             }
>             throw new Error(`Firma tablosunda "${operation}" işlemine izin verilmez.`);
>           }
>
>           // Silme koruması: listedeki tablolarda silme veritabanına hiç gitmez.
>           const silmeNedeni = SILINEMEZ.get(model);
>           if (silmeNedeni && SILME.has(operation)) {
>             throw new Error(
>               `"${model}" tablosunda "${operation}" işlemine izin verilmez: ${silmeNedeni}.`
>             );
>           }
>
>           // Diğer bütün tablolar: tenantId filtresi zorunlu.
>           if (OKUMA.has(operation)) {
>             a.where = { ...kosul, tenantId };
>             return query(a as typeof args);
>           }
>
>           if (GUNCELLEME_SILME.has(operation)) {
>             // Silme işlemlerinde "data" yoktur; denetim yalnızca güncellemede çalışır.
>             if (a.data !== undefined) veriyiDenetle(model, a.data, "guncelleme");
>             a.where = { ...kosul, tenantId };
>             return query(a as typeof args);
>           }
>
>           if (operation === "create") {
>             veriyiDenetle(model, a.data, "ekleme");
>             const veri = nesneMi(a.data) ? a.data : {};
>             a.data = { ...veri, tenantId };
>             return query(a as typeof args);
>           }
>
>           if (COKLU_EKLEME.has(operation)) {
>             veriyiDenetle(model, a.data, "ekleme");
>             const liste = Array.isArray(a.data) ? a.data : [a.data];
>             a.data = liste.map((satir) => ({
>               ...(nesneMi(satir) ? satir : {}),
>               tenantId,
>             }));
>             return query(a as typeof args);
>           }
>
>           if (operation === "upsert") {
>             veriyiDenetle(model, a.create, "ekleme");
>             veriyiDenetle(model, a.update, "guncelleme");
>             const olustur = nesneMi(a.create) ? a.create : {};
>             a.where = { ...kosul, tenantId };
>             a.create = { ...olustur, tenantId };
>             return query(a as typeof args);
>           }
>
>           // Tanımadığımız işlem: güvenli tarafta kal ve durdur.
>           throw new Error(`"${operation}" işlemi kiracı filtresi tarafından tanınmıyor.`);
>         },
>       },
>     },
>   });
> }
>
> // Aktif kullanıcının kiracısına bağlı veritabanı nesnesi.
> // Giriş yapılmamışsa kullanıcı giriş sayfasına yönlendirilir.
> export async function getTenantDb() {
>   const kullanici = await requireUser();
>   return tenantaBagliDb(kullanici.tenantId);
> }
>
> export type TenantDb = ReturnType<typeof tenantaBagliDb>;
> ```
>
> ### `src/lib/tenant.test.ts`: dosyanın içeriğini tamamen şununla değiştir
>
> Değişen yalnızca "Firma tablosu" bölümü: eski "A, B'nin firma ayarını değiştiremez" testi yeni davranışa göre güncellendi ve beş test eklendi. Diğer bölümler aynı.
>
> ```ts
> // KİRACI İZOLASYONU TESTLERİ (Gün 6)
> //
> // Ne test edilir? src/lib/tenant.ts içindeki tenant filtresi. Uygulamadaki bütün
> // veri sorguları bu filtreden geçer (bunu kurallar.test.ts kontrol eder).
> // Buradaki testler, sunucu işlemlerinin (actions.ts) kullandığı sorgu biçimlerinin
> // aynısını "A firmasının kullanıcısı" gibi çalıştırır ve B firmasının kayıtlarına
> // ulaşılamadığını gösterir.
> //
> // dbA: A firmasına bağlı veritabanı nesnesi (uygulamada getTenantDb() bunu üretir).
> // dbB: Yalnızca kontrol için. "B'nin kaydı gerçekten değişmedi mi?" sorusuna bakar.
> //
> // Veri: iki sahte firma oluşturulur, testler bitince silinir (bkz. test-destek/veri.ts).
> // Çalıştırmak için: npm run test:db
>
> import { describe, test, before, after } from "node:test";
> import assert from "node:assert/strict";
> // Önce test verisi yardımcısı: TEST_VERITABANI kontrolü onun içinde yapılır.
> import {
>   CALISMA,
>   PLAN_FIYATI,
>   testFirmasiOlustur,
>   testVerisiniTemizle,
>   baglantiyiKapat,
>   type TestFirmasi,
> } from "../test-destek/veri.ts";
> import { tenantaBagliDb, type TenantDb } from "./tenant.ts";
> import { aktifAbonelikVarMi } from "./abonelik-kontrol.ts";
>
> let A: TestFirmasi;
> let B: TestFirmasi;
> let dbA: TenantDb;
> let dbB: TenantDb;
>
> before(async () => {
>   A = await testFirmasiOlustur("a");
>   B = await testFirmasiOlustur("b");
>   dbA = tenantaBagliDb(A.tenantId);
>   dbB = tenantaBagliDb(B.tenantId);
> });
>
> after(async () => {
>   try {
>     await testVerisiniTemizle();
>   } finally {
>     await baglantiyiKapat();
>   }
> });
>
> describe("Müşteriler", () => {
>   test("liste yalnızca A'nın müşterilerini getirir", async () => {
>     const liste = await dbA.customer.findMany({ select: { id: true, tenantId: true } });
>     const idler = liste.map((m) => m.id);
>     assert.ok(liste.every((m) => m.tenantId === A.tenantId), "Listede başka firmanın kaydı var.");
>     assert.ok(idler.includes(A.abonelikliMusteriId));
>     assert.ok(!idler.includes(B.abonelikliMusteriId));
>     assert.ok(!idler.includes(B.bosMusteriId));
>   });
>
>   test("B'nin müşterisi kimlikle aranınca bulunamaz (findFirst ve findUnique)", async () => {
>     assert.equal(await dbA.customer.findFirst({ where: { id: B.bosMusteriId } }), null);
>     assert.equal(await dbA.customer.findUnique({ where: { id: B.bosMusteriId } }), null);
>   });
>
>   test("B'nin müşterisi güncellenemez ve pasife alınamaz, kaydı değişmez", async () => {
>     // musteriGuncelle ve pasife alma işlemlerinin kullandığı sorgu biçimi.
>     const ad = await dbA.customer.updateMany({
>       where: { id: B.bosMusteriId },
>       data: { name: "degistirildi" },
>     });
>     const pasif = await dbA.customer.updateMany({
>       where: { id: B.bosMusteriId, isActive: true },
>       data: { isActive: false },
>     });
>     assert.equal(ad.count, 0);
>     assert.equal(pasif.count, 0);
>
>     const kayit = await dbB.customer.findFirst({
>       where: { id: B.bosMusteriId },
>       select: { name: true, isActive: true },
>     });
>     assert.ok(kayit, "B'nin müşterisi kaybolmuş.");
>     assert.notEqual(kayit.name, "degistirildi");
>     assert.equal(kayit.isActive, true);
>   });
>
>   test("eklerken gönderilen B tenantId'si yok sayılır, kayıt A'ya yazılır", async () => {
>     const yeni = await dbA.customer.create({
>       data: { tenantId: B.tenantId, name: "Test Yanlış Firma Denemesi" },
>       select: { id: true, tenantId: true },
>     });
>     assert.equal(yeni.tenantId, A.tenantId);
>     assert.equal(await dbB.customer.findFirst({ where: { id: yeni.id } }), null);
>   });
> });
>
> describe("Planlar", () => {
>   test("liste yalnızca A'nın planlarını getirir", async () => {
>     const liste = await dbA.plan.findMany({ select: { id: true, tenantId: true } });
>     const idler = liste.map((p) => p.id);
>     assert.ok(liste.every((p) => p.tenantId === A.tenantId), "Listede başka firmanın kaydı var.");
>     assert.ok(!idler.includes(B.abonelikliPlanId));
>     assert.ok(!idler.includes(B.bosPlanId));
>   });
>
>   test("B'nin planı kimlikle aranınca bulunamaz", async () => {
>     assert.equal(await dbA.plan.findFirst({ where: { id: B.bosPlanId } }), null);
>     assert.equal(await dbA.plan.findUnique({ where: { id: B.bosPlanId } }), null);
>   });
>
>   test("B'nin planı güncellenemez ve pasife alınamaz, kaydı değişmez", async () => {
>     const sonuc = await dbA.plan.updateMany({
>       where: { id: B.bosPlanId },
>       data: { price: 1, isActive: false },
>     });
>     assert.equal(sonuc.count, 0);
>
>     const kayit = await dbB.plan.findFirst({
>       where: { id: B.bosPlanId },
>       select: { price: true, isActive: true },
>     });
>     assert.ok(kayit, "B'nin planı kaybolmuş.");
>     assert.equal(kayit.price, PLAN_FIYATI);
>     assert.equal(kayit.isActive, true);
>   });
> });
>
> describe("Abonelikler ve olaylar", () => {
>   test("liste yalnızca A'nın aboneliklerini getirir", async () => {
>     const liste = await dbA.subscription.findMany({ select: { id: true, tenantId: true } });
>     assert.ok(liste.every((s) => s.tenantId === A.tenantId), "Listede başka firmanın kaydı var.");
>     assert.ok(!liste.some((s) => s.id === B.abonelikId));
>   });
>
>   test("B'nin aboneliği kimlikle aranınca bulunamaz", async () => {
>     // abonelikYenile işlemindeki sorgu biçimi (plana iç içe bakış dahil).
>     const abonelik = await dbA.subscription.findFirst({
>       where: { id: B.abonelikId },
>       select: { status: true, plan: { select: { interval: true } } },
>     });
>     assert.equal(abonelik, null);
>   });
>
>   test("işlem (transaction) içinde de B'nin aboneliği iptal edilemez ve yenilenemez", async () => {
>     // Tenant filtresinin $transaction içindeki "tx" sorgularına da uygulandığını gösterir.
>     const iptal = await dbA.$transaction(async (tx) =>
>       tx.subscription.updateMany({
>         where: { id: B.abonelikId, status: "ACTIVE" },
>         data: { status: "CANCELED", canceledAt: new Date() },
>       })
>     );
>     const yenile = await dbA.$transaction(async (tx) =>
>       tx.subscription.updateMany({
>         where: { id: B.abonelikId, status: "ACTIVE" },
>         data: { currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
>       })
>     );
>     assert.equal(iptal.count, 0);
>     assert.equal(yenile.count, 0);
>
>     const kayit = await dbB.subscription.findFirst({
>       where: { id: B.abonelikId },
>       select: { status: true },
>     });
>     assert.equal(kayit?.status, "ACTIVE");
>   });
>
>   test("A adına B'nin müşterisi ve planıyla abonelik oluşturulamaz (veritabanı reddeder)", async () => {
>     await assert.rejects(
>       dbA.subscription.create({
>         data: {
>           tenantId: A.tenantId,
>           customerId: B.bosMusteriId,
>           planId: B.bosPlanId,
>           status: "ACTIVE",
>           currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
>         },
>       })
>     );
>     // B'nin boş müşterisinin hâlâ hiç aboneliği yok.
>     assert.equal(await dbB.subscription.count({ where: { customerId: B.bosMusteriId } }), 0);
>   });
>
>   test("A adına B'nin aboneliğine olay yazılamaz (veritabanı reddeder)", async () => {
>     await assert.rejects(
>       dbA.subscriptionEvent.create({
>         data: { tenantId: A.tenantId, subscriptionId: B.abonelikId, type: "RENEWED" },
>       })
>     );
>     // B'nin aboneliğinde yalnızca başlangıç olayı var.
>     assert.equal(await dbB.subscriptionEvent.count({ where: { subscriptionId: B.abonelikId } }), 1);
>   });
>
>   test("aktifAbonelikVarMi, A adına sorulunca B'nin aboneliklerini saymaz", async () => {
>     assert.equal(await aktifAbonelikVarMi({ musteriId: B.abonelikliMusteriId }, dbA), false);
>     assert.equal(await aktifAbonelikVarMi({ planId: B.abonelikliPlanId }, dbA), false);
>     // Karşılaştırma: B adına sorulunca aynı kayıtlar sayılır (test verisi doğru mu?).
>     assert.equal(await aktifAbonelikVarMi({ musteriId: B.abonelikliMusteriId }, dbB), true);
>     assert.equal(await aktifAbonelikVarMi({ planId: B.abonelikliPlanId }, dbB), true);
>   });
> });
>
> describe("Firma tablosu", () => {
>   test("A yalnızca kendi firmasını görür", async () => {
>     const firmalar = await dbA.tenant.findMany({ select: { id: true } });
>     assert.deepEqual(firmalar.map((f) => f.id), [A.tenantId]);
>   });
>
>   // Gün 12 (bulgu B6, issue #24): "where" içinde başka bir firmanın kimliği istenirse
>   // kimlik artık oturumdaki firmayla EZİLMEZ; ikisi AND içinde birlikte uygulanır ve
>   // sonuç "bulunamadı" olur. Eskiden bu istekler sessizce A'nın kendi kaydına dönüyordu.
>
>   test("B'nin kimliğiyle okuma: bulunamaz (findFirst, findUnique, findMany, count)", async () => {
>     assert.equal(await dbA.tenant.findFirst({ where: { id: B.tenantId } }), null);
>     assert.equal(await dbA.tenant.findUnique({ where: { id: B.tenantId } }), null);
>     assert.deepEqual(await dbA.tenant.findMany({ where: { id: B.tenantId } }), []);
>     assert.equal(await dbA.tenant.count({ where: { id: B.tenantId } }), 0);
>   });
>
>   test("B'nin kimliğiyle findFirstOrThrow ve findUniqueOrThrow reddedilir", async () => {
>     await assert.rejects(dbA.tenant.findFirstOrThrow({ where: { id: B.tenantId } }));
>     await assert.rejects(dbA.tenant.findUniqueOrThrow({ where: { id: B.tenantId } }));
>   });
>
>   test("kendi kimliğiyle okuma ve güncelleme çalışır (cac-ayari.ts akışı)", async () => {
>     const firma = await dbA.tenant.findUnique({
>       where: { id: A.tenantId },
>       select: { id: true },
>     });
>     assert.equal(firma?.id, A.tenantId);
>
>     await dbA.tenant.update({
>       where: { id: A.tenantId },
>       data: { cac: 1234 },
>       select: { id: true },
>     });
>     assert.equal((await dbA.tenant.findFirst({ select: { cac: true } }))?.cac, 1234);
>
>     // Sonraki testler A'nın CAC'sinin 0 olduğunu varsayar: geri alınır.
>     await dbA.tenant.update({
>       where: { id: A.tenantId },
>       data: { cac: 0 },
>       select: { id: true },
>     });
>     assert.equal((await dbA.tenant.findFirst({ select: { cac: true } }))?.cac, 0);
>   });
>
>   test("A, B'nin firma ayarını (CAC) değiştiremez: istek reddedilir, iki firma da değişmez", async () => {
>     await assert.rejects(
>       dbA.tenant.update({ where: { id: B.tenantId }, data: { cac: 999 } })
>     );
>     // Eskiden bu istek A'nın kendi kaydına uygulanıyordu. Artık ikisi de değişmez.
>     assert.equal((await dbA.tenant.findFirst({ select: { cac: true } }))?.cac, 0);
>     assert.equal((await dbB.tenant.findFirst({ select: { cac: true } }))?.cac, 0);
>   });
>
>   test("kimlik nesne olarak verilirse (in, equals, not) oturumdaki firmayla birlikte uygulanır", async () => {
>     // in: B'yi de içeren liste yalnızca A'yı döner; yalnızca B'yi içeren liste boş döner.
>     const ikisi = await dbA.tenant.findMany({
>       where: { id: { in: [A.tenantId, B.tenantId] } },
>       select: { id: true },
>     });
>     assert.deepEqual(ikisi.map((f) => f.id), [A.tenantId]);
>     assert.deepEqual(await dbA.tenant.findMany({ where: { id: { in: [B.tenantId] } } }), []);
>
>     // equals: B bulunamaz, A bulunur.
>     assert.equal(await dbA.tenant.findFirst({ where: { id: { equals: B.tenantId } } }), null);
>     const esit = await dbA.tenant.findFirst({
>       where: { id: { equals: A.tenantId } },
>       select: { id: true },
>     });
>     assert.equal(esit?.id, A.tenantId);
>
>     // not: "B olmayan" A'yı bulur; "A olmayan" hiçbirini bulmaz (B'ye kaçmaz).
>     const bOlmayan = await dbA.tenant.findFirst({
>       where: { id: { not: B.tenantId } },
>       select: { id: true },
>     });
>     assert.equal(bOlmayan?.id, A.tenantId);
>     assert.equal(await dbA.tenant.findFirst({ where: { id: { not: A.tenantId } } }), null);
>     assert.equal(await dbA.tenant.count({ where: { id: { not: A.tenantId } } }), 0);
>   });
>
>   test("koşulda önceden bulunan AND korunur", async () => {
>     const adA = `${CALISMA}-a`;
>     const adB = `${CALISMA}-b`;
>
>     // id yokken: AND aynen uygulanır.
>     const aBulundu = await dbA.tenant.findFirst({ where: { AND: { name: adA } }, select: { id: true } });
>     assert.equal(aBulundu?.id, A.tenantId);
>     assert.equal(await dbA.tenant.findFirst({ where: { AND: { name: adB } } }), null);
>
>     // id varken: önceki AND (tek nesne ya da liste) silinmez, yeni koşul eklenir.
>     // AND silinseydi "B olmayan" koşulu A'yı bulurdu.
>     assert.equal(
>       await dbA.tenant.findFirst({ where: { id: { not: B.tenantId }, AND: { name: adB } } }),
>       null
>     );
>     assert.equal(
>       await dbA.tenant.findFirst({ where: { id: { not: B.tenantId }, AND: [{ name: adB }] } }),
>       null
>     );
>     assert.equal(await dbA.tenant.findFirst({ where: { id: B.tenantId, AND: { name: adA } } }), null);
>   });
>
>   test("firma eklenemez ve silinemez", async () => {
>     await assert.rejects(
>       dbA.tenant.create({ data: { name: `${CALISMA}-sizinti` } }),
>       /izin verilmez/
>     );
>     await assert.rejects(dbA.tenant.deleteMany({}), /izin verilmez/);
>   });
> });
>
> describe("Filtre korumaları", () => {
>   test("güncelleme verisinde tenantId varsa işlem durdurulur", async () => {
>     await assert.rejects(
>       dbA.customer.updateMany({
>         where: { id: A.bosMusteriId },
>         data: { tenantId: B.tenantId },
>       }),
>       /tenantId değiştirilemez/
>     );
>     assert.notEqual(await dbA.customer.findFirst({ where: { id: A.bosMusteriId } }), null);
>   });
>
>   // Gün 6 düzeltmesi (beyaz liste): ekleme ve güncellemede yalnızca tablonun kendi
>   // sütunları yazılabilir. Aşağıdaki üç test, ilişki alanlarının reddedildiğini gösterir.
>
>   test("ilişki alanıyla güncelleme reddedilir (tenant: connect)", async () => {
>     await assert.rejects(
>       dbA.customer.update({
>         where: { id: A.bosMusteriId },
>         data: { tenant: { connect: { id: B.tenantId } } },
>       }),
>       /"tenant" alanı bu işlemde kullanılamaz/
>     );
>   });
>
>   test("ilişki alanıyla ekleme reddedilir (tenant: connect), hiçbir firmada kayıt oluşmaz", async () => {
>     const ad = "Test İlişkili Ekleme Denemesi";
>     await assert.rejects(
>       dbA.customer.create({
>         data: { name: ad, tenant: { connect: { id: B.tenantId } } },
>       }),
>       /"tenant" alanı bu işlemde kullanılamaz/
>     );
>     assert.equal(await dbA.customer.count({ where: { name: ad } }), 0);
>     assert.equal(await dbB.customer.count({ where: { name: ad } }), 0);
>   });
>
>   test("iç içe yazma reddedilir (subscriptions: connect), B'nin aboneliği yerinde kalır", async () => {
>     // Saldırı örneği: B'nin aboneliğini A'nın müşterisine bağlamaya çalışmak.
>     await assert.rejects(
>       dbA.customer.update({
>         where: { id: A.bosMusteriId },
>         data: { subscriptions: { connect: { id: B.abonelikId } } },
>       }),
>       /"subscriptions" alanı bu işlemde kullanılamaz/
>     );
>     const kayit = await dbB.subscription.findFirst({
>       where: { id: B.abonelikId },
>       select: { customerId: true },
>     });
>     assert.equal(kayit?.customerId, B.abonelikliMusteriId);
>   });
>
>   // 11. test (Gün 6'da açığı bulan test): ilk çalıştırmada BAŞARISIZ oldu ve kaydın
>   // başka firmaya taşınabildiğini gösterdi. tenant.ts düzeltmesinden sonra geçer.
>   // Etkiyi kontrol eder: hata verse de vermese de kayıt A'da kalmalı.
>   test("kayıt ilişki üzerinden (tenant: connect) başka firmaya taşınamaz", async () => {
>     try {
>       await dbA.customer.update({
>         where: { id: A.bosMusteriId },
>         data: { tenant: { connect: { id: B.tenantId } } },
>       });
>     } catch {
>       // Düzeltmeden sonra beklenen: işlem reddedilir. Amaç kaydın taşınmaması.
>     }
>     const adaKaldi = await dbA.customer.findFirst({ where: { id: A.bosMusteriId } });
>     const bye = await dbB.customer.findFirst({ where: { id: A.bosMusteriId } });
>     assert.notEqual(adaKaldi, null, "A'nın müşterisi A'da görünmüyor: kayıt taşınmış olabilir.");
>     assert.equal(bye, null, "A'nın müşterisi B'de görünüyor: kayıt başka firmaya taşındı.");
>   });
> });
>
> // Gün 7 (inceleme bulgusu D2): iş kuralına göre müşteri, plan, abonelik ve olay
> // kayıtları silinmez. Filtre bu tablolarda silmeyi veritabanına gitmeden durdurur.
> // Testler A'nın KENDİ kayıtlarıyla yapılır: kendi firmasında bile silme yasaktır.
> // Koşullar dar tutulur (tek kimlik): koruma bozuksa bile zarar test verisiyle sınırlı kalır.
> describe("Silme koruması", () => {
>   test("müşteri, plan, abonelik ve olaylarda deleteMany reddedilir, kayıtlar yerinde kalır", async () => {
>     await assert.rejects(
>       dbA.customer.deleteMany({ where: { id: A.bosMusteriId } }),
>       /"Customer" tablosunda "deleteMany" işlemine izin verilmez: kayıtlar silinmez, pasife alınır/
>     );
>     await assert.rejects(
>       dbA.plan.deleteMany({ where: { id: A.bosPlanId } }),
>       /"Plan" tablosunda "deleteMany" işlemine izin verilmez: kayıtlar silinmez, pasife alınır/
>     );
>     await assert.rejects(
>       dbA.subscription.deleteMany({ where: { id: A.abonelikId } }),
>       /"Subscription" tablosunda "deleteMany" işlemine izin verilmez: abonelikler silinmez, iptal edilir/
>     );
>     await assert.rejects(
>       dbA.subscriptionEvent.deleteMany({ where: { subscriptionId: A.abonelikId } }),
>       /"SubscriptionEvent" tablosunda "deleteMany" işlemine izin verilmez: olay kayıtları silinmez/
>     );
>
>     // Etki kontrolü: kayıtların hepsi hâlâ yerinde.
>     assert.equal(await dbA.customer.count({ where: { id: A.bosMusteriId } }), 1);
>     assert.equal(await dbA.plan.count({ where: { id: A.bosPlanId } }), 1);
>     assert.equal(await dbA.subscription.count({ where: { id: A.abonelikId } }), 1);
>     assert.equal(
>       await dbA.subscriptionEvent.count({ where: { subscriptionId: A.abonelikId } }),
>       1
>     );
>   });
>
>   test("tek kayıt silme (delete) de reddedilir, kayıtlar yerinde kalır", async () => {
>     const olay = await dbA.subscriptionEvent.findFirst({
>       where: { subscriptionId: A.abonelikId },
>       select: { id: true },
>     });
>     assert.ok(olay, "Test verisinde A'nın başlangıç olayı bulunamadı.");
>
>     await assert.rejects(
>       dbA.customer.delete({ where: { id: A.bosMusteriId } }),
>       /kayıtlar silinmez, pasife alınır/
>     );
>     await assert.rejects(
>       dbA.plan.delete({ where: { id: A.bosPlanId } }),
>       /kayıtlar silinmez, pasife alınır/
>     );
>     await assert.rejects(
>       dbA.subscription.delete({ where: { id: A.abonelikId } }),
>       /abonelikler silinmez, iptal edilir/
>     );
>     await assert.rejects(
>       dbA.subscriptionEvent.delete({ where: { id: olay.id } }),
>       /olay kayıtları silinmez/
>     );
>
>     assert.equal(await dbA.customer.count({ where: { id: A.bosMusteriId } }), 1);
>     assert.equal(await dbA.plan.count({ where: { id: A.bosPlanId } }), 1);
>     assert.equal(await dbA.subscription.count({ where: { id: A.abonelikId } }), 1);
>     assert.equal(await dbA.subscriptionEvent.count({ where: { id: olay.id } }), 1);
>   });
>
>   test("kullanıcı (User) tablosunda silme filtre tarafından engellenmez", async () => {
>     // Var olmayan bir kimlikle denenir: hiçbir kullanıcı silinmez, yalnızca
>     // filtrenin bu işlemi durdurmadığı görülür.
>     const sonuc = await dbA.user.deleteMany({ where: { id: "olmayan-kullanici" } });
>     assert.equal(sonuc.count, 0);
>   });
> });
> ```
>
> ### B6 kontrolleri ve commit
>
> Neon test dalındaki testleri çalıştırır (yeni Firma tablosu testleri dahil, hepsi geçmeli):
> ```zsh
> npm run test:db
> ```
>
> Veritabanısız testleri çalıştırır (bu commit'te değişmeyen testlerin hâlâ geçtiğini gösterir):
> ```zsh
> npm test
> ```
>
> Kod biçimi kurallarını denetler:
> ```zsh
> npm run lint
> ```
>
> Derler ve tip kontrolü yapar (yeni testlerdeki sorgu biçimleri de kontrol edilir):
> ```zsh
> npm run build
> ```
>
> İki dosyayı commit'e hazırlar:
> ```zsh
> git add src/lib/tenant.ts src/lib/tenant.test.ts
> ```
>
> Parola deseni taraması (çıktı boş olmalı):
> ```zsh
> git --no-pager grep --cached -c -E "npg_[A-Za-z0-9]{6,}"
> ```
>
> Sunucu adı taraması (sonuç 0 olmalı):
> ```zsh
> git --no-pager grep --cached -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
> ```
>
> Ad taraması (sonuç 0 olmalı):
> ```zsh
> git --no-pager grep --cached -h -i -E "[AD_DESENI]" | sed 's/ozgesoganci1-bot//Ig' | grep -ic -E "[AD_DESENI]"
> ```
>
> Commit'e yalnızca bu iki dosyanın girdiğini gösterir:
> ```zsh
> git status --short
> ```
>
> B6'yı commit eder:
> ```zsh
> git commit -m "fix: firma tablosunda başka kimlik istenince bulunamadı döner (B6, #24)" -m $'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01ERuUmicCCSJwyX4zWam3oq'
> ```
>
> ## 3. Commit 2: B10 (güvenlik başlıkları)
>
> Yeni test dosyasını boş açar:
> ```zsh
> touch src/test-destek/guvenlik-basliklari.test.ts
> ```
>
> ### `next.config.ts`: dosyanın içeriğini tamamen şununla değiştir
>
> ```ts
> import type { NextConfig } from "next";
>
> // GÜVENLİK BAŞLIKLARI (Gün 12, bulgu B10)
> // Bütün yanıtlara (sayfalar, sunucu işlemleri, /api/events dahil) eklenir.
> //
> // - X-Frame-Options ve CSP frame-ancestors: site başka bir sayfanın içine çerçeve
> //   olarak gömülemez (tıklama tuzağı). İkisi birlikte: eski ve yeni tarayıcılar için.
> //   CSP'de BİLEREK yalnızca frame-ancestors vardır. Betik ve bağlantı kuralı yoktur:
> //   Next.js'in satır içi betikleri ve geliştirme modunun anında yenileme (HMR)
> //   bağlantısı etkilenmez. Tam CSP 2 haftalık kapsam için ağır bulundu (ADR, Gün 12).
> // - X-Content-Type-Options: tarayıcı dosya türünü tahmin etmez. SSE yanıtının türü
> //   (text/event-stream) route içinde açıkça yazıldığı için etkilenmez.
> // - Referrer-Policy: başka sitelere giden isteklerde tam adres gönderilmez.
> // - Permissions-Policy: uygulamanın kullanmadığı kamera, mikrofon ve konum kapalı.
> // HSTS (Strict-Transport-Security) BİLEREK eklenmedi (ADR, Gün 12).
> const guvenlikBasliklari = [
>   { key: "X-Frame-Options", value: "DENY" },
>   { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
>   { key: "X-Content-Type-Options", value: "nosniff" },
>   { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
>   { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
> ];
>
> const nextConfig: NextConfig = {
>   // Yanıtlarda "X-Powered-By: Next.js" başlığı gönderilmez (Gün 12, B10).
>   poweredByHeader: false,
>
>   async headers() {
>     return [
>       {
>         // "/:path*" kök adres (/) dahil bütün yolları kapsar.
>         source: "/:path*",
>         headers: guvenlikBasliklari,
>       },
>     ];
>   },
>
>   turbopack: {
>     rules: {
>       "*.css": {
>         loaders: ["@tailwindcss/turbopack"],
>         as: "*.css",
>       },
>     },
>   },
> };
>
> export default nextConfig;
> ```
>
> ### `src/test-destek/guvenlik-basliklari.test.ts` (yeni dosya, aşağıdakini yapıştır)
>
> ```ts
> // GÜVENLİK BAŞLIKLARI TESTİ (Gün 12, bulgu B10)
> //
> // next.config.ts dosyasındaki ayarları doğrudan okur. Next.js sunucusu ve veritabanı
> // gerekmez: next.config.ts çalışma anında yalnızca bir tür (type) içe aktarır.
> // Başlıkların gerçek yanıtlarda göründüğü ayrıca elle curl ile kontrol edilir.
> // Çalıştırmak için: npm test
>
> import { test } from "node:test";
> import assert from "node:assert/strict";
> import nextConfig from "../../next.config.ts";
>
> // Beklenen başlıklar ve değerleri. Sıra da önemlidir: değişiklik bilinçli yapılmalı.
> const BEKLENEN = [
>   { key: "X-Frame-Options", value: "DENY" },
>   { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
>   { key: "X-Content-Type-Options", value: "nosniff" },
>   { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
>   { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
> ];
>
> test("X-Powered-By başlığı kapalıdır", () => {
>   assert.equal(nextConfig.poweredByHeader, false);
> });
>
> test("güvenlik başlıkları bütün yollara beklenen değerlerle uygulanır", async () => {
>   const kurallar = await nextConfig.headers?.();
>   assert.ok(kurallar, "headers() ayarı bulunamadı.");
>   assert.equal(kurallar.length, 1);
>   assert.equal(kurallar[0].source, "/:path*");
>   assert.deepEqual(kurallar[0].headers, BEKLENEN);
> });
>
> test("HSTS bilerek eklenmemiştir ve CSP yalnızca frame-ancestors içerir", async () => {
>   const kurallar = (await nextConfig.headers?.()) ?? [];
>   const basliklar = kurallar.flatMap((k) => k.headers);
>   const adlar = basliklar.map((b) => b.key.toLowerCase());
>   assert.ok(!adlar.includes("strict-transport-security"), "HSTS eklenmiş.");
>
>   const csp = basliklar.find((b) => b.key === "Content-Security-Policy");
>   assert.equal(csp?.value, "frame-ancestors 'none'");
> });
> ```
>
> ### package.json: yalnızca `test` satırı
>
> `test` satırının sonuna başlık testini ekler:
> ```zsh
> perl -pi -e 's#src/lib/giris-siniri\.test\.ts"#src/lib/giris-siniri.test.ts src/test-destek/guvenlik-basliklari.test.ts"#' package.json
> ```
>
> Yalnızca `test` satırının değiştiğini gösterir (1 satır `-`, 1 satır `+`):
> ```zsh
> git --no-pager diff package.json
> ```
>
> ### B10 kontrolleri ve commit
>
> Veritabanısız testleri çalıştırır (yeni 3 başlık testi dahil):
> ```zsh
> npm test
> ```
>
> Kod biçimi kurallarını denetler:
> ```zsh
> npm run lint
> ```
>
> Derler; `next.config.ts` hatalıysa burada görülür:
> ```zsh
> npm run build
> ```
>
> Üç dosyayı commit'e hazırlar:
> ```zsh
> git add next.config.ts src/test-destek/guvenlik-basliklari.test.ts package.json
> ```
>
> Parola deseni taraması (çıktı boş olmalı):
> ```zsh
> git --no-pager grep --cached -c -E "npg_[A-Za-z0-9]{6,}"
> ```
>
> Sunucu adı taraması (sonuç 0 olmalı):
> ```zsh
> git --no-pager grep --cached -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
> ```
>
> Ad taraması (sonuç 0 olmalı):
> ```zsh
> git --no-pager grep --cached -h -i -E "[AD_DESENI]" | sed 's/ozgesoganci1-bot//Ig' | grep -ic -E "[AD_DESENI]"
> ```
>
> Commit'e yalnızca bu üç dosyanın girdiğini gösterir:
> ```zsh
> git status --short
> ```
>
> B10'u commit eder:
> ```zsh
> git commit -m "fix: güvenlik başlıkları eklendi, X-Powered-By kapatıldı (B10)" -m $'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01ERuUmicCCSJwyX4zWam3oq'
> ```
>
> ## 4. Commit 3: B12 (npm audit fix)
>
> Bilinen açığı, `package.json`'daki sürüm aralıklarının izin verdiği ölçüde düzeltir (`--force` yok):
> ```zsh
> npm audit fix
> ```
>
> Hangi dosyaların değiştiğini gösterir (**yalnızca** `M package-lock.json` görünmeli):
> ```zsh
> git status --short
> ```
>
> **`package.json` listede görünürse burada dur ve çıktıyı bana gönder.**
>
> Kilit dosyasında sürümü değişen paketleri gösterir (her `-`/`+` `"version"` satırının hemen üstündeki `"node_modules/..."` satırı paketin adıdır):
> ```zsh
> git --no-pager diff -U3 package-lock.json | grep -E '"node_modules/|^[-+] *"version"'
> ```
>
> **Sürümü değişen paketler yalnızca `fast-uri` ve `ajv` olmalı. Başka bir paketin adının altında `-`/`+` sürüm satırı varsa burada dur ve çıktıyı bana gönder.**
>
> `fast-uri`'nin yeni sürümünü gösterir (3.1.8'den büyük olmalı):
> ```zsh
> npm ls fast-uri
> ```
>
> Canlıya giden paketlerde açık kalmadığını doğrular (0 açık):
> ```zsh
> npm audit --omit=dev
> ```
>
> Veritabanısız testleri yeni kilit dosyasıyla çalıştırır:
> ```zsh
> npm test
> ```
>
> Neon test dalındaki testleri yeni kilit dosyasıyla çalıştırır:
> ```zsh
> npm run test:db
> ```
>
> Kod biçimi kurallarını denetler:
> ```zsh
> npm run lint
> ```
>
> Derler:
> ```zsh
> npm run build
> ```
>
> Yalnızca kilit dosyasını commit'e hazırlar:
> ```zsh
> git add package-lock.json
> ```
>
> Parola deseni taraması (çıktı boş olmalı):
> ```zsh
> git --no-pager grep --cached -c -E "npg_[A-Za-z0-9]{6,}"
> ```
>
> Sunucu adı taraması (sonuç 0 olmalı):
> ```zsh
> git --no-pager grep --cached -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
> ```
>
> Ad taraması (sonuç 0 olmalı):
> ```zsh
> git --no-pager grep --cached -h -i -E "[AD_DESENI]" | sed 's/ozgesoganci1-bot//Ig' | grep -ic -E "[AD_DESENI]"
> ```
>
> Commit'e yalnızca kilit dosyasının girdiğini gösterir:
> ```zsh
> git status --short
> ```
>
> B12'yi commit eder:
> ```zsh
> git commit -m "fix: npm audit fix ile fast-uri güncellendi (B12)" -m $'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01ERuUmicCCSJwyX4zWam3oq'
> ```
>
> Dalda üç commit olduğunu gösterir:
> ```zsh
> git --no-pager log --oneline main..HEAD
> ```
>
> ## 5. Elle deneme (dev:test)
>
> Uygulamayı Neon test dalında açar:
> ```zsh
> npm run dev:test
> ```
>
> **Başlıklar** (yeni bir Terminal sekmesinde, **Cmd+T**):
>
> Giriş sayfasının yanıt başlıklarını gösterir; beş başlık görünmeli, `X-Powered-By` görünmemeli:
> ```zsh
> curl -s -D - -o /dev/null http://localhost:3000/giris
> ```
>
> Oturumsuz SSE isteğinin başlıklarını gösterir; `401` ile birlikte beş başlık görünmeli:
> ```zsh
> curl -s -D - -o /dev/null http://localhost:3000/api/events
> ```
>
> Port 3000 değilse `dev:test` çıktısında yazan adresi kullan.
>
> **Tarayıcıda:**
> 1. Test hesabınla giriş yap.
> 2. **Ayarlar (CAC):** Ayarlar sayfasında CAC'yi örneğin `5000` olarak kaydet. "CAC 5.000 TL olarak kaydedildi." mesajı çıkmalı; sayfayı yenileyince değer `5000` kalmalı; Dashboard'da LTV/CAC hesaplanmalı. Bu, `cac-ayari.ts`'in kendi kimliğiyle `update` yolunun yeni kuralla çalıştığını gösterir. Sonra istersen eski değerine geri kaydet.
> 3. **SSE:** Bir sekmede Dashboard açıkken başka bir sekmede bir aboneliği iptal et. İlk sekmede canlı uyarı bandı çıkmalı.
> 4. **HMR:** VS Code'da herhangi bir sayfa dosyasında bir yorumu değiştirip kaydet (**Cmd+S**), sayfa kendiliğinden yenilenmeli. Sonra değişikliği geri al (**Cmd+Z**, **Cmd+S**) ve `git status --short` ile çalışma alanının temiz olduğunu kontrol et.
> 5. **Çerçeve:** Tarayıcıda geliştirici araçlarını aç (**Cmd+Option+I**), Network sekmesinde sayfa isteğine tıkla, Response Headers'ta `x-frame-options: DENY` ve `content-security-policy: frame-ancestors 'none'` görünmeli.
>
> Sunucuyu durdurur (Terminal'de):
> **Control+C**
>
> ## 6. PR
>
> GitHub Desktop'ta **Publish branch**, ardından **Create Pull Request**.
>
> - **Başlık:** `fix: güvenlik gözden geçirme düzeltmeleri`
> - **Açıklama:**
>
> ```
> Gün 12 güvenlik gözden geçirmesi, Parça 2.
>
> - B6: Firma tablosunda başka bir firmanın kimliği istenince artık "bulunamadı" döner (okumada null/boş, güncellemede hata). Kimlik nesne olarak verildiğinde (in, equals, not) de oturumdaki firmayla AND içinde uygulanır. Closes #24
> - B10: Güvenlik başlıkları (X-Frame-Options, CSP frame-ancestors, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) ve X-Powered-By kapatıldı. HSTS bilerek eklenmedi.
> - B12: npm audit fix, yalnızca package-lock.json (fast-uri, ajv).
>
> 🤖 Generated with [Claude Code](https://claude.com/claude-code)
>
> https://claude.ai/code/session_01ERuUmicCCSJwyX4zWam3oq
> ```
>
> `Closes #24` satırı, PR birleştirilince issue #24'ü GitHub'da otomatik kapatır.
>
> Birleştirmeden sonra canlıda başlıkları gösterir (Render adresini yaz):
> ```zsh
> curl -s -D - -o /dev/null https://[RENDER_ADRESI]/giris
> ```
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **Prisma ile `AND`:** `findUnique`, `findUniqueOrThrow` ve `update`'in `where` içinde `id` yanında `AND` kabul ettiğini varsaydım. Prisma 7.10'da bunu çalıştıramadım. `npm run test:db` veya `npm run build` (tip kontrolü) bu satırlarda hata verirse çıktıyı gönder; `update` için önce `findFirst` ile kontrol eden bir yola geçeriz.
> - **`update` hatası:** B'nin kimliğiyle `update` Prisma'nın "kayıt bulunamadı" hatasını fırlatıyor varsaydım. Test yalnızca reddedildiğine bakıyor, hata metnine değil.
> - **Test sırası:** "kendi kimliğiyle güncelleme" testi A'nın CAC'sini 1234 yapıp 0'a geri alıyor; sonraki test 0 bekliyor. `node:test` bir dosyadaki testleri sırayla çalıştırdığı için bu güvenli.
> - **Next.js 16 `headers()`:** Ayarın route handler yanıtlarına da (SSE dahil) uygulandığını varsaydım. 5. adımdaki `curl` komutları bunu doğrulayacak. Bir başlık iki kez görünürse ya da hiç görünmezse çıktıyı gönder.
> - **B12:** Prisma'nın sürüm aralığı yeni `fast-uri`'ye izin vermezse `npm audit fix` hiçbir şeyi değiştirmeyebilir. Bu durumda `git status` boş çıkar; commit 3'ü atlayıp bulguyu ADR'de "Prisma güncellemesini bekliyor" olarak yazarız.
> - **Diff komutu (B12):** `-U3` ile her sürüm satırının üstünde paketin adının göründüğünü varsaydım. Bir pakette adı göremezsen, o satırın tam çıktısını gönder; birlikte bakarız.

### Prompt 7 · 24 Eki 2026 15:47

````text
kullanici@bilgisayar abonetakip % git --no-pager diff -U3 package-lock.json | grep -E '"node_modules/|^[-+] *"version"'
     "node_modules/fast-uri": {
-      "version": "3.1.8",
+      "version": "3.1.9",
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 7 · 24 Eki 2026 15:48

> Çıktı temiz: sürümü değişen tek paket `fast-uri` (3.1.8 → 3.1.9). `ajv` hiç değişmemiş, başka paket de yok. Bu, izin verdiğin sınırın içinde, devam edebilirsin.
>
> `git status --short` çıktısında yalnızca `M package-lock.json` gördüysen, B12 adımlarına kaldığın yerden devam et:
>
> `fast-uri`'nin yeni sürümünü gösterir (`3.1.9` görünmeli):
> ```zsh
> npm ls fast-uri
> ```
>
> Canlıya giden paketlerde açık kalmadığını doğrular (0 açık):
> ```zsh
> npm audit --omit=dev
> ```
>
> Sonra planın 4. bölümündeki sırayla `npm test`, `npm run test:db`, `npm run lint`, `npm run build`, `git add package-lock.json`, üç tarama, `git status --short` ve B12 commit'i.
>
> İki küçük not:
>
> - `npm audit --omit=dev` yine `fast-uri` gösterirse çıktıyı gönder; 3.1.9'un açığı kapatan sürüm olduğunu varsaydım, bunu buradan doğrulayamıyorum.
> - Prompt günlüğüne bu çıktıyı yapıştırırken Terminal satırının başındaki kullanıcı adını maskele; o satır ad taramasına takılır.

### Prompt 8 · 24 Eki 2026 15:54

````text
assert.ok(olay, "Test verisinde A'nın başlangıç olayı bulunamadı.");
    
    await assert.rejects(                                    
      dbA.customer.delete({ where: { id: A.bosMusteriId } }),
      /kayıtlar silinmez, pasife alınır/              
    );                                                
    await assert.rejects(                             
      dbA.plan.delete({ where: { id: A.bosPlanId } }),
      /kayıtlar silinmez, pasife alınır/                       
    );                                                         
    await assert.rejects(                                      
      dbA.subscription.delete({ where: { id: A.abonelikId } }),
      /abonelikler silinmez, iptal edilir/                     
    );                                                         
    await assert.rejects(                                      
      dbA.subscriptionEvent.delete({ where: { id: olay.id } }),
      /olay kayıtları silinmez/
    );
    
    assert.equal(await dbA.customer.count({ where: { id: A.bosMusteriId } }), 1);  
    assert.equal(await dbA.plan.count({ where: { id: A.bosPlanId } }), 1);         
    assert.equal(await dbA.subscription.count({ where: { id: A.abonelikId } }), 1);
    assert.equal(await dbA.subscriptionEvent.count({ where: { id: olay.id } }), 1);
  });
  
  test("kullanıcı (User) tablosunda silme filtre tarafından engellenmez", async () => {
    // Var olmayan bir kimlikle denenir: hiçbir kullanıcı silinmez, yalnızca        
    // filtrenin bu işlemi durdurmadığı görülür.                                    
    const sonuc = await dbA.user.deleteMany({ where: { id: "   BÖYLE KALDI
````

### Claude cevabı 8 · 24 Eki 2026 15:55

> Yapıştırma, dosyanın son 4 satırını kesmiş. Kesik satır şu: `const sonuc = await dbA.user.deleteMany({ where: { id: "`. Eksik olan yalnızca dosyanın sonu; üstteki her şey doğru görünüyor. Uzun dosyayı yeniden yapıştırmak yerine sonu terminalden onaralım. Komutları kendi kopyamda aynı biçimde kesilmiş bir dosya üzerinde denedim; sonuç benim verdiğim dosyayla birebir aynı çıktı.
>
> ## 1. Önce durumu gör
>
> Daldaki commit'leri gösterir:
> ```zsh
> git --no-pager log --oneline main..HEAD
> ```
>
> Değişmiş ve hazırlanmış dosyaları gösterir:
> ```zsh
> git status --short
> ```
>
> Bu iki çıktıyı bana gönder, ama onarıma beklemeden devam edebilirsin. Önemli olan şu: kesik `tenant.test.ts` bir commit'e girdi mi?
>
> ## 2. Kesik satırı sil
>
> Dosyada "filtrenin bu işlemi durdurmadığı görülür." satırından sonraki her şeyi (kesik satır ve sondaki boşluklar) siler:
> ```zsh
> perl -0pi -e 's/(filtrenin bu işlemi durdurmadığı görülür\.[ \t]*\n).*\z/$1/s' src/lib/tenant.test.ts
> ```
>
> ## 3. Eksik dört satırı ekle
>
> Dosyanın sonuna eksik dört satırı ekler. Bu komutu **tek parça olarak** (ilk satırdan `EOF`'a kadar) yapıştır, sonra Enter:
> ```zsh
> cat >> src/lib/tenant.test.ts <<'EOF'
>     const sonuc = await dbA.user.deleteMany({ where: { id: "olmayan-kullanici" } });
>     assert.equal(sonuc.count, 0);
>   });
> });
> EOF
> ```
>
> ## 4. Satır sonu boşluklarını temizle
>
> Gönderdiğin parçada satırların sonunda boşluklar var; yapıştırırken eklenmiş olabilirler. Bu komut her satırın sonundaki boşlukları siler (dosyada satır sonu boşluğu gerektiren bir metin yok):
> ```zsh
> perl -pi -e 's/[ \t]+$//' src/lib/tenant.test.ts
> ```
>
> ## 5. Dosyanın tam olduğunu doğrula
>
> Satır sayısını gösterir (**455** olmalı):
> ```zsh
> wc -l < src/lib/tenant.test.ts
> ```
>
> Test sayısını gösterir (**29** olmalı):
> ```zsh
> grep -c "^  test(" src/lib/tenant.test.ts
> ```
>
> Son 4 satırı gösterir (yukarıda eklediğin dört satır görünmeli):
> ```zsh
> tail -n 4 src/lib/tenant.test.ts
> ```
>
> ## 6. Diğer yapıştırılan dosyaları da kontrol et
>
> Her dosyanın satır sayısını ve son satırını gösterir:
> ```zsh
> for f in src/lib/tenant.ts next.config.ts src/test-destek/guvenlik-basliklari.test.ts; do echo "$f: $(wc -l < $f) | $(tail -n 1 $f)"; done
> ```
>
> Beklenen (satır sayısı ±1 olabilir):
>
> | Dosya | Satır | Son satır |
> |---|---|---|
> | `src/lib/tenant.ts` | 248 | `export type TenantDb = ReturnType<typeof tenantaBagliDb>;` |
> | `next.config.ts` | 48 | `export default nextConfig;` |
> | `src/test-destek/guvenlik-basliklari.test.ts` | 41 | `});` |
>
> Biri farklıysa çıktıyı gönder, aynı yöntemle onarırız.
>
> ## 7. Nereden devam edeceksin
>
> **A) Kesik dosya henüz commit edilmediyse** (1. adımda B6 commit'i yoksa ya da `git status` içinde `src/lib/tenant.test.ts` görünüyorsa): Parça 2 planının "B6 kontrolleri ve commit" bölümünden devam et (`npm run test:db` ile başla).
>
> **B) Kesik dosya B6 commit'ine girdiyse:** Onarılmış dosyayı ayrı bir commit olarak ekleriz; PR "Squash and merge" ile birleşeceği için `main`'de tek commit görünür, geçmişi değiştirmeye gerek yok. Önce testleri çalıştır:
>
> ```zsh
> npm run test:db
> ```
>
> ```zsh
> npm test
> ```
>
> ```zsh
> npm run lint
> ```
>
> ```zsh
> npm run build
> ```
>
> Hepsi geçerse dosyayı hazırla, üç taramayı yap ve commit et:
>
> ```zsh
> git add src/lib/tenant.test.ts
> ```
>
> ```zsh
> git --no-pager grep --cached -c -E "npg_[A-Za-z0-9]{6,}"
> ```
>
> ```zsh
> git --no-pager grep --cached -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
> ```
>
> ```zsh
> git --no-pager grep --cached -h -i -E "[AD_DESENI]" | sed 's/ozgesoganci1-bot//Ig' | grep -ic -E "[AD_DESENI]"
> ```
>
> ```zsh
> git commit -m "test: tenant.test.ts kesilen son satırlar tamamlandı (B6)" -m $'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01ERuUmicCCSJwyX4zWam3oq'
> ```
>
> Durum B'deysen bir şeyi merak ediyorum: kesik dosyayla `npm run test:db` ve `npm run build` sözdizimi hatası vermeliydi. Bu adımlar atlandıysa ya da hata verdiyse, onarımdan sonra mutlaka yeniden çalıştır.
>
> Sonraki uzun dosyalar için not: VS Code'a büyük yapıştırmalar kesilebiliyor. Yapıştırdıktan sonra her seferinde `tail -n 3 <dosya>` ile sonunu kontrol etmek bu sorunu hemen yakalar.

### Prompt 9 · 24 Eki 2026 16:04

````text
Last login: Sat Oct 24 15:53:04 on ttys002
kullanici@bilgisayar abonetakip % git --no-pager log --oneline main..HEAD
0f1aa99 (HEAD -> gun12-tenant-basliklar) fix: npm audit fix ile fast-uri güncellendi (B12)
025b02b fix: güvenlik başlıkları eklendi, X-Powered-By kapatıldı (B10)
43828ab fix: firma tablosunda başka kimlik istenince bulunamadı döner (B6, #24)
kullanici@bilgisayar abonetakip % git status --short
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 9 · 24 Eki 2026 16:04

> Üç commit de atılmış ve çalışma alanı temiz. Bu iyi bir işaret: kesik bir test dosyası commit'e girmiş olsaydı, B6 adımındaki `npm run test:db` ve `npm run build` sözdizimi hatası verirdi. Büyük olasılıkla kesilen şey dosyanın kendisi değil, ekranda gördüğün ya da kopyaladığın parçaydı.
>
> Tahmin etmeyelim, commit'teki dosyaya doğrudan bakalım. **Onarım komutlarını (2–4. adımlar) henüz çalıştırma**, dosya tamsa gerek yok.
>
> Commit'teki `tenant.test.ts`'in satır sayısını gösterir (**455** olmalı):
> ```zsh
> git show HEAD:src/lib/tenant.test.ts | wc -l
> ```
>
> Commit'teki test sayısını gösterir (**29** olmalı):
> ```zsh
> git show HEAD:src/lib/tenant.test.ts | grep -c "^  test("
> ```
>
> Commit'teki dosyanın son 4 satırını gösterir:
> ```zsh
> git show HEAD:src/lib/tenant.test.ts | tail -n 4
> ```
>
> Son satırlar şöyle olmalı:
> ```
>     const sonuc = await dbA.user.deleteMany({ where: { id: "olmayan-kullanici" } });
>     assert.equal(sonuc.count, 0);
>   });
> });
> ```
>
> **Üçü de tutuyorsa:** Dosya tam, onarım gerekmez. Parça 2 planının 5. bölümüne (elle deneme: `npm run dev:test`, `curl` ile başlıklar, Ayarlar'da CAC kaydetme, SSE ve HMR kontrolü) geç.
>
> **Tutmuyorsa:** Üç çıktıyı bana gönder; önceki mesajdaki onarımı yapıp ayrı bir commit ekleriz.

### Prompt 10 · 24 Eki 2026 16:05

````text
kullanici@bilgisayar abonetakip % git status --short
kullanici@bilgisayar abonetakip % git show HEAD:src/lib/tenant.test.ts | wc -l
     454
kullanici@bilgisayar abonetakip % git show HEAD:src/lib/tenant.test.ts | grep -c "^  test("
29
kullanici@bilgisayar abonetakip % git show HEAD:src/lib/tenant.test.ts | tail -n 4
    const sonuc = await dbA.user.deleteMany({ where: { id: "olmayan-kullanici" } });
    assert.equal(sonuc.count, 0);
  });
});%                                                                                                                    kullanici@bilgisayar abonetakip %
````

### Claude cevabı 10 · 24 Eki 2026 16:05

> Dosya tam. 454 ile 455 arasındaki fark benim hatam: Ben "455" derken onarılmış hâlin satır sayısını verdim; o hâlde dosyanın sonunda bir satır sonu karakteri vardı. Senin verdiğim dosyanın sonunda o karakter yok. `wc -l` satır sonlarını saydığı için 454 gösteriyor. Son satırdaki `});` ifadesinin hemen yanındaki `%` işareti de bunu gösteriyor: zsh, satır sonu karakteriyle bitmeyen çıktının sonuna `%` koyar. Benim kopyamdaki dosya da 454 sayıyor. 29 test ve son dört satır doğru.
>
> Kısacası commit'teki dosya, verdiğim içerikle aynı. Onarım gerekmez, ekstra commit de gerekmez.
>
> Parça 2 planının **5. bölümüne (elle deneme)** geç:
>
> 1. `npm run dev:test`
> 2. Yeni Terminal sekmesinde (**Cmd+T**) iki `curl` komutu: `/giris` ve `/api/events` için beş başlık görünmeli, `X-Powered-By` görünmemeli.
> 3. Tarayıcıda Ayarlar'da CAC kaydet, SSE uyarısını ve HMR'ı dene.
>
> Sonuçları (özellikle iki `curl` çıktısını) gönderirsen birlikte kontrol ederiz, sonra PR'a geçersin.

### Prompt 11 · 24 Eki 2026 16:15

````text
SAYFA İSTEĞİNİ GÖREMİYORUM
````

### Claude cevabı 11 · 24 Eki 2026 16:15

> Sorun büyük olasılıkla şu: Network sekmesi yalnızca **sekme açıkken** yapılan istekleri gösterir. Sayfa sen geliştirici araçlarını açmadan önce yüklendiyse liste boş kalır.
>
> ## Chrome'da
>
> 1. Panel sayfalarından birindeyken (ör. Dashboard) geliştirici araçlarını aç: **Cmd+Option+I**.
> 2. Üstteki sekmelerden **Network**'ü seç.
> 3. Network sekmesi açıkken sayfayı yenile: **Cmd+R**.
> 4. Filtre çubuğunda **Doc**'a tıkla (yalnızca sayfa isteklerini gösterir). Arama kutusunda bir şey yazılıysa sil.
> 5. Listedeki ilk satıra tıkla (adı `dashboard` gibi sayfanın adıdır).
> 6. Sağda açılan bölümde **Headers** sekmesinde aşağı kaydır, **Response Headers** başlığının altında `x-frame-options: DENY` ve `content-security-policy: frame-ancestors 'none'` satırlarını ara.
>
> ## Safari'de
>
> 1. Önce geliştirici menüsünü aç: **Safari > Ayarlar (Cmd+,) > Gelişmiş** sekmesinde en alttaki "Web geliştiricileri için özellikleri göster" kutusunu işaretle.
> 2. Sayfadayken **Cmd+Option+I**, sonra **Network** (Ağ) sekmesi.
> 3. Sayfayı yenile: **Cmd+R**.
> 4. Listede sayfanın adını taşıyan ilk satıra tıkla, sağda **Headers** (Başlıklar) bölümünde **Response** başlıklarına bak.
>
> ## Bu adım zorunlu değil
>
> Tarayıcıdaki kontrol, `curl` ile yaptığımız kontrolün görsel tekrarı. Asıl kanıt `curl` çıktısı: Orada `/giris` ve `/api/events` için beş başlık göründüyse ve `X-Powered-By` görünmediyse B10 doğrulanmış sayılır. Network sekmesinde yine göremezsen bu adımı atlayıp `curl` çıktısını gönder, onunla devam ederiz.
>
> Diğer elle denemeler (Ayarlar'da CAC kaydetme, SSE uyarısı, HMR) nasıl geçti?

### Prompt 12 · 24 Eki 2026 16:18

````text
her şey yolunda
````

### Claude cevabı 12 · 24 Eki 2026 16:19

> Güzel, Parça 2 elle denemede de doğrulandı. Sırada PR var.
>
> ## PR
>
> Geliştirme sunucusunu durdur (onun Terminal sekmesinde): **Control+C**
>
> GitHub Desktop'ta:
> 1. **Publish branch**
> 2. **Create Pull Request**
> 3. **Başlık:** `fix: güvenlik gözden geçirme düzeltmeleri`
> 4. **Açıklama:** Önceki mesajdaki PR açıklamasını aynen kullan (içinde `Closes #24` ve en sonda oturum adresi var).
> 5. GitHub'da kontroller geçince **Squash and merge**.
>
> Birleştirince Terminal'de:
>
> `main` dalına geçer:
> ```zsh
> git switch main
> ```
>
> Birleştirilmiş hâli indirir:
> ```zsh
> git pull
> ```
>
> Render yeni sürümü yayına aldıktan sonra canlıda başlıkları gösterir (adresi kendi Render adresinle değiştir):
> ```zsh
> curl -s -D - -o /dev/null https://[RENDER_ADRESI]/giris
> ```
>
> Bu çıktıda beş başlık olmalı, `X-Powered-By` olmamalı. Ayrıca `strict-transport-security` satırı var mı, ona da bak: Render'ın HSTS'i kendisinin gönderip göndermediğini böylece öğreniriz (ADR'ye yazacağız). GitHub'da issue #24'ün kapandığını da kontrol et.
>
> ## Sırada kalanlar
>
> 1. **B8:** Dört bağlantı adresinde `sslmode=verify-full` (kod değişmez; `.env`, `.env.test` ve Render ortam değişkenleri).
> 2. **ADR güncellemesi:** Gün 12 kararları, değişiklik geçmişi, bilinen sınırlar (B2, B3, B4, B5, B9, B11, diğer tablolarda `tenantId` ezilmesi, kayıt sınırı, IP sınırı, tam CSP ve HSTS'in neden eklenmediği).
> 3. **B7 kararı:** Sana bırakılmıştı.
>
> Canlı `curl` çıktısını gönderdiğinde B8 planına geçelim.

### Prompt 13 · 24 Eki 2026 16:23

````text
render adresime tam olarak nereden bakmam gerekiyor
````

### Claude cevabı 13 · 24 Eki 2026 16:23

> Render panelinde, servisinin sayfasının en üstünde yazıyor:
>
> 1. Tarayıcıda **dashboard.render.com** adresine git ve giriş yap.
> 2. Açılan listede uygulamanın web servisine tıkla (adı büyük olasılıkla `abonetakip` gibi bir şeydir).
> 3. Servis sayfasının en üstünde, servis adının hemen altında mor renkli bir bağlantı göreceksin. Biçimi şuna benzer: `https://abonetakip-xxxx.onrender.com`. Onun yanındaki kopyala simgesiyle kopyalayabilirsin.
>
> Bu adresi `[RENDER_ADRESI]` yerine yazarken başındaki `https://` kısmını tekrarlama. Örnek:
>
> ```zsh
> curl -s -D - -o /dev/null https://abonetakip-xxxx.onrender.com/giris
> ```
>
> Kısa yol: Uygulamayı canlıda zaten tarayıcıda açıyorsan, adres çubuğundaki adres aynıdır; `/giris`'ten önceki kısmı kullanabilirsin.
>
> Not: Servis bir süredir kullanılmadıysa uyumuş olabilir; ilk `curl` yaklaşık bir dakika bekleyebilir. Çıktı gelmezse bir kez daha çalıştır.

### Prompt 14 · 24 Eki 2026 16:26

````text
çıktı gelmedi
````

### Claude cevabı 14 · 24 Eki 2026 16:26

> "Çıktı gelmedi" iki farklı şey olabilir, hangisi olduğunu anlamak için komutu biraz değiştirelim. Eski komutta `-s` hataları da gizliyordu.
>
> ## 1. Önce yayının bitip bitmediğine bak
>
> Render panelinde servis sayfasında, üstteki **Events** sekmesine bak. En üstteki satır PR birleştirmesinden gelen yeni yayındır:
>
> - **"Deploy live"** (yeşil) yazıyorsa yayın bitmiştir, 2. adıma geç.
> - **"Deploy started"** ya da **"In progress"** görünüyorsa henüz yayında değil; birkaç dakika bekle.
> - **"Deploy failed"** (kırmızı) görünüyorsa dur ve bana bildir; o satıra tıklayınca açılan günlüğün son satırlarını gönder (içinde adres ya da parola varsa maskele).
>
> ## 2. Hataları gösteren komutla tekrar dene
>
> En fazla 90 saniye bekler, hata olursa nedenini yazar, en sonda HTTP durum kodunu ayrı bir satırda gösterir (adresi kendi adresinle değiştir):
> ```zsh
> curl -sS --max-time 90 -D - -o /dev/null -w "\nDURUM: %{http_code}\n" https://[RENDER_ADRESI]/giris
> ```
>
> ## Sonuca göre
>
> | Ne gördün | Anlamı |
> |---|---|
> | Başlıklar ve `DURUM: 200` | Tamam. Başlıkları gönder. |
> | `Operation timed out` | Servis uyanıyor ya da yeni yayın başlıyor. Bir dakika sonra aynı komutu tekrarla. |
> | `Could not resolve host` | Adreste yazım hatası var. Render panelinden adresi yeniden kopyala. |
> | `DURUM: 404` | Adres doğru ama yol yanlış; adresin sonuna `/giris` eklediğini kontrol et. |
> | `DURUM: 502` veya `503` | Servis çalışmıyor ya da yeniden başlıyor. 1. adımdaki Events sekmesine bak. |
> | Hiçbir şey yazmadan imleç bekliyor | 90 saniye dolunca hata mesajı gelecek; onu gönder. |
>
> Çıktıyı gönderirken kendi Render adresini `[RENDER_ADRESI]` olarak maskeleyebilirsin.

### Prompt 15 · 24 Eki 2026 16:28

````text
kullanici@bilgisayar abonetakip % curl -sS --max-time 90 -D - -o /dev/null -w "\nDURUM: %{http_code}\n" 
curl: (6) Could not resolve host: https

DURUM: 000
````

### Claude cevabı 15 · 24 Eki 2026 16:28

> Komutta adres eksik ya da bölünmüş kalmış: Terminal'de gördüğün satır `"\nDURUM: %{http_code}\n"` ile bitiyor, adres o satırda yok. curl de adres yerine yalnızca `https` kelimesini almış (büyük olasılıkla adres yapıştırılırken araya bir boşluk ya da satır sonu girmiş). Yani bu bir sunucu sorunu değil, komutun yazımıyla ilgili.
>
> Hatayı önlemek için adresi ayrı bir adımda bir değişkene koyalım.
>
> Render adresini `ADRES` adlı değişkene kaydeder (tırnakların arasına Render panelinden kopyaladığın adresi yapıştır; başında `https://` olsun, sonunda `/` olmasın):
> ```zsh
> ADRES="https://abonetakip-xxxx.onrender.com"
> ```
>
> Değişkende ne olduğunu gösterir (adres tek parça ve boşluksuz görünmeli):
> ```zsh
> echo "$ADRES"
> ```
>
> Giriş sayfasının başlıklarını ve durum kodunu gösterir (bu komutu olduğu gibi yapıştır, içinde değiştirmen gereken bir şey yok):
> ```zsh
> curl -sS --max-time 90 -D - -o /dev/null -w "\nDURUM: %{http_code}\n" "$ADRES/giris"
> ```
>
> `echo` çıktısında boşluk ya da satır kırılması görürsen `ADRES=...` satırını yeniden yaz. Sonucu tablodaki gibi yorumlayabilirsin; çıktıyı gönderirken adresi maskelemen yeterli.

### Prompt 16 · 24 Eki 2026 16:29

````text
curl: (3) URL rejected: Port number was not a decimal number between 0 and 65535

DURUM: 000
````

### Claude cevabı 16 · 24 Eki 2026 16:29

> Bu hata ve bir önceki hata ("Could not resolve host: https") aynı nedene işaret ediyor: Adreste büyük olasılıkla `https://` **iki kez** var, yani `https://https://abonetakip-xxxx.onrender.com` gibi. Render panelindeki kopyala simgesi adresi zaten `https://` ile kopyalıyor; üstüne bir `https://` daha yazılınca curl `https` kelimesini sunucu adı, ardından gelen `//...` kısmını da port numarası sanıyor.
>
> `echo "$ADRES"` çıktısında adres `https://https://` ile mi başlıyor? Öyleyse değişkeni düzelt:
>
> Değişkeni yeniden yazar. Tırnakların içine **yalnızca** Render panelinden kopyaladığın adresi yapıştır, önüne bir şey ekleme:
> ```zsh
> ADRES="BURAYA_KOPYALADIGIN_ADRES"
> ```
>
> Doğru biçimi gösterir (tek bir `https://` ile başlamalı, sonunda `/` olmamalı):
> ```zsh
> echo "$ADRES"
> ```
>
> Doğru çıktı şuna benzemeli:
> ```
> https://abonetakip-xxxx.onrender.com
> ```
>
> Sonra aynı komutu tekrar çalıştır:
> ```zsh
> curl -sS --max-time 90 -D - -o /dev/null -w "\nDURUM: %{http_code}\n" "$ADRES/giris"
> ```
>
> `echo` çıktısı `https://https://` ile başlamıyorsa, çıktıyı adresin ortasını maskeleyerek (ör. `https://abo...xxxx.onrender.com`) gönder; özellikle iki nokta (`:`) işaretinin nerede geçtiğini görmem yeterli.

### Prompt 17 · 24 Eki 2026 16:32

````text
kullanici@bilgisayar abonetakip % ADRES=""
kullanici@bilgisayar abonetakip % echo "$ADRES"
https 
kullanici@bilgisayar abonetakip % curl -sS --max-time 90 -D - -o /dev/null -w "\nDURUM: %{http_code}\n" "$https://abo"
curl: (3) URL rejected: Port number was not a decimal number between 0 and 65535

DURUM: 000
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 17 · 24 Eki 2026 16:32

> Burada iki şey karışmış, sorun sende değil, benim değişkenli yöntemim gereksiz yere karmaşıktı:
>
> - `ADRES=""` satırında tırnakların arası boş kalmış (ya da sen göndermeden önce maskeledin), o yüzden `echo` düzgün bir adres göstermiyor.
> - curl komutunda `"$ADRES/giris"` yerine `"$https://abo"` yazılmış. Baştaki `$` işareti zsh'e "bu bir değişkenin adı" der; `$https` diye bir değişken olmadığı için o kısım boş kalıyor ve geriye `://abo` gibi bozuk bir adres kalıyor. `$` işaretini adresin önüne koyma.
>
> Daha basit bir yol deneyelim: **Yalnızca adresin ortasındaki adı** yazacaksın, `https://` ve `.onrender.com` kısımlarını komut kendisi ekleyecek.
>
> Render panelindeki adres `https://abonetakip-xxxx.onrender.com` biçimindeyse, ortadaki ad `abonetakip-xxxx` kısmıdır.
>
> Ortadaki adı `SERVIS` değişkenine kaydeder (tırnakların içine yalnızca ortadaki adı yaz; `https`, `://`, `.onrender.com` ve `$` yok):
> ```zsh
> SERVIS="abonetakip-xxxx"
> ```
>
> Oluşacak tam adresi gösterir (`https://<ad>.onrender.com/giris` biçiminde tek parça görünmeli):
> ```zsh
> echo "https://$SERVIS.onrender.com/giris"
> ```
>
> Giriş sayfasının başlıklarını ve durum kodunu gösterir (bu komutu hiç değiştirmeden yapıştır):
> ```zsh
> curl -sS --max-time 90 -D - -o /dev/null -w "\nDURUM: %{http_code}\n" "https://$SERVIS.onrender.com/giris"
> ```
>
> Çıktıyı bana gönderirken adresi maskelemen yeterli. `echo` satırı beklediğin adresi göstermiyorsa onu da gönder (ortadaki adın birkaç harfini `x` ile değiştirebilirsin).

### Prompt 18 · 24 Eki 2026 16:35

````text
kullanici@bilgisayar abonetakip % curl -sS --max-time 90 -D - -o /dev/null -w "\nDURUM: %{http_code}\n" "https://$SERVIS.onrender.com/giris"
HTTP/2 103 
link: </_next/static/media/797e433ab948586e-s.p.0r6juujl39pe6.woff2>; as=font; crossorigin=; rel=preload; type=font/woff2, </_next/static/media/caa3a2e1cccd8315-s.p.0wgildi0cnwt9.woff2>; as=font; crossorigin=; rel=preload; type=font/woff2

HTTP/2 200 
date: Sat, 24 Oct 2026 13:33:57 GMT
content-type: text/html; charset=utf-8
cache-control: private, no-cache, no-store, max-age=0, must-revalidate
content-security-policy: frame-ancestors 'none'
link: </_next/static/media/797e433ab948586e-s.p.0r6juujl39pe6.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/caa3a2e1cccd8315-s.p.0wgildi0cnwt9.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2"
permissions-policy: camera=(), microphone=(), geolocation=()
referrer-policy: strict-origin-when-cross-origin
rndr-id: fe2579a5-2647-4843
server: cloudflare
vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding
x-content-type-options: nosniff
x-frame-options: DENY
x-render-origin-server: Render
cf-cache-status: DYNAMIC
cf-ray: a4f95b28d9ca51a7-IST
alt-svc: h3=":443"; ma=86400


DURUM: 200
````

### Claude cevabı 18 · 24 Eki 2026 16:36

> Canlıda B10 doğrulandı:
>
> | Kontrol | Sonuç |
> |---|---|
> | `x-frame-options: DENY` | ✅ |
> | `content-security-policy: frame-ancestors 'none'` | ✅ |
> | `x-content-type-options: nosniff` | ✅ |
> | `referrer-policy: strict-origin-when-cross-origin` | ✅ |
> | `permissions-policy: camera=(), microphone=(), geolocation=()` | ✅ |
> | `x-powered-by` | ✅ Yok |
> | `strict-transport-security` (HSTS) | Yok: Render bunu bu adreste kendisi göndermiyor. ADR'ye "HSTS yok, bilinçli olarak eklenmedi" diye yazacağız. |
>
> Baştaki `HTTP/2 103` satırı bir hata değil: Next.js'in yazı tiplerini önceden yükletmek için gönderdiği "erken ipucu" yanıtı. Asıl yanıt altındaki `HTTP/2 200`.
>
> Yan not: Yanıtta `server: cloudflare` ve `cf-ray` var, yani Render trafiği önünde Cloudflare üzerinden geçiriyor. Bu, B1'deki IP sorusuyla ilgili bir ipucu, ama Render bunu belgelemediği için kararımız (yalnızca e-posta başına sınır) değişmiyor. ADR'ye not olarak yazarız.
>
> Sırada B8 var. Plan vermeden önce bir noktayı doğrulamam gerekiyor: Neon adresindeki `sslmode=verify-full` değerini hem uygulamanın kullandığı `pg` sürücüsünün hem de Prisma'nın geçiş (migration) aracının kabul edip etmediği. Bunu araştırıp planı bir sonraki mesajda veriyorum.
> Araştırma B8 planını değiştirdi: Dört adresin dördünü birden değiştirmemek gerekiyor.
>
> ## B8 planı
>
> ### Ne buldum
>
> - **Uyarının kaynağı:** Uyarıyı uygulamanın kullandığı `pg` sürücüsü veriyor. Bu sürücü yalnızca `DATABASE_URL` adresini kullanıyor (`src/lib/db.ts`). Senin Gün 6 günlüğündeki uyarı metni de, bugünkü davranışı korumak için `sslmode=verify-full` yazılmasını öneriyor; yani bugünkü bağlantı zaten bu düzeyde, değişiklik yalnızca bunu açıkça yazmak.
> - **Neon:** Neon kendi dokümanında her zaman `verify-full` kullanılmasını öneriyor. Neon'un sertifikası, işletim sistemlerinin ve Node.js'in zaten güvendiği bir kök sertifikaya (ISRG Root X1) dayanıyor, bu yüzden ayrıca sertifika indirmek gerekmez.
> - **Prisma geçişleri (migration):** Prisma 7 dokümanı PostgreSQL adresi için yalnızca `prefer`, `disable` ve `require` değerlerini listeliyor; `verify-full`'dan söz etmiyor. Geçişler `DIRECT_URL` ile ve `pg` sürücüsünden ayrı bir Prisma aracıyla çalışıyor (`prisma.config.ts`). Bu yüzden `DIRECT_URL`'e dokunmamak daha güvenli.
>
> ### Değişecekler
>
> | Yer | Değişken | Değişiklik |
> |---|---|---|
> | Yerel `.env` (canlı) | `DATABASE_URL` | `sslmode=require` → `sslmode=verify-full` |
> | Yerel `.env.test` (Neon test dalı) | `DATABASE_URL` | Aynı |
> | Render ortam değişkenleri | `DATABASE_URL` | Aynı |
> | Üçünde de | `DIRECT_URL` | **Değişmez** (`sslmode=require` kalır) |
>
> Adreslerdeki `channel_binding=require` kısmı olduğu gibi kalır.
>
> **Depoda hiçbir dosya değişmez**, commit yok. `.env.example` zaten yalnızca yer tutucu içeriyor.
>
> ### Nasıl yapılacak (onaydan sonra adım adım vereceğim)
>
> 1. `.env` ve `.env.test`'in yedeği alınır (yedek dosyaların adı `.env` ile başladığı için `.gitignore` onları da dışarıda tutar).
> 2. Tek bir `perl -pi -e` komutu **yalnızca `DATABASE_URL=` ile başlayan satırda** `sslmode=require` ifadesini değiştirir. Komut ekrana hiçbir adres basmaz.
> 3. Kontrol, adresleri göstermeden yalnızca sayarak yapılır: iki dosyada da `DATABASE_URL` satırında `verify-full` sayısı 1, `DIRECT_URL` satırında `require` sayısı 1 olmalı.
> 4. `npm run test:db` ve `npm run dev:test`: Terminal'de `SECURITY WARNING` satırı **görünmemeli**, testler geçmeli, uygulama açılmalı.
> 5. Render panelinde **Environment** bölümünde `DATABASE_URL` değeri aynı biçimde düzenlenir ve kaydedilir; Render yeniden yayınlar. **Logs** bölümünde uyarı görünmemeli, canlıda giriş ve Dashboard çalışmalı.
> 6. Her şey çalışınca yedek dosyalar silinir.
>
> **Geri dönüş:** Bir şey bozulursa yerelde yedekten geri alınır, Render'da değer `sslmode=require`'a geri yazılır.
>
> ### Senden bir bilgi
>
> Render panelinde servisinin **Settings** bölümündeki **Build Command** satırında `prisma migrate deploy` geçiyor mu? Geçiyorsa Render geçişleri `DIRECT_URL` ile çalıştırıyor demektir; bu planla `DIRECT_URL`'e dokunmadığımız için sorun olmaz, ama ADR'ye doğru yazabilmek için bilmek istiyorum. (Komutun tamamını göndermene gerek yok, yalnızca "evet/hayır".)
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - `@prisma/adapter-pg`'nin bağlantı adresini olduğu gibi `pg` sürücüsüne verdiğini ve `pg`'nin `sslmode=verify-full` değerini Node.js'in yerleşik sertifika listesiyle doğruladığını varsaydım. 4. adım bunu doğrulayacak: bağlantı kurulamazsa sertifika hatası (`self-signed certificate` ya da `unable to verify`) görülür.
> - `DIRECT_URL` için Prisma'nın `verify-full`'u desteklemediğini kesin bilmiyorum; yalnızca dokümanda listelenmiyor. Bu yüzden ona dokunmuyoruz. `DIRECT_URL` bugün uyarı vermiyorsa (uyarı yalnızca `pg`'den geliyor) bırakmak bir risk yaratmaz.
> - Uyarının yalnızca `DATABASE_URL`'den geldiğini varsaydım. `test:db` sonrası uyarı hâlâ çıkarsa, kaynağını birlikte ararız.
>
> Onaylarsan adımları tek tek veririm.
>
> Sources:
> - [Prisma ORM 7: PostgreSQL](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql)
> - [Neon: Securing connections](https://neon.com/docs/connect/connect-securely)

### Prompt 19 · 24 Eki 2026 16:38

````text
B8 planını onaylıyorum, DIRECT_URL değişmez. Sıra: önce yalnızca .env.test (yedek al, değiştir, sayarak doğrula, npm run test:db, npm run dev:test), sonra .env, en son Render. Adresleri hiçbir komut ekrana basmasın. Her adımı tek tek ver. Render build command sorusunun cevabı: npx prisma generate yazıyor.
````

### Claude cevabı 19 · 24 Eki 2026 16:39

> Render'da build komutu yalnızca `npx prisma generate` ise, Render geçiş (migration) çalıştırmıyor ve `prisma generate` veritabanına bağlanmıyor. Yani canlıda veritabanına bağlanan tek şey uygulamanın kendisi, o da `DATABASE_URL` kullanıyor. Bu planı destekliyor; ADR'ye böyle yazacağız.
>
> Aşağıdaki komutların hiçbiri adres basmaz: hepsi yalnızca sayı ya da "tamam" yazar. Komutları proje klasöründe çalıştır.
>
> ## Bölüm 1: `.env.test`
>
> ### 1. Yedek al
>
> `.env.test`'in bir kopyasını `.env.test.yedek` adıyla oluşturur:
> ```zsh
> cp .env.test .env.test.yedek
> ```
>
> Yedeğin git tarafından yok sayıldığını doğrular (`YOKSAYILIYOR` yazmalı):
> ```zsh
> git check-ignore -q .env.test.yedek && echo YOKSAYILIYOR
> ```
>
> ### 2. Değiştirmeden önce say
>
> `DATABASE_URL` satırında `sslmode=require` var mı, sayar (**1** olmalı):
> ```zsh
> grep -c '^DATABASE_URL=.*sslmode=require' .env.test
> ```
>
> `DIRECT_URL` satırında `sslmode=require` var mı, sayar (**1** olmalı):
> ```zsh
> grep -c '^DIRECT_URL=.*sslmode=require' .env.test
> ```
>
> İkisinden biri 0 çıkarsa **dur** ve bana yalnızca sayıları gönder; satırlar beklediğim biçimde değil demektir.
>
> ### 3. Değiştir
>
> Yalnızca `DATABASE_URL=` ile başlayan satırda `sslmode=require` ifadesini `sslmode=verify-full` yapar:
> ```zsh
> perl -pi -e 's/sslmode=require/sslmode=verify-full/ if /^DATABASE_URL=/' .env.test
> ```
>
> ### 4. Sayarak doğrula
>
> `DATABASE_URL` satırında artık `verify-full` var (**1** olmalı):
> ```zsh
> grep -c '^DATABASE_URL=.*sslmode=verify-full' .env.test
> ```
>
> `DATABASE_URL` satırında artık `require` kalmadı (**0** olmalı):
> ```zsh
> grep -c '^DATABASE_URL=.*sslmode=require' .env.test
> ```
>
> `DIRECT_URL` satırına dokunulmadı (**1** olmalı):
> ```zsh
> grep -c '^DIRECT_URL=.*sslmode=require' .env.test
> ```
>
> Yedekle karşılaştırıp yalnızca **bir satırın** değiştiğini gösterir; satırların içeriğini basmaz, yalnızca sayar (**2** olmalı: bir satır çıktı, bir satır girdi):
> ```zsh
> diff .env.test.yedek .env.test | grep -c '^[<>]'
> ```
>
> ### 5. Veritabanı testleri
>
> Neon test dalındaki testleri yeni adresle çalıştırır (hepsi geçmeli):
> ```zsh
> npm run test:db
> ```
>
> Test bitince Terminal'de **Cmd+F** ile `SECURITY` kelimesini ara: **bulunmamalı**. Bulunursa ya da bir test sertifika hatasıyla (`certificate`, `unable to verify` gibi) düşerse dur ve hatanın adres içermeyen kısmını gönder.
>
> ### 6. Uygulamayı test dalında aç
>
> Uygulamayı test dalında açar:
> ```zsh
> npm run dev:test
> ```
>
> Tarayıcıda test hesabınla giriş yap ve Dashboard'u aç; sayılar gelmeli. Sonra Terminal'de **Cmd+F** ile `SECURITY` ara: **bulunmamalı**.
>
> Sunucuyu durdur: **Control+C**
>
> Bölüm 1 sorunsuz geçerse Bölüm 2'ye geç; sorun çıkarsa geri dönüş en altta.
>
> ## Bölüm 2: `.env` (canlı)
>
> ### 7. Yedek al
>
> `.env`'in bir kopyasını `.env.yedek` adıyla oluşturur:
> ```zsh
> cp .env .env.yedek
> ```
>
> Yedeğin git tarafından yok sayıldığını doğrular (`YOKSAYILIYOR` yazmalı):
> ```zsh
> git check-ignore -q .env.yedek && echo YOKSAYILIYOR
> ```
>
> ### 8. Değiştirmeden önce say
>
> `DATABASE_URL` satırında `sslmode=require` (**1** olmalı):
> ```zsh
> grep -c '^DATABASE_URL=.*sslmode=require' .env
> ```
>
> `DIRECT_URL` satırında `sslmode=require` (**1** olmalı):
> ```zsh
> grep -c '^DIRECT_URL=.*sslmode=require' .env
> ```
>
> ### 9. Değiştir
>
> Yalnızca `DATABASE_URL=` satırında değişiklik yapar:
> ```zsh
> perl -pi -e 's/sslmode=require/sslmode=verify-full/ if /^DATABASE_URL=/' .env
> ```
>
> ### 10. Sayarak doğrula
>
> (**1** olmalı):
> ```zsh
> grep -c '^DATABASE_URL=.*sslmode=verify-full' .env
> ```
>
> (**0** olmalı):
> ```zsh
> grep -c '^DATABASE_URL=.*sslmode=require' .env
> ```
>
> (**1** olmalı):
> ```zsh
> grep -c '^DIRECT_URL=.*sslmode=require' .env
> ```
>
> (**2** olmalı):
> ```zsh
> diff .env.yedek .env | grep -c '^[<>]'
> ```
>
> ### 11. Canlı veritabanıyla kısa deneme
>
> Uygulamayı yerelde **canlı veritabanıyla** açar:
> ```zsh
> npm run dev
> ```
>
> Bu kez canlı veriye bağlısın: **yalnızca bak, hiçbir şey ekleme, değiştirme ya da iptal etme.** Giriş yap, Dashboard açılsın. Terminal'de **Cmd+F** ile `SECURITY` ara: bulunmamalı.
>
> Sunucuyu durdur: **Control+C**
>
> ## Bölüm 3: Render
>
> ### 12. Ortam değişkenini düzenle
>
> 1. **dashboard.render.com** → web servisine tıkla.
> 2. Sol menüde **Environment**.
> 3. `DATABASE_URL` satırında düzenleme (kalem) simgesine tıkla.
> 4. Değerin içinde yalnızca `sslmode=require` kısmını bul ve `sslmode=verify-full` yap. Değerin geri kalanına dokunma, başka bir yere kopyalama.
> 5. `DIRECT_URL` varsa ona **dokunma**.
> 6. **Save Changes**'e bas. Kaydetme ile birlikte yeniden yayınlama seçeneği sunulursa (**Save and deploy** gibi) onu seç.
>
> ### 13. Yayını ve günlüğü kontrol et
>
> 1. **Events** sekmesinde en üstte **Deploy live** görünene kadar bekle.
> 2. **Logs** sekmesinde arama kutusuna `SECURITY` yaz: yeni yayından sonra **sonuç çıkmamalı**.
> 3. Tarayıcıda canlı sitede giriş yap ve Dashboard'u aç; sayılar gelmeli.
>
> Canlı sitenin yanıt verdiğini doğrular (**DURUM: 200** olmalı; `SERVIS` değişkeni Terminal'i kapattıysan boştur, önce yeniden tanımla):
> ```zsh
> curl -sS --max-time 90 -o /dev/null -w "DURUM: %{http_code}\n" "https://$SERVIS.onrender.com/giris"
> ```
>
> ## Bölüm 4: Temizlik
>
> Her şey çalışıyorsa iki yedek dosyayı siler:
> ```zsh
> rm .env.test.yedek .env.yedek
> ```
>
> Depoda değişiklik olmadığını doğrular (çıktı **boş** olmalı):
> ```zsh
> git status --short
> ```
>
> ## Geri dönüş (yalnızca sorun çıkarsa)
>
> Test dalı adresini yedekten geri yükler:
> ```zsh
> cp .env.test.yedek .env.test
> ```
>
> Canlı adresi yedekten geri yükler:
> ```zsh
> cp .env.yedek .env
> ```
>
> Render'da `DATABASE_URL` değerinde `sslmode=verify-full`'u yeniden `sslmode=require` yap ve kaydet.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - `.env` ve `.env.test`'te adreslerin `DATABASE_URL=` ile **satır başında** başladığını varsaydım (`.env.example` böyle). Satırın başında `export` ya da boşluk varsa 2. adımdaki sayı 0 çıkar ve dururuz.
> - Her satırda `sslmode=require` ifadesinin bir kez geçtiğini varsaydım. Komut zaten yalnızca ilkini değiştirir; 4. adımdaki `diff` sayısı 2 değilse dur.
> - Render arayüzündeki düğme adlarını ("Save Changes", "Save and deploy") ve günlükte arama kutusunu bildiğim hâliyle yazdım; değişmiş olabilir. Bulamazsan ekranda ne gördüğünü yaz.
> - Uyarının yalnızca `pg` sürücüsünden (`DATABASE_URL`) geldiğini varsaydım. Bölüm 1'den sonra uyarı hâlâ çıkıyorsa Bölüm 2'ye geçmeden kaynağını birlikte ararız.
> - Render'da `DIRECT_URL` tanımlıysa bile build komutu (`npx prisma generate`) veritabanına bağlanmadığı için kullanılmadığını varsaydım; ona dokunmuyoruz.

### Prompt 20 · 24 Eki 2026 16:41

````text
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.
````

### Claude cevabı 20 · 24 Eki 2026 16:42

> Bu satır, `pg`'nin daha önce gördüğümüz uyarısının bir parçası. Hangi adımda çıktığını bilmeden yorum yapmayayım; iki ihtimal çok farklı sonuçlara götürüyor:
>
> - **Değişiklikten önce** (örneğin Bölüm 1'e başlamadan çalıştırdığın bir komutta) çıktıysa: Beklenen durum, planla devam et.
> - **Değişiklikten sonra** (5. adımda `npm run test:db` ya da 6. adımda `npm run dev:test` sırasında) çıktıysa: Uyarıyı veren bağlantı hâlâ `sslmode=require` görüyor demektir. **Bölüm 2'ye geçme.**
>
> İkinci durumdaysan, nedeni bulmak için şu üç sayıyı gönder (hiçbiri adres basmaz):
>
> `.env.test`'te `DATABASE_URL` satırında `verify-full` var mı (**1** bekleniyor):
> ```zsh
> grep -c '^DATABASE_URL=.*sslmode=verify-full' .env.test
> ```
>
> `.env.test`'te herhangi bir satırda hâlâ `sslmode=require` geçiyor mu (**1** bekleniyor, o da `DIRECT_URL`):
> ```zsh
> grep -c 'sslmode=require' .env.test
> ```
>
> `.env.test`'te `DATABASE_URL` satırı kaç tane (**1** bekleniyor; 2 ise eski satır da duruyor olabilir):
> ```zsh
> grep -c 'DATABASE_URL' .env.test
> ```
>
> Bir de şunu yaz: Uyarı **hangi komutun** çıktısında göründü (`npm run test:db` mi, `npm run dev:test` mi), ve uyarının hemen üstündeki ilk satır neydi (adres içeriyorsa maskele)?

### Prompt 21 · 24 Eki 2026 16:43

````text
npm run test:db bunda göründü , çıktılar beklediğimiz gibi
````

### Claude cevabı 21 · 24 Eki 2026 16:44

> Sayılar doğruysa `.env.test` dosyası düzgün değişmiş; yine de uyarı çıkıyor. Bunun iki olası nedeni var, ikisini de adres basmadan kontrol edelim. **Bölüm 2'ye henüz geçme.**
>
> **Neden 1, önemli:** `node --env-file=.env.test`, Terminal oturumunda **zaten tanımlı** bir değişkeni ezmez. Daha önce bir yerde (ör. `~/.zshrc` dosyasında ya da bu Terminal penceresinde) `DATABASE_URL` tanımlandıysa, testler `.env.test`'teki adresi değil o adresi kullanıyor olabilir. Bu yalnızca uyarıyı açıklamaz; testlerin hangi veritabanına gittiği sorusunu da açar, o yüzden önce buna bakıyoruz.
>
> **Neden 2:** Kurulu `pg` sürümü `verify-full` için de uyarı veriyor olabilir.
>
> ### 1. Terminal oturumunda tanımlı değişken var mı
>
> Her biri yalnızca **0** ya da **1** yazar; 1, o değişkenin bu Terminal oturumunda tanımlı olduğu anlamına gelir (üçü de **0** olmalı):
> ```zsh
> printenv DATABASE_URL | grep -c .
> ```
> ```zsh
> printenv DIRECT_URL | grep -c .
> ```
> ```zsh
> printenv TEST_VERITABANI | grep -c .
> ```
>
> ### 2. Kurulu pg sürümleri
>
> `pg` ve adres çözümleyicisinin kurulu sürümlerini gösterir:
> ```zsh
> npm ls pg pg-connection-string
> ```
>
> ### 3. Uyarıyı hangi sslmode değerinin tetiklediği
>
> Adres çözümleyicisinin kodunda uyarıyla ilgili satırları gösterir (yalnızca kütüphane kodu, adres yok):
> ```zsh
> grep -n -i -E "deprecat|verify-full|libpqcompat" node_modules/pg-connection-string/index.js
> ```
>
> ### 4. Uyarı tek bir test dosyasında da çıkıyor mu
>
> En küçük veritabanı testini tek başına çalıştırır ve yalnızca uyarının kaç kez geçtiğini sayar:
> ```zsh
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test src/test-destek/duman.test.ts 2>&1 | grep -c "SECURITY WARNING"
> ```
>
> Dört adımın çıktılarını gönder. Özellikle 1. adımda **1** çıkan bir değişken varsa, başka hiçbir komut çalıştırmadan önce bunu söyle.

### Prompt 22 · 24 Eki 2026 16:45

````text
kullanici@bilgisayar abonetakip % printenv DATABASE_URL | grep -c .
0
kullanici@bilgisayar abonetakip % printenv DIRECT_URL | grep -c .
0
kullanici@bilgisayar abonetakip % printenv TEST_VERITABANI | grep -c .
0
kullanici@bilgisayar abonetakip % npm ls pg pg-connection-string
abonetakip@0.1.0 /Users/kullanici/Projeler/abonetakip
└─┬ @prisma/adapter-pg@7.10.1
  └─┬ pg@8.23.1
    ├── pg-connection-string@2.14.1
    └─┬ pg-pool@3.14.0
      └── pg@8.23.1 deduped

kullanici@bilgisayar abonetakip % grep -n -i -E "deprecat|verify-full|libpqcompat" node_modules/pg-connection-string/index.js 
102:  if (options.useLibpqCompat && config.uselibpqcompat) {
103:    throw new Error('Both useLibpqCompat and uselibpqcompat are set. Please use only one of them.')
106:  if (config.uselibpqcompat === 'true' || options.useLibpqCompat) {
128:            'SECURITY WARNING: Using sslmode=verify-ca requires specifying a CA with sslrootcert. If a public CA is used, verify-ca allows connections to a server that somebody else may have registered with the CA, making you vulnerable to Man-in-the-Middle attacks. Either specify a custom CA certificate with sslrootcert parameter or use sslmode=verify-full for proper security.'
134:      case 'verify-full': {
147:      case 'verify-full': {
148:        if (config.sslmode !== 'verify-full') {
149:          deprecatedSslModeWarning(config.sslmode)
219:function deprecatedSslModeWarning(sslmode) {
220:  if (!deprecatedSslModeWarning.warned && typeof process !== 'undefined' && process.emitWarning) {
221:    deprecatedSslModeWarning.warned = true
222:    process.emitWarning(`SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
226:- If you want the current behavior, explicitly use 'sslmode=verify-full'
227:- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=${sslmode}'
kullanici@bilgisayar abonetakip % node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test src/test-destek/duman.test.ts 2>&1 | grep -c "SECURITY WARNING"
0
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 22 · 24 Eki 2026 16:45

> Bu çıktılar çok şey söylüyor:
>
> - Terminal oturumunda tanımlı bir değişken yok; testler `.env.test`'i kullanıyor. İyi haber.
> - Kütüphanenin kodu (148–149. satırlar) uyarıyı **yalnızca `sslmode` değeri `verify-full` değilse** veriyor. Yani `verify-full` yazan bir adres bu uyarıyı üretemez.
> - Tek başına çalışan veritabanı testinde uyarı **0**.
>
> Bu durumda iki ihtimal kalıyor: Ya gördüğün uyarı değişiklikten önceki bir çalıştırmaya aitti (Terminal'de yukarı kaydırınca eski çıktı da görünür), ya da `test:db`'deki dosyalardan biri `DATABASE_URL` dışında bir adresle bağlantı açıyor. Hangisi olduğunu sayarak bulalım.
>
> Bütün veritabanı testlerini çalıştırır ve yalnızca uyarının kaç kez geçtiğini sayar (**0** bekliyorum):
> ```zsh
> npm run test:db 2>&1 | grep -c "SECURITY WARNING"
> ```
>
> **0 çıkarsa:** Gördüğün uyarı eski bir çıktıydı. Testlerin de geçtiğini görmek için `npm run test:db`'yi bir kez normal çalıştır, sonra planın 6. adımından (`npm run dev:test`) devam et.
>
> **0'dan büyük çıkarsa:** Hangi dosyanın uyarı verdiğini bulmak için şu döngüyü çalıştır. Her test dosyasını tek tek çalıştırıp dosya adının yanına uyarı sayısını yazar, adres basmaz:
> ```zsh
> for f in src/test-destek/duman.test.ts src/lib/tenant.test.ts src/lib/pasife-alma.test.ts src/lib/cac-ayari.test.ts src/lib/dashboard-verisi.test.ts src/lib/riskli-abonelikler.test.ts src/lib/giris.test.ts; do echo "$f: $(node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test --test-concurrency=1 $f 2>&1 | grep -c 'SECURITY WARNING')"; done
> ```
>
> Çıktıyı gönder; 0'dan büyük çıkan dosyaya birlikte bakarız.

### Prompt 23 · 24 Eki 2026 16:49

````text
Content-Security-Policy: frame-ancestors 'none'
````

### Claude cevabı 23 · 24 Eki 2026 16:49

> Bu satırı nerede gördüğünü bilmem gerekiyor, çünkü iki farklı anlama gelebilir:
>
> **1. Tarayıcının geliştirici araçlarında, Network sekmesinde Response Headers altında gördüysen:** Her şey yolunda. Bu, B10 ile eklediğimiz başlığın yerinde olduğunu gösterir; daha önce göremediğin "sayfa isteği" kontrolünü de tamamlamış olursun.
>
> **2. Bir hata mesajının parçası olarak gördüysen** (Console sekmesinde ya da boş/gri bir sayfada, "Refused to display… in a frame…" gibi bir cümleyle birlikte): Uygulama bir çerçevenin (iframe) içinde açılmaya çalışılıyor ve yeni başlık bunu bilerek engelliyor. Bu genelde uygulamayı tarayıcı yerine **VS Code'un içindeki önizleme penceresinde** (Simple Browser) ya da başka bir aracın gömülü önizlemesinde açınca olur. Çözüm: Adresi normal bir tarayıcı sekmesinde (Chrome ya da Safari) aç. Bu davranış B10'un amacı; bir hata değil.
>
> Hangisi olduğunu ve görüyorsan hata cümlesinin tamamını (adres içeriyorsa maskele) yaz.
>
> Bir de önceki adımın sonucu bekliyor: Şu komutun çıktısı neydi?
> ```zsh
> npm run test:db 2>&1 | grep -c "SECURITY WARNING"
> ```

### Prompt 24 · 24 Eki 2026 16:49

````text
0 , attğım satır security i aratınca çıktı
````

### Claude cevabı 24 · 24 Eki 2026 16:50

> Sorun çözüldü, uyarı yok.
>
> Ne oldu: Terminal'de **Cmd+F** araması büyük/küçük harfe bakmıyor ve **ekranın bütün geçmişinde** arıyor. `SECURITY` araması, aynı penceredeki daha önceki `curl` çıktısından `Content-Security-Policy` satırını buldu. Daha önce gönderdiğin "In the next major version…" satırı da büyük olasılıkla değişiklikten önceki bir çalıştırmadan, geçmişte kalan bir çıktıydı. Sayarak yaptığımız kontrol (**0**) kesin sonuç: `.env.test` değişikliği uyarıyı kaldırdı.
>
> Bundan sonraki kontrollerde aynı karışıklık olmasın diye:
>
> 1. Komutu çalıştırmadan önce Terminal ekranını temizle: **Cmd+K** (eski çıktıyı da siler, arama yalnızca yeni çıktıda yapılır).
> 2. Ararken tek kelime yerine tam ifadeyi yaz: `SECURITY WARNING`.
>
> ## Kaldığın yerden devam: 6. adım
>
> Terminal ekranını temizle: **Cmd+K**
>
> Uygulamayı test dalında açar:
> ```zsh
> npm run dev:test
> ```
>
> Tarayıcıda (normal bir Chrome ya da Safari sekmesinde) test hesabınla giriş yap ve Dashboard'u aç; sayılar gelmeli. Sonra Terminal'de **Cmd+F** ile `SECURITY WARNING` ara: **bulunmamalı**.
>
> Sunucuyu durdur: **Control+C**
>
> Sorun yoksa Bölüm 2'ye (`.env`, 7. adımdan itibaren) geç. Bölüm 2'nin 11. adımında da (`npm run dev`) aynı biçimde önce **Cmd+K**, sonra `SECURITY WARNING` araması yap.

### Prompt 25 · 24 Eki 2026 16:51

````text
(node:82739) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
````

### Claude cevabı 25 · 24 Eki 2026 16:52

> Bu önemli, burada durup nedenini bulalım. Az önce `npm run test:db` **aynı `.env.test` adresiyle** 0 uyarı verdi ve kütüphane kodu `verify-full` için uyarı vermiyor. Demek ki `dev:test` ile açılan uygulama, bağlantıyı **başka bir adresle** kuruyor olabilir. En olası aday `.env` dosyası (canlı adres; Bölüm 2'yi henüz yapmadığımız için orada hâlâ `sslmode=require` yazıyor).
>
> Bu doğruysa, `dev:test` sanılandan farklı olarak canlı veritabanına bağlanıyor olabilir. Kesinleşene kadar **`dev:test`'te hiçbir şey ekleme, değiştirme ya da iptal etme.** Bölüm 2'ye de geçme.
>
> ### 1. Klasördeki ortam dosyalarının adları
>
> Proje klasöründe adı `.env` ile başlayan dosyaların **yalnızca adlarını** gösterir (`.env.local` ya da `.env.development` gibi beklenmedik bir dosya var mı diye bakıyoruz):
> ```zsh
> ls -a | grep '^\.env'
> ```
>
> ### 2. Uyarının nereden geldiğini görmek
>
> Terminal ekranını temizle: **Cmd+K**
>
> Uygulamayı test dalında, uyarıların kaynağını (dosya yollarını) da yazacak biçimde açar:
> ```zsh
> NODE_OPTIONS=--trace-warnings npm run dev:test
> ```
>
> Sonra sırayla:
>
> 1. Tarayıcıyı açmadan önce Terminal'de **Cmd+F** ile `SECURITY WARNING` ara. Bu aşamada çıkıyor mu?
> 2. Tarayıcıda giriş sayfasını aç ve test hesabınla giriş yap. Tekrar ara: şimdi çıkıyor mu?
> 3. Uyarı çıktığında, hemen altında `at ...` ile başlayan satırlar göreceksin. **İlk 10 tanesini** gönder. Bu satırlar yalnızca dosya yolu ve fonksiyon adı içerir; adres içermez. Yine de içlerinde `postgresql://` geçen bir şey görürsen o kısmı maskele.
>
> Sunucuyu durdur: **Control+C**
>
> ### 3. Hangi veritabanını gördüğünü kontrol et
>
> Dashboard'u açtığında gördüğün veriler (firma adı, müşteriler) **test dalındaki demo verisi** mi, yoksa canlıdaki gerçek verin mi? Yalnızca "test verisi" ya da "canlı verisi" diye yanıtla, isim yazmana gerek yok.
>
> Bu üç sonuçla uyarının kaynağını ve `dev:test`'in gerçekte hangi veritabanına bağlandığını kesinleştiririz.

### Prompt 26 · 24 Eki 2026 16:56

````text
çıkmadı security warning , kullanici@bilgisayar abonetakip % NODE_OPTIONS=--trace-warnings npm run dev:test

> abonetakip@0.1.0 dev:test
> node --env-file=.env.test src/test-destek/dev-test.ts

(node:90953) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/dev-test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
    at warnTypelessPackageJsonFile (node:internal/modules/esm/get_format:158:13)
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:212:7)
    at defaultGetFormat (node:internal/modules/esm/get_format:283:36)
    at defaultLoadSync (node:internal/modules/esm/load:159:16)
    at #loadAndMaybeBlockOnLoaderThread (node:internal/modules/esm/loader:809:12)
    at #loadSync (node:internal/modules/esm/loader:841:53)
    at ModuleLoader.load (node:internal/modules/esm/loader:790:26)
    at ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:501:31)
    at #getOrCreateModuleJobAfterResolve (node:internal/modules/esm/loader:567:36)
    at afterResolve (node:internal/modules/esm/loader:614:52)
Uygulama TEST DALINA bağlı olarak başlatılıyor (.env.test). Canlı veritabanı kullanılmaz.
▲ Next.js 16.4.2 (Turbopack)
- Local:         http:/ 
- Network:       http://1 
- Environments: .env
✓ Ready in 202ms
✓ Running next.config.ts took 13ms

 GET /dashboard 200 in 1563ms (next.js: 43ms, application-code: 1520ms)
 GET /giris 200 in 22ms (next.js: 8ms, application-code: 14ms)
 POST /dashboard 200 in 79ms (next.js: 1.7ms, application-code: 77ms)
  └─ ƒ cikisAction() in 3ms src/app/(auth)/actions.ts
 GET /api/events 200 in 2.2s (next.js: 17ms, application-code: 2.2s)
 GET /dashboard 200 in 303ms (next.js: 0.4ms, application-code: 303ms)
 POST /giris 200 in 692ms (next.js: 2ms, application-code: 690ms)
  └─ ƒ girisAction({"durum":"bos"}, {}) in 368ms src/app/(auth)/actions.ts
^C GET /api/events 200 in 39.5s (next.js: 1.2ms, application-code: 39.5s)
````

### Claude cevabı 26 · 24 Eki 2026 16:56

> Bu çıktı temiz ve aynı zamanda soruyu kesin olarak cevaplıyor:
>
> - Uygulama veritabanına gerçekten bağlanmış: `GET /dashboard` ve `POST /giris` (giriş) veritabanı sorgusu yapan istekler.
> - Buna rağmen `SECURITY WARNING` **yok**. Canlı `.env` dosyasında hâlâ `sslmode=require` yazıyor; uygulama o adresi kullansaydı uyarı çıkardı. Uyarı çıkmadığına göre uygulama `.env.test`'teki (`verify-full`) adresi, yani **test dalını** kullanıyor. `dev:test` doğru çalışıyor; kaygılandığım durum yok.
> - Önceki uyarı, büyük olasılıkla ekran temizlenmeden önceki eski bir çıktıdan geldi.
>
> Çıktıdaki `MODULE_TYPELESS_PACKAGE_JSON` uyarısı bununla ilgisiz ve zararsız: Node, `dev-test.ts` dosyasının biçimini tahmin etmek zorunda kaldığını söylüyor. `package.json`'a `"type": "module"` eklemek Next.js'in davranışını etkileyebilir; bugünkü kapsamın dışında, dokunmuyoruz. Önceki çalıştırmalarda da vardı; yalnızca `--trace-warnings` yüzünden bu kez ayrıntısıyla göründü.
>
> Bölüm 1 tamamlandı. **Bölüm 2'ye (`.env`, 7. adım) geçebilirsin.** 11. adımda `npm run dev` öncesinde **Cmd+K** ile ekranı temizlemeyi unutma; o adımda uyarının **çıkmaması** canlı adresin de doğru değiştiğini gösterecek.
>
> Not: Bu çıktıyı prompt günlüğüne yapıştırırken iki yeri maskele: dosya yollarındaki kullanıcı adı (`/Users/...`, ad taramasına takılır) ve satır başındaki Terminal istemi.

### Prompt 27 · 24 Eki 2026 17:05

````text
kullanici@bilgisayar abonetakip % curl -sS --max-time 90 -o /dev/null -w "DURUM: %{http_code}\n" "https://$SERVIS.onrender.com/giris"
DURUM: 200
kullanici@bilgisayar abonetakip % rm .env.test.yedek .env.yedek
kullanici@bilgisayar abonetakip % git status --short
kullanici@bilgisayar abonetakip % cp .env.test.yedek .env.test
cp: .env.test.yedek: No such file or directory
````

### Claude cevabı 27 · 24 Eki 2026 17:05

> Endişelenme, o son komut hiçbir şeyi değiştirmedi. `cp` yedek dosyayı bulamadığı için (bir satır önce silmiştin) hata verip durdu; `.env.test` olduğu gibi kaldı. O komut yalnızca "Geri dönüş" bölümü içindi, sorun yokken çalıştırılması gerekmiyordu.
>
> Yine de emin olmak için iki dosyayı sayarak kontrol edelim (adres basmaz).
>
> `.env.test`'te `DATABASE_URL` hâlâ `verify-full` mı (**1** olmalı):
> ```zsh
> grep -c '^DATABASE_URL=.*sslmode=verify-full' .env.test
> ```
>
> `.env`'de `DATABASE_URL` hâlâ `verify-full` mı (**1** olmalı; `cp .env.yedek .env` komutunu da çalıştırdıysan o da aynı hatayla durmuş olmalı):
> ```zsh
> grep -c '^DATABASE_URL=.*sslmode=verify-full' .env
> ```
>
> İkisi de **1** ise B8 tamamlanmış demektir:
>
> | Yer | `DATABASE_URL` | `DIRECT_URL` |
> |---|---|---|
> | `.env.test` | `verify-full` ✅ | `require` (bilerek) |
> | `.env` | `verify-full` ✅ | `require` (bilerek) |
> | Render | `verify-full` ✅, canlı `DURUM: 200` | Dokunulmadı |
> | Yedekler | Silindi | |
> | Depo | Değişiklik yok | |
>
> Tek bir kontrol eksik kaldıysa: Render **Logs** sekmesinde yeni yayından sonra `SECURITY WARNING` aramasını yaptın mı? Yaptıysan ve sonuç çıkmadıysa B8 kapandı.
>
> ## Sırada: ADR güncellemesi
>
> Senin belirlediğin sıraya göre en sona ADR kaldı (ve sana bırakılan B7 kararı). İstersen bir sonraki adımda ADR için plan veririm: hangi bölümlere ne yazılacağı (Gün 12 kararları, değişiklik geçmişi tablosu, bilinen sınırlar listesi, B12 ve canlıda görülen başlıklar), dosyayı `docs/02_ADR.md` içinde nereye ekleyeceğimiz ve commit biçimi. Önce güncel ADR'yi depodan okuyup mevcut düzenine uyacağım.

### Prompt 28 · 24 Eki 2026 17:05

````text
adr güncellemesine geçebiliriz
````

### Claude cevabı 28 · 24 Eki 2026 17:07

> Önce güncel ADR'yi depodan okuyup mevcut düzenini çıkarıyorum.
> ADR'yi okudum (güncel `main`, 8ade6c3). Düzeni şöyle: başta genel bölümler (1–5), sonra her gün için `## Gün N kararları (tarih): konu` bölümü; içinde **Durum/Sonuç**, `### Kararlar` (K-numaralı), test kapsamı, elle test tablosu, bilinen sınırlar ve süreç notları. Gün 12'yi aynı düzende yazmayı öneriyorum.
>
> ## ADR planı
>
> ### Değişecek yerler (yalnızca `docs/02_ADR.md`)
>
> | Yer | Değişiklik | Nasıl |
> |---|---|---|
> | **4. Bilinen riskler** | "Herkese açık depo" maddesindeki "Gün 12'de repo ve geçmiş taranır" ifadesi "Gün 12'de tarandı, sonuç: Gün 12 bölümü" olur | Tek satırlık `perl` düzenlemesi, sayarak doğrulama |
> | **5. Değişiklik geçmişi** | Yeni satır: "24 Ekim 2026 / Gün 12 güvenlik gözden geçirmesi: giriş deneme sınırı, firma tablosu kimlik kuralı, güvenlik başlıkları, `DATABASE_URL` için `verify-full`, `fast-uri` güncellemesi / Neden" | Tek satırlık `perl` ekleme |
> | **Dosya sonu** | Yeni bölüm: `## Gün 12 kararları (24 Ekim 2026): güvenlik gözden geçirme` | VS Code'da dosyanın sonuna yapıştırma, sonra `tail` ve sayarak kontrol |
>
> Eski gün bölümlerine **dokunmuyorum**; ADR bir kayıt defteri. Eski kayıtlarda "Gün 12'ye ertelendi" diyen maddelerin durumu yeni bölümde bir tabloyla kapatılır.
>
> ### Gün 12 bölümünün içeriği
>
> **Durum ve sonuç:** PR #40 (`449afbb`, B1) ve PR #41 (`8ade6c3`, B6 + B10 + B12) birleşti, canlıda doğrulandı. B8 yalnızca ortam değişkenlerinde, depoda değişiklik yok. Test sayıları.
>
> **Bulgu tablosu:** B1–B12'nin tamamı: madde, risk, karar (düzeltildi / bilinen sınır / karar bekliyor), PR.
>
> **Kararlar:**
> - **K12.1 Giriş deneme sınırı (B1):** 15 dakikada 5 deneme, 15 dakika blok; e-posta başına, bellekte; deneme parola kontrolünden önce sayılır; kayıtlı ve kayıtsız e-postaya aynı cevap. **IP sınırı yok:** Render'ın `X-Forwarded-For` davranışı belgeli değil; canlı yanıtta Cloudflare başlıkları görüldü ama bu da belgeli değil. **Kayıt sınırı yok** (A seçeneği).
> - **K12.2 Firma tablosu kimlik kuralı (B6, issue #24 kapandı):** ezme yerine AND; nesne biçimli kimlikler (`in`, `equals`, `not`); kendi kimliğiyle akış (`cac-ayari.ts`) değişmedi.
> - **K12.3 Güvenlik başlıkları (B10):** beş başlık ve değerleri, `X-Powered-By` kapalı. **Tam CSP yok** (Next.js satır içi betikleri ve HMR). **HSTS yok** (canlıda Render da göndermiyor).
> - **K12.4 Veritabanı TLS (B8):** `DATABASE_URL` üç yerde `verify-full`. `DIRECT_URL` `require` kaldı: Prisma 7 dokümanı yalnızca `prefer`, `disable`, `require` listeliyor; Render build komutu yalnızca `npx prisma generate` (geçiş çalıştırmıyor).
> - **K12.5 Bağımlılık (B12):** `fast-uri` 3.1.8 → 3.1.9, yalnızca `package-lock.json`; yol `prisma > @prisma/dev > @prisma/streams-local > ajv > fast-uri`; `ajv` değişmedi.
> - **K12.6 Kabul edilen sınırlar:** B2, B3, B4, B5, B9, B11 (her biri bir satır gerekçeyle) ve diğer tablolarda `where` içindeki `tenantId`'nin ezilmesi.
> - **K12.7 B7 (tetikleyici):** senin kararına göre yazılacak (aşağıdaki 3. soru).
>
> **Secret taraması (madde 5):** `main` temiz, `.gitignore` doğru, `.env` hiç commit edilmemiş, Gün 2 sızıntısı yalnızca iki eski uzak dalda ve parola yenilenmiş.
>
> **Önceki kayıtların durumu:** Gün 6 "SSL modu" → kapandı (K12.4); Gün 6 "tetikleyici" → K12.7; Gün 7 G1 "deneme sınırı, Gün 12'ye ertelendi" → kapandı (K12.1); Gün 9 ve 11'deki issue #24 ve SSL notları → kapandı.
>
> **Test kapsamı ve elle test tablosu:** yeni testler (sayaç, giriş, firma tablosu, başlıklar); `dev:test`'te 6 deneme; yerel ve canlı `curl` başlıkları; CAC kaydetme; SSE; HMR; `test:db`'de 0 uyarı; `dev:test`'te uyarı yok; canlı 200.
>
> **Süreç notları:** Terminal'de **Cmd+F** aramasının ekran geçmişini de taraması yanıltıcı oldu, kontroller sayarak yapıldı; `wc -l` 454/455 farkı dosya sonundaki satır sonu karakterinden; `curl` adres hatası ve `SERVIS` değişkeniyle çözüm; `MODULE_TYPELESS_PACKAGE_JSON` uyarısına bilerek dokunulmadı.
>
> ### Dal ve commit
>
> Dal `gun12-adr`, tek commit: `docs: Gün 12 ADR güncellemesi (güvenlik gözden geçirme)`, üç tarama, proje kuralındaki ekler. ADR'de kullanıcı adı, gerçek adres ya da kişisel bilgi geçmeyecek; Render adresi `[RENDER_ADRESI]` olarak yazılacak.
>
> ## Yazmadan önce senden dört bilgi
>
> 1. **Test sayıları:** Son çalıştırmanın sayılarını şu iki komutla verebilir misin (yalnızca özet satırlarını gösterir)?
>    ```zsh
>    npm test 2>&1 | grep -E "^# (tests|pass|fail)"
>    ```
>    ```zsh
>    npm run test:db 2>&1 | grep -E "^# (tests|pass|fail)"
>    ```
> 2. **İki doğrulanmamış sonuç:** `npm audit --omit=dev` (B12 sonrası) **0 açık** mı dedi? Render **Logs**'ta B8 yayınından sonra `SECURITY WARNING` araması boş mu çıktı?
> 3. **B7:** Kararını şimdi mi veriyorsun, yoksa ADR'ye "karar bekliyor" diye mi yazalım? (Seçenekler: tetikleyiciyi Gün 12'de eklemek, ileriye ertelemek, ya da kabul edilen sınır olarak kapatmak.)
> 4. **PR kapsamı:** Gün 11'de olduğu gibi Gün 12'nin prompt günlüğü ve `prompt_cevap` dosyası ayrı bir "docs: Gün 12 belgeleri" PR'ında mı gidecek, yoksa ADR ile aynı PR'da mı?
>
> ## Fark ettiğim iki küçük şey (dokunmayı önermiyorum, senin kararın)
>
> - Gün 11 bölümündeki `### Parça B kararları` başlığının başında iki boşluk var; GitHub bunu başlık olarak göstermeyebilir.
> - Gün 10 bölümünde `npm run build [sonuç yazılacak]` yer tutucusu kalmış.
>
> İstersen ikisini de bu commit'te tek satırlık düzenlemelerle düzeltebilirim.
>
> ## Varsayımlar
>
> - Tarih olarak bugünü (24 Ekim 2026) yazacağım; bütün Gün 12 işleri bugün yapıldı.
> - ADR bölümünün uzunluğu yaklaşık 150–180 satır olacak. Önceki kesilme şüphesinden sonra yapıştırmanın ardından dosya sonunu ve başlık sayısını komutla kontrol edeceğiz.
> - "Bitiş kontrolü"ndeki "GitHub'da `.env` aratıp doğrula" adımını henüz yapmadın varsaydım; ADR'ye yazmadan önce GitHub deposunda arama kutusuna `filename:.env` yazıp yalnızca iki örnek dosyanın çıktığını görmek iyi olur. Sonucu ADR'ye ekleriz.

### Prompt 29 · 24 Eki 2026 17:11

````text
ADR planını onaylıyorum. Cevaplar:
1) npm test: 105 test, 105 geçti, 0 hata. npm run test:db: 57 test, 57 geçti, 0 hata.
2) npm audit --omit=dev: 0 açık. Render Logs'ta SECURITY WARNING araması: boş GitHub Go to file ".env": yalnızca iki örnek dosya 
3) B7: kabul edilen sınır olarak kapat, ADR'de Gün 12'ye planlanmıştı ama bilinçli yapılmadı diye yaz, gerekçe: uygulama içi koruma testlerle doğrulanmış, canlı veritabanına elle geçiş riski.
4) ADR kendi PR'ında (gun12-adr). Prompt günlüğü ve prompt_cevap ayrı docs PR'ında, Gün 12 sohbeti bitince. Küçük düzeltmelere (Gün 10 ve 11) dokunma, Gün 14'e kalsın.
Şimdi ADR değişikliğini adım adım ver. Dosya sonuna yapıştırılacak bölümü tek blokta ver, eksik kalmasın.
````

### Claude cevabı 29 · 24 Eki 2026 17:15

> Önce bölümü ve iki küçük düzenleme komutunu depomun bir kopyasında deniyorum.
> Değişiklikleri kendi kopyamda baştan sona denedim: iki düzenleme komutu, dosya sonuna ekleme ve üç tarama. Sonuçlar aşağıdaki "olmalı" değerlerinin kaynağı. Bölümde ad, adres ya da parola yok; üç tarama da 0 verdi.
>
> ## 1. Dal aç
>
> `main` dalına geçer:
> ```zsh
> git switch main
> ```
>
> Birleştirilmiş son hâli (8ade6c3) indirir:
> ```zsh
> git pull
> ```
>
> Yeni dalı açar ve ona geçer:
> ```zsh
> git switch -c gun12-adr
> ```
>
> ## 2. "4. Bilinen riskler" maddesini güncelle
>
> Değiştirilecek ifadenin dosyada bir kez geçtiğini sayar (**1** olmalı):
> ```zsh
> grep -c "Gün 12'de repo ve geçmiş taranır\." docs/02_ADR.md
> ```
>
> "taranır" ifadesini "tarandı; sonuç Gün 12 bölümünde" yapar:
> ```zsh
> perl -pi -e 's/Gün 12\x27de repo ve geçmiş taranır\./Gün 12\x27de repo ve geçmiş tarandı; sonuç "Gün 12 kararları" bölümünde (Secret taraması)./' docs/02_ADR.md
> ```
>
> Değişikliğin yapıldığını sayar (**1** olmalı):
> ```zsh
> grep -c "Gün 12'de repo ve geçmiş tarandı" docs/02_ADR.md
> ```
>
> ## 3. "5. Değişiklik geçmişi" tablosuna satır ekle
>
> Yeni satırın ekleneceği yeri sayar (**1** olmalı):
> ```zsh
> grep -c '^| \[Tarih\] | Depo görünürlüğü' docs/02_ADR.md
> ```
>
> O satırın hemen altına Gün 12 satırını ekler:
> ```zsh
> perl -pi -e '$_ .= "| 24 Ekim 2026 | Gün 12 güvenlik gözden geçirmesi: giriş deneme sınırı, firma tablosu kimlik kuralı (issue #24), güvenlik başlıkları, `DATABASE_URL` için `sslmode=verify-full`, `fast-uri` güncellemesi; tetikleyici bilinçli olarak yapılmadı | Dokuz maddelik güvenlik kontrol listesi; ayrıntı ve bilinen sınırlar Gün 12 bölümünde |\n" if /^\| \[Tarih\] \| Depo görünürlüğü/' docs/02_ADR.md
> ```
>
> Satırın eklendiğini sayar (**1** olmalı):
> ```zsh
> grep -c '^| 24 Ekim 2026 | Gün 12 güvenlik' docs/02_ADR.md
> ```
>
> ## 4. Dosya sonuna Gün 12 bölümünü ekle
>
> ADR'nin son satırının sonunda satır sonu karakteri yok. Bu komut önce bir satır sonu ve bir boş satır ekler, böylece yeni başlık ayrı bir paragraf olur:
> ```zsh
> printf '\n\n' >> docs/02_ADR.md
> ```
>
> ADR'yi VS Code'da açar:
> ```zsh
> code docs/02_ADR.md
> ```
>
> VS Code'da:
> 1. Dosyanın en sonuna git: **Cmd+Aşağı ok**. İmleç boş son satırda olmalı.
> 2. Aşağıdaki bloğun **tamamını** kopyala ve yapıştır: **Cmd+V**.
> 3. Kaydet: **Cmd+S**.
>
> ```markdown
> ## Gün 12 kararları (24 Ekim 2026): güvenlik gözden geçirme
>
> **Durum:** Gözden geçirme tamamlandı; bulgular düzeltildi ya da gerekçesiyle bilinen sınır olarak kapatıldı.
> - PR #40 (squash commit `449afbb`): giriş deneme sınırı (B1). Test dalında elle ve canlıda doğrulandı.
> - PR #41 (squash commit `8ade6c3`, başlık "fix: güvenlik gözden geçirme düzeltmeleri"): firma tablosu
>   kimlik kuralı (B6, issue #24 kapandı), güvenlik başlıkları (B10), `npm audit fix` (B12). Dalda üç ayrı
>   commit vardı. Test dalında elle ve canlıda doğrulandı.
> - B8 yalnızca ortam değişkenlerinde yapıldı (`.env`, `.env.test`, Render); depoda değişiklik yok.
>
> **Sonuç:** `npm test` 105 test, `npm run test:db` 57 test, hepsi geçiyor. `npm run lint` ve
> `npm run build` temiz. `npm audit --omit=dev` 0 açık.
>
> ### Yöntem
>
> Gözden geçirme dokuz maddelik kontrol listesiyle yapıldı: kiracı izolasyonu, yetki, kimlik doğrulama,
> girdi doğrulama, secret yönetimi, SSE, hata mesajları, giriş denemesi, bağımlılıklar. Kod depodan okundu;
> uygulamadaki bütün veritabanı sorguları (15 dosya) tek tek incelendi. Önce yalnızca bulgu raporu
> çıkarıldı, düzeltmeler onaydan sonra parça parça yapıldı.
>
> ### Bulgu tablosu
>
> | No | Madde | Bulgu | Risk | Karar |
> |---|---|---|---|---|
> | B1 | 8 | Giriş ve kayıtta deneme sınırı yok (Gün 7, G1) | Orta | Düzeltildi: giriş için (K12.1). Kayıt sınırı yok (K12.6) |
> | B2 | 3 | Oturum çerezi çıkışta sunucuda iptal edilmiyor, 7 gün geçerli (Gün 7, G2) | Düşük | Bilinen sınır (K12.6) |
> | B3 | 6 | Çıkış yapılan sekmenin SSE bağlantısı en fazla 15 dakika açık kalabiliyor | Düşük | Bilinen sınır (K12.6) |
> | B4 | 6 | SSE hub tek süreçte, bellekte | Düşük | Bilinen sınır (K12.6) |
> | B5 | 6 | SSE'de toplam bağlantı üst sınırı yok, yalnızca firma başına 20 | Düşük | Bilinen sınır (K12.6) |
> | B6 | 1 | Firma tablosunda başka kimlik istenince sessizce kendi firma dönüyor (issue #24) | Düşük | Düzeltildi (K12.2) |
> | B7 | 1 | Veritabanı düzeyinde "tenantId değiştirilemez" tetikleyicisi yok | Düşük | Bilinçli olarak yapılmadı (K12.7) |
> | B8 | 5 | `pg` sürücüsünün `sslmode` uyarısı (ileride daha zayıf TLS davranışı) | Düşük | Düzeltildi (K12.4) |
> | B9 | 5 | Gün 2 sızıntısı iki eski uzak dalda duruyor (parola yenilenmiş) | Düşük (kalan) | Bilinen sınır (K12.6) |
> | B10 | 3 | Güvenlik başlıkları yok, `X-Powered-By` gönderiliyor | Düşük | Düzeltildi (K12.3) |
> | B11 | 3 | Kayıt formu e-postanın kayıtlı olduğunu söylüyor (Gün 7, G4) | Düşük | Bilinen sınır (K12.6) |
> | B12 | 9 | `fast-uri` 3.0.0–3.1.8 bilinen açık (dolaylı bağımlılık) | Düşük (npm audit: orta) | Düzeltildi (K12.5) |
>
> Bulgu çıkmayan maddeler: yetki (rol kontrolleri sunucuda ve sorgulardan önce), girdi doğrulama (bütün
> sunucu işlemleri `validation.ts` kullanıyor, URL kimlikleri ve sorgu parametreleri beyaz listeyle
> kontrol ediliyor), hata mesajları (`catch` blokları sabit metin logluyor, hata ekranları yalnızca kısa
> kod gösteriyor). Yüksek risk bulgusu çıkmadı.
>
> ### Kararlar
>
> **K12.1: Giriş deneme sınırı, e-posta başına (B1)**
> - **Karar:** Yeni `src/lib/giris-siniri.ts`. Aynı e-postaya 15 dakika içinde en fazla 5 deneme; 6.
>   deneme ve sonrası 15 dakika reddedilir. Anahtar küçük harfe çevrilmiş e-postadır. Sayaç bellekte,
>   tek örnek `globalThis` üzerinde (sse-hub.ts ile aynı yöntem). Yeni paket yok.
> - **Sayma sırası:** Deneme, parola kontrolünden ÖNCE ve aynı senkron adımda sayılır. Böylece aynı anda
>   gelen çok sayıda istek, bcrypt beklenirken sınırı aşamaz. Blok sırasında veritabanı sorgusu ve bcrypt
>   hiç çalışmaz (işlemci de korunur). Blok sırasında doğru parola da reddedilir. Başarılı girişte sayaç
>   silinir.
> - **Cevap:** Sayaç e-postanın kayıtlı olup olmadığına bakmaz. Kayıtlı ve kayıtsız e-posta aynı sayıda
>   denemeden sonra aynı mesajı alır ("Çok fazla hatalı deneme yapıldı. Lütfen 15 dakika sonra tekrar
>   deneyin."); cevap e-postanın varlığını ele vermez. Bloktan önceki mesaj değişmedi.
> - **Bellek:** Arka planda zamanlayıcı yok. Süresi dolmuş kayıt, o e-posta yeniden denendiğinde silinir.
>   Liste 10.000 kayda ulaşınca önce süresi dolmuş kayıtlar, gerekirse en eski kayıtlar silinir.
> - **IP başına sınır yok:** Render'ın `X-Forwarded-For` başlığını nasıl yazdığı resmi dokümanda yok;
>   bulunabilen tek bilgi 2021 tarihli bir özellik isteğindeki çalışan cevabı ve istemcinin başlığı
>   sahteleyebildiğine dair bir kullanıcı gözlemi. Canlı yanıtta Cloudflare başlıkları (`server: cloudflare`,
>   `cf-ray`) görüldü, ama Cloudflare'in istemci IP başlıkları da Render dokümanında yok.
> - **Kayıt sınırı yok:** E-posta başına sınır kayıtta anlamsız, IP güvenilir değil. Sunucu geneli bir kayıt
>   sınırı (B seçeneği) gerçek kullanıcıları da durdurabileceği için seçilmedi (bkz. Bilinen sınırlar).
>
> **K12.2: Firma tablosunda kimlik ezilmez, AND ile uygulanır (B6, issue #24)**
> - **Karar:** `src/lib/tenant.ts` içinde yeni `firmaKosulu()`. Firma (Tenant) tablosunda `where` içinde
>   bir `id` verilirse artık oturumdaki firma kimliğiyle ezilmez; ikisi `AND` içinde birlikte uygulanır.
>   Başka firmanın kimliği istenirse sonuç veritabanının doğal "bulunamadı" cevabıdır: okumada `null`,
>   boş liste ya da 0, `...OrThrow` ve `update`'te hata. Eskiden istek sessizce kullanıcının kendi
>   firmasına uygulanıyordu (sızıntı yoktu ama yanıltıcıydı).
> - **Nesne biçimli kimlik:** `{ in: [...] }`, `{ equals: ... }`, `{ not: ... }` de aynı kuralla
>   `AND` içine girer. `{ in: [A, B] }` yalnızca A'yı, `{ not: A }` hiçbir kaydı bulmaz. Koşulda önceden
>   `AND` varsa (tek nesne ya da liste) korunur.
> - **Etkilenmeyen akışlar:** Uygulamadaki dört Firma tablosu çağrısı ya kimlik vermiyor ya da bir satır
>   önce aynı filtreden okunan kendi kimliğini veriyor (`cac-ayari.ts`). Ham `prisma` kullanan iki çağrı
>   (`auth.ts`) filtre dışında. Ayarlar sayfasında CAC kaydetme test dalında elle denendi.
> - **Testler:** `tenant.test.ts` "Firma tablosu" bölümü: eski davranışı belgeleyen test yeni davranışa
>   göre güncellendi; okuma, `...OrThrow`, kendi kimliğiyle güncelleme, nesne biçimli kimlik ve korunan
>   `AND` için testler eklendi.
>
> **K12.3: Güvenlik başlıkları (B10)**
> - **Karar:** `next.config.ts` içinde `headers()` ile bütün yollara (`/:path*`) beş başlık:
>
> | Başlık | Değer |
> |---|---|
> | `X-Frame-Options` | `DENY` |
> | `Content-Security-Policy` | `frame-ancestors 'none'` |
> | `X-Content-Type-Options` | `nosniff` |
> | `Referrer-Policy` | `strict-origin-when-cross-origin` |
> | `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
>
> - **`X-Powered-By`:** `poweredByHeader: false` ile kapatıldı.
> - **Tam CSP yok:** CSP'de bilerek yalnızca `frame-ancestors` var. Betik ve bağlantı kuralları Next.js'in
>   satır içi betiklerini ve geliştirme modunun anında yenileme (HMR) bağlantısını bozabilir; nonce gibi ek
>   iş ister. 2 haftalık kapsam için ağır bulundu.
> - **HSTS yok:** Bilerek eklenmedi. Yanlış bir değer geri alınması zor bir tarayıcı kaydı bırakır. Canlı
>   yanıtta Render'ın da `Strict-Transport-Security` göndermediği görüldü.
> - **SSE ve HMR:** Eklenen başlıklar SSE yanıtının kendi `Content-Type` ve `Cache-Control` başlıklarıyla
>   çakışmaz; elle denemede canlı uyarı bandı ve HMR çalıştı.
> - **Test:** Yeni `src/test-destek/guvenlik-basliklari.test.ts` (`npm test`): `next.config.ts`'yi okur,
>   beş başlığı, değerlerini, `poweredByHeader`'ı ve HSTS'in olmadığını denetler.
>
> **K12.4: Veritabanı TLS: `DATABASE_URL` için `sslmode=verify-full` (B8)**
> - **Karar:** `DATABASE_URL` üç yerde (`.env`, `.env.test`, Render ortam değişkenleri) `sslmode=require`
>   yerine `sslmode=verify-full`. `channel_binding=require` değişmedi.
> - **Gerekçe:** Uyarıyı uygulamanın kullandığı `pg` sürücüsü veriyor ve yalnızca `DATABASE_URL`'i
>   kullanıyor (`src/lib/db.ts`). Bugünkü bağlantı zaten bu düzeyde doğrulanıyordu; değişiklik bunu açıkça
>   yazıyor, böylece `pg` 9 sürümünde daha zayıf davranışa düşülmez. Neon dokümanı `verify-full`'u
>   öneriyor; Neon'un sertifikası sistemin ve Node.js'in güvendiği bir kök sertifikaya dayanıyor.
> - **`DIRECT_URL` değişmedi (`sslmode=require`):** Geçişler `DIRECT_URL` ile ve `pg`'den ayrı bir Prisma
>   aracıyla çalışıyor (`prisma.config.ts`). Prisma 7 dokümanı PostgreSQL adresi için yalnızca `prefer`,
>   `disable` ve `require` değerlerini listeliyor. Render build komutu yalnızca `npx prisma generate`;
>   canlıda geçiş çalışmıyor ve `generate` veritabanına bağlanmıyor.
> - **Doğrulama:** Adresler hiçbir komutla ekrana basılmadı; değişiklik `grep -c` ile sayarak ve yedekle
>   `diff` satır sayısı karşılaştırılarak doğrulandı. Kurulu `pg-connection-string` 2.14.1 kodu uyarıyı
>   yalnızca `verify-full` olmayan değerler için veriyor.
>
> **K12.5: Bağımlılık açığı (B12)**
> - **Karar:** `npm audit fix` (`--force` olmadan). Yalnızca `package-lock.json` değişti; `fast-uri`
>   3.1.8 → 3.1.9. `ajv` ve başka hiçbir paketin sürümü değişmedi.
> - **Bağlam:** Yol `prisma > @prisma/dev > @prisma/streams-local > ajv > fast-uri`; Prisma geliştirme
>   aracı, web uygulamasının koduna girmiyor. `npm audit` "orta" dese de bu yüzden düşük derecelendirildi.
>   Düzeltmeden sonra `npm audit --omit=dev` 0 açık.
> - **Bağımlılık listesi:** 6 bağımlılık ve 10 geliştirme bağımlılığının hepsi kodda kullanılıyor ve
>   `package-lock.json` içinde `registry.npmjs.org` adresinden geliyor.
>
> **K12.6: Bilinen sınır olarak kabul edilenler**
> - **B2, oturum iptali:** Çıkış yalnızca tarayıcıdaki çerezi siler; çerezin kopyası 7 gün geçerli kalır.
>   Çerez `httpOnly`, `sameSite: lax`, üretimde `secure`; kodda XSS yolu bulunmadı. Sunucu tarafı iptal
>   (kullanıcıda oturum sürümü sütunu) geçiş dosyası gerektirdiği için yapılmadı.
> - **B3, SSE ve çıkış:** Başka sekmeden çıkış yapılınca açık sekme en fazla 15 dakika daha firmanın
>   uyarılarını (müşteri adı) alır (K10.4). B2'ye bağlı.
> - **B4, SSE tek süreç:** Render'da sunucu sayısı 1'de tutulur (K10.1).
> - **B5, SSE toplam sınır:** Firma başına 20 bağlantı sınırı var, sunucu geneli sınır yok. Kayıt sınırı
>   olmadığı için çok sayıda firma açılıp bağlantı tutulabilir.
> - **B9, eski dallar:** Gün 2 sızıntısı `feat/gun-02-veri-modeli` ve `fix/env-yer-tutucu` uzak dallarında
>   duruyor. Parola yenilendiği için adres bağlantıda kullanılamaz; kalan bilgi eski sunucu adıdır. Geçmişi
>   yeniden yazmak gerekli görülmedi.
> - **B11, kayıtta e-posta varlığı:** E-posta doğrulaması olmadan kapatmak kullanıcıyı şaşırtır. Giriş
>   tarafı bunu gizliyor.
> - **Kayıt sınırı:** K12.1.
> - **Diğer tablolarda `tenantId` ezilmesi:** Customer, Plan, Subscription, SubscriptionEvent ve User
>   tablolarında `where` içine yazılan `tenantId` hâlâ oturumdakiyle ezilir (K12.2'deki kural yalnızca
>   Firma tablosunda). Sızıntı yok; uygulama kodunda `where` içinde `tenantId` hiç geçmiyor (tarandı).
>
> **K12.7: Veritabanı tetikleyicisi bilinçli olarak yapılmadı (B7)**
> - Gün 6'da "Gün 12, `tenantId` değiştirilemez tetikleyicisi" olarak planlanmıştı; Gün 12'de bilinçli
>   olarak yapılmadı ve bilinen sınır olarak kapatıldı.
> - **Gerekçe:** Uygulama içi koruma (`tenant.ts` beyaz listesi, `tenantId` ve `id` güncelleme yasağı,
>   ilişki alanı yasağı) otomatik testlerle doğrulanmış durumda. Abonelik ve olay tabloları ayrıca bileşik
>   anahtarlarla veritabanında korunuyor. Tetikleyici, canlı veritabanına elle yazılmış bir geçiş
>   gerektirir; bunun riski (Prisma'nın sonraki geçişlerde tetikleyiciyi silmeye çalışması, canlıda geri
>   alma) kalan faydadan büyük bulundu.
> - **Sınır:** Müşteri, plan ve kullanıcı tablolarında veritabanı düzeyinde ikinci savunma hattı yok.
>
> ### Secret taraması (madde 5)
>
> | Kontrol | Sonuç |
> |---|---|
> | Git geçmişinde adı `.env` içeren dosyalar | Yalnızca `.env.example` ve `.env.test.example` |
> | `.env` ve `.env.test` | `.gitignore` içindeki `.env*` kuralıyla yok sayılıyor |
> | GitHub "Go to file" ile `.env` araması | Yalnızca iki örnek dosya |
> | Mevcut dosyalarda parola ve Neon sunucu adı taraması | Boş ve 0 |
> | Git geçmişinde parola ve sunucu adı taraması | Yalnızca iki eski uzak dalda (B9); bugünkü canlı ve test parolaları geçmişte hiç geçmiyor |
> | `main` dalı | Temiz |
>
> ### Önceki kayıtların durumu
>
> | Kayıt | Durum |
> |---|---|
> | Gün 6, "İleride: Gün 12, tenantId değiştirilemez tetikleyicisi" | Bilinçli olarak yapılmadı (K12.7) |
> | Gün 6, "İleride: SSL modu" | Kapandı (K12.4) |
> | Gün 6, "Açık 2" ve issue #24 (Gün 9 ve 11 notları dahil) | Kapandı (K12.2) |
> | Gün 7, G1 "Girişte deneme sınırı yok, Gün 12'ye ertelendi" | Kapandı (K12.1) |
> | Gün 7, G2 ve G4 | Bilinen sınır olarak kaldı (K12.6, B2 ve B11) |
> | Gün 4 ve 11, "pg sslmode uyarısı, Gün 12'de ele alınacak" | Kapandı (K12.4) |
>
> ### Test kapsamı
>
> | Dosya | Komut | Ne denetler |
> |---|---|---|
> | `src/lib/giris-siniri.test.ts` (yeni) | `npm test` | 5 deneme ve blok, blok süresi, blokun uzamaması, pencerenin sıfırlanması, başarılı girişin sayacı silmesi, blok sırasında başarının bloğu kaldırmaması, e-postaların birbirinden ayrı olması, büyük/küçük harf, bellek temizliği ve üst sınır |
> | `src/lib/giris.test.ts` (yeni) | `npm run test:db` | Kayıtlı ve kayıtsız e-postaya her denemede aynı cevap, 6. denemede blok mesajı, büyük harfle yazılan e-postanın aynı blokta kalması |
> | `src/lib/tenant.test.ts` (güncellendi) | `npm run test:db` | K12.2 |
> | `src/test-destek/guvenlik-basliklari.test.ts` (yeni) | `npm test` | K12.3 |
>
> `giris.test.ts` başlamadan önce `canli-koruma.ts` ile test dalında olduğunu denetler.
>
> ### Elle test
>
> | Durum | Ortam | Sonuç |
> |---|---|---|
> | Aynı e-postaya 5 yanlış, 6. deneme | Test dalı ve canlı | 5 kez "E-posta veya parola hatalı.", 6.'da blok mesajı |
> | Blok sırasında doğru parola, büyük harfle e-posta | Test dalı | Blok mesajı |
> | Kayıtsız e-postayla aynı deneme | Test dalı | Mesajlar ve sıraları aynı |
> | Sunucu yeniden başlatılınca doğru parola | Test dalı | Giriş yapıldı (sayaç bellekte) |
> | `/giris` ve `/api/events` (oturumsuz) başlıkları, `curl` | Yerel | Beş başlık var, `X-Powered-By` yok; `/api/events` 401 |
> | `/giris` başlıkları, `curl` | Canlı | Beş başlık var, `X-Powered-By` yok, HSTS yok, 200 |
> | Ayarlar'da CAC kaydetme | Test dalı | Kaydedildi, sayfa yenilenince değer kaldı, LTV/CAC hesaplandı |
> | Abonelik iptali ve canlı uyarı bandı | Test dalı | Bant geldi (SSE çalışıyor) |
> | Dosya kaydedince sayfanın yenilenmesi | Test dalı | Çalıştı (HMR) |
> | `npm run test:db` sonrası `SECURITY WARNING` sayısı | Test dalı | 0 |
> | `npm run dev:test` ve `npm run dev` ile giriş ve Dashboard | Test dalı ve canlı veritabanı (yalnızca okuma) | `SECURITY WARNING` yok |
> | B8 sonrası Render günlüğü ve canlı site | Canlı | `SECURITY WARNING` yok, `/giris` 200 |
>
> `npm run dev:test`'te uyarının çıkmaması, uygulamanın `.env.test` adresini (test dalını) kullandığını da
> gösterdi: o sırada canlı `.env` hâlâ `sslmode=require` içeriyordu ve kullanılsaydı uyarı çıkardı.
>
> ### Bilinen sınırlar
> - Giriş sayacı tek Render sürecinin belleğinde: sunucu yeniden başlarsa sıfırlanır, ikinci bir sunucu
>   açılırsa her biri ayrı sayar.
> - Başkası bir kullanıcının e-postasıyla 6 yanlış deneme yaparsa o kullanıcı 15 dakika giriş yapamaz.
> - IP başına giriş sınırı ve kayıt sınırı yok (K12.1). Biri sürekli yeni e-postalarla bcrypt'i
>   çalıştırabilir.
> - Tam CSP ve HSTS yok (K12.3).
> - `DIRECT_URL` `sslmode=require` ile kalıyor (K12.4).
> - K12.6 ve K12.7'deki kabul edilen sınırlar.
> - Terminaldeki `MODULE_TYPELESS_PACKAGE_JSON` uyarısına (`dev-test.ts`) dokunulmadı; `package.json`'a
>   `"type": "module"` eklemek Next.js'in davranışını etkileyebilir.
>
> ### Süreç notları
> - Gözden geçirme önce yalnızca rapor olarak yapıldı; her parça için plan, onay, sonra tek tek adımlar.
> - `package.json`'da yalnızca test satırlarına dosya adı eklendi (`perl` ile, `git diff` ile
>   doğrulandı). B12'de `package.json` değişseydi durulacaktı; değişmedi.
> - Terminal'de Cmd+F araması ekranın bütün geçmişini taradığı için iki kez yanıltıcı sonuç verdi (eski bir
>   uyarı satırı ve `Content-Security-Policy` satırı). Uyarı kontrolleri bundan sonra çıktıyı
>   `grep -c "SECURITY WARNING"` ile sayarak ya da ekran Cmd+K ile temizlendikten sonra yapıldı.
> - Uzun bir test dosyasının yapıştırmada kesildiğinden şüphelenildi; commit'teki dosya `git show` ile
>   kontrol edildi ve tam çıktı. `wc -l` 454/455 farkı dosya sonundaki satır sonu karakterinden.
> - Canlı `curl` denemesinde adres yapıştırılırken bozuldu; Render servis adı bir değişkene konarak
>   çözüldü. Render adresi bu belgede yazılmaz.
> - Commit ekleri: Claude Opus 5.5.
> ```
>
> Not: Bloğun en dışındaki ` ```markdown ` ve ` ``` ` satırları sohbetteki çerçevedir, **onları yapıştırma**. Bloğun sağ üstündeki kopyala düğmesini kullanırsan zaten yalnızca içerik kopyalanır.
>
> ## 5. Eksik kalmadığını doğrula
>
> Gün 12 başlığı bir kez var mı (**1** olmalı):
> ```zsh
> grep -c '^## Gün 12 kararları' docs/02_ADR.md
> ```
>
> Yedi karar başlığı var mı (**7** olmalı):
> ```zsh
> grep -c '^\*\*K12\.' docs/02_ADR.md
> ```
>
> Son satır (bölümün son satırı **"- Commit ekleri: Claude Opus 5.5."** olmalı):
> ```zsh
> tail -n 1 docs/02_ADR.md
> ```
>
> Toplam satır sayısı (**1225** olmalı; 1224 çıkarsa yalnızca dosya sonundaki satır sonu eksiktir, sorun değil):
> ```zsh
> wc -l < docs/02_ADR.md
> ```
>
> Değişiklik özetini gösterir (**1 file changed, 235 insertions(+), 2 deletions(-)** olmalı; ±1 satır sonu farkı olabilir):
> ```zsh
> git --no-pager diff --stat
> ```
>
> Değişen tek dosyanın ADR olduğunu gösterir (yalnızca `M docs/02_ADR.md`):
> ```zsh
> git status --short
> ```
>
> Sayılardan biri farklıysa (özellikle K12 sayısı 7'den azsa ya da son satır farklıysa) **dur** ve çıktıyı gönder; yapıştırma kesilmiş olabilir.
>
> ## 6. Tarama ve commit
>
> ADR'yi commit'e hazırlar:
> ```zsh
> git add docs/02_ADR.md
> ```
>
> Parola deseni taraması (çıktı boş olmalı):
> ```zsh
> git --no-pager grep --cached -c -E "npg_[A-Za-z0-9]{6,}"
> ```
>
> Sunucu adı taraması (sonuç 0 olmalı):
> ```zsh
> git --no-pager grep --cached -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
> ```
>
> Ad taraması (sonuç 0 olmalı):
> ```zsh
> git --no-pager grep --cached -h -i -E "[AD_DESENI]" | sed 's/ozgesoganci1-bot//Ig' | grep -ic -E "[AD_DESENI]"
> ```
>
> ADR'yi commit eder:
> ```zsh
> git commit -m "docs: Gün 12 ADR güncellemesi (güvenlik gözden geçirme)" -m $'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01ERuUmicCCSJwyX4zWam3oq'
> ```
>
> ## 7. PR
>
> GitHub Desktop'ta **Publish branch**, ardından **Create Pull Request**.
>
> - **Başlık:** `docs: Gün 12 ADR güncellemesi (güvenlik gözden geçirme)`
> - **Açıklama:**
>
> ```
> Gün 12 güvenlik gözden geçirmesinin ADR kaydı.
>
> - Gün 12 kararları: bulgu tablosu (B1–B12), K12.1–K12.7, secret taraması, önceki kayıtların durumu, test kapsamı, elle test, bilinen sınırlar.
> - 4. Bilinen riskler: repo ve geçmiş taraması yapıldı.
> - 5. Değişiklik geçmişi: Gün 12 satırı.
> - Kod değişikliği yok.
>
> 🤖 Generated with [Claude Code](https://claude.com/claude-code)
>
> https://claude.ai/code/session_01ERuUmicCCSJwyX4zWam3oq
> ```
>
> GitHub'da PR sayfasının **Files changed** sekmesinde ADR'nin görünümüne bir göz at (tablolar doğru çiziliyor mu), sonra **Squash and merge**. Birleştirince `git switch main` ve `git pull`.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **Elle test tablosu:** "Blok sırasında doğru parola, büyük harfle e-posta", "kayıtsız e-postayla aynı deneme", "sunucu yeniden başlatılınca doğru parola" ve Bölüm 2'deki `npm run dev` satırlarını, verdiğim elle deneme adımlarını uyguladığını ve "doğrulandı / her şey yolunda" dediğin için yazdım. Bunlardan birini yapmadıysan yapıştırmadan önce o satırı tablodan sil ya da "denenmedi" yaz.
> - **B1 canlı doğrulaması:** "Parça 1 canlıda doğrulandı" demiştin; tabloda "test dalı ve canlı" olarak yazdım.
> - **Test kapsamı tablosu:** Yalnızca dosyaları ve ne denetlediklerini yazdım; test sayısını dosya bazında yazmadım, toplamlar (105 ve 57) "Sonuç" satırında.
> - **Satır sayıları:** 1225 ve 235/2 değerleri, aynı adımları kendi kopyamda uyguladığımda çıkan sayılar. VS Code'un dosya sonuna satır sonu ekleyip eklememesine göre ±1 değişebilir.
>
> Sources:
> - [Send the correct X_FORWARDED_FOR (Render feedback)](https://feedback.render.com/features/p/send-the-correct-xforwardedfor)
> - [Prisma ORM 7: PostgreSQL](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql)
> - [Neon: Securing connections](https://neon.com/docs/connect/connect-securely)

### Prompt 30 · 24 Eki 2026 17:19

````text
wc -l < docs/02_ADR.md bu 1223 çıktısı verdi
````

### Claude cevabı 30 · 24 Eki 2026 17:19

> 1223, beklediğim 1225'ten 2 satır az. Bu, kesilme olabileceği gibi yalnızca boş satır farkı da olabilir (VS Code bazen yapıştırırken ya da kaydederken dosya sonundaki boş satırları siler). Hangisi olduğunu sayarak ayıralım. **Henüz commit etme.**
>
> Önceki adımın kontrolleri (beklenenler parantez içinde):
>
> Gün 12 başlığı (**1**):
> ```zsh
> grep -c '^## Gün 12 kararları' docs/02_ADR.md
> ```
>
> Karar başlıkları (**7**):
> ```zsh
> grep -c '^\*\*K12\.' docs/02_ADR.md
> ```
>
> Değişiklik geçmişi satırı (**1**):
> ```zsh
> grep -c '^| 24 Ekim 2026 | Gün 12 güvenlik' docs/02_ADR.md
> ```
>
> Son satır (**- Commit ekleri: Claude Opus 5.5.**):
> ```zsh
> tail -n 1 docs/02_ADR.md
> ```
>
> Yalnızca Gün 12 bölümünü ayırıp ölçen dört komut (bölüm, başlıktan dosya sonuna kadar):
>
> Bölümün satır sayısı (**231**; dosya sonunda satır sonu yoksa **230**):
> ```zsh
> sed -n '/^## Gün 12 kararları/,$p' docs/02_ADR.md | wc -l
> ```
>
> Bölümdeki boş satır sayısı (**29**):
> ```zsh
> sed -n '/^## Gün 12 kararları/,$p' docs/02_ADR.md | grep -c '^$'
> ```
>
> Bölümdeki tablo satırı sayısı (**57**):
> ```zsh
> sed -n '/^## Gün 12 kararları/,$p' docs/02_ADR.md | grep -c '^|'
> ```
>
> Bölümdeki iki boşlukla başlayan devam satırı sayısı (**64**):
> ```zsh
> sed -n '/^## Gün 12 kararları/,$p' docs/02_ADR.md | grep -c '^  '
> ```
>
> Eski bölümün sonu ile yeni başlık arasındaki geçişi gösterir (başlığın üstünde **bir boş satır** ve onun üstünde "kullanıcılarıyla yapıldı." görünmeli):
> ```zsh
> grep -n -B2 '^## Gün 12 kararları' docs/02_ADR.md
> ```
>
> Sekiz çıktıyı gönder. Nasıl yorumlayacağımız:
>
> - **Bölüm 230/231, boş satır 29, tablo 57, devam 64 ve son satır doğruysa:** Bölüm eksiksiz; eksik 2 satır bölümün dışında (büyük olasılıkla `printf` ile eklediğimiz boş satırlardan biri ya da 3. adımdaki tablo satırı). Son komut ve "24 Ekim" sayısı hangisi olduğunu gösterecek; küçük bir düzeltmeyle devam ederiz.
> - **Boş satır sayısı 29'dan az, diğerleri doğruysa:** Yapıştırmada boş satırlar kaybolmuş. Markdown tablolarının çizilmesi için tablodan önceki boş satırlar gerekli; nerede eksik olduğunu bulup ekleriz.
> - **Tablo, devam ya da K12 sayısı eksikse veya son satır farklıysa:** Yapıştırma kesilmiş; bölümü silip daha güvenli bir yolla yeniden ekleriz.

### Prompt 31 · 24 Eki 2026 17:21

````text
kullanici@bilgisayar abonetakip % grep -c '^## Gün 12 kararları' docs/02_ADR.md
1
kullanici@bilgisayar abonetakip % grep -c '^\*\*K12\.' docs/02_ADR.md
7
kullanici@bilgisayar abonetakip % grep -c '^| 24 Ekim 2026 | Gün 12 güvenlik' docs/02_ADR.md
1
kullanici@bilgisayar abonetakip % tail -n 1 docs/02_ADR.md
- Commit ekleri: Claude Opus 5.5.%                                                                                      kullanici@bilgisayar abonetakip % sed -n '/^## Gün 12 kararları/,$p' docs/02_ADR.md | wc -l
     230
kullanici@bilgisayar abonetakip % sed -n '/^## Gün 12 kararları/,$p' docs/02_ADR.md | grep -c '^$'
29
kullanici@bilgisayar abonetakip % sed -n '/^## Gün 12 kararları/,$p' docs/02_ADR.md | grep -c '^|'
57
kullanici@bilgisayar abonetakip % sed -n '/^## Gün 12 kararları/,$p' docs/02_ADR.md | grep -c '^  '
64
kullanici@bilgisayar abonetakip % grep -n -B2 '^## Gün 12 kararları' docs/02_ADR.md
992-- Kullanıcılar sayfası hâlâ yer tutucu; finance denemeleri test dalında önceden açılmış finance
993-  kullanıcılarıyla yapıldı.
994:## Gün 12 kararları (24 Ekim 2026): güvenlik gözden geçirme
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 31 · 24 Eki 2026 17:21

> Bölüm eksiksiz: 7 karar, 29 boş satır, 57 tablo satırı, 64 devam satırı ve doğru son satır. Yapıştırma kesilmemiş. Eksik 2 satırın açıklaması da çıktılarda:
>
> 1. **Başlığın üstündeki boş satır yok** (993'ten doğrudan 994'e geçiyor). `printf` ile eklediğimiz boş satır, büyük olasılıkla VS Code kaydederken dosya sonundaki boş satırları sildiği için kaybolmuş. GitHub başlığı yine gösterir ama ADR'nin geri kalanıyla aynı düzende olsun diye ekleyelim.
> 2. **Dosya sonunda satır sonu karakteri yok** (son satırın yanındaki `%` ve bölüm sayısının 230 olması). Zararsız, ama ekleyelim; ADR'nin önceki hâlinde de yoktu, bu fırsatla düzelir.
>
> Başlığın üstüne bir boş satır ekler (yalnızca "kullanıcılarıyla yapıldı." ile Gün 12 başlığının arasına):
> ```zsh
> perl -0pi -e 's/(kullanıcılarıyla yapıldı\.)\n(## Gün 12 kararları)/$1\n\n$2/' docs/02_ADR.md
> ```
>
> Dosyanın sonuna satır sonu karakteri ekler:
> ```zsh
> printf '\n' >> docs/02_ADR.md
> ```
>
> ## Kontrol
>
> Başlığın üstünde artık boş bir satır olmalı (çıktıda `994-` satırı boş, `995:` başlık):
> ```zsh
> grep -n -B2 '^## Gün 12 kararları' docs/02_ADR.md
> ```
>
> Toplam satır sayısı (**1225** olmalı):
> ```zsh
> wc -l < docs/02_ADR.md
> ```
>
> Son satırın yanında artık `%` olmamalı:
> ```zsh
> tail -n 1 docs/02_ADR.md
> ```
>
> Değişiklik özeti (**1 file changed, 235 insertions(+), 2 deletions(-)** olmalı):
> ```zsh
> git --no-pager diff --stat
> ```
>
> Değişen tek dosya ADR olmalı:
> ```zsh
> git status --short
> ```
>
> Dördü de tutuyorsa önceki mesajın **6. adımından** (`git add docs/02_ADR.md`, üç tarama, commit) devam et.

### Prompt 32 · 24 Eki 2026 17:25

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 32 · 24 Eki 2026 17:25

> Ekran doğru: PR #42, tek commit (`01aef6d`), `gun12-adr` → `main`. Birleştirmeden önce tek bir düzeltme öneririm.
>
> **Extended description** kutusunda GitHub ekleri kendisi sıralamış: `Claude-Session` üstte, `Co-authored-by` altta ve aralarında boş satır var. Proje kuralı ikisinin **ardışık, tek blokta** ve şu sırada olmasını istiyor. Kutunun içeriğini tamamen silip yerine şunu yaz:
>
> ```
> Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
> Claude-Session: https://claude.ai/code/session_01ERuUmicCCSJwyX4zWam3oq
> ```
>
> - Kutuya tıkla, **Cmd+A** ile hepsini seç, sil, yukarıdaki iki satırı yapıştır.
> - **Commit message** satırına dokunma; `docs: Gün 12 ADR güncellemesi (güvenlik gözden geçirme) (#42)` doğru.
> - Sonra **Confirm squash and merge**.
>
> Birleştirince Terminal'de:
>
> `main` dalına geçer:
> ```zsh
> git switch main
> ```
>
> Birleştirilmiş hâli indirir:
> ```zsh
> git pull
> ```
>
> `main`'deki son commit'i ve eklerini gösterir (son iki satır `Co-Authored-By` ve `Claude-Session` olmalı):
> ```zsh
> git --no-pager log -1 --format=%B
> ```
>
> Böylece Gün 12'nin ADR kısmı da kapanmış olur. Kalanlar senin planına göre: Gün 12 sohbeti bitince prompt günlüğü ve `prompt_cevap` için ayrı docs PR'ı (yapıştırmadan önce ad, Terminal istemi, dosya yollarındaki kullanıcı adı ve Render adresi maskelenecek), Gün 10 ve 11'deki iki küçük düzeltme de Gün 14'e.
>
> Not: PR #40 ve #41'i birleştirirken de GitHub bu kutuyu aynı biçimde doldurmuş olabilir. Merak edersen `git --no-pager log -3 --format='%h %s%n%b'` ile bakabilirsin; geçmişteki commit'leri değiştirmeye gerek yok, yalnızca Gün 14 notlarına yazılabilir.

