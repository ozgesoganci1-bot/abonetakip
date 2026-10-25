# 14 Günlük Prompt Planı • AboneTakip

> Her günün promptu 4. haftadaki **altı bileşenli şablona** göre yazıldı: Rol, Bağlam, Görev, Kısıtlar, Format, Doğrulama.
> Kullanım: (1) Her gün yeni bir Claude sohbeti aç. Başına **Ortak Başlık**'ın kısa hâlini yapıştır (`CLAUDE.md` kuralları Project talimatlarında zaten var). (2) Günün promptunu yapıştır. (3) **Önce planı** iste, onayla, sonra kodu yazdır. (4) Günün sonunda **Bitiş kontrolü**'nü yap, commit et, Prompt Günlüğü'ne kısa not düş.
> Köşeli parantezli `[...]` yerleri doldurman gereken yerlerdir. Gizli bilgileri (DATABASE_URL, parola) hiçbir prompta yazma.
> **Not (25 Ekim 2026):** Bu plan, proje sunumla teslim edilecekmiş gibi yazılmıştı. Proje yalnızca depo, belgeler ve canlı uygulama üzerinden incelendiği için plandaki sunum ifadeleri inceleme olarak okunmalıdır. Planın özgün metni değiştirilmedi.

---

## Claude sohbetiyle çalışma notları

- Claude bilgisayarındaki dosyaları göremez. Prompt "mevcut dosyayı göster" derse, ilgili dosyanın **tam içeriğini** dosya yoluyla birlikte sohbete yapıştır.
- Claude her dosyayı tam yolu ve tam içeriğiyle verir. Sen bunları VS Code'da oluşturup yapıştırırsın (Kurulum Rehberi Bölüm 11).
- "Önce plan, onay bekle" adımı sohbette doğal olarak çalışır. Planı okuyup "onaylıyorum" veya düzeltme yaz.
- Her gün için yeni sohbet aç. Sohbet uzarsa Yardımcı Prompt D ile özet al.
- `.env` içeriğini, parolaları ve veritabanı adresini sohbete asla yapıştırma.
- Terminal çıktısını veya hata metnini Yardımcı Prompt A şablonuyla gönder.

## Ortak Başlık (kısa hâl: kurallar Project talimatlarındaysa bunu kullan)

```
Bu bir devam oturumu. Proje talimatlarındaki (CLAUDE.md) kurallara uy.
Ben kod bilmeyen bir YBS öğrencisiyim, Türkçe, sade ve adım adım anlat.
Önce plan ver, ben onaylamadan dosya değiştirme. Cevabın sonunda
varsayımlarını ve emin olmadığın yerleri listele.
Bugünün konusu: [Gün X - konu].
```

## Ortak Başlık (uzun hâl: Project talimatı yoksa veya yeni bir sohbet için)

```
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
```

## Yardımcı promptlar (gerektikçe kullan)

**A. Hata düzeltme** (zayıf "çalışmıyor" yerine)
```
Ne yaptım: [komut ya da adım]
Ne oldu: [belirti]
Hata mesajı (tamamı): [metin, gizli bilgiler yer tutucuyla]
İlgili dosya (tam içerik): [dosya yolu ve içerik]
Beklenen: [ne olmalıydı]
İstek: Önce olası nedenleri sırala, sonra en olası olanı düzeltmek için
yalnızca gerekli değişikliği adım adım ver. Başka dosyalara dokunma.
```

**B. Kodu anlama** (4. hafta: "anlamadığın kod senin kodun değildir")
```
Aşağıdaki dosyayı kod bilmeyen biri için satır satır, sade Türkçeyle
açıkla. Her bölümün ne işe yaradığını, tenant ve yetki kontrolünün nerede
yapıldığını ve bir hata olursa ne olacağını belirt. En sonda bana bu dosya
hakkında 3 kontrol sorusu sor ki anlayıp anlamadığımı test edeyim.
[Dosya yolu ve içerik]
```

**C. Kapsam kontrolü**
```
Şu ana kadar yazdığın plan ve kodda MUST/SHOULD/WON'T listemin dışına çıkan
bir şey var mı? Varsa listele ve sadeleştirme öner. Yeni özellik ekleme.
```

**D. Yeni oturum özeti** (sohbet uzayıp dağıldığında)
```
Bu sohbetin özetini çıkar: tamamlanan işler, dosyaların yolu ve görevi,
alınan kararlar, açık kalan işler. Ben bunu yeni bir sohbetin başına
yapıştıracağım. Maksimum 25 satır.
```

---

# HAFTA 1: Temel

## Gün 1 • Planlama, depo, proje panosu

**Amaç:** MoSCoW maddelerini GitHub Issue'larına çevirmek, README iskeletini ve proje panosunu hazırlamak.
**Önce yap:** Kurulum Rehberi'ni tamamla. `docs/` klasöründe öneri ve ADR, proje kökünde `CLAUDE.md` hazır olsun.

```
[Görev] MoSCoW kapsamımı GitHub Issues olarak yazmama yardım et. 5 MUST ve
2 SHOULD madde için birer issue hazırla. Ayrıca README.md iskeleti yaz.

[Kısıtlar]
- Her issue'da: başlık, açıklama (iş değeri, 2-3 cümle), kabul kriterleri
  (işaretlenebilir kutular), etiket (must veya should) ve tahmini gün
  (takvimde hangi güne denk geliyor).
- Kabul kriterleri test edilebilir olsun (örn. "Finance rolü ayarlar
  sayfasına girince 403 alır").
- Kapsama yeni madde ekleme.
- README yalnızca şu başlıkları içersin: Proje özeti, Teknoloji, Kurulum
  (boş bırak, Gün 13'te dolacak), Canlı adres (boş), Rol ve yetkiler,
  Dokümanlar (docs/ bağlantıları).

[Format] Önce issue listesini madde madde ver. Her issue'yu GitHub'a
doğrudan yapıştırabileceğim Markdown olarak ayrı kod bloğunda yaz. En sonda
README.md'nin tam içeriğini tek kod bloğunda ver. Ardından GitHub'da
Issue ve Projects panosunu nasıl açacağımı ekran adımlarıyla anlat.

[Doğrulama] Issue'ların 5 MUST + 2 SHOULD olduğunu say ve doğrula. Varsayım
yaptığın yeri belirt.
```

**Bitiş kontrolü**
- [ ] GitHub'da 7 issue açıldı, etiketler (must, should) eklendi
- [ ] Projects panosu açıldı (To do, In progress, Done) ve issue'lar eklendi
- [ ] `README.md` commit edildi
- **Commit:** `docs: README iskeleti ve proje belgeleri`

---

## Gün 2 • Prisma şeması, veritabanı bağlantısı, ilk deploy

**Amaç:** Veri modelini kurmak, Neon veritabanına bağlanmak, boş uygulamayı Render'da canlıya almak.
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
```

**Bitiş kontrolü**
- [ ] `npx prisma studio` (veya AI'nın verdiği komut) ile 6 tablo görünüyor
- [ ] Her tabloda (TENANTS hariç) `tenantId` var
- [ ] Render'da boş uygulama canlı adreste açılıyor (ilk açılış yavaş olabilir)
- [ ] `.env` commit'e **girmedi** (depo herkese açık, GitHub'da depoyu tarayıp `.env` ve veritabanı adresi göremediğini doğrula)
- [ ] Neon panelinde tablolar görünüyor (Tables / SQL Editor)
- [ ] ADR ve README'ye canlı adres yazıldı
- **Commit:** `feat: Prisma şeması ve ilk deploy`

---

## Gün 3 • Kayıt, giriş, roller, merkezi tenant filtresi

**Amaç:** Firma kaydı, giriş, çıkış, rol kontrolü ve tenant yardımcı fonksiyonu.
**Önce yap:** Yeni dal `feat/gun-03-giris-roller`. Gün 2 `main`'e birleşti.

```
[Görev] Kayıt, giriş, çıkış ve rol bazlı erişimi yaz; ardından aktif
kullanıcının tenantId değerini her sorguya uygulayan merkezi bir yardımcı
oluştur.

Akış:
- Kayıt: firma adı, ad soyad, e-posta, parola girilir. Sistem yeni bir
  TENANT ve o kiracının ilk USER'ını (role: manager) birlikte oluşturur.
- Giriş: e-posta ve parola. Başarılıysa oturum çerezi oluşur.
- Çıkış: oturumu sonlandırır.
- Korumalı sayfalara giriş yapmamış kullanıcı girerse giriş sayfasına
  yönlendirilir.
- Merkezi yardımcı: oturumdan tenantId ve role bilgisini okur. Veri
  sorgularında tenantId filtresini otomatik uygular. Rol gerektiren
  işlemler için "yalnızca manager" kontrolü sağlar.

[Kısıtlar]
- Parola bcryptjs (saf JavaScript sürümü) ile özetlenir. Düz metin
  parola asla saklanmaz veya loglanmaz.
- Oturum çerezi httpOnly olmalı. Oturum anahtarı ortam değişkeninden
  okunmalı. En az bağımlılıkla çözüm öner ve kullandığın paketi
  gerekçesiyle söyle.
- tenantId istemciden (form, URL) asla alınmaz.
- Kayıt formunda e-posta biçimi ve parola uzunluğu (en az 8 karakter)
  sunucuda doğrulanır. Aynı e-posta iki kez kayıt olamaz.
- Hata mesajları kullanıcı dostu Türkçe olsun. "E-posta mı parola mı
  yanlış" bilgisi ayrıştırılmasın.
- Arayüz sade olsun (Tailwind). Dashboard ve diğer sayfalar henüz boş
  yer tutucu olsun.

[Format] 1) Önce plan: dosya listesi, veri akışı, rol-yetki tablosu.
Onayımı bekle. 2) Sonra dosyaları tek tek, tam yollarıyla ver. 3) Elle
test adımları: kayıt ol, çıkış yap, giriş yap, giriş yapmadan korumalı
sayfaya gitmeyi dene. 4) Tenant yardımcısını doğrulayacak üç test
senaryosu öner.

[Doğrulama] Hangi tablolar etkilenir, hangi yetki ve tenant kontrolleri
gerekir, hangi hata durumları olabilir sırasıyla düşün. Sonra varsayım
listesi ver ve emin olmadığın noktaları belirt.
```

**Bitiş kontrolü**
- [ ] Kayıt, giriş ve çıkış çalışıyor
- [ ] Giriş yapmadan korumalı sayfaya erişim yönlendiriliyor
- [ ] Veritabanında parola düz metin değil, özet olarak görünüyor
- [ ] Tenant yardımcısı **tek dosyada** ve sorgular onu kullanıyor (kod okuma için Yardımcı Prompt B'yi çalıştır)
- **Commit:** `feat: kayıt, giriş, roller ve merkezi tenant filtresi`

---

## Gün 4 • Müşteri ve plan yönetimi

**Amaç:** Müşteri ve plan CRUD'u (silme yerine pasife alma), rol kontrolleriyle.

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

**Bitiş kontrolü**
- [ ] Müşteri ve plan ekleniyor, düzenleniyor, pasife alınıyor
- [ ] Finance rolüyle pasife alma engelleniyor (ikinci kullanıcıyı Gün 6'da test edeceksin, şimdi kodda mantığı oku)
- [ ] Sunucu tarafı yetki kontrolü var (yalnızca düğmeyi gizlemek yetmez)
- **Commit:** `feat: müşteri ve plan yönetimi`

---

## Gün 5 • Abonelik yaşam döngüsü ve olay kaydı

**Amaç:** Abonelik başlat, yenile, iptal et; her işlemi olay olarak kaydet.

```
[Görev] Abonelik yaşam döngüsünü yaz: başlat, yenile, iptal et. Her
işlem SUBSCRIPTION_EVENTS tablosuna olay yazar.

İş kuralları:
- Başlat: aktif bir müşteri ve aktif bir plan seçilir. Bir müşterinin
  aynı anda yalnızca bir ACTIVE aboneliği olabilir. startedAt = şimdi,
  currentPeriodEnd = plan aralığına göre bir ay veya bir yıl sonrası,
  status = ACTIVE, olay = STARTED.
- Yenile: yalnızca ACTIVE abonelikte yapılır. currentPeriodEnd bir
  aralık (ay veya yıl) ileri alınır, olay = RENEWED.
- İptal: yalnızca ACTIVE abonelikte yapılır. status = CANCELED,
  canceledAt = şimdi, olay = CANCELED. İptal edilen abonelik yenilenemez;
  müşteri için yeni abonelik başlatılır.
- Abonelik ve olay kaydı tek bir veritabanı işleminde (transaction)
  yapılır, biri başarısızsa ikisi de geri alınır.
- Abonelik listesi: müşteri adı, plan, durum, başlangıç, bitiş dönemi,
  duruma göre filtre.
- Gün 4'teki "aktif aboneliği olan müşteri/plan pasife alınamaz"
  kontrolünü şimdi tamamla.

[Kısıtlar]
- Hem manager hem finance abonelik işlemlerini yapabilir.
- Merkezi tenant yardımcısını kullan. Müşteri ve plan kimlikleri de aynı
  kiracıya ait mi diye doğrulanmalı (başka kiracının müşterisine
  abonelik açılamaz).
- Geçersiz durum geçişlerinde (örn. iptal edilmiş aboneliği yenileme)
  anlaşılır Türkçe hata ver.
- Ödeme, fatura veya e-posta ekleme.

[Format] 1) Durum geçiş tablosunu ve veri akışını göster, onay bekle.
2) Dosyalar tam yollarıyla. 3) Elle test senaryoları (geçerli ve geçersiz
geçişler). 4) Tenant izolasyonu için en az üç senaryo.

[Doğrulama] Etkilenen tablolar, yetki ve tenant kontrolleri, hata
durumları ve aynı anda iki kez tıklama gibi çakışma durumlarını sırayla
düşün. Varsayımlarını listele, emin olmadığın yeri belirt.
```

**Bitiş kontrolü**
- [ ] Başlat, yenile, iptal çalışıyor ve olay tablosunda kayıt oluşuyor (Prisma Studio ile bak)
- [ ] İptal edilmiş aboneliği yenilemeye çalışınca anlaşılır hata veriyor
- [ ] Aynı müşteriye ikinci aktif abonelik açılamıyor
- **Commit:** `feat: abonelik yaşam döngüsü ve olay kaydı`

---

## Gün 6 • Kiracı izolasyonu testleri

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

---

## Gün 7 • Tampon, hata düzeltme, kod anlama

**Amaç:** Açık kalanları kapatmak, kodu anlamak, Hafta 1'i temiz bitirmek.

```
[Görev] Hafta 1'in kodunu bir inceleme turundan geçir.

İncelenecekler: kimlik doğrulama, tenant yardımcısı, müşteri, plan ve
abonelik işlemleri.

[Kısıtlar]
- Henüz kod değiştirme. Yalnızca bulgu listesi çıkar.
- Her bulguyu şu sınıflara ayır: Güvenlik, Doğruluk, Okunabilirlik.
- Her bulgu için dosya yolu, sorun, neden önemli, önerilen düzeltme
  (kısa) ve öncelik (yüksek, orta, düşük) yaz.
- Kapsam dışı yeni özellik önerme.

[Format] Önce özet tablo, sonra ayrıntılar. En sonda "önce şunları
düzelt" diye en çok 5 maddelik sıralı bir liste.

[Doğrulama] Bulguların gerçekten dosyada olduğundan emin ol; emin
olmadığın yerde "doğrulamak için şu dosyayı göster" de. Tahmin etme.
```

Sonra yüksek öncelikli bulguları **tek tek** düzeltirken Yardımcı Prompt A'yı kullan. Ardından her ana dosya için Yardımcı Prompt B ile kodu anla.

**Bitiş kontrolü**
- [ ] Yüksek öncelikli bulgular kapandı
- [ ] En az 3 ana dosyayı Yardımcı Prompt B ile açıklattın ve kontrol sorularını cevapladın
- [ ] Tüm dallar `main`'e birleşti, Render'daki canlı site güncel ve çalışıyor
- [ ] Prompt Günlüğü'ne Gün 1-7 kısa notları eklendi
- **Commit:** `fix: hafta 1 inceleme bulguları`

---

# HAFTA 2: Değer ve cila

## Gün 8 • Metrik hesaplama fonksiyonları (birim testli)

**Amaç:** MRR, churn, ARPU, LTV, LTV/CAC ve aylık MRR geçmişini saf fonksiyonlarla hesaplamak.

```
[Görev] Metrik hesaplama fonksiyonlarını saf fonksiyon olarak yaz ve
birim testlerini ekle.

Fonksiyonlar:
1) MRR: ACTIVE aboneliklerin aylık fiyat toplamı. Yıllık planlar 12'ye
   bölünür.
2) Belirli bir tarihteki MRR (grafik için): bir abonelik, startedAt <=
   tarih ve (canceledAt boş veya canceledAt > tarih) ise o tarihte
   aktiftir.
3) Aylık churn: ay içinde iptal edenler / ay başındaki aktif müşteriler.
4) ARPU = MRR / aktif müşteri sayısı.
5) Ortalama ömür = 1 / churn (ay cinsinden).
6) LTV = ARPU x ortalama ömür.
7) LTV/CAC (CAC tenant ayarından gelir).

Dersteki doğrulama örneği (testte mutlaka olsun): 50 müşteri, her biri
aylık 1.000 TL, aylık churn %4, CAC 5.000 TL. Beklenen: MRR = 50.000 TL,
ortalama ömür = 25 ay, LTV = 25.000 TL, LTV/CAC = 5.

[Kısıtlar]
- Fonksiyonlar veritabanına dokunmaz. Girdi olarak düz veri alır, sonuç
  döndürür (böylece test edilebilir).
- Sıfıra bölme durumları (ay başında aktif müşteri yok, churn 0, aktif
  müşteri yok) ele alınır. Bu durumlarda "hesaplanamadı" anlamına gelen
  açık bir değer döndür (örn. null) ve neden o seçimi yaptığını yorumla
  açıkla.
- Para değerleri TL, tam sayı girdi. Yuvarlama kuralını belirt ve tek
  yerde uygula.
- Her fonksiyonun üstüne Türkçe, formülü anlatan kısa yorum yaz.
- Gereksiz paket ekleme.

[Format] 1) Fonksiyon listesi, girdi/çıktı tipleri ve sıfıra bölme
tablosu (onay bekle). 2) Kod dosyası tam yoluyla. 3) Test dosyası: dersteki
örnek + en az 5 uç durum. 4) Test komutu.

[Doğrulama] Formülleri yukarıdaki tanımlarla tek tek karşılaştır. Churn'ün
"müşteri mi, abonelik mi" ayrımında kuralımı (müşteri başına tek ACTIVE
abonelik) kullandığını teyit et. Varsayımlarını listele.
```

**Bitiş kontrolü**
- [ ] Dersteki örnek testi geçiyor (MRR 50.000, LTV 25.000, LTV/CAC 5)
- [ ] Sıfıra bölme testleri geçiyor
- [ ] Bir formülü elle (hesap makinesiyle) doğruladın
- **Commit:** `feat: metrik hesaplama fonksiyonları ve testleri`

---

## Gün 9 • KPI dashboard

**Amaç:** Metrikleri yöneticiye anlaşılır tek ekranda göstermek.

```
[Görev] Dashboard sayfasını yaz. Metrik fonksiyonlarını (Gün 8) gerçek
kiracı verisiyle birleştir.

İçerik:
- Üstte dört KPI kartı: MRR, aylık churn, LTV, LTV/CAC.
- LTV/CAC kartında 3 ve üzeri "sağlıklı", altı "dikkat" olarak
  etiketlenir (renk ve metin birlikte, yalnızca renge güvenilmez).
- Her kartta tek cümlelik açıklama (örn. "MRR: her ay düzenli gelen
  abonelik geliri").
- Altta kısa özet: aktif müşteri sayısı, bu ay yeni başlayan, bu ay iptal
  eden.
- Ayarlar bölümü (yalnızca manager): CAC değeri düzenlenir. Finance bu
  alanı göremez, sunucu tarafında da reddedilir.
- Veri yoksa anlaşılır boş durum mesajı: "Henüz abonelik yok, ilk
  aboneliği ekleyin".
- "Hesaplanamadı" durumunda değer yerine açıklayıcı metin göster, "NaN"
  veya "Infinity" asla görünmesin.

[Kısıtlar]
- Tüm veri merkezi tenant yardımcısıyla çekilir.
- Hesaplamayı sayfa içinde yeniden yazma, Gün 8'deki fonksiyonları kullan.
- Executive, sade ve okunaklı tasarım. Aşırı süsleme yok.
- Bu günün kapsamında grafik ve SSE yok.

[Format] 1) Sayfa yerleşimini kısa bir metin taslağıyla göster, veri
akışını açıkla (onay bekle). 2) Dosyalar tam yollarıyla. 3) Elle test:
elimde 3 müşteri ve 2 iptal olduğunda ekranda ne görmem gerektiğini
hesaplayarak yaz, ben karşılaştırayım.

[Doğrulama] Yetki ve tenant kontrollerini, boş veri ve sıfıra bölme
durumlarını sırayla düşün. Varsayımlarını listele.
```

**Bitiş kontrolü**
- [ ] Dört KPI doğru görünüyor (elle hesapla karşılaştır)
- [ ] Finance CAC'yi değiştiremiyor (sunucu tarafında da)
- [ ] Boş veride hata yerine mesaj çıkıyor
- **Commit:** `feat: KPI dashboard`

---

## Gün 10 • SSE uyarıları (SHOULD)

**Amaç:** İptal ve riskli abonelik uyarısını yenilemeden ekrana düşürmek.

```
[Görev] SSE ile gerçek zamanlı uyarı özelliğini yaz.

Uyarılar:
- Bir abonelik iptal edildiğinde ilgili kiracının açık oturumlarındaki
  manager ve finance kullanıcılarına "[Müşteri adı] aboneliğini iptal
  etti" uyarısı gider.
- Riskli abonelik: currentPeriodEnd tarihine 7 günden az kalmış ve
  henüz yenilenmemiş ACTIVE abonelikler dashboard'da "riskli" olarak
  listelenir. Bu liste sayfa açılışında hesaplanır, SSE zorunlu değil;
  SSE yalnızca iptal olayını canlı iletir.

[Kısıtlar]
- Uyarı yalnızca olayın ait olduğu kiracının kullanıcılarına gider.
  Başka kiracının uyarısı asla iletilmez (bunu ayrıca test et).
- SSE uç noktası giriş yapmamış kullanıcıya kapalıdır.
- Bağlantı kopunca tarayıcı otomatik yeniden bağlansın.
- Render'da ücretsiz servis uyuyabilir, bunun SSE'ye etkisini kısaca
  açıkla.
- WebSocket, polling, harici servis veya yeni paket ekleme. Önerin varsa
  önce gerekçeyle sor.
- Sunucu belleğinde bağlantı listesi tutuluyorsa, bunun tek sunucu
  süreciyle çalıştığını ve neden bu proje için yeterli olduğunu belirt.

[Format] 1) Olay akışını adım adım anlat: iptal tıklanır, ne olur, uyarı
nasıl ekrana düşer (onay bekle). 2) Dosyalar tam yollarıyla. 3) Elle test:
iki tarayıcı penceresiyle (biri aynı kiracı, biri farklı kiracı) deneme
adımları ve beklenen sonuç.

[Doğrulama] Tenant sızıntısı, yetkisiz bağlantı, kopan bağlantı ve çok
sayıda açık bağlantı durumlarını sırayla düşün. Varsayımlarını listele,
emin olmadığın yeri belirt.
```

**Bitiş kontrolü**
- [ ] Bir pencerede iptal edince diğer pencerede (aynı firma) uyarı anında görünüyor
- [ ] Farklı firmanın penceresinde uyarı **görünmüyor**
- [ ] Giriş yapmadan SSE adresi açılmıyor
- **Commit:** `feat: SSE ile iptal uyarısı ve riskli abonelik listesi`

> Süre yetmezse SSE'yi Gün 13 tamponuna ertele; MUST'lar bunsuz tamamdır.

---

## Gün 11 • Aylık MRR grafiği, boş durum ve hata ekranları

**Amaç:** MRR geçmişini görselleştirmek, uygulamayı hata ve boşluklara karşı sağlamlaştırmak.

```
[Görev] Dashboard'a son 12 ayın aylık MRR grafiğini ekle ve uygulamanın
hata ve boş durum ekranlarını tamamla.

Grafik:
- Gün 8'deki "belirli tarihteki MRR" fonksiyonunu her ayın son günü için
  çağırarak son 12 ayın MRR değerini hesapla.
- Önce paketsiz, Tailwind veya basit SVG ile çözüm mümkün mü değerlendir.
  Paket şartsa en yaygın ve bakımı sürdürülen seçeneği öner, adını ve
  gerekçesini yaz, npm'de varlığını kontrol etmem için ayrıca belirt.
- Eksenlerde ay adı (Türkçe) ve TL değeri, hover'da değer görünsün.

Ekranlar:
- Boş durum: müşteri yok, plan yok, abonelik yok, grafik verisi yok.
- Hata sayfaları: 404 ("bulunamadı") ve genel hata. Yetkisiz erişimde
  (403) anlaşılır bir mesaj.
- Yüklenme durumları.
- Formlarda tutarlı hata ve başarı mesajları.

[Kısıtlar]
- Veri tenant yardımcısından gelir. Grafik hesabı istemcide değil
  sunucuda yapılır.
- Türkçe metin tutarlılığı: tüm başlıklar, düğmeler ve hatalar Türkçe.
- Erişilebilirlik: renk tek başına anlam taşımasın, grafiğe metin
  alternatifi (özet cümle) ekle.
- Yeni özellik ekleme.

[Format] 1) Karar notu: grafik yaklaşımı ve gerekçe (onay bekle).
2) Dosyalar tam yollarıyla. 3) Sınama listesi: boş hesap, tek abonelik,
12 aydan eski veri, yıllık plan.

[Doğrulama] Yıllık planın aylık MRR'a doğru yansıdığını, ay sınırlarını
(ayın son günü) ve saat dilimi riskini düşün. Varsayımlarını listele.
```

**Bitiş kontrolü**
- [ ] Grafik değerleri Gün 8 testlerindeki mantıkla uyuşuyor (elle bir ayı hesapla)
- [ ] Boş ve hata ekranları denendi (var olmayan adres, başka kiracının kimliği)
- **Commit:** `feat: aylık MRR grafiği, boş durum ve hata ekranları`

---

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

## Gün 13 • README, demo verisi, belgeler

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

C) Belgeler: docs/ içindeki ADR'de değişen bir yer
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
```

**Bitiş kontrolü**
- [ ] Seed çalıştı, her iki demo firmada dashboard anlamlı
- [ ] README'deki adımlarla (yeni bir klasörde) proje sıfırdan çalıştırılabiliyor ya da bir arkadaşın deniyor
- [ ] Prompt Günlüğü tamamlandı: başlangıç + 3 tur, günlük tablo, sonuç notları
- **Commit:** `docs: README, demo verisi ve belge güncellemeleri`

---

## Gün 14 • Son deploy ve sunum hazırlığı

**Amaç:** Canlı siteyi doğrulamak, teslimi tamamlamak, sunumu hazırlamak.

```
[Görev] Son deploy ve teslim kontrolünü hazırla; 5 dakikalık demo ve
sunum akışı yaz.

1) Canlı doğrulama listesi: Render'daki sitede ortam değişkenlerinin
   tanımlı olduğunu, Neon veritabanı bağlantısını, demo girişleri, iki
   kiracı izolasyonunu, dashboard ve grafik değerlerini, SSE uyarısını
   doğrulayacak madde madde bir kontrol listesi.
2) Sunum günü riskleri: ücretsiz Render web servisi uyku süresi (ilk
   istek yaklaşık 1 dakika) ve ücretsiz Neon veritabanının uyanma
   gecikmesi. Sunumdan önce yapılacaklar listesi (siteyi ve giriş
   sayfasını önceden açma, dashboard'u bir kez yükleme, internet
   kesilirse yedek plan olarak ekran kaydı alma). Ayrıca herkese açık
   depoda gizli bilgi kalmadığını son kez doğrulama adımları.
3) 5 dakikalık demo akışı: hangi sırayla ne gösterilir, her adımda ne
   söylenir. Akış: yönetim problemi, çok kiracılı SaaS kararı, iki firma
   izolasyonu, abonelik yaşam döngüsü, dashboard metrikleri, SSE uyarısı,
   AI ile geliştirme sürecinden (Prompt Günlüğü) bir örnek.
4) Beklenen sorulara hazırlık: en az 10 soru ve kısa cevaplar (örn.
   "Neden serverless değil?", "tenant_id unutulursa ne olur?", "AI
   hata yaptıysa nasıl fark ettin?", "Hangi kararın değişti?").
5) Teslim kontrol listesi: proje fikri önerisi, güncellenmiş ADR, AI
   talimat dosyası, Prompt Günlüğü, GitHub bağlantısı, canlı adres.

[Kısıtlar]
- Yalnızca projede gerçekten yapılanı anlat, yapılmamış özelliği
  yapılmış gibi gösterme.
- Cevaplar sade olsun, teknik terimleri YBS öğrencisi anlatır gibi
  açıkla.
- Yeni özellik veya kod değişikliği önerme (kritik hata hariç).

[Format] Dört bölüm (kontrol listesi, risk planı, demo akışı, soru-cevap),
her biri Markdown tablo veya numaralı liste.

[Doğrulama] Demo akışının MUST maddelerinin hepsini kapsadığını say ve
doğrula. Bilmediğin bir proje ayrıntısını uydurma, bana sor.
```

**Bitiş kontrolü**
- [ ] Canlı site doğrulama listesinin hepsi işaretli
- [ ] Teslim paketi tam (4 belge + depo + canlı adres), hocadan teslim biçimini teyit ettin
- [ ] Demo akışını bir kez sesli denedin
- [ ] Siteyi sunumdan 10 dakika önce açıp ısıttın (Render ve Neon uyanık)
- [ ] Herkese açık depoda `.env`, parola veya veritabanı adresi olmadığını son kez kontrol ettin
- [ ] Yedek plan: demo ekran kaydı hazır
- **Son commit:** `chore: son deploy ve teslim`

---

## Takvim özeti

| Gün | Konu | Tür |
|---|---|---|
| 1 | Issue'lar, README iskeleti, pano | Hazırlık |
| 2 | Prisma şeması, DB, ilk deploy | MUST 5 (zemin) |
| 3 | Kayıt, giriş, roller, tenant yardımcısı | MUST 1, 5 |
| 4 | Müşteri ve plan yönetimi | MUST 2 |
| 5 | Abonelik yaşam döngüsü | MUST 3 |
| 6 | İzolasyon ve rol testleri | MUST 5 |
| 7 | Tampon, inceleme, kod anlama | Tampon |
| 8 | Metrik fonksiyonları ve testleri | MUST 4 |
| 9 | KPI dashboard | MUST 4 |
| 10 | SSE uyarıları | SHOULD |
| 11 | MRR grafiği, boş/hata ekranları | SHOULD |
| 12 | Güvenlik gözden geçirme | Kalite |
| 13 | README, seed, belgeler | Teslim |
| 14 | Son deploy, sunum | Teslim |

**Geri kalma kuralı:** Bir gün aksarsa önce SHOULD maddelerini (Gün 10-11) kısalt, MUST maddelerine ve belgelere dokunma. COULD maddeleri (CSV, plan kırılımı) yalnızca her şey bittiyse yapılır.
