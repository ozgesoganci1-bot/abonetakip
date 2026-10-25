# AboneTakip

## Proje özeti
AboneTakip, küçük yazılım firmaları için çok kiracılı (multi-tenant) bir abonelik takip SaaS'ıdır. Firmalar müşterilerini, planlarını ve aboneliklerini yönetir; MRR, churn, ARPU, LTV ve LTV/CAC metriklerini tek bir dashboardda izler. Her firma yalnızca kendi verisini görür.

Sunucu Tabanlı Programlama dersi dönem projesidir (tek geliştirici, 2 hafta).

## Canlı adres
https://abonetakip.onrender.com

Site ücretsiz planda çalışır. Bir süre kullanılmadıysa ilk açılış yaklaşık 1 dakika sürebilir (bkz. [Bilinen sınırlar](#bilinen-sınırlar)).

## Demo hesaplar
Canlı sitede iki sahte firma hazırdır. Bütün demo hesapların parolası: **`demo1234`**

| Firma | Rol | E-posta |
|---|---|---|
| Mavi Yazılım | manager (yönetici) | `yonetici.mavi@demo.example` |
| Mavi Yazılım | finance (finans) | `finans.mavi@demo.example` |
| Kuzey Teknoloji | manager (yönetici) | `yonetici.kuzey@demo.example` |
| Kuzey Teknoloji | finance (finans) | `finans.kuzey@demo.example` |

- Bütün kişi, firma ve e-posta bilgileri sahtedir. `.example` alan adı belgeler için ayrılmıştır, gerçek bir kişiye ait olamaz.
- Demo hesaplar herkese açıktır. Biri veriyi bozar ya da parolayı değiştirirse geliştirici `npm run seed:demo:canli` ile iki demo firmayı sıfırlar (bkz. [Demo verisi](#demo-verisi-seed)).
- İki firmanın verisi bilerek farklıdır. Örneğin Mavi'de LTV/CAC "sağlıklı" (3 ve üzeri), Kuzey'de "Dikkat" (3'ün altında) görünür. Kesin rakamlar verinin kurulduğu güne göre değişir.

## İnceleme için
1. **Siteyi ısıt:** Canlı adresi açıp giriş sayfası gelene kadar bekleyin (uykudaysa yaklaşık 1 dakika). Ardından bir demo hesapla girip dashboard'u bir kez yükleyin: veritabanının uyanma gecikmesi bu ilk sorguda yaşanır, sonraki sayfalar hızlı açılır.
2. **Yönetici gözüyle:** `yonetici.mavi@demo.example` ile girin. Dashboard (metrikler, MRR grafiği, riskli abonelikler), Müşteriler, Planlar, Abonelikler, Ayarlar (CAC) ve Kullanıcılar (liste ve finans kullanıcısı ekleme) sayfalarına bakın. Kullanıcı eklemeyi denerseniz `@demo.example` uzantılı bir e-posta kullanın.
3. **Rol farkı:** `finans.mavi@demo.example` ile girin. Kayıt sayfaları açıktır; Ayarlar ve Kullanıcılar sayfaları yetki yok ekranı gösterir.
4. **Kiracı izolasyonu:** İkinci bir tarayıcıda Kuzey Teknoloji hesabıyla girin (bu README'deki "İki firmanın karışmadığını doğrulama" bölümüne bakın).
5. **Gerçek zamanlı uyarı:** Aynı firmanın iki hesabını iki ayrı tarayıcıda açın. Birinde bir aboneliği iptal edin, uyarı ötekinde sayfa yenilenmeden görünür. (İptal demo veriyi değiştirir; demo veri sıfırlanabilir.)
6. **Kod ve süreç:** `npm test` veritabanı istemez. Kararlar [ADR](docs/02_ADR.md), yapay zekâ ile çalışma süreci [Prompt Günlüğü](docs/03_Prompt_Gunlugu.md) ve [prompt ve cevaplar](prompt_cevap/README.md) içindedir.

## Teknoloji
- Next.js (App Router) ve TypeScript
- PostgreSQL (Neon) ve Prisma 7 (PostgreSQL sürücü adaptörü ile)
- Barındırma: Render (PaaS), sürekli açık Node sunucusu. Serverless ve edge kullanılmaz.
- Gerçek zamanlı uyarılar: Server-Sent Events (SSE)
- Parola özeti: bcrypt (`bcryptjs`)

## Yerel kurulum (macOS, sıfırdan)
Hesapların açılması, programların kurulması ve Neon projesinin oluşturulması adım adım [Kurulum rehberinde](docs/00_Kurulum_Rehberi.md) anlatılır. Aşağıdaki adımlar, programlar kuruluyken projeyi sıfırdan çalıştırmak içindir. Komutlar macOS Terminal (zsh) içindir.

1. **Depoyu indir:** GitHub Desktop'ta `File > Clone Repository` ile depoyu `~/Projeler/abonetakip` klasörüne indir. Ardından Terminal'de klasöre geç:
   ```
   cd ~/Projeler/abonetakip
   ```
2. **Node sürümünü kontrol et:** Proje Node v26.11.1 ile geliştirildi ve denendi. Testler ve betikler TypeScript dosyalarını doğrudan çalıştırdığı için güncel bir Node sürümü (22.18 veya daha yeni) gerekir.
   ```
   node -v
   ```
3. **Paketleri kur:**
   ```
   npm install
   ```
4. **`.env` dosyasını oluştur:** Örnek dosyayı kopyala, sonra VS Code'da açıp yer tutucuların yerine kendi değerlerini yaz.
   ```
   cp .env.example .env
   ```
   Değişkenler [Ortam değişkenleri](#ortam-değişkenleri) bölümünde. Gerçek değerler yalnızca bu dosyada durur, asla depoya girmez.
5. **Prisma istemcisini üret:** Şemadan `generated/prisma` klasörünü oluşturur.
   ```
   npx prisma generate
   ```
6. **Veritabanı tablolarını kur:** Depodaki hazır geçişleri (migration) veritabanına uygular. Yeni geçiş oluşturmaz.
   ```
   npx prisma migrate deploy
   ```
7. **Uygulamayı çalıştır:** Tarayıcıda http://localhost:3000 adresini aç. `/kayit` sayfasından firma ve yönetici hesabı oluşturabilirsin. Durdurmak için `Control + C`.
   ```
   npm run dev
   ```

### Test dalı (isteğe bağlı, veritabanı testleri ve demo verisi için)
Bu bölüm yalnızca geliştirici içindir. Projeyi incelemek için gerekmez: çalıştırılması gereken tek test komutu `npm test`'tir ve veritabanı istemez (bkz. [Testler](#testler)).

`npm run test:db`, `npm run dev:test` ve demo betikleri canlı veritabanına değil, Neon'daki ayrı bir **test dalına** (branch) bağlanır.

1. Neon panelinde (Branches) canlı dalın kopyası olarak (child branch) ayrı bir dal oluştur. Tablolar kopyayla birlikte gelir, ayrıca kurulum komutu çalıştırılmaz.
2. Proje kökünde `.env.test` dosyası oluştur ve bu dalın adreslerini yaz. İçinde `.env` ile aynı değişkenler (test dalının adresleriyle) ve ek olarak `TEST_VERITABANI=evet` satırı bulunur.
3. Uygulamayı test dalında açmak için `npm run dev:test`. Bu komut `.env.test` canlıyla aynı sunucuyu gösteriyorsa çalışmaz.

### Kurulum adımlarının varsayımları
| Adım | Varsayım |
|---|---|
| 1 | Git ve GitHub Desktop kurulu, depo erişimin var. Klasör iCloud ile eşitlenen bir yerde (Masaüstü, Belgeler) değil. |
| 2 | Doğrulanan: proje Node v26.11.1 ile geliştirildi ve bütün testler bu sürümde geçti. Doğrulanmayan: 22.18 alt sınırı Node'un TypeScript dosyalarını ek ayar olmadan çalıştırmaya başladığı sürümdür; projede bu sürümle ayrıca deneme yapılmadı. |
| 3 | npm, Node ile birlikte gelir. İnternet bağlantısı var. |
| 4 | Neon'da bir proje açılmış, havuzlu (`-pooler`) ve doğrudan bağlantı adresleri alınmış. `SESSION_SECRET` için `openssl rand -base64 32` ile değer üretilmiş. |
| 5 | Prisma 7 istemciyi `npm install` sırasında kendiliğinden üretmeyebilir. Bu yüzden komut ayrıca çalıştırılır; Render derlemesi de bu komutu çalıştırır. |
| 6 | Geçişler `DIRECT_URL` (doğrudan bağlantı) üzerinden uygulanır (`prisma.config.ts`). Veritabanı boş ya da yalnızca bu projenin geçişlerini içeriyor. |
| 7 | 3000 numaralı port boş. Doluysa Next.js başka bir port önerir. |
| Test dalı 1 | Canlı dal, geçişleri uygulanmış güncel tabloları içeriyor; kopya o andaki tabloları ve verileri alır. Kopya alındıktan sonra canlıya yeni bir geçiş uygulanırsa test dalına ayrıca uygulanması gerekir. |
| Test dalı 2 | `.env.test` canlıdan farklı bir Neon sunucusunu gösteriyor. Göstermiyorsa test betikleri bağlanmadan durur. |

## Ortam değişkenleri
Yalnızca adlar ve yer tutucular aşağıdadır. Gerçek değerler `.env` (yerel), `.env.test` (yerel test dalı) ve Render'daki ortam değişkenlerinde durur, asla depoya girmez.

| Değişken | Açıklama | Örnek (yer tutucu) |
|---|---|---|
| `DATABASE_URL` | Uygulamanın kullandığı havuzlu (pooled) Neon adresi | `[DATABASE_URL]` |
| `DIRECT_URL` | Prisma geçişleri için doğrudan (direct) Neon adresi | `[DIRECT_URL]` |
| `SESSION_SECRET` | Oturum çerezini imzalayan gizli anahtar (en az 16 karakter) | `[SESSION_SECRET]` |
| `TEST_VERITABANI` | Yalnızca `.env.test` içinde: `evet`. Test betiklerinin canlıya bağlanmasını önler. | `evet` |

## Rol ve yetkiler

| Yetki | manager | finance |
|---|---|---|
| Dashboard görüntüleme | ✅ | ✅ |
| Müşteri, plan ve abonelik kayıtları (ekleme, düzenleme, abonelik başlatma, yenileme, iptal) | ✅ | ✅ |
| Müşteri ve plan pasife alma | ✅ | ❌ |
| Ayarlar (CAC dahil) | ✅ | ❌ |
| Kullanıcı yönetimi | ✅ | ❌ |

Rol kontrolü sunucu tarafında yapılır; arayüzde bir düğmeyi gizlemek yetki sayılmaz. Bir firmanın kullanıcısı başka bir firmanın verisine erişemez, deneme "Kayıt bulunamadı" yanıtı alır.

## Uygulama
### Giriş, kayıt ve oturum
- Kayıt: `/kayit` sayfasında firma ve ilk kullanıcı (yönetici) birlikte oluşturulur. Giriş: `/giris`. Oturumsuz kullanıcı panel sayfalarında `/giris` sayfasına yönlendirilir.
- Oturum, imzalı ve httpOnly bir çerezde 7 gün tutulur. Çerezde yalnızca kullanıcı kimliği vardır; firma ve rol her istekte veritabanından okunur. Parolalar bcrypt ile özetlenir, düz metin saklanmaz.
- Panel sayfaları: Dashboard, Müşteriler, Planlar, Abonelikler (tüm rollere açık); Ayarlar ve Kullanıcılar (yalnızca yönetici). Finans kullanıcısı yöneticiye ait sayfalarda "Bu sayfaya erişim yetkiniz yok" mesajını görür.

### Müşteri ve plan yönetimi
- **Müşteriler** (`/musteriler`): ekleme, düzenleme ve pasife alma. E-posta isteğe bağlıdır. Doluysa firma içinde benzersizdir (pasif müşteriler dahil); başka firmada aynı e-posta olabilir.
- **Planlar** (`/planlar`): ad, aylık ya da yıllık aralık ve fiyat (tam sayı TL). Aktif aboneliği olan planın fiyatı ve aralığı değiştirilemez (geçmiş ayların MRR'ı bozulmasın diye).
- **Pasife alma:** kayıtlar silinmez. Yalnızca `manager` pasife alabilir. Aktif aboneliği olan müşteri ya da plan pasife alınamaz. Pasife alınan kayıt yeniden aktifleştirilemez.

### Abonelikler
- `/abonelikler` sayfasında üç işlem vardır: **başlat**, **yenile**, **iptal et**.
- Bir müşterinin aynı anda yalnızca bir aktif aboneliği olabilir; bu kural veritabanı düzeyinde de zorlanır.
- Yenileme yalnızca aktif abonelikte yapılır. İptal edilen abonelik geri açılmaz, müşteri için yeni abonelik başlatılır.
- Her durum değişikliği olay kaydı olarak saklanır (STARTED, RENEWED, CANCELED). Abonelik ve olay aynı işlemde yazılır.
- Dönem bitişi `currentPeriodEnd` alanında tutulur. Ay sonları taşmaz (31 Ocak + 1 ay = 28 Şubat).
- **Riskli abonelikler:** dönem bitişine 7 günden az kalmış ya da süresi geçmiş aktif abonelikler listelenir.
- **Gerçek zamanlı uyarı:** abonelik iptali SSE ile yalnızca ilgili firmanın kullanıcılarına anında bildirilir. Riskli abonelikler SSE ile gönderilmez, dashboard sayfasındaki listede sayfa açılışında hesaplanır.

## Metrik formülleri
Bütün hesaplar `src/lib/metrikler.ts` içinde saf fonksiyonlardır ve birim testleri vardır. Aylar Türkiye saatine göre hesaplanır.

| Metrik | Formül |
|---|---|
| MRR | Aktif aboneliklerin aylık fiyat toplamı (yıllık plan fiyatı / 12) |
| Churn (aylık) | Ay içinde ayrılan müşteriler / ay başındaki aktif müşteriler |
| ARPU | MRR / aktif müşteri sayısı |
| Ortalama ömür (ay) | 1 / churn |
| LTV | ARPU x ortalama ömür |
| LTV/CAC | LTV / CAC. CAC, Ayarlar sayfasından girilir. 3 ve üzeri sağlıklı kabul edilir. |

- Churn müşteri bazlıdır: ay içinde plan değiştiren (iptal edip yeni abonelik başlatan) müşteri churn sayılmaz; aynı ay içinde gelip giden müşteri de sayılmaz.
- Sıfıra bölme gereken durumlarda değer 0 değil "hesaplanamadı" olarak, nedeniyle birlikte gösterilir. Örnekler: ay başında aktif müşteri yoksa churn; bu ay iptal yoksa ortalama ömür ve LTV; CAC girilmemişse LTV/CAC.
- Dashboard'daki aylık MRR grafiği son 12 ayı gösterir.

## Mimari özet
- Tek Next.js uygulaması ve tek PostgreSQL veritabanı. Mikroservis veya ek katman yoktur.
- Render üzerinde sürekli açık bir Node sunucusu çalışır. Veritabanı Neon'dadır: uygulama havuzlu adresi, Prisma geçişleri doğrudan adresi kullanır. Geçişler Render'da değil, geliştiricinin bilgisayarında uygulanır; Render derlemesi yalnızca `npx prisma generate` ve `npm run build` yapar.
- **Çok kiracılık:** ortak tablolar ve her tabloda `tenantId`. Bütün uygulama sorguları tek bir merkezi filtreden (`src/lib/tenant.ts`) geçer; `tenantId` istemciden alınmaz, oturumdan okunur. Müşteri, plan, abonelik ve olay kayıtları birleşik yabancı anahtarlarla aynı firmaya bağlanır.
- **Gerçek zamanlı:** SSE bağlantıları tek sunucu sürecinin belleğinde tutulur.

Kararların gerekçeleri: [Mimari Karar Kaydı (ADR)](docs/02_ADR.md).

## Testler
Projeyi incelemek için çalıştırılması gereken tek test komutu **`npm test`**'tir. Veritabanı istemez, yalnızca `npm install` sonrasında çalışır. Diğer komutlar geliştirme sırasında kullanılır.

| Komut | Ne yapar? | Veritabanı |
|---|---|---|
| `npm test` | Birim testleri (metrikler, dönem hesabı, doğrulama, yetki, giriş sınırı, demo senaryosu vb.) | Gerekmez |
| `npm run test:db` | Kiracı izolasyonu, pasife alma, dashboard verisi, riskli abonelikler, giriş, kullanıcı ekleme | Neon test dalı (`.env.test`) |
| `npx tsc --noEmit` | TypeScript tip kontrolü | Gerekmez |
| `npm run lint` | ESLint kontrolü | Gerekmez |

## Demo verisi (seed)
| Komut | Ne yapar? |
|---|---|
| `npm run seed:demo` | Neon test dalına iki demo firmayı kurar. Firmalar daha önce kurulduysa yalnızca onları silip yeniden kurar. |
| `npm run seed:demo:canli` | Aynısını canlı veritabanında yapar. Terminalde `evet` yazarak onay ister. |
| `npm run demo:veri -- <e-posta>` | Test dalında, verilen kullanıcının (boş) firmasına küçük bir elle test senaryosu ekler. |
| `npm run demo:gecmis -- <e-posta>` | Test dalında, MRR grafiğini sınamak için 14 aya yayılan küçük bir senaryo ekler. |

**Seed ne kurar?** Her demo firmada 1 yönetici, 1 finans kullanıcısı, 3 plan (2 aylık, 1 yıllık) ve 18 müşteri bulunur. Abonelikler son 12 aya yayılır: başlayanlar, yenilenenler, iptal edenler, iptal edip başka planla geri dönen bir müşteri ve 2 pasif müşteri. Tarihler betiğin çalıştırıldığı güne göre hesaplanır, bu yüzden kesin rakamlar güne göre değişir. Yaklaşık beklenti:

- Her firmada 12 civarı aktif müşteri, MRR grafiğinde iniş çıkışlı bir eğri
- Son 12 ayın ortalama churn'ü %3-6 aralığında; bu ay en az bir iptal var, bu yüzden churn, LTV ve LTV/CAC boş görünmez
- Mavi'de LTV/CAC "sağlıklı", Kuzey'de "Dikkat"
- Her firmada 3 riskli abonelik (dönem bitişine 1-6 gün kalmış)

**Güvenceler:** Betik demo firmayı iki koşulla tanır: adı birebir "Mavi Yazılım" veya "Kuzey Teknoloji" ve bütün kullanıcıları `@demo.example` uzantılı. Bu adla demo olmayan bir firma varsa ona dokunmadan durur. Silme yalnızca doğrulanmış demo firmanın kimliğiyle yapılır, her firma tek işlemde (ya hepsi ya hiçbiri) kurulur. Test modunda `.env.test` canlıyla aynı sunucuyu gösteriyorsa bağlanmadan durur. Ayın ilk 2 saatinde çalışmaz: bu ayın iptali ay içine sığmaz.

### İki firmanın karışmadığını doğrulama
1. **Kontrol özeti:** Betik sonunda her firma için sayıları (kullanıcı, plan, müşteri, abonelik, olay) ve dashboard metriklerini yazdırır. Ardından gelen "Kiracılar arası kontrol" bölümünde beş satırın hepsi `0` olmalı ve son satır `Sonuç: TAMAM` olmalıdır. Bu kontrol her kaydın sahibini yalnızca kimliğiyle okur ve bağlı olduğu kaydın firmasıyla karşılaştırır. Hata varsa betik `HATA` yazar ve başarısız biter.
2. **Tarayıcı:** İki ayrı tarayıcıda (ya da biri gizli pencerede) `yonetici.mavi@demo.example` ve `yonetici.kuzey@demo.example` ile gir. Müşteri listeleri, MRR ve LTV/CAC farklı olmalı. Bir firmanın müşteri sayfası adresini kopyalayıp öteki firmanın oturumunda açınca "Kayıt bulunamadı" görünmelidir.

## Bilinen sınırlar
- **Render uyku süresi:** Ücretsiz Render web servisi 15 dakika trafik almazsa uyur. Sonraki ilk istekte uyanması yaklaşık 1 dakika sürer. İncelemeden önce siteyi açıp ısıtmak gerekir (bkz. İnceleme için, 1. madde). Kaynak: [Render, Deploy for Free](https://render.com/docs/free)
- **Neon uyanma gecikmesi:** Neon veritabanı 5 dakika kullanılmazsa durur (ücretsiz planda bu ayar kapatılamaz). Sonraki sorguda birkaç yüz milisaniye içinde yeniden başlar; ilk sorgu biraz yavaş olabilir. Kaynak: [Neon, Scale to Zero](https://neon.com/docs/introduction/scale-to-zero)
- **Giriş deneme sınırı:** Aynı e-postaya 15 dakika içinde en fazla 5 deneme yapılabilir; 6. denemeden sonra bu e-postayla giriş 15 dakika engellenir (doğru parola da reddedilir). Sayaç e-posta başınadır ve sunucunun belleğinde tutulur: sunucu yeniden başlarsa sıfırlanır, IP başına sınır yoktur. Demo hesaplar herkese açık olduğu için başkası yanlış denemelerle bir demo hesabı 15 dakika kilitleyebilir; bu durumda diğer demo hesap kullanılabilir.
- **Kullanıcı yönetimi:** Yönetici, Kullanıcılar sayfasında firmasının kullanıcılarını görür ve finans rolünde yeni kullanıcı ekler. Silme, rol değiştirme, pasife alma, parola sıfırlama ve davet e-postası yoktur; parolayı yönetici belirler ve kullanıcıya kendisi iletir. Firmaya ikinci bir yönetici eklenemez, kullanıcı sayısı için üst sınır yoktur. Gerekçeler [ADR, Gün 14 bölümünde](docs/02_ADR.md).
- **Riskli abonelik listesi:** Demo verisindeki riskli abonelikler, betiğin çalıştırıldığı güne göre 1-6 gün sonra biter. Yaklaşık 7 gün sonra liste boşalır; seed yeniden çalıştırılınca yine dolar.
- **Demo verisi tarihe bağlıdır:** Seed'den sonra zaman geçtikçe "bu ay" değişir. Yeni ayda henüz iptal yoksa churn 0 olur ve LTV "hesaplanamadı" görünür; seed yeniden çalıştırılınca düzelir.
- **Güvenlik sınırları:** Gün 12 güvenlik incelemesinde bilinçli olarak kabul edilen sınırlar (örneğin çıkışta oturumun sunucuda iptal edilmemesi, SSE bağlantılarının tek süreçte tutulması, kayıt sınırı olmaması) gerekçeleriyle birlikte [ADR, Gün 12 bölümünde](docs/02_ADR.md) yazılıdır.

## Kapsam (MoSCoW)
- **MUST:** kayıt, giriş ve roller; müşteri ve plan yönetimi; abonelik yaşam döngüsü; KPI dashboard; kiracı izolasyonu
- **SHOULD:** SSE ile iptal uyarısı (riskli abonelikler liste olarak), aylık MRR grafiği
- **WON'T:** ödeme entegrasyonu, çoklu para birimi, e-posta bildirimi, mikroservis

## Dokümanlar
- [Kurulum rehberi](docs/00_Kurulum_Rehberi.md)
- [Mimari Karar Kaydı (ADR)](docs/02_ADR.md)
- [Prompt Günlüğü](docs/03_Prompt_Gunlugu.md)
- [14 günlük prompt planı](docs/04_14_Gunluk_Prompt_Plani.md)
- [AI talimat dosyası](CLAUDE.md)
- [Yapay zekâ konuşmaları: prompt ve cevaplar](prompt_cevap/README.md)
