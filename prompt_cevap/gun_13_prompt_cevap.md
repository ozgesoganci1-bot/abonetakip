# Gün 13: Demo veri betiği, README ve belge güncellemeleri

> **Araç:** Claude (claude.ai), "SUNUCU TABANLI PROGRAMLAMA - SaaS PROJESİ" Project'i içindeki sohbetler.
> **Tarih:** 24 Eki 2026 – 25 Eki 2026 (Türkiye saati). **Kapsam:** 12 prompt ve 11 cevap.
> Kutulardaki metin benim yazdığım prompttur (olduğu gibi). Girintili (`>` ile başlayan) alanlar Claude'un cevabıdır, başlık, tablo ve kod blokları orijinal Markdown'dır. Ekran görüntüleri metin olmadığı için `[ekran görüntüsü]` satırı olarak işaretlenmiştir. Yapay zekânın iç düşünme adımları ve araç çağrıları dahil değildir.
> Gizli bilgi taraması yapılmıştır. Ad taramasının kendi arama deseni `[AD_DESENI]` olarak yazılmıştır. Mac kullanıcı adı, okul kısaltması, veritabanı sunucu adı ve parola benzeri değerler maskelenmiştir.
> Bu gün ayrı bir sohbette yürütüldü. Ana sohbette yapılan yönlendirme ve inceleme mesajları bu dosyaya dahil değildir.


## Bu günün özeti

_Bu bölümü ben yazdım, yapay zekâ cevabı değildir. Kaynağı Prompt Günlüğü'dür._

| | |
|---|---|
| **Ne istendi** | Gün 13 promptu: seed (demo veri) betiği, README ve belge güncellemeleri. Önce plan; kararlar (a)-(e) ve dört ek istekle kesinleşti, onaydan sonra seed, README ve belge listesi adım adım |
| **Ne üretildi** | `demo-kurulum.ts` (saf senaryo, sabit tohum) ve `demo-kurulum.test.ts` (yılın farklı anlarında senaryo kontrolü; `npm test` 191), `seed-demo.ts` (`seed:demo` ve `seed:demo:canli`, demo kiracı tanıma kuralı, canlıda "evet" onayı, betik sonunda kontrol özeti), README (kurulum, demo hesaplar, bilinen sınırlar, Render ve Neon süreleri resmi kaynakla); PR #44. Canlıda iki demo kiracı (her birinde 18 müşteri; LTV/CAC birinde sağlıklı, ötekinde Dikkat), kontrol özeti TAMAM |
| **Düzeltme gerekti mi** | Evet: (1) AI ilk planda silmeyi `tenantaBagliDb` ile önerdi; `tenant.ts`'in silme yasağı fark edildi, silme ham istemciye ve yalnızca doğrulanmış demo kiracının `tenantId`'sine taşındı; (2) koruma dosyalarına (`tenant.ts`, `veri.ts`, `canli-koruma.ts`) dokunulmadı, seed kendi bağlantısını ve kendi canlı korumasını kurdu; (3) ortak yazma mantığının çıkarılması (Commit 1) ertelendi, eski demo betiklerine dokunulmadı; (4) dört ek istek eklendi: CAC, riskli abonelikler, README bilinen sınırları, betik içi kontrol özeti; (5) AI README'de test dalı için çalışmayan bir `npx dotenv` komutu yazdı, kendisi fark etti; doğru yöntem (Neon'da canlı dalın kopyası) ADR'den verildi; (6) Node sürüm ifadesi doğrulanan (v26.11.1) ve doğrulanmayan (22.18 alt sınırı) olarak ayrıldı; (7) commit komutunda iki ek satır yapışık yazılmıştı (satır sonu eksikti); (8) PR açıklamasında ek satırları yanlış yerdeydi; (9) README'de "Sunumdan önce" ifadesi "İncelemeden önce" yapıldı; (10) README'deki pasife alma iddiaları ADR ve koddan doğrulandı; (11) README'deki SSE iddiası ADR K10.7'ye göre düzeltildi |

## Gün 13 sohbeti (plan, demo veri betiği, README ve belge güncellemeleri)

_Plan, seed betiği, README ve belge güncellemeleri bu sohbette yürütüldü._

### Prompt 1 · 24 Eki 2026 17:30

`````text
````markdown
[Rol] Next.js (App Router), TypeScript, PostgreSQL ve Prisma konusunda
deneyimli, çok kiracılı SaaS ürünleri geliştirmiş kıdemli bir geliştirici
olarak davran. 
sade ve adım adım yap. Her dosya için tam dosya yolunu yaz ve "yeni dosya
oluştur" ya da "dosyanın içeriğini tamamen şununla değiştir" diye açıkça
söyle. Terminal komutlarını tek tek ver ve her birinin ne işe yaradığını
bir cümleyle söyle. Ortamım MacBook Air M4 (macOS, zsh).

[Bağlam] "AboneTakip": küçük yazılım firmaları için çok kiracılı abonelik,
MRR ve churn takip SaaS'ı. Tek geliştirici, 2 hafta, GitHub ile entegre.
Tek Next.js uygulaması, tek PostgreSQL veritabanı (Neon), Prisma. Render
(PaaS) üzerinde sürekli açık Node sunucusu. GitHub deposu herkese açık. Ortak tablolar ve tenant_id ile çok
kiracılı yapı. Roller: manager ve finance. Gerçek zamanlı uyarılar SSE ile.
Kapsam: MUST (kayıt/giriş/roller, müşteri ve plan yönetimi, abonelik yaşam
döngüsü, KPI dashboard, kiracı izolasyonu), SHOULD (SSE uyarısı, aylık MRR
grafiği). Ödeme entegrasyonu, çoklu para birimi, e-posta bildirimi ve
mikroservis kapsam dışıdır.

[Kısıtlar - her zaman geçerli]
- Önce plan, ben onaylamadan kod yazma.
- Tenant filtresi tek merkezi fonksiyondan uygulanır. tenant_id istemciden
  alınmaz, oturumdan okunur.
- Secret değerler yalnızca ortam değişkeninden okunur.
- Gereksiz paket ekleme. Var olduğundan emin olmadığın paketi önerme.
- Kullandığım Next.js ve Prisma sürümünü package.json'dan kontrol et,
  gerekirse dosyayı bana göster dedirt.
- Kapsam dışına çıkma. Anlamadığın bir yerde tahmin etme, bana sor.
- Cevabın sonunda varsayımlarını listele ve emin olmadığın yerleri belirt.
Gün 13 • README, demo verisi, belgeler

**Amaç:** Projeyi başkasının çalıştırabileceği ve hocanın inceleyebileceği hâle getirmek.

```
[Görev] Üç iş yap: (A) seed (demo veri) betiği, (B) README.md'yi
tamamla, (C) belgeleri güncel hâle getir.

A) Seed:
- İki kiracı: "Mavi Yazılım" ve "Kuzey Teknoloji" (sahte). Her birinde
  bir manager ve bir finance kullanıcı. Demo parolası README'de açıkça
  "demo" olarak belirtilsin.
- Her kiracıda 3 plan (aylık ve yıllık karışık), 15-20 müşteri, son 12
  aya yayılmış abonelikler: başlayanlar, yenilenenler, iptal edenler.
- Veri gerçekçi olsun (TL fiyatlar, makul churn %3-6 aralığı) ve
  dashboard'da anlamlı bir MRR eğrisi çıksın.
- Betik tekrar çalıştırılabilir olsun (var olan demo veriyi temizleyip
  yeniden kurar, başka kiracıların verisine dokunmaz). Nasıl çalıştırılacağını
  adım adım yaz.

B) README: Proje özeti, canlı adres, demo hesaplar, teknoloji,
   yerel kurulum adımları (macOS dahil, sıfırdan çalıştırma), ortam
   değişkenleri (adlar, değerler yok), rol ve yetki tablosu, metrik
   formülleri, mimari özet (ADR bağlantısı), test çalıştırma, bilinen
   sınırlar (Render web servisi uyku süresi, Neon uyanma gecikmesi).

C) Belgeler: docs/ içindeki proje önerisi ve ADR'de değişen bir yer
   varsa önerilen düzeltmeleri listele. Prompt Günlüğü için günlük
   özet tablosunu doldurmam için sorular sor.

[Kısıtlar]
- Gerçek kişi verisi, gerçek e-posta veya gerçek parola kullanma.
- Seed betiği DATABASE_URL'yi ortam değişkeninden okur.
- README sade ve doğrulanabilir adımlardan oluşur.

[Format] 1) Plan (onay bekle). 2) Seed dosyası ve çalıştırma komutu.
3) README tam içeriği tek kod bloğunda. 4) Belge güncelleme listesi.

[Doğrulama] README'deki her kurulum adımını bir varsayım listesiyle
birlikte ver. Seed'in iki kiracıyı birbirine karıştırmadığını nasıl
doğrulayacağımı söyle.
````
`````

### Claude cevabı 1 · 24 Eki 2026 17:32

> Bu turda yalnızca planı veriyorum, kod yok. Planı netleştirmek için önce dosyalarına bakmam ve birkaç kararı senden almam gerekiyor.
>
> ## 1. Önce görmem gerekenler
>
> Proje kökünde Terminal'de sırayla çalıştır ve çıktıları yapıştır. Bu dosyalarda secret olmamalı, yine de yapıştırmadan önce bir göz at.
>
> 1. `cat package.json`: Next.js/Prisma sürümlerini ve mevcut `demo:veri`, `test`, `dev:test` betiklerinin ne çalıştırdığını gösterir.
> 2. `cat prisma/schema.prisma`: Tablo ve alan adlarını gösterir. Seed bunlara birebir uymak zorunda.
> 3. `ls docs scripts prisma`: Belgelerin ve mevcut betiklerin adlarını listeler.
> 4. `cat README.md`: Mevcut README'yi gösterir, üzerine tamamlayacağım.
> 5. `package.json` içinde `demo:veri` hangi dosyayı çalıştırıyorsa onu da `cat` ile göster.
>
> ## 2. Senden karar istediğim noktalar
>
> **a) Mevcut `demo:veri` ile ilişki.** Projede zaten bir demo veri betiği var. Yeni bir seed yazarsam iki benzer betik oluşur. Önerim şu: ortak üretim mantığını tek dosyada toplamak, yeni `seed:demo` komutunu da iki sabit kiracıyı kuracak biçimde bu mantığın üzerine eklemek. Mevcut betiği gördükten sonra kesinleştiririm. Uygun mu?
>
> **b) Hangi veritabanına yazılacak?** README'de "canlı adres + demo hesaplar" olacaksa demo kiracıların canlı veritabanında da bulunması gerekir. Önerim:
> - Betik varsayılan olarak `.env.test` (Neon test dalı) üzerinde çalışsın.
> - Canlıya yalnızca açık bir `--canli` bayrağıyla ve terminalde "evet" onayıyla yazsın.
>
> Bu iki adımlı koruma uygun mu?
>
> **c) "Demo veriyi" nasıl tanıyacağız?** "Temizle ve yeniden kur, başkasına dokunma" kuralı için betiğin demo kiracıyı kesin olarak tanıması gerekiyor. Önerim şema değişikliği yapmamak. Demo kiracılar sabit adlarından ve kullanıcılarının `@demo.example` uzantılı e-postalarından tanınır. `example` alan adı belgeler için ayrılmıştır, gerçek bir kişiye ait olamaz. Silme işlemi de yalnızca bu kiracıların `tenantId` değeriyle sınırlı olur. Şemaya `isDemo` gibi bir alan eklemek istersen bu bir migration demektir, ayrıca sorarım.
>
> **d) Demo parolası.** Kayıt formunda en az uzunluk kuralı varsa "demo" parolası bu kurala takılabilir. Seed doğrulamayı atlar, ama tutarlılık için `demo1234` gibi bir parola daha doğru olabilir. Hangisi?
>
> **e) Herkese açık demo hesabı riski.** Parola herkese açık README'de yer alacak. Demo manager hesabıyla giren biri parolayı değiştirebilir ya da veriyi bozabilir. Çözümüm: README'ye "bozulursa `seed:demo --canli` ile sıfırlanır" notu eklemek. Kabul mü?
>
> ## 3. Plan (onayını bekliyor)
>
> **Hazırlık**
> - Yeni dal: `git switch -c gun13-seed-readme`
> - Dosyalar `touch` ile açılır, içeriğini sen editöre yapıştırırsın.
>
> **A) Seed betiği**
> - Tek dosya, şimdilik `scripts/seed-demo.ts`. Kesin yolu mevcut yapıya göre belirleyeceğim.
> - Çalıştırma aracı `package.json`'daki mevcut düzenden seçilir. Yeni paket eklenmez, sahte adlar betiğin içindeki sabit listeden gelir (faker yok).
> - Veri tekrarlanabilir olsun diye sabit tohumlu basit bir rastgele sayı üreteci kullanılır. Böylece her çalıştırmada aynı veri oluşur.
> - `DATABASE_URL` yalnızca ortam değişkeninden okunur. Betik, bağlandığı ortamın test mi canlı mı olduğunu ekrana yazar ama adresi yazmaz.
> - Akış, tek transaction içinde ve her kiracı için ayrı ayrı:
>   1. Demo kiracıyı bul.
>   2. Yalnızca o `tenantId`'ye ait olay, abonelik, müşteri, plan ve kullanıcı kayıtlarını sil.
>   3. Kiracıyı yeniden kur.
> - Her kiracıda şunlar oluşturulur:
>   - 1 manager ve 1 finance kullanıcısı (bcrypt ile özetlenmiş parola)
>   - 3 plan: 2 aylık, 1 yıllık
>   - 15-20 müşteri, 1-2 tanesi `isActive=false`
> - Son 12 ay için ay ay simülasyon yapılır:
>   - Yeni başlayanlar STARTED olayı alır.
>   - Dönemi dolan aktif abonelikler RENEWED olayı alır.
>   - Bazı müşteriler iptal eder ve CANCELED olayı alır.
>   - Bir müşterinin aynı anda tek ACTIVE aboneliği olur. İptal eden müşteri dönerse yeni abonelik açılır.
> - Not: Seed, kiracıyı kendisi yarattığı için `tenantId`'yi açıkça yazar. Bu bir yönetici betiği; istemciden gelen değer değildir ve kuraldaki "merkezi filtre" uygulama sorguları içindir. Bu istisnayı dosyada yorumla belirteceğim.
>
> **B) README**
> README'nin tam içeriği tek kod bloğunda verilecek. Bölümler: özet, canlı adres, demo hesaplar, teknoloji, macOS'ta sıfırdan kurulum, ortam değişkenleri (yalnızca adlar ve `[DATABASE_URL]` gibi yer tutucular), rol/yetki tablosu, metrik formülleri, mimari özet ve ADR bağlantısı, test komutları, bilinen sınırlar.
>
> **C) Belgeler**
> - `docs/` içindeki proje önerisi ve ADR ile gerçek durum karşılaştırılır.
> - Değişen yerler "eski, yeni, neden" biçiminde listelenir.
> - Ardından Prompt Günlüğü özet tablosu için sorularımı soracağım.
>
> **Commit öncesi**
> - Üç tarama yapılır. README'de Neon sunucu adı yazılmaz, örnekler `ep-xxxx` biçiminde olur.
> - Dikkat: Render adresin (`...onrender.com`) adını ya da soyadını içeriyorsa 3. tarama README'yi yakalar. Adresin nasıl olduğunu sorabilir miyim, yer tutucuyla değil.
>
> **İki kiracının birbirine karışmadığını doğrulama**
> Seed'den sonra çalıştıracağın kontroller (ayrıntıları 2. adımda vereceğim):
> - Kiracı başına sayım sorgusu.
> - Bir kiracının aboneliğinde başka kiracının müşterisine ya da planına bağlanan kayıt sayısı. Bu sayı 0 olmalı.
> - İki tarayıcıda iki ayrı manager hesabıyla girip dashboard'ların farklı olduğunu görme.
> - Bir kiracının müşteri adresini öteki kiracının oturumunda açınca "bulunamadı" sonucunu alma.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **Churn hedefi:** 15-20 müşteriyle aylık churn her ay %3-6 aralığına düşemez. Bir ayda ya 0 ya da 1 iptal olur, bu da yaklaşık %0 ya da %5-7 demektir. 12 aylık ortalamayı bu aralıkta tutacağım, bazı aylar 0 çıkacak. Kabul mü?
> - **MRR eğrisi:** Eğrinin geçmiş aylarda anlamlı çıkması, olay tablosunda tarih alanının elle verilebilmesine ve grafiğin geçmişi olaylardan hesaplamasına bağlı. Şemayı ve grafik kodunu görmeden bundan emin değilim.
> - **Render ve Neon sınırları:** Uyku ve uyanma sürelerini README'ye yazmadan önce güncel belgelerden kontrol edeceğim, ezberden sayı yazmayacağım.
> - **Seed çalıştırma aracı:** Bunu `package.json`'ı gördükten sonra seçeceğim.
>
> Dosyaları ve (a)-(e) kararlarını gönderdiğinde 2. adıma (seed dosyası ve çalıştırma komutu) geçerim.

### Prompt 2 · 25 Eki 2026 12:43

````text
Dosyalar ekte (package.json, schema.prisma, README.md, demo betikleri, klasör listeleri). Kararlar: (a) evet, ortak mantık tek yerde, mevcut demo:veri yapısına uy. (b) evet, varsayılan .env.test, canlıya yalnızca --canli ve evet onayıyla. (c) evet, sabit ad ve @demo.example, şema değişikliği yok. (d) demo1234 gibi, kayıt doğrulama kuralına uysun. (e) kabul, README'ye sıfırlama notu. Churn: 12 aylık ortalama %3-6, kabul. Render adresi https://abonetakip.onrender.com (ad içermiyor).
Ekler: (1) Her iki kiracıda CAC ayarı da doldurulsun, LTV/CAC dolu görünsün. (2) 7 gün içinde dönemi bitecek birkaç aktif abonelik olsun, riskli abonelik listesi dolu görünsün. (3) README bilinen sınırlara ekle: giriş sınırı (15 dakikada 5 deneme, sonra 15 dakika blok), Kullanıcılar sayfası yer tutucu olduğu için finance hesabı arayüzden eklenemiyor, Render ve Neon uyanma gecikmesi (sayıyı güncel belgeden kontrol et, ezberden yazma). (4) İki kiracının karışmadığını SQL yerine betiğin sonunda kendisinin yazdırdığı kontrol özetiyle doğrula (kiracı başına sayılar, kiracılar arası bağlantı sayısı 0), adres basmasın. Hâlâ kod yazma: önce dosyaları okuyup planı kesinleştir ve onayıma sun.
````

_[ek dosya: gun13_dosyalar.txt]_

### Claude cevabı 2 · 25 Eki 2026 12:45

> Dosyaları okudum. Planın büyük kısmı artık kesin. Birkaç nokta henüz görmediğim dosyalara bağlı; onları aşağıda ayrıca işaretledim.
>
> ## 1. Okuduklarımdan çıkan tespitler
>
> - **Sürümler:** Next.js 16.4.2 ve Prisma 7.10.1 (`prisma-client` üreticisi ve `@prisma/adapter-pg`). Seed, mevcut betiklerdeki `node --env-file ... --import kancalar.mjs` düzeniyle çalışacak. Yeni paket gerekmiyor. Parola için `bcryptjs`, onay sorusu için Node'un kendi `readline` modülü yeterli.
> - **Kiracılar birbirine karışamaz:** `Subscription` ile `SubscriptionEvent`, müşteri, plan ve aboneliğe `(id, tenantId)` birleşik yabancı anahtarla bağlı. Bu yüzden kiracılar arası bağlantı veritabanı düzeyinde zaten imkânsız. Betiğin sonundaki "bağlantı sayısı 0" kontrolü ek bir güvence olacak.
> - **Ortak yazma mantığı:** Mevcut iki betikte "abonelik yaz, olaylarını yaz" döngüsü birebir tekrar ediyor. Ortak mantığı bu döngüden çıkaracağım.
> - **Bir müşteri, birden çok abonelik:** Mevcut betikler her müşteriye ayrı bir plan açıyor. Seed ise planları paylaşacak ve bir müşteriye sırayla birden fazla abonelik verecek (iptal, sonra yeniden başlatma). Ortak fonksiyonun bu yüzden plan ve müşteri yaratmaması, yalnızca "bir aboneliği ve olaylarını" yazması gerekiyor.
> - **README'de güncellenmesi gerekenler:** "Sayfa içerikleri sonraki günlerde doldurulacak" ve "Bu bölüm Gün 13'te doldurulacak" cümleleri artık eskimiş. "15 dakika uyur, yaklaşık 1 dakika" bilgisini de güncel belgeden yeniden doğrulayacağım.
>
> ## 2. Kesinleşen plan
>
> **Dal:** `gun13-seed-readme`, tek PR. İçinde iki commit olacak: önce ortak mantığın çıkarılması, sonra seed ve README.
>
> ### Commit 1: Ortak yazma mantığı
>
> - **Yeni dosya `src/test-destek/demo-yazici.ts`:** `abonelikYaz(tx, tenantId, { customerId, planId, aralik, baslangic, iptal, simdi })` fonksiyonu. Aboneliği ve STARTED/RENEWED/CANCELED olaylarını yazar, içinde `donemleriIlerlet` kullanılır.
> - **Değişecek dosyalar:** `demo-verisi.ts` ve `gecmis-mrr-verisi.ts`. Döngüleri bu fonksiyonu çağıracak, davranışları değişmeyecek.
> - **Doğrulama:**
>   - `npm test` çalıştırılır.
>   - Test dalında yeni bir kullanıcıyla `npm run demo:gecmis` çalıştırılır. Ekrandaki grafik, betiğin yazdırdığı elle hesaplanmış değerlerle aynı çıkmalı.
>
> ### Commit 2: Seed ve README
>
> **Yeni dosya `src/test-destek/demo-kurulum.ts`** (saf, veritabanına dokunmaz):
> - Sabit tohumlu küçük bir rastgele sayı üreteci betiğin içinde yazılır. Böylece her çalıştırmada aynı veri oluşur.
> - İki kiracının senaryosunu düz veri olarak üretir: planlar, müşteriler, abonelik takvimi.
> - Taslak plan fiyatları:
>   - Mavi Yazılım: aylık 750, aylık 1.500, yıllık 30.000 TL.
>   - Kuzey Teknoloji: aylık 900, aylık 2.200, yıllık 22.000 TL.
> - Taslak müşteri dağılımı, kiracı başına:
>   - 12 ay önce yaklaşık 10 aktif müşteriyle başlar, ayda yaklaşık 1 yeni müşteri eklenir, toplam 17-19 müşteriye ulaşılır.
>   - 12 ayda 7-9 iptal olur. Hedef, 12 aylık ortalama churn'ün %3-6 aralığında kalması.
>   - Bir müşteri iptal edip geri döner ve yeni abonelik açar. Bu, iş kuralının ekranda görünmesini sağlar.
>   - Aktif aboneliği olmayan 1-2 müşteri `isActive=false` olur.
> - **Ek 2 (riskli abonelikler):** Kiracı başına 3 aktif aboneliğin dönem sonu, çalıştırma anından 1-6 gün sonraya denk getirilir. Bu tarih çalıştırma anına göre hesaplanır. Bir hafta sonra liste boşalır, seed yeniden çalıştırılınca dolar. README'ye bu not eklenecek.
> - **Ek 1 (CAC):** Mavi için 4.000 TL, Kuzey için 9.000 TL. Böylece biri "sağlıklı", öteki "Dikkat" etiketini gösterir ve dashboard'da ikisi de görülür. Kesin değerler aşağıdaki 3. bölüme bağlı.
> - E-postalar:
>   - Kullanıcılar: `yonetici.mavi@demo.example`, `finans.mavi@demo.example`, Kuzey için de aynı kalıp.
>   - Müşteriler: ya boş ya da `<kisa-ad>@demo.example`.
>   - Müşteri adları sahte firma adları olacak. Ad deseniyle eşleşen hiçbir ad kullanılmayacak.
>
> **Yeni dosya `src/test-destek/demo-kurulum.test.ts`**, `npm test` listesine eklenir, veritabanı istemez. Şunları kontrol eder:
> - Gelecek tarihli olay yok.
> - Bir müşterinin aynı anda iki ACTIVE aboneliği yok.
> - 12 aylık ortalama churn %3-6 aralığında.
> - Kiracı başına tam 3 riskli abonelik var.
> - Pasif müşterilerin aktif aboneliği yok.
>
> **Yeni dosya `src/test-destek/seed-demo.ts`** (giriş betiği):
> - **Test modu (varsayılan):** Mevcut `testDaliKontrolu` aynen uygulanır.
> - **Canlı modu:** `--canli` bayrağı verilmiş olmalı ve terminalde "evet" yazılmalı. Bayrak yoksa ya da cevap "evet" değilse veritabanına hiç bağlanmadan durur.
> - **Kiracıyı tanıma:** Kiracının adı birebir eşleşmeli ve kullanıcılarının tamamı `@demo.example` uzantılı olmalı. Adı tutan ama demo kullanıcısı olmayan bir kiracı varsa betik dokunmadan durur, çünkü o gerçek bir kayıt olabilir. Aynı demo e-postası demo olmayan bir kiracıda bulunursa da durur.
> - **Yeniden kurulum:** Kiracı başına tek transaction içinde, `tenantaBagliDb(tenantId)` üzerinden sırayla olaylar, abonelikler, müşteriler, planlar ve kullanıcılar silinip yeniden yazılır. Kiracı kaydı korunur ve yalnızca CAC güncellenir. Kiracı ilk kez kuruluyorsa yalnızca `Tenant` satırı temel istemciyle oluşturulur, çünkü bu tabloda `tenantId` yok.
> - **Ek 4, kontrol özeti:** Betiğin sonunda okuma amaçlı yazdırılır. Hiçbir adres basılmaz, yalnızca demo e-postaları ve sayılar görünür. Kiracı başına:
>   - kullanıcı, plan, müşteri (aktif ve pasif), abonelik (aktif ve iptal) ve olay sayıları
>   - MRR, 12 aylık ortalama churn, riskli abonelik sayısı, CAC ve LTV/CAC (dashboard'un kullandığı fonksiyonlarla hesaplanır)
> - Kiracılar arası kontrol, sonuç 0 olmalı:
>   - müşterisi ya da planı başka kiracıya ait abonelik sayısı
>   - aboneliği başka kiracıya ait olay sayısı
>   - demo olmayan kiracılardaki `@demo.example` kullanıcı sayısı
>   - Hepsi 0 ise "TAMAM", değilse "HATA" yazılır ve çıkış kodu 1 olur.
> - Mevcut betiklerdeki gibi hata ayrıntısı yazılmaz, işlem geri alınır.
>
> **`package.json` betikleri:**
> - `seed:demo`: `.env.test` ile çalışır.
> - `seed:demo:canli`: `.env` ile ve `--canli` bayrağıyla çalışır. Sonra onay sorusu gelir.
>
> **README:**
> - Bölümler: özet, canlı adres, demo hesaplar ve parola ile "bozulursa sıfırlama" notu, teknoloji, macOS kurulumu, ortam değişkenleri, roller, metrik formülleri, mimari özet, testler ve demo komutları.
> - Kurulum bölümü kısa tutulup ayrıntı için `docs/00_Kurulum_Rehberi.md`'ye bağlanır. İki belgenin çelişmemesi için rehberi okumam gerekiyor.
> - **Bilinen sınırlar:**
>   - giriş sınırı (koddan doğrulanacak)
>   - finance hesabının arayüzden eklenemediği
>   - Render uyku süresi ve Neon uyanma gecikmesi (güncel belgelerden doğrulanıp kaynakla yazılacak)
>   - Gün 12'de kabul edilen güvenlik sınırları: liste olarak değil, ADR Gün 12 bağlantısıyla.
>
> ## 3. Kesinleşmesi için görmem gerekenler
>
> Proje kökünde şunu çalıştır. Komut, dosyaları sırayla tek bir metin dosyasında masaüstüne toplar:
>
> ```
> for f in src/test-destek/canli-koruma.ts src/test-destek/veri.ts src/test-destek/kancalar.mjs src/lib/tenant.ts src/lib/validation.ts src/lib/metrikler.ts src/lib/dashboard-verisi.ts src/lib/riskli-abonelikler.ts src/lib/donem.ts src/lib/giris-siniri.ts .env.example docs/00_Kurulum_Rehberi.md; do echo "===== $f ====="; cat "$f"; done > ~/Desktop/gun13_dosyalar2.txt
> ```
>
> `.env.example` yalnızca yer tutucu içermeli. Göndermeden önce dosyada gerçek adres ya da parola olmadığına bir bak. Her dosyadan öğrenmem gereken şey:
>
> - **`canli-koruma.ts` ve `veri.ts`:** `veri.ts` kendi `TEST_VERITABANI` kontrolünü yapıyor. Canlı modda bu kontrol, korumayı zayıflatmadan nasıl aşılacak? Hedefim: yalnızca seed betiği için açık bir parametre eklemek, mevcut iki betiğin korumasına dokunmamak.
> - **`tenant.ts`:** `User` modeli de filtreye dahil mi, `deleteMany` filtreden geçiyor mu?
> - **`metrikler.ts` ve `dashboard-verisi.ts`:** Dashboard'daki churn hangi ayı kullanıyor, içinde bulunulan ayı mı, geçen ayı mı? LTV/CAC'nin dolu görünmesi için o ayda en az bir iptal gerekebilir. İçinde bulunulan aysa, "ayın ilk 15 dakikası" korumasını seed'e de taşırım.
> - **`riskli-abonelikler.ts`:** Riskli sayılmanın kuralı gerçekten "7 gün içinde dönem sonu" mu?
> - **`validation.ts`:** Parola kuralı, `demo1234`'ün bu kurala uyduğunu doğrulamak için.
> - **`giris-siniri.ts`:** README'deki "15 dakikada 5 deneme" ifadesini koddan doğrulamak için.
>
> Part C (belge güncelleme) için `docs/01` ve `docs/02`'yi o adıma geçtiğimizde isteyeceğim.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **Ortak mantığı çıkarmak eski iki betiğe dokunuyor.** Bu küçük bir regresyon riski. `demo:gecmis` ile yapacağımız elle karşılaştırma bunu yakalar. İstersen bu çıkarmayı Gün 14'e erteleyip seed'i şimdilik yeni fonksiyonla tek başına yazabilirim.
> - **Transaction süresi:** Kiracı başına yaklaşık 60 abonelik ve 300 olay var. Neon uyanırken bu 20 saniyeyi aşabilir, bu yüzden zaman aşımını 60 saniye düşünüyorum. Olaylar `createMany` ile toplu yazılacak.
> - **Oturumlar:** Yeniden kurulumda kullanıcılar silinip yeniden yaratıldığı için açık demo oturumları geçersizleşir. Oturum çerezinin kullanıcı kimliğine bağlı olduğunu varsayıyorum, `session.ts`'yi görmedim.
> - **CAC değerleri:** 4.000 ve 9.000 TL taslak. Gerçek LTV hesaplanınca bir kiracı "sağlıklı", öteki "Dikkat" çıkacak şekilde ayarlanacak. İkisinin de sağlıklı görünmesini istersen söyle.
>
> Dosyaları gönderip planı onayladığında, 2. adım olan Commit 1'in dosyalarından başlarım.

### Prompt 3 · 25 Eki 2026 12:46

````text
Dosyalar ekte (gun13_dosyalar2.txt). Kararlar: (1) Silme işlemi tenantaBagliDb ile olmaz, tenant.ts Müşteri, Plan, Abonelik ve Olay tablolarında delete'i bilerek yasaklıyor. Seed yönetici betiği: silmeyi ham istemciyle ve açık where tenantId (yalnızca doğrulanmış demo kiracı) ile yap, istisnayı dosyada yorumla belirt, tenant.ts'e dokunma. (2) veri.ts ve canli-koruma.ts'e dokunma, korumalarını zayıflatma. Seed kendi veritabanı bağlantısını kursun ve canlı korumasını kendi içinde yapsın (--canli, evet onayı, kiracı adı ve @demo.example tanıma kuralı). Bir korumayı zayıflatman gerekirse dur ve sor. (3) Commit 1'i (ortak mantık çıkarma) ertele, eski iki betiğe dokunma. Seed yeni dosyalarda tek başına yazılsın. (4) CAC 4000 ve 9000 kabul. Dashboard'da gösterilen ayda her kiracıda en az bir iptal olsun ki churn 0 olmasın ve LTV boş görünmesin. (5) Transaction süresi 60 saniye kabul. Plan bu hâliyle onaylı. Şimdi Commit planını güncelle ve 2. adıma geç: seed dosyalarını tam içerikle ver, her komutu tek tek. Hâlâ kod yazmadan önce son kısa plan özeti ver.
````

_[ek dosya: gun13_dosyalar2.txt]_

### Claude cevabı 3 · 25 Eki 2026 12:51

> Planı son hâliyle kodlayıp, size vermeden önce burada bir PostgreSQL üzerinde çalıştırıp doğruluyorum.
> Proje dosyaları yerinde. Şimdi saf senaryo üreticisini yazıyorum.
> Şimdi birim testini yazıyorum. Senaryoyu bir yıl boyunca farklı "şimdi" anlarında deneyecek.
> Tüm testler ilk denemede geçti. Rakamların gerçekçi olduğunu da gözle kontrol ediyorum.
> Senaryo sağlam: ortalama churn %4,8-5,2, bu ay churn %7,7. LTV/CAC değeri Mavi'de yaklaşık 4,0 (sağlıklı), Kuzey'de yaklaşık 2,2 (Dikkat). Şimdi veritabanına yazan betiği yazıyorum.
> Kurulum ve tekrar kurulum çalışıyor, demo olmayan firmaya dokunulmuyor. Şimdi koruma senaryolarını deniyorum.
> Seed'in üç dosyası hazır ve sana gönderildi.
>
> ## Son plan özeti
>
> - **Yeni dosyalar (3):**
>   - `demo-kurulum.ts`: Verinin hesaplandığı saf dosya. Veritabanına dokunmaz.
>   - `demo-kurulum.test.ts`: Bu dosyanın birim testi. `npm test` listesine eklenecek.
>   - `seed-demo.ts`: Veritabanına yazan betik.
> - **Değişen dosya:** Yalnızca `package.json`. İki betik eklenecek (`seed:demo`, `seed:demo:canli`) ve test listesine bir dosya eklenecek.
> - **Dokunulmayanlar:** `tenant.ts`, `veri.ts`, `canli-koruma.ts`, `db.ts` ve eski iki demo betiği. `canli-koruma.ts` yalnızca içe aktarılıp aynen çağrılıyor.
> - **Silme:** Ham istemciyle yapılıyor, yalnızca doğrulanmış demo kiracının `tenantId` değeriyle ve açık `where` koşuluyla. Her kiracı tek transaction içinde kuruluyor, zaman aşımı 60 saniye.
> - **Commit planı:** Bu PR'da iki commit olacak. Commit A seed dosyaları (bu adım), Commit B README (3. adım). Ortak mantığın çıkarılması Gün 14 notlarına ertelendi.
>
> ## Burada doğrulananlar
>
> npm sunucusuna buradan erişim kapalı olduğu için Prisma'yı kuramadım. Bunun yerine şunları yaptım:
>
> - **Senaryo testi:** Gerçek `metrikler.ts`, `donem.ts` ve `riskli-abonelikler.ts` dosyalarınla 86 test geçti. Denenen anlar: yılın 12 ayı, ay sonları, yıl geçişi, artık yıl ve şu an.
> - **Betiğin kendisi:** Senin şemandaki kuralları uygulayan sahte bir bellek içi veritabanında uçtan uca çalıştırdım. Ekrana düşen özet şöyle oldu:
>   - **Mavi Yazılım:** 18 müşteri (2 pasif), 19 abonelik (7 iptal), MRR 14.750 TL, bu ay churn %7,7, 12 aylık ortalama churn %4,9, LTV/CAC 3,99 (sağlıklı), 3 riskli abonelik.
>   - **Kuzey Teknoloji:** MRR 18.600 TL, 12 aylık ortalama churn %5,2, LTV/CAC 2,24 (Dikkat), 3 riskli abonelik.
>   - Kiracılar arası kontrolün beş satırı da 0 ve sonuç TAMAM.
> - **Korumalar:** Hepsini ayrı ayrı denedim:
>   - Aynı adlı demo olmayan bir firma varsa ona dokunmadan duruyor.
>   - Başka bir firmanın verisi korunuyor.
>   - `TEST_VERITABANI` eksikse ya da `.env.test` canlı sunucuyu gösteriyorsa duruyor.
>   - `--canli` ile `.env.test` birlikte yüklenmişse duruyor.
>   - Canlı modda terminal yoksa, ya da "evet" dışında bir cevap verilirse duruyor.
> - **Tip kontrolü:** Yeni dosyalar `tsc --strict` ile hatasız. Ancak bunu Prisma tiplerinin bir taslağıyla yaptım, aşağıdaki 6. adım gerçek kontrol olacak.
>
> ## Adımlar (proje kökünde, sırayla)
>
> 1. `git switch -c gun13-seed-readme`: Bugünkü işler için yeni bir dal açar.
> 2. `touch src/test-destek/demo-kurulum.ts src/test-destek/demo-kurulum.test.ts src/test-destek/seed-demo.ts`: Üç boş dosya oluşturur. Her birini VS Code'da aç, gönderdiğim aynı adlı dosyanın içeriğini yapıştır ve `Cmd + S` ile kaydet.
> 3. `perl -pi -e 's|^(\s*)("demo:gecmis": .*,)$|$1$2\n$1"seed:demo": "node --env-file=.env.test --import ./src/test-destek/kancalar.mjs src/test-destek/seed-demo.ts",\n$1"seed:demo:canli": "node --env-file=.env --import ./src/test-destek/kancalar.mjs src/test-destek/seed-demo.ts --canli",|' package.json`: `package.json`'a iki seed betiğini ekler.
> 4. `perl -pi -e 's|src/test-destek/guvenlik-basliklari\.test\.ts"|src/test-destek/guvenlik-basliklari.test.ts src/test-destek/demo-kurulum.test.ts"|' package.json`: Yeni testi `npm test` listesine ekler.
> 5. `npm test`: Bütün birim testlerini çalıştırır. Hepsi geçmeli.
>    - **Önemli:** `kurallar.test.ts` ham Prisma istemcisinin hangi dosyalarda kullanılabileceğini denetliyor. Bu dosyayı görmedim. `seed-demo.ts` yüzünden hata verirse **dur** ve `kurallar.test.ts`'i bana gönder. İzin listesine ekleme yapmak bir korumayı değiştirmek demek, o yüzden önce sana soracağım.
> 6. `npx tsc --noEmit`: Gerçek Prisma tipleriyle tip kontrolü yapar. Hata çıkarsa tamamını gönder.
> 7. `npm run seed:demo`: Test dalına iki demo kiracıyı kurar ve kontrol özetini yazdırır. Son satırda `Sonuç: TAMAM` görmelisin.
> 8. `npm run seed:demo`: Aynı komutu bir kez daha çalıştırır. Bu kez "silinip yeniden kuruldu" yazmalı ve sayılar aynı kalmalı.
> 9. `npm run dev:test`: Uygulamayı test dalında açar. Tarayıcıda `yonetici.mavi@demo.example` / `demo1234` ile gir. Dashboard'da churn, LTV ve LTV/CAC'nin dolu, riskli listede 3 kaydın olduğunu gör. Bitince `Control + C` ile kapat.
> 10. **Canlıya yazma:** `npm run seed:demo:canli` komutunu 3. adımda README'yi bitirip canlıya geçtiğimizde çalıştıracağız, şimdi değil.
>
> Commit A'yı 5-9. adımların sonuçlarını gördükten sonra veririm, üç taramayla birlikte.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **Prisma 7 sözdizimi:** `createManyAndReturn` ve etkileşimli transaction'ın sürücü adaptörüyle çalıştığını varsaydım; `tenant.ts` bu işlemi zaten tanıyor. Bunu kesin olarak 6. ve 7. adımlar gösterecek.
> - **`bcryptjs` içe aktarma:** `import bcrypt from "bcryptjs"` biçimini kullandım. `auth.ts`'yi görmedim. 6. adım hata verirse oradaki yazımı uygularım.
> - **Riskli liste:** Tarihler çalıştırma anına göre hesaplanıyor, bu yüzden riskli liste 7 gün içinde boşalır. Seed yeniden çalıştırılınca yine dolar, betik bunu sonda hatırlatıyor.
> - **İkinci kiracıda durma:** Seed Mavi'yi kurup Kuzey'de durursa Mavi yazılmış kalır, çünkü her kiracı kendi transaction'ında kuruluyor. Betik bu durumu ekrana açıkça yazıyor.

### Prompt 4 · 25 Eki 2026 13:12

````text
Adım 1-6 tamam. Dal gun13-seed-readme açıldı, üç dosya src/test-destek altına taşındı (boyutlar birebir aynı), package.json'a seed:demo ve seed:demo:canli eklendi, test satırına demo-kurulum.test.ts eklendi (diff doğrulandı). npm test: 191 test, 191 geçti, 0 hata (kurallar.test.ts dahil, izin listesine dokunulmadı). npx tsc --noEmit: hatasız. Şimdi 7. adıma geçiyorum, çıktıyı getireceğim.
````

### Claude cevabı 4 · 25 Eki 2026 13:12

> 1-6. adımların hepsi geçmiş. `kurallar.test.ts`'in izin listesine dokunmadan geçmesi ve `npx tsc --noEmit`'in hatasız çıkması, Prisma 7 sözdiziminin ve `bcryptjs` içe aktarmasının doğru olduğunu gösteriyor.
>
> 7. adımın çıktısında şunlara bak:
>
> - **İlk satır:** `Ortam: TEST DALI` olmalı.
> - **Kiracı durumu:** İki kiracı için de `ilk kez kuruldu` yazmalı.
> - **Rakamlar:** Sahte veritabanındaki denememle aynı çıkmalı.
>   - Mavi: MRR 14.750 TL, LTV/CAC 3,99 (sağlıklı).
>   - Kuzey: MRR 18.600 TL, LTV/CAC 2,24 (Dikkat).
>   - İkisinde de `Riskli abonelik 3`.
>   - Olay sayısı (145 / 188 civarı) gün içinde biraz değişebilir, çünkü tarihler çalıştırma anına göre hesaplanıyor.
> - **Son satırlar:** Kiracılar arası kontrolün beş satırı 0 olmalı ve `Sonuç: TAMAM` yazmalı.
>
> Bir şey ters giderse:
>
> - **`hata kodu P2028`:** Transaction 60 saniyede bitmedi demektir. Neon uyanırken olabilir. Birkaç saniye bekleyip aynı komutu tekrar çalıştır. Betik tekrar çalıştırılabilir, yarım kalan kiracıya hiçbir şey yazılmaz.
> - **`Durduruldu: ...`:** Mesajın tamamını gönder. Bu mesajlar adres ya da parola içermez.
> - **Başka bir hata:** Çıktının tamamını gönder. Göndermeden önce yine de bir göz at, içinde adres olmamalı.
>
> Çıktıyı getirdiğinde 8. ve 9. adımlara geçeriz, ardından Commit A'yı veririm.

### Prompt 5 · 25 Eki 2026 13:19

````text
Adım 1-9 tamam. Commit A atıldı (aebe2d5): seed:demo iki kez çalıştı (ilkinde "ilk kez kuruldu", ikincide "silinip yeniden kuruldu", sayılar aynı, Sonuç: TAMAM), npm test 191/191, tsc hatasız, tarayıcıda Mavi ve Kuzey dashboard'ları ve finance hesabı beklendiği gibi. Şimdi 3. adım: README.
İstekler: (1) README.md dosyasını indirilebilir dosya olarak ver (yapıştırma yerine taşıyacağım) ve aynı zamanda içeriğini kısaca özetle. (2) Canlı adres https://abonetakip.onrender.com. Demo hesaplar: yonetici.mavi, finans.mavi, yonetici.kuzey, finans.kuzey (hepsi @demo.example), parola demo1234, "bozulursa seed:demo:canli ile sıfırlanır" notuyla. (3) README'ye tarihe bağlı kesin sayılar yazma (MRR, churn gibi), onlar zamanla değişiyor. Yaklaşık beklentiyi anlat. (4) README'de ad soyad, gerçek e-posta ya da Neon adresi olmasın, örnekler [DATABASE_URL] gibi yer tutucu. (5) Render uyku süresi ve Neon uyanma gecikmesini güncel resmi belgeden kontrol et, kaynak bağlantısıyla yaz. (6) Bilinen sınırlar: giriş sınırı (15 dakikada 5 deneme, 15 dakika blok, e-posta başına, bellekte), Kullanıcılar sayfası yer tutucu olduğu için finance hesabı arayüzden eklenemiyor, riskli liste 7 gün sonra boşalır (seed yeniden), Gün 12 güvenlik sınırları ADR Gün 12 bölümüne bağlantıyla. (7) docs/00_Kurulum_Rehberi.md ile çelişme olmasın, README'deki eski cümleleri ("Sayfa içerikleri sonraki günlerde doldurulacak", "Bu bölüm Gün 13'te doldurulacak") güncelle. (8) README'deki her kurulum adımını bir varsayım listesiyle ver, seed'in iki kiracıyı karıştırmadığını nasıl doğrulayacağımı kısaca yaz (kontrol özeti ve tarayıcı).
````

### Claude cevabı 5 · 25 Eki 2026 13:21

> Render ve Neon'un güncel belgelerini kontrol ediyorum, sonra README'yi yazacağım.
> README.md hazır ve indirilebilir dosya olarak gönderildi. İçinde tek bir yer tutucu kaldı, ona aşağıda ayrıca soruyorum.
>
> ## README'nin içeriği
>
> - **Canlı adres ve demo hesaplar:** Dört demo hesabı bir tabloda, parola `demo1234`. Hesapların herkese açık olduğu ve bozulursa `npm run seed:demo:canli` ile sıfırlanacağı yazılı.
> - **Yaklaşık beklenti, kesin sayı yok:**
>   - Her firmada 18 müşteri ve 12 civarı aktif müşteri var.
>   - Son 12 ayın ortalama churn'ü %3-6 aralığında, bu ay en az bir iptal var.
>   - LTV/CAC Mavi'de "sağlıklı", Kuzey'de "Dikkat".
>   - Her firmada 3 riskli abonelik var.
> - **Yerel kurulum (macOS):** 7 adım ve isteğe bağlı test dalı kurulumu. Her adımın varsayımları ayrı bir tabloda.
> - **Kurulum rehberiyle ilişki:** README, hesap açma ve program kurma için rehbere bağlantı veriyor, aynı adımları tekrar etmiyor. Böylece iki belge birbiriyle çelişmiyor.
> - **Ortam değişkenleri:** Yalnızca adlar ve `[DATABASE_URL]` gibi yer tutucular.
> - **Diğer bölümler:** Rol ve yetki tablosu, uygulama özellikleri, metrik formülleri ve sıfıra bölme kuralı, mimari özet (ADR bağlantısıyla), test komutları tablosu.
> - **Demo verisi:** Komutlar, seed'in ne kurduğu ve güvenceler. Ayrıca "İki firmanın karışmadığını doğrulama" başlığı altında kontrol özetini ve tarayıcıyla yapılacak kontrolü anlatan iki madde var.
> - **Bilinen sınırlar:**
>   - Render uyku süresi ve Neon uyanma gecikmesi, kaynak bağlantılarıyla.
>   - Giriş deneme sınırı. Herkese açık demo hesabın başkası tarafından 15 dakika kilitlenebileceğini de ekledim.
>   - Kullanıcılar sayfasının yer tutucu olması.
>   - Riskli listenin 7 gün sonra boşalması.
>   - Yeni ayda churn'ün 0 görünebilmesi (bunu ben ekledim, aynı tarih bağımlılığından kaynaklanıyor).
>   - Gün 12'de kabul edilen güvenlik sınırları, ADR bağlantısıyla.
> - **Eskiyen cümleler:** "Sayfa içerikleri sonraki günlerde doldurulacak" ve "Bu bölüm Gün 13'te doldurulacak" kaldırıldı.
> - **Taramalar:** Dosyada ad soyad, gerçek e-posta, Neon adresi ya da `npg_` yok. Ad taraması da 0 sonuç verdi.
>
> ## Güncel belgelerden doğrulananlar
>
> - **Render:** Ücretsiz web servisi 15 dakika gelen trafik almazsa uyuyor. Sonraki ilk istekte uyanması yaklaşık bir dakika sürüyor.
> - **Neon:** Veritabanı 5 dakika boşta kalınca duruyor ve ücretsiz planda bu ayar kapatılamıyor. Yeniden başlaması birkaç yüz milisaniye sürüyor.
>
> ## Senden bir cevap gereken yer
>
> **Test dalına geçiş komutu:** İlk taslakta yazdığım `npx dotenv -e .env.test` komutunu çıkardım, çünkü `dotenv` paketinin bir terminal komutu yok. Yerine `[TEST_DALI_GECIS_KOMUTU]` yer tutucusunu koydum. Test dalına tabloları daha önce hangi komutla kurdun? Prompt Günlüğünde ya da `prisma.config.ts`'te yazıyorsa onu göster, README'ye o komutu yazayım. Kendi bildiğin yöntemi doğrudan yazmayı da seçebilirsin.
>
> ## Belge güncelleme listesine (4. adım) not
>
> Kurulum rehberi ile güncel durum arasında iki fark var. Bunları README'ye taşımadım, rehberi düzeltmek için listeye ekleyeceğim:
>
> - **10. bölüm:** Rehber `.env` içinde yalnızca `DATABASE_URL` (doğrudan adres) olduğunu söylüyor. Güncel durumda üç değişken var: havuzlu `DATABASE_URL`, `DIRECT_URL` ve `SESSION_SECRET`.
> - **Neon uyanma süresi:** Rehberde "birkaç saniye" yazıyor, resmi belgede "birkaç yüz milisaniye".
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **Geçiş adresi:** `npx prisma migrate deploy` komutunun geçişleri `prisma.config.ts` üzerinden `DIRECT_URL` ile uyguladığını varsaydım. Bu dosyayı görmedim.
> - **Prisma istemcisi:** Prisma 7'nin istemciyi `npm install` sırasında kendiliğinden üretmeyebileceğini varsaydım. Bu yüzden `npx prisma generate` adımını ayrıca yazdım; gereksiz olsa da zararı yok.
> - **Node sürümü:** README'de "Node 22.18 ve üzeri" yazıyor. Testler ve betikler TypeScript dosyalarını Node ile doğrudan çalıştırıyor, bu da ek ayar olmadan ancak bu sürümden itibaren çalışıyor.
> - **`.env.test` içeriği:** `.env` ile aynı üç değişkeni ve ek olarak `TEST_VERITABANI=evet` satırını içerdiğini varsaydım.
> - **Riskli abonelikler ve SSE:** README bu iki özelliği hangi sayfada olduklarını belirtmeden anlatıyor, çünkü sayfa yerlerini görmedim.
> - **ADR bağlantısı:** Gün 12 bölümünün başlık bağlantısını bilmediğim için bağlantı dosyanın kendisine gidiyor.
>
> Sources:
> - [Render, Deploy for Free](https://render.com/docs/free)
> - [Neon, Scale to Zero](https://neon.com/docs/introduction/scale-to-zero)

### Prompt 6 · 25 Eki 2026 13:23

````text
Test dalı sorusunun cevabı: Test dalı Neon panelinde canlı dalın kopyası (child branch) olarak oluşturuldu, tablolar kopyayla geldi, ayrıca kurulum komutu çalıştırılmadı (ADR satır 269'da yazıyor). README'de [TEST_DALI_GECIS_KOMUTU] yer tutucusu yerine şunu yaz: test:db ve dev:test için Neon panelinde (Branches) canlı dalın kopyası olarak ayrı bir dal oluşturulur, bu dalın adresleri .env.test dosyasına yazılır, tablolar kopyayla gelir. Hocanın çalıştırması gereken tek test komutunun npm test olduğunu (veritabanı istemez) belirt. Başka komut ekleme. README'yi güncel hâliyle yeniden indirilebilir dosya olarak ver.
````

### Prompt 7 · 25 Eki 2026 13:23

````text
Node sürümü notu: proje Node v26.11.1 ile geliştirildi ve test edildi. README'de "Node 22.18 ve üzeri" yerine "Proje Node v26.11.1 ile geliştirildi ve denendi; TypeScript dosyalarını doğrudan çalıştırdığı için güncel bir Node sürümü (22.18 veya daha yeni) gerekir" gibi, doğrulanmış kısmı açıkça ayıran bir ifade yaz.
````

### Claude cevabı 6 · 25 Eki 2026 13:24

> README.md güncel hâliyle gönderildi; bu sürüm iki isteğini de içeriyor.
>
> **Test dalı bölümü:**
> - Yer tutucu kaldırıldı. Yerine, test dalının Neon panelinde (Branches) canlı dalın kopyası olarak oluşturulduğu, adreslerinin `.env.test`'e yazıldığı ve tabloların kopyayla geldiği yazıldı. Yeni bir komut eklenmedi.
> - Bölümün başına bu kısmın yalnızca geliştirici için olduğu notu eklendi.
> - "Testler" bölümünün başına, incelemek için çalıştırılması gereken tek komutun veritabanı istemeyen `npm test` olduğu yazıldı.
> - Varsayım tablosundaki "Test dalı" satırları bu yönteme göre güncellendi. Bir uyarı da ekledim: kopya alındıktan sonra canlıya yeni bir geçiş uygulanırsa, aynı geçişin test dalına ayrıca uygulanması gerekir.
>
> **Node sürümü:**
> - 2. kurulum adımında artık şu yazıyor: "Proje Node v26.11.1 ile geliştirildi ve denendi. Testler ve betikler TypeScript dosyalarını doğrudan çalıştırdığı için güncel bir Node sürümü (22.18 veya daha yeni) gerekir."
> - Varsayım tablosunda doğrulanan kısım (v26.11.1'de bütün testler geçti) ile doğrulanmayan kısım (22.18 alt sınırıyla ayrıca deneme yapılmadı) ayrı ayrı yazıldı.
>
> Taramalarda dosyada ad, gerçek e-posta, Neon adresi ya da `npg_` çıkmadı.
>
> ## Commit B (README)
>
> 1. İndirdiğin README.md dosyasını proje kökündeki README.md'nin yerine taşı. Ardından şu komutla dosyanın doğru yere geldiğini kontrol et: `grep -c "v26.11.1" README.md`. Çıktı `2` olmalı.
> 2. `git add README.md`: README'yi commit için hazırlar.
> 3. Üç taramayı çalıştır. Sonuçlar sırasıyla boş, 0 ve 0 olmalı:
>    - `git --no-pager grep --cached -c -E "npg_[A-Za-z0-9]{6,}"`
>    - `git --no-pager grep --cached -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"`
>    - `git --no-pager grep --cached -h -i -E "[AD_DESENI]" | sed 's/ozgesoganci1-bot//Ig' | grep -ic -E "[AD_DESENI]"`
> 4. Commit'i at. Bu komut README'yi kaydeder ve ekleri en sona tek blok olarak koyar:
>    ```
>    git commit -m "docs: README kurulum, demo hesaplar ve bilinen sınırlar (Gün 13)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
>    Claude-Session: https://claude.ai/code/session_01SLgzvw2VQPMppq9uNXMvbN"
>    ```
>
> PR'ı henüz açma. 4. adımda (belge güncelleme listesi) önerilen düzeltmeleri de bu dala ekleyip PR'ı tek seferde açabiliriz. Bunun için `docs/01_Proje_Onerisi.md` ve `docs/02_ADR.md`'yi göndermen yeterli. Kurulum rehberindeki iki fark da (`.env` değişkenleri ve Neon uyanma süresi) bu listeye girecek.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - GitHub'da başlık bağlantılarının (`#testler`, `#bilinen-sınırlar`) Türkçe karakterli hâlleriyle çalıştığını varsaydım. Push'tan sonra README'deki iç bağlantılara bir kez tıklayıp kontrol et.
> - Commit mesajını başka bir commit'in ekleri bozulmasın diye iki ayrı `-m` ile verdim. Squash sırasında GitHub ekleri yeniden sıralayabilir. Bu Gün 14 notlarındaki PR #40'ta görülen durumun aynısı, yalnızca not düşülür.

### Prompt 8 · 25 Eki 2026 13:41

````text
PR #44 birleşti (main 3d485f3), canlı seed çalıştırıldı ve canlıda iki demo kiracı doğrulandı. Şimdi C kısmına geçelim: docs/ içindeki belgelerde güncellenmesi gereken yerleri listele. Görmen gereken dosyalar için bana tek bir komut ver (docs/01_Proje_Onerisi.md, docs/02_ADR.md ve gerekirse docs/00_Kurulum_Rehberi.md). Kurulum rehberinde bulduğun iki farkı (.env değişkenleri, Neon uyanma süresi) listeye ekle. Önerilen değişiklikleri "eski, yeni, neden" biçiminde ver ve hiçbir dosyayı bana sormadan değiştirme. Sonra Prompt Günlüğü özet tablosu için sorularını sor.
````

### Claude cevabı 7 · 25 Eki 2026 13:42

> Elimde zaten olan kurulum rehberini taradım. Proje önerisi, ADR ve Prompt Günlüğü için aşağıdaki komutu çalıştırıp çıkan dosyayı gönder. Bu turda hiçbir dosyayı değiştirmiyorum, yalnızca öneri listesi veriyorum.
>
> ## Dosyaları toplama komutu
>
> Proje kökünde çalıştır. Komut üç belgeyi sırayla tek bir metin dosyasında masaüstüne toplar:
>
> ```
> for f in docs/01_Proje_Onerisi.md docs/02_ADR.md docs/03_Prompt_Gunlugu.md; do echo "===== $f ====="; cat "$f"; done > ~/Desktop/gun13_belgeler.txt
> ```
>
> Göndermeden önce şu komutla dosyada gizli bilgi olmadığını kontrol et. Çıktı `0` olmalı:
>
> ```
> grep -c -E "npg_|neon\.tech" ~/Desktop/gun13_belgeler.txt
> ```
>
> Prompt Günlüğünü de komuta ekledim, çünkü özet tablosuyla ilgili sorularımı tablonun sütunlarını görünce netleştireceğim.
>
> ## Kurulum rehberi (docs/00_Kurulum_Rehberi.md) için öneriler
>
> Senin istediğin iki fark R1 ve R2. R3 ve R4'ü rehberi tararken ayrıca buldum. R5 ise README'yle tutarlılık için.
>
> **R1. `.env` değişkenleri (Bölüm 10, adım 4-5)**
> - **Eski:** "Şimdilik direct (içinde `-pooler` olmayan) adresi kopyala." Hemen ardından gelen tek satırlık `.env` örneği: `DATABASE_URL="BURAYA_KOPYALADIĞIN_ADRES"`.
> - **Yeni:** Neon'dan iki adres kopyala: havuzlu (pooled) ve doğrudan (direct). Sonra `cp .env.example .env` komutuyla dosyayı oluştur ve üç değeri doldur:
>   - `DATABASE_URL`: havuzlu adres (`-pooler` içerir)
>   - `DIRECT_URL`: doğrudan adres
>   - `SESSION_SECRET`: `openssl rand -base64 32` ile üretilir
> - **Neden:** Rehber Gün 0'da yazılmış ve Gün 2'deki karardan önce kalmış. Bugün uygulama havuzlu adresi, Prisma geçişleri doğrudan adresi kullanıyor ve oturum anahtarı zorunlu. Böylece README ve `.env.example` ile de uyumlu hâle gelir.
>
> **R2. Neon uyanma süresi (Bölüm 10 notu ve Bölüm 13 tablosu)**
> - **Eski (Bölüm 10):** "Neon, 5 dakika kullanılmazsa veritabanı işlemcisini uyutur. Uyandıktan sonraki ilk sorgu birkaç saniye yavaş olabilir." Not başlığında da "(2026 kaynaklarına göre, ... teyit et)" yazıyor.
> - **Yeni (Bölüm 10):** "Neon, 5 dakika kullanılmazsa veritabanını durdurur; ücretsiz planda bu kapatılamaz. Sonraki sorguda birkaç yüz milisaniye içinde yeniden başlar." Kaynak bağlantısı: [Neon, Scale to Zero](https://neon.com/docs/introduction/scale-to-zero). Not başlığı "(25 Ekim 2026'da resmi belgelerden teyit edildi)" olur. Render cümlesi zaten doğru (15 dakika, yaklaşık 1 dakika); ona da [Render, Deploy for Free](https://render.com/docs/free) bağlantısı eklenir.
> - **Eski (Bölüm 13):** "Neon uyuyordu, uyanıyor. Birkaç saniye bekle, tekrar dene."
> - **Yeni (Bölüm 13):** "Neon uyuyordu, uyanıyor. Bir an bekle, tekrar dene."
> - **Neden:** Resmi belge "birkaç saniye" değil "birkaç yüz milisaniye" diyor. README ile aynı bilgi ve aynı kaynak kullanılmış olur.
>
> **R3. Canlı ve geliştirme aynı veritabanı (Bölüm 10 notu, son madde)**
> - **Eski:** "Geliştirme (bilgisayarında) ve canlı site aynı Neon veritabanını kullanacak. Bu, 2 haftalık öğrenci projesi için kabul edilen bir sadeleştirmedir ve ADR'ye yazılmıştır."
> - **Yeni:** "`.env` canlı veritabanıdır. Testler ve demo betikleri için Neon'da canlı dalın kopyası olarak ayrı bir test dalı açılır ve adresleri `.env.test` dosyasına yazılır (Gün 9). `npm run dev:test` uygulamayı bu dalda açar."
> - **Neden:** Gün 9'dan beri ayrı bir test dalı var. Rehberdeki cümle artık yanlış ve okuyanı canlıda test yapmaya yönlendirebilir.
>
> **R4. Günlük çalışma düzeni (Bölüm 12, adım 5-8)**
> - **Eski:** Commit GitHub Desktop'ta atılıyor. PR açıldıktan sonra GitHub'da "Merge pull request" deniyor, sonra GitHub Desktop'ta "Pull origin".
> - **Yeni:**
>   - Dosyalar `git add` ile hazırlanır ve üç tarama yapılır.
>   - Commit terminalden, ekleri en sonda tek blok olacak şekilde atılır.
>   - GitHub Desktop'ta "Publish branch" ve "Create Pull Request" yapılır.
>   - GitHub'da "Squash and merge" seçilir.
>   - Son olarak `git switch main` ve `git pull` çalıştırılır.
> - **Neden:** Güncel kurallar böyle (CLAUDE.md'deki "Güncel çalışma kuralları, Gün 9-11" bölümü). Rehber hâlâ ilk haftanın düzenini anlatıyor.
>
> **R5. Node sürümü (Bölüm 2.2, Kontrol satırı)**
> - **Eski:** "İkisi de bir sürüm numarası gösteriyor (örn. `v22.x.x` ve `10.x.x`)."
> - **Yeni:** "Proje Node v26.11.1 ile geliştirildi ve denendi. Testler TypeScript dosyalarını doğrudan çalıştırdığı için 22.18 veya daha yeni bir sürüm gerekir."
> - **Neden:** README ile aynı ifade kullanılmış olur. `v22.x.x` örneği, 22.18'den eski bir sürümün de yeterli olduğunu düşündürebilir.
>
> Proje önerisi ve ADR için öneriler dosyayı gördükten sonra aynı biçimde gelecek. Bakacağım yerler:
> - Kapsam ve MoSCoW'un gerçekleşen durumla uyumu
> - Kullanıcılar sayfasının yer tutucu kalması
> - Gün 13 kararları için ADR'ye eklenecek bölüm (seed'in ham istemci istisnası, demo tanıma kuralı, canlı onayı, ertelenen ortak mantık)
> - Gün 14 notlarındaki ADR düzeltmeleri, örneğin `[sonuç yazılacak]` yer tutucusu
>
> ## Prompt Günlüğü için sorular
>
> Tablo sütunlarını görünce bunları netleştireceğim; şimdilik önden şunları soruyorum:
>
> 1. **Tarih:** Gün 13 tek satır mı olsun (25 Ekim 2026), yoksa plan turu (24 Ekim) ve uygulama turu (25 Ekim) ayrı satırlar mı?
> 2. **Tur sayısı:** Benim saydığım turlar şunlar: plan, kararlar ve dosyalar, kesinleşen plan, seed, README, README düzeltmeleri ve belgeler. Tabloda kaç tur olarak yazılsın?
> 3. **Çıktının en çok değiştiği yer:** Hangisini kaydetmek istersin?
>    - Senin dört ek isteğin (CAC, riskli abonelikler, bilinen sınırlar, betik içi kontrol özeti)
>    - `tenant.ts` silme yasağını fark edip silmeyi ham istemciye taşıman
>    - Commit 1'i ertelemen
> 4. **AI'nın yaptığı ve senin yakaladığın hatalar:** Benim saydıklarım:
>    - Test dalı için önerdiğim `npx dotenv` komutu çalışmazdı. Bunu kendim yakaladım, sen de ADR'den doğru yöntemi verdin.
>    - İlk planda silmeyi `tenantaBagliDb` ile önermiştim. Senin kararınla ham istemciye taşındı.
>    - Node sürümü ifadesi, senin uyarınla doğrulanan ve doğrulanmayan kısım olarak ayrıldı.
>
>    Eklemek ya da çıkarmak istediğin var mı?
> 5. **Gizlilik:** Kontrol özetindeki sayılar (MRR, LTV/CAC) günlüğe girsin mi? Bunlar sahte veri ama tarihe bağlı.
>
> Sources:
> - [Neon, Scale to Zero](https://neon.com/docs/introduction/scale-to-zero)
> - [Render, Deploy for Free](https://render.com/docs/free)

### Prompt 9 · 25 Eki 2026 13:44

````text
R1-R5 onaylı, rehber (docs/00) düzeltmeleri bu şekilde yapılsın. Dosyalar ekte (gun13_belgeler.txt). Proje önerisi ve ADR için önerilerini aynı "eski, yeni, neden" biçiminde ver, ADR'ye Gün 13 bölümünü de ekle (seed ham istemci istisnası, demo tanıma kuralı, canlı onayı, ertelenen ortak mantık, canlı seed sonucu). Prompt Günlüğü sorularının cevapları: (1) Gün 13 tek satır, 25 Ekim 2026. (2) Tur sayısı: günlük tablosunun sütunları neyse ona göre, önceki satırlara bak. (3) Kaydedilecek: tenant.ts silme yasağını fark edip silmeyi ham istemciye taşıma, koruma dosyalarına dokunmama kararı, Commit 1'in ertelenmesi, dört ek istek (CAC, riskli abonelikler, bilinen sınırlar, kontrol özeti). (4) Hatalar: senin saydıkların artı: commit komutundaki iki ek satırı yapışık yazılmıştı (satır sonu eksikti), PR açıklamasında ek satırları yanlış yere yazılmıştı, README'de Sunumdan önce ifadesi vardı (sunum yok, İncelemeden önce oldu), pasife alma iddiaları ADR ve koddan doğrulandı. (5) Kontrol özeti sayıları günlüğe girmesin, yalnızca iki kiracı, 18 müşteri, LTV/CAC sağlıklı ve Dikkat gibi genel ifade olsun. Hiçbir dosyayı bana sormadan değiştirme, önce listeyi göster.
````

_[ek dosya: gun13_belgeler.txt]_

### Claude cevabı 8 · 25 Eki 2026 13:47

> Belgeleri okudum. Hiçbir dosyayı değiştirmedim, aşağıdakiler yalnızca öneri. Okurken README'de de bir yanlış buldum (M1); PR #44 birleştiği için bu düzeltme de bu turun listesine giriyor.
>
> ## A. ADR (docs/02_ADR.md)
>
> **A1. Render maddesi (Bölüm 4)**
> - **Eski:** "Render ücretsiz web servisi (2026 kaynaklarına göre, Render dokümantasyonundan doğrulanmalı): 15 dakika trafik almazsa uyur, ilk istek yaklaşık 1 dakika sürebilir. Sunum öncesi siteyi önceden açıp ısıt."
> - **Yeni:** "Render ücretsiz web servisi (25 Ekim 2026'da [Render dokümanından](https://render.com/docs/free) doğrulandı): 15 dakika gelen trafik almazsa uyur, sonraki ilk istekte uyanması yaklaşık 1 dakika sürer. İnceleme öncesi siteyi açıp ısıt."
> - **Neden:** Bilgi doğrulandı ve kaynağı eklendi. Ayrıca sunum olmadığı için "Sunum öncesi" yerine "İnceleme öncesi" yazıldı.
>
> **A2. Neon maddesi (Bölüm 4)**
> - **Eski:** "... (2026 kaynaklarına göre, Neon dokümantasyonundan doğrulanmalı): Süresizdir ama 5 dakika kullanılmazsa işlemcisi uyur, uyandıktan sonraki ilk sorgu yavaş olabilir. Depolama sınırı küçüktür (0,5-1 GB) ..."
> - **Yeni:** "Neon ücretsiz veritabanı: 5 dakika boşta kalınca durur, ücretsiz planda bu kapatılamaz ve birkaç yüz milisaniyede yeniden başlar (25 Ekim 2026'da [Neon dokümanından](https://neon.com/docs/introduction/scale-to-zero) doğrulandı). Süresiz olması ve depolama sınırı (0,5-1 GB) doğrulanmadı."
> - **Neden:** Doğrulanan ve doğrulanmayan kısımlar birbirinden ayrılmış olur.
>
> **A3. İki ayrı sağlayıcı maddesi (Bölüm 4)**
> - **Eski:** "Bağlantı adresi yalnızca ortam değişkeninde (`DATABASE_URL`) tutulur, Render ve yerel `.env` içinde ayrı ayrı tanımlanır."
> - **Yeni:** "Bağlantı adresleri yalnızca ortam değişkenlerinde tutulur: `DATABASE_URL` (havuzlu) ve `DIRECT_URL` (doğrudan). Bunlar Render'da ve yerel `.env` içinde ayrı ayrı tanımlanır. Testler ve demo betikleri `.env.test` ile Neon test dalını kullanır (Gün 6)."
> - **Neden:** Gün 2'deki iki adres kararı ve Gün 6'da açılan test dalı Bölüm 4'e yansımamıştı.
>
> **A4. Değişiklik geçmişi (Bölüm 5)**
> - **Eski:** Üç satırda `[Tarih]` yazıyor.
> - **Yeni:** Bu üç satıra gerçek tarihler yazılır (soru 1). Tablonun sonuna şu satır eklenir: "25 Ekim 2026 | Gün 13: demo verisi (seed), README, belge güncellemeleri | Projenin başkası tarafından çalıştırılabilmesi ve incelenebilmesi; ayrıntı Gün 13 bölümünde."
> - **Neden:** Yer tutucular Gün 14 notlarında da duruyor. Gün 13 geçmişte kayıtsız kalırdı.
>
> **A5. Gün 10'daki build yer tutucusu**
> - **Eski:** "`npm run build` [sonuç yazılacak]."
> - **Yeni:** "`npm run build` sonucu Gün 10'da kaydedilmedi. 25 Ekim 2026'da main üzerinde (`3d485f3`) çalıştırıldı: [ölçülen sonuç]."
> - **Neden:** Gün 14 notundaki "tahmin yazma, gerekirse yeniden çalıştırarak ölç" kuralına uyar. Bunun için senin `npm run build` çalıştırman gerekiyor (soru 3).
>
> **A6. Gün 10 elle test bölümü**
> - **Eski:** Altı satır `[SONUÇ: ...]` yer tutucusu ve Bilinen sınırlar bölümünde "[Açık bir SSE bağlantısının ücretsiz servisi uyanık tutup tutmadığı Render'da denenmedi.]"
> - **Yeni:** Senin hatırladığın sonuçlar yazılır. Hatırlamıyorsan şu cümle yazılır: "Bu maddeler test dalında denendi, ayrıntılı sonuç kaydedilmedi." Köşeli parantezli cümlenin parantezleri kaldırılır.
> - **Neden:** Gün 14 notlarında yoktu, belgeyi okurken buldum. Sonuçları senin yerine yazamam (soru 4).
>
> **A7. Gün 11'deki başlık girintisi**
> - **Eski:** `  ### Parça B kararları: ...` (başında iki boşluk var)
> - **Yeni:** `### Parça B kararları: ...`
> - **Neden:** Baştaki boşluk yüzünden GitHub bu satırı başlık olarak göstermeyebilir. Gün 14 notlarında da duruyor.
>
> **A8. Gün 13 bölümü (yeni, Gün 12 bölümünün altına)**
>
> Taslak aşağıda. Sayı içermiyor; yalnızca test sayısı, PR ve commit bilgisi var.
>
> ```markdown
> ## Gün 13 kararları (25 Ekim 2026): demo verisi (seed), README ve belgeler
>
> **Durum:** Birleşti, PR #44 (main `3d485f3`). Dalda iki commit vardı: seed (`aebe2d5`) ve README.
> `npm run seed:demo` test dalında iki kez çalıştırıldı: ilk kurulum ve yeniden kurulum, sayılar aynı,
> kontrol özeti TAMAM. `npm run seed:demo:canli` canlıda çalıştırıldı; iki demo kiracı tarayıcıda
> doğrulandı.
> **Sonuç:** `npm test` 191 test geçiyor (86'sı yeni demo senaryosu testi). `npx tsc --noEmit` temiz.
> `kurallar.test.ts` değiştirilmedi ve geçiyor.
>
> ### Kararlar
>
> **K13.1: Demo senaryosu saf bir dosyada hesaplanır ve tekrarlanabilir**
> - **Karar:** `src/test-destek/demo-kurulum.ts` iki kiracının ("Mavi Yazılım", "Kuzey Teknoloji")
>   verisini hesaplar, veritabanına dokunmaz. Rastgele seçimler sabit tohumlu küçük bir sayı
>   üreteciyle yapılır (ek paket yok). Tarihler çalıştırma anına göre kaydırılır
>   (`gecmis-mrr-verisi.ts` ile aynı yaklaşım).
> - **İçerik:** Her kiracıda bir manager ve bir finance kullanıcısı, 3 plan (2 aylık, 1 yıllık) ve
>   18 müşteri vardır. Abonelikler son 12 aya yayılır: başlayanlar, yenilenenler, iptal edenler,
>   iptal edip başka planla dönen bir müşteri ve 2 pasif müşteri. CAC: Mavi 4.000 TL, Kuzey 9.000 TL.
>   Böylece biri "sağlıklı", öteki "Dikkat" gösterir.
> - **Bilinçli seçimler:**
>   - Bu ay en az bir iptal vardır: churn 0 olmaz, LTV ve LTV/CAC boş görünmez.
>   - Dönem bitişine 1-6 gün kalan tam 3 riskli abonelik vardır. Diğer aboneliklerin dönem sonu
>     en az 8 gün uzaktadır.
>   - Son 12 ayın ortalama churn'ü %3-6 aralığındadır.
>   - Ayın ilk 2 saatinde betik çalışmaz, çünkü bu ayın iptali ay içine sığmaz.
> - **Test:** `demo-kurulum.test.ts` (`npm test`) senaryoyu yılın farklı anlarında üretip kontrol eder:
>   - ay ortaları, ay sonları, yıl geçişi ve artık yıl denenir
>   - gelecek tarihli kayıt yoktur
>   - bir müşterinin aynı anda tek aktif aboneliği vardır
>   - pasif müşterinin aktif aboneliği yoktur
>   - churn aralığı tutar ve bu ay churn 0'dan büyüktür
>   - tam 3 riskli abonelik vardır
>   - aynı an için aynı veri üretilir
>   - demo parolası kayıt formundaki parola kuralına uyar
>
> **K13.2: Seed, ham Prisma istemcisini kendi bağlantısıyla kullanır (istisna)**
> - **Karar:** `src/test-destek/seed-demo.ts` kendi `PrismaClient`'ını `@prisma/adapter-pg` ve
>   `DATABASE_URL` ile kurar.
> - **Neden:** `tenant.ts` firma oluşturmayı ve müşteri, plan, abonelik, olay silmeyi bilerek engeller.
>   İlk plandaki `tenantaBagliDb` ile silme bu yüzden çalışmazdı. `tenant.ts`, `veri.ts`,
>   `canli-koruma.ts` ve `db.ts` değiştirilmedi; korumaları zayıflatılmadı. `veri.ts` kullanılmadı,
>   çünkü `TEST_VERITABANI=evet` ister ve canlı moda izin vermez.
> - **Sınır:** Her silme yalnızca K13.3 ile doğrulanmış demo kiracının kimliğiyle, açık
>   `where: { tenantId }` koşuluyla yapılır. Joker silme yoktur. Bu bir yönetici betiğidir: `tenantId`
>   istemciden gelmez. İstisna, dosyanın başında yorumla yazılıdır.
>
> **K13.3: Demo kiracı tanıma kuralı**
> - **Karar:** İki koşul birlikte sağlanmalıdır:
>   1. Firma adı birebir "Mavi Yazılım" ya da "Kuzey Teknoloji".
>   2. Firmanın en az bir kullanıcısı var ve bütün kullanıcıları `@demo.example` uzantılı.
> - **Durma durumları:** Betik o kiracıya dokunmadan durur:
>   - aynı adla birden fazla firma varsa
>   - adı tutan ama demo olmayan bir firma varsa
>   - demo e-postalarından biri başka bir firmada kayıtlıysa
> - **Neden şema değişikliği yok:** `.example`, belgeler için ayrılmış bir alan adıdır (RFC 2606) ve
>   gerçek bir kişiye ait olamaz. Bu yüzden `isDemo` gibi bir sütun eklenmedi.
> - **Yeniden kurulum:** Firma satırı korunur, kimliği değişmez; yalnızca CAC güncellenir. Kayıtlar
>   olaylardan kullanıcılara doğru silinip yeniden yazılır. Her kiracı ayrı bir transaction içinde
>   kurulur (zaman aşımı 60 saniye).
>
> **K13.4: Canlıya yazma iki adımlı onayla**
> - `npm run seed:demo`: `.env.test` ile çalışır. Mevcut `canli-koruma.ts` kontrolü aynen uygulanır.
> - `npm run seed:demo:canli`: `.env` ve `--canli` ile çalışır. Ek koşullar:
>   - `TEST_VERITABANI=evet` yüklü olmamalı (yanlışlıkla `seed:demo -- --canli` yazılmasına karşı)
>   - terminal etkileşimli olmalı
>   - kullanıcı `evet` yazmalı
> - Koşullardan biri eksikse ya da bilinmeyen bir seçenek verilmişse betik veritabanına bağlanmadan
>   durur.
>
> **K13.5: Kiracıların karışmadığını betiğin kendi kontrol özeti doğrular**
> - Kurulumdan sonra kiracı başına sayılar ve dashboard'daki metrikler yazdırılır. Metrikler aynı
>   `metrikler.ts` fonksiyonlarıyla hesaplanır.
> - **Kiracılar arası kontrol:** Kayıtların sahibi tenant filtresi olmadan, yalnızca kimlikle okunur.
>   Beş sayı tutulur:
>   - başka kiracının müşterisine bağlı abonelik
>   - başka kiracının planına bağlı abonelik
>   - başka kiracının aboneliğine bağlı olay
>   - demo olmayan firmalardaki `@demo.example` kullanıcısı
>   - demo firmalardaki demo olmayan kullanıcı
> - Hepsi 0 ise "TAMAM" yazar; değilse "HATA" yazar ve çıkış kodu 1 olur. Bileşik anahtarlar bu
>   durumları veritabanında zaten engeller; kontrol ek bir güvencedir.
> - Ekrana hiçbir adres yazılmaz; yalnızca sahte e-postalar ve sayılar görünür. Hata durumunda
>   yalnızca Prisma hata kodu yazılır.
>
> **K13.6: Ortak yazma mantığı ertelendi**
> - `demo-verisi.ts` ve `gecmis-mrr-verisi.ts` içindeki tekrar eden yazma döngüsünün ortak bir dosyaya
>   çıkarılması planlanmıştı. Bu iş Gün 14'e ya da sonraya ertelendi. Eski iki betiğe dokunulmadı.
>   Seed yalnızca `donem-ilerlet.ts`'i onlarla paylaşır.
> - **Neden:** Değişiklik eski betiklerde gerileme riski taşır ve elle karşılaştırma gerektirir.
>
> **K13.7: README**
> - **İçerik:** Kurulum, demo hesaplar, rol tablosu, metrik formülleri, mimari özet, test ve demo
>   komutları, bilinen sınırlar. Demo parolası herkese açık README'dedir; bozulursa
>   `seed:demo:canli` ile sıfırlanır.
> - **Tarihe bağlı rakamlar:** Kesin rakam yazılmadı, yalnızca yaklaşık beklenti verildi.
> - **Doğrulanan süreler:** Render uyku ve Neon uyanma süreleri 25 Ekim 2026'da resmi dokümandan
>   doğrulanıp kaynağıyla yazıldı.
> - **Test dalı:** Neon'da canlı dalın kopyası olarak açılır; README'ye yeni bir komut eklenmedi.
> - **İnceleme:** İnceleme için çalıştırılması gereken tek test komutu `npm test`'tir.
>
> ### Elle test
>
> | Durum | Ortam | Sonuç |
> |---|---|---|
> | `seed:demo` ilk çalıştırma | Test dalı | İki kiracı ilk kez kuruldu, kontrol özeti TAMAM |
> | `seed:demo` ikinci çalıştırma | Test dalı | Silinip yeniden kuruldu, sayılar aynı, TAMAM |
> | Mavi ve Kuzey manager ile dashboard, finance hesabı | Test dalı | Beklendiği gibi |
> | `seed:demo:canli`, `evet` onayı | Canlı | İki demo kiracı kuruldu, tarayıcıda doğrulandı [kontrol özeti: soru 5] |
>
> ### Bilinen sınırlar
> - **Tarihe bağlı veri:** Riskli liste yaklaşık 7 gün sonra boşalır. Yeni ayda henüz iptal yoksa churn
>   0 olur ve LTV "hesaplanamadı" görünür. Seed yeniden çalıştırılınca ikisi de düzelir.
> - **Herkese açık demo hesaplar:** Veri bozulabilir ya da parola değiştirilebilir. Giriş sınırı
>   nedeniyle bir hesap 15 dakika kilitlenebilir (K12.1).
> - **Kiracılar ayrı transaction'larda:** Biri kurulup öteki durursa ilki yazılmış kalır. Betik bu
>   durumu ekrana yazar.
> - **Oturumlar:** Yeniden kurulumda demo kullanıcılar silinip yeniden yaratıldığı için açık
>   oturumları geçersizleşir.
> - **Tekrar eden kod:** Ortak yazma mantığının tekrarı sürüyor (K13.6).
>
> ### Süreç notları
> - **Plan:** İki turda kesinleşti: (a)-(e) kararları ve dört ek istek (CAC, riskli abonelikler,
>   bilinen sınırlar, kontrol özeti).
> - **Doğrulama:** Seed, tarayıcıdan önce kendi kontrol özetiyle doğrulandı.
> - **README düzeltmeleri:**
>   - AI'nın önerdiği `npx dotenv` komutu çıkarıldı; `dotenv` paketinin terminal komutu yok.
>   - Node sürüm ifadesi, doğrulanan ve doğrulanmayan kısım olarak ayrıldı.
>   - "Sunumdan önce" yerine "İncelemeden önce" yazıldı.
>   - Pasife alma iddiaları ADR ve koddan doğrulandı.
> - **Commit ekleri:** Claude Opus 5.5. Commit komutunda iki ek satır yapışık yazılmıştı; PR
>   açıklamasında ekler yanlış yerdeydi. İkisi de düzeltildi.
> ```
>
> ## B. Proje önerisi (docs/01_Proje_Onerisi.md)
>
> **B1. Başlık satırları**
> - **Eski:** "**Geliştirici:** [Ad Soyad] • **Öğrenci no:** [No] • **Tarih:** [Tarih]" ve "**GitHub deposu:** [Depo bağlantısı] • **Canlı adres:** [Render bağlantısı]"
> - **Yeni:** "**Geliştirici:** Teslim formunda verilir • **Tarih:** [gerçek tarih]" ve "**GitHub deposu:** [soru 2] • **Canlı adres:** https://abonetakip.onrender.com"
> - **Neden:** Depo herkese açık ve 3. tarama ad soyadı yakalar, bu yüzden ad ve numara depoya yazılmamalı. Canlı adres artık belli.
>
> **B2. Yeni bölüm: "7. Gerçekleşen durum (25 Ekim 2026)"**
> - **Eski:** Böyle bir bölüm yok. Öneri belgesi plan olarak kalıyor.
> - **Yeni:** Planın kendisi değiştirilmez, altına kısa bir durum bölümü eklenir:
>   - MUST maddelerinin 5'i de tamamlandı.
>   - SHOULD: SSE ile iptal uyarısı ve aylık MRR grafiği tamamlandı. Riskli abonelikler SSE ile gönderilmiyor, dashboard'da bir liste olarak gösteriliyor (ADR K10.7).
>   - COULD maddeleri yapılmadı (soru 6).
>   - Manager'ın "kullanıcı ekler" yetkisi gerçekleşmedi: Kullanıcılar sayfası yer tutucu kaldı.
>   - Başarı ölçütü demo kiracılar ve otomatik testlerle karşılandı (ADR Gün 6, 9, 11, 13).
> - **Neden:** Öneri ile teslim edilen ürün arasındaki farkı inceleyen kişi tek yerde görür.
>
> ## C. Kurulum rehberi (docs/00_Kurulum_Rehberi.md), onaylı listeye bir ekleme
>
> **R6. "Sunumdan önce" ifadesi**
> - **Eski:** Bölüm 10'daki notta "Sunumdan önce siteyi önceden açıp ısıt."
> - **Yeni:** "İncelemeden önce siteyi açıp ısıt."
> - **Neden:** Sunum yok. README ve ADR'de de aynı düzeltme yapılıyor. R1-R5 aynen kalıyor.
>
> ## D. README (birleşmiş PR #44 sonrası düzeltme)
>
> **M1. SSE ile ilgili yanlış iddia** (bu benim hatam)
> - **Eski:** "**Gerçek zamanlı uyarı:** iptal ve riskli abonelik uyarıları SSE ile yalnızca ilgili firmanın kullanıcılarına gönderilir."
> - **Yeni:** "**Gerçek zamanlı uyarı:** abonelik iptali SSE ile yalnızca ilgili firmanın kullanıcılarına anında bildirilir. Riskli abonelikler SSE ile gönderilmez; dashboard'daki liste sayfa açılışında hesaplanır."
> - **Ayrıca:** MoSCoW bölümündeki "SSE ile iptal ve riskli abonelik uyarısı" ifadesi plan olarak kalabilir. Yanına "(riskli abonelikler liste olarak)" eklenir.
> - **Neden:** ADR K10.7'ye göre SSE yalnızca iptal olayını canlı iletiyor. README'yi yazarken bunu bilmiyordum; ADR'yi okuyunca fark ettim.
>
> ## E. Prompt Günlüğü (docs/03_Prompt_Gunlugu.md)
>
> **G1. Tablo başlığı eksik**
> - **Eski:** "Proje boyunca ek kayıtlar" tablosu doğrudan `| 1 | ...` satırıyla başlıyor; başlık ve ayırıcı satırı yok.
> - **Yeni:** Tablonun üstüne şu iki satır eklenir: `| Gün | Prompt | Çıktı | AI çıktısını değiştirdim mi? |` ve `|---|---|---|---|`
> - **Neden:** Başlık satırı olmadan GitHub bu satırları tablo olarak göstermez, düz metin olarak gösterir. Sütun adları önerimdir, değiştirebilirsin. Ayrı bir tur sütunu olmadığı için tur sayısı yazmadım.
>
> **G2. Gün 13 satırı (yeni)**
>
> ```
> | 13 | Gün 13 promptu: seed (demo veri) betiği, README ve belge güncellemeleri. Önce plan; kararlar (a)-(e) ve dört ek istekle kesinleşti, onaydan sonra seed, README ve belge listesi adım adım. Plan ve uygulama bu sohbette yapıldı | `demo-kurulum.ts` (saf senaryo, sabit tohum) ve `demo-kurulum.test.ts` (yılın farklı anlarında senaryo kontrolü; `npm test` 191), `seed-demo.ts` (`seed:demo` ve `seed:demo:canli`, demo kiracı tanıma kuralı, canlıda "evet" onayı, betik sonunda kontrol özeti), README (kurulum, demo hesaplar, bilinen sınırlar, Render ve Neon süreleri resmi kaynakla); PR #44. Canlıda iki demo kiracı (her birinde 18 müşteri; LTV/CAC birinde sağlıklı, ötekinde Dikkat), kontrol özeti TAMAM | Evet: (1) AI ilk planda silmeyi `tenantaBagliDb` ile önerdi; `tenant.ts`'in silme yasağı fark edildi, silme ham istemciye ve yalnızca doğrulanmış demo kiracının `tenantId`'sine taşındı; (2) koruma dosyalarına (`tenant.ts`, `veri.ts`, `canli-koruma.ts`) dokunulmadı, seed kendi bağlantısını ve kendi canlı korumasını kurdu; (3) ortak yazma mantığının çıkarılması (Commit 1) ertelendi, eski demo betiklerine dokunulmadı; (4) dört ek istek eklendi: CAC, riskli abonelikler, README bilinen sınırları, betik içi kontrol özeti; (5) AI README'de test dalı için çalışmayan bir `npx dotenv` komutu yazdı, kendisi fark etti; doğru yöntem (Neon'da canlı dalın kopyası) ADR'den verildi; (6) Node sürüm ifadesi doğrulanan (v26.11.1) ve doğrulanmayan (22.18 alt sınırı) olarak ayrıldı; (7) commit komutunda iki ek satır yapışık yazılmıştı (satır sonu eksikti); (8) PR açıklamasında ek satırları yanlış yerdeydi; (9) README'de "Sunumdan önce" ifadesi "İncelemeden önce" yapıldı; (10) README'deki pasife alma iddiaları ADR ve koddan doğrulandı; (11) README'deki SSE iddiası ADR K10.7'ye göre düzeltildi |
> ```
>
> Madde (11), M1'i onaylarsan geçerli olur. "Kontrol özeti TAMAM" ifadesi de soru 5'e bağlı.
>
> **G3. Üst kısımdaki yer tutucular**
> - **Eski:** `[örn. Claude, sürüm]`, `[Tarih]` ve Tur 1-3 ile Sonuç notlarındaki `[doldur]` alanları.
> - **Öneri:** Bunları ben doldurmuyorum. Belgenin kuralı, bu alanların "kendi gözlemlerinle" doldurulmasını istiyor. Gün 14 notlarında zaten var; orada sen yazarsın.
>
> ## Sorular
>
> 1. ADR değişiklik geçmişindeki üç `[Tarih]` ve proje önerisinin tarihi ne olsun?
> 2. GitHub kullanıcı adın adını ya da soyadını içeriyor mu? İçeriyorsa depo bağlantısı yazılmasın; 3. tarama onu da yakalar.
> 3. A5 için main üzerinde `npm run build` çalıştırıp sonucu söyler misin? Yalnızca "başarılı" ya da hata özeti yeterli.
> 4. Gün 10'daki altı `[SONUÇ]` maddesinin sonuçlarını hatırlıyor musun? Hatırlamıyorsan "kaydedilmedi" cümlesi mi yazılsın?
> 5. Canlıda seed'in kontrol özeti de `Sonuç: TAMAM` mı verdi?
> 6. COULD maddeleri (CSV dışa aktarma, plan bazlı kırılım) yapılmadı diye yazayım mı?
> 7. Gün 14 notlarındaki A4, A5, A7 ve proje önerisi yer tutucularını şimdi bu dalda mı yapalım, yoksa Gün 14'e mi bırakalım?
>
> Onayladığın maddeleri yeni bir dalda tam dosyalar olarak hazırlarım. M1 için README de aynı dala girer.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **SSE ve riskli liste:** ADR K10.7'yi riskli listenin SSE ile gönderilmediği şeklinde okudum. Uygulamada riskli abonelik için ayrı bir SSE bildirimi sonradan eklendiyse M1 ve B2 yanlış olur.
> - **Squash commit:** `3d485f3`'ün PR #44'ün squash commit'i olduğunu varsaydım.
> - **Test dalı tarihi:** A3'te test dalının Gün 6'da açıldığını ADR'den aldım. Kurulum rehberi için R3'te "Gün 9" yazmıştım; doğrusu Gün 6, onu da düzelteceğim.
>
> Sources:
> - [Render, Deploy for Free](https://render.com/docs/free)
> - [Neon, Scale to Zero](https://neon.com/docs/introduction/scale-to-zero)

### Prompt 10 · 25 Eki 2026 13:48

````text
proje önerisi kısmını çıkart , fazla detay olduğunu düşünüyorum
````

### Claude cevabı 9 · 25 Eki 2026 13:49

> Tamam, proje önerisini (B1 ve B2) listeden çıkardım; o dosyaya dokunulmayacak. Gün 14 notlarındaki "Proje önerisi belgesindeki yer tutucuları doldur" maddesi de not olarak orada kalır, bu dalda yapılmaz.
>
> ## Kalan liste
>
> - **ADR (docs/02_ADR.md):**
>   - A1 Render maddesi
>   - A2 Neon maddesi
>   - A3 iki sağlayıcı ve test dalı
>   - A4 değişiklik geçmişi
>   - A5 Gün 10 build sonucu
>   - A6 Gün 10 `[SONUÇ]` maddeleri
>   - A7 Gün 11 başlık girintisi
>   - A8 Gün 13 bölümü
> - **Kurulum rehberi (docs/00_Kurulum_Rehberi.md):** Onaylı R1-R5 ve ek olarak R6 ("Sunumdan önce" yerine "İncelemeden önce"). R3'teki "Gün 9" ifadesi "Gün 6" olarak düzeltilecek.
> - **README:** M1, yani SSE iddiasının ADR K10.7'ye göre düzeltilmesi.
> - **Prompt Günlüğü (docs/03_Prompt_Gunlugu.md):** G1 tablo başlığı ve G2 Gün 13 satırı. G3 Gün 14'e kalıyor.
>
> ## Güncellenen sorular
>
> 1. ADR değişiklik geçmişindeki üç `[Tarih]` yerine hangi tarihler yazılsın?
> 2. A5 için main üzerinde `npm run build` çalıştırıp sonucunu söyler misin? "Başarılı" ya da hata özeti yeterli.
> 3. Gün 10'daki altı `[SONUÇ]` maddesinin sonuçlarını hatırlıyor musun? Hatırlamıyorsan "kaydedilmedi" cümlesi mi yazılsın?
> 4. Canlıda seed'in kontrol özeti de `Sonuç: TAMAM` mı verdi?
> 5. A4, A5 ve A7 Gün 14 notlarında da var. Şimdi bu dalda mı yapalım, yoksa Gün 14'e mi bırakalım?
>
> Cevaplarınla birlikte onayladığın maddeleri yeni bir dalda tam dosyalar olarak hazırlarım.

### Prompt 11 · 25 Eki 2026 13:50

````text
Cevaplar: (1) ADR değişiklik geçmişindeki [Tarih] satırları Gün 14'e kalsın, gerçek tarihleri git geçmişinden bulacağız. (2) npm run build 25 Ekim 2026'da Gün 13 dalında başarılıydı (hata yok, tüm rotalar listelendi). (3) Gün 10 [SONUÇ] maddeleri Gün 14'e kalsın. (4) Canlıda seed kontrol özeti Sonuç: TAMAM verdi, iki demo kiracı tarayıcıda doğrulandı. (5) A4, A5, A6 ve A7 Gün 14'e kalsın, bu PR'a girmesin. Bu PR'ın kapsamı: ADR A1, A2, A3, A8; kurulum rehberi R1-R6 (R3'te Gün 6 olarak düzelt); README M1; Prompt Günlüğü G1 ve G2.
Yeni karar: proje önerisi belgesi depodan kaldırılacak. docs/01_Proje_Onerisi.md silinecek ve README, ADR, kurulum rehberi, CLAUDE.md gibi belgelerdeki bağlantı ve anmalar kaldırılacak. Geçmiş kayıtlara (prompt_cevap, Prompt Günlüğü'ndeki eski satırlar) dokunulmayacak. Hangi dosyalarda geçtiğini taramanın çıktısını ayrıca getireceğim, onu bekle. Şimdilik yukarıdaki kapsam için dosyaları hazırla, silme işlemini ve bağlantı temizliğini taramadan sonra ayrı bir adım olarak ekleyeceğiz.
````

### Claude cevabı 10 · 25 Eki 2026 13:52

> Kapsamı netleştirdin: ADR'de A1, A2, A3 ve A8; kurulum rehberinde R1-R6; README'de M1; Prompt Günlüğünde G1 ve G2. Belgeleri gönderdiğin dökümlerden çıkarıp düzenliyorum.
> Rehber ve ADR'deki küçük düzeltmeler yerinde. Şimdi ADR'nin sonuna Gün 13 bölümünü ekliyorum.
> Şimdi Prompt Günlüğüne tablo başlığını (G1) ve Gün 13 satırını (G2) ekliyorum.
> Bu PR'ın üç belgesi hazır ve gönderildi. README için tam dosya yerine küçük bir perl düzenlemesi veriyorum, çünkü README'yi benden sonra sen düzenledin. Proje önerisinin silinmesine ve bağlantı temizliğine dokunmadım; tarama çıktını bekliyorum.
>
> ## Bu PR'da yapılanlar
>
> - **`docs/00_Kurulum_Rehberi.md`:** R1-R6 uygulandı. R3'te test dalının açıldığı gün "Gün 6" olarak düzeltildi.
> - **`docs/02_ADR.md`:**
>   - A1, A2 ve A3, Bölüm 4'te uygulandı.
>   - A8: Gün 13 bölümü dosyanın en sonuna eklendi. Cevaplarına göre güncelledim:
>     - Canlı kontrol özeti TAMAM.
>     - `npm run build` Gün 13 dalında başarılı.
>     - Süreç notlarına SSE düzeltmesi (M1) eklendi.
>   - A4, A5, A6 ve A7'ye dokunulmadı; Gün 14'e kaldılar.
> - **`docs/03_Prompt_Gunlugu.md`:** G1 (tablo başlığı) ve G2 (Gün 13 satırı) eklendi. Başka hiçbir satır değişmedi.
> - **Taramalar:** Üç dosyada da üç tarama temiz.
>
> ## Adımlar (proje kökünde, sırayla)
>
> 1. `git switch main && git pull`: main'e geçer ve PR #44 dahil en güncel hâli alır.
> 2. `git switch -c gun13-belgeler`: Belge güncellemeleri için yeni bir dal açar.
> 3. İndirdiğin üç dosyayı `docs/` klasöründeki aynı adlı dosyaların yerine taşı.
> 4. `git diff --stat`: Hangi dosyalarda kaç satır değiştiğini gösterir. Yalnızca bu üç dosya görünmeli. Satır sayıları benim tarafımda şöyleydi: rehberde yaklaşık 38, ADR'de yaklaşık 139, günlükte 3 satır farkı.
> 5. README'deki gerçek zamanlı uyarı cümlesini düzeltir:
>    ```
>    perl -pi -e 's/\Q- **Gerçek zamanlı uyarı:** iptal ve riskli abonelik uyarıları SSE ile yalnızca ilgili firmanın kullanıcılarına gönderilir.\E/- **Gerçek zamanlı uyarı:** abonelik iptali SSE ile yalnızca ilgili firmanın kullanıcılarına anında bildirilir. Riskli abonelikler SSE ile gönderilmez, dashboard sayfasındaki listede sayfa açılışında hesaplanır./' README.md
>    ```
> 6. README'deki MoSCoW satırını düzeltir:
>    ```
>    perl -pi -e 's/\Q- **SHOULD:** SSE ile iptal ve riskli abonelik uyarısı, aylık MRR grafiği\E/- **SHOULD:** SSE ile iptal uyarısı (riskli abonelikler liste olarak), aylık MRR grafiği/' README.md
>    ```
> 7. `grep -c "SSE ile gönderilmez\|riskli abonelikler liste olarak" README.md`: İki düzenlemenin de tuttuğunu kontrol eder. Çıktı `2` olmalı. `0` ya da `1` çıkarsa README'deki cümle benim kopyamdan farklı demektir; o satırı bana gönder.
>
> Commit'i şimdi atma. Proje önerisinin silinmesi ve bağlantı temizliği de bu dala girecek. Tarama çıktını getirdiğinde o değişiklikleri ekler, sonra commit, üç tarama ve PR adımlarını tek seferde veririm.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **Kaynak dosyalar:** ADR ve Prompt Günlüğünü bugünkü `gun13_belgeler.txt` dökümünden, kurulum rehberini sabahki dökümden aldım. Rehber o zamandan beri değiştiyse 4. adımdaki `git diff --stat` bunu gösterir; o durumda dosyayı taşımadan önce bana söyle.
> - **Rehberde kalan bağlantı:** Kurulum rehberinin 8. bölümündeki tabloda hâlâ `01_Proje_Onerisi.md` geçiyor. Bunu bilerek bıraktım; tarama sonrasındaki bağlantı temizliğinde ele alacağız.
> - **Gün 13 satırındaki ifade:** Prompt Günlüğündeki Gün 13 satırında "Plan ve uygulama bu sohbette yapıldı" yazıyor. Önceki satırlarda "ayrı bir sohbette" ifadesi kullanılmış; senin düzenine göre değiştirmek istersen söyle.

### Prompt 12 · 25 Eki 2026 13:54

````text
Tarama çıktısı geldi. Proje önerisi geçen yerler:
- docs/01_Proje_Onerisi.md dosyasının kendisi (docs/ içinde var)
- README.md 202. satır: "- [Proje önerisi](docs/01_Proje_Onerisi.md)"
- docs/00_Kurulum_Rehberi.md 146. satır: klasör tablosunda `01_Proje_Onerisi.md` dosya adı
- docs/04_14_Gunluk_Prompt_Plani.md 699. satır: "C) Belgeler: docs/ içindeki proje önerisi ve ADR'de değişen bir yer"
- prompt_cevap/gun_0, gun_1, gun_3: eski konuşmaların birebir kaydı. Bunlara dokunulmayacak.

Karar: gun13-belgeler dalına şu değişiklikler de girsin, ayrı PR açmayacağız:
1. git rm docs/01_Proje_Onerisi.md
2. README.md'den 202. satırı sil
3. Rehberin 146. satırından yalnızca `01_Proje_Onerisi.md`, ifadesini çıkar (tablo bozulmasın)
4. Plan dosyasının 699. satırında "proje önerisi ve " ifadesini çıkar. Cümle "docs/ içindeki ADR'de değişen bir yer" olarak kalsın.
5. ADR ve Prompt Günlüğüne bu silme hakkında yeni bir cümle ekleme, o belgelerde "proje önerisi" ifadesi geçmesin. Commit mesajında kısaca belirtmen yeterli.

Her biri için tek satırlık, macOS zsh'de çalışan komutu ver (tek tırnak içinde apostrof kullanma, backtick içeren desenleri tek tırnakla yaz). Sonra silme sonrası doğrulama komutunu ver: tarama bu üç dosyada ve README'de 0 çıkmalı.
Ayrıca commit için üç taramayı ve commit komutunu hazırla. Ek satırları "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" ve bu sohbetin oturum adresiyle ver.
````

### Claude cevabı 11 · 25 Eki 2026 13:55

> Dört komutu da kendi kopyalarım üzerinde denedim. Tablo bozulmuyor, README'de yalnızca o satır siliniyor, plan cümlesi istediğin hâle geliyor. Gönderdiğim ADR ve Prompt Günlüğünde "proje önerisi" hiç geçmiyor. Kurulum rehberinde yalnızca 146. satırda geçiyor ve 3. komut onu temizliyor.
>
> Aşağıdaki komutları, önceki turdaki 1-7. adımlardan sonra aynı dalda (`gun13-belgeler`) çalıştır.
>
> ## Silme ve bağlantı temizliği
>
> 1. Proje önerisi dosyasını depodan siler ve silmeyi commit'e hazırlar:
>    ```
>    git rm docs/01_Proje_Onerisi.md
>    ```
> 2. README'den yalnızca proje önerisi bağlantısının bulunduğu satırı siler. Satır numarasına değil içeriğe bakar:
>    ```
>    perl -ni -e 'print unless m{^- \[Proje önerisi\]\(docs/01_Proje_Onerisi\.md\)\s*$}' README.md
>    ```
> 3. Rehberin klasör tablosundan yalnızca `` `01_Proje_Onerisi.md`, `` ifadesini çıkarır, tablonun geri kalanı aynen kalır:
>    ```
>    perl -pi -e 's/`01_Proje_Onerisi\.md`, //' docs/00_Kurulum_Rehberi.md
>    ```
> 4. Plan dosyasındaki cümleyi "docs/ içindeki ADR'de değişen bir yer" hâline getirir:
>    ```
>    perl -pi -e 's{docs/ içindeki proje önerisi ve }{docs/ içindeki }' docs/04_14_Gunluk_Prompt_Plani.md
>    ```
>
> ## Silme sonrası doğrulama
>
> 5. Beş dosyada proje önerisi anmasını sayar. Her satır `:0` ile bitmeli:
>    ```
>    grep -c "roje önerisi\|Proje_Onerisi\|roje Önerisi" README.md docs/00_Kurulum_Rehberi.md docs/02_ADR.md docs/03_Prompt_Gunlugu.md docs/04_14_Gunluk_Prompt_Plani.md
>    ```
> 6. Dosyanın gerçekten silindiğini kontrol eder. "No such file or directory" yazmalı:
>    ```
>    ls docs/01_Proje_Onerisi.md
>    ```
>
> ## Commit
>
> 7. Değişen dosyaları commit için hazırlar:
>    ```
>    git add README.md docs/00_Kurulum_Rehberi.md docs/02_ADR.md docs/03_Prompt_Gunlugu.md docs/04_14_Gunluk_Prompt_Plani.md
>    ```
> 8. Hazırlanan değişiklikleri listeler. Altı satır görmelisin: `D  docs/01_Proje_Onerisi.md` ve beş tane `M`.
>    ```
>    git status --short
>    ```
> 9. Üç tarama. Sonuçlar sırasıyla boş, 0 ve 0 olmalı:
>    ```
>    git --no-pager grep --cached -c -E "npg_[A-Za-z0-9]{6,}"
>    ```
>    ```
>    git --no-pager grep --cached -o -E "ep-[a-z0-9-]+\.[a-z0-9.-]*neon\.tech" | grep -vc "ep-xxxx"
>    ```
>    ```
>    git --no-pager grep --cached -h -i -E "[AD_DESENI]" | sed 's/ozgesoganci1-bot//Ig' | grep -ic -E "[AD_DESENI]"
>    ```
> 10. Commit'i atar. Komut tek satırdır. Ek satırları `$'...\n...'` yazımıyla verdim; zsh `\n`'i gerçek satır sonuna çevirir, böylece iki ek satır yapışmaz:
>     ```
>     git commit -m "docs: Gün 13 belgeleri, proje önerisi kaldırıldı" -m "ADR Gün 13 bölümü ve Bölüm 4 doğrulamaları, kurulum rehberi güncellemeleri, Prompt Günlüğü Gün 13 satırı ve README SSE düzeltmesi. docs/01_Proje_Onerisi.md depodan kaldırıldı; README, kurulum rehberi ve plan dosyasındaki anmaları temizlendi. prompt_cevap kayıtları değiştirilmedi." -m $'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01SLgzvw2VQPMppq9uNXMvbN'
>     ```
> 11. Commit mesajının son üç satırını gösterir. Bir boş satır, ardından alt alta iki ek satırı görmelisin:
>     ```
>     git --no-pager log -1 --format=%B | tail -3
>     ```
>
> ## PR
>
> 12. GitHub Desktop'ta **Publish branch**, ardından **Create Pull Request**. Açıklama alanına şunu yaz; ek satırları en sonda, aralarında bir boş satırla kalsın:
>     ```
>     Gün 13 belge güncellemeleri: ADR Gün 13 bölümü ve Bölüm 4 doğrulamaları, kurulum rehberi, Prompt Günlüğü Gün 13 satırı, README SSE düzeltmesi. Proje önerisi belgesi kaldırıldı ve bağlantıları temizlendi.
>
>     🤖 Generated with [Claude Code](https://claude.com/claude-code)
>
>     https://claude.ai/code/session_01SLgzvw2VQPMppq9uNXMvbN
>     ```
> 13. GitHub'da **Squash and merge**. Squash sırasında GitHub açıklamayı yeniden düzenlerse, onaylamadan önce ek satırlarının en sonda tek blok olduğuna bak. Ardından main'e dönüp güncel hâli al:
>     ```
>     git switch main && git pull
>     ```
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **README satırı:** 2. komutu README'nin benim yazdığım hâline göre denedim. Satırın sonunda boşluk olsa bile çalışır. Ama 5. adımda README `:0` vermezse satır benim kopyamdan farklı demektir; o satırı bana gönder.
> - **Plan dosyası:** 4. komutu yalnızca senin verdiğin cümleyle denedim, dosyanın kendisini görmedim. Komut "docs/ içindeki proje önerisi ve " ifadesinin geçtiği her yeri değiştirir; tarama yalnızca 699. satırı gösterdiği için tek değişiklik olmalı. `git diff docs/04_14_Gunluk_Prompt_Plani.md` ile tek satırın değiştiğini görebilirsin.
> - **Birleşmiş kayıtlar:** ADR'nin eski bölümlerinde ve Prompt Günlüğünün eski satırlarında proje önerisi anılmıyor (tarama 0). `prompt_cevap` kayıtlarına dokunulmadı.

