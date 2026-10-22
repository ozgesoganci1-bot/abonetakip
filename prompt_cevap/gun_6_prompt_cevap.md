# Gün 6: Kiracı izolasyonu ve rol testleri

> **Araç:** Claude (claude.ai), "SUNUCU TABANLI PROGRAMLAMA - SaaS PROJESİ" Project'i içindeki sohbetler.
> **Tarih:** 22 Eki 2026 (Türkiye saati). **Kapsam:** 53 prompt ve 53 cevap.
> Kutulardaki metin benim yazdığım prompttur (olduğu gibi). Girintili (`>` ile başlayan) alanlar Claude'un cevabıdır, başlık, tablo ve kod blokları orijinal Markdown'dır. Ekran görüntüleri metin olmadığı için `[ekran görüntüsü]` satırı olarak işaretlenmiştir. Yapay zekânın iç düşünme adımları ve araç çağrıları dahil değildir.
> Gizli bilgi taraması yapılmıştır. Mac kullanıcı adı, okul kısaltması, veritabanı sunucu adı ve parola benzeri değerler maskelenmiştir.
> Bu gün ayrı bir sohbette yürütüldü. Ana sohbette yapılan yönlendirme ve inceleme mesajları bu dosyaya dahil değildir.


## Bu günün özeti

_Bu bölümü ben yazdım, yapay zekâ cevabı değildir. Kaynağı Prompt Günlüğü'dür._

| | |
|---|---|
| **Ne istendi** | Gün 6 promptu: kiracı izolasyonu ve rol testleri. İki firma ve iki rolle otomatik testler, elle test tablosu ve finance yetki listesi istendi. Plan ve uygulama ayrı bir sohbette yapıldı |
| **Ne üretildi** | Neon test dalı ve `.env.test`; `node --test` çözümleme kancası ve duman testi; `yetki.ts` ve `pasife-alma.ts` çekirdeği; `veri.ts` test verisi yardımcısı; `tenant.test.ts` (21), `pasife-alma.test.ts` (9), `session.test.ts` (6), `kurallar.test.ts` (4) testleri; `test` ve `test:db` betikleri; `tenant.ts` beyaz liste düzeltmesi; 12 adımlık elle test tablosu; ADR Gün 6 bölümü |
| **Düzeltme gerekti mi** | Evet: (1) AI Vitest önerdi, ADR'deki "ek paket yok" kararı hatırlatılınca `node --test` ve tek çözümleme kancasıyla ilerlendi; (2) AI'nın ilk planında rol kontrolü sunucu işleminde kalıyordu, otomatik test edilemeyeceği fark edilince pasife alma mantığı çekirdeğe ayrıldı; (3) 11. test, kaydın `tenant: { connect }` ile başka firmaya taşınabildiğini gösterdi, kara liste yerine beyaz liste ile düzeltildi, 3 ek test eklendi; (4) `.env.test.example` dosyasına yer tutucu yerine gerçek adres yazıldı, commit öncesi `git grep` yakaladı, dosya düzeltildi ve veritabanı parolası test ile canlıda yenilendi; (5) ilk commit'ler dal açılmadan doğrudan main'e push edildi, bundan sonra her değişiklik dal ve PR ile giriyor |

## Gün 6 sohbeti (plan, test altyapısı, izolasyon testleri, ADR ve Prompt Günlüğü)

_Plan ve uygulama bu sohbette yapıldı._

### Prompt 1 · 22 Eki 2026 13:48

````text
```markdown
[Rol] Next.js (App Router), TypeScript, PostgreSQL ve Prisma konusunda
deneyimli, çok kiracılı SaaS ürünleri geliştirmiş kıdemli bir geliştirici
olarak davran. Ben kod bilmeyen bir YBS öğrencisiyim. Açıklamaları Türkçe,
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
```. ## Gün 6 • Kiracı izolasyonu testleri

**Amaç:** İki firma ve iki rolle izolasyonu hem elle hem otomatik test etmek.

```
[Görev] Kiracı izolasyonunu ve rol yetkilerini doğrulayan testler hazırla.

Kapsam:
A) Otomatik test: Test altyapısını kur (önerin Vitest ise npm'de
   varlığını ve kurulum komutunu belirt). Tenant yardımcısı ve en az üç
   veri işlemi için, iki farklı kiracıyla, "A firmasının kullanıcısı B
   firmasının müşteri, plan ve aboneliğini göremez, değiştiremez"
   senaryolarını yaz.
B) Elle test listesi: Tarayıcıda iki ayrı firma kaydı ve her birinde
   manager ve finance kullanıcıları ile yapılacak adım adım kontrol
   tablosu (beklenen sonuç sütunuyla).
C) Rol testleri: finance'in yapamayacağı işlemlerin listesi ve her
   biri için beklenen davranış.

[Kısıtlar]
- Testler gerçek Neon veritabanını bozmasın. Test verisini ayırt
  edilebilir etiketle üret (örn. e-posta "test-" ile başlasın) ve test
  bitince temizle. Bunun riskini ve daha güvenli yolu açıkla.
- Kod bilmediğimi unutma, testlerin ne yaptığını Türkçe yorumla.
- Gereksiz paket ekleme.

[Format] 1) Plan ve test yaklaşımı (onay bekle). 2) Kurulum komutları.
3) Test dosyaları tam yollarıyla. 4) Testleri çalıştırma komutu ve çıktıyı
nasıl okuyacağım. 5) Elle test tablosu (Markdown).

[Doğrulama] Hangi testlerin neyi garanti ettiğini, neyi garanti etmediğini
açıkça belirt. Varsayımlarını listele.
```

**Bitiş kontrolü**
- [ ] Otomatik testler geçiyor ve çıktıyı okuyabiliyorsun
- [ ] Elle test tablosunu iki firmayla gerçekten uyguladın, sonuçları işaretledin
- [ ] Bulunan açıklar issue olarak kaydedildi
- **Commit:** `test: kiracı izolasyonu ve rol testleri`

```
````

### Claude cevabı 1 · 22 Eki 2026 13:49

> # Gün 6 Planı: Kiracı izolasyonu ve rol testleri
>
> Kurallarına göre bu cevapta **yalnızca plan** var, kod yok. Onayından ve aşağıdaki dosyaları görmemden sonra kurulum ve test dosyalarına geçeceğim.
>
> ## 1. En önemli karar: Testler hangi veritabanında çalışacak?
>
> Görev testlerin gerçek Neon veritabanını bozmamasını istiyor. İki yol var.
>
> **Yol A: Aynı veritabanı, "test-" etiketli veri (görevdeki öneri)**
> - Testler canlı veritabanına `test-` ile başlayan firmalar ve kullanıcılar ekler, bitince siler.
> - **Riskler:**
>   - Silme sorgusunda bir hata, gerçek kayıtları da silebilir.
>   - Test yarıda kesilirse (bilgisayar kapanır, hata olur) çöp veri kalır ve dashboard'daki MRR ile churn sayılarını bozar.
>   - Testler, uygulamayı aynı anda kullanan biriyle çakışabilir.
>
> **Yol B: Neon'da ayrı bir "test" dalı (branch) (önerim)**
> - Neon, veritabanının bir kopyasını dal olarak açmaya izin verir. Testler yalnızca bu dalda çalışır. Canlı veriye fiziksel olarak dokunamaz.
> - Ek paket gerekmez. Neon panelinden birkaç tıklamayla açılır, adımlarını ben veririm.
> - Bu dalın bağlantı adresi ayrı bir değişkende tutulur: `TEST_DATABASE_URL`, `.env.test` dosyasında. Test kurulumu bu değişken yoksa **hiç çalışmadan durur**. Böylece canlı `DATABASE_URL` yanlışlıkla kullanılamaz.
> - `test-` etiketini ve "bitince temizle" kuralını bu yolda da korurum. Temizlik joker karakterle değil, **yalnızca o test çalışmasında oluşturulan kayıtların ID'leriyle** yapılır.
>
> Yol B'de de yeni Prisma geçişlerinin (migration) test dalına ayrıca uygulanması gerekir. Bunun için `prisma migrate deploy` kullanılır. Bu komut yalnızca mevcut geçişleri uygular, yeni geçiş üretmez. Yani `--create-only` kuralınla çakışmaz.
>
> ## 2. Test yaklaşımı
>
> **Araç: Vitest.** npm'de var, yaygın kullanılan bir test aracı. Kurmadan önce `npm view vitest version` ile güncel sürümü birlikte kontrol edeceğiz. Ek paket olarak yalnızca bunu kurmayı planlıyorum. `@/` yol kısaltmaları için ek eklenti kurmak yerine ayarı elle yazarım.
>
> **Oturumu taklit etme:** Testler tarayıcı ve çerez kullanmaz. "Şu anda A firmasının manager'ı giriş yapmış" durumunu, oturumu okuyan fonksiyonu test sırasında taklit ederek (mock) kurarım. Bunun nasıl yapılacağı senin mevcut kod yapına bağlı, o yüzden dosyalarını görmem gerekiyor.
>
> **Hazırlık:** Her test çalışmasında iki sahte firma oluşturulur.
> - Firma A ve Firma B. Her birinde bir manager ve bir finance kullanıcısı, bir plan, bir müşteri ve bir ACTIVE abonelik olur.
> - Testler sırayla çalışır, paralel değil. Böylece birbirlerinin verisini karıştırmazlar.
>
> ## 3. Yazılacak testler
>
> **A) Kiracı izolasyonu (otomatik).** A firmasının kullanıcısıyla:
>
> | # | Senaryo | Beklenen |
> |---|---|---|
> | 1 | Müşteri listesini al | Yalnızca A'nın müşterileri gelir |
> | 2 | B'nin müşterisini ID ile getir | "Bulunamadı" |
> | 3 | B'nin müşterisini güncelle veya pasife al | "Bulunamadı", B'nin kaydı değişmemiş |
> | 4 | B'nin planını güncelle veya pasife al | "Bulunamadı", değişmemiş |
> | 5 | B'nin müşterisi için abonelik başlat | "Bulunamadı", abonelik oluşmamış |
> | 6 | B'nin aboneliğini yenile veya iptal et | "Bulunamadı", durum ve olay kaydı değişmemiş |
> | 7 | İstek verisine B'nin tenantId'sini koyarak kayıt oluştur | Kayıt A'ya yazılır, gönderilen tenantId yok sayılır |
> | 8 | A'nın dashboard metrikleri | B'nin abonelikleri MRR ve churn hesabına girmez |
>
> Merkezi tenant yardımcısının kendisi için de ayrı küçük testler yazılır. Örneğin oturum yoksa hata vermesi beklenir.
>
> **C) Rol testleri (otomatik).** Finance kullanıcısıyla:
> - CAC dahil ayarları değiştirme
> - Kullanıcı ekleme, silme ve rol değiştirme
>
> Bu işlemlerin her birinde "yetkiniz yok" hatası alınmalı ve veri değişmemiş olmalı. Ayrıca finance'in yapabilmesi gereken işlemler de test edilir: müşteri, plan ve abonelik işlemleri ile dashboard görüntüleme. Böylece kuralların fazla sıkı olmadığı da kontrol edilmiş olur.
>
> **B) Elle test tablosu.** Tarayıcıda iki firma ve dört kullanıcıyla adım adım uygulanacak bir Markdown kontrol listesi hazırlanır. Otomatik testlerin göremediği şeyler burada kontrol edilir:
> - B'nin kayıt ID'sini adres çubuğuna elle yazmak
> - Çıkış ve giriş akışı
> - SSE uyarısının yalnızca doğru firmaya düşmesi (A'da iptal yapılınca B'nin ekranına uyarı gelmemeli)
>
> ## 4. Testlerin garanti ETMEDİKLERİ (şimdiden)
> - Yalnızca test edilen fonksiyonları kapsar. İleride tenant yardımcısını kullanmadan yazılan yeni bir sorgu bu testlerle yakalanmaz.
> - Çerez sahteciliği ve oturum güvenliği test edilmez, çünkü oturum taklit ediliyor.
> - SSE izolasyonu yalnızca elle test edilir.
>
> ## Senden istediklerim
>
> 1. **Karar:** Yol A mı, Yol B (Neon test dalı) mı?
> 2. **Dosyalar:** Bunları göster, testleri mevcut yapına uyduracağım:
>    - `package.json`: Next.js ve Prisma sürümü, Vitest zaten kurulu mu?
>    - `prisma/schema.prisma`
>    - Merkezi tenant yardımcısı (örneğin `lib/tenant.ts`)
>    - Oturumu okuyan dosya (örneğin `lib/session.ts` ya da `lib/auth.ts`)
>    - Rol kontrolünün yapıldığı yer
>    - Müşteri, plan ve abonelik işlemlerini yapan dosyalardan birer örnek (Server Action ya da API route)
>
> ## Varsayımlar ve emin olmadığım yerler
> - Metrik fonksiyonları için daha önce bir test altyapısı kurulmadığını varsayıyorum. `package.json` bunu netleştirecek.
> - Kodunda `import "server-only"` satırları varsa Vitest bunlarda hata verebilir. Gerekirse bunun için küçük bir ayar eklerim.
> - Neon test dalına `migrate deploy` uygularken pooled mı direct mi bağlantı adresi gerektiği Prisma sürümüne bağlı. Sürümü görmeden kesin söyleyemiyorum.
> - `.gitignore` dosyasının `.env.test` dosyasını da kapsadığını kurulumda birlikte kontrol edeceğiz.

### Prompt 2 · 22 Eki 2026 13:57

````text
SUNUCU TABANLI PROGRAMLAMA - SaaS PROJESİ Project’inin kurallarına uy. Planı okudum. Kararlarım ve düzeltmelerim:

1. Karar: Yol B (Neon test dalı).

2. Test aracı: Gün 5'te ADR'ye "birim testi: ek paket yok" kararı yazdık ve dönem hesabı testlerini Node'un yerleşik `node --test` aracıyla yazdık (src/lib/donem.test.ts ekte). Vitest eklemeden önce neden gerektiğini yaz ve `node --test` ile (ör. oturumu okuyan fonksiyonu parametre olarak vererek) yapılıp yapılamayacağını karşılaştır. Karar için bana sor.

3. Kapsam: Planında henüz var olmayan şeyler olabilir. Dashboard metrikleri Gün 7'de, SSE daha sonra yapılacak. Dosya listesinde ayarlar ve kullanicilar sayfaları var ama actions.ts dosyaları yok. Hangi rol işlemlerinin gerçekten var olduğunu ekteki dosyalardan sen belirle. Yalnızca şu an kodda var olan işlemleri teste al, olmayanları "sonra eklenecek" diye ayrı listele.

4. Gizlilik: Depo herkese açık. TEST_DATABASE_URL değerini sohbete yazma, komutlar .env.test içeriğini ekrana basmasın. .env.test dosyasının .gitignore kapsamında olduğunu birlikte kontrol edelim.

5. Migration: prisma.config.ts DIRECT_URL okuyor. Test dalına `prisma migrate deploy` uygularken canlı veritabanına yanlışlıkla dokunmamak ve parolayı ekrana veya komut geçmişine yazmamak için güvenli yolu adım adım anlat.

6. Çalışma biçimi: Önce plan, onayımdan sonra kod. Dosyaları "yeni dosya oluştur" veya "içeriğini tamamen değiştir" diye açıkça belirt, her terminal komutunu tek tek ver ve ne işe yaradığını bir cümleyle söyle.

Ekte istediğin dosyalar tek metin dosyasında: package.json, prisma.config.ts, prisma/schema.prisma, src/lib altındaki tenant.ts, session.ts, auth.ts, db.ts, islem.ts, abonelik-kontrol.ts, donem.test.ts, panelin layout.tsx ve YetkiYok.tsx dosyaları, ayarlar, kullanicilar ve dashboard sayfaları ile müşteri, plan ve abonelik actions.ts dosyaları. Eksik bir dosya varsa söyle, ekleyeyim.
````

### Claude cevabı 2 · 22 Eki 2026 13:58

> Ekteki metin dosyası bana ulaşmadı. Çalışma alanını kontrol ettim, hiçbir dosya yok. Sohbette de içeriği görünmüyor. Lütfen dosyayı tekrar ekle (sürükle-bırak ya da ataç simgesi). Dosyaları görmeden 3. maddeyi (hangi rol işlemlerinin var olduğu) belirleyemem ve tahmin etmeyeceğim.
>
> Dosyalardan bağımsız olarak cevaplayabildiğim kısımlar aşağıda. Kod yok, yalnızca plan.
>
> ## 2. Test aracı: `node --test` mi, Vitest mi?
>
> İki seçeneği karşılaştırıyorum. Kararı sen vereceksin.
>
> | Konu | `node --test` (ek paket yok) | Vitest |
> |---|---|---|
> | ADR ile uyum | Uyumlu ("ek paket yok") | ADR'nin değişmesi gerekir |
> | TypeScript | Node'un tip silme özelliğiyle çalışır. Yalnızca "silinebilir" sözdizimini destekler (enum gibi yapılar sorun çıkarabilir) | Her TS sözdizimini çevirir |
> | `@/` yol kısaltmaları | Çözmez. Test edilen dosyalarda göreli yol (`./tenant.ts`) gerekebilir | Ayarla çözülür |
> | Oturumu taklit etme | Modül taklidi deneysel bir özellik. Bunun yerine **oturumu parametre olarak verme** yöntemi kullanılır | `vi.mock` ile kararlı taklit |
> | `import "server-only"` | Bir çalıştırma ayarıyla aşılabilir, ama başka paketleri etkileyip etkilemediğini denemem lazım | Ayarla aşılır |
>
> **Oturumu parametre olarak verme ne demek?** Her işlem iki parçaya ayrılır:
> 1. **Çekirdek fonksiyon:** Veritabanı işini yapar, "kim giriş yapmış" bilgisini (tenantId ve rol) parametre olarak alır. Testler bunu doğrudan çağırır.
> 2. **İnce action:** Oturumu çerezden okur ve çekirdeği çağırır. Başka bir şey yapmaz.
>
> Çerez okuyan fonksiyon (`cookies()`) Next.js isteği dışında çalışmadığı için bu ayrım `node --test` ile en sağlam yoldur. Bedeli şu: mevcut `actions.ts` dosyalarının yapısı değişir. Ayrıca ince action'daki oturum okuma satırı otomatik testle kapsanmaz, onu elle test tablosu kapsar.
>
> **Önerim:** `node --test` ve parametre yöntemi. ADR'yi korur, paket eklemez, yapıyı da daha test edilebilir kılar. Ancak kesin karar için dosyalarını görmem gerekiyor. Tenant yardımcın ve action'ların zaten bu ayrıma yakınsa değişiklik küçük olur, değilse büyük olur. Dosyaları görünce değişikliğin boyutunu sana söyleyip onayını isteyeceğim.
>
> ## 4. Gizlilik: `.env.test` kuralları
>
> - `.env.test` dosyasını terminalde `echo` ile değil, editörde (VS Code) oluşturacaksın. Böylece adres komut geçmişine yazılmaz.
> - İçeriği ekrana basan komut (`cat .env.test` gibi) vermeyeceğim.
> - `.gitignore` kontrolünü şu komutla yapacağız: `git check-ignore -v .env.test`. Bu komut dosyanın içeriğini değil, yalnızca onu hangi kuralın gizlediğini gösterir. Çıktı boşsa dosya korunmuyor demektir ve önce onu düzeltiriz.
> - Ardından `git status --short` ile `.env.test` dosyasının listede görünmediğini doğrularız.
> - Repoya yalnızca yer tutucu içeren bir örnek dosya girer: `.env.test.example`, içinde `[NEON_TEST_DIRECT_URL]` gibi değerler.
>
> ## 5. Migration'ı test dalına güvenle uygulama (plan)
>
> **Ana fikir:** Adresi komutun içine yazmak yerine Node'un yerleşik `--env-file=.env.test` özelliğiyle yükleriz. Bu yöntem parolayı komut geçmişine yazmaz. Önceden ortamda tanımlı olan değişkenler `.env` dosyası tarafından genellikle ezilmez, ama bunu `prisma.config.ts` dosyanın içine bakarak doğrulamam gerekiyor.
>
> Adımlar:
> 1. **Node sürümünü kontrol et** (`node -v`). `--env-file` özelliği Node 20.6 ve üzerinde var.
> 2. **Neon panelinde test dalını aç** ve o dalın direct ve pooled adreslerini editörle `.env.test` dosyasına yapıştır. Değişken adları `prisma.config.ts` dosyanın beklediği adlarla aynı olacak (`DIRECT_URL`, `DATABASE_URL`).
> 3. **Hedefi parolasız doğrula:** `.env.test` içindeki adresten yalnızca uç nokta kimliğini (`ep-...` ile başlayan kısım) ekrana yazdıran tek satırlık bir komut vereceğim. Bu kimliği Neon panelinde test dalının kimliğiyle karşılaştıracaksın. Canlı dalın kimliğiyle aynıysa **dur**.
> 4. **Önce yalnızca oku:** `prisma migrate status` komutunu `.env.test` ile çalıştıracağız. Bu komut hiçbir şeyi değiştirmez. Hangi sunucuya bağlandığını (parolasız) ve bekleyen geçişleri gösterir. Burada da uç nokta kimliğini kontrol edeceksin.
> 5. **Sonra uygula:** `prisma migrate deploy` komutunu aynı yöntemle çalıştıracağız. Bu komut yeni geçiş üretmez, yalnızca mevcut dosyaları uygular. Yani `--create-only` ve `DROP INDEX` kurallarınla çakışmaz.
>
> ## Varsayımlar ve emin olmadığım yerler
> - **Neon dalı canlı verinin kopyasını içerir.** Gerçek kişi verisi varsa bunu bilmem gerekir. Neon'un "yalnızca şema" kopyalayan dal seçeneği olabilir, ama güncel durumunu kontrol etmedim.
> - `--env-file` ile yüklenen değerlerin `prisma.config.ts` içindeki olası bir `dotenv` yüklemesine üstün gelip gelmediği o dosyanın içeriğine bağlı.
> - `donem.test.ts` dosyasının hangi komutla çalıştığını (`package.json` içindeki test betiği) görmem gerekiyor.
>
> ## Senden istediklerim
> 1. Ek dosyayı tekrar yükle.
> 2. `node --test` ile Vitest arasındaki kararını bildir. İstersen dosyaları gördükten sonra karar ver.

### Prompt 3 · 22 Eki 2026 14:00

````text
Dosyayı yeniden ekledim, lütfen görüp görmediğini ilk satırda belirt.

Kararım: node --test ve parametre yöntemi. Şu koşullarla:

1. Önce ekteki dosyalara bak ve mevcut yapıyı değiştirmeden test edebileceğimiz bir yol var mı kontrol et. Örneğin tenant.ts zaten tenantId parametresiyle çağrılabiliyorsa, testler getTenantDb'yi ve abonelik-kontrol gibi alt katman fonksiyonlarını doğrudan çağırabilir. Actions dosyalarını yeniden yazma gerekiyorsa değişikliğin boyutunu (hangi dosyalar, kaç satır) söyle ve onayımı iste. Çalışan Gün 4 ve Gün 5 kodunu bozmak istemiyorum.

2. Rol kontrolü hangi katmanda yapılıyor, bul. Rol kontrolü ince action katmanında kalırsa, finance rol testleri otomatik testle kapsanmaz ve anlamsız olur. Rol kontrolü test edilebilir bir fonksiyonda olmalı. Bunu planda açıkça belirt.

3. Gizlilik: .env.test dosyasını VS Code ile oluşturacağım. Adım 3'te uç nokta kimliğini ekrana yazdıran komutu ver, ama kimliği sohbete yazmayacağım. Neon panelindeki kimlikle kendim karşılaştırıp yalnızca "aynı" veya "farklı" diyeceğim.

4. Veri: Veritabanındaki tüm kayıtlar sahte test verisidir, gerçek kişi yoktur. Neon dalı verinin kopyası olabilir, sorun değil.

Dosyaları gördükten sonra güncellenmiş planı sun. Onayımdan sonra kod yaz.
````

_[ek dosya: gun6_dosyalar.txt]_

### Claude cevabı 3 · 22 Eki 2026 14:03

> Dosyayı görüyorum: `gun6_dosyalar.txt`, içinde 18 dosya var.
>
> # Gün 6: Güncellenmiş plan
>
> ## 1. Mevcut yapıyı değiştirmeden ne test edilebilir?
>
> **İyi haber:** `tenant.ts` içindeki `tenantaBagliDb(tenantId)` fonksiyonu zaten dışarı açık ve tenantId'yi parametre olarak alıyor. Kiracı izolasyonunun tamamı bu tek fonksiyonda uygulanıyor. Action'lar kendi tenant filtresi yazmıyor, hepsi `getTenantDb()` kullanıyor. Bu yüzden:
>
> - **İzolasyon testleri için action dosyalarına dokunmak gerekmiyor.** Testler, action'ların kullandığı sorgu biçimlerinin aynısını (`findFirst`, `updateMany`, `count`, `create`, `$transaction` içinde `updateMany`) "A firmasına bağlı" veritabanı nesnesiyle B'nin kayıtları üzerinde çalıştırır.
> - **Ek güvence için statik kural testi:** Veritabanına bağlanmayan bir test, `src/` altındaki dosyaları tarar ve iki şeyi kontrol eder. Ham `prisma` nesnesi yalnızca izin verilen 3 dosyada (`db.ts`, `auth.ts`, `tenant.ts`) içe aktarılmış olmalı. `$queryRaw` ve `$executeRaw` hiçbir yerde geçmemeli. Böylece "bütün sorgular filtreden geçiyor" varsayımı da otomatik doğrulanır. Node'un yerleşik `fs` modülü yeterli, paket gerekmez.
> - **`abonelik-kontrol.ts` için küçük bir değişiklik gerekiyor.** `aktifAbonelikVarMi` fonksiyonu içeride `getTenantDb()` çağırıyor, bu da oturum (çerez) istiyor. İkinci, isteğe bağlı bir `db` parametresi eklerim: verilmezse bugünkü gibi çalışır. Mevcut 3 çağrı yerine dokunulmaz. Yaklaşık 3 satırlık değişiklik.
>
> ## 2. Rol kontrolü hangi katmanda?
>
> Bulduğum durum:
> - Rol kararı (`role === "manager"`) `auth.ts` içindeki `requireManager()` fonksiyonunda. Bu fonksiyon oturumu çerezden okuduğu için testte çağrılamaz.
> - Kodda **gerçekten var olan** rol kısıtlı işlemler yalnızca şu dört tanesi:
>
> | İşlem | Nerede | Otomatik test edilebilir mi? |
> |---|---|---|
> | Müşteriyi pasife al (yalnızca manager) | `musteriler/actions.ts` → `musteriPasifeAl` | Bugün hayır, kontrol action içinde |
> | Planı pasife al (yalnızca manager) | `planlar/actions.ts` → `planPasifeAl` | Bugün hayır, kontrol action içinde |
> | Ayarlar sayfasını görme | `ayarlar/page.tsx` | Hayır, sayfa (yer tutucu) |
> | Kullanıcılar sayfasını görme | `kullanicilar/page.tsx` | Hayır, sayfa (yer tutucu) |
>
> Diğer bütün işlemler (müşteri ve plan ekleme/güncelleme, abonelik başlatma/yenileme/iptal) iki role de açık. Bunlarda test edilecek bir rol kuralı yok.
>
> **Sonuç:** Senin de dediğin gibi rol kontrolü ince action katmanında kaldığı sürece finance testleri anlamsız olur. Önerdiğim değişiklik:
>
> | Dosya | İşlem | Boyut (tahmini) |
> |---|---|---|
> | `src/lib/yetki.ts` | **Yeni dosya.** Saf fonksiyon: `yoneticiMi(rol)` | ~15 satır |
> | `src/lib/pasife-alma.ts` | **Yeni dosya.** `musteriPasifeAlCekirdek(kullanici, id, db)` ve `planPasifeAlCekirdek(...)`. Rol kontrolü, kayıt kontrolü, aktif abonelik kontrolü ve güncelleme burada olur. Mesajlar ve sıra bugünküyle aynı kalır. | ~90 satır |
> | `src/app/(panel)/musteriler/actions.ts` | Yalnızca `musteriPasifeAl` gövdesi değişir: oturumu okur, çekirdeği çağırır, `revalidatePath` yapar. `musteriEkle` ve `musteriGuncelle` fonksiyonlarına dokunulmaz. | ~45 satır → ~15 satır |
> | `src/app/(panel)/planlar/actions.ts` | Aynı şekilde yalnızca `planPasifeAl` değişir. | ~45 satır → ~15 satır |
> | `src/lib/auth.ts` | `requireManager` içindeki karşılaştırma `yoneticiMi()` çağrısıyla değişir. | 1–2 satır |
> | `src/lib/abonelik-kontrol.ts` | İsteğe bağlı `db` parametresi eklenir. | ~3 satır |
> | `src/app/(panel)/abonelikler/actions.ts` | **Dokunulmaz** | 0 |
>
> Çekirdek fonksiyonlara kullanıcı bilgisi parametre olarak gelir. Uygulamada bu bilgi her zaman action'daki `requireUser()` çağrısından, yani oturumdan gelir. Formdan alınmaz, kural korunur.
>
> Gün 4 ve 5 kodunun bozulmadığını iki şekilde kontrol ederiz. Değişiklikten sonra `npm run build` çalıştırılır. Ayrıca tarayıcıda pasife alma işlemi elle denenir: bir başarılı deneme ve aktif aboneliği olan bir kayıtla bir engellenen deneme.
>
> ## 3. `node --test` için teknik engeller (dürüst değerlendirme)
>
> Senin projeni burada çalıştıramıyorum. Bu yüzden şu riskleri önce küçük bir **duman testiyle** (sadece içe aktarıp tek bir okuma yapan test) birlikte deneyeceğiz:
>
> 1. **Uzantısız içe aktarmalar:** `tenant.ts`, `auth.ts` ve `db.ts` dosyaları `"./db"` gibi `.ts` uzantısı olmadan içe aktarma yapıyor. Node'un TypeScript desteği uzantı ister. `donem.test.ts` çalışıyor çünkü orada `"./donem.ts"` yazıyor.
>    - **Çözüm:** Yalnızca testlerde yüklenen küçük bir "çözümleme kancası" dosyası. Node'un yerleşik `node:module` özelliğini kullanır ve uzantısız yolları `.ts` dosyasına yönlendirir. Mevcut dosyalara dokunulmaz, paket gerekmez. Bunun için Node sürümün önemli.
> 2. **Prisma'nın ürettiği istemci** (`generated/prisma`): İçinde Node'un "tip silme" özelliğinin desteklemediği TypeScript yapıları olabilir. Olursa Node'un `--experimental-transform-types` seçeneğini deneriz.
> 3. **`auth.ts` içindeki `react` ve `next/*` içe aktarmaları:** Next.js dışında içe aktarılınca sorun çıkarabilir. Çağrılmadıkları sürece büyük ihtimalle sorun olmaz, ama emin değilim.
>
> Duman testi bu üç engelden birini aşamazsa durup sana döneceğim. O noktada karar yine senin olacak (ADR'yi değiştirip Vitest kullanmak gibi).
>
> ## 4. Yazılacak testler (yalnızca kodda var olanlar)
>
> **A) Kiracı izolasyonu** (`tenantaBagliDb` ile, A firmasının bakış açısından, B'nin kayıtlarına karşı):
>
> | # | Senaryo | Beklenen |
> |---|---|---|
> | 1 | Müşteri, plan ve abonelik listeleri | Yalnızca A'nın kayıtları gelir |
> | 2 | B'nin müşterisi, planı ve aboneliği `findFirst` / `findUnique` ile ID'den sorgulanır | `null` döner (action'da "Kayıt bulunamadı.") |
> | 3 | B'nin müşterisi ve planı `updateMany` ile güncellenir veya pasife alınır | 0 satır etkilenir, B'nin kaydı değişmemiş olur |
> | 4 | `$transaction` içinde B'nin aboneliği yenilenir veya iptal edilir | 0 satır etkilenir, B için olay kaydı yazılmamış olur |
> | 5 | Kayıt eklerken `tenantId: B` gönderilir | Kayıt A'ya yazılır |
> | 6 | A adına, B'nin müşteri ve plan ID'siyle abonelik oluşturulur | Veritabanı reddeder (müşteri, plan ve abonelik aynı firmaya ait olmak zorunda). Hiçbir kayıt oluşmaz. |
> | 7 | B'nin aboneliğine A adına olay yazılır | Veritabanı reddeder |
> | 8 | `aktifAbonelikVarMi`, B'nin müşterisiyle | `false` (B'nin aboneliği sayılmaz) |
> | 9 | Firma tablosu: B'nin firmasını okuma ve güncelleme | B görünmez ve değişmez. Firma ekleme ve silme hata verir. |
> | 10 | Güncelleme verisine `tenantId` konur | "tenantId değiştirilemez." hatası |
> | 11 | **Olası açık kontrolü:** `update` ile `tenant: { connect: ... }` yazarak bir kaydı başka firmaya taşımak | Kod okurken fark ettim: filtre `data.tenantId` alanını engelliyor ama ilişki üzerinden bağlamayı engellemiyor gibi görünüyor. Action'lar bunu kullanmıyor, yani bugün bir saldırı yolu değil. Test sonucu ne gösterirse issue olarak kaydederiz. Bugün düzeltmeyiz (kapsam dışı). |
>
> **B) Statik kural testi:** Yukarıda anlatılan dosya taraması. Ham `prisma` kullanımı ve ham SQL kontrol edilir.
>
> **C) Rol testleri:**
> - `yoneticiMi`: manager için `true`, finance için `false`.
> - `musteriPasifeAlCekirdek` ve `planPasifeAlCekirdek` ile:
>   - **finance:** "Bu işlemi yalnızca firma yöneticisi yapabilir." mesajı döner, `isActive` değişmez.
>   - **manager:** Aboneliği olmayan kayıt pasife alınır.
>   - **manager:** Aktif aboneliği olan kayıt engellenir (Gün 5 kuralı korunuyor mu?).
>   - **manager:** B'nin kaydı için "Kayıt bulunamadı." döner.
>
> **D) Oturum belirteci testleri** (mevcut koda dokunmadan, `session.ts` dosyasındaki saf fonksiyonlar):
> - Geçerli belirteç kullanıcı kimliğini verir.
> - İçeriği değiştirilmiş belirteç `null` döner.
> - Süresi dolmuş belirteç `null` döner.
> - Bozuk biçimli belirteç `null` döner.
>
> Bu testler "çerezi değiştirip başka kullanıcıya geçme" riskini kapsar.
>
> **Sonra eklenecekler (bugün kodda yok):**
> - CAC ayarını değiştirme (manager)
> - Kullanıcı ekleme ve rol değiştirme (manager)
> - Dashboard metriklerinde izolasyon
> - SSE uyarısının yalnızca ilgili firmaya gitmesi
> - Aylık MRR grafiği
>
> Küçük bir not: `dashboard/page.tsx` içindeki yorumda "8-9. günler" yazıyor, sen ise Gün 7 dedin. İstersen yorumu sonra düzeltiriz.
>
> **E) Elle test tablosu:** İki firma ve dört kullanıcıyla tarayıcıda yapılacak kontroller:
> - Adres çubuğuna B'nin kayıt ID'sini yazmak
> - Finance kullanıcısıyla `/ayarlar` ve `/kullanicilar` adreslerine doğrudan gitmek
> - Menünün finance için gizlendiğini görmek
> - Pasife alma işleminin elle denenmesi
>
> ## 5. Test verisi ve temizlik
>
> - Her test dosyası, adında `test-` ve bir çalışma kimliği geçen iki firma (A ve B) oluşturur. Her firmada bir manager, bir finance, bir plan, bir müşteri ve bir aktif abonelik olur. Kullanıcı e-postaları `test-...@example.com` biçiminde olur.
> - Temizlik **yalnızca bu çalışmada oluşturulan firma ID'leriyle** yapılır. Silme sırası: olaylar → abonelikler → müşteriler → planlar → kullanıcılar → firmalar. Sonunda kayıt kalmadığı ayrıca kontrol edilir.
> - **Onayını istediğim bir istisna:** Firma oluşturma ve silme işlemleri tenant filtresinden geçemez (filtre bunları bilerek engelliyor). Bu yüzden test verisini hazırlayan tek bir yardımcı dosya ham `prisma` kullanmak zorunda: `src/test-destek/veri.ts`. Statik kural testi yalnızca bu dosyaya izin verir.
> - Testler sırayla çalışır (`--test-concurrency=1`). Böylece Neon'un bağlantı sınırı zorlanmaz.
>
> ## 6. `.env.test` ve canlıya dokunmama güvenceleri
>
> Önceki planda `TEST_DATABASE_URL` adını önermiştim. Senin kodun sabit adlar okuyor (`db.ts` → `DATABASE_URL`, `prisma.config.ts` → `DIRECT_URL`). Bu yüzden `.env.test` içinde **aynı adlar, test dalının değerleriyle** yer alır:
> - `DATABASE_URL`: test dalının havuzlu (pooled) adresi
> - `DIRECT_URL`: test dalının doğrudan (direct) adresi
> - `SESSION_SECRET`: yalnızca test için üretilen bir değer
> - `TEST_VERITABANI=evet`: işaret
>
> Bu değişkenleri sen VS Code'da yazarsın. Güvenceler:
> 1. **Testler `.env` dosyasını hiç yüklemez.** `db.ts` dosyası dotenv kullanmıyor, testler yalnızca `--env-file=.env.test` ile çalışır. `.env.test` içinde adres eksikse test canlıya geçmez, "tanımlı değil" hatasıyla durur.
> 2. **İşaret kontrolü:** Test yardımcısı `TEST_VERITABANI=evet` değerini görmezse veritabanına bağlanmadan durur. Bu işaret canlı `.env` dosyasında yoktur.
> 3. **Migration komutları için bilmen gereken bir tuzak:** `prisma.config.ts` dosyası `import "dotenv/config"` ile `.env` dosyasını da yükler. dotenv, önceden tanımlı bir değişkenin üzerine yazmaz. Ama `.env.test` içinde `DIRECT_URL` **unutulursa**, değer canlı `.env` dosyasından doldurulur. Aşağıdaki iki kontrol bu yüzden var.
>
> ## 7. Migration: test dalına güvenli uygulama (adım adım)
>
> 1. `node -v` komutunu çalıştır ve çıktıyı yaz. Bu komut Node sürümünü gösterir. Hem `--env-file` hem de çözümleme kancası buna bağlı.
> 2. Neon panelinde canlı daldan bir test dalı aç. Senin onayınla kopya veri sorun değil.
> 3. VS Code'da proje kökünde `.env.test` dosyasını oluştur ve yukarıdaki dört değişkeni yaz.
> 4. `git check-ignore -v .env.test` komutunu çalıştır. Bu komut, dosyayı hangi `.gitignore` kuralının gizlediğini gösterir, içeriğini göstermez. Çıktı boşsa dur ve bana yaz.
> 5. **Uç nokta kontrolü.** Bu komut iki adresin yalnızca `ep-...` ile başlayan kimliğini yazdırır. Parola ve adresin geri kalanı ekrana basılmaz. Adres bozuksa da içeriği değil, yalnızca "BİÇİM HATALI" yazar.
>    ```zsh
>    node --env-file=.env.test -e 'for (const ad of ["DIRECT_URL", "DATABASE_URL"]) { let s = "TANIMLI DEĞİL"; const d = process.env[ad]; if (d) { try { s = new URL(d).hostname.split(".")[0].replace(/-pooler$/, ""); } catch { s = "BİÇİM HATALI"; } } console.log(ad + ": " + s); }'
>    ```
>    İki satır da aynı kimliği göstermeli ve bu kimlik Neon panelindeki **test dalının** kimliği olmalı. Bana yalnızca "aynı" ya da "farklı" yaz. "TANIMLI DEĞİL" çıkarsa dur.
> 6. **Önce yalnızca oku:** `.env.test` yüklenmiş hâlde `prisma migrate status` çalıştırılır. Komutun tam yazımını uygulama adımında vereceğim. Bu komut hiçbir şeyi değiştirmez. Bağlandığı sunucunun adını (parolasız) ve bekleyen geçişleri yazar. Oradaki `ep-...` kimliğini de karşılaştırıp "aynı" ya da "farklı" yazarsın. Bu ikinci kontrol, 3. maddedeki tuzağı yakalar.
> 7. **Uygula:** `prisma migrate deploy` aynı yolla çalıştırılır. Test dalı canlının kopyası olduğu için büyük ihtimalle "uygulanacak geçiş yok" diyecek. Yöntemi ileride kullanmak için yine de öğrenmiş olursun. `deploy` yeni geçiş üretmez, bu yüzden `--create-only` ve `DROP INDEX` kurallarınla çakışmaz.
>
> Adresler komutun içine hiç yazılmadığı için zsh geçmişine girmez.
>
> ## 8. Uygulama sırası (onayından sonra, küçük parçalar hâlinde)
>
> 1. Kurulum: Neon dalı, `.env.test`, `.gitignore` kontrolü, uç nokta kontrolü ve migration (bölüm 7).
> 2. Çözümleme kancası ve duman testi. Sen çalıştırırsın, çıktıyı yazarsın.
> 3. `yetki.ts`, `pasife-alma.ts`, iki action'daki değişiklik ve `abonelik-kontrol.ts`. Ardından `npm run build` ve tarayıcıda pasife alma kontrolü.
> 4. Test dosyaları (A, B, C, D) ve `package.json` dosyasına `test` ve `test:db` betikleri. Paket eklenmez.
> 5. Elle test tablosu (Markdown).
>
> ## Eksik dosyalar
>
> Şunları da görmem gerekiyor:
> - **`src/lib/validation.ts`:** `auth.ts` bunu içe aktarıyor, testte o da yüklenecek. En azından içe aktarma satırları yeterli.
> - **`src/lib/donem.ts`:** Yalnızca içe aktarma satırları.
> - **`tsconfig.json`:** Testlerdeki `.ts` uzantılı içe aktarmaların `npm run build` sırasındaki tip kontrolünden geçmesi için.
> - **`node -v` çıktısı.**
>
> ## Varsayımlar ve emin olmadığım yerler
> - Prisma'nın tenant uzantısının (`$extends`) `$transaction` içindeki `tx` sorgularına da uygulandığını varsayıyorum. 4. test tam olarak bunu doğrulayacak.
> - 11. testteki ilişki üzerinden taşıma açığı kod okumama dayanıyor, test edilmedi.
> - `react` ve `next/*` modüllerinin Next.js dışında içe aktarılabildiğini ve Prisma istemcisinin Node ile çalıştığını henüz bilmiyorum. Duman testi gösterecek.
> - `prisma migrate status` çıktısında sunucu adının göründüğünü varsayıyorum. Görünmezse 5. adımdaki kontrol tek güvence olur ve sana söylerim.
>
> **Onayın gereken noktalar:**
> 1. Bölüm 2'deki dosya değişiklikleri
> 2. Bölüm 5'teki ham `prisma` istisnası (`src/test-destek/veri.ts`)
> 3. 11. testin "issue olarak kaydet, bugün düzeltme" şeklinde ele alınması

### Prompt 4 · 22 Eki 2026 14:07

````text
Node sürümüm: v26.11.1. Eksik dosyalar ekte.

Planı onaylıyorum, şu notlarla:

1. Bölüm 2'deki dosya değişikliklerine onay. Ama bu parçayı (yetki.ts, pasife-alma.ts, iki action, abonelik-kontrol.ts, auth.ts) kendi başına ve ayrı bir commit olarak ver. Davranış ve mesajlar birebir aynı kalsın, müşteri ve plan ekleme/güncelleme fonksiyonlarına dokunma. npm run build ve tarayıcıda pasife alma denemesi geçmeden test dosyalarına geçme.

2. Bölüm 5'teki ham prisma istisnasına (src/test-destek/veri.ts) onay. Yardımcı TEST_VERITABANI=evet yoksa veritabanına bağlanmadan dursun. Silmeyi yalnızca o çalışmada oluşturulan ID'lerle yapsın.

3. 11. test: sonucu görünce "issue yaz, düzeltme" kararını kendin verme. Açık gerçekten çıkarsa, kiracı izolasyonu MUST olduğu için küçük bir koruma (örneğin tenant.ts içinde) gerekip gerekmediğini bana sor.

4. Duman testi birden fazla geçici çözüme (çözümleme kancası, transform-types, başka bir şey) ihtiyaç duyarsa dur. Vitest'i devDependency olarak eklemenin (ADR güncellemesiyle) daha basit olup olmadığını karşılaştır ve kararı bana bırak.

5. SESSION_SECRET'ı ekrana yazdırmadan üreten bir komut ver (örneğin panoya kopyalayan).

6. Bölüm 8'deki sıraya göre Adım 1'den başla. Her terminal komutunu tek tek ver ve ne işe yaradığını bir cümleyle söyle.
````

_[ek dosya: gun6_ek.txt]_

### Claude cevabı 4 · 22 Eki 2026 14:08

> # Adım 1: Test ortamının kurulumu
>
> Bu adımda kod dosyası yok. Neon'da test dalı açılacak, `.env.test` hazırlanacak, iki güvenlik kontrolü yapılacak ve migration test dalına uygulanacak. Sonunda yalnızca yer tutucu içeren bir örnek dosya commit edilecek.
>
> Node v26 kullanman iyi haber. `--env-file` ve sonraki adımda kullanacağım çözümleme kancası bu sürümde yerleşik olarak var.
>
> Bütün komutları VS Code içindeki terminalde (Terminal → New Terminal), **proje kök klasöründe** çalıştır.
>
> ---
>
> ### 1.1 `.gitignore` korumasını kontrol et (dosyayı oluşturmadan önce)
>
> Parolalar dosyaya girmeden önce korumanın çalıştığından emin olalım.
>
> ```zsh
> git check-ignore -v .env.test
> ```
> Bu komut, `.env.test` dosyasını hangi `.gitignore` kuralının gizleyeceğini gösterir. Dosya henüz var olmasa da çalışır, içerik göstermez.
>
> - **Beklenen:** `.gitignore:` ile başlayan bir satır, örneğin `.gitignore:34:.env*	.env.test`.
> - **Çıktı boşsa:** Dur ve bana yaz. `.gitignore` dosyasını birlikte düzelteceğiz, öncesinde `.env.test` oluşturma.
>
> ```zsh
> git check-ignore -v .env.test.example
> ```
> Bu komut, birazdan repoya girecek örnek dosyanın yanlışlıkla gizlenip gizlenmediğini kontrol eder.
>
> - **Beklenen:** Çıktı **boş** olmalı (örnek dosya repoya girmeli).
> - **Bir satır çıkarsa:** O satırı bana yaz. İçinde secret yok, yalnızca kural adı var.
>
> ### 1.2 Neon'da test dalını aç
>
> 1. Neon panelinde projeni aç, sol menüden **Branches** sayfasına geç.
> 2. **Create branch** düğmesine tıkla. Ad: `test`. Kaynak (parent): şu an kullandığın ana dal. Veri seçeneğini varsayılan bırak (verinin kopyası alınsın, onayladığın gibi).
> 3. Dal oluşunca dalın sayfasındaki **Connect** düğmesine tıkla. Açılan pencerede dal olarak `test` seçili olduğundan emin ol.
> 4. İki adres alacaksın:
>    - **Connection pooling açık:** havuzlu adres, `DATABASE_URL` için
>    - **Connection pooling kapalı:** doğrudan adres, `DIRECT_URL` için
>
>    Bu adresleri sohbete yazma. Bir sonraki adımda doğrudan dosyaya yapıştıracaksın.
> 5. Panelde test dalının uç nokta kimliğini (`ep-` ile başlayan) bir yere not etme, sadece görebileceğin yerde açık kalsın. 1.5'te karşılaştıracaksın.
>
> ### 1.3 `.env.test` dosyasını oluştur
>
> VS Code'un sol taraftaki dosya gezgininde proje kök klasörüne sağ tıkla → **New File** → adı `.env.test`. **Yeni dosya oluştur** ve içine şunu yaz:
>
> ```env
> # AboneTakip TEST ortamı. Bu dosya ASLA repoya girmez.
> # Değerler Neon'daki "test" dalına aittir, canlı dala değil.
> TEST_VERITABANI=evet
> DATABASE_URL="[NEON_TEST_POOLED_URL]"
> DIRECT_URL="[NEON_TEST_DIRECT_URL]"
> SESSION_SECRET="[PANODAN_YAPISTIR]"
> ```
>
> - `[NEON_TEST_POOLED_URL]` yerine havuzlu adresi, `[NEON_TEST_DIRECT_URL]` yerine doğrudan adresi yapıştır. Tırnak işaretleri kalsın, çünkü adreslerde `&` karakteri olabilir.
> - `SESSION_SECRET` için önce aşağıdaki komutu çalıştır, sonra `[PANODAN_YAPISTIR]` yerine Cmd+V ile yapıştır:
>
> ```zsh
> openssl rand -hex 32 | tr -d '\n' | pbcopy
> ```
> Bu komut 64 karakterlik rastgele bir test anahtarı üretir ve ekrana basmadan doğrudan panoya kopyalar. Bu anahtar yalnızca testlerde kullanılır, canlıdaki anahtarla aynı olmamalı.
>
> Dosyayı Cmd+S ile kaydet.
>
> ### 1.4 Örnek dosyayı oluştur (repoya girecek olan)
>
> **Yeni dosya oluştur:** `.env.test.example`
>
> ```env
> # AboneTakip TEST ortamı örneği. Gerçek değerler .env.test dosyasına yazılır.
> # .env.test repoya girmez. Bu dosyada yalnızca yer tutucu bulunur.
> #
> # DATABASE_URL: Neon "test" dalının havuzlu (pooled) adresi
> # DIRECT_URL:   Neon "test" dalının doğrudan (direct) adresi, migration için
> # SESSION_SECRET: yalnızca teste özel rastgele değer
> #   Üretmek için: openssl rand -hex 32 | tr -d '\n' | pbcopy
> # TEST_VERITABANI=evet olmadan veritabanı testleri çalışmaz (koruma işareti).
> TEST_VERITABANI=evet
> DATABASE_URL="[NEON_TEST_POOLED_URL]"
> DIRECT_URL="[NEON_TEST_DIRECT_URL]"
> SESSION_SECRET="[TEST_SESSION_SECRET]"
> ```
>
> ### 1.5 Birinci kontrol: adresler test dalını mı gösteriyor?
>
> ```zsh
> node --env-file=.env.test -e 'for (const ad of ["DIRECT_URL", "DATABASE_URL"]) { let s = "TANIMLI DEĞİL"; const d = process.env[ad]; if (d) { try { s = new URL(d).hostname.split(".")[0].replace(/-pooler$/, ""); } catch { s = "BİÇİM HATALI"; } } console.log(ad + ": " + s); }'
> ```
> Bu komut `.env.test` dosyasındaki iki adresten yalnızca `ep-...` uç nokta kimliğini yazdırır. Parolayı ve adresin geri kalanını ekrana basmaz.
>
> - İki satırdaki kimlik **birbiriyle aynı** olmalı ve Neon panelindeki **test dalının** kimliğiyle aynı olmalı.
> - "TANIMLI DEĞİL" veya "BİÇİM HATALI" çıkarsa dur. `.env.test` dosyasını düzelt ve komutu tekrar çalıştır.
> - Bana yalnızca **"aynı"** ya da **"farklı"** yaz.
>
> ### 1.6 İkinci kontrol: Prisma nereye bağlanıyor? (yalnızca okur)
>
> ```zsh
> node --env-file=.env.test node_modules/.bin/prisma migrate status
> ```
> Bu komut `.env.test` değerleriyle Prisma'yı çalıştırır. Veritabanında hiçbir şey değiştirmez, yalnızca bağlandığı sunucuyu ve uygulanmamış migration olup olmadığını gösterir.
>
> - Çıktının başında `Datasource "db": ... at "ep-..."` gibi bir satır olacak. Buradaki `ep-...` kimliğini panelindeki test dalının kimliğiyle karşılaştır.
> - Çıktıda dotenv'in `.env` dosyasını yüklediğine dair bir satır görebilirsin. Bu normal: `prisma.config.ts` onu her zaman yükler, ama `.env.test` değerlerinin üzerine yazmaz. Bu ikinci kontrolün amacı da tam olarak bunu doğrulamak.
> - Kimlik **farklıysa** (canlı dal görünüyorsa) **hiçbir komut çalıştırma**, bana yaz.
>
> Bana yaz: **"aynı"** ya da **"farklı"**, ve çıktının **son satırı**. Son satır `Database schema is up to date!` ya da bekleyen migration listesi olur. İçinde adres yoktur.
>
> ### 1.7 Migration'ı uygula (yalnızca gerekirse)
>
> Test dalı canlının kopyası olduğu için 1.6 büyük ihtimalle `Database schema is up to date!` diyecek. Öyleyse bu adımı **atla**.
>
> Bekleyen migration görünürse ve 1.6'daki kimlik test dalınınkiyle aynıysa:
>
> ```zsh
> node --env-file=.env.test node_modules/.bin/prisma migrate deploy
> ```
> Bu komut, `prisma/migrations` klasöründeki henüz uygulanmamış migration dosyalarını test dalına uygular. Yeni migration üretmez, şemayı karşılaştırmaz, `DROP INDEX` gibi bir şey eklemez.
>
> ### 1.8 Kontrol ve commit
>
> ```zsh
> git status --short
> ```
> Bu komut, Git'in gördüğü değişmiş ve yeni dosyaları listeler.
>
> - **Beklenen:** `?? .env.test.example` satırı görünür.
> - `.env.test` **görünmemeli**. Görünürse dur ve bana yaz.
>
> ```zsh
> git add .env.test.example
> ```
> Bu komut yalnızca örnek dosyayı commit'e hazırlar.
>
> ```zsh
> git grep -n -e "neon.tech" -e "npg_"
> ```
> Bu komut, Git'in takip ettiği dosyalarda gerçek Neon adresi veya parola izi arar (proje kuralın). **Çıktı boş olmalı.** Bir satır çıkarsa commit etme, bana yaz.
>
> ```zsh
> git commit -m "chore: test ortamı için örnek env dosyası"
> ```
> Bu komut örnek dosyayı yerel depoya kaydeder. Push etmek istersen her zamanki gibi `git push` yapabilirsin.
>
> ---
>
> ## Bana göndermen gerekenler
> 1. 1.1'deki iki komutun çıktısı. Kural satırları secret içermez.
> 2. 1.5 için **aynı/farklı**.
> 3. 1.6 için **aynı/farklı** ve çıktının son satırı.
> 4. 1.7'yi çalıştırdıysan sonucu.
> 5. 1.8'de `git status` ve `git grep` sorunsuz mu?
>
> Hepsi sorunsuzsa **Adım 2'ye** (çözümleme kancası ve duman testi) geçeceğim. Senin sıralama notuna göre bölüm 2'deki dosya değişiklikleri ayrı bir commit olacak ve testlerden önce build ile tarayıcı denemesinden geçecek. Duman testi yalnızca okuma yaptığı için test dosyalarına dahil değil, kurulumun bir parçası sayılır. Ondan sonra yapı değişikliğine (Adım 3) geçeceğim. Bu sıra sana uymuyorsa söyle.
>
> ## Varsayımlar ve emin olmadığım yerler
> - Neon panelindeki düğme adlarını (Branches, Create branch, Connect, Connection pooling) bildiğim kadarıyla yazdım. Arayüz değişmiş olabilir. Bulamazsan ekranda ne gördüğünü tarif et.
> - `node_modules/.bin/prisma` dosyasının Node ile doğrudan çalıştırılabildiğini varsayıyorum. "SyntaxError" gibi bir hata alırsan hata mesajının ilk satırını yaz, başka bir yol vereceğim.
> - `prisma migrate status` çıktısında sunucu adının göründüğünü varsayıyorum. Görünmezse yalnızca 1.5'teki kontrole güveneceğiz ve 1.7'yi çalıştırmadan önce birlikte karar vereceğiz.

### Prompt 5 · 22 Eki 2026 14:08

````text
kullanici@bilgisayar abonetakip % git check-ignore -v .env.test
.gitignore:43:.env* .env.test
kullanici@bilgisayar abonetakip % git check-ignore -v .env.test.example
.gitignore:43:.env* .env.test.example
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 5 · 22 Eki 2026 14:09

> Sonuç: `.env.test` korunuyor, bu iyi. Ama `.env.test.example` da gizleniyor, çünkü 43. satırdaki `.env*` kuralı `.env` ile başlayan **her** dosyayı kapsıyor. Bu hâliyle örnek dosya repoya hiç girmez.
>
> Aynı kural muhtemelen `.env.example` dosyanı da gizliyor. Önce bunu kontrol edelim.
>
> ### 1.1a `.env.example` repoda mı?
>
> ```zsh
> git ls-files .env.example
> ```
> Bu komut, `.env.example` dosyasının Git tarafından takip edilip edilmediğini gösterir.
>
> - Çıktı `.env.example` ise dosya repoda (muhtemelen daha önce zorla eklenmiş).
> - Çıktı boşsa dosya hiç repoya girmemiş demektir. Bunu bana yaz, ayrıca ele alacağız.
>
> ### 1.1b `.gitignore` dosyasına istisna ekle
>
> VS Code'da proje kökündeki `.gitignore` dosyasını aç. Dosyanın **en sonuna** (43. satırdan sonra olması şart) şu satırları ekle ve Cmd+S ile kaydet:
>
> ```gitignore
> # Örnek env dosyaları repoya girer: yalnızca yer tutucu içerirler.
> !.env.example
> !.env.test.example
> ```
>
> `!` işareti "bu dosyayı gizleme" demektir. Yalnızca bu iki dosya adını açar. `.env` ve `.env.test` gizli kalmaya devam eder.
>
> ### 1.1c Tekrar kontrol et
>
> ```zsh
> git check-ignore -v .env.test
> ```
> Bu komut, `.env.test` dosyasının hâlâ gizlendiğini doğrular. **Beklenen:** yine `.gitignore:43:.env*	.env.test`.
>
> ```zsh
> git check-ignore -v .env.test.example
> ```
> Bu komut, örnek dosyanın artık gizlenmediğini doğrular. Çıktı iki biçimde gelebilir, ikisi de doğru:
> - Boş çıktı
> - `!` ile başlayan kuralı gösteren bir satır, örneğin `.gitignore:45:!.env.test.example	.env.test.example`
>
> Sorun olan tek durum, çıktının yine `.gitignore:43:.env*` göstermesidir.
>
> ---
>
> Bu kontroller doğruysa önceki mesajdaki **1.2'den** devam et: Neon dalı, `.env.test`, örnek dosya ve iki kontrol.
>
> 1.8'deki commit'e `.gitignore` değişikliği de girmeli. Bu yüzden 1.8'deki `git add` komutunu şununla değiştir:
>
> ```zsh
> git add .gitignore .env.test.example
> ```
> Bu komut `.gitignore` değişikliğini ve örnek dosyayı commit'e hazırlar.
>
> 1.8'deki `git status --short` çıktısında artık ` M .gitignore` ve `?? .env.test.example` görünmeli. `.env.test` **görünmemeli**.
>
> **Varsayım:** `.env.example` dosyanın içinde yalnızca yer tutucu olduğunu varsayıyorum (proje kuralın böyle). Eğer 1.1a'da dosya repoda değilse, ona da commit öncesi `git grep` kontrolünü uygulayacağız.

### Prompt 6 · 22 Eki 2026 14:10

````text
böyle mi olması gerekiyor
````

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 6 · 22 Eki 2026 14:10

> Evet, doğru çalışır. Yalnızca iki küçük not var.
>
> **1. 47. satır gereksiz.** 44. satırda `!.env.example` zaten varmış (önceki çıktıda bu yüzden yalnızca `.env.test.example` gizleniyordu). 47. satırdaki aynı kural zarar vermez ama tekrar eder. Temiz kalması için **47. satırı sil**. Son hâli şöyle olsun:
>
> ```gitignore
> # Prisma ve ortam dosyaları
> .env*
> !.env.example
> /generated/prisma
> # Örnek env dosyaları repoya girer: yalnızca yer tutucu içerirler.
> !.env.test.example
> ```
>
> Neden çalışıyor: Git kuralları yukarıdan aşağıya okur. `!` ile başlayan istisna satırları, 43. satırdaki `.env*` kuralından **sonra** geldiği için onu geçersiz kılar. Senin dosyanda da öyle.
>
> 33–34. satırlardaki `.env*` de 43. satırın tekrarı, ama zararsız. Gün 6 kapsamında olmadığı için ona dokunmuyoruz.
>
> **2. Dosya henüz kaydedilmemiş.** Sekmede `.gitignore` adının yanındaki beyaz nokta bunu gösteriyor. **Cmd+S** ile kaydet. Kaydetmeden çalıştırılan kontroller eski hâli görür.
>
> Kaydettikten sonra 1.1c'deki iki komutu çalıştır:
>
> ```zsh
> git check-ignore -v .env.test
> ```
> Bu komut, `.env.test` dosyasının hâlâ gizlendiğini doğrular. **Beklenen:** `.gitignore:43:.env*	.env.test`.
>
> ```zsh
> git check-ignore -v .env.test.example
> ```
> Bu komut, örnek dosyanın artık gizlenmediğini doğrular. **Beklenen:** boş çıktı ya da `!.env.test.example` kuralını gösteren bir satır.
>
> Çıktıları buraya yapıştır. Doğruysa 1.2'ye (Neon test dalı) geçersin. 1.1a'daki `git ls-files .env.example` kontrolünü atlayabilirsin. 44. satır o dosyayı zaten açıyormuş.

### Prompt 7 · 22 Eki 2026 14:11

````text
kullanici@bilgisayar abonetakip % git check-ignore -v .env.test
.gitignore:43:.env* .env.test
kullanici@bilgisayar abonetakip % git check-ignore -v .env.test.example
.gitignore:47:!.env.test.example .env.test.example
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 7 · 22 Eki 2026 14:11

> İkisi de doğru:
> - `.env.test` 43. satırdaki kuralla **gizleniyor**, repoya girmez.
> - `.env.test.example` 47. satırdaki `!` istisnasıyla **açık**, repoya girebilir.
>
> Satır numarasının 47 olması da 47. satırdaki tekrarı silip kaydettiğini gösteriyor.
>
> Şimdi önceki mesajdaki **1.2'den** devam et:
>
> 1. **1.2:** Neon'da `test` dalını aç, iki adresi (pooled ve direct) al.
> 2. **1.3:** VS Code'da `.env.test` dosyasını oluştur. `SESSION_SECRET` için önce panoya kopyalayan `openssl` komutunu çalıştır.
> 3. **1.4:** `.env.test.example` dosyasını oluştur.
> 4. **1.5:** Uç nokta kontrolünü yap. Bana yalnızca **"aynı"** ya da **"farklı"** yaz.
> 5. **1.6:** `prisma migrate status` çalıştır. Bana **"aynı"/"farklı"** ve çıktının **son satırını** yaz.
>
> Commit'i (1.8) bu kontrollerin sonucunu gördükten sonra birlikte yapalım. Hatırlatma: commit'te `git add .gitignore .env.test.example` kullanılacak.

### Prompt 8 · 22 Eki 2026 14:14

````text
creat chil branch düğmesi var
````

### Claude cevabı 8 · 22 Eki 2026 14:14

> Evet, o düğme doğru. Neon'da yeni dal, bir dalın "çocuğu" olarak açılır. Hangi dalın sayfasındaysan yeni dal onun kopyası olur.
>
> 1. **Önce doğru dalın sayfasında olduğundan emin ol:** Branches listesinde şu an uygulamanın kullandığı ana dal seçili olmalı. Genelde adı `main` ya da `production` olur, yanında "Default" veya "Primary" etiketi bulunur.
> 2. **Create child branch** düğmesine tıkla.
> 3. Açılan pencerede:
>    - **Branch name:** `test`
>    - **Parent:** Ana dalın adı görünmeli.
>    - **Veri seçeneği:** "Schema only" gibi yalnızca şema kopyalayan bir seçenek görürsen onu **seçme**. Verinin bugünkü hâliyle kopyalanmasını sağlayan seçeneği bırak. Genelde varsayılan budur ("Current data", "Head" ya da benzeri bir ad).
>    - Süre sınırı veya otomatik silme seçeneği varsa kapalı bırak.
> 4. **Create** ile oluştur.
>
> Dal oluşunca 1.2'nin 3. maddesinden devam et: dalın sayfasında **Connect** düğmesi, seçili dalın `test` olduğundan emin ol, pooled ve direct adresleri al.
>
> Pencerede seçeneklerin adı farklıysa ya da emin olamadığın bir şey varsa ekran görüntüsü at, adreslerin görünmediği bir an yeterli.

### Prompt 9 · 22 Eki 2026 14:16

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 9 · 22 Eki 2026 14:16

> Ayarların hepsi doğru, **Create** düğmesine basabilirsin:
>
> - **Name:** `test` ✓
> - **Auto-delete:** `Never` ✓ (dal kendiliğinden silinmez)
> - **Parent branch:** `production` ✓ (canlı dalın kopyası)
> - **Branch data and schema** seçili ✓
>
> Bu ekranda "Branch schema only" seçeneği de görünüyor, ama seçmemek daha iyi. Prisma, hangi migration'ların uygulandığını veritabanındaki bir tabloda tutuyor (`_prisma_migrations`). Yalnızca şema kopyalanırsa bu tablonun içi boş gelebilir ve Prisma bütün migration'ları baştan uygulamaya çalışabilir. Veriyle birlikte kopyalamak bu sorunu ortadan kaldırır.
>
> Dal oluşunca:
> 1. Sol üstteki dal seçicide (şu an `production` yazan kutu) **`test`** dalını seç.
> 2. Sol menüdeki yeşil **Connect** düğmesine tıkla.
> 3. Açılan pencerede dalın `test` olduğundan emin ol. Pooled (connection pooling açık) ve direct (kapalı) adresleri sırayla kopyalayıp `.env.test` dosyasına yapıştır. Bu adresleri sohbete yazma.
> 4. Ardından 1.3 (SESSION_SECRET), 1.4, 1.5 ve 1.6 adımlarıyla devam et.

### Prompt 10 · 22 Eki 2026 14:25

````text
kullanici@bilgisayar abonetakip % node --env-file=.env.test -e 'for (const ad of ["DIRECT_URL", "DATABASE_URL"]) { let s = "TANIMLI DEĞİL"; const d = process.env[ad]; if (d) { try { s = new URL(d).hostname.split(".")[0].replace(/-pooler$/, ""); } catch { s = "BİÇİM HATALI"; } } console.log(ad + ": " + s); }'
DIRECT_URL: [NEON_HOST]
DATABASE_URL: [NEON_HOST]
````

### Claude cevabı 10 · 22 Eki 2026 14:25

> İki adres de aynı uç noktayı gösteriyor. Bu iyi: pooled ve direct adres aynı daldan alınmış.
>
> Uç nokta kimliğini sohbete yazmışsın. Bu kimlik tek başına bir parola değil, kimse onunla veritabanına bağlanamaz. Yine de planımız gereği bundan sonra yalnızca "aynı" ya da "farklı" yazman yeterli.
>
> Henüz cevaplanmamış asıl soru şu: **bu kimlik test dalına mı ait, production dalına mı?** İkisinin karşılaştırılması gerekiyor:
>
> 1. Neon panelinde sol üstteki dal seçicide **`test`** seçili olsun.
> 2. **Overview** veya **Computes** sayfasında görünen `ep-...` kimliğine bak.
> 3. Ayrıca dal seçiciden **`production`** dalına geç ve onun kimliğine de bak. Production dalının kimliği terminaldekiyle **farklı** olmalı.
>
> Bana yaz: test dalının kimliğiyle **aynı mı**, production dalınınkiyle **farklı mı**?
>
> İkisi de doğruysa 1.6'ya geç:
>
> ```zsh
> node --env-file=.env.test node_modules/.bin/prisma migrate status
> ```
> Bu komut `.env.test` değerleriyle Prisma'yı çalıştırır. Veritabanında hiçbir şey değiştirmez. Bağlandığı sunucuyu ve uygulanmamış migration olup olmadığını gösterir.
>
> Çıktıdaki `ep-...` kimliğini yine panelle karşılaştır. Bana **aynı/farklı** ve çıktının **son satırını** yaz.

### Prompt 11 · 22 Eki 2026 14:27

````text
EP KİMLİĞİNE NASIL BAKABİLİRİM
````

### Claude cevabı 11 · 22 Eki 2026 14:27

> Neon panelinde iki kolay yol var. Birini kullanman yeterli.
>
> **Yol 1: Branches sayfasından**
> 1. Sol menüden **Branches** sayfasını aç.
> 2. Listede **`test`** dalının adına tıkla.
> 3. Açılan dal sayfasında **Computes** bölümüne in. Orada `ep-` ile başlayan bir kimlik görünür (örneğin "Primary" etiketli satırda). Bu, test dalının uç nokta kimliğidir.
> 4. Geri dön, bu kez **`production`** dalına tıkla ve onun Computes bölümündeki `ep-...` kimliğine bak.
>
> **Yol 2: Sol menüdeki Computes sayfasından**
> 1. Sol üstteki dal seçicide (az önceki ekranda `production` yazan kutu) **`test`** dalını seç.
> 2. Sol menüde *Postgres database* altındaki **Computes** sayfasını aç. Listede `ep-...` kimliği görünür.
> 3. Dal seçiciden **`production`** dalına geç ve aynı sayfada onun kimliğine bak.
>
> **Karşılaştırma:**
> - Test dalının kimliği, terminalde gördüğün kimlikle **aynı** olmalı.
> - Production dalının kimliği **farklı** olmalı.
>
> Bana yalnızca şunu yaz: "test: aynı, production: farklı" (ya da ne gördüysen).
>
> Kimliği bulamazsan ekran görüntüsü at. Ekranda parola ya da tam bağlantı adresi görünmediğinden emin ol.

### Prompt 12 · 22 Eki 2026 14:30

````text
test ile aynı
````

### Claude cevabı 12 · 22 Eki 2026 14:30

> Test dalının kimliği terminaldekiyle aynı. `.env.test` doğru dalı gösteriyor.
>
> Production için ayrıca bakmana gerek yok: Neon'da her dalın kendi uç noktası olur, iki dal aynı kimliği paylaşamaz. Kimlik test dalınınkiyle aynıysa production'la mutlaka farklıdır.
>
> Şimdi **1.6**, ikinci kontrol:
>
> ```zsh
> node --env-file=.env.test node_modules/.bin/prisma migrate status
> ```
> Bu komut `.env.test` değerleriyle Prisma'yı çalıştırır. Veritabanında hiçbir şey değiştirmez, yalnızca bağlandığı sunucuyu ve uygulanmamış migration olup olmadığını gösterir.
>
> Çıktıda bakacağın iki şey:
> 1. Başlardaki `Datasource "db": ... at "ep-..."` satırındaki kimlik test dalının kimliğiyle **aynı mı**?
> 2. Çıktının **son satırı** ne? Beklenen: `Database schema is up to date!`
>
> Bana yalnızca **"aynı"/"farklı"** ve **son satırı** yaz. Bir hata çıkarsa hata mesajının ilk satırını yaz. Hata mesajında adres ya da parola görünüyorsa o kısmı silerek yaz.

### Prompt 13 · 22 Eki 2026 14:31

````text
testle aynı ve beklenen yazı çıktı
````

### Claude cevabı 13 · 22 Eki 2026 14:31

> İki kontrol de geçti. Prisma, `prisma.config.ts` dosyası `.env` dosyasını yüklemesine rağmen test dalına bağlanıyor ve test dalının şeması güncel.
>
> **1.7'yi atla.** Uygulanacak migration yok.
>
> ### 1.8 Kontrol ve commit
>
> ```zsh
> git status --short
> ```
> Bu komut, Git'in gördüğü değişmiş ve yeni dosyaları listeler.
>
> Beklenen:
> - ` M .gitignore`
> - `?? .env.test.example`
> - `.env.test` **görünmemeli**
>
> Listede başka dosyalar da görünebilir (önceki günlerden kalan değişiklikler). Onları bu commit'e eklemeyeceğiz.
>
> ```zsh
> git add .gitignore .env.test.example
> ```
> Bu komut yalnızca bu iki dosyayı commit'e hazırlar.
>
> ```zsh
> git grep -n -e "neon.tech" -e "npg_"
> ```
> Bu komut, Git'in takip ettiği dosyalarda gerçek Neon adresi veya parola izi arar. **Çıktı boş olmalı.** Bir satır çıkarsa commit etme, bana yaz.
>
> ```zsh
> git commit -m "chore: test ortamı için örnek env dosyası"
> ```
> Bu komut iki dosyayı yerel depoya kaydeder.
>
> Bana yaz:
> - `git status` çıktısında `.env.test` görünmedi mi?
> - `git grep` boş mu?
> - Commit başarılı mı?
>
> Üçü de tamamsa **Adım 2'ye** geçeceğim: çözümleme kancası ve duman testi.

### Prompt 14 · 22 Eki 2026 14:32

````text
kullanici@bilgisayar abonetakip % git status --short
 M .gitignore
?? .env.test.example
kullanici@bilgisayar abonetakip % git add .gitignore .env.test.example
kullanici@bilgisayar abonetakip % git grep -n -e "neon.tech" -e "npg_"
.env.test.example:10:DATABASE_URL="postgresql://neondb_owner:[NEON_PAROLA]@[NEON_HOST]/neondb?sslmode=require&channel_binding=require"
.env.test.example:11:DIRECT_URL="postgresql://neondb_owner:[NEON_PAROLA]@[NEON_HOST]/neondb?sslmode=require&channel_binding=require"
CLAUDE.md:66:- `.env.example` yalnızca yer tutucu içerir (`[NEON_POOLED_URL]`). Gerçek adres veya parola asla yazılmaz. Commit öncesi `git grep -n -e "neon.tech" -e "npg_"` ile kontrol et.
docs/00_Kurulum_Rehberi.md:163:1. https://console.neon.tech adresinde Neon hesabınla giriş yap, **Create project** (veya New project) de.
docs/02_ADR.md:67:- **Güvenlik olayı ve ders:** `.env.example` dosyasına yanlışlıkla gerçek bağlantı adresi yazıldı ve herkese açık depoya gönderildi. Neon parolası değiştirilerek sızıntı etkisiz hâle getirildi, dosya yer tutucularla düzeltildi. Kural: `.env.example` yalnızca yer tutucu içerir, commit öncesi `git grep -n -e "neon.tech" -e "npg_"` ile kontrol edilir.
prompt_cevap/gun_0_prompt_cevap.md:1518:> 1. https://console.neon.tech adresine git, GitHub ile giriş yap. Yeni hesapsan önce neon.com'dan kayıt ol. Kart isterse dur ve bana yaz.
prompt_cevap/gun_0_prompt_cevap.md:1569:> DATABASE_URL="postgresql://neondb_owner:...@ep-xxxx.c-8.eu-central-1.aws.neon.tech/neondb?sslmode=require"
prompt_cevap/gun_2_prompt_cevap.md:19:Bu bölümde yapay zekâ gerçek bir bağlantı adresi yazmaz, yalnızca "depoda `neon.tech` ara" gibi kontrol talimatları verir. Sohbete yapıştırılan gerçek sunucu adı ve parola benzeri değerler `[NEON_HOST]` ve `[NEON_PAROLA]` olarak maskelenmiştir.
prompt_cevap/gun_2_prompt_cevap.md:760:> **Güvenlik taraması:** GitHub'da deponun ana sayfasında dosya listesine bak, `.env` olmamalı. Sonra sayfanın üstündeki arama kutusuna `neon.tech` yazıp **bu depoda** ara. Sonuç çıkmamalı.
prompt_cevap/gun_2_prompt_cevap.md:891:> Bakman gereken: eklenen satırlarda `postgresql://`, `neon.tech` ya da parola benzeri bir şey **olmamalı**. Varsa o satırı günlükten sil ya da `[DATABASE_URL]` ile değiştir ve kaydet.
prompt_cevap/gun_2_prompt_cevap.md:1507:**Güvenlik taraması:** GitHub'da deponun ana sayfasında dosya listesine bak, `.env` olmamalı. Sonra sayfanın üstündeki arama kutusuna `neon.tech` yazıp **bu depoda** ara. Sonuç çıkmamalı.
prompt_cevap/gun_2_prompt_cevap.md:1695:> 1. Tarayıcıda Neon konsolunu aç (console.neon.tech), `abonetakip` projesine gir.
prompt_cevap/gun_2_prompt_cevap.md:1698:> 4. Adresin içinde `-pooler` yazdığını kontrol et. Örnek: `ep-xxxx-pooler.eu-central-1.aws.neon.tech`
:
````

### Claude cevabı 14 · 22 Eki 2026 14:33

> **Dur, commit etme.** `.env.test.example` dosyasına yer tutucular yerine test dalının gerçek adresleri ve parolası yazılmış. `git grep` tam bunu yakaladı. Dosya henüz commit edilmedi, yalnızca hazırlandı (staged). Yani GitHub'a hiçbir şey gitmedi.
>
> Ancak parola bu sohbete ve terminal ekranına düştü. Bu yüzden düzeltmeden sonra parolayı değiştireceğiz. Sırayla ilerleyelim.
>
> ### 1. Ekrandaki listeden çık
>
> Terminalin en altında `:` görünüyor. Git çıktıyı sayfalayarak gösteriyor. **`q`** tuşuna bas.
>
> ### 2. Dosyayı commit hazırlığından çıkar
>
> ```zsh
> git restore --staged .env.test.example
> ```
> Bu komut dosyayı commit'e hazırlanan listeden çıkarır. Dosyanın kendisini silmez, `.gitignore` değişikliğine de dokunmaz.
>
> ### 3. Dosyayı yer tutucularla düzelt
>
> VS Code'da `.env.test.example` dosyasını aç ve **dosyanın içeriğini tamamen şununla değiştir**:
>
> ```env
> # AboneTakip TEST ortamı örneği. Gerçek değerler .env.test dosyasına yazılır.
> # .env.test repoya girmez. Bu dosyada yalnızca yer tutucu bulunur.
> #
> # DATABASE_URL: Neon "test" dalının havuzlu (pooled) adresi
> # DIRECT_URL:   Neon "test" dalının doğrudan (direct) adresi, migration için
> # SESSION_SECRET: yalnızca teste özel rastgele değer
> #   Üretmek için: openssl rand -hex 32 | tr -d '\n' | pbcopy
> # TEST_VERITABANI=evet olmadan veritabanı testleri çalışmaz (koruma işareti).
> TEST_VERITABANI=evet
> DATABASE_URL="[NEON_TEST_POOLED_URL]"
> DIRECT_URL="[NEON_TEST_DIRECT_URL]"
> SESSION_SECRET="[TEST_SESSION_SECRET]"
> ```
>
> Cmd+S ile kaydet. Gerçek adresler yalnızca `.env.test` dosyasında kalmalı, o dosyaya dokunma.
>
> ### 4. Tekrar kontrol et ve commit et
>
> ```zsh
> git add .gitignore .env.test.example
> ```
> Bu komut düzeltilmiş örnek dosyayı ve `.gitignore` değişikliğini commit'e hazırlar.
>
> ```zsh
> git grep -n -e "npg_" -e "neondb_owner:"
> ```
> Bu komut, takip edilen dosyalarda parola izi arar. **Çıktı boş olmalı.** Bir satır çıkarsa commit etme, bana yaz. `q` ile çıkman gerekebilir.
>
> Neden komutu değiştirdim? Az önceki aramada `neon.tech` kelimesi `CLAUDE.md`, `docs/` ve `prompt_cevap/` dosyalarında da çıktı. O satırlar zararsız: `console.neon.tech` adresi ve `ep-xxxx` gibi yer tutucular. Bu yeni arama yalnızca parola biçimini (`npg_`) ve parolalı adres başlangıcını yakalar. Gürültü azalır, gerçek sızıntı kaçmaz.
>
> ```zsh
> git commit -m "chore: test ortamı için örnek env dosyası"
> ```
> Bu komut iki dosyayı yerel depoya kaydeder.
>
> ### 5. Parolayı değiştir (commit'ten sonra)
>
> Parola GitHub'a gitmedi ama bu sohbette ve terminal geçmişinde görünüyor. ADR'deki Gün 1 dersine göre görünen parola değiştirilir.
>
> **Önemli:** Test dalı production'dan kopyalandığı için `neondb_owner` kullanıcısının parolası büyük ihtimalle **production ile aynı**. Neon, dal açarken kullanıcıları parolalarıyla birlikte kopyalar. Bu yüzden iki dalda da değiştirmek gerekiyor. Production'da değiştirince canlı uygulama, Render'daki adresler güncellenene kadar birkaç dakika veritabanına bağlanamaz.
>
> Bu adıma geçmeden önce bana yaz. Neon ve Render için adımları birlikte, sırayla vereceğim:
> - Önce test dalı (hiçbir şeyi bozmaz)
> - Sonra production, Render ve `.env` güncellemesi aynı anda
>
> ---
>
> **Bana yaz:**
> 1. 4. adımdaki `git grep` boş mu?
> 2. Commit başarılı mı?
> 3. Parola değiştirme adımına şimdi mi geçmek istiyorsun, yoksa Gün 6'nın sonunda mı?
>
> Önerim şimdi yapmak. Kısa sürer ve sonraki adımlarda yeni parolayla çalışırız.

### Prompt 15 · 22 Eki 2026 14:34

````text
kullanici@bilgisayar abonetakip % git restore --staged .env.test.example
kullanici@bilgisayar abonetakip % git add .gitignore .env.test.example
kullanici@bilgisayar abonetakip % git grep -n -e "npg_" -e "neondb_owner:"
CLAUDE.md:66:- `.env.example` yalnızca yer tutucu içerir (`[NEON_POOLED_URL]`). Gerçek adres veya parola asla yazılmaz. Commit öncesi `git grep -n -e "neon.tech" -e "npg_"` ile kontrol et.
docs/02_ADR.md:67:- **Güvenlik olayı ve ders:** `.env.example` dosyasına yanlışlıkla gerçek bağlantı adresi yazıldı ve herkese açık depoya gönderildi. Neon parolası değiştirilerek sızıntı etkisiz hâle getirildi, dosya yer tutucularla düzeltildi. Kural: `.env.example` yalnızca yer tutucu içerir, commit öncesi `git grep -n -e "neon.tech" -e "npg_"` ile kontrol edilir.
prompt_cevap/gun_0_prompt_cevap.md:1569:> DATABASE_URL="postgresql://neondb_owner:...@ep-xxxx.c-8.eu-central-1.aws.neon.tech/neondb?sslmode=require"
prompt_cevap/gun_2_prompt_cevap.md:2519:> git grep -n -e "neon.tech" -e "npg_"
prompt_cevap/gun_2_prompt_cevap.md:2522:> Bu komut, repoya giren tüm dosyaların içinde Neon adreslerini ve Neon parolalarının başlangıcını (`npg_`) arar.
prompt_cevap/gun_2_prompt_cevap.md:2566:kullanici@bilgisayar abonetakip % git grep -n -e "neon.tech" -e "npg_"
prompt_cevap/gun_2_prompt_cevap.md:2576:> `docs/00_Kurulum_Rehberi.md` satırı zararsız, sadece `console.neon.tech` yazan bir yönerge. Ama `.env.example` içinde yalnızca `[NEON_POOLED_URL]` gibi yer tutucular olmalıydı. Yer tutucu bu aramada **eşleşmezdi**. Eşleştiyse satırda `neon.tech` ya da `npg_` (Neon parolası) geçiyor demektir. Bana görünen satırlar boş (`DATABASE_URL=""`) ama o, ekranda gizlenmiş olabilir.
prompt_cevap/gun_2_prompt_cevap.md:2602:> Sonra tekrar `git grep -n -e "neon.tech" -e "npg_"` çalıştır. Yalnızca Kurulum Rehberi satırı çıkarsa temizsin.
prompt_cevap/gun_2_prompt_cevap.md:2662:> git grep -n -e "neon.tech" -e "npg_"
prompt_cevap/gun_2_prompt_cevap.md:2754:> Başka bir şey görürsen (örneğin `DIRECT_URL="npg_...` ya da `DIRECT_URL="psql '...`) o satır yanlış demektir. Çıktıyı bana yaz, gerekirse parola kısmını sil.
prompt_cevap/gun_2_prompt_cevap.md:2759:> 2. **Connection pooling'i kapat**. Kutuda `postgresql://neondb_owner:...@ep-....neon.tech/neondb?sslmode=require` benzeri bir adres görünür. Gizliyse **Show password**'e bas.
prompt_cevap/gun_2_prompt_cevap.md:2840:> **Asıl sorun:** `DIRECT_URL` satırına tam adres yerine yalnızca **parola** yapıştırmışsın (`npg_...` ile başlıyor). Adres `postgresql://` ile başlamalı.
prompt_cevap/gun_2_prompt_cevap.md:2920:> git grep -n -e "neon.tech" -e "npg_"
prompt_cevap/gun_2_prompt_cevap.md:3114:> git grep -n -e "neon.tech" -e "npg_"
prompt_cevap/gun_2_prompt_cevap.md:3159:> git grep -n -e "neon.tech" -e "npg_"
prompt_cevap/gun_2_prompt_cevap.md:3189:kullanici@bilgisayar abonetakip % git grep -n -e "neon.tech" -e "npg_"
:
````

### Claude cevabı 15 · 22 Eki 2026 14:34

> Görünen kısımda `.env.test.example` **yok**. Listelenen satırların hepsi dokümantasyon: `npg_` kelimesinden söz eden ya da `neondb_owner:...` gibi yer tutucu içeren satırlar.
>
> Ancak çıktı yine sayfalandı (en altta `:` var), yani listenin devamı ekranda görünmüyor olabilir. `q` ile çık ve daha kesin bir kontrol yapalım.
>
> ```zsh
> git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"
> ```
> Bu komut yalnızca gerçek parola biçimini arar: `npg_` ve hemen ardından en az 6 harf veya rakam. Dokümanlardaki `` `npg_` `` ya da `npg_...` gibi sözler eşleşmez. `--no-pager` sayesinde çıktı sayfalanmaz, tamamı ekrana gelir. **Çıktı boş olmalı.**
>
> ```zsh
> git --no-pager diff --cached --stat
> ```
> Bu komut commit'e hazırlanan dosyaları ve kaç satır değiştiğini listeler. **Beklenen:** yalnızca `.env.test.example` ve `.gitignore`.
>
> İkisi de doğruysa:
>
> ```zsh
> git commit -m "chore: test ortamı için örnek env dosyası"
> ```
> Bu komut iki dosyayı yerel depoya kaydeder.
>
> **Bir not:** CLAUDE.md'deki `neon.tech`/`npg_` araması artık çok fazla zararsız sonuç döndürüyor ve gerçek bir sızıntıyı gözden kaçırmayı kolaylaştırıyor. Bugün az önce olan da buydu. CLAUDE.md'deki kontrol komutunu yukarıdaki kesin aramayla değiştirmeyi Gün 6'nın sonunda önereceğim. Şimdilik dokunmuyorum.
>
> ---
>
> **Bana yaz:**
> 1. İlk komutun çıktısı boş mu?
> 2. `diff --cached --stat` yalnızca iki dosyayı mı gösterdi?
> 3. Commit başarılı mı?
> 4. Parola değiştirme: şimdi mi, Gün 6'nın sonunda mı? Önerim şimdi.

### Prompt 16 · 22 Eki 2026 14:35

````text
kullanici@bilgisayar abonetakip % git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"
kullanici@bilgisayar abonetakip % git --no-pager diff --cached --stat
 .env.test.example | 12 ++++++++++++
 .gitignore        |  4 +++-
 2 files changed, 15 insertions(+), 1 deletion(-)
kullanici@bilgisayar abonetakip % git commit -m "chore: test ortamı için örnek env dosyası"
[main f7a2b41] chore: test ortamı için örnek env dosyası
 2 files changed, 15 insertions(+), 1 deletion(-)
 create mode 100644 .env.test.example
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 16 · 22 Eki 2026 14:36

> Commit tamam:
> - Gerçek parola biçimi hiçbir takip edilen dosyada yok.
> - Commit'e yalnızca iki dosya girdi.
> - `.env.test.example` yer tutucularla repoda.
>
> Bu commit'i istediğin zaman `git push` ile gönderebilirsin, içinde secret yok.
>
> # Parola değiştirme
>
> Cevap vermediğin için önerime göre şimdi yapıyoruz. İki bölüm var. **A bölümü hiçbir şeyi bozmaz.** B bölümünde canlı uygulama birkaç dakika veritabanına bağlanamayabilir. B'yi Gün 6'nın sonuna bırakmak istersen söyle.
>
> Adresleri

### Prompt 17 · 22 Eki 2026 14:36

````text
şimdi yapalım
````

### Claude cevabı 17 · 22 Eki 2026 14:36

> Önce iki küçük hazırlık:
> - **Terminali temizle:** Az önceki `git grep` çıktısında parola ekranda kaldı. VS Code terminaline tıkla ve **Cmd+K** ile ekranı temizle. Bu yalnızca görüntüyü siler, dosyalara dokunmaz.
> - Bu adımlarda yeni adresleri ve parolaları **sohbete yazma**. Bana yalnızca "tamam", "aynı/farklı" ve çıktıların son satırlarını yaz.
>
> ---
>
> ## A) Test dalının parolası (hiçbir şeyi bozmaz)
>
> **A1.** Neon panelinde sol üstteki dal seçicide **`test`** dalını seç.
>
> **A2.** Sol menüde *Postgres database* altındaki **Roles** sayfasını aç. `neondb_owner` satırının sağındaki **⋯** menüsünden **Reset password** seç ve onayla.
>
> **A3.** Sol menüdeki yeşil **Connect** düğmesine tıkla. Dalın `test` olduğundan emin ol. Parola gizliyse **Show password** ile göster.
> - Connection pooling **açıkken** görünen adresi `.env.test` dosyasında `DATABASE_URL="..."` tırnaklarının içine yapıştır.
> - Connection pooling **kapalıyken** görünen adresi `DIRECT_URL="..."` içine yapıştır.
>
> Cmd+S ile kaydet.
>
> **A4.** Yeni parolanın çalıştığını ve hâlâ test dalına bağlandığını kontrol et:
>
> ```zsh
> node --env-file=.env.test -e 'for (const ad of ["DIRECT_URL", "DATABASE_URL"]) { let s = "TANIMLI DEĞİL"; const d = process.env[ad]; if (d) { try { s = new URL(d).hostname.split(".")[0].replace(/-pooler$/, ""); } catch { s = "BİÇİM HATALI"; } } console.log(ad + ": " + s); }'
> ```
> Bu komut iki adresin yalnızca uç nokta kimliğini yazdırır. İkisi de test dalının kimliği olmalı.
>
> ```zsh
> node --env-file=.env.test node_modules/.bin/prisma migrate status
> ```
> Bu komut test dalına yeni parolayla bağlanmayı dener, hiçbir şeyi değiştirmez. Son satır `Database schema is up to date!` olmalı. Parola yanlışsa kimlik doğrulama (authentication) hatası verir.
>
> ---
>
> ## B) Production parolası (canlı uygulama birkaç dakika etkilenir)
>
> **Hazırlık (parolayı değiştirmeden önce):**
> - Tarayıcıda **Render** panelinde AboneTakip servisinin **Environment** sayfasını ayrı bir sekmede açık tut.
> - VS Code'da proje kökündeki **`.env`** dosyasını aç.
> - `npm run dev` çalışıyorsa terminalde **Ctrl+C** ile durdur.
>
> **B1.** Neon'da dal seçiciden **`production`** dalını seç. **Roles** sayfasında `neondb_owner` satırı için **Reset password** seç ve onayla. Bu andan itibaren canlı uygulama eski parolayla bağlanamaz. Sonraki adımları bekletmeden yap.
>
> **B2.** **Connect** düğmesine tıkla. Dalın `production` olduğundan emin ol.
>
> **B3. Render:** Environment sayfasında `DATABASE_URL` değerini düzenle ve pooled adresi yapıştır. `DIRECT_URL` tanımlıysa onu da direct adresle değiştir. Kaydederken yeniden yayına alma (deploy) seçeneğini seç. Düğmenin adı "Save, rebuild, and deploy" ya da benzeri olabilir.
>
> **B4. Yerel `.env`:** `DATABASE_URL` ve `DIRECT_URL` değerlerini aynı şekilde güncelle ve Cmd+S ile kaydet.
>
> **B5.** Yerel `.env` dosyasının çalıştığını kontrol et:
>
> ```zsh
> npx prisma migrate status
> ```
> Bu komut `.env` dosyasındaki yeni adresle production veritabanına bağlanmayı dener, hiçbir şeyi değiştirmez. Son satır `Database schema is up to date!` olmalı.
>
> **B6.** Render'da yayın tamamlanınca (durum "Live" olunca) canlı siteyi aç, bir test hesabıyla giriş yap ve Müşteriler sayfasının açıldığını gör.
>
> ---
>
> ## Bana yaz
> 1. A4: "aynı" ve `migrate status` çıktısının son satırı
> 2. B5: `migrate status` çıktısının son satırı
> 3. B6: Canlı sitede giriş ve Müşteriler sayfası çalıştı mı?
> 4. Production adresini Render ve `.env` dışında başka bir yere koydun mu? (Örneğin GitHub Actions secrets ya da başka bir servis.) Koyduysan orada da güncellemen gerekir.
>
> Hepsi tamamsa **Adım 2'ye** (çözümleme kancası ve duman testi) geçeceğim.
>
> **Emin olmadığım yer:** Test dalının parolasının production ile aynı olduğu kesin değil, büyük ihtimal. Aynı değilse bile B bölümü zarar vermez, yalnızca gereksiz bir değişiklik olur. Neon ve Render'daki düğme adları farklıysa ekran görüntüsü at, adres ve parola görünmesin.

### Prompt 18 · 22 Eki 2026 14:44

````text
SESSİON  VE PORT DEĞİŞTİRİLECEK Mİ
````

### Claude cevabı 18 · 22 Eki 2026 14:44

> Hayır, ikisine de dokunma. Render'da yalnızca **`DATABASE_URL`** ve (varsa) **`DIRECT_URL`** değişecek.
>
> **`SESSION_SECRET`:** Bu sohbette ya da terminalde hiç görünmedi. Sızan yalnızca Neon veritabanı parolası. Test için ürettiğimiz anahtar da ayrı bir değer ve ekrana basılmadan panoya kopyalandı. Production'daki anahtarı değiştirmenin tek etkisi, giriş yapmış herkesin oturumunun kapanması olur. Gereksiz.
>
> **`PORT`:** Bu bir secret değil. Render'ın uygulamanı hangi kapıdan (port) çalıştıracağını söyleyen ayar. Değiştirirsen uygulama açılmayabilir.
>
> B3'e kaldığın yerden devam et.

### Prompt 19 · 22 Eki 2026 14:48

````text
HEPSİ TAMAM
````

### Claude cevabı 19 · 22 Eki 2026 14:50

> Kurulum tamamlandı: test dalı hazır, parolalar değişti, canlı uygulama çalışıyor.
>
> # Adım 2: Çözümleme kancası ve duman testi
>
> **Amaç:** `node --test` ile mevcut `tenant.ts`, `auth.ts`, `db.ts` ve Prisma istemcisinin yüklenip test dalına bağlanabildiğini görmek. Bu test **hiçbir kayıt eklemez, değiştirmez, silmez**. Mevcut dosyaların hiçbirine dokunmuyoruz, yalnızca iki yeni dosya var.
>
> **Bir tasarım kararı:** Kanca dosyasını `.ts` değil `.mjs` (düz JavaScript) olarak yazdım. `npm run build` bütün `.ts` dosyalarının tiplerini kontrol ediyor. Projendeki `@types/node` sürümü 20, ve kancanın kullandığı `registerHooks` özelliği büyük ihtimalle o sürümün tip tanımlarında yok. `.mjs` dosyası tip kontrolüne girmediği için build'i bozmaz.
>
> ---
>
> ### Dosya 1: `src/test-destek/kancalar.mjs`
>
> `src` klasörünün içinde `test-destek` adında yeni bir klasör aç ve içinde **yeni dosya oluştur**:
>
> ```js
> // TEST ÇÖZÜMLEME KANCASI
> // Yalnızca testler çalışırken yüklenir. Uygulama (next dev, next build) bu dosyayı kullanmaz.
> //
> // Neden gerekli?
> // Node, TypeScript dosyalarını doğrudan çalıştırabilir ama içe aktarmalarda dosya
> // uzantısı ister ("./db" değil "./db.ts"). Next.js ise uzantısız yazıma ve "@/"
> // kısaltmasına izin verir. Bu kanca, testler çalışırken aradaki farkı kapatır.
> // Böylece mevcut dosyalara dokunmak gerekmez.
> //
> // Ne yapar? (sırayla)
> //   1. "@/lib/x" yazımını "src/lib/x" yoluna çevirir.
> //   2. Proje içindeki uzantısız yolları ".ts", ".tsx" ve "/index.ts" ile dener.
> //   3. ".js" diye yazılmış ama aslında ".ts" olan dosyayı bulur (Prisma'nın ürettiği kod için).
> //   4. "next/navigation" gibi paket alt yolları bulunamazsa sonuna ".js" ekleyip dener.
> //
> // Ek paket kullanmaz: Node'un yerleşik "node:module" özelliğidir.
> // .ts değil .mjs yazıldı: "npm run build" tip kontrolüne girmesin diye.
>
> import { registerHooks } from "node:module";
> import { statSync } from "node:fs";
> import { fileURLToPath, pathToFileURL } from "node:url";
> import path from "node:path";
>
> // Bu dosya src/test-destek/ içinde durur. Üç üst klasör proje köküdür.
> const PROJE_KOKU = path.resolve(fileURLToPath(import.meta.url), "../../..");
> const SRC = path.join(PROJE_KOKU, "src");
> const NODE_MODULES = `${path.sep}node_modules${path.sep}`;
>
> // Verilen yolda bir dosya (klasör değil) var mı?
> function dosyaVarMi(yol) {
>   try {
>     return statSync(yol).isFile();
>   } catch {
>     return false;
>   }
> }
>
> // Uzantısız ya da ".js" uzantılı bir yol için gerçek dosyayı arar.
> // Bulamazsa undefined döner ve Node kendi kuralıyla devam eder.
> function dosyayiBul(mutlakYol) {
>   const adaylar = [mutlakYol];
>   if (mutlakYol.endsWith(".js")) adaylar.push(mutlakYol.slice(0, -3) + ".ts");
>   adaylar.push(mutlakYol + ".ts", mutlakYol + ".tsx", path.join(mutlakYol, "index.ts"));
>   return adaylar.find(dosyaVarMi);
> }
>
> // Paket alt yolu mu? Örnek: "next/navigation" (evet), "react" (hayır), "./db" (hayır)
> function paketAltYoluMu(belirtec) {
>   if (belirtec.startsWith(".") || belirtec.startsWith("/") || belirtec.includes(":")) {
>     return false;
>   }
>   const parcalar = belirtec.split("/");
>   const enAzParca = belirtec.startsWith("@") ? 3 : 2; // "@kapsam/paket/alt" ya da "paket/alt"
>   return parcalar.length >= enAzParca && path.extname(belirtec) === "";
> }
>
> registerHooks({
>   resolve(belirtec, baglam, sonraki) {
>     // 1) "@/..." kısaltması: src klasörüne çevir.
>     if (belirtec.startsWith("@/")) {
>       const bulunan = dosyayiBul(path.join(SRC, belirtec.slice(2)));
>       if (bulunan) return sonraki(pathToFileURL(bulunan).href, baglam);
>     }
>
>     // 2) ve 3) Göreli yollar: yalnızca proje dosyalarından gelen içe aktarmalar.
>     const ust = baglam.parentURL;
>     if (
>       (belirtec.startsWith("./") || belirtec.startsWith("../")) &&
>       ust?.startsWith("file:") &&
>       !fileURLToPath(ust).includes(NODE_MODULES)
>     ) {
>       const bulunan = dosyayiBul(path.resolve(path.dirname(fileURLToPath(ust)), belirtec));
>       if (bulunan) return sonraki(pathToFileURL(bulunan).href, baglam);
>     }
>
>     // Diğer her şey: Node'un kendi kuralı.
>     try {
>       return sonraki(belirtec, baglam);
>     } catch (hata) {
>       // 4) "next/navigation" gibi paket alt yolu bulunamadıysa ".js" ekleyip dene.
>       if (hata?.code === "ERR_MODULE_NOT_FOUND" && paketAltYoluMu(belirtec)) {
>         return sonraki(belirtec + ".js", baglam);
>       }
>       throw hata;
>     }
>   },
> });
> ```
>
> ### Dosya 2: `src/test-destek/duman.test.ts`
>
> Aynı klasörde **yeni dosya oluştur**:
>
> ```ts
> // DUMAN TESTİ (Gün 6, Adım 2)
> //
> // Amaç: Test altyapısının çalıştığını görmek. Bu test hiçbir kayıt EKLEMEZ,
> // DEĞİŞTİRMEZ, SİLMEZ. Yalnızca var olmayan bir firma adına iki sayım yapar ve
> // sonucun 0 olduğunu kontrol eder.
> //
> // Çalıştırmak için:
> //   node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test src/test-destek/duman.test.ts
>
> import { test, after } from "node:test";
> import assert from "node:assert/strict";
>
> // KORUMA: .env.test yüklenmediyse veritabanına hiç bağlanmadan dur.
> // TEST_VERITABANI=evet yalnızca .env.test içinde vardır, canlı .env içinde yoktur.
> if (process.env.TEST_VERITABANI !== "evet") {
>   throw new Error(
>     "TEST_VERITABANI=evet bulunamadı. Testler yalnızca .env.test ile (Neon test dalında) çalışır."
>   );
> }
>
> // Koruma geçildikten SONRA içe aktarılır: db.ts yüklenince veritabanı nesnesi oluşur.
> const { tenantaBagliDb } = await import("../lib/tenant.ts");
>
> // Gerçekte var olmayan bir firma kimliği. Bu kimliğe ait hiçbir kayıt olamaz.
> const OLMAYAN_FIRMA = "dumantestiolmayanfirma";
> const db = tenantaBagliDb(OLMAYAN_FIRMA);
>
> // Testler bitince bağlantıyı kapat. Kapatılmazsa Node beklemede kalır.
> after(async () => {
>   await db.$disconnect();
> });
>
> test("tenant.ts, auth.ts, db.ts ve Prisma istemcisi Node ile yüklenebiliyor", () => {
>   assert.equal(typeof tenantaBagliDb, "function");
> });
>
> test("var olmayan firma adına müşteri sayısı 0 (bağlantı ve tenant filtresi çalışıyor)", async () => {
>   const sayi = await db.customer.count();
>   assert.equal(sayi, 0);
> });
>
> test("var olmayan firma adına firma tablosunda hiçbir kayıt görünmez", async () => {
>   const sayi = await db.tenant.count();
>   assert.equal(sayi, 0);
> });
> ```
>
> ---
>
> ### Çalıştır
>
> ```zsh
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test src/test-destek/duman.test.ts
> ```
> Bu komut `.env.test` değerlerini yükler, kancayı devreye alır ve yalnızca duman testini çalıştırır.
>
> **Başarılı çıktı:** Sonda şu satırlar görünür:
> ```
> ℹ pass 3
> ℹ fail 0
> ```
> Başta "ExperimentalWarning" gibi sarı bir uyarı satırı çıkabilir. Bu, kanca özelliğinin henüz deneysel sayıldığını söyler, hata değildir.
>
> **Komut 1 dakikadan uzun süre bitmeden beklerse:** **Ctrl+C** ile durdur ve bana yaz.
>
> ### Bana yaz
> - `pass` ve `fail` sayıları
> - Hata varsa **hata mesajının ilk birkaç satırı**. Bir satırda `postgresql://` geçerse o satırı silerek yapıştır.
>
> **Hata çıkarsa ne yapacağız?** Önceki notuna göre:
> - Hata kancanın çözebileceği türdense (bir dosya yolu bulunamadı gibi) kancayı düzeltirim.
> - Hata **ikinci bir geçici çözüm** gerektiriyorsa duracağım ve Vitest ile karşılaştırmayı sana sunacağım. Örnekler: Prisma'nın ürettiği kodda "strip-only mode" hatası, `react` paketinden "cache" bulunamadı hatası.
>
> **Commit:** Test geçtikten sonra bu iki dosya için ayrı bir commit komutu vereceğim. Şimdilik commit etme.
>
> ### Varsayımlar ve emin olmadığım yerler
> - `registerHooks` özelliğinin Node 26'da bu biçimde çalıştığını varsayıyorum. Bilgimin kesildiği tarihten sonra değişmiş olabilir.
> - `react` paketinin Next.js dışında `cache` fonksiyonunu verip vermediğinden emin değilim. Bu test tam olarak bunu gösterecek.
> - Prisma'nın `generated/prisma` klasörüne ürettiği kodun içeriğini görmedim. Node'un desteklemediği bir TypeScript yapısı içerebilir.

### Prompt 20 · 22 Eki 2026 14:53

````text
kullanici@bilgisayar abonetakip % node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test src/test-destek/duman.test.ts
(node:66231) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/duman.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:66231) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://www.p or libpq SSL mode definitions.
✔ tenant.ts, auth.ts, db.ts ve Prisma istemcisi Node ile yüklenebiliyor (0.268334ms)
✔ var olmayan firma adına müşteri sayısı 0 (bağlantı ve tenant filtresi çalışıyor) (670.001292ms)
✔ var olmayan firma adına firma tablosunda hiçbir kayıt görünmez (56.833583ms)
ℹ tests 3
ℹ suites 0
ℹ pass 3
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 992.950834
````

### Claude cevabı 20 · 22 Eki 2026 14:54

> Duman testi geçti: **3 geçti, 0 başarısız**. Yalnızca tek bir geçici çözüm (çözümleme kancası) yetti. `react`, `next/*` ve Prisma'nın ürettiği kod sorunsuz yüklendi, test dalına bağlantı da çalışıyor. Yani `node --test` ile devam edebiliriz, Vitest karşılaştırmasına gerek kalmadı.
>
> ### Çıktıdaki iki uyarı ne anlama geliyor?
>
> **1. `MODULE_TYPELESS_PACKAGE_JSON`:** Node, test dosyasının modül türünü bilmediği için önce bir yöntemle okumayı deniyor, olmayınca diğeriyle okuyor. Bu yalnızca küçük bir yavaşlama ve `donem.test.ts` dosyasında da muhtemelen aynısı oluyordu. Uyarının önerdiği gibi `package.json` dosyasına `"type": "module"` **eklemeyeceğiz**. Bu ayar projedeki bütün `.js` dosyalarının okunma biçimini değiştirir ve Next.js yapılandırmasını etkileyebilir. Zararsız bir uyarı için bu riske gerek yok.
>
> **2. `SECURITY WARNING: The SSL modes...`:** Bu uyarı PostgreSQL sürücüsünden (`pg`) geliyor ve bir sorun bildirmiyor. Şu an adresteki `sslmode=require` en sıkı güvenlik düzeyinde (`verify-full`) çalışıyor. Sürücü, gelecekteki bir sürümde bu davranışın gevşeyeceği konusunda uyarıyor. Aynı uyarı uygulamanın kendi kayıtlarında da çıkıyor olabilir. Bu Gün 6'nın kapsamı dışında. Adresleri ileride `sslmode=verify-full` ile güncellemeyi issue olarak kaydetmeni öneririm, bugün dokunmuyoruz.
>
> ### Commit
>
> ```zsh
> git add src/test-destek/kancalar.mjs src/test-destek/duman.test.ts
> ```
> Bu komut yalnızca bu iki yeni dosyayı commit'e hazırlar.
>
> ```zsh
> git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"
> ```
> Bu komut takip edilen dosyalarda gerçek parola biçimi arar. **Çıktı boş olmalı.**
>
> ```zsh
> git --no-pager diff --cached --stat
> ```
> Bu komut commit'e hazırlanan dosyaları listeler. **Beklenen:** yalnızca `kancalar.mjs` ve `duman.test.ts`.
>
> ```zsh
> git commit -m "test: node --test için çözümleme kancası ve duman testi"
> ```
> Bu komut iki dosyayı yerel depoya kaydeder.
>
> Commit başarılıysa yaz. **Adım 3'e** geçeceğim: rol kontrolünü test edilebilir hâle getiren yapı değişikliği (`yetki.ts`, `pasife-alma.ts`, iki action, `abonelik-kontrol.ts`, `auth.ts`). Senin isteğine göre bu ayrı bir commit olacak ve `npm run build` ile tarayıcı denemesinden geçmeden test dosyalarına geçmeyeceğiz.

### Prompt 21 · 22 Eki 2026 14:54

````text
ADIM 3 E GEÇEBİLİRİZ
````

### Claude cevabı 21 · 22 Eki 2026 14:58

> Commit sonucunu yazmadığın için yaptığını varsayıyorum. Emin değilsen önce `git --no-pager log --oneline -3` çalıştır. Bu komut son üç commit'i listeler, en üstte `test: node --test için çözümleme kancası...` görünmeli.
>
> # Adım 3: Rol kontrolünü test edilebilir hâle getirme
>
> **Ne değişiyor?**
>
> | Dosya | İşlem | Değişiklik |
> |---|---|---|
> | `src/lib/yetki.ts` | Yeni dosya | Saf rol fonksiyonu `yoneticiMi`, ~15 satır |
> | `src/lib/pasife-alma.ts` | Yeni dosya | Müşteri ve plan pasife alma çekirdeği, ~120 satır |
> | `src/lib/abonelik-kontrol.ts` | İçeriği değişir | İsteğe bağlı `db` parametresi, 3 satır |
> | `src/lib/auth.ts` | İçeriği değişir | `requireManager` artık `yoneticiMi` kullanır, 2 satır |
> | `src/app/(panel)/musteriler/actions.ts` | İçeriği değişir | Yalnızca `musteriPasifeAl` ve içe aktarmalar |
> | `src/app/(panel)/planlar/actions.ts` | İçeriği değişir | Yalnızca `planPasifeAl` ve içe aktarmalar |
>
> Ekleme ve güncelleme fonksiyonlarına, abonelik işlemlerine ve sayfalara dokunulmuyor.
>
> **Veri akışı (pasife alma, değişiklikten sonra):**
> 1. Action oturumu okur: `requireUser()` ve `getTenantDb()`. Giriş yoksa bugünkü gibi giriş sayfasına yönlendirir.
> 2. Çekirdek fonksiyon sırasıyla şunları yapar:
>    - Rol kontrolü
>    - Kimlik biçimi kontrolü
>    - Kaydı bu firmada arar
>    - Zaten pasif mi kontrol eder
>    - Aktif abonelik var mı kontrol eder
>    - Güncelleme yapar
>
>    Sıra ve mesajlar bugünküyle birebir aynı.
> 3. Başarılıysa action sayfaları yeniler (`revalidatePath`).
>
> Etkilenen tablolar değişmiyor: `customers`, `plans` (güncelleme) ve `subscriptions` (yalnızca sayım).
>
> **Tenant kuralı korunuyor:** Çekirdek fonksiyon veritabanı nesnesini parametre olarak alıyor. Uygulamada bu nesne her zaman `getTenantDb()` çağrısından, yani oturumdan gelir. `tenant.ts` dosyasındaki "uygulama kodu getTenantDb() kullanır" kuralı bozulmuyor. Testler ise aynı yere `tenantaBagliDb(A)` verecek.
>
> ---
>
> ### 1) `src/lib/yetki.ts`: **yeni dosya oluştur**
>
> ```ts
> // ROL KURALLARI
> //
> // Rol kararları bu dosyadaki saf fonksiyonlarla verilir: veritabanına ve çereze
> // dokunmazlar, aynı girdiye her zaman aynı sonucu verirler. Bu yüzden testlerden
> // doğrudan çağrılabilirler.
> //
> // Rol kontrolü her zaman SUNUCUDA yapılır. Arayüzde düğme gizlemek yetki kontrolü değildir.
>
> import type { Role } from "../../generated/prisma/enums";
>
> // Yalnızca firma yöneticisine (manager) açık işlemler için kullanılır.
> // Bugün bu kurala bağlı olanlar: müşteri pasife alma, plan pasife alma,
> // Ayarlar ve Kullanıcılar sayfaları.
> export function yoneticiMi(rol: Role): boolean {
>   return rol === "manager";
> }
> ```
>
> ### 2) `src/lib/pasife-alma.ts`: **yeni dosya oluştur**
>
> ```ts
> // PASİFE ALMA İŞLEMLERİNİN ÇEKİRDEĞİ (Gün 6)
> //
> // Müşteri ve plan pasife alma işlemlerinin asıl mantığı burada durur:
> // rol kontrolü, kimlik kontrolü, kaydın bulunması, aktif abonelik kontrolü ve güncelleme.
> // musteriler/actions.ts ve planlar/actions.ts içindeki sunucu işlemleri yalnızca
> // oturumu okur, buradaki fonksiyonu çağırır ve sayfaları yeniler.
> //
> // Neden ayrıldı? Sunucu işlemleri oturumu çerezden okur ve çerez yalnızca bir
> // Next.js isteği içinde vardır. Buradaki fonksiyonlar kullanıcıyı ve veritabanı
> // nesnesini PARAMETRE olarak aldığı için testlerden doğrudan çağrılabilir.
> // Böylece "finance pasife alamaz" kuralı otomatik testle kontrol edilir.
> //
> // Uygulamada parametreler her zaman oturumdan gelir, formdan asla gelmez:
> //   kullanici -> requireUser()
> //   db        -> getTenantDb()  (tenantId filtresi otomatik)
> //
> // Mesajlar ve kontrol sırası Gün 4-5'teki hâliyle birebir aynıdır.
>
> import type { AktifKullanici } from "./auth";
> import type { TenantDb } from "./tenant";
> import { yoneticiMi } from "./yetki";
> import { kimlikDogrula } from "./validation";
> import { aktifAbonelikVarMi } from "./abonelik-kontrol";
> import { MESAJ, type FormDurumu } from "./islem";
>
> // Çekirdeğin kullanıcıdan ihtiyaç duyduğu tek bilgi rolüdür.
> // Hangi firmanın verisine dokunulacağını "db" belirler.
> type IslemYapan = Pick<AktifKullanici, "role">;
>
> // Müşteriyi pasife alır. YALNIZCA manager yapabilir. Geri alınamaz.
> // idGirdisi: formdan gelen ham değer (formData.get("id")). Burada doğrulanır.
> export async function musteriPasifeAlCekirdek(
>   kullanici: IslemYapan,
>   db: TenantDb,
>   idGirdisi: unknown
> ): Promise<FormDurumu> {
>   // 1) Rol kontrolü: finance kullanıcısı hiçbir sorgu yapılmadan durdurulur.
>   if (!yoneticiMi(kullanici.role)) {
>     return { durum: "hata", mesaj: MESAJ.yetkiYok };
>   }
>
>   // 2) Kimlik biçimi bozuksa neyin yanlış olduğu söylenmez: "bulunamadı".
>   const kimlik = kimlikDogrula(idGirdisi);
>   if (!kimlik.ok) {
>     return { durum: "hata", mesaj: MESAJ.bulunamadi };
>   }
>
>   // 3) Kayıt bu firmada var mı? Başka firmanın kaydı tenant filtresi yüzünden eşleşmez.
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
>   // 4) Aktif aboneliği olan müşteri pasife alınamaz (bkz. abonelik-kontrol.ts).
>   //    Aynı "db" verilir: sayım da aynı firmayla sınırlı kalır.
>   if (await aktifAbonelikVarMi({ musteriId: kimlik.deger }, db)) {
>     return {
>       durum: "hata",
>       mesaj:
>         "Bu müşterinin aktif aboneliği var. Önce aboneliği iptal edin, sonra müşteriyi pasife alın.",
>     };
>   }
>
>   // 5) Güncelleme. Koşulda isActive: true olduğu için çift tıklamada ikinci istek 0 satır etkiler.
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
>   return { durum: "basarili", mesaj: "Müşteri pasife alındı." };
> }
>
> // Planı pasife alır. YALNIZCA manager yapabilir. Geri alınamaz.
> // idGirdisi: formdan gelen ham değer (formData.get("id")). Burada doğrulanır.
> export async function planPasifeAlCekirdek(
>   kullanici: IslemYapan,
>   db: TenantDb,
>   idGirdisi: unknown
> ): Promise<FormDurumu> {
>   // 1) Rol kontrolü: finance kullanıcısı hiçbir sorgu yapılmadan durdurulur.
>   if (!yoneticiMi(kullanici.role)) {
>     return { durum: "hata", mesaj: MESAJ.yetkiYok };
>   }
>
>   // 2) Kimlik biçimi bozuksa neyin yanlış olduğu söylenmez: "bulunamadı".
>   const kimlik = kimlikDogrula(idGirdisi);
>   if (!kimlik.ok) {
>     return { durum: "hata", mesaj: MESAJ.bulunamadi };
>   }
>
>   // 3) Kayıt bu firmada var mı? Başka firmanın kaydı tenant filtresi yüzünden eşleşmez.
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
>   // 4) Aktif aboneliği olan plan pasife alınamaz (bkz. abonelik-kontrol.ts).
>   if (await aktifAbonelikVarMi({ planId: kimlik.deger }, db)) {
>     return {
>       durum: "hata",
>       mesaj:
>         "Bu planın aktif abonelikleri var. Önce abonelikleri iptal edin, sonra planı pasife alın.",
>     };
>   }
>
>   // 5) Güncelleme. Koşulda isActive: true olduğu için çift tıklamada ikinci istek 0 satır etkiler.
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
>   return { durum: "basarili", mesaj: "Plan pasife alındı." };
> }
> ```
>
> ### 3) `src/lib/abonelik-kontrol.ts`: **dosyanın içeriğini tamamen şununla değiştir**
>
> ```ts
> // AKTİF ABONELİK KONTROLÜ
> //
> // Bir müşteri veya plan pasife alınmadan önce ve aktif aboneliği olan bir planın
> // fiyatı veya aralığı değiştirilmek istendiğinde bu fonksiyon çağrılır.
> // Bu kontrolün yapıldığı TEK yer burasıdır.
> //
> // Sorgu tenant filtresinden geçen veritabanı nesnesiyle yapılır. "count" işlemi
> // tenant.ts içindeki OKUMA listesinde olduğu için filtreye tenantId otomatik
> // eklenir: başka firmanın abonelikleri hiçbir zaman sayılmaz.
> //
> // Gün 6: İsteğe bağlı ikinci parametre "db" eklendi.
> // - Verilirse o nesne kullanılır (pasife-alma.ts ve testler). Bu nesne de
> //   tenant filtresinden geçen bir nesnedir (TenantDb).
> // - Verilmezse eskisi gibi oturumdan alınır (getTenantDb). Mevcut çağrılar değişmedi.
> //
> // DURUM (Gün 5): Abonelikler artık oluşturuluyor (bkz. abonelikler/actions.ts),
> // bu yüzden kontrol gerçek veriyle çalışır.
> //
> // Pasif kayda aktif abonelik bağlanmasını engelleyen karşı taraf:
> // - abonelikBaslat, abonelik kaydını yazdıktan sonra AYNI veritabanı işleminde
> //   müşterinin ve planın hâlâ isActive=true olduğunu yeniden doğrular. Değilse
> //   işlem geri alınır.
> //
> // BİLİNEN SINIR (docs/02_ADR.md'de de yazılıdır):
> // Pasife alma "önce kontrol et, sonra güncelle" şeklinde iki adımdır. Pasife alma
> // ile abonelik başlatma TAM AYNI ANDA gelirse, ikisi de birbirinin değişikliğini
> // göremeden tamamlanabilir ve küçük bir pencere kalır. Bunu tamamen kapatmak satır
> // kilidi (SELECT ... FOR UPDATE) gerektirir; o da ham SQL demektir ve projede ham
> // SQL yasaktır (bkz. tenant.ts). Bu risk bilinçli olarak kabul edilmiştir.
>
> import { getTenantDb, type TenantDb } from "./tenant";
>
> type Hedef = { musteriId: string } | { planId: string };
>
> // Verilen müşterinin veya planın ACTIVE durumda aboneliği var mı?
> export async function aktifAbonelikVarMi(
>   hedef: Hedef,
>   db?: TenantDb
> ): Promise<boolean> {
>   const veritabani = db ?? (await getTenantDb());
>
>   const kosul =
>     "musteriId" in hedef
>       ? { customerId: hedef.musteriId }
>       : { planId: hedef.planId };
>
>   const sayi = await veritabani.subscription.count({
>     where: { ...kosul, status: "ACTIVE" },
>   });
>
>   return sayi > 0;
> }
> ```
>
> ### 4) `src/lib/auth.ts`: **dosyanın içeriğini tamamen şununla değiştir**
>
> Değişen yalnızca iki yer: `yetki` içe aktarması ve `requireManager` fonksiyonundaki karşılaştırma.
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
>
> // bcrypt maliyeti: sayı büyüdükçe özetleme yavaşlar ve kırılması zorlaşır.
> const BCRYPT_TUR = 12;
>
> // Giriş hatasında hangi alanın yanlış olduğu bilerek söylenmez.
> const GIRIS_HATASI = "E-posta veya parola hatalı.";
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
> // Prisma'nın "tekrar eden kayıt" hatasını (P2002) tanır.
> function tekrarEdenKayitMi(hata: unknown): boolean {
>   return (
>     typeof hata === "object" &&
>     hata !== null &&
>     "code" in hata &&
>     (hata as { code: unknown }).code === "P2002"
>   );
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
>     // İki kişi aynı anda aynı e-postayla kayıt olursa veritabanı engeller.
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
> ### 5) `src/app/(panel)/musteriler/actions.ts`: **dosyanın içeriğini tamamen şununla değiştir**
>
> `musteriEkle`, `musteriGuncelle` ve `epostaKullaniliyorMu` birebir aynı. Değişenler: içe aktarmalar, baştaki yorumun son paragrafı ve `musteriPasifeAl`.
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
> //
> // Gün 6: Pasife alma işleminin mantığı ve rol kontrolü src/lib/pasife-alma.ts
> // dosyasına taşındı (otomatik test edilebilsin diye). Buradaki işlem yalnızca
> // oturumu okur, çekirdeği çağırır ve sayfaları yeniler.
>
> import { revalidatePath } from "next/cache";
> import { requireUser } from "@/lib/auth";
> import { getTenantDb } from "@/lib/tenant";
> import { kimlikDogrula, musteriGirdisiniDogrula } from "@/lib/validation";
> import { musteriPasifeAlCekirdek } from "@/lib/pasife-alma";
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
> // Rol kontrolü ve asıl mantık src/lib/pasife-alma.ts içindedir.
> export async function musteriPasifeAl(
>   _onceki: FormDurumu,
>   formData: FormData
> ): Promise<FormDurumu> {
>   // Kullanıcı ve kiracıya bağlı veritabanı nesnesi: ikisi de OTURUMDAN gelir.
>   // Giriş yapılmamışsa yönlendirme yapılır (try/catch dışında).
>   const kullanici = await requireUser();
>   const db = await getTenantDb();
>
>   const sonuc = await musteriPasifeAlCekirdek(kullanici, db, formData.get("id"));
>
>   // Yalnızca başarılı işlemde sayfalar yenilenir.
>   if (sonuc.durum === "basarili") {
>     revalidatePath("/musteriler");
>     const kimlik = kimlikDogrula(formData.get("id"));
>     if (kimlik.ok) revalidatePath(`/musteriler/${kimlik.deger}`);
>   }
>   return sonuc;
> }
> ```
>
> ### 6) `src/app/(panel)/planlar/actions.ts`: **dosyanın içeriğini tamamen şununla değiştir**
>
> `planEkle` ve `planGuncelle` birebir aynı. Değişenler: içe aktarmalar, baştaki yorum ve `planPasifeAl`.
>
> ```ts
> "use server";
>
> // PLAN SUNUCU İŞLEMLERİ: ekleme, düzenleme, pasife alma.
> // Kurallar müşteri işlemleriyle aynıdır (bkz. musteriler/actions.ts).
> // Ek kural: aktif aboneliği olan planın fiyatı ve aralığı değiştirilemez,
> // çünkü MRR planın ŞU ANKİ fiyatından hesaplanır. Fiyat değişirse geçmiş
> // ve bugünkü MRR bir anda değişir. Ad değişikliği serbesttir.
> //
> // Gün 6: Pasife alma işleminin mantığı ve rol kontrolü src/lib/pasife-alma.ts
> // dosyasına taşındı (otomatik test edilebilsin diye).
>
> import { revalidatePath } from "next/cache";
> import { requireUser } from "@/lib/auth";
> import { getTenantDb } from "@/lib/tenant";
> import { kimlikDogrula, planGirdisiniDogrula } from "@/lib/validation";
> import { aktifAbonelikVarMi } from "@/lib/abonelik-kontrol";
> import { planPasifeAlCekirdek } from "@/lib/pasife-alma";
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
> // Rol kontrolü ve asıl mantık src/lib/pasife-alma.ts içindedir.
> export async function planPasifeAl(
>   _onceki: FormDurumu,
>   formData: FormData
> ): Promise<FormDurumu> {
>   // Kullanıcı ve kiracıya bağlı veritabanı nesnesi: ikisi de OTURUMDAN gelir.
>   // Giriş yapılmamışsa yönlendirme yapılır (try/catch dışında).
>   const kullanici = await requireUser();
>   const db = await getTenantDb();
>
>   const sonuc = await planPasifeAlCekirdek(kullanici, db, formData.get("id"));
>
>   // Yalnızca başarılı işlemde sayfalar yenilenir.
>   if (sonuc.durum === "basarili") {
>     revalidatePath("/planlar");
>     const kimlik = kimlikDogrula(formData.get("id"));
>     if (kimlik.ok) revalidatePath(`/planlar/${kimlik.deger}`);
>   }
>   return sonuc;
> }
> ```
>
> ---
>
> ## Kontroller (sırayla)
>
> `npm run dev` çalışıyorsa önce **Ctrl+C** ile durdur.
>
> ```zsh
> npm run build
> ```
> Bu komut uygulamayı canlıya çıkacak hâliyle derler ve bütün TypeScript dosyalarının tiplerini kontrol eder. Sonda hata olmadan bitmeli.
>
> ```zsh
> npm run lint
> ```
> Bu komut kod stilini kontrol eder ve örneğin kullanılmayan içe aktarmaları yakalar. Hata çıkmamalı.
>
> ```zsh
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test src/test-destek/duman.test.ts
> ```
> Bu komut duman testini tekrar çalıştırır. `auth.ts` ve `abonelik-kontrol.ts` değiştiği için hâlâ yüklenebildiklerini doğrular. Sonuç yine `pass 3`, `fail 0` olmalı.
>
> ```zsh
> npm run dev
> ```
> Bu komut uygulamayı bilgisayarında çalıştırır. Tarayıcıda her zamanki adresten aç.
>
> **Tarayıcı denemesi** (manager hesabıyla):
>
> | # | Ne yap | Beklenen mesaj |
> |---|---|---|
> | 1 | Yeni bir müşteri ekle (aboneliği olmasın), sonra pasife al | "Müşteri pasife alındı." ve listede pasif görünür |
> | 2 | Aktif aboneliği olan bir müşteriyi pasife almayı dene | "Bu müşterinin aktif aboneliği var. Önce aboneliği iptal edin..." |
> | 3 | Yeni bir plan ekle (aboneliği olmasın), sonra pasife al | "Plan pasife alındı." |
> | 4 | Aktif aboneliği olan bir planı pasife almayı dene | "Bu planın aktif abonelikleri var. Önce abonelikleri iptal edin..." |
> | 5 | Ayarlar ve Kullanıcılar sayfalarını aç | Yer tutucu sayfalar açılır (manager oldukları için) |
>
> **Finance ile deneme şu an yapılamıyor:** Kullanıcı yönetimi henüz yok, bu yüzden arayüzden finance kullanıcısı oluşturulamıyor. Finance kuralını Adım 4'teki otomatik testler kontrol edecek. Elle test tablosu için test dalında finance kullanıcısı oluşturmanın yolunu o adımda vereceğim.
>
> ## Commit (yalnızca kontrollerin hepsi geçerse)
>
> ```zsh
> git add src/lib/yetki.ts src/lib/pasife-alma.ts src/lib/abonelik-kontrol.ts src/lib/auth.ts "src/app/(panel)/musteriler/actions.ts" "src/app/(panel)/planlar/actions.ts"
> ```
> Bu komut yalnızca bu altı dosyayı commit'e hazırlar. Parantez içeren klasör adları zsh'de özel anlam taşıdığı için yollar tırnak içinde.
>
> ```zsh
> git --no-pager diff --cached --stat
> ```
> Bu komut commit'e hazırlanan dosyaları listeler. Altı dosya görünmeli.
>
> ```zsh
> git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"
> ```
> Bu komut parola izi arar. Çıktı boş olmalı.
>
> ```zsh
> git commit -m "refactor: pasife alma rol kontrolünü test edilebilir çekirdeğe taşı"
> ```
> Bu komut yapı değişikliğini ayrı bir commit olarak kaydeder.
>
> ## Bana yaz
> 1. `npm run build` ve `npm run lint` sonucu. Hata varsa ilk birkaç satır.
> 2. Duman testi: pass ve fail sayıları.
> 3. Tarayıcı tablosundaki 5 satırın sonucu.
> 4. Commit başarılı mı?
>
> ## Varsayımlar ve emin olmadığım yerler
> - `npm run dev` bilgisayarında `.env` dosyasını, yani production veritabanını kullanıyor. Önceki günlerde de böyle çalıştığını varsayıyorum. Tarayıcı denemesinde eklenen müşteri ve plan production'a yazılır. Bütün verinin sahte olduğunu söylediğin için sorun görmedim. İstersen geliştirme sunucusunu test dalıyla çalıştırmanın yolunu da verebilirim.
> - Pasife alma düğmesinin (`PasifeAlDugmesi`) bu action'ları aynı imzayla `(önceki durum, formData)` çağırdığını varsayıyorum. İmza değişmediği için dosyaya dokunmadım.
> - `Pick<AktifKullanici, "role">` tipinin `requireUser()` sonucunu kabul edeceğini varsayıyorum. `npm run build` bunu doğrulayacak.

### Prompt 22 · 22 Eki 2026 15:07

````text
ayarlar ve kullanıcılar sayfaları böyle
````

_[2 ekran görüntüsü eklendi]_

### Claude cevabı 22 · 22 Eki 2026 15:07

> 5. satır **geçti**. Ayşe Deneme manager (Yönetici) olduğu için iki sayfa da yer tutucu içeriğiyle açılıyor, "yetkiniz yok" mesajı çıkmıyor. Bu, `requireManager` fonksiyonunun yeni `yoneticiMi` fonksiyonuyla doğru çalıştığını gösteriyor. Menünün de manager için iki bağlantıyı gösterdiğini ekranda görüyorum.
>
> Commit'e geçmeden önce diğer sonuçlar gerekiyor. Bana şunları yaz:
>
> 1. **`npm run build`:** Hatasız bitti mi?
> 2. **`npm run lint`:** Hata var mı?
> 3. **Duman testi:** `pass 3`, `fail 0` mı?
> 4. **Tarayıcı tablosu:**
>    - **1:** Aboneliği olmayan yeni müşteriyi pasife al → "Müşteri pasife alındı."?
>    - **2:** Aktif aboneliği olan müşteriyi pasife almayı dene → "Bu müşterinin aktif aboneliği var..."?
>    - **3:** Aboneliği olmayan yeni planı pasife al → "Plan pasife alındı."?
>    - **4:** Aktif aboneliği olan planı pasife almayı dene → "Bu planın aktif abonelikleri var..."?
>
> Mesajları kısaca yazman yeterli. İstersen ekran görüntüsü de atabilirsin.
>
> Dördü de geçtiyse önceki mesajdaki **commit** komutlarını çalıştır ve sonucu yaz. Sonra Adım 4'e (test dosyaları) geçeceğiz.

### Prompt 23 · 22 Eki 2026 15:07

````text
ctrl c ile npm run dev i durdurayım mı
````

### Claude cevabı 23 · 22 Eki 2026 15:07

> Henüz değil. Önce tarayıcı tablosundaki **1–4. satırları** yap, onlar için `npm run dev` açık kalmalı.
>
> Sonra şu sırayla ilerle:
>
> 1. Tarayıcı denemesi bitince terminalde **Ctrl+C** ile `npm run dev` sunucusunu durdur.
> 2. `npm run build` ve `npm run lint` komutlarını **daha önce çalıştırmadıysan** şimdi çalıştır. `npm run build` ile `npm run dev` aynı anda çalışmamalı, çünkü ikisi de `.next` klasörünü kullanır ve birbirini bozabilir.
> 3. Duman testini çalıştırmadıysan onu da çalıştır.
> 4. Hepsi geçtiyse commit komutlarına geç.
>
> Build, lint ve duman testini zaten çalıştırıp geçtiysen yalnızca 1. adımı yap ve doğrudan commit'e geç.

### Prompt 24 · 22 Eki 2026 15:09

````text
Last login: Wed Oct 21 10:49:03 on ttys000
kullanici@bilgisayar abonetakip % git add src/lib/yetki.ts src/lib/pasife-alma.ts src/lib/abonelik-kontrol.ts src/lib/auth.ts "src/app/(panel)/musteriler/actions.ts" "src/app/(panel)/planlar/actions.ts"
kullanici@bilgisayar abonetakip % git --no-pager diff --cached --stat
 src/app/(panel)/musteriler/actions.ts |  63 +++++++++------------------------
 src/app/(panel)/planlar/actions.ts    |  61 +++++++++-----------------------
 src/lib/abonelik-kontrol.ts           |  24 ++++++++-----
 src/lib/auth.ts                       |   4 ++-
 src/lib/pasife-alma.ts                | 141 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 src/lib/yetki.ts                      |  16 +++++++++
 6 files changed, 209 insertions(+), 100 deletions(-)
kullanici@bilgisayar abonetakip % git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"
kullanici@bilgisayar abonetakip % git commit -m "refactor: pasife alma rol kontrolünü test edilebilir çekirdeğe taşı"
[main 358c0a7] refactor: pasife alma rol kontrolünü test edilebilir çekirdeğe taşı
 6 files changed, 209 insertions(+), 100 deletions(-)
 create mode 100644 src/lib/pasife-alma.ts
 create mode 100644 src/lib/yetki.ts
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 24 · 22 Eki 2026 15:09

> Commit başarılı: 6 dosya, parola izi yok. Değişiklik ayrı bir commit olarak kaydedildi (`358c0a7`).
>
> Ancak senin koyduğun kurala göre Adım 4'e geçmeden önce şunların sonucunu bilmem gerekiyor:
>
> 1. **`npm run build`:** Hatasız bitti mi?
> 2. **`npm run lint`:** Hata var mı?
> 3. **Duman testi:** `pass 3`, `fail 0` mı?
> 4. **Tarayıcı 1–4. satırlar:**
>    - Müşteri pasife alma
>    - Aktif aboneliği olan müşteride engel
>    - Plan pasife alma
>    - Aktif aboneliği olan planda engel
>
>    Mesajlar beklenen gibi miydi?
>
> Bunları çalıştırmadıysan şimdi çalıştır. Commit yalnızca bilgisayarında. Bir sorun çıkarsa düzeltmeyi yeni bir commit ile yaparız, push etmediğin sürece GitHub etkilenmez. Hepsi geçene kadar **push etme**.

### Prompt 25 · 22 Eki 2026 15:11

````text
mesajlar bekledğimiz gibiydi , kullanici@bilgisayar abonetakip % npm run build

> abonetakip@0.1.0 build
> next build

▲ Next.js 16.4.2 (Turbopack)
- Environments: .env
✓ Running next.config.ts took 12ms

  Creating an optimized production build ...
✓ Compiled successfully in 277ms
  Running TypeScript ...
  Finished TypeScript in 803ms ...
  Collecting page data using 9 workers ...
✓ Collecting page data using 9 workers in 382ms
  Generating static pages using 9 workers (0/12) ...
  Generating static pages using 9 workers (3/12) 
  Generating static pages using 9 workers (6/12) 
  Generating static pages using 9 workers (9/12) 
✓ Generating static pages using 9 workers (12/12) in 83ms
  Finalizing page optimization ...
✓ Finalizing page optimization in 18ms

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

kullanici@bilgisayar abonetakip % npm run lint

> abonetakip@0.1.0 lint
> eslint

kullanici@bilgisayar abonetakip % node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test src/test-destek/duman.test.ts
(node:66947) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/duman.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:66947) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://www for libpq SSL mode definitions.
✔ tenant.ts, auth.ts, db.ts ve Prisma istemcisi Node ile yüklenebiliyor (0.252666ms)
✔ var olmayan firma adına müşteri sayısı 0 (bağlantı ve tenant filtresi çalışıyor) (585.81725ms)
✔ var olmayan firma adına firma tablosunda hiçbir kayıt görünmez (57.241875ms)
ℹ tests 3
ℹ suites 0
ℹ pass 3
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 875.736708
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 25 · 22 Eki 2026 15:16

> Hepsi geçti:
> - Build ve TypeScript kontrolü hatasız.
> - Lint temiz.
> - Duman testi 3/3.
> - Tarayıcıdaki dört pasife alma senaryosu beklenen mesajları verdi.
>
> Yapı değişikliği Gün 4–5 davranışını bozmadı. Push edebilirsin.
>
> # Adım 4: Test dosyaları
>
> | Dosya | İşlem | Ne test eder | Veritabanı |
> |---|---|---|---|
> | `src/test-destek/veri.ts` | Yeni | Test firmalarını oluşturan ve silen yardımcı (onayladığın ham prisma istisnası) | Test dalı |
> | `src/lib/tenant.test.ts` | Yeni | A) Kiracı izolasyonu, 11. test dahil | Test dalı |
> | `src/lib/pasife-alma.test.ts` | Yeni | C) Rol testleri (finance pasife alamaz) | Test dalı |
> | `src/lib/yetki.test.ts` | Yeni | `yoneticiMi` saf fonksiyonu | Yok |
> | `src/lib/session.test.ts` | Yeni | D) Oturum belirteci: sahte, süresi dolmuş, bozuk | Yok |
> | `src/test-destek/kurallar.test.ts` | Yeni | B) Statik kural: ham prisma ve ham SQL kimde var? | Yok |
> | `package.json` | İçeriği değişir | `test` ve `test:db` betikleri. Paket eklenmez. | - |
>
> Test dosyalarını `donem.test.ts` gibi test ettikleri dosyanın yanına koydum. Kurulum dosyaları `test-destek/` klasöründe.
>
> **Test verisi:** Her test dosyası çalışınca iki sahte firma (A ve B) oluşur. Her firmada şunlar olur:
> - 1 manager, 1 finance
> - 2 plan (biri abonelikli, biri boş)
> - 2 müşteri (biri abonelikli, biri boş)
> - 1 aktif abonelik ve "başladı" olayı
>
> Firma adları `test-xxxxxxxx-a` biçimindedir. Testler bitince yalnızca bu çalışmada oluşturulan ID'ler silinir. Ek bir güvence olarak silme öncesinde adın bu çalışmanın etiketiyle başladığı da kontrol edilir. Sonunda hiçbir kayıt kalmadığı doğrulanır.
>
> ---
>
> ### 1) `src/test-destek/veri.ts`: **yeni dosya oluştur**
>
> ```ts
> // TEST VERİSİ YARDIMCISI (yalnızca testlerde kullanılır)
> //
> // Her test dosyası çalışınca iki sahte firma (A ve B) oluşturur ve testler
> // bitince yalnızca BU ÇALIŞMADA oluşturduğu kayıtları siler.
> //
> // İSTİSNA (Gün 6 onayı): Bu dosya ham "prisma" nesnesini kullanır. Firma (Tenant)
> // oluşturma ve silme işlemleri tenant filtresinden geçemez, çünkü filtre bunları
> // bilerek engeller. kurallar.test.ts yalnızca BU dosyaya bu izni verir.
> //
> // GÜVENLİK:
> // 1. TEST_VERITABANI=evet yoksa veritabanına hiç bağlanmadan durur.
> //    Bu işaret yalnızca .env.test içinde vardır (Neon test dalı).
> // 2. Silme yalnızca bu çalışmada oluşturulan firma kimlikleriyle yapılır ve
> //    firmanın adı bu çalışmanın etiketiyle başlamalıdır. Joker silme yoktur.
> // 3. Silmeden sonra hiçbir test firmasının kalmadığı kontrol edilir.
>
> import { randomUUID } from "node:crypto";
>
> // 1. güvence: veritabanına bağlanmadan ÖNCE kontrol.
> if (process.env.TEST_VERITABANI !== "evet") {
>   throw new Error(
>     "TEST_VERITABANI=evet bulunamadı. Veritabanı testleri yalnızca .env.test ile (Neon test dalında) çalışır: npm run test:db"
>   );
> }
>
> // Kontrol geçildikten SONRA içe aktarılır.
> const { prisma } = await import("../lib/db.ts");
>
> // Bu çalışmaya özel etiket. Örnek: "test-3f9a1c2b". Firma adları bununla başlar.
> export const CALISMA = `test-${randomUUID().slice(0, 8)}`;
>
> // Test planlarının fiyatı (TL, tam sayı).
> export const PLAN_FIYATI = 1000;
>
> // Bu çalışmada oluşturulan firmaların kimlikleri. Silme yalnızca bunlarla yapılır.
> const olusturulanFirmaIdleri: string[] = [];
>
> // Bir test firmasının kayıtlarının kimlikleri.
> export type TestFirmasi = {
>   tenantId: string;
>   managerId: string;
>   financeId: string;
>   abonelikliPlanId: string; // aktif aboneliği olan plan
>   bosPlanId: string; // aboneliği olmayan plan
>   abonelikliMusteriId: string; // aktif aboneliği olan müşteri
>   bosMusteriId: string; // aboneliği olmayan müşteri
>   abonelikId: string; // abonelikli müşterinin ACTIVE aboneliği
> };
>
> // Bir sahte firma ve içindeki kayıtları oluşturur. etiket: "a" ya da "b".
> export async function testFirmasiOlustur(etiket: string): Promise<TestFirmasi> {
>   const on = `${CALISMA}-${etiket}`;
>
>   const firma = await prisma.tenant.create({
>     data: { name: on },
>     select: { id: true },
>   });
>   // Hemen listeye eklenir: sonraki adımlardan biri hata verse bile temizlenir.
>   olusturulanFirmaIdleri.push(firma.id);
>   const tenantId = firma.id;
>
>   // Kullanıcılar. passwordHash gerçek bir bcrypt özeti DEĞİLDİR:
>   // bu kullanıcılarla giriş yapılamaz, yalnızca test verisi olarak vardır.
>   const manager = await prisma.user.create({
>     data: {
>       tenantId,
>       email: `${on}-manager@example.com`,
>       name: "Test Yönetici",
>       passwordHash: "test-giris-yapilamaz",
>       role: "manager",
>     },
>     select: { id: true },
>   });
>   const finance = await prisma.user.create({
>     data: {
>       tenantId,
>       email: `${on}-finance@example.com`,
>       name: "Test Finans",
>       passwordHash: "test-giris-yapilamaz",
>       role: "finance",
>     },
>     select: { id: true },
>   });
>
>   const abonelikliPlan = await prisma.plan.create({
>     data: { tenantId, name: "Test Abonelikli Plan", price: PLAN_FIYATI, interval: "MONTHLY" },
>     select: { id: true },
>   });
>   const bosPlan = await prisma.plan.create({
>     data: { tenantId, name: "Test Boş Plan", price: PLAN_FIYATI, interval: "YEARLY" },
>     select: { id: true },
>   });
>
>   const abonelikliMusteri = await prisma.customer.create({
>     data: { tenantId, name: "Test Abonelikli Müşteri", email: `${on}-musteri1@example.com` },
>     select: { id: true },
>   });
>   const bosMusteri = await prisma.customer.create({
>     data: { tenantId, name: "Test Boş Müşteri", email: `${on}-musteri2@example.com` },
>     select: { id: true },
>   });
>
>   // Aktif abonelik ve "başladı" olayı (uygulamadaki gibi ikisi birlikte).
>   const abonelik = await prisma.subscription.create({
>     data: {
>       tenantId,
>       customerId: abonelikliMusteri.id,
>       planId: abonelikliPlan.id,
>       status: "ACTIVE",
>       currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
>     },
>     select: { id: true },
>   });
>   await prisma.subscriptionEvent.create({
>     data: { tenantId, subscriptionId: abonelik.id, type: "STARTED" },
>   });
>
>   return {
>     tenantId,
>     managerId: manager.id,
>     financeId: finance.id,
>     abonelikliPlanId: abonelikliPlan.id,
>     bosPlanId: bosPlan.id,
>     abonelikliMusteriId: abonelikliMusteri.id,
>     bosMusteriId: bosMusteri.id,
>     abonelikId: abonelik.id,
>   };
> }
>
> // Bu çalışmada oluşturulan firmaları ve içlerindeki her şeyi siler.
> export async function testVerisiniTemizle(): Promise<void> {
>   if (olusturulanFirmaIdleri.length === 0) return;
>
>   // 2. güvence: yalnızca kimliği listede OLAN ve adı bu çalışmanın etiketiyle başlayan firmalar.
>   const firmalar = await prisma.tenant.findMany({
>     where: { id: { in: olusturulanFirmaIdleri }, name: { startsWith: CALISMA } },
>     select: { id: true },
>   });
>   const idler = firmalar.map((f) => f.id);
>   if (idler.length === 0) return;
>
>   // Silme sırası, tablolar arasındaki bağlara göredir: önce olaylar, en son firmalar.
>   const kosul = { tenantId: { in: idler } };
>   await prisma.subscriptionEvent.deleteMany({ where: kosul });
>   await prisma.subscription.deleteMany({ where: kosul });
>   await prisma.customer.deleteMany({ where: kosul });
>   await prisma.plan.deleteMany({ where: kosul });
>   await prisma.user.deleteMany({ where: kosul });
>   await prisma.tenant.deleteMany({ where: { id: { in: idler } } });
>
>   // 3. güvence: gerçekten silindi mi?
>   const kalan = await prisma.tenant.count({ where: { id: { in: idler } } });
>   if (kalan > 0) {
>     throw new Error(`Temizlik tamamlanamadı: ${kalan} test firması kaldı (${CALISMA}).`);
>   }
>   olusturulanFirmaIdleri.length = 0;
> }
>
> // Veritabanı bağlantısını kapatır. Kapatılmazsa Node test bitince beklemede kalır.
> export async function baglantiyiKapat(): Promise<void> {
>   await prisma.$disconnect();
> }
> ```
>
> ### 2) `src/lib/tenant.test.ts`: **yeni dosya oluştur**
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
>   test("A, B'nin firma ayarını (CAC) değiştiremez", async () => {
>     // Not: filtre "where" içindeki kimliği oturumdaki firmayla değiştirir.
>     // Bu yüzden bu istek B'ye değil A'nın kendi kaydına uygulanır. Önemli olan B'nin değişmemesi.
>     await dbA.tenant.update({ where: { id: B.tenantId }, data: { cac: 999 } });
>     const b = await dbB.tenant.findFirst({ select: { cac: true } });
>     assert.equal(b?.cac, 0);
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
>   // OLASI AÇIK (plan, 11. test): Filtre "data.tenantId" alanını engelliyor, ama
>   // ilişki üzerinden bağlamayı ("tenant: { connect }") engellemiyor olabilir.
>   // Uygulamadaki işlemler bu yazımı kullanmıyor, bu yüzden bugün bir saldırı yolu değil.
>   // Test, OLMASI GEREKEN davranışı kontrol eder: kayıt A'da kalmalı.
>   // Hata verirse açık var demektir. Bu test bilerek dosyanın en sonundadır.
>   test("OLASI AÇIK: kayıt ilişki üzerinden (tenant: connect) başka firmaya taşınamamalı", async () => {
>     try {
>       await dbA.customer.update({
>         where: { id: A.bosMusteriId },
>         data: { tenant: { connect: { id: B.tenantId } } },
>       });
>     } catch {
>       // İşlemin hata vermesi de kabul edilir: amaç kaydın taşınmaması.
>     }
>     const adaKaldi = await dbA.customer.findFirst({ where: { id: A.bosMusteriId } });
>     const bye = await dbB.customer.findFirst({ where: { id: A.bosMusteriId } });
>     assert.notEqual(adaKaldi, null, "A'nın müşterisi A'da görünmüyor: kayıt taşınmış olabilir.");
>     assert.equal(bye, null, "A'nın müşterisi B'de görünüyor: kayıt başka firmaya taşındı.");
>   });
> });
> ```
>
> ### 3) `src/lib/pasife-alma.test.ts`: **yeni dosya oluştur**
>
> ```ts
> // ROL TESTLERİ: PASİFE ALMA (Gün 6)
> //
> // Ne test edilir? src/lib/pasife-alma.ts içindeki çekirdek fonksiyonlar.
> // Bugün kodda var olan rol kısıtlı işlemler yalnızca bunlardır:
> //   - müşteri pasife alma (yalnızca manager)
> //   - plan pasife alma    (yalnızca manager)
> // Testler, sunucu işlemlerinin (actions.ts) çağırdığı fonksiyonun aynısını çağırır.
> // Tek fark: kullanıcı ve veritabanı nesnesi oturumdan değil, testten verilir.
> //
> // Sıra önemlidir: kaydı GERÇEKTEN pasife alan testler en sondadır.
> // Çalıştırmak için: npm run test:db
>
> import { describe, test, before, after } from "node:test";
> import assert from "node:assert/strict";
> // Önce test verisi yardımcısı: TEST_VERITABANI kontrolü onun içinde yapılır.
> import {
>   testFirmasiOlustur,
>   testVerisiniTemizle,
>   baglantiyiKapat,
>   type TestFirmasi,
> } from "../test-destek/veri.ts";
> import { tenantaBagliDb, type TenantDb } from "./tenant.ts";
> import { musteriPasifeAlCekirdek, planPasifeAlCekirdek } from "./pasife-alma.ts";
> import { MESAJ } from "./islem.ts";
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
> // Kısa yardımcılar: kayıt hâlâ aktif mi?
> async function musteriAktifMi(db: TenantDb, id: string): Promise<boolean | undefined> {
>   return (await db.customer.findFirst({ where: { id }, select: { isActive: true } }))?.isActive;
> }
> async function planAktifMi(db: TenantDb, id: string): Promise<boolean | undefined> {
>   return (await db.plan.findFirst({ where: { id }, select: { isActive: true } }))?.isActive;
> }
>
> describe("finance kullanıcısı", () => {
>   test("müşteriyi pasife alamaz, kayıt değişmez", async () => {
>     const sonuc = await musteriPasifeAlCekirdek({ role: "finance" }, dbA, A.bosMusteriId);
>     assert.equal(sonuc.durum, "hata");
>     assert.equal(sonuc.mesaj, MESAJ.yetkiYok);
>     assert.equal(await musteriAktifMi(dbA, A.bosMusteriId), true);
>   });
>
>   test("planı pasife alamaz, kayıt değişmez", async () => {
>     const sonuc = await planPasifeAlCekirdek({ role: "finance" }, dbA, A.bosPlanId);
>     assert.equal(sonuc.durum, "hata");
>     assert.equal(sonuc.mesaj, MESAJ.yetkiYok);
>     assert.equal(await planAktifMi(dbA, A.bosPlanId), true);
>   });
> });
>
> describe("manager kullanıcısı: engellenen durumlar", () => {
>   test("B'nin müşterisi için 'Kayıt bulunamadı.' alır, B'nin kaydı değişmez", async () => {
>     const sonuc = await musteriPasifeAlCekirdek({ role: "manager" }, dbA, B.bosMusteriId);
>     assert.equal(sonuc.mesaj, MESAJ.bulunamadi);
>     assert.equal(await musteriAktifMi(dbB, B.bosMusteriId), true);
>   });
>
>   test("B'nin planı için 'Kayıt bulunamadı.' alır, B'nin kaydı değişmez", async () => {
>     const sonuc = await planPasifeAlCekirdek({ role: "manager" }, dbA, B.bosPlanId);
>     assert.equal(sonuc.mesaj, MESAJ.bulunamadi);
>     assert.equal(await planAktifMi(dbB, B.bosPlanId), true);
>   });
>
>   test("biçimi bozuk kimlik için 'Kayıt bulunamadı.' alır", async () => {
>     const sonuc = await musteriPasifeAlCekirdek({ role: "manager" }, dbA, "BOZUK-KIMLIK!");
>     assert.equal(sonuc.mesaj, MESAJ.bulunamadi);
>   });
>
>   test("aktif aboneliği olan müşteri pasife alınamaz (Gün 5 kuralı)", async () => {
>     const sonuc = await musteriPasifeAlCekirdek({ role: "manager" }, dbA, A.abonelikliMusteriId);
>     assert.equal(sonuc.durum, "hata");
>     assert.match(sonuc.mesaj ?? "", /aktif aboneliği var/);
>     assert.equal(await musteriAktifMi(dbA, A.abonelikliMusteriId), true);
>   });
>
>   test("aktif aboneliği olan plan pasife alınamaz (Gün 5 kuralı)", async () => {
>     const sonuc = await planPasifeAlCekirdek({ role: "manager" }, dbA, A.abonelikliPlanId);
>     assert.equal(sonuc.durum, "hata");
>     assert.match(sonuc.mesaj ?? "", /aktif abonelikleri var/);
>     assert.equal(await planAktifMi(dbA, A.abonelikliPlanId), true);
>   });
> });
>
> describe("manager kullanıcısı: başarılı pasife alma", () => {
>   test("aboneliği olmayan müşteriyi pasife alır, ikinci denemede 'zaten pasif' der", async () => {
>     const ilk = await musteriPasifeAlCekirdek({ role: "manager" }, dbA, A.bosMusteriId);
>     assert.equal(ilk.durum, "basarili");
>     assert.equal(ilk.mesaj, "Müşteri pasife alındı.");
>     assert.equal(await musteriAktifMi(dbA, A.bosMusteriId), false);
>
>     const ikinci = await musteriPasifeAlCekirdek({ role: "manager" }, dbA, A.bosMusteriId);
>     assert.equal(ikinci.mesaj, "Bu müşteri zaten pasif.");
>   });
>
>   test("aboneliği olmayan planı pasife alır, ikinci denemede 'zaten pasif' der", async () => {
>     const ilk = await planPasifeAlCekirdek({ role: "manager" }, dbA, A.bosPlanId);
>     assert.equal(ilk.durum, "basarili");
>     assert.equal(ilk.mesaj, "Plan pasife alındı.");
>     assert.equal(await planAktifMi(dbA, A.bosPlanId), false);
>
>     const ikinci = await planPasifeAlCekirdek({ role: "manager" }, dbA, A.bosPlanId);
>     assert.equal(ikinci.mesaj, "Bu plan zaten pasif.");
>   });
> });
> ```
>
> ### 4) `src/lib/yetki.test.ts`: **yeni dosya oluştur**
>
> ```ts
> // ROL KURALI BİRİM TESTİ (Gün 6)
> // Veritabanı gerekmez. Çalıştırmak için: npm test
>
> import { test } from "node:test";
> import assert from "node:assert/strict";
> import { yoneticiMi } from "./yetki.ts";
>
> test("manager yöneticidir", () => {
>   assert.equal(yoneticiMi("manager"), true);
> });
>
> test("finance yönetici değildir", () => {
>   assert.equal(yoneticiMi("finance"), false);
> });
> ```
>
> ### 5) `src/lib/session.test.ts`: **yeni dosya oluştur**
>
> ```ts
> // OTURUM BELİRTECİ BİRİM TESTİ (Gün 6)
> //
> // Ne test edilir? Çerezdeki imzalı belirtecin değiştirilemediği.
> // Kullanıcının firması (tenantId) ve rolü çerezde değil veritabanında durur
> // (bkz. auth.ts). Bu yüzden başka firmaya geçmenin tek yolu çerezdeki
> // kullanıcı kimliğini değiştirmek olurdu. Bu testler bunun işe yaramadığını gösterir.
> //
> // Veritabanı gerekmez. Çalıştırmak için: npm test
>
> import { test } from "node:test";
> import assert from "node:assert/strict";
> import { oturumBelirteciOlustur, oturumBelirteciniCoz } from "./session.ts";
>
> // Yalnızca bu test için geçici bir anahtar. Gerçek SESSION_SECRET değildir.
> // session.ts anahtarı her imzada yeniden okuduğu için burada atamak yeterlidir.
> const TEST_ANAHTARI = "yalnizca-birim-testi-icin-anahtar-0123456789";
> process.env.SESSION_SECRET = TEST_ANAHTARI;
>
> const SIMDI = Date.UTC(2026, 9, 22, 12, 0, 0);
> const GUN = 24 * 60 * 60 * 1000;
>
> test("geçerli belirteç kullanıcı kimliğini verir", () => {
>   const belirtec = oturumBelirteciOlustur("kullanici1", SIMDI);
>   assert.equal(oturumBelirteciniCoz(belirtec, SIMDI + GUN), "kullanici1");
> });
>
> test("7 gün sonra süresi dolar", () => {
>   const belirtec = oturumBelirteciOlustur("kullanici1", SIMDI);
>   assert.equal(oturumBelirteciniCoz(belirtec, SIMDI + 8 * GUN), null);
> });
>
> test("içindeki kullanıcı kimliği değiştirilen belirteç geçersizdir", () => {
>   const belirtec = oturumBelirteciOlustur("kullanici1", SIMDI);
>   const [veri, imza] = belirtec.split(".");
>   const yuk = JSON.parse(Buffer.from(veri, "base64url").toString("utf8"));
>   yuk.u = "baskaKullanici"; // saldırgan başka kullanıcının kimliğini yazıyor
>   const sahteVeri = Buffer.from(JSON.stringify(yuk)).toString("base64url");
>   assert.equal(oturumBelirteciniCoz(`${sahteVeri}.${imza}`, SIMDI), null);
> });
>
> test("imzası değiştirilen belirteç geçersizdir", () => {
>   const belirtec = oturumBelirteciOlustur("kullanici1", SIMDI);
>   const [veri, imza] = belirtec.split(".");
>   const ilkHarf = imza[0] === "A" ? "B" : "A";
>   assert.equal(oturumBelirteciniCoz(`${veri}.${ilkHarf}${imza.slice(1)}`, SIMDI), null);
> });
>
> test("başka bir anahtarla imzalanmış belirteç geçersizdir", () => {
>   process.env.SESSION_SECRET = "baska-bir-anahtar-0123456789abcdef";
>   const yabanci = oturumBelirteciOlustur("kullanici1", SIMDI);
>   process.env.SESSION_SECRET = TEST_ANAHTARI;
>   assert.equal(oturumBelirteciniCoz(yabanci, SIMDI), null);
> });
>
> test("biçimi bozuk belirteçler geçersizdir", () => {
>   for (const bozuk of ["", "abc", "a.b.c", ".", "x."]) {
>     assert.equal(oturumBelirteciniCoz(bozuk, SIMDI), null, `Kabul edilmemeliydi: "${bozuk}"`);
>   }
> });
> ```
>
> ### 6) `src/test-destek/kurallar.test.ts`: **yeni dosya oluştur**
>
> ```ts
> // STATİK KURAL TESTİ (Gün 6)
> //
> // Veritabanına bağlanmaz. src/ altındaki dosyaları okuyup iki kuralı kontrol eder:
> //   1. Ham "prisma" nesnesi (src/lib/db.ts) yalnızca izin verilen dosyalarda
> //      içe aktarılır. Diğer her yer tenant filtresinden geçen getTenantDb()
> //      kullanmak zorundadır.
> //   2. Ham SQL ($queryRaw, $executeRaw) hiçbir yerde kullanılmaz, çünkü
> //      ham SQL tenant filtresinden geçmez.
> // Bu test, "bütün sorgular filtreden geçer" varsayımının güvencesidir.
> // Yeni bir dosya kuralı bozarsa test hangi dosya olduğunu söyler.
> //
> // Çalıştırmak için: npm test
>
> import { test } from "node:test";
> import assert from "node:assert/strict";
> import { readdirSync, readFileSync } from "node:fs";
> import path from "node:path";
> import { fileURLToPath } from "node:url";
>
> const BU_DOSYA = fileURLToPath(import.meta.url);
> const SRC = path.resolve(path.dirname(BU_DOSYA), "..");
>
> // Ham prisma nesnesini içe aktarmasına izin verilen dosyalar (src/ içindeki yollar).
> const HAM_PRISMA_IZINLI = new Set([
>   "lib/db.ts", // nesnenin kendisi
>   "lib/auth.ts", // kayıt ve giriş: kiracı henüz belli değil
>   "lib/tenant.ts", // filtrenin kendisi
>   "test-destek/veri.ts", // test verisi oluşturma ve silme (Gün 6 onayı)
> ]);
>
> // src/ altındaki bütün kod dosyalarını toplar.
> function dosyalariTopla(klasor: string): string[] {
>   const sonuc: string[] = [];
>   for (const oge of readdirSync(klasor, { withFileTypes: true })) {
>     const tamYol = path.join(klasor, oge.name);
>     if (oge.isDirectory()) {
>       sonuc.push(...dosyalariTopla(tamYol));
>     } else if (/\.(ts|tsx|js|mjs)$/.test(oge.name)) {
>       sonuc.push(tamYol);
>     }
>   }
>   return sonuc;
> }
>
> // "src/lib/db.ts" yerine "lib/db.ts" gibi kısa ve her işletim sisteminde aynı yazım.
> function kisaYol(dosya: string): string {
>   return path.relative(SRC, dosya).split(path.sep).join("/");
> }
>
> // Yorum satırları atlanır: yorumda "YASAK: $queryRaw" yazması ihlal değildir.
> function kodSatirlari(dosya: string): string[] {
>   return readFileSync(dosya, "utf8")
>     .split("\n")
>     .filter((satir) => {
>       const t = satir.trim();
>       return !t.startsWith("//") && !t.startsWith("*") && !t.startsWith("/*");
>     });
> }
>
> // Bu test dosyasının kendisi taranmaz (içinde aranan kelimeler geçiyor).
> const DOSYALAR = dosyalariTopla(SRC).filter((d) => d !== BU_DOSYA);
>
> test("tarama gerçekten dosya buluyor (kendini kontrol)", () => {
>   const kisalar = DOSYALAR.map(kisaYol);
>   assert.ok(kisalar.includes("lib/tenant.ts"), "src/lib/tenant.ts bulunamadı: tarama yolu yanlış.");
>   assert.ok(kisalar.includes("app/(panel)/musteriler/actions.ts"));
> });
>
> test("ham prisma (db.ts) yalnızca izin verilen dosyalarda içe aktarılır", () => {
>   // Yakalar: from "./db", from "../lib/db.ts", from "@/lib/db", import("../lib/db.ts")
>   const desen = /(?:from\s+|import\s*\(\s*)["'][^"']*\/db(?:\.ts)?["']/;
>   const ihlaller = DOSYALAR.filter(
>     (d) => !HAM_PRISMA_IZINLI.has(kisaYol(d)) && kodSatirlari(d).some((s) => desen.test(s))
>   ).map(kisaYol);
>   assert.deepEqual(ihlaller, [], `Ham prisma şu dosyalarda kullanılıyor: ${ihlaller.join(", ")}`);
> });
>
> test("yeni bir Prisma istemcisi yalnızca db.ts içinde oluşturulur", () => {
>   const ihlaller = DOSYALAR.filter(
>     (d) => kisaYol(d) !== "lib/db.ts" && kodSatirlari(d).some((s) => /new\s+PrismaClient\b/.test(s))
>   ).map(kisaYol);
>   assert.deepEqual(ihlaller, [], `PrismaClient şu dosyalarda oluşturuluyor: ${ihlaller.join(", ")}`);
> });
>
> test("ham SQL ($queryRaw, $executeRaw) hiçbir yerde kullanılmaz", () => {
>   const desen = new RegExp("\\$(?:query|execute)Raw");
>   const ihlaller = DOSYALAR.filter((d) => kodSatirlari(d).some((s) => desen.test(s))).map(kisaYol);
>   assert.deepEqual(ihlaller, [], `Ham SQL şu dosyalarda kullanılıyor: ${ihlaller.join(", ")}`);
> });
> ```
>
> ### 7) `package.json`: **dosyanın içeriğini tamamen şununla değiştir**
>
> Yalnızca `scripts` bölümüne iki satır eklendi. Bağımlılıklar aynı.
>
> ```json
> {
>   "name": "abonetakip",
>   "version": "0.1.0",
>   "private": true,
>   "scripts": {
>     "dev": "next dev",
>     "build": "next build",
>     "start": "next start",
>     "lint": "eslint",
>     "test": "node --import ./src/test-destek/kancalar.mjs --test src/lib/donem.test.ts src/lib/yetki.test.ts src/lib/session.test.ts src/test-destek/kurallar.test.ts",
>     "test:db": "node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test --test-concurrency=1 src/test-destek/duman.test.ts src/lib/tenant.test.ts src/lib/pasife-alma.test.ts"
>   },
>   "dependencies": {
>     "@prisma/adapter-pg": "^7.10.1",
>     "@prisma/client": "^7.10.1",
>     "bcryptjs": "^3.0.3",
>     "next": "16.4.2",
>     "react": "19.3.0",
>     "react-dom": "19.3.0"
>   },
>   "devDependencies": {
>     "@tailwindcss/turbopack": "^4",
>     "@types/node": "^20",
>     "@types/react": "^19",
>     "@types/react-dom": "^19",
>     "dotenv": "^18.0.8",
>     "eslint": "^9",
>     "eslint-config-next": "16.4.2",
>     "prisma": "^7.10.1",
>     "tailwindcss": "^4",
>     "typescript": "^5"
>   }
> }
> ```
>
> ---
>
> ## Çalıştır
>
> ```zsh
> npm test
> ```
> Bu komut veritabanı gerektirmeyen testleri çalıştırır: dönem hesabı, rol kuralı, oturum belirteci ve statik kurallar. `.env.test` kullanmaz.
>
> ```zsh
> npm run test:db
> ```
> Bu komut `.env.test` ile Neon test dalında duman testini, kiracı izolasyonu testlerini ve rol testlerini **sırayla** çalıştırır. Ağ üzerinden çok sayıda sorgu yaptığı için 10–30 saniye sürebilir.
>
> ```zsh
> npm run lint
> ```
> Bu komut yeni dosyalarda stil hatası olup olmadığını kontrol eder.
>
> ```zsh
> npm run build
> ```
> Bu komut test dosyalarının da tip kontrolünden geçtiğini doğrular. Next.js bütün `.ts` dosyalarını kontrol ediyor.
>
> ## Çıktıyı nasıl okuyacaksın?
> - `✔` ile başlayan satır testin geçtiği anlamına gelir. `✖` ile başlayan satır başarısız olduğu anlamına gelir.
> - `describe` grupları (örneğin "Müşteriler", "finance kullanıcısı") içerideki testlerin üst başlığıdır.
> - Sondaki `ℹ pass` geçen, `ℹ fail` başarısız test sayısıdır.
> - Başarısız bir test, altında hangi beklentinin tutmadığını yazar. Örneğin "A'nın müşterisi B'de görünüyor..." gibi, testte yazdığım Türkçe mesajı gösterir.
> - `MODULE_TYPELESS_PACKAGE_JSON` ve `SSL modes` uyarıları önceki gibi zararsız.
>
> **Beklentim:**
> - `npm test`: hepsi geçmeli.
> - `npm run test:db`: son test olan "OLASI AÇIK" dışında hepsi geçmeli. O testin sonucunu bilmiyorum, kod okumama göre başarısız olabilir.
>
> Başarısız olursa senin kuralına göre kendim karar vermeyeceğim. Ne bulduğunu açıklayıp `tenant.ts` içinde küçük bir koruma gerekip gerekmediğini sana soracağım.
>
> ## Bana yaz
> 1. `npm test` sonucu: pass ve fail sayıları.
> 2. `npm run test:db` sonucu: pass ve fail sayıları, ve `✖` olan her testin adı ile altındaki ilk 3–4 satır. Bir satırda `postgresql://` geçerse sil.
> 3. `npm run lint` ve `npm run build` sonucu.
>
> **Commit yapma:** 11. testin sonucuna göre ne commit edeceğimize birlikte karar vereceğiz.
>
> ## Varsayımlar ve emin olmadığım yerler
> - Prisma'nın tenant uzantısının `$transaction` içindeki `tx` sorgularına da uygulandığını varsayıyorum. "işlem içinde" testi bunu doğrulayacak. Başarısız olursa bu, 11. testten daha önemli bir bulgu olur.
> - "A, B'nin CAC ayarını değiştiremez" testinde istek A'nın kendi kaydına uygulanıyor. Bu bir sızıntı değil, ama sessiz bir yönlendirme. Sonuçlarla birlikte not edeceğim.
> - `findUnique` sorgusuna tenant filtresinin `where` ile eklenmesinin Prisma 7'de hatasız çalıştığını varsayıyorum. Hata verirse test bunu gösterecek.
> - Bir test beklenmedik biçimde başarısız olursa (örneğin firma ekleme reddedilmezse) adı `test-...-sizinti` olan bir kayıt test dalında kalabilir. Böyle bir durumda temizliği birlikte yaparız.

### Prompt 26 · 22 Eki 2026 15:38

````text
Adım 3 tamam, commit'ler main'e push edilmiş durumda. Gizli bilgi taramasını yaptım, temiz. Bundan sonrası için kural: main'e doğrudan push yok. Commit'leri hazırla, push'u ben GitHub Desktop ile yapıp PR açacağım. Şu an gun6-yetki-ve-test-altyapisi dalındayım.

Şimdi §8'in 4. adımına geçelim: test dosyaları (A izolasyon, B statik kural, C rol, D oturum belirteci) ve package.json'a test ve test:db betikleri. Küçük parçalar hâlinde, her dosyayı ve her komutu ayrı ver. Her parçadan sonra çalıştırıp çıktıyı sana yazacağım.

Hatırlatma: bir önceki planında dashboard/SSE testleri ve ayarlar/kullanıcılar işlemleri "sonra eklenecek" listesindeydi, onlara dokunma. 11. testin sonucunu görünce bana sor.
````

### Claude cevabı 26 · 22 Eki 2026 15:39

> Anlaşıldı: main'e push yok. Ben commit komutlarını hazırlayacağım, push'u ve PR'ı sen GitHub Desktop ile yapacaksın. Dashboard, SSE, ayarlar ve kullanıcılar işlemlerine dokunmuyorum. 11. testin sonucunu görünce sana soracağım.
>
> **Parçaların sırası** (her biri ayrı mesajda gelecek):
>
> | Parça | Ne | Veritabanı |
> |---|---|---|
> | 1 | `yetki.test.ts`: rol kuralı | Yok |
> | 2 | `session.test.ts`: oturum belirteci (D) | Yok |
> | 3 | `kurallar.test.ts`: statik kural (B) | Yok |
> | 4 | `package.json` → `test` betiği, `npm test`, commit | Yok |
> | 5 | `veri.ts`: test verisi yardımcısı | Test dalı |
> | 6 | `tenant.test.ts`: izolasyon (A), 11. test dahil | Test dalı |
> | 7 | `pasife-alma.test.ts`: rol testleri (C) | Test dalı |
> | 8 | `package.json` → `test:db` betiği, lint, build, commit | Test dalı |
>
> Önceki mesajımda bu dosyaların hepsini tek seferde vermiştim. Onları zaten oluşturduysan içerikleri aynı kalıyor, yeniden oluşturmana gerek yok. Sadece her parçadaki çalıştırma komutunu uygula.
>
> ---
>
> ## Parça 0: Başlangıç kontrolü
>
> ```zsh
> git branch --show-current
> ```
> Bu komut şu an hangi dalda olduğunu gösterir. **Beklenen:** `gun6-yetki-ve-test-altyapisi`.
>
> ```zsh
> git status --short
> ```
> Bu komut kaydedilmemiş değişiklikleri listeler. **Beklenen:** boş çıktı. Önceki mesajdaki dosyaları oluşturduysan `??` ile başlayan satırlar görünür, bu da sorun değil.
>
> ## Parça 1: `src/lib/yetki.test.ts`
>
> **Yeni dosya oluştur:** `src/lib/yetki.test.ts`
>
> ```ts
> // ROL KURALI BİRİM TESTİ (Gün 6)
> // Veritabanı gerekmez. Çalıştırmak için: npm test
>
> import { test } from "node:test";
> import assert from "node:assert/strict";
> import { yoneticiMi } from "./yetki.ts";
>
> test("manager yöneticidir", () => {
>   assert.equal(yoneticiMi("manager"), true);
> });
>
> test("finance yönetici değildir", () => {
>   assert.equal(yoneticiMi("finance"), false);
> });
> ```
>
> **Çalıştır:**
>
> ```zsh
> node --import ./src/test-destek/kancalar.mjs --test src/lib/yetki.test.ts
> ```
> Bu komut yalnızca rol kuralı testini çalıştırır. Veritabanı ve `.env.test` kullanmaz.
>
> **Beklenen:** `ℹ pass 2`, `ℹ fail 0`. `MODULE_TYPELESS_PACKAGE_JSON` uyarısı önceki gibi zararsız.
>
> Bana yaz: Parça 0'daki iki komutun çıktısı ve Parça 1'in pass ve fail sayıları. Sonra Parça 2'yi vereceğim.

### Prompt 27 · 22 Eki 2026 15:39

````text
adım 4 te verdiğin kod işlemlerini yapayım mı
````

### Claude cevabı 27 · 22 Eki 2026 15:39

> Hayır, hepsini birden oluşturma. Senin istediğin gibi parça parça ilerleyelim. Bir sorun çıkarsa hangi dosyadan kaynaklandığı böylece hemen anlaşılır.
>
> Şimdi yalnızca şunları yap:
>
> 1. **Parça 0:** `git branch --show-current` ve `git status --short` komutlarını çalıştır.
> 2. **Parça 1:** Yalnızca `src/lib/yetki.test.ts` dosyasını oluştur (son mesajımdaki içerik) ve çalıştırma komutunu uygula.
>
> Çıktıları bana yaz, sonra Parça 2'yi (`session.test.ts`) vereceğim. Adım 4 mesajındaki diğer dosyaları (`veri.ts`, `tenant.test.ts` ve diğerleri) sırası gelince tek tek vereceğim. İçerikleri o mesajdakiyle aynı olacak.
>
> **Önceki mesajdaki dosyalardan bazılarını zaten oluşturduysan** söyle, hangileri olduğunu yaz. O dosyaları silmene gerek yok, sırası geldiğinde yalnızca test komutlarını çalıştırırız.

### Prompt 28 · 22 Eki 2026 15:41

````text
kullanici@bilgisayar abonetakip % node --import ./src/test-destek/kancalar.mjs --test src/lib/yetki.test.ts
(node:67328) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/yetki.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ manager yöneticidir (0.262584ms)
✔ finance yönetici değildir (0.043833ms)
ℹ tests 2
ℹ suites 0
ℹ pass 2
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 123.076292
````

### Claude cevabı 28 · 22 Eki 2026 15:41

> Parça 1 geçti: **2 geçti, 0 başarısız**. Parça 0'ın çıktısını (dal adı ve `git status`) yazmadın. Bir sonraki mesajında onu da ekle, commit'e geçmeden önce doğru dalda olduğumuzdan emin olmak istiyorum.
>
> ## Parça 2: `src/lib/session.test.ts` (D, oturum belirteci)
>
> **Ne test eder?** Çerezdeki imzalı belirtecin değiştirilemediğini. Kullanıcının firması ve rolü çerezde değil veritabanında tutuluyor. Başka firmaya geçmenin tek yolu çerezdeki kullanıcı kimliğini değiştirmek olurdu, bu testler bunun işe yaramadığını gösterir. Mevcut `session.ts` dosyasına dokunulmaz.
>
> **Yeni dosya oluştur:** `src/lib/session.test.ts`
>
> ```ts
> // OTURUM BELİRTECİ BİRİM TESTİ (Gün 6)
> //
> // Ne test edilir? Çerezdeki imzalı belirtecin değiştirilemediği.
> // Kullanıcının firması (tenantId) ve rolü çerezde değil veritabanında durur
> // (bkz. auth.ts). Bu yüzden başka firmaya geçmenin tek yolu çerezdeki
> // kullanıcı kimliğini değiştirmek olurdu. Bu testler bunun işe yaramadığını gösterir.
> //
> // Veritabanı gerekmez. Çalıştırmak için: npm test
>
> import { test } from "node:test";
> import assert from "node:assert/strict";
> import { oturumBelirteciOlustur, oturumBelirteciniCoz } from "./session.ts";
>
> // Yalnızca bu test için geçici bir anahtar. Gerçek SESSION_SECRET değildir.
> // session.ts anahtarı her imzada yeniden okuduğu için burada atamak yeterlidir.
> const TEST_ANAHTARI = "yalnizca-birim-testi-icin-anahtar-0123456789";
> process.env.SESSION_SECRET = TEST_ANAHTARI;
>
> const SIMDI = Date.UTC(2026, 9, 22, 12, 0, 0);
> const GUN = 24 * 60 * 60 * 1000;
>
> test("geçerli belirteç kullanıcı kimliğini verir", () => {
>   const belirtec = oturumBelirteciOlustur("kullanici1", SIMDI);
>   assert.equal(oturumBelirteciniCoz(belirtec, SIMDI + GUN), "kullanici1");
> });
>
> test("7 gün sonra süresi dolar", () => {
>   const belirtec = oturumBelirteciOlustur("kullanici1", SIMDI);
>   assert.equal(oturumBelirteciniCoz(belirtec, SIMDI + 8 * GUN), null);
> });
>
> test("içindeki kullanıcı kimliği değiştirilen belirteç geçersizdir", () => {
>   const belirtec = oturumBelirteciOlustur("kullanici1", SIMDI);
>   const [veri, imza] = belirtec.split(".");
>   const yuk = JSON.parse(Buffer.from(veri, "base64url").toString("utf8"));
>   yuk.u = "baskaKullanici"; // saldırgan başka kullanıcının kimliğini yazıyor
>   const sahteVeri = Buffer.from(JSON.stringify(yuk)).toString("base64url");
>   assert.equal(oturumBelirteciniCoz(`${sahteVeri}.${imza}`, SIMDI), null);
> });
>
> test("imzası değiştirilen belirteç geçersizdir", () => {
>   const belirtec = oturumBelirteciOlustur("kullanici1", SIMDI);
>   const [veri, imza] = belirtec.split(".");
>   const ilkHarf = imza[0] === "A" ? "B" : "A";
>   assert.equal(oturumBelirteciniCoz(`${veri}.${ilkHarf}${imza.slice(1)}`, SIMDI), null);
> });
>
> test("başka bir anahtarla imzalanmış belirteç geçersizdir", () => {
>   process.env.SESSION_SECRET = "baska-bir-anahtar-0123456789abcdef";
>   const yabanci = oturumBelirteciOlustur("kullanici1", SIMDI);
>   process.env.SESSION_SECRET = TEST_ANAHTARI;
>   assert.equal(oturumBelirteciniCoz(yabanci, SIMDI), null);
> });
>
> test("biçimi bozuk belirteçler geçersizdir", () => {
>   for (const bozuk of ["", "abc", "a.b.c", ".", "x."]) {
>     assert.equal(oturumBelirteciniCoz(bozuk, SIMDI), null, `Kabul edilmemeliydi: "${bozuk}"`);
>   }
> });
> ```
>
> **Çalıştır:**
>
> ```zsh
> node --import ./src/test-destek/kancalar.mjs --test src/lib/session.test.ts
> ```
> Bu komut yalnızca oturum belirteci testlerini çalıştırır. Veritabanı ve `.env.test` kullanmaz. Test kendi geçici anahtarını kullanır.
>
> **Beklenen:** `ℹ pass 6`, `ℹ fail 0`.
>
> Bana yaz: Parça 0 çıktısı ve Parça 2'nin pass ve fail sayıları. `✖` olan bir test varsa adını ve altındaki ilk 3–4 satırı da yaz.

### Prompt 29 · 22 Eki 2026 15:42

````text
kullanici@bilgisayar abonetakip % node --import ./src/test-destek/kancalar.mjs --test src/lib/session.test.ts
(node:67382) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/session.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ geçerli belirteç kullanıcı kimliğini verir (0.554666ms)
✔ 7 gün sonra süresi dolar (0.068583ms)
✔ içindeki kullanıcı kimliği değiştirilen belirteç geçersizdir (0.070666ms)
✔ imzası değiştirilen belirteç geçersizdir (0.05775ms)
✔ başka bir anahtarla imzalanmış belirteç geçersizdir (0.064ms)
✔ biçimi bozuk belirteçler geçersizdir (0.05775ms)
ℹ tests 6
ℹ suites 0
ℹ pass 6
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 149.662875   kullanici@bilgisayar abonetakip % git status -sb
## gun6-yetki-ve-test-altyapisi
kullanici@bilgisayar abonetakip % git branch --show-current
gun6-yetki-ve-test-altyapisi
````

### Claude cevabı 29 · 22 Eki 2026 15:43

> Parça 2 geçti: **6 geçti, 0 başarısız**. Dal da doğru: `gun6-yetki-ve-test-altyapisi`.
>
> ## Önce bir tutarsızlığı kontrol edelim
>
> `git status -sb` çıktısında yalnızca dal adı var, dosya listesi yok. Ama `yetki.test.ts` ve `session.test.ts` dosyalarını oluşturdun ve çalıştırdın, bu yüzden `?? src/lib/...` satırları görünmeliydi. İki olasılık var: komutu dosyaları oluşturmadan önce çalıştırmış olabilirsin, ya da bu dosyalar Git tarafından gizleniyor olabilir. Gizleniyorlarsa commit'e hiç girmezler.
>
> ```zsh
> git status --short --untracked-files=all
> ```
> Bu komut, takip edilmeyen yeni dosyalar dahil bütün değişiklikleri listeler. **Beklenen:** `?? src/lib/session.test.ts` ve `?? src/lib/yetki.test.ts`.
>
> ```zsh
> git check-ignore -v src/lib/yetki.test.ts src/lib/session.test.ts
> ```
> Bu komut, iki dosyadan biri `.gitignore` tarafından gizleniyorsa hangi kuralın gizlediğini gösterir. **Beklenen:** boş çıktı.
>
> ---
>
> ## Parça 3: `src/test-destek/kurallar.test.ts` (B, statik kural)
>
> **Ne test eder?** Veritabanına bağlanmaz. `src/` altındaki dosyaları okuyup iki kuralı kontrol eder:
> - Ham `prisma` nesnesi yalnızca izin verilen dosyalarda içe aktarılmış mı?
> - Ham SQL hiçbir yerde kullanılmamış mı?
>
> İzin listesinde `test-destek/veri.ts` de var. Bu dosya Parça 5'te gelecek, şu an olmaması testi etkilemez.
>
> **Yeni dosya oluştur:** `src/test-destek/kurallar.test.ts`
>
> ```ts
> // STATİK KURAL TESTİ (Gün 6)
> //
> // Veritabanına bağlanmaz. src/ altındaki dosyaları okuyup iki kuralı kontrol eder:
> //   1. Ham "prisma" nesnesi (src/lib/db.ts) yalnızca izin verilen dosyalarda
> //      içe aktarılır. Diğer her yer tenant filtresinden geçen getTenantDb()
> //      kullanmak zorundadır.
> //   2. Ham SQL ($queryRaw, $executeRaw) hiçbir yerde kullanılmaz, çünkü
> //      ham SQL tenant filtresinden geçmez.
> // Bu test, "bütün sorgular filtreden geçer" varsayımının güvencesidir.
> // Yeni bir dosya kuralı bozarsa test hangi dosya olduğunu söyler.
> //
> // Çalıştırmak için: npm test
>
> import { test } from "node:test";
> import assert from "node:assert/strict";
> import { readdirSync, readFileSync } from "node:fs";
> import path from "node:path";
> import { fileURLToPath } from "node:url";
>
> const BU_DOSYA = fileURLToPath(import.meta.url);
> const SRC = path.resolve(path.dirname(BU_DOSYA), "..");
>
> // Ham prisma nesnesini içe aktarmasına izin verilen dosyalar (src/ içindeki yollar).
> const HAM_PRISMA_IZINLI = new Set([
>   "lib/db.ts", // nesnenin kendisi
>   "lib/auth.ts", // kayıt ve giriş: kiracı henüz belli değil
>   "lib/tenant.ts", // filtrenin kendisi
>   "test-destek/veri.ts", // test verisi oluşturma ve silme (Gün 6 onayı)
> ]);
>
> // src/ altındaki bütün kod dosyalarını toplar.
> function dosyalariTopla(klasor: string): string[] {
>   const sonuc: string[] = [];
>   for (const oge of readdirSync(klasor, { withFileTypes: true })) {
>     const tamYol = path.join(klasor, oge.name);
>     if (oge.isDirectory()) {
>       sonuc.push(...dosyalariTopla(tamYol));
>     } else if (/\.(ts|tsx|js|mjs)$/.test(oge.name)) {
>       sonuc.push(tamYol);
>     }
>   }
>   return sonuc;
> }
>
> // "src/lib/db.ts" yerine "lib/db.ts" gibi kısa ve her işletim sisteminde aynı yazım.
> function kisaYol(dosya: string): string {
>   return path.relative(SRC, dosya).split(path.sep).join("/");
> }
>
> // Yorum satırları atlanır: yorumda "YASAK: $queryRaw" yazması ihlal değildir.
> function kodSatirlari(dosya: string): string[] {
>   return readFileSync(dosya, "utf8")
>     .split("\n")
>     .filter((satir) => {
>       const t = satir.trim();
>       return !t.startsWith("//") && !t.startsWith("*") && !t.startsWith("/*");
>     });
> }
>
> // Bu test dosyasının kendisi taranmaz (içinde aranan kelimeler geçiyor).
> const DOSYALAR = dosyalariTopla(SRC).filter((d) => d !== BU_DOSYA);
>
> test("tarama gerçekten dosya buluyor (kendini kontrol)", () => {
>   const kisalar = DOSYALAR.map(kisaYol);
>   assert.ok(kisalar.includes("lib/tenant.ts"), "src/lib/tenant.ts bulunamadı: tarama yolu yanlış.");
>   assert.ok(kisalar.includes("app/(panel)/musteriler/actions.ts"));
> });
>
> test("ham prisma (db.ts) yalnızca izin verilen dosyalarda içe aktarılır", () => {
>   // Yakalar: from "./db", from "../lib/db.ts", from "@/lib/db", import("../lib/db.ts")
>   const desen = /(?:from\s+|import\s*\(\s*)["'][^"']*\/db(?:\.ts)?["']/;
>   const ihlaller = DOSYALAR.filter(
>     (d) => !HAM_PRISMA_IZINLI.has(kisaYol(d)) && kodSatirlari(d).some((s) => desen.test(s))
>   ).map(kisaYol);
>   assert.deepEqual(ihlaller, [], `Ham prisma şu dosyalarda kullanılıyor: ${ihlaller.join(", ")}`);
> });
>
> test("yeni bir Prisma istemcisi yalnızca db.ts içinde oluşturulur", () => {
>   const ihlaller = DOSYALAR.filter(
>     (d) => kisaYol(d) !== "lib/db.ts" && kodSatirlari(d).some((s) => /new\s+PrismaClient\b/.test(s))
>   ).map(kisaYol);
>   assert.deepEqual(ihlaller, [], `PrismaClient şu dosyalarda oluşturuluyor: ${ihlaller.join(", ")}`);
> });
>
> test("ham SQL ($queryRaw, $executeRaw) hiçbir yerde kullanılmaz", () => {
>   const desen = new RegExp("\\$(?:query|execute)Raw");
>   const ihlaller = DOSYALAR.filter((d) => kodSatirlari(d).some((s) => desen.test(s))).map(kisaYol);
>   assert.deepEqual(ihlaller, [], `Ham SQL şu dosyalarda kullanılıyor: ${ihlaller.join(", ")}`);
> });
> ```
>
> **Çalıştır:**
>
> ```zsh
> node --import ./src/test-destek/kancalar.mjs --test src/test-destek/kurallar.test.ts
> ```
> Bu komut yalnızca statik kural testini çalıştırır. Dosyaları okur, veritabanına bağlanmaz.
>
> **Beklenen:** `ℹ pass 4`, `ℹ fail 0`.
>
> Bir test `✖` olursa altındaki mesaj, kuralı bozan dosyanın adını söyler (örneğin "Ham prisma şu dosyalarda kullanılıyor: ..."). O dosyanın adını bana yaz. Bu bir test hatası değil, gerçek bir bulgu olabilir, birlikte bakarız.
>
> ## Bana yaz
> 1. `git status --short --untracked-files=all` çıktısı.
> 2. `git check-ignore` çıktısı (boş mu?).
> 3. Parça 3'ün pass ve fail sayıları.

### Prompt 30 · 22 Eki 2026 15:45

````text
kullanici@bilgisayar abonetakip % git status --short --untracked-files=all
?? src/lib/session.test.ts
?? src/lib/yetki.test.ts
kullanici@bilgisayar abonetakip % git check-ignore -v src/lib/yetki.test.ts src/lib/session.test.ts
kullanici@bilgisayar abonetakip % node --import ./src/test-destek/kancalar.mjs --test src/test-destek/kurallar.test.ts
(node:67448) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/kurallar.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ tarama gerçekten dosya buluyor (kendini kontrol) (0.749625ms)
✔ ham prisma (db.ts) yalnızca izin verilen dosyalarda içe aktarılır (9.459042ms)
✔ yeni bir Prisma istemcisi yalnızca db.ts içinde oluşturulur (1.818333ms)
✔ ham SQL ($queryRaw, $executeRaw) hiçbir yerde kullanılmaz (1.347666ms)
ℹ tests 4
ℹ suites 0
ℹ pass 4
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 132.784667
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 30 · 22 Eki 2026 15:45

> Parça 3 geçti: **4 geçti, 0 başarısız**. Yani bugünkü kodda ham `prisma` yalnızca izinli üç dosyada kullanılıyor, ham SQL de hiçbir yerde yok. İki dosya Git'e görünüyor ve gizlenmiyor.
>
> ## Parça 4: `test` betiği, toplu çalıştırma ve commit
>
> ### `package.json`: **dosyanın içeriğini tamamen şununla değiştir**
>
> `scripts` bölümüne yalnızca `"test"` satırı eklendi. Bağımlılıklar aynı. `test:db` betiği Parça 8'de gelecek.
>
> ```json
> {
>   "name": "abonetakip",
>   "version": "0.1.0",
>   "private": true,
>   "scripts": {
>     "dev": "next dev",
>     "build": "next build",
>     "start": "next start",
>     "lint": "eslint",
>     "test": "node --import ./src/test-destek/kancalar.mjs --test src/lib/donem.test.ts src/lib/yetki.test.ts src/lib/session.test.ts src/test-destek/kurallar.test.ts"
>   },
>   "dependencies": {
>     "@prisma/adapter-pg": "^7.10.1",
>     "@prisma/client": "^7.10.1",
>     "bcryptjs": "^3.0.3",
>     "next": "16.4.2",
>     "react": "19.3.0",
>     "react-dom": "19.3.0"
>   },
>   "devDependencies": {
>     "@tailwindcss/turbopack": "^4",
>     "@types/node": "^20",
>     "@types/react": "^19",
>     "@types/react-dom": "^19",
>     "dotenv": "^18.0.8",
>     "eslint": "^9",
>     "eslint-config-next": "16.4.2",
>     "prisma": "^7.10.1",
>     "tailwindcss": "^4",
>     "typescript": "^5"
>   }
> }
> ```
>
> ### Çalıştır
>
> ```zsh
> npm test
> ```
> Bu komut veritabanı gerektirmeyen dört test dosyasını birlikte çalıştırır: dönem hesabı (Gün 5), rol kuralı, oturum belirteci ve statik kurallar. **Beklenen:** `ℹ pass 20`, `ℹ fail 0` (8 + 2 + 6 + 4).
>
> ```zsh
> npm run lint
> ```
> Bu komut yeni test dosyalarında stil hatası olup olmadığını kontrol eder. **Beklenen:** hata yok.
>
> ```zsh
> npm run build
> ```
> Bu komut test dosyalarının da TypeScript tip kontrolünden geçtiğini doğrular, çünkü Next.js bütün `.ts` dosyalarını kontrol eder. **Beklenen:** hatasız biter. `npm run dev` açıksa önce Ctrl+C ile kapat.
>
> ### Commit (üçü de geçerse)
>
> ```zsh
> git add package.json src/lib/yetki.test.ts src/lib/session.test.ts src/test-destek/kurallar.test.ts
> ```
> Bu komut yalnızca bu dört dosyayı commit'e hazırlar.
>
> ```zsh
> git --no-pager diff --cached --stat
> ```
> Bu komut commit'e hazırlanan dosyaları listeler. **Beklenen:** yalnızca bu 4 dosya.
>
> ```zsh
> git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"
> ```
> Bu komut takip edilen dosyalarda parola izi arar. **Beklenen:** boş çıktı.
>
> ```zsh
> git commit -m "test: rol kuralı, oturum belirteci ve statik kural testleri"
> ```
> Bu komut dört dosyayı `gun6-yetki-ve-test-altyapisi` dalına kaydeder. Push'u sen GitHub Desktop ile yapacaksın. İstersen bu noktada yapabilir ya da Parça 8'den sonra hepsini birlikte gönderebilirsin.
>
> ## Bana yaz
> 1. `npm test`: pass ve fail sayıları.
> 2. `npm run lint` ve `npm run build` sonuçları.
> 3. `diff --cached --stat` 4 dosyayı mı gösterdi? Commit başarılı mı?
>
> Sonra Parça 5'e (`veri.ts`, test verisi yardımcısı) geçeceğiz. Veritabanı kullanan ilk parça o olacak.

### Prompt 31 · 22 Eki 2026 15:47

_[yapıştırılan metin]_

````text
kullanici@bilgisayar abonetakip % npm test

> abonetakip@0.1.0 test
> node --import ./src/test-destek/kancalar.mjs --test src/lib/donem.test.ts src/lib/yetki.test.ts src/lib/session.test.ts src/test-destek/kurallar.test.ts

(node:67519) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/donem.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ aylık: sıradan gün bir ay sonraya taşınır (1.089625ms)
✔ aylık: 31 Ocak + 1 ay = 28 Şubat (ay sonu taşmaz) (0.061333ms)
✔ aylık: artık yılda 31 Ocak + 1 ay = 29 Şubat (0.046166ms)
✔ aylık: 31 Mart + 1 ay = 30 Nisan (0.041042ms)
✔ aylık: Aralık'tan Ocak'a yıl atlar (0.353917ms)
✔ yıllık: bir yıl sonraya taşınır (0.06025ms)
✔ yıllık: 29 Şubat + 1 yıl = 28 Şubat (artık yıl olmayan yıl) (0.044583ms)
✔ saat, dakika, saniye ve milisaniye korunur (0.0385ms)
(node:67520) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/session.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ geçerli belirteç kullanıcı kimliğini verir (0.667625ms)
✔ 7 gün sonra süresi dolar (0.089542ms)
✔ içindeki kullanıcı kimliği değiştirilen belirteç geçersizdir (0.083792ms)
✔ imzası değiştirilen belirteç geçersizdir (0.077ms)
✔ başka bir anahtarla imzalanmış belirteç geçersizdir (0.081042ms)
✔ biçimi bozuk belirteçler geçersizdir (0.061708ms)
(node:67521) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/yetki.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ manager yöneticidir (0.286459ms)
✔ finance yönetici değildir (0.042958ms)
(node:67522) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/kurallar.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ tarama gerçekten dosya buluyor (kendini kontrol) (0.946167ms)
✔ ham prisma (db.ts) yalnızca izin verilen dosyalarda içe aktarılır (8.591333ms)
✔ yeni bir Prisma istemcisi yalnızca db.ts içinde oluşturulur (1.698667ms)
✔ ham SQL ($queryRaw, $executeRaw) hiçbir yerde kullanılmaz (1.38675ms)
ℹ tests 20
ℹ suites 0
ℹ pass 20
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 175.5585
kullanici@bilgisayar abonetakip % npm run lint

> abonetakip@0.1.0 lint
> eslint

kullanici@bilgisayar abonetakip % npm run build

> abonetakip@0.1.0 build
> next build

▲ Next.js 16.4.2 (Turbopack)
- Environments: .env
✓ Running next.config.ts took 54ms

  Creating an optimized production build ...
✓ Compiled successfully in 458ms
  Running TypeScript ...
  Finished TypeScript in 833ms ...
  Collecting page data using 9 workers ...
✓ Collecting page data using 9 workers in 372ms
  Generating static pages using 9 workers (0/12) ...
  Generating static pages using 9 workers (3/12) 
  Generating static pages using 9 workers (6/12) 
  Generating static pages using 9 workers (9/12) 
✓ Generating static pages using 9 workers (12/12) in 77ms
  Finalizing page optimization ...
✓ Finalizing page optimization in 9ms

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

kullanici@bilgisayar abonetakip %
````

### Claude cevabı 31 · 22 Eki 2026 15:47

> Parça 4'ün testleri geçti:
> - `npm test`: **20 geçti, 0 başarısız** (dönem 8, oturum 6, rol 2, statik kural 4)
> - `npm run lint`: temiz
> - `npm run build`: hatasız. TypeScript kontrolü yeni test dosyalarını da kapsadı ve geçti.
>
> Çıktıda commit adımlarını görmüyorum. Parça 4'teki commit komutlarını sırayla çalıştır:
>
> ```zsh
> git add package.json src/lib/yetki.test.ts src/lib/session.test.ts src/test-destek/kurallar.test.ts
> ```
> Bu komut yalnızca bu dört dosyayı commit'e hazırlar.
>
> ```zsh
> git --no-pager diff --cached --stat
> ```
> Bu komut commit'e hazırlanan dosyaları listeler. **Beklenen:** yalnızca 4 dosya.
>
> ```zsh
> git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"
> ```
> Bu komut parola izi arar. **Beklenen:** boş çıktı.
>
> ```zsh
> git commit -m "test: rol kuralı, oturum belirteci ve statik kural testleri"
> ```
> Bu komut dört dosyayı `gun6-yetki-ve-test-altyapisi` dalına kaydeder.
>
> Çıktıyı bana yaz. Commit tamamsa Parça 5'i (`veri.ts`, test verisi yardımcısı) vereceğim. Veritabanı kullanan ilk parça o olacak.

### Prompt 32 · 22 Eki 2026 15:47

````text
kullanici@bilgisayar abonetakip % git add package.json src/lib/yetki.test.ts src/lib/session.test.ts src/test-destek/kurallar.test.ts
kullanici@bilgisayar abonetakip % git --no-pager diff --cached --stat
 package.json                     |  5 ++--
 src/lib/session.test.ts          | 59 ++++++++++++++++++++++++++++++++++++++++++++++++
 src/lib/yetki.test.ts            | 14 ++++++++++++
 src/test-destek/kurallar.test.ts | 89 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 4 files changed, 165 insertions(+), 2 deletions(-)
kullanici@bilgisayar abonetakip % git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"
kullanici@bilgisayar abonetakip % git commit -m "test: rol kuralı, oturum belirteci ve statik kural testleri"
[gun6-yetki-ve-test-altyapisi ba8608c] test: rol kuralı, oturum belirteci ve statik kural testleri
 4 files changed, 165 insertions(+), 2 deletions(-)
 create mode 100644 src/lib/session.test.ts
 create mode 100644 src/lib/yetki.test.ts
 create mode 100644 src/test-destek/kurallar.test.ts
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 32 · 22 Eki 2026 15:48

> Commit tamam: `ba8608c`, 4 dosya, parola izi yok. Bu commit `gun6-yetki-ve-test-altyapisi` dalında. Push'u istediğin zaman GitHub Desktop'tan yapabilirsin.
>
> ## Parça 5: `src/test-destek/veri.ts` (test verisi yardımcısı)
>
> **Ne yapar?** Her test dosyası çalışınca iki sahte firma (A ve B) oluşturur. Her firmada şunlar olur:
> - 1 manager, 1 finance
> - 2 plan (biri abonelikli, biri boş)
> - 2 müşteri (biri abonelikli, biri boş)
> - 1 aktif abonelik ve "başladı" olayı
>
> Testler bitince yalnızca **bu çalışmada oluşturulan** kayıtları siler.
>
> **Onayladığın istisna:** Bu dosya ham `prisma` nesnesini kullanır, çünkü firma ekleme ve silme tenant filtresinden geçemez. Parça 3'teki statik kural testi yalnızca bu dosyaya izin veriyor.
>
> **Üç güvence:**
> 1. `TEST_VERITABANI=evet` yoksa veritabanına hiç bağlanmadan durur.
> 2. Silme yalnızca bu çalışmanın firma ID'leriyle yapılır. Ayrıca firmanın adı bu çalışmanın etiketiyle başlamalıdır. Joker karakterle silme yoktur.
> 3. Silmeden sonra hiçbir test firmasının kalmadığı kontrol edilir.
>
> **Yeni dosya oluştur:** `src/test-destek/veri.ts`
>
> ```ts
> // TEST VERİSİ YARDIMCISI (yalnızca testlerde kullanılır)
> //
> // Her test dosyası çalışınca iki sahte firma (A ve B) oluşturur ve testler
> // bitince yalnızca BU ÇALIŞMADA oluşturduğu kayıtları siler.
> //
> // İSTİSNA (Gün 6 onayı): Bu dosya ham "prisma" nesnesini kullanır. Firma (Tenant)
> // oluşturma ve silme işlemleri tenant filtresinden geçemez, çünkü filtre bunları
> // bilerek engeller. kurallar.test.ts yalnızca BU dosyaya bu izni verir.
> //
> // GÜVENLİK:
> // 1. TEST_VERITABANI=evet yoksa veritabanına hiç bağlanmadan durur.
> //    Bu işaret yalnızca .env.test içinde vardır (Neon test dalı).
> // 2. Silme yalnızca bu çalışmada oluşturulan firma kimlikleriyle yapılır ve
> //    firmanın adı bu çalışmanın etiketiyle başlamalıdır. Joker silme yoktur.
> // 3. Silmeden sonra hiçbir test firmasının kalmadığı kontrol edilir.
>
> import { randomUUID } from "node:crypto";
>
> // 1. güvence: veritabanına bağlanmadan ÖNCE kontrol.
> if (process.env.TEST_VERITABANI !== "evet") {
>   throw new Error(
>     "TEST_VERITABANI=evet bulunamadı. Veritabanı testleri yalnızca .env.test ile (Neon test dalında) çalışır: npm run test:db"
>   );
> }
>
> // Kontrol geçildikten SONRA içe aktarılır.
> const { prisma } = await import("../lib/db.ts");
>
> // Bu çalışmaya özel etiket. Örnek: "test-3f9a1c2b". Firma adları bununla başlar.
> export const CALISMA = `test-${randomUUID().slice(0, 8)}`;
>
> // Test planlarının fiyatı (TL, tam sayı).
> export const PLAN_FIYATI = 1000;
>
> // Bu çalışmada oluşturulan firmaların kimlikleri. Silme yalnızca bunlarla yapılır.
> const olusturulanFirmaIdleri: string[] = [];
>
> // Bir test firmasının kayıtlarının kimlikleri.
> export type TestFirmasi = {
>   tenantId: string;
>   managerId: string;
>   financeId: string;
>   abonelikliPlanId: string; // aktif aboneliği olan plan
>   bosPlanId: string; // aboneliği olmayan plan
>   abonelikliMusteriId: string; // aktif aboneliği olan müşteri
>   bosMusteriId: string; // aboneliği olmayan müşteri
>   abonelikId: string; // abonelikli müşterinin ACTIVE aboneliği
> };
>
> // Bir sahte firma ve içindeki kayıtları oluşturur. etiket: "a" ya da "b".
> export async function testFirmasiOlustur(etiket: string): Promise<TestFirmasi> {
>   const on = `${CALISMA}-${etiket}`;
>
>   const firma = await prisma.tenant.create({
>     data: { name: on },
>     select: { id: true },
>   });
>   // Hemen listeye eklenir: sonraki adımlardan biri hata verse bile temizlenir.
>   olusturulanFirmaIdleri.push(firma.id);
>   const tenantId = firma.id;
>
>   // Kullanıcılar. passwordHash gerçek bir bcrypt özeti DEĞİLDİR:
>   // bu kullanıcılarla giriş yapılamaz, yalnızca test verisi olarak vardır.
>   const manager = await prisma.user.create({
>     data: {
>       tenantId,
>       email: `${on}-manager@example.com`,
>       name: "Test Yönetici",
>       passwordHash: "test-giris-yapilamaz",
>       role: "manager",
>     },
>     select: { id: true },
>   });
>   const finance = await prisma.user.create({
>     data: {
>       tenantId,
>       email: `${on}-finance@example.com`,
>       name: "Test Finans",
>       passwordHash: "test-giris-yapilamaz",
>       role: "finance",
>     },
>     select: { id: true },
>   });
>
>   const abonelikliPlan = await prisma.plan.create({
>     data: { tenantId, name: "Test Abonelikli Plan", price: PLAN_FIYATI, interval: "MONTHLY" },
>     select: { id: true },
>   });
>   const bosPlan = await prisma.plan.create({
>     data: { tenantId, name: "Test Boş Plan", price: PLAN_FIYATI, interval: "YEARLY" },
>     select: { id: true },
>   });
>
>   const abonelikliMusteri = await prisma.customer.create({
>     data: { tenantId, name: "Test Abonelikli Müşteri", email: `${on}-musteri1@example.com` },
>     select: { id: true },
>   });
>   const bosMusteri = await prisma.customer.create({
>     data: { tenantId, name: "Test Boş Müşteri", email: `${on}-musteri2@example.com` },
>     select: { id: true },
>   });
>
>   // Aktif abonelik ve "başladı" olayı (uygulamadaki gibi ikisi birlikte).
>   const abonelik = await prisma.subscription.create({
>     data: {
>       tenantId,
>       customerId: abonelikliMusteri.id,
>       planId: abonelikliPlan.id,
>       status: "ACTIVE",
>       currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
>     },
>     select: { id: true },
>   });
>   await prisma.subscriptionEvent.create({
>     data: { tenantId, subscriptionId: abonelik.id, type: "STARTED" },
>   });
>
>   return {
>     tenantId,
>     managerId: manager.id,
>     financeId: finance.id,
>     abonelikliPlanId: abonelikliPlan.id,
>     bosPlanId: bosPlan.id,
>     abonelikliMusteriId: abonelikliMusteri.id,
>     bosMusteriId: bosMusteri.id,
>     abonelikId: abonelik.id,
>   };
> }
>
> // Bu çalışmada oluşturulan firmaları ve içlerindeki her şeyi siler.
> export async function testVerisiniTemizle(): Promise<void> {
>   if (olusturulanFirmaIdleri.length === 0) return;
>
>   // 2. güvence: yalnızca kimliği listede OLAN ve adı bu çalışmanın etiketiyle başlayan firmalar.
>   const firmalar = await prisma.tenant.findMany({
>     where: { id: { in: olusturulanFirmaIdleri }, name: { startsWith: CALISMA } },
>     select: { id: true },
>   });
>   const idler = firmalar.map((f) => f.id);
>   if (idler.length === 0) return;
>
>   // Silme sırası, tablolar arasındaki bağlara göredir: önce olaylar, en son firmalar.
>   const kosul = { tenantId: { in: idler } };
>   await prisma.subscriptionEvent.deleteMany({ where: kosul });
>   await prisma.subscription.deleteMany({ where: kosul });
>   await prisma.customer.deleteMany({ where: kosul });
>   await prisma.plan.deleteMany({ where: kosul });
>   await prisma.user.deleteMany({ where: kosul });
>   await prisma.tenant.deleteMany({ where: { id: { in: idler } } });
>
>   // 3. güvence: gerçekten silindi mi?
>   const kalan = await prisma.tenant.count({ where: { id: { in: idler } } });
>   if (kalan > 0) {
>     throw new Error(`Temizlik tamamlanamadı: ${kalan} test firması kaldı (${CALISMA}).`);
>   }
>   olusturulanFirmaIdleri.length = 0;
> }
>
> // Veritabanı bağlantısını kapatır. Kapatılmazsa Node test bitince beklemede kalır.
> export async function baglantiyiKapat(): Promise<void> {
>   await prisma.$disconnect();
> }
> ```
>
> ### Çalıştır: bu parçada veritabanına bağlanılmıyor
>
> Bu dosya tek başına bir test değil. Asıl çalışmasını Parça 6'da göreceğiz. Bu parçada üç şeyi kontrol ediyoruz.
>
> **1. Koruma çalışıyor mu?** `.env.test` olmadan yüklenince hiç bağlanmadan durmalı.
>
> ```zsh
> node --import ./src/test-destek/kancalar.mjs --input-type=module -e 'await import("./src/test-destek/veri.ts")'
> ```
> Bu komut `veri.ts` dosyasını **bilerek `.env.test` olmadan** yükler. Böylece korumanın veritabanına bağlanmadan durduğunu görürüz. **Beklenen:** Kırmızı bir hata çıktısı ve içinde `TEST_VERITABANI=evet bulunamadı` cümlesi. Bu hata **istenen sonuç**.
>
> Başka bir hata çıkarsa (örneğin "Cannot find module") ilk 3–4 satırı yaz.
>
> **2. Statik kural hâlâ geçiyor mu?**
>
> ```zsh
> npm test
> ```
> Bu komut veritabanı gerektirmeyen testleri tekrar çalıştırır. Statik kural testi artık `veri.ts` dosyasını da tarar. Bu dosya izin listesinde olduğu için geçmeli. **Beklenen:** `ℹ pass 20`, `ℹ fail 0`.
>
> **3. Tipler doğru mu?**
>
> ```zsh
> npx tsc --noEmit
> ```
> Bu komut yalnızca TypeScript tip kontrolünü yapar, derleme ya da dosya üretmez. `npm run build` komutundan daha hızlıdır. **Beklenen:** hiçbir çıktı olmadan biter.
>
> **Commit yok:** Bu dosyayı Parça 6'daki izolasyon testi gerçekten çalıştırdıktan sonra onunla birlikte commit edeceğiz.
>
> ## Bana yaz
> 1. Koruma komutunun çıktısında `TEST_VERITABANI=evet bulunamadı` görünüyor mu?
> 2. `npm test`: pass ve fail sayıları.
> 3. `npx tsc --noEmit` bir şey yazdı mı?

### Prompt 33 · 22 Eki 2026 15:53

````text
İlk PR’ı birleştirdim, şimdi A ve C testlerine geçelim (test:db)
````

### Claude cevabı 33 · 22 Eki 2026 15:54

> PR birleştiğine göre yeni işi main'in güncel hâlinden açılan **yeni bir dalda** yapalım. `veri.ts` henüz commit edilmediği için dal değiştirirken seninle birlikte taşınır.
>
> Parça 5'in kontrol sonuçlarını yazmadın. Aşağıda onları da Parça 6'nın önüne koydum. Sırayla ilerle, herhangi bir adım beklendiği gibi çıkmazsa orada dur ve bana yaz.
>
> ---
>
> ## Hazırlık: yeni dal
>
> ```zsh
> git switch main
> ```
> Bu komut main dalına geçer.
>
> ```zsh
> git pull
> ```
> Bu komut GitHub'daki birleştirilmiş hâli (PR dahil) bilgisayarına indirir.
>
> ```zsh
> git switch -c gun6-izolasyon-testleri
> ```
> Bu komut güncel main'den `gun6-izolasyon-testleri` adında yeni bir dal açar ve ona geçer. GitHub Desktop'ta "New Branch" ile de aynı şeyi yapabilirsin.
>
> ```zsh
> git status --short --untracked-files=all
> ```
> Bu komut yeni ve değişmiş dosyaları listeler. **Beklenen:** yalnızca `?? src/test-destek/veri.ts`. Dosya listede yoksa Parça 5'teki dosyayı oluştur.
>
> ## Parça 5 kontrolleri (henüz yapmadıysan)
>
> ```zsh
> node --import ./src/test-destek/kancalar.mjs --input-type=module -e 'await import("./src/test-destek/veri.ts")'
> ```
> Bu komut `veri.ts` dosyasını bilerek `.env.test` olmadan yükler. **Beklenen:** Hata çıktısında `TEST_VERITABANI=evet bulunamadı` cümlesi. Bu hata istenen sonuç: koruma, veritabanına bağlanmadan durdu demektir.
>
> ```zsh
> npx tsc --noEmit
> ```
> Bu komut yalnızca TypeScript tip kontrolü yapar. **Beklenen:** hiçbir çıktı olmadan biter.
>
> ---
>
> ## Parça 6: `src/lib/tenant.test.ts` (A, kiracı izolasyonu)
>
> **Ne test eder?** `tenant.ts` içindeki filtreyi. Action dosyalarının kullandığı sorgu biçimlerinin aynısı A firmasının kullanıcısı gibi çalıştırılır ve B'nin kayıtlarına ulaşılamadığı gösterilir. `dbB` yalnızca "B'nin kaydı gerçekten değişmedi mi?" sorusunu kontrol etmek için kullanılır.
>
> Toplam **18 test** var. 11. test (olası açık) bilerek en sonda.
>
> **Yeni dosya oluştur:** `src/lib/tenant.test.ts`
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
>       dbA

### Prompt 34 · 22 Eki 2026 15:54

````text
parça 5 i yapmadım ama
````

### Claude cevabı 34 · 22 Eki 2026 15:54

> Tamam, o zaman önce Parça 5'i yapalım. Son mesajım da yarıda kesildi, Parça 6'yı sonra eksiksiz vereceğim. Şimdilik yalnızca aşağıdakileri yap.
>
> ## 1. Yeni dal (henüz yapmadıysan)
>
> ```zsh
> git switch main
> ```
> Bu komut main dalına geçer.
>
> ```zsh
> git pull
> ```
> Bu komut GitHub'daki birleştirilmiş hâli bilgisayarına indirir.
>
> ```zsh
> git switch -c gun6-izolasyon-testleri
> ```
> Bu komut güncel main'den yeni bir dal açar ve ona geçer.
>
> ```zsh
> git status --short --untracked-files=all
> ```
> Bu komut değişiklikleri listeler. **Beklenen:** boş çıktı, çünkü `veri.ts` henüz yok.
>
> ## 2. Parça 5: `src/test-destek/veri.ts`
>
> İki mesaj önceki **"Parça 5: `src/test-destek/veri.ts` (test verisi yardımcısı)"** başlıklı mesajımdaki dosyayı **yeni dosya** olarak oluştur. `// TEST VERİSİ YARDIMCISI` satırıyla başlayıp `baglantiyiKapat` fonksiyonuyla biten kod bloğunun tamamını al. İçerik değişmedi.
>
> ## 3. Parça 5 kontrolleri
>
> ```zsh
> node --import ./src/test-destek/kancalar.mjs --input-type=module -e 'await import("./src/test-destek/veri.ts")'
> ```
> Bu komut `veri.ts` dosyasını bilerek `.env.test` olmadan yükler. **Beklenen:** Hata çıktısında `TEST_VERITABANI=evet bulunamadı` cümlesi. Bu hata istenen sonuç: koruma, veritabanına bağlanmadan durdu demektir.
>
> ```zsh
> npm test
> ```
> Bu komut veritabanı gerektirmeyen testleri çalıştırır. Statik kural testi artık `veri.ts` dosyasını da tarar. **Beklenen:** `ℹ pass 20`, `ℹ fail 0`.
>
> ```zsh
> npx tsc --noEmit
> ```
> Bu komut yalnızca TypeScript tip kontrolü yapar. **Beklenen:** hiçbir çıktı olmadan biter.
>
> ## Bana yaz
> 1. `git status` boş mu, dal adı doğru mu?
> 2. Koruma komutunda `TEST_VERITABANI=evet bulunamadı` görünüyor mu?
> 3. `npm test`: pass ve fail sayıları.
> 4. `npx tsc --noEmit` bir şey yazdı mı?
>
> Sonra Parça 6'yı (`tenant.test.ts`) eksiksiz vereceğim.

### Prompt 35 · 22 Eki 2026 15:59

_[yapıştırılan metin]_

````text
kullanici@bilgisayar abonetakip % git switch main
'main' dalına geçildi.
Dalınız "origin/main" ile güncel.
kullanici@bilgisayar abonetakip % git pull
remote: Enumerating objects: 14, done.
remote: Counting objects: 100% (14/14), done.
remote: Compressing objects: 100% (6/6), done.
remote: Total 9 (delta 3), reused 8 (delta 3), pack-reused 0 (from 0)
Nesneler açılıyor: 100% (9/9), 4.33 KiB | 2.17 MiB/sn, bitti.
Şu konumdan: https://github.com/ozgesoganci1-bot/abonetakip
   358c0a7..747f5a6  main       -> origin/main
Güncelleniyor: 358c0a7..747f5a6
Fast-forward
 package.json                     |  5 ++--
 src/lib/session.test.ts          | 59 ++++++++++++++++++++++++++++++++++++++++++++++++
 src/lib/yetki.test.ts            | 14 ++++++++++++
 src/test-destek/kurallar.test.ts | 89 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 4 files changed, 165 insertions(+), 2 deletions(-)
 create mode 100644 src/lib/session.test.ts
 create mode 100644 src/lib/yetki.test.ts
 create mode 100644 src/test-destek/kurallar.test.ts
kullanici@bilgisayar abonetakip % git switch main
Halihazırda 'main' üzerinde
Dalınız "origin/main" ile güncel.
kullanici@bilgisayar abonetakip % git pull
Tümü güncel.
kullanici@bilgisayar abonetakip % git switch -c gun6-izolasyon-testleri
Yeni 'gun6-izolasyon-testleri' dalına geçildi.
kullanici@bilgisayar abonetakip % git status --short --untracked-files=all
kullanici@bilgisayar abonetakip % node --import ./src/test-destek/kancalar.mjs --input-type=module -e 'await import("./src/test-destek/veri.ts")'
file:///Users/kullanici/Projeler/abonetakip/src/test-destek/veri.ts:21
  throw new Error(
        ^

Error: TEST_VERITABANI=evet bulunamadı. Veritabanı testleri yalnızca .env.test ile (Neon test dalında) çalışır: npm run test:db
    at file:///Users/kullanici/Projeler/abonetakip/src/test-destek/veri.ts:21:9
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async file:///Users/kullanici/Projeler/abonetakip/[eval1]:1:1

Node.js v26.11.1
kullanici@bilgisayar abonetakip % npm test

> abonetakip@0.1.0 test
> node --import ./src/test-destek/kancalar.mjs --test src/lib/donem.test.ts src/lib/yetki.test.ts src/lib/session.test.ts src/test-destek/kurallar.test.ts

(node:68022) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/donem.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ aylık: sıradan gün bir ay sonraya taşınır (1.326958ms)
✔ aylık: 31 Ocak + 1 ay = 28 Şubat (ay sonu taşmaz) (0.064333ms)
✔ aylık: artık yılda 31 Ocak + 1 ay = 29 Şubat (0.43075ms)
✔ aylık: 31 Mart + 1 ay = 30 Nisan (0.044667ms)
✔ aylık: Aralık'tan Ocak'a yıl atlar (0.048084ms)
✔ yıllık: bir yıl sonraya taşınır (0.037792ms)
✔ yıllık: 29 Şubat + 1 yıl = 28 Şubat (artık yıl olmayan yıl) (0.03925ms)
✔ saat, dakika, saniye ve milisaniye korunur (0.034792ms)
(node:68023) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/session.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ geçerli belirteç kullanıcı kimliğini verir (0.557333ms)
✔ 7 gün sonra süresi dolar (0.069375ms)
✔ içindeki kullanıcı kimliği değiştirilen belirteç geçersizdir (0.074709ms)
✔ imzası değiştirilen belirteç geçersizdir (0.061709ms)
✔ başka bir anahtarla imzalanmış belirteç geçersizdir (0.064875ms)
✔ biçimi bozuk belirteçler geçersizdir (0.056916ms)
(node:68024) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/yetki.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ manager yöneticidir (0.3115ms)
✔ finance yönetici değildir (0.07ms)
(node:68025) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/test-destek/kurallar.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
✔ tarama gerçekten dosya buluyor (kendini kontrol) (0.572292ms)
✔ ham prisma (db.ts) yalnızca izin verilen dosyalarda içe aktarılır (9.284208ms)
✔ yeni bir Prisma istemcisi yalnızca db.ts içinde oluşturulur (1.89525ms)
✔ ham SQL ($queryRaw, $executeRaw) hiçbir yerde kullanılmaz (1.508958ms)
ℹ tests 20
ℹ suites 0
ℹ pass 20
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 173.185667
kullanici@bilgisayar abonetakip % npx tsc --noEmit
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 35 · 22 Eki 2026 16:00

> Parça 5 tamam:
> - Dal doğru: `gun6-izolasyon-testleri`, main'in güncel hâlinden açıldı.
> - **Koruma çalışıyor:** `.env.test` olmadan yüklenince `TEST_VERITABANI=evet bulunamadı` hatasıyla durdu, veritabanına bağlanmadı.
> - `npm test`: 20/20. Statik kural `veri.ts` dosyasını taradı ve izin listesinde olduğu için geçti.
> - `npx tsc --noEmit`: temiz.
>
> ## Parça 6: `src/lib/tenant.test.ts` (A, kiracı izolasyonu)
>
> **Ne test eder?** `tenant.ts` içindeki filtreyi. Action dosyalarının kullandığı sorgu biçimlerinin aynısı A firmasının kullanıcısı gibi çalıştırılır ve B'nin kayıtlarına ulaşılamadığı gösterilir. `dbB` yalnızca "B'nin kaydı gerçekten değişmedi mi?" sorusunu kontrol etmek için kullanılır.
>
> Toplam **18 test**, 5 grupta:
>
> | Grup | Test sayısı |
> |---|---|
> | Müşteriler | 4 |
> | Planlar | 3 |
> | Abonelikler ve olaylar | 6 |
> | Firma tablosu | 3 |
> | Filtre korumaları | 2 (11. test, yani olası açık, en sonda) |
>
> **Yeni dosya oluştur:** `src/lib/tenant.test.ts`
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
>   test("A, B'nin firma ayarını (CAC) değiştiremez", async () => {
>     // Not: filtre "where" içindeki kimliği oturumdaki firmayla değiştirir.
>     // Bu yüzden bu istek B'ye değil A'nın kendi kaydına uygulanır. Önemli olan B'nin değişmemesi.
>     await dbA.tenant.update({ where: { id: B.tenantId }, data: { cac: 999 } });
>     const b = await dbB.tenant.findFirst({ select: { cac: true } });
>     assert.equal(b?.cac, 0);
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
>   // OLASI AÇIK (plan, 11. test): Filtre "data.tenantId" alanını engelliyor, ama
>   // ilişki üzerinden bağlamayı ("tenant: { connect }") engellemiyor olabilir.
>   // Uygulamadaki işlemler bu yazımı kullanmıyor, bu yüzden bugün bir saldırı yolu değil.
>   // Test, OLMASI GEREKEN davranışı kontrol eder: kayıt A'da kalmalı.
>   // Hata verirse açık var demektir. Bu test bilerek dosyanın en sonundadır.
>   test("OLASI AÇIK: kayıt ilişki üzerinden (tenant: connect) başka firmaya taşınamamalı", async () => {
>     try {
>       await dbA.customer.update({
>         where: { id: A.bosMusteriId },
>         data: { tenant: { connect: { id: B.tenantId } } },
>       });
>     } catch {
>       // İşlemin hata vermesi de kabul edilir: amaç kaydın taşınmaması.
>     }
>     const adaKaldi = await dbA.customer.findFirst({ where: { id: A.bosMusteriId } });
>     const bye = await dbB.customer.findFirst({ where: { id: A.bosMusteriId } });
>     assert.notEqual(adaKaldi, null, "A'nın müşterisi A'da görünmüyor: kayıt taşınmış olabilir.");
>     assert.equal(bye, null, "A'nın müşterisi B'de görünüyor: kayıt başka firmaya taşındı.");
>   });
> });
> ```
>
> ### Çalıştır
>
> `test:db` betiği Parça 8'de gelecek. Şimdilik dosyayı doğrudan çalıştırıyoruz:
>
> ```zsh
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test src/lib/tenant.test.ts
> ```
> Bu komut `.env.test` ile Neon **test dalına** bağlanır ve yalnızca kiracı izolasyonu testlerini çalıştırır. İki sahte firma oluşturur, testler bitince siler. Ağ gecikmesi yüzünden 5–20 saniye sürebilir.
>
> **Çıktıyı okuma:**
> - Testler grup başlıklarının (`▶ Müşteriler` gibi) altında girintili listelenir.
> - Sonda `ℹ pass` ve `ℹ fail` sayıları olur. Toplam `tests 18` olmalı.
> - `MODULE_TYPELESS_PACKAGE_JSON` ve `SSL modes` uyarıları önceki gibi zararsız.
>
> **Beklentim:** İlk 17 test geçmeli. Son test olan "OLASI AÇIK" geçebilir de başarısız olabilir de, sonucunu bilmiyorum. Başarısız olursa kendim karar vermeyeceğim, sana soracağım.
>
> **Komut 1 dakikadan uzun süre bitmezse:** Ctrl+C ile durdur ve bana yaz. Yarıda kesilirse test dalında `test-xxxxxxxx-a/b` adlı kayıtlar kalabilir. Onları sonra birlikte temizleriz, canlı veriye dokunmaz.
>
> ## Bana yaz
> 1. `ℹ pass` ve `ℹ fail` sayıları.
> 2. `✖` olan her testin adı ve altındaki ilk 4–5 satır. Bir satırda `postgresql://` geçerse o satırı sil.
> 3. Çıktının sonunda "Temizlik tamamlanamadı" gibi bir hata var mı?
>
> **Commit yok:** `veri.ts` ve `tenant.test.ts` dosyalarını 11. testin sonucunu konuştuktan sonra commit edeceğiz.

### Prompt 36 · 22 Eki 2026 16:04

````text
kullanici@bilgisayar abonetakip % node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test src/lib/tenant.test.ts
(node:68146) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/tenant.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:68146) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https:  for libpq SSL mode definitions.
▶ Müşteriler
  ✔ liste yalnızca A'nın müşterilerini getirir (79.6775ms)
  ✔ B'nin müşterisi kimlikle aranınca bulunamaz (findFirst ve findUnique) (205.746542ms)
  ✔ B'nin müşterisi güncellenemez ve pasife alınamaz, kaydı değişmez (181.155792ms)
  ✔ eklerken gönderilen B tenantId'si yok sayılır, kayıt A'ya yazılır (116.880584ms)
✔ Müşteriler (2971.079416ms)
▶ Planlar
  ✔ liste yalnızca A'nın planlarını getirir (58.577584ms)
  ✔ B'nin planı kimlikle aranınca bulunamaz (171.18325ms)
  ✔ B'nin planı güncellenemez ve pasife alınamaz, kaydı değişmez (117.939ms)
✔ Planlar (348.649458ms)
▶ Abonelikler ve olaylar
  ✔ liste yalnızca A'nın aboneliklerini getirir (58.650333ms)
  ✔ B'nin aboneliği kimlikle aranınca bulunamaz (119.565125ms)
  ✔ işlem (transaction) içinde de B'nin aboneliği iptal edilemez ve yenilenemez (456.538792ms)
  ✔ A adına B'nin müşterisi ve planıyla abonelik oluşturulamaz (veritabanı reddeder) (533.742625ms)
  ✔ A adına B'nin aboneliğine olay yazılamaz (veritabanı reddeder) (519.703375ms)
  ✔ aktifAbonelikVarMi, A adına sorulunca B'nin aboneliklerini saymaz (290.249458ms)
✔ Abonelikler ve olaylar (1980.180375ms)
▶ Firma tablosu
  ✔ A yalnızca kendi firmasını görür (61.741666ms)
  ✔ A, B'nin firma ayarını (CAC) değiştiremez (120.854791ms)
  ✔ firma eklenemez ve silinemez (1.542792ms)
✔ Firma tablosu (184.733458ms)
▶ Filtre korumaları
  ✔ güncelleme verisinde tenantId varsa işlem durdurulur (57.287125ms)
  ✖ OLASI AÇIK: kayıt ilişki üzerinden (tenant: connect) başka firmaya taşınamamalı (448.217708ms)
✖ Filtre korumaları (506.939459ms)
ℹ tests 18
ℹ suites 5
ℹ pass 17
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 6792.88325

✖ failing tests:

test at src/lib/tenant.test.ts:242:3
✖ OLASI AÇIK: kayıt ilişki üzerinden (tenant: connect) başka firmaya taşınamamalı (448.217708ms)
  AssertionError [ERR_ASSERTION]: A'nın müşterisi A'da görünmüyor: kayıt taşınmış olabilir.
      at TestContext.<anonymous> (file:///Users/kullanici/Projeler/abonetakip/src/lib/tenant.test.ts:253:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1409:7)
      at async Suite.processPendingSubtests (node:internal/test_runner/test:974:7) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: null,
    expected: null,
    operator: 'notStrictEqual',
    diff: 'simple'
  }
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 36 · 22 Eki 2026 16:05

> **Sonuç: 17 geçti, 1 başarısız.** Başarısız olan 11. test, yani olası açık gerçekten var.
>
> ## Ne bulundu?
>
> A firmasına bağlı veritabanı nesnesiyle şu sorgu çalıştırıldı:
>
> ```ts
> dbA.customer.update({ where: { id: A_müşterisi }, data: { tenant: { connect: { id: B } } } })
> ```
>
> Bu sorgu A'nın müşterisini **B firmasına taşıdı**. Test, müşterinin artık A'da görünmediğini yakaladı.
>
> **Neden oluyor?** `tenant.ts` içindeki koruma yalnızca `data.tenantId` alanını engelliyor. Prisma'da aynı değişiklik ilişki üzerinden (`tenant: { connect }`) de yazılabiliyor ve filtre bu ikinci yazımı tanımıyor.
>
> **Bugünkü risk:** Düşük ama sıfır değil.
> - Uygulamadaki hiçbir işlem bu yazımı kullanmıyor. Formdan gelen veri de doğrudan `data` içine konmuyor, alanlar tek tek seçiliyor. Yani bugün kullanıcı bu yolu tetikleyemez.
> - Ancak ileride yazılacak bir özellik bu kalıbı kullanırsa ya da istemciden gelen bir nesne `data` içine olduğu gibi konursa, kayıtlar başka firmaya taşınabilir. Kiracı izolasyonu MUST özellik olduğu için bunu sana soruyorum.
>
> **Temizlik sorunsuz:** Taşınan müşteri B'ye geçmişti, B de bu çalışmanın test firması olduğu için onunla birlikte silindi. "Temizlik tamamlanamadı" hatası yok, test dalında kayıt kalmadı.
>
> ## İyi haberler
>
> - **Transaction testi geçti:** Tenant filtresi `$transaction` içindeki sorgulara da uygulanıyor. Bu, abonelik işlemlerinin güvenli olduğunu gösteriyor ve bence 11. testten daha kritik bir sorunun cevabıydı.
> - **Bileşik anahtarlar çalışıyor:** A adına B'nin müşterisiyle abonelik açmak ya da B'nin aboneliğine olay yazmak veritabanı düzeyinde reddediliyor.
>
> ## Seçenekler: karar senin
>
> **Seçenek 1 (önerim): `tenant.ts` içine küçük bir koruma ekle.**
> - Mevcut `tenantIdDegistirilmesinDiye` fonksiyonu yalnızca `tenantId` anahtarına bakıyor. Bu fonksiyon `tenant` anahtarını da yakalayacak şekilde genişletilir.
> - Aynı kontrol `create`, `createMany` ve `upsert` işlemlerindeki veriye de uygulanır.
> - Boyut: `tenant.ts` içinde yaklaşık 6–8 satır. Başka dosyaya dokunulmaz.
> - Sonuç: 11. test geçer, diğer 17 test ve uygulama davranışı değişmez. Uygulamadaki hiçbir işlem `tenant` anahtarını kullanmıyor, bunu Adım 3'te okuduğum action dosyalarından biliyorum.
> - **Sınırı:** Koruma yalnızca verinin en üst düzeyine bakar. Çok iç içe yazılmış bir sorgunun içine gizlenmiş `tenant: { connect }` yakalanmaz. O durumda ikinci savunma hattı veritabanındaki bileşik anahtarlardır (abonelik ve olay testlerinde çalıştığını gördük). Ancak müşteri ve plan için bu ikinci hat yok.
>
> **Seçenek 2: Bugün düzeltme, issue olarak kaydet.**
> - 11. test bu hâliyle bırakılırsa `npm run test:db` her seferinde başarısız görünür. Bu yüzden testi "bilinen açık" (todo) olarak işaretlemek gerekir.
> - Issue'ya ne yapılacağı yazılır, düzeltme sonraki bir güne kalır.
>
> ## Bir not daha (karar gerektirmiyor)
>
> "A, B'nin CAC ayarını değiştiremez" testi geçti, ama kod okurken öngördüğüm şey oldu: `tenant.update({ where: { id: B } })` hata vermedi, isteği sessizce **A'nın kendi kaydına** uyguladı. Bu bir sızıntı değil, B etkilenmiyor. Ama yanıltıcı. Ayarlar sayfası (CAC) "sonra eklenecek" listesinde olduğu için bugün dokunmuyorum. O sayfa yazılırken ele alınması için issue'ya not olarak eklemeyi öneririm.
>
> ## Bana yaz
> 1. **Seçenek 1** mi, **Seçenek 2** mi?
> 2. Seçenek 1'i seçersen, kodu yazmadan önce `tenant.ts` içindeki değişikliğin planını (hangi satırlar, hangi işlemler) göstermemi ister misin, yoksa doğrudan tam dosyayı mı vereyim?

### Prompt 37 · 22 Eki 2026 16:06

````text
Seçenek 1: tenant.ts içine koruma eklensin. Ama kodu vermeden önce kısa bir plan sun: hangi fonksiyon değişecek, hangi işlemlere (update, updateMany, create, createMany, upsert) uygulanacak, hata mesajı ne olacak. Onayımdan sonra tam dosyayı ver.

Planda şunları da değerlendir:
1. Koruma yalnızca "tenantId" ve "tenant" anahtarlarını kara listeyle mi engelleyecek, yoksa daha sağlam bir yol var mı (örneğin izin verilen alanların beyaz listesi)? Hangisini neden öneriyorsun?
2. Müşteri ve plan için, abonelik ve olay tablolarındaki gibi ikinci bir savunma hattı (veritabanı düzeyinde) mümkün mü? Mümkünse bunu ayrı bir değişiklik olarak, Gün 6 kapsamı dışı diye işaretle, ben karar vereceğim.
3. Düzeltmeden sonra 11. test geçmeli ve diğer 17 test ile uygulama davranışı değişmemeli. Bunu nasıl doğrulayacağımı söyle (npm run build, npm test, npm run test:db ve tarayıcıda müşteri ekleme/güncelleme/pasife alma).

CAC notuna (tenant.update'in sessizce A'nın kendi kaydına uygulanması) onay: bugün dokunma, issue notu olarak yaz. Ayarlar sayfası yazılırken ele alacağız.

Bu açığın ve düzeltmesinin Gün 6 ADR bölümüne "Bilinen açıklar ve alınan önlemler" olarak girmesi için, düzeltme bittikten sonra bana kısa bir özet de ver: ne bulundu, bugünkü risk, ne yapıldı, neyi kapsamıyor.
````

### Claude cevabı 37 · 22 Eki 2026 16:07

> # Plan: `tenant.ts` korumasının genişletilmesi
>
> ## 1. Kara liste mi, beyaz liste mi?
>
> **Kara liste** (`tenantId` ve `tenant` anahtarlarını yasaklamak):
> - Bugünkü açığı kapatır.
> - Ama yalnızca bildiğimiz iki anahtarı engeller. İç içe yazımlar (örneğin `customer.update({ data: { subscriptions: { create: {...} } } })`) ve ileride şemaya eklenecek yeni ilişkiler kontrolsüz kalır.
> - "Unutulan bir şey varsa geçer" mantığıyla çalışır (fail-open).
>
> **Beyaz liste** (yalnızca tablonun kendi sütunlarına yazmaya izin vermek):
> - Prisma'da iç içe yazma (`connect`, `create`, `connectOrCreate` vb.) **yalnızca ilişki alanlarının altında** yapılabilir. Beyaz liste ilişki alanlarının hiçbirine izin vermediği için bütün iç içe yazımlar en üst düzeyde yakalanır. Önceki planımda söylediğim "çok iç içe yazım yakalanmaz" sınırı da böylece ortadan kalkar.
> - "İzin verilmeyen her şey durur" mantığıyla çalışır (fail-closed). Bu, `tenant.ts` dosyasının mevcut "tanımadığı işlemde durdur" ilkesiyle de uyumlu.
>
> **Önerim: beyaz liste.** Ancak listeyi elle yazmak yerine Prisma'nın şemadan ürettiği sütun listelerinden okumak istiyorum. Prisma her tablo için `CustomerScalarFieldEnum` gibi bir nesne üretir. Bu sayede şemaya yeni bir sütun eklendiğinde listeyi güncellemek gerekmez. Bu nesnelerin senin `generated/prisma` klasöründe hangi adla ve hangi dosyadan dışa aktarıldığını görmem gerekiyor. Aşağıdaki kontrol komutu bunun için.
>
> **Bugünkü kodla uyum:** Uygulamadaki bütün yazma işlemleri yalnızca sütun kullanıyor:
> - Müşteri, plan, abonelik ve olay ekleme
> - Müşteri ve plan güncelleme
> - Abonelik yenileme ve iptal
>
> İç içe yazım kullanan tek yer `auth.ts` içindeki kayıt işlemi (`users: { create }`). O da ham `prisma` kullandığı için filtreden geçmiyor ve etkilenmez.
>
> ## Değişecek fonksiyon ve kurallar
>
> `tenantIdDegistirilmesinDiye` fonksiyonu kaldırılır, yerine `veriyiDenetle(model, veri, tur)` gelir. Başka dosyaya dokunulmaz.
>
> | İşlem | Kontrol edilen veri | İzin verilen alanlar |
> |---|---|---|
> | `update`, `updateMany`, `updateManyAndReturn` | `data` | Tablonun sütunları, **`id` ve `tenantId` hariç** |
> | `create` | `data` | Tablonun sütunları (`tenantId` yine oturumdaki değerle ezilir) |
> | `createMany`, `createManyAndReturn` | `data` içindeki her satır | `create` ile aynı |
> | `upsert` | `create` kısmı ve `update` kısmı | Sırasıyla `create` ve `update` kuralı |
> | `Tenant` tablosu `update` | `data` | Tablonun sütunları, `id` hariç |
>
> **Hata mesajları:**
> - `tenantId` için mevcut mesaj aynen kalır: `tenantId değiştirilemez.` Böylece mevcut test aynen geçer.
> - Diğer bütün durumlar için: `"<alan>" alanı bu işlemde kullanılamaz: yalnızca tablonun kendi sütunları yazılabilir.`
>
> **`id` güncellemesinin de yasaklanması:** Bugün hiçbir işlem kaydın `id` değerini değiştirmiyor. Bunu yasaklamak, bileşik anahtarlarla bağlı kayıtların kopmasını da önler.
>
> ## 2. Veritabanı düzeyinde ikinci savunma hattı: **Gün 6 kapsamı dışı**
>
> Mümkün. En uygun yol, PostgreSQL'de **`tenantId` sütununu değiştirilemez yapan bir tetikleyici (trigger)**:
> - Herhangi bir tabloda `UPDATE` işlemi `tenantId` değerini değiştirmeye çalışırsa veritabanı işlemi reddeder.
> - `customers`, `plans`, `users`, `subscriptions` ve `subscription_events` tablolarına uygulanabilir.
> - Uygulama kodu ne yaparsa yapsın (ham `prisma` dahil) kayıt başka firmaya taşınamaz.
>
> Notlar:
> - SQL bir migration dosyasına elle yazılır. `subscriptions_one_active_per_customer` dizini için yaptığımızın aynısı. Projedeki "ham SQL yasak" kuralı uygulama sorguları içindir, migration dosyasını kapsamaz. Yine de ADR'de belirtilmeli.
> - Prisma tetikleyicileri şemada tanımadığı için sonraki `migrate dev --create-only` çalıştırmalarında `DROP` satırı üretip üretmediği kontrol edilmeli. Emin değilim, denenmesi gerekir.
> - Daha kapsamlı alternatif PostgreSQL Row Level Security'dir (RLS). Ama bağlantı havuzu (pooler) ile her istekte kiracıyı ayarlamak gerekir. 2 haftalık kapsam için ağır, önermiyorum.
>
> Bunun ayrı bir dal ve ayrı bir PR olmasını öneririm. Karar senin.
>
> ## 3. Doğrulama
>
> **Teste ekleme:** `tenant.test.ts` dosyasındaki "Filtre korumaları" grubuna 3 test eklenir. Toplam test sayısı 18'den 21'e çıkar.
> - İlişki alanıyla güncelleme (`tenant: { connect }`) reddedilir ve yeni hata mesajı görünür. Mevcut 11. test bunun etkisini kontrol ediyor, bu test ise reddedilmenin kendisini kontrol eder.
> - İlişki alanıyla ekleme (`customer.create` içinde `tenant: { connect }`) reddedilir.
> - İç içe yazma (`customer.update` içinde `subscriptions: { create }`) reddedilir.
>
> **Sıra:**
> 1. `npx tsc --noEmit`, `npm run lint`, `npm run build`: tipler, stil ve derleme
> 2. `npm test`: 20/20 (değişmemeli)
> 3. Kiracı izolasyonu testi: **21/21**. 11. test artık geçmeli.
> 4. Duman testi: 3/3
> 5. Tarayıcıda (`npm run dev`, manager hesabı):
>    - Müşteri ekle, güncelle (ad ve e-posta), pasife al
>    - Plan ekle, güncelle (fiyat), pasife al
>    - Abonelik başlat, yenile, iptal et
>
>    Abonelik işlemleri `$transaction` içinde ekleme ve güncelleme yaptığı için en kritik deneme bu. Her işlemde bugünkü mesajın aynısı görünmeli.
>
> **Commit sırası** (`gun6-izolasyon-testleri` dalında):
> 1. `fix: tenant filtresi yalnızca tablo sütunlarına yazmaya izin verir` (yalnızca `tenant.ts`)
> 2. `test: kiracı izolasyonu testleri ve test verisi yardımcısı` (`veri.ts` ve `tenant.test.ts`)
>
> ## Onaydan önce çalıştırman gereken kontrol
>
> ```zsh
> grep -rn "CustomerScalarFieldEnum" generated/prisma | head -5
> ```
> Bu komut, Prisma'nın ürettiği kodda müşteri tablosunun sütun listesinin nerede tanımlandığını gösterir. Yalnızca dosya yollarını ve tanım satırlarını yazar, içinde secret yoktur.
>
> Çıktıya göre:
> - **Bir satır çıkarsa:** Listeyi oradan okurum (önerdiğim yol).
> - **Çıktı boşsa:** Sütun listelerini `tenant.ts` içine elle yazarım. Şemaya yeni sütun eklendiğinde listenin de güncellenmesi gerekir. Bunu `kurallar.test.ts` içine eklenecek bir kontrolle güvenceye alırım.
>
> ---
>
> ## CAC için issue notu (bugün dokunulmuyor)
>
> GitHub'da yeni issue olarak açabilirsin:
>
> > **Başlık:** Firma güncellemesi başka bir firma kimliğiyle istendiğinde sessizce kendi firmaya uygulanıyor
> >
> > **Bulgu (Gün 6 testleri):** `tenantaBagliDb(A).tenant.update({ where: { id: B } })` hata vermiyor. `tenant.ts` filtresi `where` içindeki kimliği oturumdaki firmanın kimliğiyle değiştirdiği için güncelleme A'nın kendi kaydına uygulanıyor. B etkilenmiyor, yani sızıntı yok, ama davranış yanıltıcı.
> >
> > **Ne zaman ele alınacak:** Ayarlar (CAC) sayfası yazılırken. Seçenekler: farklı bir kimlik istendiğinde "bulunamadı" döndürmek ya da firma güncellemesini kimlik almayan tek bir yardımcı fonksiyona bağlamak.
>
> ---
>
> ## Bana yaz
> 1. `grep` çıktısı.
> 2. Plan onayı: beyaz liste, `id` ve `tenantId` yasağı, 3 ek test, iki ayrı commit.
> 3. Madde 2 (veritabanı tetikleyicisi): şimdilik "kapsam dışı" olarak not mu edilsin?
>
> Onayından sonra `tenant.ts` dosyasının tamamını vereceğim. Düzeltme ve testler bittikten sonra ADR için istediğin özeti hazırlayacağım.

### Prompt 38 · 22 Eki 2026 16:09

````text
Planı onaylıyorum: beyaz liste, id ve tenantId yasağı, 3 ek test, iki ayrı commit.

Madde 2 (veritabanı tetikleyicisi): şimdilik kapsam dışı. ADR'ye "ileride, Gün 12'de değerlendirilecek önlem" olarak yazılacak. Bugün dokunma.

CAC notunu issue olarak açacağım.

grep çıktısı:
kullanici@bilgisayar abonetakip % grep -rn "CustomerScalarFieldEnum" generated/prisma | head -5
generated/prisma/internal/prismaNamespace.ts:931:export const CustomerScalarFieldEnum = {
generated/prisma/internal/prismaNamespace.ts:940:export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum]
generated/prisma/internal/prismaNamespaceBrowser.ts:101:export const CustomerScalarFieldEnum = {
generated/prisma/internal/prismaNamespaceBrowser.ts:110:export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum]
generated/prisma/models/Customer.ts:147:  by: Prisma.CustomerScalarFieldEnum[] | Prisma.CustomerScalarFieldEnum
kullanici@bilgisayar abonetakip % 
Şimdi tenant.ts dosyasının tamamını ver ("içeriğini tamamen şununla değiştir" diyerek). Dalı açma komutundan başla (gun6-izolasyon-testleri), her komutu tek tek ver. Commit sırası: önce yalnızca tenant.ts, sonra testler.
````

### Claude cevabı 38 · 22 Eki 2026 16:10

> Plan onaylandı. `grep` çıktısına göre sütun listeleri `generated/prisma/internal/prismaNamespace.ts` dosyasından dışa aktarılıyor (`CustomerScalarFieldEnum` gibi). Beyaz listeyi doğrudan oradan okuyacağım, elle yazılmış liste olmayacak.
>
> Bu mesajda yalnızca **commit 1** var: `tenant.ts` düzeltmesi, kontrolleri ve commit. Üç ek test ve **commit 2** bir sonraki mesajda gelecek.
>
> ---
>
> ## 1. Dal
>
> Bu dalı daha önce açmıştık (`git switch -c gun6-izolasyon-testleri`). Tekrar açmaya çalışırsan "zaten var" hatası alırsın. Önce hangi dalda olduğunu kontrol et:
>
> ```zsh
> git branch --show-current
> ```
> Bu komut şu an hangi dalda olduğunu gösterir. **Beklenen:** `gun6-izolasyon-testleri`.
>
> Başka bir dal görünürse:
>
> ```zsh
> git switch gun6-izolasyon-testleri
> ```
> Bu komut var olan dala geçer. `-c` olmadığı için yeni dal açmaz.
>
> ```zsh
> git status --short --untracked-files=all
> ```
> Bu komut değişiklikleri listeler. **Beklenen:** yalnızca `?? src/lib/tenant.test.ts` ve `?? src/test-destek/veri.ts`.
>
> ## 2. `src/lib/tenant.ts`: **dosyanın içeriğini tamamen şununla değiştir**
>
> **Neler değişti?**
> - `tenantIdDegistirilmesinDiye` fonksiyonu kaldırıldı, yerine `veriyiDenetle` geldi.
> - Tabloların sütun listeleri Prisma'nın ürettiği koddan okunuyor.
> - Kontrol `create`, `createMany` ve `upsert` işlemlerine de uygulanıyor.
> - Okuma, silme ve filtreleme mantığı aynı.
>
> **Plandan küçük bir fark:** `id` güncellemesi için genel mesaj yerine kendi mesajını yazdım ("kayıt kimliği değiştirilemez"). `id` tablonun bir sütunu olduğu için genel mesaj ("yalnızca tablonun kendi sütunları yazılabilir") yanıltıcı olurdu.
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
>           if (model === "Tenant") {
>             if (OKUMA.has(operation)) {
>               a.where = { ...kosul, id: tenantId };
>               return query(a as typeof args);
>             }
>             if (operation === "update") {
>               veriyiDenetle(model, a.data, "guncelleme");
>               a.where = { ...kosul, id: tenantId };
>               return query(a as typeof args);
>             }
>             throw new Error(`Firma tablosunda "${operation}" işlemine izin verilmez.`);
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
> ## 3. Kontroller (sırayla, biri başarısız olursa dur)
>
> `npm run dev` açıksa önce Ctrl+C ile kapat.
>
> ```zsh
> npx tsc --noEmit
> ```
> Bu komut tip kontrolü yapar. Sütun listelerinin içe aktarma yolu ve adları yanlışsa burada hata verir. **Beklenen:** çıktı yok.
>
> ```zsh
> npm run lint
> ```
> Bu komut stil kontrolü yapar. **Beklenen:** hata yok.
>
> ```zsh
> npm test
> ```
> Bu komut veritabanı gerektirmeyen testleri çalıştırır. Statik kural testi `tenant.ts` dosyasını yeniden tarar. **Beklenen:** `pass 20`, `fail 0`.
>
> ```zsh
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test src/test-destek/duman.test.ts
> ```
> Bu komut yeni `tenant.ts` dosyasının, ürettiği Prisma koduyla birlikte Node'da yüklenebildiğini kontrol eder. **Beklenen:** `pass 3`, `fail 0`.
>
> ```zsh
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test src/lib/tenant.test.ts
> ```
> Bu komut kiracı izolasyonu testlerini test dalında çalıştırır. **Beklenen:** `pass 18`, `fail 0`. 11. test ("OLASI AÇIK") artık geçmeli.
>
> ```zsh
> npm run build
> ```
> Bu komut uygulamayı canlıya çıkacak hâliyle derler. **Beklenen:** hatasız biter.
>
> ```zsh
> npm run dev
> ```
> Bu komut uygulamayı bilgisayarında çalıştırır.
>
> **Tarayıcı denemesi** (manager hesabıyla). Her işlemde bugüne kadar gördüğün mesaj aynen görünmeli:
>
> | # | İşlem | Beklenen |
> |---|---|---|
> | 1 | Müşteri ekle | "… müşterisi eklendi." |
> | 2 | Müşteriyi güncelle (ad ve e-posta) | "Değişiklikler kaydedildi." |
> | 3 | Müşteriyi pasife al (aboneliği olmayan) | "Müşteri pasife alındı." |
> | 4 | Plan ekle | "… planı eklendi." |
> | 5 | Planı güncelle (fiyat, aboneliği olmayan plan) | "Değişiklikler kaydedildi." |
> | 6 | Planı pasife al (aboneliği olmayan) | "Plan pasife alındı." |
> | 7 | Abonelik başlat | "… için abonelik başlatıldı." |
> | 8 | Aboneliği yenile | "Abonelik yenilendi." |
> | 9 | Aboneliği iptal et | "Abonelik iptal edildi." |
>
> 7–9. satırlar en kritik deneme: abonelik işlemleri `$transaction` içinde hem ekleme hem güncelleme yapıyor. Bir işlemde "İşlem tamamlanamadı" görürsen dur. `npm run dev` terminalinde görünen hata satırını bana yaz. Yeni koruma bir alanı yanlışlıkla engelliyorsa hata mesajı `"... alanı bu işlemde kullanılamaz"` biçiminde olur.
>
> ## 4. Commit 1 (yalnızca `tenant.ts`, hepsi geçtiyse)
>
> Tarayıcı denemesi bitince `npm run dev` sunucusunu Ctrl+C ile kapat.
>
> ```zsh
> git add src/lib/tenant.ts
> ```
> Bu komut yalnızca `tenant.ts` dosyasını commit'e hazırlar. `veri.ts` ve `tenant.test.ts` bu commit'e girmez.
>
> ```zsh
> git --no-pager diff --cached --stat
> ```
> Bu komut commit'e hazırlanan dosyaları listeler. **Beklenen:** yalnızca `src/lib/tenant.ts`.
>
> ```zsh
> git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"
> ```
> Bu komut parola izi arar. **Beklenen:** boş çıktı.
>
> ```zsh
> git commit -m "fix: tenant filtresi yalnızca tablo sütunlarına yazmaya izin verir"
> ```
> Bu komut düzeltmeyi `gun6-izolasyon-testleri` dalına ayrı bir commit olarak kaydeder.
>
> ## Bana yaz
> 1. `tsc`, `lint`, `npm test` ve duman testi sonuçları.
> 2. İzolasyon testi: pass ve fail sayıları. 11. test geçti mi?
> 3. `npm run build` sonucu.
> 4. Tarayıcı tablosundaki 9 satırın sonucu.
> 5. Commit başarılı mı?
>
> Sonra üç ek testi ve commit 2'yi vereceğim.
>
> ## Varsayımlar ve emin olmadığım yerler
> - `generated/prisma/internal/prismaNamespace.ts` dosyasının diğer tablolar için de aynı adlandırmayla liste ürettiğini varsayıyorum: `TenantScalarFieldEnum`, `SubscriptionEventScalarFieldEnum` gibi. Yanlışsa `npx tsc --noEmit` hangi adın bulunamadığını söyleyecek.
> - `internal` klasöründen içe aktarmak, Prisma'nın iç dosya düzenine bağlı kalmak demek. Prisma güncellenince yol değişebilir. Değişirse tip kontrolü ve testler bunu hemen yakalar.
> - Prisma'nın bir sorgunun `data` kısmını filtreye kullanıcının yazdığı biçimde verdiğini varsayıyorum. Duman testi, izolasyon testleri ve tarayıcı denemesi bunu birlikte doğrulayacak.

### Prompt 39 · 22 Eki 2026 16:18

````text
testler beklediğimiz gibi , kullanici@bilgisayar abonetakip % git add src/lib/tenant.ts
kullanici@bilgisayar abonetakip % git --no-pager diff --cached --stat
 src/lib/tenant.ts | 77 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++-------
 1 file changed, 70 insertions(+), 7 deletions(-)
kullanici@bilgisayar abonetakip % git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"
kullanici@bilgisayar abonetakip % git commit -m "fix: tenant filtresi yalnızca tablo sütunlarına yazmaya izin verir"
[gun6-izolasyon-testleri 9871f2b] fix: tenant filtresi yalnızca tablo sütunlarına yazmaya izin verir
 1 file changed, 70 insertions(+), 7 deletions(-)
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 39 · 22 Eki 2026 16:19

> Commit 1 tamam: `9871f2b`, yalnızca `tenant.ts`, parola izi yok. 11. test artık geçiyor ve uygulama davranışı değişmedi.
>
> ## Commit 2: Üç ek test, sonra testler ve test verisi yardımcısı
>
> ### Ek testler
>
> "Filtre korumaları" grubuna, mevcut 11. testin **önüne** üç test ekleniyor:
>
> | # | Test | Ne kontrol eder |
> |---|---|---|
> | 1 | İlişki alanıyla güncelleme reddedilir | `customer.update` içinde `tenant: { connect }` yeni hata mesajıyla reddedilir |
> | 2 | İlişki alanıyla ekleme reddedilir | `customer.create` içinde `tenant: { connect }` reddedilir, hiçbir firmada kayıt oluşmaz |
> | 3 | İç içe yazma reddedilir | `customer.update` içinde `subscriptions: { connect }` reddedilir, B'nin aboneliği yerinde kalır |
>
> **Plandan bir fark:** 3. testte `subscriptions: { create }` yerine `subscriptions: { connect }` kullandım. Aboneliğin müşteri, plan ve firma ile bileşik bağları olduğu için `create` sürümünün TypeScript tipleri çok karmaşık oluyor. `connect` aynı mekanizmayı (ilişki alanı altında iç içe yazma) test ediyor. Ayrıca daha gerçekçi bir saldırıyı temsil ediyor: B'nin aboneliğini A'nın müşterisine çekmek.
>
> Toplam test sayısı **18'den 21'e** çıkıyor.
>
> ### `src/lib/tenant.test.ts`: **dosyanın içeriğini tamamen şununla değiştir**
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
>   test("A, B'nin firma ayarını (CAC) değiştiremez", async () => {
>     // Not: filtre "where" içindeki kimliği oturumdaki firmayla değiştirir.
>     // Bu yüzden bu istek B'ye değil A'nın kendi kaydına uygulanır. Önemli olan B'nin değişmemesi.
>     // (Bilinen davranış, issue olarak kayıtlı: Ayarlar sayfası yazılırken ele alınacak.)
>     await dbA.tenant.update({ where: { id: B.tenantId }, data: { cac: 999 } });
>     const b = await dbB.tenant.findFirst({ select: { cac: true } });
>     assert.equal(b?.cac, 0);
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
> ```
>
> ### Kontroller
>
> ```zsh
> npx tsc --noEmit
> ```
> Bu komut yeni testlerin tiplerini kontrol eder. Özellikle ilişki alanlı sorguların TypeScript tarafından kabul edildiğini doğrular. **Beklenen:** çıktı yok.
>
> ```zsh
> npm run lint
> ```
> Bu komut stil kontrolü yapar. **Beklenen:** hata yok.
>
> ```zsh
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test src/lib/tenant.test.ts
> ```
> Bu komut kiracı izolasyonu testlerini test dalında çalıştırır. **Beklenen:** `tests 21`, `pass 21`, `fail 0`.
>
> ### Commit 2 (hepsi geçtiyse)
>
> ```zsh
> git add src/test-destek/veri.ts src/lib/tenant.test.ts
> ```
> Bu komut test verisi yardımcısını ve izolasyon testlerini commit'e hazırlar.
>
> ```zsh
> git --no-pager diff --cached --stat
> ```
> Bu komut commit'e hazırlanan dosyaları listeler. **Beklenen:** yalnızca bu 2 dosya.
>
> ```zsh
> git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"
> ```
> Bu komut parola izi arar. **Beklenen:** boş çıktı.
>
> ```zsh
> git commit -m "test: kiracı izolasyonu testleri ve test verisi yardımcısı"
> ```
> Bu komut iki dosyayı `gun6-izolasyon-testleri` dalına kaydeder.
>
> ## Bana yaz
> 1. `tsc` ve `lint` sonuçları.
> 2. İzolasyon testi: tests, pass ve fail sayıları. `✖` varsa adı ve altındaki ilk 4–5 satır.
> 3. Commit başarılı mı?
>
> 21/21 geçerse ADR için istediğin özeti ("Bilinen açıklar ve alınan önlemler") vereceğim. Ardından Parça 7'ye (rol testleri, `pasife-alma.test.ts`) geçeceğiz.

### Prompt 40 · 22 Eki 2026 16:21

````text
kullanici@bilgisayar abonetakip % npx tsc --noEmit
kullanici@bilgisayar abonetakip % npm run lint

> abonetakip@0.1.0 lint
> eslint

kullanici@bilgisayar abonetakip % node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test src/lib/tenant.test.ts
(node:68830) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/tenant.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:68830) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://ww for libpq SSL mode definitions.
▶ Müşteriler
  ✔ liste yalnızca A'nın müşterilerini getirir (74.139417ms)
  ✔ B'nin müşterisi kimlikle aranınca bulunamaz (findFirst ve findUnique) (115.35625ms)
  ✔ B'nin müşterisi güncellenemez ve pasife alınamaz, kaydı değişmez (263.58475ms)
  ✔ eklerken gönderilen B tenantId'si yok sayılır, kayıt A'ya yazılır (116.486083ms)
✔ Müşteriler (2470.507917ms)
▶ Planlar
  ✔ liste yalnızca A'nın planlarını getirir (57.681958ms)
  ✔ B'nin planı kimlikle aranınca bulunamaz (115.050042ms)
  ✔ B'nin planı güncellenemez ve pasife alınamaz, kaydı değişmez (179.458083ms)
✔ Planlar (353.209583ms)
▶ Abonelikler ve olaylar
  ✔ liste yalnızca A'nın aboneliklerini getirir (57.436834ms)
  ✔ B'nin aboneliği kimlikle aranınca bulunamaz (118.812917ms)
  ✔ işlem (transaction) içinde de B'nin aboneliği iptal edilemez ve yenilenemez (457.70175ms)
  ✔ A adına B'nin müşterisi ve planıyla abonelik oluşturulamaz (veritabanı reddeder) (521.496667ms)
  ✔ A adına B'nin aboneliğine olay yazılamaz (veritabanı reddeder) (528.239583ms)
  ✔ aktifAbonelikVarMi, A adına sorulunca B'nin aboneliklerini saymaz (226.503667ms)
✔ Abonelikler ve olaylar (1911.849292ms)
▶ Firma tablosu
  ✔ A yalnızca kendi firmasını görür (126.987709ms)
  ✔ A, B'nin firma ayarını (CAC) değiştiremez (117.649458ms)
  ✔ firma eklenemez ve silinemez (1.054791ms)
✔ Firma tablosu (246.173709ms)
▶ Filtre korumaları
  ✔ güncelleme verisinde tenantId varsa işlem durdurulur (56.555208ms)
  ✔ ilişki alanıyla güncelleme reddedilir (tenant: connect) (0.786334ms)
  ✔ ilişki alanıyla ekleme reddedilir (tenant: connect), hiçbir firmada kayıt oluşmaz (111.768458ms)
  ✔ iç içe yazma reddedilir (subscriptions: connect), B'nin aboneliği yerinde kalır (56.795084ms)
  ✔ kayıt ilişki üzerinden (tenant: connect) başka firmaya taşınamaz (176.950583ms)
✔ Filtre korumaları (403.6935ms)
ℹ tests 21
ℹ suites 5
ℹ pass 21
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 6173.880791
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 40 · 22 Eki 2026 16:21

> **21/21 geçti.** Üç ek test de geçti:
> - İlişki alanıyla güncelleme ve ekleme yeni hata mesajıyla reddediliyor.
> - İç içe yazma da reddediliyor ve B'nin aboneliği yerinde kalıyor.
> - Açığı ilk bulan test de artık geçiyor.
>
> `tsc` ve `lint` temiz. Temizlik de sorunsuz.
>
> Çıktıda **commit 2** görünmüyor. Şu dört komutu sırayla çalıştır:
>
> ```zsh
> git add src/test-destek/veri.ts src/lib/tenant.test.ts
> ```
> Bu komut test verisi yardımcısını ve izolasyon testlerini commit'e hazırlar.
>
> ```zsh
> git --no-pager diff --cached --stat
> ```
> Bu komut commit'e hazırlanan dosyaları listeler. **Beklenen:** yalnızca bu 2 dosya.
>
> ```zsh
> git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"
> ```
> Bu komut parola izi arar. **Beklenen:** boş çıktı.
>
> ```zsh
> git commit -m "test: kiracı izolasyonu testleri ve test verisi yardımcısı"
> ```
> Bu komut iki dosyayı `gun6-izolasyon-testleri` dalına kaydeder.
>
> ---
>
> ## ADR özeti: Gün 6, "Bilinen açıklar ve alınan önlemler"
>
> `docs/02_ADR.md` dosyasına yapıştırabileceğin hâli:
>
> ```markdown
> ### Gün 6: Bilinen açıklar ve alınan önlemler
>
> **Açık 1: Kayıt, ilişki alanı üzerinden başka firmaya taşınabiliyordu (düzeltildi)**
>
> - **Ne bulundu:** Kiracı izolasyonu testleri, tenant filtresinin yalnızca `data.tenantId`
>   alanını engellediğini gösterdi. Prisma'da aynı değişiklik ilişki üzerinden de yazılabiliyor:
>   `customer.update({ data: { tenant: { connect: { id: "B" } } } })`. Bu sorgu A firmasının
>   müşterisini B firmasına taşıdı.
> - **Bugünkü risk (düzeltme öncesi):** Düşüktü. Uygulamadaki hiçbir sunucu işlemi bu yazımı
>   kullanmıyordu ve form verisi doğrudan `data` içine konmuyordu. Ancak ileride yazılacak bir
>   özellik bu kalıbı kullansaydı firmalar arası veri taşınabilirdi. Kiracı izolasyonu MUST
>   olduğu için düzeltildi.
> - **Ne yapıldı:** `src/lib/tenant.ts` içine beyaz liste eklendi. Ekleme ve güncellemede
>   (create, createMany, update, updateMany, upsert) yalnızca tablonun kendi sütunları
>   yazılabilir. Sütun listeleri Prisma'nın şemadan ürettiği koddan okunur. İlişki alanları
>   ve onların altındaki bütün iç içe yazımlar (connect, create, connectOrCreate) en üst düzeyde
>   reddedilir. Güncellemede `id` ve `tenantId` değiştirilemez. Tanınmayan tablo veya işlemde
>   filtre durdurur (fail-closed).
> - **Kanıt:** `src/lib/tenant.test.ts` (21 test). Açığı bulan test düzeltmeden önce
>   başarısız, sonra başarılı. İlişki alanıyla güncelleme, ekleme ve iç içe yazma için ayrı
>   testler var.
> - **Neyi kapsamıyor:**
>   - Ham `prisma` kullanan dosyalar filtreden geçmez: `auth.ts` (kayıt/giriş) ve
>     `test-destek/veri.ts` (test verisi). Hangi dosyaların ham `prisma` kullanabileceği
>     `kurallar.test.ts` ile denetlenir.
>   - Koruma uygulama katmanındadır. Veritabanı düzeyinde `tenantId` değişikliğini engelleyen
>     bir kural (tetikleyici) yoktur. Abonelik ve olay tabloları bileşik anahtarlarla ek koruma
>     altındadır. Müşteri, plan ve kullanıcı tablolarında bu ikinci hat yoktur.
>   - Beyaz liste Prisma'nın iç dosya yoluna (`generated/prisma/internal/prismaNamespace`)
>     bağlıdır. Prisma güncellenince yol değişebilir. Değişirse tip kontrolü ve testler
>     bunu yakalar.
>
> **İleride değerlendirilecek önlem (Gün 12):** PostgreSQL tetikleyicisi ile `tenantId`
> sütununu değiştirilemez yapmak (customers, plans, users, subscriptions, subscription_events).
> Böylece uygulama kodu ne yaparsa yapsın kayıt başka firmaya taşınamaz. SQL, migration
> dosyasına elle yazılır. Prisma'nın sonraki migration'larda bu tetikleyiciyi silmeye
> çalışıp çalışmadığı kontrol edilmelidir.
>
> **Açık 2: Firma güncellemesi başka firma kimliğiyle istenince kendi firmaya uygulanıyor (açık, issue)**
>
> - `tenant.update({ where: { id: B } })` hata vermiyor. Filtre kimliği oturumdaki firmayla
>   değiştirdiği için güncelleme A'nın kendi kaydına uygulanıyor. B etkilenmiyor, yani sızıntı
>   yok, ama davranış yanıltıcı. Ayarlar (CAC) sayfası yazılırken ele alınacak.
>
> **Doğrulanan güvenceler (Gün 6 testleri):**
> - Tenant filtresi `$transaction` içindeki sorgulara da uygulanıyor.
> - Başka firmanın müşterisi ve planıyla abonelik açmak ya da başka firmanın aboneliğine olay
>   yazmak veritabanı düzeyinde reddediliyor (bileşik anahtarlar).
> - Oturum çerezi değiştirilirse (kullanıcı kimliği, imza, anahtar) geçersiz sayılıyor.
> - Ham `prisma` yalnızca izinli dosyalarda kullanılıyor, ham SQL hiçbir yerde yok.
> - Pasife alma işlemleri yalnızca manager'a açık. Bu, `pasife-alma.test.ts` tamamlanınca
>   doğrulanacak.
> ```
>
> Son maddeyi Parça 7 (rol testleri) geçince "doğrulanacak" yerine "doğrulandı" olarak güncelleyebilirsin.
>
> ## Bana yaz
> 1. Commit 2 başarılı mı? `diff --cached --stat` 2 dosya mı gösterdi?
>
> Sonra **Parça 7**'ye (`pasife-alma.test.ts`, rol testleri) geçeceğiz.

### Prompt 41 · 22 Eki 2026 16:22

````text
kullanici@bilgisayar abonetakip % git add src/test-destek/veri.ts src/lib/tenant.test.ts
kullanici@bilgisayar abonetakip % git --no-pager diff --cached --stat
 src/lib/tenant.test.ts  | 296 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 src/test-destek/veri.ts | 162 ++++++++++++++++++++++++++++++++++++++++++++
 2 files changed, 458 insertions(+)
kullanici@bilgisayar abonetakip % git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"
kullanici@bilgisayar abonetakip % git commit -m "test: kiracı izolasyonu testleri ve test verisi yardımcısı"
[gun6-izolasyon-testleri 7159d7f] test: kiracı izolasyonu testleri ve test verisi yardımcısı
 2 files changed, 458 insertions(+)
 create mode 100644 src/lib/tenant.test.ts
 create mode 100644 src/test-destek/veri.ts
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 41 · 22 Eki 2026 16:23

> Commit 2 tamam: `7159d7f`, 2 dosya, parola izi yok. Dalda şu an iki commit var: düzeltme ve testler.
>
> ## Parça 7: `src/lib/pasife-alma.test.ts` (C, rol testleri)
>
> **Ne test eder?** Adım 3'te test edilebilir hâle getirdiğimiz çekirdek fonksiyonları (`musteriPasifeAlCekirdek`, `planPasifeAlCekirdek`). Bugün kodda var olan rol kısıtlı işlemler yalnızca bu ikisi. Testler, action dosyalarının çağırdığı fonksiyonun aynısını çağırıyor. Tek fark, kullanıcı ve veritabanı nesnesinin oturumdan değil testten verilmesi.
>
> Toplam **9 test**, 3 grupta:
>
> | Grup | Test | Beklenen |
> |---|---|---|
> | finance kullanıcısı | Müşteriyi pasife alma | "Bu işlemi yalnızca firma yöneticisi yapabilir.", kayıt değişmez |
> | | Planı pasife alma | Aynı |
> | manager: engellenen | B'nin müşterisi | "Kayıt bulunamadı.", B'nin kaydı değişmez |
> | | B'nin planı | Aynı |
> | | Biçimi bozuk kimlik | "Kayıt bulunamadı." |
> | | Aktif aboneliği olan müşteri | "…aktif aboneliği var…" (Gün 5 kuralı) |
> | | Aktif aboneliği olan plan | "…aktif abonelikleri var…" (Gün 5 kuralı) |
> | manager: başarılı | Boş müşteri | "Müşteri pasife alındı.", ikinci denemede "zaten pasif" |
> | | Boş plan | "Plan pasife alındı.", ikinci denemede "zaten pasif" |
>
> Kaydı gerçekten pasife alan testler bilerek en sonda, çünkü önceki testler o kayıtların aktif olduğunu varsayıyor.
>
> **Yeni dosya oluştur:** `src/lib/pasife-alma.test.ts`
>
> ```ts
> // ROL TESTLERİ: PASİFE ALMA (Gün 6)
> //
> // Ne test edilir? src/lib/pasife-alma.ts içindeki çekirdek fonksiyonlar.
> // Bugün kodda var olan rol kısıtlı işlemler yalnızca bunlardır:
> //   - müşteri pasife alma (yalnızca manager)
> //   - plan pasife alma    (yalnızca manager)
> // Testler, sunucu işlemlerinin (actions.ts) çağırdığı fonksiyonun aynısını çağırır.
> // Tek fark: kullanıcı ve veritabanı nesnesi oturumdan değil, testten verilir.
> //
> // Sıra önemlidir: kaydı GERÇEKTEN pasife alan testler en sondadır.
> // Çalıştırmak için: npm run test:db
>
> import { describe, test, before, after } from "node:test";
> import assert from "node:assert/strict";
> // Önce test verisi yardımcısı: TEST_VERITABANI kontrolü onun içinde yapılır.
> import {
>   testFirmasiOlustur,
>   testVerisiniTemizle,
>   baglantiyiKapat,
>   type TestFirmasi,
> } from "../test-destek/veri.ts";
> import { tenantaBagliDb, type TenantDb } from "./tenant.ts";
> import { musteriPasifeAlCekirdek, planPasifeAlCekirdek } from "./pasife-alma.ts";
> import { MESAJ } from "./islem.ts";
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
> // Kısa yardımcılar: kayıt hâlâ aktif mi?
> async function musteriAktifMi(db: TenantDb, id: string): Promise<boolean | undefined> {
>   return (await db.customer.findFirst({ where: { id }, select: { isActive: true } }))?.isActive;
> }
> async function planAktifMi(db: TenantDb, id: string): Promise<boolean | undefined> {
>   return (await db.plan.findFirst({ where: { id }, select: { isActive: true } }))?.isActive;
> }
>
> describe("finance kullanıcısı", () => {
>   test("müşteriyi pasife alamaz, kayıt değişmez", async () => {
>     const sonuc = await musteriPasifeAlCekirdek({ role: "finance" }, dbA, A.bosMusteriId);
>     assert.equal(sonuc.durum, "hata");
>     assert.equal(sonuc.mesaj, MESAJ.yetkiYok);
>     assert.equal(await musteriAktifMi(dbA, A.bosMusteriId), true);
>   });
>
>   test("planı pasife alamaz, kayıt değişmez", async () => {
>     const sonuc = await planPasifeAlCekirdek({ role: "finance" }, dbA, A.bosPlanId);
>     assert.equal(sonuc.durum, "hata");
>     assert.equal(sonuc.mesaj, MESAJ.yetkiYok);
>     assert.equal(await planAktifMi(dbA, A.bosPlanId), true);
>   });
> });
>
> describe("manager kullanıcısı: engellenen durumlar", () => {
>   test("B'nin müşterisi için 'Kayıt bulunamadı.' alır, B'nin kaydı değişmez", async () => {
>     const sonuc = await musteriPasifeAlCekirdek({ role: "manager" }, dbA, B.bosMusteriId);
>     assert.equal(sonuc.mesaj, MESAJ.bulunamadi);
>     assert.equal(await musteriAktifMi(dbB, B.bosMusteriId), true);
>   });
>
>   test("B'nin planı için 'Kayıt bulunamadı.' alır, B'nin kaydı değişmez", async () => {
>     const sonuc = await planPasifeAlCekirdek({ role: "manager" }, dbA, B.bosPlanId);
>     assert.equal(sonuc.mesaj, MESAJ.bulunamadi);
>     assert.equal(await planAktifMi(dbB, B.bosPlanId), true);
>   });
>
>   test("biçimi bozuk kimlik için 'Kayıt bulunamadı.' alır", async () => {
>     const sonuc = await musteriPasifeAlCekirdek({ role: "manager" }, dbA, "BOZUK-KIMLIK!");
>     assert.equal(sonuc.mesaj, MESAJ.bulunamadi);
>   });
>
>   test("aktif aboneliği olan müşteri pasife alınamaz (Gün 5 kuralı)", async () => {
>     const sonuc = await musteriPasifeAlCekirdek({ role: "manager" }, dbA, A.abonelikliMusteriId);
>     assert.equal(sonuc.durum, "hata");
>     assert.match(sonuc.mesaj ?? "", /aktif aboneliği var/);
>     assert.equal(await musteriAktifMi(dbA, A.abonelikliMusteriId), true);
>   });
>
>   test("aktif aboneliği olan plan pasife alınamaz (Gün 5 kuralı)", async () => {
>     const sonuc = await planPasifeAlCekirdek({ role: "manager" }, dbA, A.abonelikliPlanId);
>     assert.equal(sonuc.durum, "hata");
>     assert.match(sonuc.mesaj ?? "", /aktif abonelikleri var/);
>     assert.equal(await planAktifMi(dbA, A.abonelikliPlanId), true);
>   });
> });
>
> describe("manager kullanıcısı: başarılı pasife alma", () => {
>   test("aboneliği olmayan müşteriyi pasife alır, ikinci denemede 'zaten pasif' der", async () => {
>     const ilk = await musteriPasifeAlCekirdek({ role: "manager" }, dbA, A.bosMusteriId);
>     assert.equal(ilk.durum, "basarili");
>     assert.equal(ilk.mesaj, "Müşteri pasife alındı.");
>     assert.equal(await musteriAktifMi(dbA, A.bosMusteriId), false);
>
>     const ikinci = await musteriPasifeAlCekirdek({ role: "manager" }, dbA, A.bosMusteriId);
>     assert.equal(ikinci.mesaj, "Bu müşteri zaten pasif.");
>   });
>
>   test("aboneliği olmayan planı pasife alır, ikinci denemede 'zaten pasif' der", async () => {
>     const ilk = await planPasifeAlCekirdek({ role: "manager" }, dbA, A.bosPlanId);
>     assert.equal(ilk.durum, "basarili");
>     assert.equal(ilk.mesaj, "Plan pasife alındı.");
>     assert.equal(await planAktifMi(dbA, A.bosPlanId), false);
>
>     const ikinci = await planPasifeAlCekirdek({ role: "manager" }, dbA, A.bosPlanId);
>     assert.equal(ikinci.mesaj, "Bu plan zaten pasif.");
>   });
> });
> ```
>
> ### Kontroller
>
> ```zsh
> npx tsc --noEmit
> ```
> Bu komut yeni testin tiplerini kontrol eder. **Beklenen:** çıktı yok.
>
> ```zsh
> npm run lint
> ```
> Bu komut stil kontrolü yapar. **Beklenen:** hata yok.
>
> ```zsh
> node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test src/lib/pasife-alma.test.ts
> ```
> Bu komut rol testlerini test dalında çalıştırır. Kendi iki sahte firmasını oluşturur ve sonunda siler. **Beklenen:** `tests 9`, `pass 9`, `fail 0`.
>
> ### Commit (hepsi geçtiyse)
>
> ```zsh
> git add src/lib/pasife-alma.test.ts
> ```
> Bu komut rol testlerini commit'e hazırlar.
>
> ```zsh
> git --no-pager diff --cached --stat
> ```
> Bu komut commit'e hazırlanan dosyaları listeler. **Beklenen:** yalnızca bu 1 dosya.
>
> ```zsh
> git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"
> ```
> Bu komut parola izi arar. **Beklenen:** boş çıktı.
>
> ```zsh
> git commit -m "test: pasife alma rol testleri (finance yetkisi)"
> ```
> Bu komut rol testlerini `gun6-izolasyon-testleri` dalına kaydeder.
>
> ## Bana yaz
> 1. `tsc` ve `lint` sonuçları.
> 2. Rol testi: tests, pass ve fail sayıları. `✖` varsa adı ve altındaki ilk 4–5 satır.
> 3. Commit başarılı mı?
>
> Sonra **Parça 8**'e geçeceğiz: `package.json` dosyasına `test:db` betiği, bütün testlerin tek komutla çalıştırılması ve son build.

### Prompt 42 · 22 Eki 2026 16:24

````text
ADR özetini aldım, teşekkürler. Gün 6 bitince ADR'ye girecek bölümün tamamını tek seferde isteyeceğim. Şimdiden şu kararlar da o bölüme girsin diye aklında tut: Neon test dalı (Yol B) ve neden, node --test (Vitest yerine) ve neden, pasife alma çekirdeğine ayırma (yetki.ts, pasife-alma.ts) ve neden, test verisi için ham prisma istisnası (src/test-destek/veri.ts) ve güvenceleri (TEST_VERITABANI işareti, .env.test), main'e doğrudan push edildiği olay ve alınan kural (bundan sonra PR). Son maddedeki "pasife-alma.test.ts tamamlanınca doğrulanacak" ifadesini testler geçince "doğrulandı"ya çevir.

Şimdi işe devam: tenant.ts dosyasını ver.
````

### Claude cevabı 42 · 22 Eki 2026 16:24

> ADR notlarını aldım. Gün 6 bölümünü istediğinde şunları da içerecek:
> - Neon test dalı (Yol B) ve neden
> - `node --test` (Vitest yerine) ve neden
> - Pasife alma çekirdeğine ayırma (`yetki.ts`, `pasife-alma.ts`) ve neden
> - Ham `prisma` istisnası (`veri.ts`) ve güvenceleri (`TEST_VERITABANI` işareti, `.env.test`)
> - Main'e doğrudan push olayı ve alınan kural (bundan sonra PR)
>
> Rol testleri geçince "doğrulanacak" ifadesini "doğrulandı" olarak yazacağım.
>
> ---
>
> **`tenant.ts` zaten tamamlandı ve commit edildi**, onu tekrar uygulamana gerek yok:
> - Beyaz listeli hâli iki mesaj önce verdim.
> - Kontrolleri ve tarayıcı denemesini geçtin.
> - `9871f2b` commit'iyle (`fix: tenant filtresi yalnızca tablo sütunlarına yazmaya izin verir`) `gun6-izolasyon-testleri` dalına kaydettin.
> - Ardından 21/21 izolasyon testiyle de doğrulandı.
>
> Dosyanın şu anki hâlini görmek istersen VS Code'da `src/lib/tenant.ts` dosyasını açman yeterli. Ya da şu komutu çalıştırabilirsin:
>
> ```zsh
> git --no-pager log --oneline -3
> ```
> Bu komut dalın son üç commit'ini listeler. **Beklenen:** en üstte `7159d7f test: kiracı izolasyonu...`, altında `9871f2b fix: tenant filtresi...`.
>
> **Sıradaki iş Parça 7:** `src/lib/pasife-alma.test.ts`, yani rol testleri. Dosyanın tam içeriği, kontrol komutları ve commit adımları bir önceki mesajımda. Oradan devam et ve sonuçları bana yaz.
>
> Başka bir şeyi kastettiysen söyle. Örneğin `tenant.ts` dosyasında bir değişiklik yapmak istiyorsan ya da dosyayla ilgili bir sorun gördüysen.

### Prompt 43 · 22 Eki 2026 16:27

````text
kullanici@bilgisayar abonetakip % npx tsc --noEmit
kullanici@bilgisayar abonetakip % npm run lint

> abonetakip@0.1.0 lint
> eslint

kullanici@bilgisayar abonetakip % node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test src/lib/pasife-alma.test.ts
(node:69002) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/kullanici/Projeler/abonetakip/src/lib/pasife-alma.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/kullanici/Projeler/abonetakip/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:69002) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://ww for libpq SSL mode definitions.
▶ finance kullanıcısı
  ✔ müşteriyi pasife alamaz, kayıt değişmez (76.812917ms)
  ✔ planı pasife alamaz, kayıt değişmez (60.18475ms)
✔ finance kullanıcısı (3125.991042ms)
▶ manager kullanıcısı: engellenen durumlar
  ✔ B'nin müşterisi için 'Kayıt bulunamadı.' alır, B'nin kaydı değişmez (108.635667ms)
  ✔ B'nin planı için 'Kayıt bulunamadı.' alır, B'nin kaydı değişmez (113.914083ms)
  ✔ biçimi bozuk kimlik için 'Kayıt bulunamadı.' alır (0.46925ms)
  ✔ aktif aboneliği olan müşteri pasife alınamaz (Gün 5 kuralı) (240.331791ms)
  ✔ aktif aboneliği olan plan pasife alınamaz (Gün 5 kuralı) (173.179042ms)
✔ manager kullanıcısı: engellenen durumlar (637.626875ms)
▶ manager kullanıcısı: başarılı pasife alma
  ✔ aboneliği olmayan müşteriyi pasife alır, ikinci denemede 'zaten pasif' der (323.420875ms)
  ✔ aboneliği olmayan planı pasife alır, ikinci denemede 'zaten pasif' der (282.376792ms)
✔ manager kullanıcısı: başarılı pasife alma (606.908791ms)
ℹ tests 9
ℹ suites 3
ℹ pass 9
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 5234.616375
kullanici@bilgisayar abonetakip %
````

### Claude cevabı 43 · 22 Eki 2026 16:27

> Parça 7 geçti: **9/9**. Finance kullanıcısı müşteriyi de planı da pasife alamıyor ve kayıtlar değişmiyor. Manager için B'nin kayıtları "bulunamadı" dönüyor, Gün 5 kuralı korunuyor ve başarılı pasife alma çalışıyor. ADR'deki son madde artık **"doğrulandı"**.
>
> ## Parça 7 commit
>
> ```zsh
> git add src/lib/pasife-alma.test.ts
> ```
> Bu komut rol testlerini commit'e hazırlar.
>
> ```zsh
> git --no-pager diff --cached --stat
> ```
> Bu komut commit'e hazırlanan dosyaları listeler. **Beklenen:** yalnızca bu 1 dosya.
>
> ```zsh
> git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"
> ```
> Bu komut parola izi arar. **Beklenen:** boş çıktı.
>
> ```zsh
> git commit -m "test: pasife alma rol testleri (finance yetkisi)"
> ```
> Bu komut rol testlerini dala kaydeder.
>
> ---
>
> ## Parça 8: `test:db` betiği ve son kontroller
>
> ### `package.json`: **dosyanın içeriğini tamamen şununla değiştir**
>
> `scripts` bölümüne yalnızca `"test:db"` satırı eklendi:
> - `--env-file=.env.test`: yalnızca test dalına bağlanır
> - `--test-concurrency=1`: dosyalar sırayla çalışır, böylece Neon'un bağlantı sınırı zorlanmaz
>
> ```json
> {
>   "name": "abonetakip",
>   "version": "0.1.0",
>   "private": true,
>   "scripts": {
>     "dev": "next dev",
>     "build": "next build",
>     "start": "next start",
>     "lint": "eslint",
>     "test": "node --import ./src/test-destek/kancalar.mjs --test src/lib/donem.test.ts src/lib/yetki.test.ts src/lib/session.test.ts src/test-destek/kurallar.test.ts",
>     "test:db": "node --env-file=.env.test --import ./src/test-destek/kancalar.mjs --test --test-concurrency=1 src/test-destek/duman.test.ts src/lib/tenant.test.ts src/lib/pasife-alma.test.ts"
>   },
>   "dependencies": {
>     "@prisma/adapter-pg": "^7.10.1",
>     "@prisma/client": "^7.10.1",
>     "bcryptjs": "^3.0.3",
>     "next": "16.4.2",
>     "react": "19.3.0",
>     "react-dom": "19.3.0"
>   },
>   "devDependencies": {
>     "@tailwindcss/turbopack": "^4",
>     "@types/node": "^20",
>     "@types/react": "^19",
>     "@types/react-dom": "^19",
>     "dotenv": "^18.0.8",
>     "eslint": "^9",
>     "eslint-config-next": "16.4.2",
>     "prisma": "^7.10.1",
>     "tailwindcss": "^4",
>     "typescript": "^5"
>   }
> }
> ```
>
> ### Son kontroller
>
> ```zsh
> npm test
> ```
> Bu komut veritabanı gerektirmeyen testleri çalıştırır. **Beklenen:** `pass 20`, `fail 0`.
>
> ```zsh
> npm run test:db
> ```
> Bu komut veritabanı testlerinin hepsini test dalında sırayla çalıştırır: duman, izolasyon ve rol testleri. **Beklenen:** `tests 33`, `pass 33`, `fail 0` (3 + 21 + 9). 15–30 saniye sürebilir.
>
> ```zsh
> npm run lint
> ```
> Bu komut stil kontrolü yapar. **Beklenen:** hata yok.
>
> ```zsh
> npm run build
> ```
> Bu komut uygulamayı canlıya çıkacak hâliyle derler. **Beklenen:** hatasız biter.
>
> ### Commit
>
> ```zsh
> git add package.json
> ```
> Bu komut yalnızca `package.json` dosyasını commit'e hazırlar.
>
> ```zsh
> git --no-pager diff --cached --stat
> ```
> **Beklenen:** yalnızca `package.json`, 2 satır değişmiş.
>
> ```zsh
> git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"
> ```
> **Beklenen:** boş çıktı.
>
> ```zsh
> git commit -m "chore: veritabanı testleri için test:db betiği"
> ```
> Bu komut betiği dala kaydeder.
>
> ```zsh
> git --no-pager log --oneline main..HEAD
> ```
> Bu komut bu dalda main'e göre eklenen commit'leri listeler. **Beklenen:** 4 commit:
> 1. `fix: tenant filtresi...`
> 2. `test: kiracı izolasyonu...`
> 3. `test: pasife alma rol testleri...`
> 4. `chore: veritabanı testleri...`
>
> Sonra push'u ve PR'ı GitHub Desktop'tan yapabilirsin.
>
> ## Bana yaz
> 1. Parça 7 commit'i başarılı mı?
> 2. `npm test` ve `npm run test:db`: pass ve fail sayıları.
> 3. `lint` ve `build` sonuçları.
> 4. `git log main..HEAD` çıktısı.
>
> Sonra Adım 5'e geçeceğiz: elle test tablosu (iki firma, dört kullanıcı). Finance kullanıcısını test dalında nasıl oluşturacağımızı da orada anlatacağım.

### Prompt 44 · 22 Eki 2026 16:32

````text
7 BAŞARILI , PASS VE FAİL BEKLEDİĞİMİZ GİBİ , DİĞERLERİ DE OLMASI GEREKTİĞİ GİBİ VE GÜN 6 NIN BİTMESİNE NE KADAR KALDI
````

### Claude cevabı 44 · 22 Eki 2026 16:32

> Parça 8 de tamam. Otomatik testlerin hepsi geçiyor: **20 birim testi ve 33 veritabanı testi.**
>
> ## Gün 6'nın bitmesine ne kaldı?
>
> Gün 6 görevinin bitiş kontrolüne göre:
>
> | Bitiş kontrolü | Durum |
> |---|---|
> | Otomatik testler geçiyor ve çıktıyı okuyabiliyorsun | ✅ Tamam |
> | Elle test tablosunu iki firmayla uyguladın, sonuçları işaretledin | ⏳ Kaldı |
> | Bulunan açıklar issue olarak kaydedildi | ⏳ Kısmen (CAC issue'sunu açacağını söyledin) |
>
> **Kalan işler, sırasıyla:**
>
> 1. **Push ve PR** (sen, ~5 dk): `gun6-izolasyon-testleri` dalındaki 4 commit'i GitHub Desktop'tan gönder ve PR aç.
>
> 2. **Elle test tablosu** (en büyük kalan iş, ~30–45 dk):
>    - Kullanıcı yönetimi henüz olmadığı için finance kullanıcıları arayüzden oluşturulamıyor. Test dalında iki firma ve dört kullanıcıyı (her firmada bir manager ve bir finance) oluşturmanın güvenli yolunu vereceğim.
>    - Geliştirme sunucusunu production yerine **test dalıyla** çalıştırmanın yolunu vereceğim, böylece elle testler canlı veriye dokunmaz.
>    - Sonra tarayıcıda adım adım uygulayacağın, "beklenen sonuç" sütunlu kontrol tablosu gelecek. Kapsamı:
>      - Adres çubuğuna B'nin kayıt kimliğini yazmak
>      - Finance kullanıcısıyla Ayarlar ve Kullanıcılar sayfalarına doğrudan gitmek
>      - Menünün finance için gizlenmesi
>      - Pasife alma düğmesinin finance için davranışı
>
> 3. **Issue'lar** (sen, ~10 dk):
>    - CAC notu (metni verdim)
>    - İsteğe bağlı: `sslmode=verify-full` uyarısı
>    - İsteğe bağlı: Gün 12 için veritabanı tetikleyicisi önlemi
>
>    Son ikisinin metnini de istersen hazırlarım.
>
> 4. **ADR Gün 6 bölümü** (ben, tek seferde): Not aldığım bütün kararlar ve "Bilinen açıklar ve alınan önlemler" bölümü.
>
> 5. **Önerim, isteğe bağlı:** `CLAUDE.md` için küçük bir güncelleme:
>    - Test komutları (`npm test`, `npm run test:db`)
>    - Beyaz liste kuralı
>    - Daha kesin parola araması: `git grep -n -E "npg_[A-Za-z0-9]{6,}"`. Bugünkü olayda eski arama çok fazla zararsız sonuç döndürdüğü için gerçek sızıntı gözden kaçabiliyordu.
>
>    Böylece sonraki günlerde AI bu kuralları da bilir.
>
> **Toplam tahminim:** Yaklaşık 1 saat, büyük kısmı elle test tablosu.
>
> Push ve PR'ı yaptıktan sonra **elle test tablosuna** geçelim mi? Yoksa önce ADR bölümünü mü istersin?

### Prompt 45 · 22 Eki 2026 16:42

````text
PR #25 birleşti, canlı çalışıyor. Test sayıları not alındı (20 birim, 33 veritabanı testi). Parça 8'in push ve PR kısmı tamamlandı.

Şimdi elle test tablosuna geçelim, ama şu sınırlarla: toplam en fazla 40 dakika. Sıralama: önce test dalında iki firma ve dört kullanıcıyı oluşturmanın en basit ve güvenli yolu (mevcut src/test-destek/veri.ts yardımcısını kullanabilirsen yeni dosya yazma). Sonra geliştirme sunucusunu .env.test ile çalıştırma komutu. Sonra tarayıcıda uygulayacağım, "beklenen sonuç" sütunlu kısa tablo. Kapsam: B'nin kayıt kimliğini adres çubuğuna yazmak, finance ile /ayarlar ve /kullanicilar'a doğrudan gitmek, menünün finance için gizlenmesi, pasife alma düğmesinin finance için davranışı. SSE ve dashboard yok.

CAC issue'sunu açtım. sslmode ve tetikleyici için issue açmayacağım, ADR'de "ileride" olarak yazılsın. CLAUDE.md güncellemesini bugün yapmayacağız, Gün 14'e kalsın.

Gizlilik: parola veya adres ekrana basılmasın, .env.test içeriği gösterilmesin. Her komutu tek tek ver.
````

### Claude cevabı 45 · 22 Eki 2026 16:43

> Bu iş için yeni dosya yazmıyoruz.
>
> **`veri.ts` neden uygun değil?** O yardımcı otomatik testler için tasarlandı:
> - Oluşturduğu kullanıcıların parolası bilerek geçersiz, yani giriş yapılamaz.
> - Testin sonunda her şeyi siliyor.
>
> Elle test için giriş yapabilen ve kalıcı kullanıcılar gerekiyor.
>
> **En basit ve güvenli yol:**
> 1. Uygulamanın kendi **kayıt sayfasıyla** dört hesap oluştur. Parolalar uygulamanın kendisi tarafından bcrypt ile özetlenir.
> 2. İki hesabı **Neon SQL Editor'da, test dalında**, finance rolüyle A ve B firmalarına taşı.
>
> Bütün bunlar yalnızca test dalında olur. Parolaları yalnızca tarayıcıdaki forma yazarsın.
>
> ---
>
> ## 1. Hazırlık (~5 dk)
>
> `npm run dev` açıksa terminalde **Ctrl+C** ile kapat.
>
> ```zsh
> git switch main
> ```
> Bu komut main dalına geçer.
>
> ```zsh
> git pull
> ```
> Bu komut birleşen PR #25'i bilgisayarına indirir. Elle testi canlıdaki kodun aynısıyla yapmış olursun.
>
> ```zsh
> node --env-file=.env.test node_modules/.bin/next dev
> ```
> Bu komut geliştirme sunucusunu **test dalının** adresleriyle başlatır.
>
> Next.js `.env` dosyasını da okur, ama ortamda zaten tanımlı olan değişkenlerin üzerine yazmaz. Başlangıçta yine `Environments: .env` satırını görebilirsin. Bu yüzden bağlantıyı aşağıda ayrıca doğrulayacağız. Terminali açık bırak.
>
> ## 2. Dört hesap (~10 dk)
>
> Tarayıcıda `http://localhost:3000/kayit` sayfasını aç. Aşağıdaki dört hesabı sırayla oluştur. **Her kayıttan sonra "Çıkış yap"** düğmesine bas, çünkü kayıt işlemi seni otomatik olarak giriş yaptırır.
>
> | # | Firma adı | Ad soyad | E-posta |
> |---|---|---|---|
> | 1 | Elle Test A | A Yönetici | `elle-a-manager@example.com` |
> | 2 | Elle Test B | B Yönetici | `elle-b-manager@example.com` |
> | 3 | Elle Gecici 1 | A Finans | `elle-a-finance@example.com` |
> | 4 | Elle Gecici 2 | B Finans | `elle-b-finance@example.com` |
>
> Parola olarak dördüne de aynı test parolasını verebilirsin. Parolayı sohbete yazma.
>
> **Bağlantı doğrulaması (1. hesaptan hemen sonra yap):**
> 1. Neon panelinde dal seçicide **`test`** seç → **Tables** → `tenants` tablosu. "Elle Test A" görünmeli.
> 2. Dal seçicide **`production`** seç → aynı tablo. "Elle Test A" **görünmemeli**.
>
> Production'da görünürse dur ve bana yaz. Sunucu canlı veritabanına bağlanmış demektir.
>
> ## 3. İki hesabı finance yap (Neon SQL Editor, ~3 dk)
>
> Neon panelinde dal seçicide **`test`** dalının seçili olduğundan **emin ol**. Sonra sol menüden **SQL Editor** sayfasını aç. Aşağıdaki sorguyu yapıştır ve **Run** ile çalıştır:
>
> ```sql
> -- YALNIZCA TEST DALINDA çalıştır.
> -- Kayıt sırasında ayrı firmalarda manager olarak açılan iki hesabı,
> -- A ve B firmalarına finance rolüyle taşır.
> UPDATE users
> SET "tenantId" = (SELECT "tenantId" FROM users WHERE email = 'elle-a-manager@example.com'),
>     role = 'finance'
> WHERE email = 'elle-a-finance@example.com';
>
> UPDATE users
> SET "tenantId" = (SELECT "tenantId" FROM users WHERE email = 'elle-b-manager@example.com'),
>     role = 'finance'
> WHERE email = 'elle-b-finance@example.com';
> ```
>
> Sonra kontrol sorgusunu çalıştır:
>
> ```sql
> -- Dört hesabın rolünü ve firmasını gösterir (e-posta ve kimlik, parola yok).
> SELECT u.email, u.role, t.name AS firma
> FROM users u JOIN tenants t ON t.id = u."tenantId"
> WHERE u.email LIKE 'elle-%'
> ORDER BY u.email;
> ```
>
> **Beklenen:**
>
> | email | role | firma |
> |---|---|---|
> | `elle-a-finance@example.com` | finance | Elle Test A |
> | `elle-a-manager@example.com` | manager | Elle Test A |
> | `elle-b-finance@example.com` | finance | Elle Test B |
> | `elle-b-manager@example.com` | manager | Elle Test B |
>
> "Elle Gecici 1/2" firmaları boş kalır. Yalnızca test dalında oldukları için sorun değil.
>
> ## 4. Hazırlık verisi (~5 dk)
>
> - **A Yönetici** ile giriş yap. "Elle A Müşteri" adında bir müşteri ve "Elle A Plan" adında bir plan ekle. Müşterinin detay sayfasını aç ve adres çubuğundaki kimliği not et: `/musteriler/` sonrasındaki kısım (**A-müşteri-id**). Çıkış yap.
> - **B Yönetici** ile giriş yap. "Elle B Müşteri" ve "Elle B Plan" ekle. İkisinin de detay sayfasındaki kimliği not et (**B-müşteri-id**, **B-plan-id**). Çıkış yap.
>
> Bu kimlikler gizli değil, ama sohbete yazmana gerek yok.
>
> ## 5. Elle test tablosu (~15 dk)
>
> | # | Kullanıcı | Ne yap | Beklenen sonuç | Sonuç |
> |---|---|---|---|---|
> | 1 | A Yönetici | Adres çubuğuna `/musteriler/B-müşteri-id` yaz | "Bulunamadı" sayfası. B'nin müşteri adı hiçbir yerde görünmez | |
> | 2 | A Yönetici | Adres çubuğuna `/planlar/B-plan-id` yaz | "Bulunamadı" sayfası | |
> | 3 | A Yönetici | Müşteriler ve Planlar listelerine bak | Yalnızca "Elle A ..." kayıtları | |
> | 4 | A Finans | Giriş yap, sol menüye bak | Ayarlar ve Kullanıcılar **görünmez**, rozet "Finans" | |
> | 5 | A Finans | Adres çubuğuna `/ayarlar` yaz | "Bu sayfaya erişim yetkiniz yok" | |
> | 6 | A Finans | Adres çubuğuna `/kullanicilar` yaz | "Bu sayfaya erişim yetkiniz yok" | |
> | 7 | A Finans | "Elle A Müşteri" detay sayfası → pasife alma düğmesi | Düğme **görünmez**. Görünüyorsa tıklayınca "Bu işlemi yalnızca firma yöneticisi yapabilir." ve müşteri aktif kalır | |
> | 8 | A Finans | "Elle A Plan" detay sayfası → pasife alma düğmesi | 7 ile aynı | |
> | 9 | A Finans | Yeni müşteri ekle, sonra adını güncelle | "… müşterisi eklendi." ve "Değişiklikler kaydedildi." (finance'e açık işlemler) | |
> | 10 | A Finans | Adres çubuğuna `/musteriler/B-müşteri-id` yaz | "Bulunamadı" sayfası | |
> | 11 | B Finans | Adres çubuğuna `/musteriler/A-müşteri-id` yaz | "Bulunamadı" sayfası (ters yön) | |
> | 12 | Herhangi biri | Çıkış yap, sonra adres çubuğuna `/musteriler` yaz | Giriş sayfasına yönlendirilir | |
>
> **7. ve 8. satırlar için not:** Bunlar düğmenin arayüzdeki davranışını gösterir. Düğme gizliyse sunucu tarafındaki kontrol arayüzden denenemez. O kontrolü otomatik rol testleri zaten doğruladı (9/9). Düğme görünür ve tıklayınca müşteri **pasife alınırsa** bu bir açıktır. Hemen dur ve bana yaz.
>
> ## Bitirince
>
> - Sunucuyu **Ctrl+C** ile kapat.
> - Sonraki `npm run dev` yine production'a bağlanır. Test dalıyla çalışmak için her seferinde 1. adımdaki komutu kullanman gerekir.
>
> ## Bana yaz
> 1. Bağlantı doğrulaması: "Elle Test A" test dalında görünüyor, production'da görünmüyor mu?
> 2. SQL kontrol sorgusu beklenen tabloyu verdi mi?
> 3. 12 satırın sonucu: "geçti" ya da kısa açıklama. 7. ve 8. satırda düğme görünüyor muydu?
>
> ## Varsayımlar ve emin olmadığım yerler
> - Next.js'in ortamda tanımlı değişkenlerin üzerine `.env` değerlerini yazmadığını varsayıyorum. 2. adımdaki Neon kontrolü bu yüzden şart.
> - Veritabanı sütun adlarının şemadaki gibi (`"tenantId"`, `role`, `email`) olduğunu varsayıyorum. `@@map` yalnızca tablo adlarını değiştiriyor. Sorgu "column does not exist" hatası verirse hata mesajını yaz.
> - Detay sayfalarının adresinin `/musteriler/[id]` ve `/planlar/[id]` biçiminde olduğunu build çıktısından biliyorum. Pasife alma düğmesinin hangi sayfada olduğunu bilmiyorum. Detay sayfasında değilse listede ara.

### Prompt 46 · 22 Eki 2026 16:45

````text
kullanici@bilgisayar abonetakip % git switch main
Halihazırda 'main' üzerinde
Dalınız "origin/main" ile güncel.
kullanici@bilgisayar abonetakip % git pull
Tümü güncel.
kullanici@bilgisayar abonetakip % node --env-file=.env.test node_modules/.bin/next dev
/opt/homebrew/Cellar/node/26.11.1_1/bin/node: --env-file= is not allowed in NODE_OPTIONS

kullanici@bilgisayar abonetakip %
````

### Claude cevabı 46 · 22 Eki 2026 16:45

> Bu hatanın sebebi şu: `next dev` arka planda ikinci bir Node süreci başlatıyor ve kendi Node ayarlarını o sürece aktarıyor. Node, güvenlik gereği `--env-file` ayarının bu yolla aktarılmasına izin vermiyor. Yani komut hiçbir şey yapmadan durdu, veritabanına bağlanılmadı.
>
> Bunun yerine `.env.test` değerlerini **yalnızca bu komut için açılan geçici bir alt kabuğa** yükleyeceğiz:
>
> ```zsh
> (set -a; source .env.test; set +a; npx next dev)
> ```
> Bu komut geliştirme sunucusunu test dalının adresleriyle başlatır. Parçaları şöyle çalışır:
> - **Parantezler** geçici bir alt kabuk açar. Yüklenen değerler yalnızca onun içinde yaşar. Sunucuyu Ctrl+C ile kapattığında kaybolur ve terminalin geri kalanını etkilemez.
> - **`set -a`** sonraki adımda okunan değişkenlerin sunucuya aktarılmasını sağlar.
> - **`source .env.test`** dosyayı okur ama **ekrana hiçbir şey basmaz**. Adresler komut geçmişine de girmez, geçmişe yalnızca bu satır yazılır.
> - **`set +a`** aktarmayı kapatır.
> - **`npx next dev`** sunucuyu her zamanki gibi başlatır.
>
> Başlangıçta yine `Environments: .env` satırını görebilirsin. Next.js `.env` dosyasını da okur, ama zaten tanımlı olan değerlerin üzerine yazmaz.
>
> Bu yüzden **2. adımdaki bağlantı doğrulaması şart**: 1. hesabı açtıktan hemen sonra Neon'da "Elle Test A" firmasının **test** dalında görünüp **production** dalında görünmediğini kontrol et. Production'da görünürse dur ve bana yaz.
>
> Sunucu açıldıktan sonra önceki mesajdaki **2. adımdan** (dört hesap) devam et.
>
> **Emin olmadığım yer:** `.env.test` içindeki değerlerin çift tırnak içinde olduğunu ve içlerinde `$` ya da ters tırnak (`` ` ``) gibi kabuğun özel anlam verdiği karakterler bulunmadığını varsayıyorum. Neon adresleri ve `openssl` ile ürettiğimiz anahtar bu karakterleri içermez. Komut "parse error" gibi bir hata verirse hata satırını yaz. Satırda adres ya da parola görünürse o kısmı sil.

### Prompt 47 · 22 Eki 2026 16:47

````text
bu şekilde kaldı
````

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 47 · 22 Eki 2026 16:47

> Bu doğru, sunucu çalışıyor. "Ready in 226ms" satırı sunucunun hazır olduğunu gösteriyor. Altta yanıp sönen imleç, sunucunun istek beklediği anlamına geliyor. `npm run dev` ile çalıştırdığında da terminal aynı şekilde meşgul kalıyordu. **Bu terminal penceresini kapatma ve içine bir şey yazma.**
>
> `Environments: .env` satırı beklediğimiz gibi çıktı. Hangi veritabanına bağlandığını aşağıdaki Neon kontrolüyle doğrulayacağız.
>
> Şimdi tarayıcıya geç:
>
> 1. Tarayıcıda `http://localhost:3000/kayit` adresini aç.
> 2. **1. hesabı** oluştur:
>    - Firma adı: **Elle Test A**
>    - Ad soyad: **A Yönetici**
>    - E-posta: `elle-a-manager@example.com`
>    - Parola: bir test parolası
> 3. **Hemen bağlantıyı doğrula:**
>    - Neon panelinde dal seçicide **`test`** seç → **Tables** → `tenants`. "Elle Test A" görünmeli.
>    - Dal seçicide **`production`** seç → aynı tablo. "Elle Test A" **görünmemeli**.
> 4. Bana yaz: test dalında **görünüyor mu**, production dalında **görünmüyor mu**?
>
> Sonuç doğruysa kalan üç hesapla devam edersin. Her kayıttan sonra "Çıkış yap" düğmesine basmayı unutma.
>
> Terminalde kayıt sırasında `POST /kayit` gibi istek satırları belirebilir, bunlar normal. Kırmızı bir hata satırı görürsen ilk satırını yaz. Satırda adres ya da parola görünürse o kısmı sil.

### Prompt 48 · 22 Eki 2026 16:50

_[1 ekran görüntüsü eklendi]_

### Claude cevabı 48 · 22 Eki 2026 16:50

> Doğru yerdesin: sol üstte **`test`** dalı seçili ve tablolar listeleniyor. Şu an ekranda `_prisma_migrations` tablosu açık. Bu, Prisma'nın uygulanan migration'ları tuttuğu tablo. Üç satır görünmesi, test dalının production'ın tam kopyası olduğunu gösteriyor.
>
> Şimdi:
>
> 1. Ortadaki listeden **`tenants`** tablosuna tıkla.
> 2. Sağdaki satırlarda **"Elle Test A"** adında bir firma ara. Liste uzunsa üstteki sayfa düğmeleriyle (`‹ ›`) ilerle.
>    - Az önce kayıt olduysan ve görünmüyorsa sağ üstteki **yenile** düğmesine (iki oklu daire) bas.
>    - Henüz kayıt olmadıysan önce `http://localhost:3000/kayit` sayfasından 1. hesabı oluştur, sonra buraya dön.
> 3. Sonra sol üstteki dal seçiciden (**`test`** yazan kutu) **`production`** dalını seç. Aynı **`tenants`** tablosuna bak. "Elle Test A" **olmamalı**.
>
> Bana yaz: test dalında **var mı**, production dalında **yok mu**?

### Prompt 49 · 22 Eki 2026 16:51

````text
her şey olması gerektiği gibi
````

### Claude cevabı 49 · 22 Eki 2026 16:51

> Bağlantı doğrulandı: geliştirme sunucusu **test dalını** kullanıyor, production'a hiçbir şey yazılmadı.
>
> Süre sınırı için kalan adımları tek akışta yapabilirsin. Hepsi önceki mesajımda (elle test tablosunu verdiğim mesaj):
>
> 1. **Kalan üç hesap (2. adım):** `/kayit` sayfasından 2, 3 ve 4 numaralı hesapları oluştur. Her kayıttan sonra **Çıkış yap** düğmesine bas.
>
> 2. **Finance'e çevirme (3. adım):** Neon'da dal seçicide **`test`** seçili olduğundan emin ol. **SQL Editor** sayfasında iki `UPDATE` sorgusunu, ardından kontrol `SELECT` sorgusunu çalıştır. Kontrol sorgusu beklenen tabloyu vermezse dur ve bana yaz.
>
> 3. **Hazırlık verisi (4. adım):**
>    - A Yönetici ile "Elle A Müşteri" ve "Elle A Plan" ekle. Müşteri kimliğini not et.
>    - B Yönetici ile "Elle B Müşteri" ve "Elle B Plan" ekle. İkisinin de kimliğini not et.
>
> 4. **Elle test tablosu (5. adım):** 12 satırı sırayla uygula.
>
> **Hemen durman gereken iki durum:**
> - 7. ya da 8. satırda finance kullanıcısı pasife alma düğmesini görüyor ve tıklayınca kayıt **gerçekten pasife alınıyor**.
> - 1., 2., 10. ya da 11. satırda **başka firmanın kaydı** görünüyor.
>
> ## Bana yaz
> 1. SQL kontrol sorgusu beklenen tabloyu verdi mi? (Evet/hayır yeterli.)
> 2. 12 satırın sonucu: "geçti" ya da kısa açıklama. 7. ve 8. satırda düğme görünüyor muydu?
>
> Bitince sunucuyu terminalde **Ctrl+C** ile kapat.

### Prompt 50 · 22 Eki 2026 17:08

````text
her şey olması gerektiği gibi
````

### Claude cevabı 50 · 22 Eki 2026 17:08

> Elle testler de geçti. Bitiş kontrolünün durumu:
>
> | Bitiş kontrolü | Durum |
> |---|---|
> | Otomatik testler geçiyor ve çıktıyı okuyabiliyorsun | ✅ 20 birim, 33 veritabanı testi |
> | Elle test tablosunu iki firmayla uyguladın, sonuçları işaretledin | ✅ 12/12 |
> | Bulunan açıklar issue olarak kaydedildi | ✅ Açık 1 düzeltildi (PR #25, ADR'ye girecek). CAC issue açıldı. sslmode ve tetikleyici ADR'de "ileride" olarak yer alacak. |
>
> **Gün 6 iş olarak tamam.** Geriye yalnızca ADR bölümü kaldı.
>
> **Küçük bir netleştirme:** ADR'ye doğru yazabilmem için 7. ve 8. satırlarda pasife alma düğmesi finance kullanıcısına **hiç görünmedi mi**, yoksa **göründü ama tıklayınca "Bu işlemi yalnızca firma yöneticisi yapabilir." mesajı mı verdi**? İkisi de doğru sonuç, ama ADR'de hangisinin olduğunu belirtmek istiyorum.
>
> ## Kapanış notları
> - **Sunucuyu kapat:** Terminalde Ctrl+C.
> - **Elle test hesapları test dalında kalıyor:** Dört `elle-...@example.com` hesabı ve "Elle Test A/B" firmaları yalnızca test dalında. Canlıyı etkilemezler. Gün 7'de dashboard'u elle denerken yeniden kullanabilirsin. Otomatik testler kendi firmalarını oluşturduğu için bu kayıtlar onları da etkilemez.
> - **Test dalıyla geliştirme sunucusu:** İleride gerekirse `(set -a; source .env.test; set +a; npx next dev)` komutunu kullanırsın. Normal `npm run dev` production'a bağlanır.
>
> ## Bana yaz
> 1. 7. ve 8. satırlarda düğme görünüyor muydu?
> 2. ADR'nin Gün 6 bölümünü şimdi tek seferde vereyim mi?
>
> Bölümde şunlar olacak:
> - Kararlar: Neon test dalı, `node --test`, pasife alma çekirdeği, ham `prisma` istisnası ve güvenceleri, push olayı ve PR kuralı
> - Bilinen açıklar ve alınan önlemler: Açık 1 düzeltildi, Açık 2 (CAC) issue olarak açık, ileride sslmode ve tetikleyici
> - Doğrulanan güvenceler: test sayılarıyla, rol testleri "doğrulandı"
> - Elle test sonuçlarının kısa özeti

### Prompt 51 · 22 Eki 2026 17:09

````text
7 ve 8 de pasife al düğmesi hiç görünmedi , evet o mesajı verdi
````

### Claude cevabı 51 · 22 Eki 2026 17:09

> Cevabın iki şekilde okunabiliyor, ADR'ye yanlış yazmamak için soruyorum:
>
> - Düğme **hiç görünmediyse**, finance kullanıcısı ona tıklayamaz. Bu durumda "Bu işlemi yalnızca firma yöneticisi yapabilir." mesajı ekranda çıkmamış olmalı.
> - Mesajı **gördüysen**, düğme bir yerde görünmüş ve tıklanmış olmalı. Örneğin detay sayfasında değil de listede.
>
> Hangisi oldu?
>
> 1. Düğme finance kullanıcısına **hiçbir yerde görünmedi**. Mesaj ekranda çıkmadı.
> 2. Düğme **göründü**, tıklayınca o mesaj çıktı ve kayıt aktif kaldı.
>
> Cevaptaki "evet" sözünü "ADR bölümünü şimdi ver" olarak anladım. Doğruysa, bu soruyu cevapladığın mesajın ardından Gün 6 ADR bölümünü tek seferde vereceğim.

### Prompt 52 · 22 Eki 2026 17:09

````text
düğme yoktu
````

### Claude cevabı 52 · 22 Eki 2026 17:11

> Anlaşıldı: düğme finance kullanıcısına hiç görünmedi. Sunucu tarafındaki kontrol de otomatik rol testleriyle doğrulandı. Aşağıdaki bölümü `docs/02_ADR.md` dosyasına olduğu gibi yapıştırabilirsin.
>
> ````markdown
> ## Gün 6: Kiracı izolasyonu ve rol testleri
>
> **Durum:** Tamamlandı. PR'lar birleşti (son PR: #25), canlı çalışıyor.
> **Sonuç:** 20 birim testi (`npm test`), 33 veritabanı testi (`npm run test:db`),
> 12 adımlık elle test. Testler bir izolasyon açığı buldu, açık aynı gün düzeltildi.
>
> ### Kararlar
>
> **K6.1: Veritabanı testleri Neon'da ayrı bir "test" dalında çalışır (Yol B)**
> - **Seçenekler:** (A) Canlı veritabanında "test-" etiketli veri üretip silmek,
>   (B) Neon'da canlının kopyası olan ayrı bir dal.
> - **Karar:** B. Testler `.env.test` dosyasındaki test dalı adresleriyle çalışır.
> - **Gerekçe:** A'da hatalı bir silme sorgusu ya da yarıda kalan bir test canlı veriyi
>   ve dashboard metriklerini bozabilirdi. B'de testler canlı veriye fiziksel olarak
>   dokunamaz. Neon dalı ek maliyetsiz ve ek paketsiz.
> - **Doğrulama:** Kurulumda iki kontrol yapıldı. Adreslerdeki uç nokta kimliği
>   parolasız yazdırıldı ve `prisma migrate status` çıktısındaki sunucu adı Neon
>   panelindeki test dalıyla karşılaştırıldı.
> - **Dikkat:** `prisma.config.ts` dosyası `.env` dosyasını da yükler. `.env.test`
>   içinde bir değişken eksik kalırsa değer canlı `.env` dosyasından gelir. Bu yüzden
>   migration komutlarından önce iki kontrol de yapılır.
>
> **K6.2: Test aracı Node'un yerleşik `node --test` aracıdır (Vitest değil)**
> - **Gerekçe:** Gün 5 ADR kararı "birim testi: ek paket yok" ile uyumlu. Node v26
>   TypeScript dosyalarını doğrudan çalıştırabiliyor.
> - **Bedeli:** Next.js'in uzantısız içe aktarmaları ve `@/` kısaltması için
>   `src/test-destek/kancalar.mjs` adında küçük bir çözümleme kancası yazıldı. Kanca
>   Node'un yerleşik `node:module` özelliğini kullanır, yalnızca testlerde yüklenir.
>   `.ts` değil `.mjs` dosyasıdır, böylece `npm run build` tip kontrolüne girmez.
> - **Önceden konan sınır:** Duman testi birden fazla geçici çözüm gerektirseydi
>   Vitest yeniden değerlendirilecekti. Tek kanca yetti.
> - **Bilinen uyarılar (zararsız):** `MODULE_TYPELESS_PACKAGE_JSON` uyarısı çıkar.
>   `package.json` dosyasına `"type": "module"` eklenmedi, çünkü Next.js
>   yapılandırmasını etkileyebilir.
>
> **K6.3: Pasife alma mantığı test edilebilir bir çekirdeğe ayrıldı**
> - **Sorun:** Rol kontrolü (`requireManager`) oturumu çerezden okuyordu ve çerez
>   yalnızca Next.js isteği içinde vardır. Rol kontrolü sunucu işleminin içinde
>   kaldığı sürece "finance pasife alamaz" kuralı otomatik test edilemezdi.
> - **Karar:**
>   - `src/lib/yetki.ts`: saf rol fonksiyonu `yoneticiMi(rol)`. `requireManager`
>     artık bunu kullanır.
>   - `src/lib/pasife-alma.ts`: `musteriPasifeAlCekirdek` ve `planPasifeAlCekirdek`.
>     Kullanıcıyı ve veritabanı nesnesini parametre olarak alırlar. Rol kontrolü,
>     kimlik kontrolü, aktif abonelik kontrolü ve güncelleme buradadır.
>   - `musteriler/actions.ts` ve `planlar/actions.ts` içindeki pasife alma işlemleri
>     artık yalnızca oturumu okur (`requireUser`, `getTenantDb`), çekirdeği çağırır
>     ve sayfaları yeniler.
>   - `abonelik-kontrol.ts`: `aktifAbonelikVarMi` fonksiyonuna isteğe bağlı `db`
>     parametresi eklendi. Mevcut çağrılar değişmedi.
> - **Korunan kurallar:** Mesajlar ve kontrol sırası Gün 4–5 ile birebir aynı. Uygulamada
>   parametreler her zaman oturumdan gelir, tenantId formdan alınmaz. Ekleme, güncelleme
>   ve abonelik işlemlerine dokunulmadı. Ayrı commit olarak yapıldı ve build ile tarayıcı
>   denemesinden geçtikten sonra testlere geçildi.
>
> **K6.4: Test verisi için ham `prisma` istisnası (`src/test-destek/veri.ts`)**
> - **Neden:** Firma (Tenant) ekleme ve silme, tenant filtresinden bilerek geçemez.
>   Test firmalarını oluşturmak ve silmek için ham `prisma` gerekir.
> - **Güvenceler:**
>   1. `TEST_VERITABANI=evet` işareti yoksa dosya veritabanına bağlanmadan durur. İşaret
>      yalnızca `.env.test` içinde vardır. Testler `.env` dosyasını hiç yüklemez.
>   2. Silme yalnızca o çalışmada oluşturulan firma kimlikleriyle yapılır ve firma
>      adının o çalışmanın etiketiyle (`test-xxxxxxxx`) başlaması gerekir. Joker silme
>      yoktur.
>   3. Silmeden sonra hiçbir test firmasının kalmadığı kontrol edilir.
> - **Denetim:** `kurallar.test.ts` ham `prisma` kullanımına yalnızca `db.ts`, `auth.ts`,
>   `tenant.ts` ve `veri.ts` dosyalarında izin verir. Ham SQL'in hiçbir yerde olmadığını
>   da kontrol eder.
>
> **K6.5: Main'e doğrudan push yapılmaz, her değişiklik PR ile girer**
> - **Olay:** Gün 6'nın ilk commit'leri (çözümleme kancası, duman testi, pasife alma
>   çekirdeği) dal açılmadan doğrudan main'e push edildi. Commit'ler build ve testlerden
>   geçmişti, canlıda sorun çıkmadı. Ama gözden geçirme adımı atlanmış oldu.
> - **Kural:** Her iş ayrı bir dalda yapılır. Commit'ler yerelde hazırlanır. Push ve PR
>   GitHub Desktop ile açılır. Main'e yalnızca birleştirilen PR'lar girer.
> - **Commit öncesi kontrol:** `git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"`. Eski
>   `neon.tech|npg_` araması dokümanlarda çok fazla zararsız sonuç döndürüyordu ve
>   gerçek bir sızıntıyı gözden kaçırmayı kolaylaştırıyordu. `CLAUDE.md` Gün 14'te
>   güncellenecek.
>
> **K6.6: Elle testler test dalıyla çalışan geliştirme sunucusunda yapılır**
> - **Komut:** `(set -a; source .env.test; set +a; npx next dev)`. Değerler yalnızca
>   geçici alt kabukta yaşar, ekrana ve komut geçmişine yazılmaz. `node --env-file` bu
>   iş için kullanılamaz, çünkü `next dev` alt sürece bu ayarın aktarılmasına izin vermez.
> - **Doğrulama:** İlk kayıttan sonra yeni firmanın Neon'da test dalında görünüp
>   production'da görünmediği kontrol edildi.
> - **Finance hesapları:** Kullanıcı yönetimi henüz olmadığı için hesaplar uygulamanın
>   kayıt sayfasıyla açıldı (parolalar bcrypt ile özetlendi). Ardından Neon SQL Editor'da,
>   yalnızca test dalında, `UPDATE` ile finance rolüne çevrilip A ve B firmalarına taşındı.
>
> ### Güvenlik olayı: Test dalı adresi örnek dosyaya yazıldı
>
> - **Ne oldu:** `.env.test.example` dosyasına yer tutucular yerine test dalının gerçek
>   adresleri ve parolası yazıldı. Commit öncesi `git grep` kontrolü bunu yakaladı.
>   Dosya commit edilmedi, GitHub'a gitmedi. Ancak parola sohbete ve terminal ekranına
>   düştü.
> - **Etkisi:** Test dalı production'dan kopyalandığı için `neondb_owner` kullanıcısının
>   parolası büyük ihtimalle production ile aynıydı.
> - **Alınan önlem:**
>   - Dosya commit hazırlığından çıkarıldı ve yer tutucularla düzeltildi.
>   - `neondb_owner` parolası hem test hem production dalında yenilendi.
>   - Render ortam değişkenleri ve yerel `.env` / `.env.test` dosyaları güncellendi.
>   - Canlıda giriş ve listeleme doğrulandı. `SESSION_SECRET` sızmadığı için değiştirilmedi.
> - **Ders:** Gün 1'deki olayla aynı tür hata. Commit öncesi kontrol işe yaradı. Kontrol
>   komutu daha kesin hâle getirildi (K6.5).
>
> ### Bilinen açıklar ve alınan önlemler
>
> **Açık 1: Kayıt ilişki alanı üzerinden başka firmaya taşınabiliyordu (düzeltildi)**
> - **Ne bulundu:** Tenant filtresi yalnızca `data.tenantId` alanını engelliyordu. Prisma'da
>   aynı değişiklik ilişki üzerinden de yazılabiliyor:
>   `customer.update({ data: { tenant: { connect: { id: "B" } } } })`. Bu sorgu A
>   firmasının müşterisini B firmasına taşıdı. İzolasyon testlerinden biri (11. test)
>   bunu yakaladı.
> - **Bugünkü risk (düzeltme öncesi):** Düşüktü. Hiçbir sunucu işlemi bu yazımı
>   kullanmıyordu ve form verisi doğrudan `data` içine konmuyordu. Ancak kiracı
>   izolasyonu MUST olduğu için aynı gün düzeltildi.
> - **Ne yapıldı:** `src/lib/tenant.ts` içine beyaz liste eklendi.
>   - Ekleme ve güncellemede (create, createMany, update, updateMany, upsert) yalnızca
>     tablonun kendi sütunları yazılabilir. Sütun listeleri Prisma'nın şemadan ürettiği
>     koddan okunur.
>   - İlişki alanları ve altlarındaki bütün iç içe yazımlar (connect, create,
>     connectOrCreate) en üst düzeyde reddedilir.
>   - Güncellemede `id` ve `tenantId` değiştirilemez.
>   - Tanınmayan tablo veya işlemde filtre durdurur (fail-closed).
>   - Kara liste yerine beyaz liste seçildi: kara liste yalnızca bilinen anahtarları
>     engeller, beyaz liste şemaya eklenecek yeni ilişkileri de kendiliğinden kapsar.
> - **Kanıt:** `tenant.test.ts` (21 test). Açığı bulan test düzeltmeden önce başarısız,
>   sonra başarılı. İlişki alanıyla güncelleme, ekleme ve iç içe yazma için ayrı testler
>   eklendi. Düzeltme sonrası build, birim testleri, veritabanı testleri ve tarayıcıda
>   9 işlemlik deneme (müşteri, plan, abonelik başlat, yenile, iptal) geçti.
> - **Neyi kapsamıyor:**
>   - Ham `prisma` kullanan dosyalar (`auth.ts`, `test-destek/veri.ts`) filtreden geçmez.
>     Hangi dosyaların ham `prisma` kullanabileceği `kurallar.test.ts` ile denetlenir.
>   - Koruma uygulama katmanındadır. Müşteri, plan ve kullanıcı tablolarında
>     veritabanı düzeyinde ikinci bir savunma hattı yoktur. Abonelik ve olay tabloları
>     bileşik anahtarlarla korunur.
>   - Beyaz liste Prisma'nın iç dosya yoluna (`generated/prisma/internal/prismaNamespace`)
>     bağlıdır. Prisma güncellenince yol değişebilir. Değişirse tip kontrolü ve testler
>     bunu yakalar.
>
> **Açık 2: Firma güncellemesi başka firma kimliğiyle istenince kendi firmaya uygulanıyor (açık, issue)**
> - `tenant.update({ where: { id: B } })` hata vermiyor. Filtre kimliği oturumdaki
>   firmayla değiştirdiği için güncelleme A'nın kendi kaydına uygulanıyor. B etkilenmiyor,
>   yani sızıntı yok, ama davranış yanıltıcı. Ayarlar (CAC) sayfası yazılırken ele alınacak.
>
> **İleride değerlendirilecek önlemler**
> - **Gün 12, `tenantId` değiştirilemez tetikleyicisi:** PostgreSQL tetikleyicisi ile
>   customers, plans, users, subscriptions ve subscription_events tablolarında `tenantId`
>   güncellemesi reddedilir. Böylece uygulama kodu ne yaparsa yapsın kayıt başka firmaya
>   taşınamaz. SQL migration dosyasına elle yazılır. Prisma'nın sonraki migration'larda
>   bu tetikleyiciyi silmeye çalışıp çalışmadığı kontrol edilmelidir. Row Level Security
>   (RLS) bağlantı havuzuyla birlikte 2 haftalık kapsam için ağır bulundu.
> - **SSL modu:** PostgreSQL sürücüsü (`pg`) `sslmode=require` için gelecekteki bir
>   sürümde daha zayıf davranışa geçileceğini bildiriyor. Bugün en sıkı mod
>   (`verify-full`) uygulanıyor. Bağlantı adreslerinin ileride açıkça
>   `sslmode=verify-full` ile güncellenmesi değerlendirilecek.
>
> ### Doğrulanan güvenceler
>
> | Güvence | Kanıt |
> |---|---|
> | A firması B'nin müşteri, plan ve aboneliklerini listeleyemez, bulamaz, güncelleyemez, pasife alamaz | `tenant.test.ts` |
> | Tenant filtresi `$transaction` içindeki sorgulara da uygulanır | `tenant.test.ts` (iptal ve yenileme) |
> | Başka firmanın müşterisi ve planıyla abonelik açmak, aboneliğine olay yazmak veritabanında reddedilir (bileşik anahtarlar) | `tenant.test.ts` |
> | Eklerken gönderilen başka tenantId yok sayılır | `tenant.test.ts` |
> | İlişki alanıyla yazma ve iç içe yazma reddedilir | `tenant.test.ts` |
> | finance müşteriyi ve planı pasife alamaz, kayıt değişmez: **doğrulandı** | `pasife-alma.test.ts` (9 test) |
> | Gün 5 kuralı korunur: aktif aboneliği olan kayıt pasife alınamaz | `pasife-alma.test.ts` |
> | Oturum çerezi değiştirilirse (kullanıcı kimliği, imza, anahtar) geçersiz sayılır, süresi dolar | `session.test.ts` (6 test) |
> | Ham `prisma` yalnızca izinli dosyalarda, ham SQL hiçbir yerde | `kurallar.test.ts` (4 test) |
>
> **Test sayıları:**
> - `npm test`: 20 test (dönem 8, rol kuralı 2, oturum 6, statik kural 4)
> - `npm run test:db`: 33 test (duman 3, izolasyon 21, rol 9)
>
> **Testlerin garanti etmedikleri:**
> - Yalnızca test edilen fonksiyonları kapsar. Yeni yazılan bir sorgunun filtreden
>   geçtiğini `kurallar.test.ts` dolaylı olarak denetler, ama yeni bir iş kuralını test etmez.
> - Sunucu işlemlerindeki oturum okuma satırı (`requireUser`, `getTenantDb`) otomatik
>   test edilmez. Elle testle kapsanır.
> - Dashboard metrikleri ve SSE uyarıları henüz yazılmadığı için izolasyonları test
>   edilmedi. İlgili günlerde eklenecek.
>
> ### Elle test özeti (test dalı, 2 firma, 4 kullanıcı): 12/12 geçti
>
> - A firmasının yöneticisi ve finans kullanıcısı, B'nin müşteri ve plan sayfalarını
>   adres çubuğuna kimlik yazarak açamadı ("Bulunamadı"). Ters yönde de (B → A) aynı.
> - Listelerde yalnızca kendi firmasının kayıtları göründü.
> - Finance kullanıcısına Ayarlar ve Kullanıcılar menüde görünmedi. Adres çubuğuyla
>   doğrudan gidildiğinde "Bu sayfaya erişim yetkiniz yok" mesajı çıktı.
> - Pasife alma düğmesi finance kullanıcısına müşteri ve plan sayfalarında hiç görünmedi.
>   Sunucu tarafındaki kontrol otomatik rol testleriyle doğrulandı.
> - Finance kullanıcısı müşteri ekleyip güncelleyebildi (kendisine açık işlemler).
> - Çıkış yapıldıktan sonra korumalı sayfaya gidilince giriş sayfasına yönlendirildi.
>
> **Sonradan eklenecekler:**
> - CAC ayarı ve kullanıcı yönetimi (manager)
> - Dashboard metrik izolasyonu
> - SSE uyarısının yalnızca ilgili firmaya gitmesi
> - Aylık MRR grafiği
> ````
>
> **Commit:** ADR değişikliğini yeni bir dalda yapman gerekiyor. Şu komutlarla ilerleyebilirsin:
>
> ```zsh
> git switch -c gun6-adr
> ```
> Bu komut güncel main'den ADR için yeni bir dal açar.
>
> Bölümü `docs/02_ADR.md` dosyasının sonuna yapıştırıp kaydettikten sonra:
>
> ```zsh
> git add docs/02_ADR.md
> ```
> Bu komut yalnızca ADR dosyasını commit'e hazırlar.
>
> ```zsh
> git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"
> ```
> Bu komut parola izi arar. **Beklenen:** boş çıktı. ADR'de yalnızca `npg_` sözü geçiyor, gerçek parola biçimi yok.
>
> ```zsh
> git commit -m "docs: Gün 6 ADR bölümü (izolasyon testleri, açıklar ve önlemler)"
> ```
> Bu komut ADR bölümünü dala kaydeder. Push'u ve PR'ı GitHub Desktop'tan yaparsın.
>
> **Bir not:** "Main'e doğrudan push" olayını yazarken hangi commit'lerin doğrudan main'e gittiğini konuşmamızdan çıkardım: kanca, duman testi ve pasife alma çekirdeği. Senin hatırladığın farklıysa o maddeyi düzelt.

### Prompt 53 · 22 Eki 2026 17:19

````text
ADR bölümü birleşti. Prompt Günlüğü'ne Gün 6 için bir satır ver: önceki günlerin satırlarıyla aynı biçimde (ne istendi, ne üretildi, düzeltme gerekti mi), kısa. Düzeltme gerekti mi hücresine bu günkü gerçek düzeltmeleri yaz: Vitest yerine node --test seçimi, pasife alma çekirdeğine ayırma, 11. testin bulduğu açık ve beyaz liste düzeltmesi, .env.test.example olayı, main'e doğrudan push. Gizli bilgi yazma.
````

### Claude cevabı 53 · 22 Eki 2026 17:19

> Önceki satırların tam biçimini görmediğim için tabloyu `| Gün | Ne istendi | Ne üretildi | Düzeltme gerekti mi |` sütunlarıyla varsaydım. Senin tablonda tarih ya da araç gibi ek sütunlar varsa onları ekle.
>
> ```markdown
> | Gün 6 | Kiracı izolasyonu ve rol testleri: iki firma ve iki rolle otomatik testler, elle test tablosu, finance yetki listesi | Neon test dalı ve `.env.test`; `node --test` çözümleme kancası ve duman testi; `yetki.ts` ve `pasife-alma.ts` çekirdeği; `veri.ts` test verisi yardımcısı; `tenant.test.ts` (21), `pasife-alma.test.ts` (9), `session.test.ts` (6), `kurallar.test.ts` (4) testleri; `test` ve `test:db` betikleri; `tenant.ts` beyaz liste düzeltmesi; 12 adımlık elle test tablosu; ADR Gün 6 bölümü | Evet: (1) AI Vitest önerdi, ADR'deki "ek paket yok" kararı hatırlatılınca `node --test` ve tek çözümleme kancasıyla ilerlendi; (2) AI'nın ilk planında rol kontrolü sunucu işleminde kalıyordu, otomatik test edilemeyeceği fark edilince pasife alma mantığı çekirdeğe ayrıldı (davranış ve mesajlar aynı, ayrı commit); (3) 11. test, kaydın `tenant: { connect }` ile başka firmaya taşınabildiğini gösterdi, kara liste yerine beyaz liste ile düzeltildi, 3 ek test eklendi; (4) `.env.test.example` dosyasına yer tutucu yerine gerçek adres yazıldı, commit öncesi `git grep` yakaladı, dosya düzeltildi ve veritabanı parolası test ile canlıda yenilendi; (5) ilk commit'ler dal açılmadan doğrudan main'e push edildi, bundan sonra her değişiklik dal ve PR ile giriyor |
> ```
>
> İçinde hiçbir adres, parola ya da uç nokta kimliği yok. Yalnızca dosya adları, test sayıları ve olayların tanımı var.
>
> **Commit:** Günlük de ayrı bir dalda olmalı:
>
> ```zsh
> git switch main
> ```
> Bu komut main dalına geçer.
>
> ```zsh
> git pull
> ```
> Bu komut birleşen ADR PR'ını bilgisayarına indirir.
>
> ```zsh
> git switch -c gun6-prompt-gunlugu
> ```
> Bu komut günlük için yeni bir dal açar.
>
> Satırı `docs/03_Prompt_Gunlugu.md` tablosunun sonuna ekleyip kaydettikten sonra:
>
> ```zsh
> git add docs/03_Prompt_Gunlugu.md
> ```
> Bu komut yalnızca günlük dosyasını commit'e hazırlar.
>
> ```zsh
> git --no-pager grep -n -E "npg_[A-Za-z0-9]{6,}"
> ```
> Bu komut parola izi arar. **Beklenen:** boş çıktı.
>
> ```zsh
> git commit -m "docs: Gün 6 Prompt Günlüğü satırı"
> ```
> Bu komut satırı dala kaydeder. Push'u ve PR'ı GitHub Desktop'tan yaparsın.

