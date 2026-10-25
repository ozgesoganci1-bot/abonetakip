# Gün 14: Kullanıcı yönetimi, belge temizliği ve Prompt Günlüğü etkinliği

> **Araç:** Claude (claude.ai), "SUNUCU TABANLI PROGRAMLAMA - SaaS PROJESİ" Project'i içindeki sohbetler.
> **Tarih:** 25 Eki 2026 (Türkiye saati). **Kapsam:** 21 prompt ve 21 cevap.
> Kutulardaki metin benim yazdığım prompttur (olduğu gibi). Girintili (`>` ile başlayan) alanlar Claude'un cevabıdır, başlık, tablo ve kod blokları orijinal Markdown'dır. Ekran görüntüleri metin olmadığı için `[ekran görüntüsü]` satırı olarak işaretlenmiştir. Yapay zekânın iç düşünme adımları ve araç çağrıları dahil değildir.
> Gizli bilgi taraması yapılmıştır. Ad taramasının kendi arama deseni `[AD_DESENI]` olarak yazılmıştır. Mac kullanıcı adı, okul kısaltması, veritabanı sunucu adı ve parola benzeri değerler maskelenmiştir.
> Bu gün ayrı sohbetlerde yürütüldü. Ana sohbette yapılan yönlendirme ve inceleme mesajları bu dosyaya dahil değildir. Prompt Günlüğü etkinliği (Başlangıç ve üç tur) her biri yeni bir sohbette çalıştırıldı; ilk mesajlarda promptun yanında günlük şablonundaki başlık ve "Gözlenecekler" satırları da yapıştırılmıştır, olduğu gibi bırakılmıştır.


## Bu günün özeti

_Bu bölümü ben yazdım, yapay zekâ cevabı değildir. Kaynağı Prompt Günlüğü'dür._

| | |
|---|---|
| **Ne istendi** | Gün 14 promptu: son kontrol ve inceleme hazırlığı; ek iş olarak issue #1'deki kullanıcı yönetimi (manager kendi firmasının kullanıcılarını listeler ve finans kullanıcısı ekler). Önce plan; mevcut dosyalar gösterildikten sonra onay, uygulama beş parçada ve her parçadan sonra testler. Plan ve uygulama bu sohbette yapıldı |
| **Ne üretildi** | `kullaniciGirdisiniDogrula` ve `tarihMetni` (6 birim testi, `npm test` 197), `auth.ts` içinde `parolaOzetle`, `kullanici-yonetimi.ts` ve `kullanici-yonetimi.test.ts` (7 test, `npm run test:db` 64), Kullanıcılar sayfası, form ve sunucu işlemi; README'de "İnceleme için" bölümü ve kullanıcı yönetimi sınırı; ADR Gün 14 bölümü |
| **Düzeltme gerekti mi** | Evet: (1) Gün 14 şablonu sunum hazırlığı ve teslim listesi istiyordu, proje sunumsuz inceleniyor; sunum akışı yerine README'de kısa bir inceleme bölümü yazıldı, teslim listesi depoya konmadı; (2) AI manager rolünün de eklenip eklenemeyeceğini sordu, geri alınamayacağı için yalnızca finance seçildi; (3) AI `test:db` için 65 test bekledi, dosyada 7 test var, doğrusu 64; (4) AI'nın Neon temizlik SQL'i ad desenine bağlıydı, test dalında 22 Ekim'den kalan elle test kayıtları ve aynı adlı eski bir firma vardı ve silinirdi; SQL tam e-posta adreslerine ve `createdAt >= 2026-10-25` şartına bağlanarak çalıştırıldı; (5) Neon SQL Editor ilk açılışta canlı dalda (Default) açıktı, orada yalnızca SELECT çalıştı (0 satır), hemen test dalına geçildi |

## Gün 14 sohbeti (plan, kullanıcı yönetimi, belge blokları)

_Plan ve kullanıcı yönetimi özelliği bu sohbette yürütüldü._

### Prompt 1 · 25 Eki 2026 14:27

`````text
````markdown
Bu bir devam oturumu. Proje talimatlarındaki (CLAUDE.md) kurallara uy.
Ben kod bilmeyen bir YBS öğrencisiyim, Türkçe, sade ve adım adım anlat.
Önce plan ver, ben onaylamadan dosya değiştirme. Cevabın sonunda
varsayımlarını ve emin olmadığın yerleri listele.
Bugünün konusu: Gün 14 • Son deploy ve sunum hazırlığı

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
- **Son commit:** `chore: son deploy ve teslim` ek olarak yapılması gereken:/kullanicilar sayfası şu an yer tutucu. Gün 1 issue #1 (MUST) "çalışanlarını rol ile ekleyebilmeli" diyor. Küçük kullanıcı yönetimi yapılacak:
- Manager kendi firmasının kullanıcılarını (ad, e-posta, rol, eklenme tarihi) listeler.
- Manager firmaya yeni kullanıcı ekler (ad, e-posta, parola, rol: finance; manager gerekçeli olarak sorulsun). 
- Finance bu sayfaya girince sunucuda reddedilir.
- Kapsam dışı: davet e-postası, parola sıfırlama, silme, rol değiştirme, pasife alma. Bunlar ADR'de kabul edilen sınır olarak yazılır.
Kurallar: tenantId yalnızca oturumdan, sorgular getTenantDb() ile, parola bcrypt, girdiler sunucuda doğrulanır, yeni paket yok. E-posta benzersizliği kuralı ve User tablosundaki yazma/silme kuralları için önce mevcut dosyaları (auth.ts, tenant.ts, kayıt akışı) göstermemi iste, tahmin etme. Önce plan ver, onayımdan önce kod yazma. Plan sırası: bu iş önce, sonra temizlik listesi (claude/gun14_notlari.md Project dosyasında).
Ayrıntılı not Project'te: claude/gun14_kullanici_yonetimi.md.
````
`````

### Claude cevabı 1 · 25 Eki 2026 14:28

> # Gün 14 planı: önce kullanıcı yönetimi, sonra temizlik, en sonda teslim kontrolü
>
> Henüz hiçbir dosyaya dokunmuyorum. Onayından ve istediğim dosyaları görmeden kod yazmayacağım.
>
> ## 0. Başlamadan önce iki çelişki
>
> Gün 14 şablonu ile Project notların birbirini tutmuyor. Tahmin etmek yerine soruyorum:
>
> | Şablonda yazan | Notlarda yazan | Önerim |
> |---|---|---|
> | "5 dakikalık demo ve sunum akışı", "beklenen sorular" | "Sunum yok. Depo, belgeler ve canlı uygulama incelenecek." | Sunum akışını **"inceleme rehberi"** olarak yazalım. Bu, hocanın siteyi açınca neyi hangi sırayla görebileceğini anlatan kısa bir README bölümü ya da ayrı bir belge olur. Soru-cevabı da kendi hazırlığın için, depoya koymadan hazırlarım. |
> | Teslim listesinde "proje fikri önerisi" var | `docs/01_Proje_Onerisi.md` PR #45 ile depodan kaldırıldı. Hafta 4'te ayrı teslim edildi. | Teslim listesinde "Hafta 4'te ayrı teslim edildi" diye işaretleyelim, depoya geri koymayalım. |
>
> ## Parça A: Küçük kullanıcı yönetimi (önce bu)
>
> ### A1. Bana göstermen gereken dosyalar
>
> Önce dosya adlarını bulalım. Bu komut, depodaki ilgili dosyaların yalnızca adlarını listeler, içeriklerini göstermez:
>
> ```
> git ls-files | grep -i -E "auth|tenant|kayit|giris|kullanici|ayarlar|schema.prisma|test"
> ```
>
> Çıktıyı bana gönder. Sonra aşağıdakilerin içeriğini isteyeceğim. Bu dosyalarda secret olmamalı, ama yine de göz at.
>
> 1. `auth.ts`: oturumdan `tenantId` ve rolün nasıl okunduğunu görmek için.
> 2. `tenant.ts`: `getTenantDb()` ve User tablosu için yazma beyaz listesi ile silme yasağını görmek için.
> 3. **Kayıt akışı** (sayfa ve sunucu tarafı): e-posta benzersizliğini, parola kuralını ve hata mesajlarını aynen uygulamak için.
> 4. `prisma/schema.prisma` içindeki **User modeli**: e-posta global olarak mı, firma bazında mı benzersiz? `createdAt` alanı var mı?
> 5. **Ayarlar sayfası**: manager'a özel sayfalarda finance'in nasıl reddedildiğini görmek için (403 mü, yetkisiz ekranı mı).
> 6. **Müşteri ekleme** formu ve sunucu tarafı: form, doğrulama ve kaydetme desenini kopyalamak için.
> 7. Mevcut `/kullanicilar` sayfası.
> 8. Bir birim test dosyası örneği.
>
> ### A2. Veri akışı (dosyaları görünce kesinleşecek)
>
> **Listeleme:**
> - Manager `/kullanicilar` sayfasını açar.
> - Sunucu, oturumdan `tenantId` ve rolü okur.
> - Rol manager değilse, ayarlar sayfasındaki yöntemle reddedilir.
> - `getTenantDb()` ile yalnızca bu firmanın kullanıcıları okunur. Seçilen alanlar ad, e-posta, rol ve eklenme tarihidir. **Parola özeti hiçbir zaman seçilmez.**
>
> **Ekleme:**
> - Form gönderilir ve sunucu tarafı çalışır.
> - Rol kontrolü burada **yeniden** yapılır. Sayfayı gizlemek yetmez, çünkü finance doğrudan istek atabilir.
> - Girdiler doğrulanır: ad boş olamaz, e-posta biçimi doğru olmalı, parola kurala uymalı (kayıttaki kural kullanılır), rol yalnızca izin verilen değerlerden biri olabilir.
> - E-posta benzersizliği kontrol edilir (kural kayıt akışından alınır).
> - Parola bcrypt ile özetlenir.
> - `getTenantDb()` üzerinden kayıt eklenir. `tenantId` yalnızca oturumdan gelir. Formdan bir `tenantId` gelse bile yok sayılır.
>
> **Etkilenen tablo ve şema:**
> - Yalnızca USERS etkilenir: okuma ve ekleme. Güncelleme ve silme yok.
> - Şema değişikliği beklemiyorum. Ama `createdAt` alanı yoksa bir geçiş (migration) gerekir. O durumda önce sana sorarım.
>
> ### A3. Düşünülen hata durumları
>
> | Durum | Davranış |
> |---|---|
> | Finance sayfaya ya da ekleme isteğine gelir | Sunucuda reddedilir |
> | Rol alanına "admin" gibi tanımsız bir değer gelir | Doğrulama hatası |
> | E-posta zaten kayıtlı | Kayıt akışındaki mesajın aynısı gösterilir (B11 ile tutarlı) |
> | Eksik ya da hatalı girdi | Form, açıklayıcı bir hata mesajıyla geri döner |
> | Başka firmanın kullanıcıları | Listede hiç görünmez (`getTenantDb()` filtreler) |
>
> ### A4. Senden karar gereken konu: manager rolü eklenebilsin mi?
>
> | Seçenek | Artısı | Riski |
> |---|---|---|
> | **a) Yalnızca finance (önerim)** | Basit ve güvenli | Firmanın ikinci bir yöneticisi olamaz |
> | b) Finance + manager | Firma sahibi ortağını da ekleyebilir | Silme ve rol değiştirme kapsam dışı olduğu için yanlışlıkla eklenen bir manager **geri alınamaz** |
>
> ### A5. Test ve kontrol
>
> - **Birim test:** Girdi doğrulamasını saf bir fonksiyona çıkarıp test ederim. Bu fonksiyon veritabanı istemediği için `npm test` ile çalışır.
> - **Elle test** (`npm run dev:test` ile test dalında):
>   1. Manager hesabıyla arayüzden bir finance kullanıcısı ekle.
>   2. O finance hesabıyla giriş yap.
>   3. Müşteri, plan ve abonelik sayfalarına girebildiğini doğrula.
>   4. Ayarlar ve kullanıcılar sayfalarında reddedildiğini doğrula.
>   5. Diğer firmanın kullanıcılarının listede görünmediğini doğrula.
>
> ### A6. Dal, commit ve belgeler
>
> - **Dal:** `feat/gun-14-kullanici-yonetimi`. Commit öncesi üç tarama yapılır, ardından PR açılır ve Squash and merge ile birleştirilir.
> - **README:** 190. satırdaki "yer tutucu" sınırı güncellenir.
> - **ADR:** Yeni bir Gün 14 bölümü eklenir. Kararlar ve kabul edilen sınırlar (davet e-postası, parola sıfırlama, silme, rol değiştirme, pasife alma yok) burada yazılır. 259, 642 ve 992. satırlar geçmiş gün kayıtlarıdır, onlara dokunulmaz.
> - **Kullanıcılar sayfası:** Yer tutucu metin kaldırılır.
>
> ## Parça B: Temizlik listesi (`gun14_notlari.md` sırasıyla)
>
> 1. **Belge düzeltmeleri:**
>    - ADR'deki `[Tarih]` yer tutucuları `git log` ile bulunan gerçek tarihlerle doldurulur.
>    - Gün 10'daki `npm run build` sonucu ve `[SONUÇ: ...]` yer tutucuları doldurulur. Sonuçlar senin hatırladığından alınır. Kayıt yoksa "ayrıntılı sonuç kaydedilmedi" yazılır, tahmin yazılmaz.
>    - Gün 11'deki başlık boşluğu silinir.
>    - Prompt Günlüğü'ndeki `[doldur]` yer tutucularını senin gözlemlerinle doldururum. Bunları sana sorarım.
>    - Belgelerde "Sunumdan" ifadesi kaldıysa "İncelemeden" yapılır.
> 2. **`CLAUDE.md` eşitleme:** Repodaki dosya Project talimatlarıyla eşitlenir.
> 3. **README:** "Sonraki günler..." cümlesi varsa güncellenir.
> 4. **PR #41 ek kontrolü:** Bu yalnızca okuma işlemidir. Bozuksa not düşülür, geçmiş commit değiştirilmez.
> 5. **Eski uzak dalları silme:** Silmeden önce silinecek dalların listesini sana gösteririm, onayınla silersin. Geri alınamayan tek adım budur.
> 6. **Test hesaplarını temizleme:** Demo kiracılara (Mavi Yazılım, Kuzey Teknoloji, `@demo.example`) dokunulmaz.
> 7. **Zorunlu olmayan işler** (yalnızca zaman kalırsa): ortak yazma mantığının ayrı dosyaya çıkarılması (K13.6) ve B7.
>
> ## Parça C: Canlı doğrulama ve teslim (en son)
>
> Sunum olmasa da canlı doğrulama listesini, teslim listesini ve gizli bilgi taramasını yine hazırlarım.
>
> **Uyku riski incelemede de geçerli:** Hoca siteyi açtığında ücretsiz Render servisi ve Neon veritabanı uykuda olabilir, ilk açılış yaklaşık 1 dakika sürebilir. Bunu README'ye bir cümleyle not etmeyi öneririm.
>
> **Son commit hakkında:** Şablondaki `chore: son deploy ve teslim` commit'i de PR kuralına uyar. Main'e doğrudan push edilmez, ayrı bir dalda yapılır.
>
> ## Senden istediklerim
>
> 1. A1'deki komutun çıktısı.
> 2. Manager rolü kararı: a mı, b mi?
> 3. Sunum yerine "inceleme rehberi" yaklaşımına ve proje önerisinin teslim listesinde "ayrı teslim edildi" olarak işaretlenmesine onay.
> 4. Planın genel onayı.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - Dosya yollarını, User modelindeki alanları ve e-posta benzersizlik kuralını **bilmiyorum**. Dosyaları görünce kesinleşecek.
> - Ekleme işleminin sunucu eylemiyle mi, API rotasıyla mı yapılacağı mevcut müşteri ekleme desenine bağlı.
> - User tablosundaki yazma beyaz listesi ekleme işlemine izin vermiyorsa, `tenant.ts` dosyasını değiştirmeden önce sana sorarım.
> - Hafta 4'teki proje önerisinin hocaya ayrıca teslim edildiğini varsayıyorum.
> - Tahmini süre (1,5-2 saat) notlarındaki tahmindir, benim ölçümüm değil.

### Prompt 2 · 25 Eki 2026 14:30

````text
Plan kabul, şu düzeltmelerle: (1) Manager rolü: yalnızca finance (a). (2) "İnceleme rehberi" olsun ama küçük: README'de kısa bir "İnceleme için" bölümü, mevcut "İncelemeden önce siteyi ısıt" cümlesini tekrar etme, genişlet. Soru-cevap hazırlama. (3) Proje önerisi depodan kaldırıldı ve kullanıcı istemiyor: teslim kontrol listesine ve hiçbir belgeye "proje önerisi" yazma. Teslim listesini depoya koyma, yalnızca sohbette ver. (4) Dal adı: gun14-kullanici-yonetimi. (5) Elle testte sahte e-posta kullan (@example.com ya da @demo.example), gerçek kişi verisi yok; test dalında açılan test hesaplarının temizlenmesini adıma ekle. (6) ADR sınırlarına "parola yalnızca yönetici tarafından belirlenir, parola değiştirme akışı yok" ekle. (7) Commit eklerinde kendi model adını ve BU sohbetin oturum adresini yaz, ana sohbetin ya da Gün 13'ün adresini değil.
A1'deki komutun çıktısını şimdi gönderiyorum. 
.env.test.example
prisma/schema.prisma
src/app/(auth)/actions.ts
src/app/(auth)/giris/GirisFormu.tsx
src/app/(auth)/giris/page.tsx
src/app/(auth)/kayit/KayitFormu.tsx
src/app/(auth)/kayit/page.tsx
src/app/(panel)/ayarlar/CacFormu.tsx
src/app/(panel)/ayarlar/actions.ts
src/app/(panel)/ayarlar/page.tsx
src/app/(panel)/kullanicilar/page.tsx
src/lib/auth.ts
src/lib/bicim.test.ts
src/lib/cac-ayari.test.ts
src/lib/dashboard-verisi.test.ts
src/lib/donem.test.ts
src/lib/giris-siniri.test.ts
src/lib/giris-siniri.ts
src/lib/giris.test.ts
src/lib/metrikler.test.ts
src/lib/mrr-grafigi.test.ts
src/lib/pasife-alma.test.ts
src/lib/riskli-abonelikler.test.ts
src/lib/riskli-etiket.test.ts
src/lib/session.test.ts
src/lib/sse-hub.test.ts
src/lib/tenant.test.ts
src/lib/tenant.ts
src/lib/validation.test.ts
src/lib/yetki.test.ts
src/test-destek/canli-koruma.test.ts
src/test-destek/canli-koruma.ts
src/test-destek/demo-kurulum.test.ts
src/test-destek/demo-kurulum.ts
src/test-destek/demo-verisi.ts
src/test-destek/dev-test.ts
src/test-destek/donem-ilerlet.ts
src/test-destek/duman.test.ts
src/test-destek/gecmis-mrr-verisi.ts
src/test-destek/guvenlik-basliklari.test.ts
src/test-destek/kancalar.mjs
src/test-destek/kurallar.test.ts
src/test-destek/seed-demo.ts
src/test-destek/veri.ts
````

### Claude cevabı 2 · 25 Eki 2026 14:31

> Düzeltmelerin hepsi plana işlendi:
>
> - Yalnızca finance rolü eklenebilecek.
> - README'deki inceleme bölümü küçük kalacak, mevcut "ısıt" cümlesi genişletilecek.
> - "Proje önerisi" hiçbir belgeye yazılmayacak. Teslim listesini yalnızca sohbette vereceğim.
> - Dal adı `gun14-kullanici-yonetimi` olacak.
> - Elle testte yalnızca `@example.com` adresleri kullanılacak. Açılan test hesaplarının temizlenmesi ayrı bir adım olarak listede.
> - ADR'ye "parola yalnızca yönetici tarafından belirlenir, parola değiştirme akışı yok" sınırı eklenecek.
> - Commit eklerinde `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` yazılacak. **Bu sohbetin oturum adresini ben göremiyorum.** Commit adımına gelince adresi tarayıcının adres çubuğundan kopyalayıp bana vermeni isteyeceğim.
>
> ## Sıradaki adım: dosyaları göster
>
> Listeden önemli bir şey çıktı. Ayarlar sayfası (`ayarlar/page.tsx`, `actions.ts`, `CacFormu.tsx`) zaten "yalnızca manager, form, sunucu eylemi" deseni. Bu yüzden müşteri ekleme dosyalarına gerek yok, örnek olarak ayarlar sayfasını kullanacağım.
>
> Arama desenin "test" kelimesini aradığı için doğrulama ve yetki dosyalarının kendisi listede çıkmadı, yalnızca test dosyaları çıktı. Önce şu komutu çalıştır. Bu komut `src/lib` klasöründeki tüm dosyaların adlarını listeler:
>
> ```
> git ls-files src/lib
> ```
>
> Ardından dosyaları bu sırayla gönder. Her dosyayı VS Code'da açıp içeriğin tamamını kopyalayabilirsin. Uzun gelirse iki mesaja böl.
>
> **1. grup (çekirdek kurallar):**
> 1. `src/lib/tenant.ts`: User tablosu için yazma beyaz listesi ve silme yasağı.
> 2. `src/lib/auth.ts`: oturumdan `tenantId` ve rolün okunması.
> 3. `prisma/schema.prisma`: User modeli, e-posta benzersizliği ve `createdAt` alanı. Tamamını gönderebilirsin, içinde secret yok, adres ortam değişkeninden okunuyor.
> 4. `src/app/(auth)/actions.ts`: kayıt akışı, parola kuralı, bcrypt kullanımı ve "e-posta zaten var" mesajı.
>
> **2. grup (izlenecek desen):**
> 5. `src/app/(panel)/ayarlar/page.tsx` ve `src/app/(panel)/ayarlar/actions.ts`: finance'in nasıl reddedildiği.
> 6. `src/app/(panel)/ayarlar/CacFormu.tsx`: form ve hata gösterme deseni.
> 7. `src/app/(panel)/kullanicilar/page.tsx`: mevcut yer tutucu sayfa.
> 8. Doğrulama ve yetki dosyaları (adları `git ls-files src/lib` çıktısından belli olacak; muhtemelen `validation.ts` ve `yetki.ts`) ile `src/lib/validation.test.ts`: test deseni.
>
> Yapıştırmadan önce, içerikte gerçek bir adres ya da parola görürsen `[DATABASE_URL]` gibi bir yer tutucuyla değiştir. Bu dosyalarda olmaması gerekir.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - Ayarlar sayfasının manager kontrolünü sunucuda yaptığını varsayıyorum. Dosyayı görünce doğrulayacağım.
> - Doğrulama ve yetki dosyalarının adlarını test dosyalarından tahmin ettim. Doğrusu komut çıktısında görünecek.
> - Hangi model adının commit'e yazılacağı, commit anında hangi modelin seçili olduğuna bağlı. Sohbet ortasında model değiştirirsen bana söyle.

### Prompt 3 · 25 Eki 2026 14:34

````text
Dosyalar ekte (gun14_dosyalar1.txt): tenant.ts, auth.ts, session.ts, yetki.ts, validation.ts, schema.prisma, (auth)/actions.ts, KayitFormu.tsx, ayarlar/page.tsx, actions.ts, CacFormu.tsx, kullanicilar/page.tsx, cac-ayari.test.ts. Eksik gördüğün dosyayı söyle.
````

_[ek dosya: gun14_dosyalar1.txt]_

### Claude cevabı 3 · 25 Eki 2026 14:35

> Dosyalar plan için yeterli, ama kod yazmadan önce birkaç dosya daha lazım. Önce bulduklarımı, sonra güncellenmiş planı, en sonda eksik dosyaları yazıyorum.
>
> ## 1. Dosyalardan öğrendiklerim
>
> | Konu | Dosyada ne var? | Bu iş için anlamı |
> |---|---|---|
> | **E-posta benzersizliği** | `schema.prisma`: User tablosunda `email @unique`, yani benzersizlik **bütün sistemde** geçerli, firma bazında değil | Bir e-posta, başka bir firmada kayıtlıysa da eklenemez. |
> | **Kontrolün tuzağı** | `getTenantDb()` aramaya kendi firmanın filtresini ekler | Önce "bu e-posta var mı" diye arasaydık, yalnızca kendi firmamıza bakardık ve başka firmadaki kaydı görmezdik. Bu yüzden asıl koruma veritabanının kendisi olacak: kayıt denenir, veritabanı reddederse `tekrarEdenKayitMi()` bunu yakalar. Kayıt akışında da aynı yöntem kullanılıyor. |
> | **Yazma kuralları** | `tenant.ts`: User için ekleme serbest, yalnızca tablonun kendi sütunları yazılabilir, `tenantId` oturumdan zorla yazılır | Ad, e-posta, parola özeti ve rol sütunları yazılabilir. **`tenant.ts` değişmeyecek.** |
> | **Silme** | User tablosunda silme serbest | Bu işte silme kodu yazılmayacak. Kapsam dışı. |
> | **Eklenme tarihi** | `createdAt` alanı zaten var | **Şema değişikliği ve geçiş (migration) gerekmiyor.** |
> | **Ad** | `name` boş olabilir | Listede adı boş olan kullanıcı için "—" gösterilir. |
> | **Yetki** | `requireManager()` finance için boş döner, sayfa da `<YetkiYok />` gösterir | Kullanıcılar sayfası bunu zaten yapıyor, aynı yöntem kalır. |
> | **Parola** | `parolaDogrula()`: en az 8 karakter, en çok 72 bayt. bcrypt maliyeti `auth.ts` içinde dışa kapalı bir sabit (`BCRYPT_TUR = 12`) | Kayıttaki kural aynen kullanılır. |
> | **Oturum** | Kayıt işlemi yeni kullanıcı için oturum açıyor | **Kullanıcı eklemede oturum açılmayacak.** Manager kendi oturumunda kalır. |
>
> ## 2. Güncellenmiş plan
>
> ### Veri akışı
>
> **Listeleme:**
> 1. Sayfa `requireManager()` ile açılır. Finance için `<YetkiYok />` gösterilir.
> 2. `getTenantDb()` ile kendi firmanın kullanıcıları listelenir.
> 3. Yalnızca ad, e-posta, rol ve eklenme tarihi okunur. Eklenme tarihine göre sıralanır.
> 4. Parola özeti hiç okunmaz.
>
> **Ekleme:**
> 1. Formda ad soyad, e-posta ve parola alanları olur.
> 2. Sunucu işlemi `requireUser()` ve `getTenantDb()` çağırır. Bunlar try/catch dışında kalır, ayarlar sayfasındaki desen budur.
> 3. Asıl iş, çekirdek fonksiyon `kullaniciEkleCekirdek(kullanici, db, girdiler)` içinde yapılır. Ayarlar sayfasındaki `cacKaydetCekirdek` deseni budur.
>    1. Rol manager değilse işlem durur ve "yetki yok" mesajı döner.
>    2. Girdiler doğrulanır ve alan bazında hata mesajları üretilir.
>    3. Parola bcrypt ile özetlenir.
>    4. `db.user.create` çalışır ve rol **sunucuda sabit olarak `finance`** yazılır.
>    5. E-posta zaten kayıtlıysa `tekrarEdenKayitMi()` hatayı yakalar ve kayıttaki mesajın aynısı gösterilir.
> 4. Başarılı olursa sayfa yenilenir.
>
> **Etkilenen tablo:** yalnızca USERS. Okuma ve ekleme yapılır, güncelleme ve silme yapılmaz.
>
> ### Dosyalar
>
> | Dosya | Ne olacak |
> |---|---|
> | `src/lib/validation.ts` | Sona `kullaniciGirdisiniDogrula()` eklenir. Mevcut doğrulama fonksiyonlarını kullanır, yeni kural koymaz. |
> | `src/lib/validation.test.ts` | Bu fonksiyonun birim testleri eklenir (`npm test`). |
> | `src/lib/auth.ts` | Küçük bir `parolaOzetle()` fonksiyonu dışa açılır. Böylece bcrypt maliyeti tek yerde kalır. Kayıt akışında davranış değişmez. |
> | `src/lib/kullanici-yonetimi.ts` (yeni) | Çekirdek fonksiyon ve liste sorgusu. |
> | `src/lib/kullanici-yonetimi.test.ts` (yeni) | Veritabanı testleri (`npm run test:db`). |
> | `src/app/(panel)/kullanicilar/actions.ts` (yeni) | Sunucu işlemi. |
> | `src/app/(panel)/kullanicilar/KullaniciFormu.tsx` (yeni) | Ekleme formu. |
> | `src/app/(panel)/kullanicilar/page.tsx` | Tamamen değişir: tablo, form ve yer tutucunun kaldırılması. |
>
> Veritabanı testlerinde şunları doğrulayacağım:
>
> - Finance kullanıcı ekleyemez ve kayıt sayısı değişmez.
> - Geçersiz girdi alan hatası verir.
> - Başarılı eklemede kullanıcı A firmasında görünür, B firmasında görünmez.
> - Formdan `role=manager` gönderilse bile rol `finance` olur.
> - Formdan gönderilen bir `tenantId` yok sayılır.
> - Parola düz metin olarak saklanmaz.
> - Aynı firmada ya da başka firmada kayıtlı bir e-posta reddedilir.
>
> ### Senden onay gereken üç küçük karar
>
> 1. **Formda rol alanı olmasın.** Yalnızca finance eklenebildiği için rol seçme kutusu koymuyorum. Formda "Eklenen kullanıcı finans rolüyle açılır" bilgisi yazar, rolü sunucu belirler. Böylece formla oynayarak manager eklemek mümkün olmaz.
> 2. **`auth.ts` dosyasına `parolaOzetle()` eklenmesi.** Alternatif, yeni dosyada 12 sayısını tekrar yazmak olurdu. Ama bu, maliyet bir yerde değişince öbüründe unutulma riski taşır.
> 3. **Kayıtlı e-posta mesajı.** Kayıttaki "Bu e-posta adresiyle zaten bir hesap var." mesajının aynısını öneriyorum. Bu durumda bir manager, bir e-postanın başka bir firmada kayıtlı olup olmadığını öğrenebilir. Bu, ADR'deki B11 sınırının kullanıcı ekleme ekranındaki karşılığıdır. ADR'ye "B11 kullanıcı eklemede de geçerli" diye yazarım. Mesajı belirsiz yapmak ("Bu e-posta kullanılamaz") yöneticinin kafasını karıştırır ve sızıntıyı da gerçekte kapatmaz.
>
> ### Elle test (`npm run dev:test`, test dalında)
>
> 1. Demo manager hesabıyla `deneme.finans@example.com` adresli bir kullanıcı ekle.
> 2. Çıkış yap, bu yeni hesapla giriş yap.
> 3. Müşteri, plan ve abonelik sayfalarına girebildiğini doğrula.
> 4. Ayarlar ve kullanıcılar sayfalarında "yetkiniz yok" mesajı geldiğini doğrula.
> 5. Diğer demo firmanın manager hesabıyla giriş yap. Kullanıcılar sayfasında bu kullanıcının görünmediğini doğrula.
> 6. Aynı e-postayı tekrar eklemeyi dene ve hata mesajını kontrol et.
> 7. **Temizlik:** Test sırasında açılan `@example.com` hesaplarını test dalından sil. Demo kiracılara dokunulmaz. Bu temizliğin nasıl yapılacağını `veri.ts` dosyasını görünce yazacağım. Arayüzde silme özelliği olmadığı için bu bir terminal betiği olacak.
>
> ### Belgeler (iş bitince)
>
> - **README:** 190. satırdaki bilinen sınır güncellenir.
> - **ADR Gün 14 bölümü:** kararlar yazılır. Kabul edilen sınırlar: davet e-postası, parola sıfırlama, silme, rol değiştirme, pasife alma yok; parola yalnızca yönetici tarafından belirlenir, parola değiştirme akışı yok; B11 kullanıcı eklemede de geçerli.
> - **Prompt Günlüğü** ve `prompt_cevap/gun_14_prompt_cevap.md`.
>
> ## 3. Eksik dosyalar
>
> Önce bu komutu çalıştır. Panel sayfalarının ve arayüz bileşenlerinin adlarını listeler:
>
> ```
> git ls-files "src/app/(panel)" src/components
> ```
>
> Sonra şu dosyaların içeriğini gönder:
>
> 1. `src/lib/cac-ayari.ts`: kopyalayacağım çekirdek fonksiyon deseni.
> 2. `src/lib/islem.ts`: `FormDurumu`, `MESAJ`, `formMetni` ve `tekrarEdenKayitMi`.
> 3. `src/components/ui/FormAlani.tsx`: alanın hangi özellikleri aldığını görmek için.
> 4. `src/lib/bicim.ts`: tarih biçimlendirme fonksiyonu varsa onu kullanmak için.
> 5. `src/test-destek/veri.ts`: test firması oluşturma ve temizleme. Testte eklenen kullanıcılar temizleniyor mu, bunu görmem lazım.
> 6. `src/test-destek/kurallar.test.ts`: yeni dosyaların uyması gereken otomatik kurallar olabilir.
> 7. `src/lib/validation.test.ts`: test yazım deseni.
> 8. Müşteriler listesini gösteren sayfa (adı yukarıdaki komutta çıkacak): tablo görünümünü aynı yapmak için.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - `tekrarEdenKayitMi()` fonksiyonunun, kiracı filtresinden geçen `create` hatasını da yakaladığını varsayıyorum. `islem.ts` dosyasını görünce doğrulayacağım.
> - Test temizliğinin test firmalarının kullanıcılarını da sildiğini varsayıyorum. Bunu `veri.ts` dosyasında kontrol edeceğim.
> - SSE uyarılarının firmadaki bütün manager ve finance kullanıcılarına gittiğini, yeni eklenen finance kullanıcısının da ek kod gerekmeden uyarı alacağını varsayıyorum. Elle testte bunu da gözlemleyebiliriz.
> - Kod, üç kararı onaylamandan ve eksik dosyaları görmemden sonra küçük parçalar hâlinde gelecek: önce doğrulama ve testi, sonra çekirdek fonksiyon ve testi, sonra sayfa ve form.

### Prompt 4 · 25 Eki 2026 14:38

````text
Üç karara evet. Eklemeler: (1) parola hata durumunda geri dönmesin ve loglanmasın; (2) e-posta kayıt akışıyla aynı biçimde hazırlansın (küçük harf, kırpma); (3) ADR sınırlarına "kullanıcı sayısı üst sınırı yok" ekle; (4) test temizliği için önce veri.ts'teki mevcut temizliğe bak, yeni betik ve yeni package.json komutu yalnızca gerçekten gerekirse; auth.ts değişikliğini diff olarak göster ve mevcut testlerin geçtiğini doğrula. Dosyalar ekte (gun14_dosyalar2.txt): cac-ayari.ts, islem.ts, FormAlani.tsx, bicim.ts, veri.ts, kurallar.test.ts, validation.test.ts, musteriler/page.tsx. Eksik dosyayı söyle. Kod yazmadan önce planı son haliyle tek mesajda özetle ve onayımı bekle.
````

_[ek dosya: gun14_dosyalar2.txt]_

### Claude cevabı 4 · 25 Eki 2026 14:39

> # Gün 14 kullanıcı yönetimi: son plan
>
> Kod yazmadan önce son plan aşağıda. Onayını bekliyorum. En sonda eksik beş dosya var.
>
> ## 1. Kararlar (hepsi onaylandı)
>
> - **Yalnızca finance eklenir.** Formda rol alanı olmaz, rolü sunucu `finance` olarak yazar.
> - **`auth.ts` dosyasına `parolaOzetle()` eklenir.** bcrypt maliyeti tek yerde kalır.
> - **Kayıtlı e-posta durumunda** kayıttaki mesajın aynısı gösterilir: "Bu e-posta adresiyle zaten bir hesap var." Bu mesaj e-posta alanının altında görünür.
> - **Parola geri dönmez ve loglanmaz.** Hata durumunda yalnızca ad ve e-posta geri döner. Beklenmeyen hatada log satırı sabit bir metindir, içinde girdi bulunmaz.
> - **E-posta kayıttaki gibi hazırlanır.** `epostaDogrula()` kullanılır: baştaki ve sondaki boşluklar kırpılır, harfler küçültülür.
> - **Yeni kullanıcı için oturum açılmaz.** Manager kendi oturumunda kalır.
>
> ## 2. Test temizliği: yeni betik gerekmiyor
>
> **Otomatik testler:** `veri.ts` içindeki `testVerisiniTemizle()`, test firmalarının **bütün kullanıcılarını** zaten firma kimliğine göre siliyor. Testte eklenen kullanıcılar A firmasına yazılacağı için otomatik olarak temizlenir. Yeni betik ya da yeni `package.json` komutu gerekmiyor.
>
> **Elle test:** Demo firmalara dokunmamak için test dalında `/kayit` sayfasından iki yeni firma açılır. Örneğin `elle-a.yonetici@example.com` ve `elle-b.yonetici@example.com`. Finance kullanıcısı A firmasına eklenir.
>
> **Elle test temizliği:** Neon panelinde, **yalnızca test dalı** seçiliyken SQL Editor ile yapılır.
> 1. Önce bir sorgu çalıştırılır. Bu sorgu yalnızca `elle-` ile başlayan `@example.com` hesaplarını ve bunların firmalarını listeler, hiçbir şeyi değiştirmez.
> 2. Listeyi sen görürsün ve onaylarsın.
> 3. Sonra yalnızca o kayıtlar silinir: önce kullanıcılar, sonra firmalar. Bu firmalarda müşteri ya da plan olmayacak.
>
> Bu SQL repoya girmez. `kurallar.test.ts` dosyasındaki "ham SQL yok" kuralı yalnızca `src/` klasörünü taradığı için etkilenmez. Silme geri alınamadığı için o adımda ayrıca onay isteyeceğim.
>
> ## 3. `auth.ts` değişikliği (planlanan fark)
>
> ```diff
> +// Parolayı bcrypt ile özetler. Kayıt ve kullanıcı ekleme (Gün 14) bunu kullanır,
> +// böylece bcrypt maliyeti tek yerde kalır.
> +export async function parolaOzetle(parola: string): Promise<string> {
> +  return bcrypt.hash(parola, BCRYPT_TUR);
> +}
> +
>  // Kayıt: yeni firma ve o firmanın ilk kullanıcısı (manager) birlikte oluşturulur.
>  export async function kayitOl(girdi: KayitGirdisi): Promise<IslemSonucu> {
>  ...
> -  const passwordHash = await bcrypt.hash(girdi.parola, BCRYPT_TUR);
> +  const passwordHash = await parolaOzetle(girdi.parola);
> ```
>
> Kayıt akışında davranış aynı kalır. Bunu şu şekilde doğrulayacağız:
> - `npm test` ve `npm run test:db` komutlarındaki bütün mevcut testler geçmeli.
> - Elle testte `/kayit` sayfasından firma açmak, kayıt akışını da sınar.
>
> ## 4. Dosyalar ve sıra (her parçadan sonra test)
>
> **Hazırlık:** `git switch main`, `git pull`, ardından `git switch -c gun14-kullanici-yonetimi`.
>
> **Parça 1: saf fonksiyonlar** (veritabanı gerekmez, `npm test` ile çalışır)
>
> | Dosya | Değişiklik |
> |---|---|
> | `src/lib/validation.ts` | Sona `kullaniciGirdisiniDogrula()` eklenir. Alanlar: ad soyad (2-100 karakter, kayıttaki gibi), e-posta ve parola. Müşteri formundaki gibi bütün alan hatalarını birlikte döner. |
> | `src/lib/validation.test.ts` | Geçerli girdi, e-postanın kırpılıp küçültülmesi, boş ya da kısa alanlar, 72 bayttan uzun parola, metin olmayan girdi ve birden çok hatanın birlikte dönmesi test edilir. |
> | `src/lib/bicim.ts` | Sona `tarihMetni()` eklenir. Örneğin "25 Ekim 2026". Saat dilimi `Europe/Istanbul` olarak sabitlenir, çünkü Render sunucusu UTC'de çalışır ve gece yarısına yakın eklenen bir kullanıcının tarihi bir gün kayabilir. Ek paket gerekmez. |
> | `src/lib/bicim.test.ts` | `tarihMetni()` testi, gece yarısı sınırı dahil. |
>
> **Parça 2: çekirdek** (`npm test` ve `npm run test:db`)
>
> `src/lib/auth.ts` dosyasında yalnızca yukarıdaki fark uygulanır.
>
> Yeni dosya `src/lib/kullanici-yonetimi.ts`, `cac-ayari.ts` ile aynı yapıda olur:
> - `kullanicilariListele(db)`: ad, e-posta, rol ve eklenme tarihini döner, eklenme tarihine göre sıralar. Parola özeti seçilmez.
> - `kullaniciEkleCekirdek(kullanici, db, girdiler)` şu sırayla çalışır:
>   1. Rol kontrolü yapılır. Manager değilse veritabanına gidilmeden `MESAJ.yetkiYok` döner.
>   2. Girdiler doğrulanır.
>   3. Parola özetlenir.
>   4. `db.user.create` çalışır. Rol `finance` olarak sabit yazılır, `tenantId` tenant filtresi tarafından oturumdan zorla yazılır.
>   5. Hata P2002 ise e-posta alanına hata mesajı yazılır. Başka bir hataysa sabit bir log satırı yazılır ve `MESAJ.beklenmeyen` döner.
>   6. Başarılıysa şu mesaj döner: "… finans rolüyle eklendi. Giriş bilgilerini kendisine güvenli bir yoldan iletin." Form temizlenir.
>
> Yeni dosya `src/lib/kullanici-yonetimi.test.ts` şunları doğrular:
> - Finance kullanıcı ekleyemez ve kullanıcı sayısı değişmez.
> - Geçersiz girdi alan hatası verir, sayı değişmez ve dönen değerlerde parola bulunmaz.
> - Başarılı eklemede rol finance, firma A olur. E-posta küçültülmüş ve kırpılmış olarak kaydedilir. Parola düz metin değildir, bcrypt ile doğrulanabilir.
> - A'nın listesinde yeni kullanıcı görünür, B'nin listesinde görünmez. Listede parola özeti alanı yoktur.
> - Aynı firmada kayıtlı bir e-posta reddedilir.
> - B firmasındaki bir e-posta da aynı mesajla reddedilir ve B'nin kullanıcısı değişmez.
>
> **Parça 3: arayüz** (`npm run build`, ardından elle test)
>
> | Dosya | Değişiklik |
> |---|---|
> | `src/app/(panel)/kullanicilar/actions.ts` (yeni) | `ayarlar/actions.ts` deseni kullanılır. `requireUser()` ve `getTenantDb()` try/catch dışında kalır, başarılı işlemden sonra sayfa yenilenir. |
> | `src/app/(panel)/kullanicilar/KullaniciFormu.tsx` (yeni) | Ad soyad, e-posta ve parola alanları. `noValidate` kullanılır. "Eklenen kullanıcı finans rolüyle açılır" bilgisi gösterilir. Parola alanı her zaman boş açılır. |
> | `src/app/(panel)/kullanicilar/page.tsx` | Tamamen değişir. Müşteriler sayfasındaki düzen kullanılır: üstte "Yeni kullanıcı" formu, altta "Kullanıcı listesi (n)" tablosu. Tablo sütunları ad (boşsa "—"), e-posta, rol rozeti (Yönetici ya da Finans) ve eklenme tarihidir. Yer tutucu metin kaldırılır. `requireManager()` ve `<YetkiYok />` aynen kalır. |
>
> **Parça 4: elle test ve temizlik** (`npm run dev:test`)
>
> 1. Test dalında `elle-a` ve `elle-b` firmalarını kayıt sayfasından aç.
> 2. `elle-a` firmasına `elle-a.finans@example.com` adresli finance kullanıcısını ekle.
> 3. Bu finance hesabıyla giriş yap. Müşteri, plan ve abonelik sayfalarına girebildiğini, ayarlar ve kullanıcılar sayfalarında "yetkiniz yok" mesajı geldiğini doğrula.
> 4. `elle-b` firmasının manager hesabıyla giriş yap. A firmasının kullanıcısının listede görünmediğini doğrula.
> 5. Aynı e-postayı tekrar eklemeyi dene ve hata mesajını kontrol et.
> 6. 2. bölümde anlatılan şekilde Neon temizliğini yap.
>
> **Parça 5: belgeler ve PR**
>
> - **README:** 190. satırdaki bilinen sınır güncellenir.
> - **ADR:** Yeni bir Gün 14 bölümü eklenir. Önceki günlerin satırları değişmez.
>   - Kararlar: yalnızca finance eklenir, rolü sunucu belirler; e-posta benzersizliği veritabanı kısıtıyla sağlanır; `parolaOzetle()` eklendi.
>   - Kabul edilen sınırlar:
>     - Davet e-postası, parola sıfırlama, silme, rol değiştirme ve pasife alma yok.
>     - Parola yalnızca yönetici tarafından belirlenir, parola değiştirme akışı yok.
>     - Kullanıcı sayısı üst sınırı yok.
>     - B11 (kayıtlı e-posta bilgisinin açığa çıkması) kullanıcı eklemede de geçerli.
>     - Firmada yeni bir manager eklenemez.
> - **Prompt Günlüğü** Gün 14 satırı ve `prompt_cevap/gun_14_prompt_cevap.md`. Maskeleme kuralları uygulanır.
> - **Commit ve PR:**
>   1. Commit öncesi üç tarama yapılır.
>   2. Commit eklerinde `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` ve **bu sohbetin** oturum adresi yer alır. Adresi o adımda senden isteyeceğim.
>   3. Sonra PR açılır, Squash and merge ile birleştirilir.
>
> Bundan sonra `gun14_notlari.md` içindeki temizlik listesine geçilir.
>
> ## 5. Eksik dosyalar
>
> 1. `src/app/(panel)/musteriler/MusteriFormu.tsx`: başarılı eklemeden sonra formun nasıl temizlendiğini görmek için.
> 2. `src/app/(panel)/musteriler/actions.ts` ve müşteri eklemenin çekirdek dosyası (varsa `src/lib` içinde): **önemli.** TypeScript, `create` işleminde `tenantId` alanını zorunlu tutabilir. Mevcut kodun bunu nasıl çözdüğüne uymam lazım.
> 3. `package.json` dosyasının yalnızca `"scripts"` bölümü: `npm test` ve `npm run test:db` yeni test dosyalarını kendiliğinden buluyor mu, yoksa dosyalar tek tek mi listeleniyor?
> 4. `src/lib/bicim.test.ts`: tam dosya olarak vereceğim için mevcut içeriği gerekli.
> 5. `src/components/ui/Rozet.tsx`: hangi renk tonlarının (`ton`) kullanılabildiğini görmek için.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - `giris.test.ts`, `auth.ts` dosyasını zaten içe aktarıyor (`GIRIS_HATASI`). Bu yüzden yeni çekirdeğin `auth.ts` dosyasını içe aktarmasının testlerde sorun çıkarmayacağını varsayıyorum. `npm run test:db` bunu doğrulayacak.
> - Ad soyad alanını zorunlu yapıyorum. Veritabanında boş olabiliyor, ama kayıt formunda zorunlu.
> - Elle testte açılan `elle-` firmalarının yalnızca kullanıcı içereceğini varsayıyorum. İçlerine müşteri ya da plan eklenirse temizlik sorgusu değişir.
>
> Onay verirsen ve dosyalar gelirse Parça 1 ile başlıyorum.

### Prompt 5 · 25 Eki 2026 14:42

````text
Plan onaylandı, üç ek şartla: (1) README "Testler" bölümünde test sayısı yazıyorsa yeni testlerden sonra güncelle, yazmıyorsa dokunma; (2) Neon temizliğindeki SELECT ve DELETE sorgularını çalıştırmadan önce bana göster, ayrıca seçili dalın test dalı olduğunu kontrol ettir; (3) her parçadan sonra npm test ve npm run test:db sonuçlarını (geçen/kalan sayı) göstereceğim, onayım gelmeden sonraki parçaya geçme. Eksik dosyalar ekte (gun14_dosyalar3.txt): MusteriFormu.tsx, musteriler/actions.ts, müşteri çekirdek dosyaları, bicim.test.ts, Rozet.tsx, package.json scripts bölümü. Eksik dosyayı söyle. Dosyalar tamamsa hazırlık adımlarını (git switch main, git pull, git switch -c gun14-kullanici-yonetimi) ve Parça 1'i ver.
````

_[ek dosya: gun14_dosyalar3.txt]_

### Claude cevabı 5 · 25 Eki 2026 14:44

> Dosyalar tamam, eksik dosya yok. Parça 2'yi etkileyen iki bulgu var:
>
> - **`tenantId`:** `musteriEkle` işlevi, TypeScript istediği için `tenantId: kullanici.tenantId` yazıyor. Değer oturumdan geliyor ve `tenant.ts` onu zaten oturumdakiyle eziyor. Kullanıcı eklemede de aynısını yapacağım. Bu yüzden çekirdek fonksiyon kullanıcıdan rol ile birlikte `tenantId` de alacak.
> - **`package.json`:** Test komutları dosyaları tek tek listeliyor. Parça 2'de yeni test dosyası, var olan `test:db` listesine eklenecek. Bu yeni bir komut değil, mevcut komutun listesine bir dosya eklemek. Parça 1'de değişiklik yok, çünkü `validation.test.ts` ve `bicim.test.ts` zaten `npm test` listesinde.
>
> ## Hazırlık
>
> Bu adımlar ana dalı güncelleyip yeni dalı açar.
>
> 1. Kaydedilmemiş bir değişiklik olup olmadığına bakar. Çıktı boş olmalı:
>    ```
>    git status --short
>    ```
> 2. Ana dala geçer:
>    ```
>    git switch main
>    ```
> 3. GitHub'daki son hâli indirir:
>    ```
>    git pull
>    ```
> 4. Yeni dalı açar ve ona geçer:
>    ```
>    git switch -c gun14-kullanici-yonetimi
>    ```
>
> ## Parça 1: saf fonksiyonlar ve testleri
>
> `validation.ts` ve `bicim.ts` dosyalarının **yalnızca sonuna** ekleme yapıyorum. Tam dosya kuralının istisnası bu: 350 satırı yeniden yazdırmak, mevcut mesajları yanlışlıkla değiştirme riski taşır. Bunun yerine aşağıdaki 4. adımda hiçbir satırın silinmediğini kontrol edeceğiz. İki test dosyası küçük olduğu için onları tam dosya olarak veriyorum.
>
> ### 1) `src/lib/validation.ts`: dosyanın EN SONUNA ekle
>
> Dosyayı editörde aç, Cmd+Aşağı ok ile en sona git, bir boş satır bırak ve şunu yapıştır:
>
> ```ts
>
> // ---------- Kullanıcı ekleme (Gün 14) ----------
>
> // Kullanıcı ekleme formundan gelen temizlenmiş değerler.
> // Rol burada YOKTUR: eklenen kullanıcı her zaman finance olur ve rolü sunucu yazar
> // (src/lib/kullanici-yonetimi.ts). Formdan rol okunmaz.
> export type KullaniciGirdisi = {
>   adSoyad: string;
>   eposta: string;
>   parola: string;
> };
>
> // Kullanıcı ekleme formunun tamamını kontrol eder.
> // Kurallar kayıt formuyla aynıdır: ad soyad 2-100 karakter; e-posta kırpılır ve
> // küçük harfe çevrilir; parola en az 8 karakter, en çok 72 bayttır ve kırpılmaz.
> // Kayıt formundan farkı: ilk hatada durmaz, müşteri formu gibi bütün alanların
> // hatasını birlikte döner. Hata mesajlarında girilen değer (özellikle parola) geçmez.
> export function kullaniciGirdisiniDogrula(girdi: {
>   adSoyad: unknown;
>   eposta: unknown;
>   parola: unknown;
> }): AlanSonucu<KullaniciGirdisi, "adSoyad" | "eposta" | "parola"> {
>   const ad = metinDogrula(girdi.adSoyad, "Ad soyad", 2, 100);
>   const eposta = epostaDogrula(girdi.eposta);
>   const parola = parolaDogrula(girdi.parola);
>
>   if (ad.ok && eposta.ok && parola.ok) {
>     return {
>       ok: true,
>       deger: { adSoyad: ad.deger, eposta: eposta.deger, parola: parola.deger },
>     };
>   }
>
>   const alanHatalari: Partial<Record<"adSoyad" | "eposta" | "parola", string>> = {};
>   if (!ad.ok) alanHatalari.adSoyad = ad.hata;
>   if (!eposta.ok) alanHatalari.eposta = eposta.hata;
>   if (!parola.ok) alanHatalari.parola = parola.hata;
>   return { ok: false, alanHatalari };
> }
> ```
>
> ### 2) `src/lib/bicim.ts`: dosyanın EN SONUNA ekle
>
> ```ts
>
> // Tarih (Gün 14, kullanıcı listesi): Date -> "25 Ekim 2026"
> // Saat dilimi Türkiye'ye sabitlenir. Render sunucusu UTC'de çalışır; sabitlenmezse
> // Türkiye saatiyle 00.00-03.00 arasında eklenen bir kaydın tarihi bir gün önce görünürdü.
> const TARIH_BICIMI = new Intl.DateTimeFormat("tr-TR", {
>   day: "numeric",
>   month: "long",
>   year: "numeric",
>   timeZone: "Europe/Istanbul",
> });
>
> export function tarihMetni(tarih: Date): string {
>   return TARIH_BICIMI.format(tarih);
> }
> ```
>
> ### 3) `src/lib/validation.test.ts`: dosyanın içeriğini tamamen şununla değiştir
>
> Cmd+A ile tümünü seç, yapıştır, Cmd+S ile kaydet.
>
> ```ts
> // DOĞRULAMA BİRİM TESTİ (Gün 9, Gün 14'te genişletildi)
> //
> // Çalıştırmak için: npm test
> // Veritabanı gerekmez.
> // Üç amacı var:
> //   1. Gün 9'da fiyat kontrolü ortak bir iç fonksiyona taşındı. Fiyat mesajlarının
> //      Gün 4'teki hâliyle HARFİ HARFİNE aynı kaldığını kilitler.
> //   2. Yeni CAC kontrolünü test eder: fiyatla aynı kurallar, tek fark 0 kabul edilir.
> //   3. (Gün 14) Kullanıcı ekleme formunun doğrulamasını test eder: kayıt formuyla
> //      aynı kurallar, bütün alan hataları birlikte döner, parola mesajlarda geçmez.
>
> import { test } from "node:test";
> import assert from "node:assert/strict";
> import {
>   fiyatDogrula,
>   cacDogrula,
>   kullaniciGirdisiniDogrula,
>   type Sonuc,
> } from "./validation.ts";
>
> // Sonuç başarılıysa değeri döner, değilse testi durdurur.
> function deger(sonuc: Sonuc<number>): number {
>   assert.ok(sonuc.ok, `başarılı olmalıydı, hata geldi: ${sonuc.ok ? "" : sonuc.hata}`);
>   return sonuc.deger;
> }
>
> // Sonuç hatalıysa mesajı döner, değilse testi durdurur.
> function hata(sonuc: Sonuc<number>): string {
>   assert.ok(!sonuc.ok, "hata vermeliydi, başarılı oldu");
>   return sonuc.hata;
> }
>
> // ---------- Fiyat (mesajlar Gün 4'teki gibi kalmalı) ----------
>
> test("fiyat: geçerli tam sayılar kabul edilir", () => {
>   assert.equal(deger(fiyatDogrula("1000")), 1000);
>   assert.equal(deger(fiyatDogrula("  1000  ")), 1000); // baştaki/sondaki boşluk silinir
>   assert.equal(deger(fiyatDogrula("10000000")), 10_000_000); // üst sınır dahil
> });
>
> test("fiyat: 0 ve negatif reddedilir (mesaj değişmedi)", () => {
>   assert.equal(hata(fiyatDogrula("0")), "Fiyat 0'dan büyük olmalıdır.");
>   assert.equal(hata(fiyatDogrula("-5")), "Fiyat 0'dan büyük olmalıdır.");
> });
>
> test("fiyat: boş, ayıraçlı, rakam dışı ve çok büyük değerler (mesajlar değişmedi)", () => {
>   assert.equal(hata(fiyatDogrula("")), "Fiyat boş bırakılamaz.");
>   assert.equal(hata(fiyatDogrula(null)), "Fiyat boş bırakılamaz.");
>   const ayiracMesaji =
>     "Fiyatı nokta veya virgül kullanmadan, tam sayı olarak yazın (ör. 1000). Kuruş girilmez.";
>   assert.equal(hata(fiyatDogrula("12,5")), ayiracMesaji);
>   assert.equal(hata(fiyatDogrula("1.000")), ayiracMesaji);
>   assert.equal(hata(fiyatDogrula("abc")), "Fiyat yalnızca rakamlardan oluşmalıdır.");
>   assert.equal(hata(fiyatDogrula("10000001")), "Fiyat en fazla 10.000.000 TL olabilir.");
>   assert.equal(hata(fiyatDogrula("12345678901")), "Fiyat en fazla 10.000.000 TL olabilir.");
> });
>
> // ---------- CAC ----------
>
> test("CAC: 0 kabul edilir ('girilmedi' anlamında)", () => {
>   assert.equal(deger(cacDogrula("0")), 0);
>   assert.equal(deger(cacDogrula("00")), 0);
> });
>
> test("CAC: geçerli tam sayılar kabul edilir", () => {
>   assert.equal(deger(cacDogrula("5000")), 5000);
>   assert.equal(deger(cacDogrula("  5000  ")), 5000);
>   assert.equal(deger(cacDogrula("10000000")), 10_000_000); // üst sınır dahil
> });
>
> test("CAC: boş, negatif, ayıraçlı, rakam dışı ve çok büyük değerler reddedilir", () => {
>   assert.equal(hata(cacDogrula("")), "CAC boş bırakılamaz. Girmek istemiyorsanız 0 yazın.");
>   assert.equal(hata(cacDogrula("-5")), "CAC negatif olamaz.");
>   assert.equal(hata(cacDogrula("-0")), "CAC negatif olamaz.");
>   const ayiracMesaji =
>     "CAC değerini nokta veya virgül kullanmadan, tam sayı olarak yazın (ör. 5000). Kuruş girilmez.";
>   assert.equal(hata(cacDogrula("12,5")), ayiracMesaji);
>   assert.equal(hata(cacDogrula("1.000")), ayiracMesaji);
>   assert.equal(hata(cacDogrula("abc")), "CAC yalnızca rakamlardan oluşmalıdır.");
>   assert.equal(hata(cacDogrula("+5000")), "CAC yalnızca rakamlardan oluşmalıdır.");
>   assert.equal(hata(cacDogrula("10000001")), "CAC en fazla 10.000.000 TL olabilir.");
> });
>
> test("CAC: metin olmayan girdi (null, sayı) boş sayılır", () => {
>   // Formdan her zaman metin gelir. Başka bir şey gelirse (formla oynanmışsa) boş sayılır.
>   assert.equal(hata(cacDogrula(null)), "CAC boş bırakılamaz. Girmek istemiyorsanız 0 yazın.");
>   assert.equal(hata(cacDogrula(5000)), "CAC boş bırakılamaz. Girmek istemiyorsanız 0 yazın.");
> });
>
> // ---------- Kullanıcı ekleme (Gün 14) ----------
>
> test("kullanıcı: geçerli girdi temizlenir, e-posta küçük harfe çevrilir, parola kırpılmaz", () => {
>   const sonuc = kullaniciGirdisiniDogrula({
>     adSoyad: "  Deneme Finans  ",
>     eposta: "  Deneme.Finans@Example.COM ",
>     parola: " parola-12345 ",
>   });
>   assert.ok(sonuc.ok, "başarılı olmalıydı");
>   assert.deepEqual(sonuc.deger, {
>     adSoyad: "Deneme Finans",
>     eposta: "deneme.finans@example.com",
>     parola: " parola-12345 ", // kullanıcı ne yazdıysa o
>   });
> });
>
> test("kullanıcı: bütün alan hataları birlikte döner, parola mesajlarda geçmez", () => {
>   const sonuc = kullaniciGirdisiniDogrula({
>     adSoyad: "",
>     eposta: "gecersiz",
>     parola: "kisa1",
>   });
>   assert.ok(!sonuc.ok, "hata vermeliydi");
>   assert.deepEqual(sonuc.alanHatalari, {
>     adSoyad: "Ad soyad boş bırakılamaz.",
>     eposta: "Lütfen geçerli bir e-posta adresi girin.",
>     parola: "Parola en az 8 karakter olmalıdır.",
>   });
>   assert.ok(!JSON.stringify(sonuc).includes("kisa1"), "parola sonuçta geçmemeli");
> });
>
> test("kullanıcı: yalnızca hatalı alanın mesajı döner", () => {
>   const sonuc = kullaniciGirdisiniDogrula({
>     adSoyad: "A",
>     eposta: "deneme.finans@example.com",
>     parola: "parola-12345",
>   });
>   assert.ok(!sonuc.ok, "hata vermeliydi");
>   assert.deepEqual(sonuc.alanHatalari, {
>     adSoyad: "Ad soyad en az 2 karakter olmalıdır.",
>   });
> });
>
> test("kullanıcı: parola 72 baytı geçemez (Türkçe karakter 2 bayt sayılır)", () => {
>   const ortak = { adSoyad: "Deneme Finans", eposta: "deneme.finans@example.com" };
>   // 36 x "ğ" = 72 bayt: kabul edilir
>   assert.ok(kullaniciGirdisiniDogrula({ ...ortak, parola: "ğ".repeat(36) }).ok);
>   // 37 x "ğ" = 74 bayt: reddedilir
>   const uzun = kullaniciGirdisiniDogrula({ ...ortak, parola: "ğ".repeat(37) });
>   assert.ok(!uzun.ok, "hata vermeliydi");
>   assert.deepEqual(uzun.alanHatalari, {
>     parola: "Parola çok uzun. Daha kısa bir parola seçin.",
>   });
> });
>
> test("kullanıcı: metin olmayan girdi (null, sayı) boş sayılır", () => {
>   const sonuc = kullaniciGirdisiniDogrula({ adSoyad: null, eposta: 5, parola: null });
>   assert.ok(!sonuc.ok, "hata vermeliydi");
>   assert.deepEqual(sonuc.alanHatalari, {
>     adSoyad: "Ad soyad boş bırakılamaz.",
>     eposta: "E-posta adresi boş bırakılamaz.",
>     parola: "Parola boş bırakılamaz.",
>   });
> });
> ```
>
> ### 4) `src/lib/bicim.test.ts`: dosyanın içeriğini tamamen şununla değiştir
>
> ```ts
> // EKRAN BİÇİMLENDİRME BİRİM TESTİ (Gün 9, Gün 14'te genişletildi)
> //
> // Çalıştırmak için: npm test
> // Dashboard'da görünecek metinlerin elle test senaryosuyla birebir aynı olduğunu kilitler.
>
> import { test } from "node:test";
> import assert from "node:assert/strict";
> import {
>   tlMetni,
>   yuzdeMetni,
>   sayiMetni,
>   ayEtiketi,
>   kisaAyEtiketi,
>   tarihMetni,
> } from "./bicim.ts";
>
> test("tlMetni: binlik ayıracı nokta, kuruş yok", () => {
>   assert.equal(tlMetni(1500), "1.500 TL");
>   assert.equal(tlMetni(50000), "50.000 TL");
>   assert.equal(tlMetni(83), "83 TL");
>   assert.equal(tlMetni(0), "0 TL");
> });
>
> test("yuzdeMetni: 1 ondalık, yüzde işareti önde", () => {
>   assert.equal(yuzdeMetni(0.6667), "%66,7"); // Gün 9 senaryosu
>   assert.equal(yuzdeMetni(0.04), "%4,0"); // ders örneği
>   assert.equal(yuzdeMetni(0), "%0,0");
>   assert.equal(yuzdeMetni(1), "%100,0");
> });
>
> test("sayiMetni: en fazla 2 ondalık, gereksiz sıfır yok", () => {
>   assert.equal(sayiMetni(0.3), "0,3"); // Gün 9 LTV/CAC
>   assert.equal(sayiMetni(5), "5"); // ders örneği LTV/CAC
>   assert.equal(sayiMetni(1.5), "1,5"); // Gün 9 ömür
>   assert.equal(sayiMetni(3.25), "3,25");
> });
>
> test("ayEtiketi: Türkçe ay adı ve yıl", () => {
>   assert.equal(ayEtiketi(2026, 10), "Ekim 2026");
>   assert.equal(ayEtiketi(2027, 1), "Ocak 2027");
> });
>
> test("kisaAyEtiketi (Gün 11): kısa Türkçe ay adı ve yılın son iki hanesi", () => {
>   assert.equal(kisaAyEtiketi(2026, 10), "Eki 26");
>   assert.equal(kisaAyEtiketi(2025, 11), "Kas 25");
>   assert.equal(kisaAyEtiketi(2027, 1), "Oca 27");
>   assert.equal(kisaAyEtiketi(2026, 5), "May 26");
>   assert.equal(kisaAyEtiketi(2026, 8), "Ağu 26");
> });
>
> test("tarihMetni (Gün 14): Türkiye saatiyle gün, ay adı ve yıl", () => {
>   assert.equal(tarihMetni(new Date("2026-10-25T09:00:00Z")), "25 Ekim 2026");
>   // UTC'de hâlâ 24 Ekim 22.30, Türkiye'de 25 Ekim 01.30: Türkiye tarihi gösterilir.
>   assert.equal(tarihMetni(new Date("2026-10-24T22:30:00Z")), "25 Ekim 2026");
>   // Yıl sınırı: UTC'de 31 Aralık 21.30, Türkiye'de 1 Ocak 00.30.
>   assert.equal(tarihMetni(new Date("2026-12-31T21:30:00Z")), "1 Ocak 2027");
>   assert.equal(tarihMetni(new Date("2027-01-05T12:00:00Z")), "5 Ocak 2027");
> });
> ```
>
> ## Kontrol
>
> 1. Hangi dosyaların değiştiğini gösterir. Yalnızca bu dört dosya görünmeli:
>    ```
>    git diff --stat
>    ```
> 2. `validation.ts` ve `bicim.ts` dosyalarında silinen satır sayısını verir. Sonuç **0** olmalı, yani yalnızca ekleme yapılmış olmalı:
>    ```
>    git --no-pager diff src/lib/validation.ts src/lib/bicim.ts | grep -c '^-[^-]'
>    ```
> 3. Veritabanı gerektirmeyen testleri çalıştırır ve yalnızca özetin son satırlarını gösterir:
>    ```
>    npm test 2>&1 | tail -n 8
>    ```
> 4. Veritabanı testlerini test dalında çalıştırır. Bu parçada değişmemesi gerekir, karşılaştırma için çalıştırıyoruz:
>    ```
>    npm run test:db 2>&1 | tail -n 8
>    ```
>
> Bana şunları gönder: `git diff --stat` çıktısı, 2. adımdaki sayı, iki test komutundaki `# pass` ve `# fail` satırları. `npm test` sonucunda geçen test sayısı öncekine göre 6 artmış olmalı: 5 kullanıcı testi ve 1 tarih testi. Onayın gelmeden Parça 2'ye geçmeyeceğim.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - Node'un tam Türkçe tarih desteğiyle kurulu olduğunu varsayıyorum. `kisaAyEtiketi` testleri zaten geçiyor, bu da bunu gösteriyor. "25 Ekim 2026" biçimi bu varsayıma dayanıyor. Test başarısız olursa çıkan metni bana gönder, tahmin etmeden düzeltirim.
> - `npm test` sonucundaki eski "geçen" sayısını bilmiyorum, bu yüzden "6 artmalı" diyorum. Önceki sayıyı hatırlıyorsan karşılaştır.
> - README'deki test sayısı kontrolünü Parça 5'te, bütün testler eklendikten sonra yapacağım.

### Prompt 6 · 25 Eki 2026 14:49

````text
Parça 1 onaylandı, uygulamaya başlıyorum. İki ek istek: (1) Kontrol bölümünün sonuna şu komutu da ekliyorum ve çıktısını sana getireceğim: git --no-pager diff src/lib/validation.test.ts src/lib/bicim.test.ts | grep '^-[^-]' (yalnızca başlık yorumlarındaki küçük değişiklikler görünmeli; eski testlerden bir satır silinmişse haber vereceğim). (2) npm test ve npm run test:db çıktılarının son 8 satırını kırpmadan getireceğim; Node sonucu "ℹ pass N" ve "ℹ fail N" biçiminde yazıyor, "# pass" aramana gerek yok. Parça 2'ye ben onay verene kadar geçme.
````

### Claude cevabı 6 · 25 Eki 2026 14:50

> İki ekleme de uygun. "ℹ pass N" / "ℹ fail N" biçimini dikkate alacağım.
>
> Ek komutunun çıktısında başlık yorumlarının yanında iki **import satırı** da görünecek. Bunlar da beklenen değişiklik, çünkü yeni fonksiyonları içe aktarmak için o satırları genişlettim. Görmen gereken satırlar tam olarak şu 5 tane:
>
> ```
> -// DOĞRULAMA BİRİM TESTİ (Gün 9)
> -// İki amacı var:
> -import { fiyatDogrula, cacDogrula, type Sonuc } from "./validation.ts";
> -// EKRAN BİÇİMLENDİRME BİRİM TESTİ (Gün 9)
> -import { tlMetni, yuzdeMetni, sayiMetni, ayEtiketi, kisaAyEtiketi } from "./bicim.ts";
> ```
>
> Bunların dışında, özellikle `test(` ya da `assert` ile başlayan bir satır görürsen eski bir test silinmiş demektir. O durumda haber ver, birlikte düzeltelim.
>
> Çıktıları bekliyorum. Onayın gelmeden Parça 2'ye geçmeyeceğim.

### Prompt 7 · 25 Eki 2026 14:52

````text
Parça 1 tamam. npm test: 197 geçti, 0 kaldı (191'den 6 artış). npm run test:db: 57 geçti, 0 kaldı. İki test dosyasında silinen satırlar yalnızca başlık yorumları ve import satırları. validation.ts ve bicim.ts'te silinen satır sayısı 0. Değişen dosyalar yalnızca beklenen dört dosya. Commit atmıyorum, Parça 5'te tek commit olacak. Parça 2'ye geç: auth.ts farkı (parolaOzetle), kullanici-yonetimi.ts, kullanici-yonetimi.test.ts ve package.json test:db listesine yeni test dosyasının eklenmesi. Yeni dosyaları terminalden touch ile boş açtır, içeriği ben editöre yapıştırırım; auth.ts ve package.json için küçük düzenlemeleri perl -pi -e ile ver ya da farkı açıkça göster.
````

### Claude cevabı 7 · 25 Eki 2026 14:54

> Parça 2'de dört dosyaya dokunacağız: `auth.ts` için küçük bir düzenleme, iki yeni dosya ve `package.json` içindeki test listesine bir dosya adı eklemek.
>
> ## 1) `src/lib/auth.ts`: iki küçük düzenleme
>
> Bu komut, `BCRYPT_TUR` satırının hemen altına `parolaOzetle()` fonksiyonunu ekler:
>
> ```
> perl -pi -e 's|^const BCRYPT_TUR = 12;$|const BCRYPT_TUR = 12;\n\n// Parolayı bcrypt ile özetler. Kayıt ve kullanıcı ekleme (Gün 14) bunu kullanır;\n// böylece bcrypt maliyeti tek yerde kalır.\nexport async function parolaOzetle(parola: string): Promise<string> {\n  return bcrypt.hash(parola, BCRYPT_TUR);\n}|' src/lib/auth.ts
> ```
>
> Bu komut, kayıt fonksiyonunun da yeni fonksiyonu kullanmasını sağlar:
>
> ```
> perl -pi -e 's|^  const passwordHash = await bcrypt\.hash\(girdi\.parola, BCRYPT_TUR\);$|  const passwordHash = await parolaOzetle(girdi.parola);|' src/lib/auth.ts
> ```
>
> Şimdi farkı gösteren komutu çalıştır:
>
> ```
> git --no-pager diff src/lib/auth.ts
> ```
>
> Çıktı **tam olarak** şuna benzemeli: 7 satır eklenmiş, 1 satır değişmiş.
>
> ```diff
>  const BCRYPT_TUR = 12;
>
> +// Parolayı bcrypt ile özetler. Kayıt ve kullanıcı ekleme (Gün 14) bunu kullanır;
> +// böylece bcrypt maliyeti tek yerde kalır.
> +export async function parolaOzetle(parola: string): Promise<string> {
> +  return bcrypt.hash(parola, BCRYPT_TUR);
> +}
> +
>  // Giriş hatasında hangi alanın yanlış olduğu bilerek söylenmez.
>  ...
>    // Parola düz metin saklanmaz, bcrypt ile özetlenir.
> -  const passwordHash = await bcrypt.hash(girdi.parola, BCRYPT_TUR);
> +  const passwordHash = await parolaOzetle(girdi.parola);
> ```
>
> Fark farklı görünürse devam etme, çıktıyı bana gönder.
>
> ## 2) `package.json`: test listesine yeni dosyayı ekle
>
> Bu komut, `test:db` listesinin sonuna yeni test dosyasını ekler. Yeni bir komut oluşturmaz:
>
> ```
> perl -pi -e 's|src/lib/giris\.test\.ts"|src/lib/giris.test.ts src/lib/kullanici-yonetimi.test.ts"|' package.json
> ```
>
> Bu komut kontrol eder. Sonuç **1** olmalı:
>
> ```
> grep -c "kullanici-yonetimi.test.ts" package.json
> ```
>
> ## 3) Yeni dosyaları boş olarak aç
>
> ```
> touch src/lib/kullanici-yonetimi.ts src/lib/kullanici-yonetimi.test.ts
> ```
>
> ### `src/lib/kullanici-yonetimi.ts`: içeriği yapıştır
>
> ```ts
> // KULLANICI YÖNETİMİ ÇEKİRDEĞİ (Gün 14)
> //
> // cac-ayari.ts ve pasife-alma.ts ile aynı yapıdadır: asıl mantık burada, sunucu
> // işlemi (app/(panel)/kullanicilar/actions.ts) yalnızca oturumu okur, bu
> // fonksiyonları çağırır ve sayfayı yeniler. Kullanıcıyı ve veritabanı nesnesini
> // PARAMETRE olarak aldığı için testlerden doğrudan çağrılabilir
> // (kullanici-yonetimi.test.ts).
> //
> // Kurallar:
> //   - Yalnızca manager kullanıcı ekleyebilir. Eklenen kullanıcı HER ZAMAN finance
> //     olur: rol formdan okunmaz, burada sabit yazılır.
> //   - tenantId formdan gelmez. Hangi firmaya yazılacağını "db" (getTenantDb)
> //     belirler; tenant.ts ekleme sırasında tenantId'yi oturumdaki değerle ezer.
> //   - E-posta bütün sistemde benzersizdir (schema.prisma: email @unique). Önceden
> //     arama YAPILMAZ: kiracı filtresi yüzünden arama yalnızca kendi firmayı görür ve
> //     başka firmadaki kaydı kaçırırdı. Asıl kontrol veritabanının kendisidir: tekrar
> //     eden kayıt hatası (P2002) yakalanır ve kayıt formundaki mesajın aynısı gösterilir.
> //     Bu mesaj, e-postanın başka bir firmada kayıtlı olduğunu da belli eder
> //     (ADR: B11, kullanıcı eklemede de geçerli).
> //   - Parola bcrypt ile özetlenir (auth.ts, parolaOzetle). Hata durumunda forma geri
> //     gönderilmez ve hiçbir yerde loglanmaz.
> //   - Yeni kullanıcı için oturum AÇILMAZ; manager kendi oturumunda kalır.
> //   - Kapsam dışı: silme, rol değiştirme, pasife alma, parola sıfırlama, davet e-postası.
>
> import type { Role } from "../../generated/prisma/enums";
> import { parolaOzetle, type AktifKullanici } from "./auth";
> import type { TenantDb } from "./tenant";
> import { yoneticiMi } from "./yetki";
> import { kullaniciGirdisiniDogrula } from "./validation";
> import { MESAJ, tekrarEdenKayitMi, type FormDurumu } from "./islem";
>
> // Kayıt formundaki mesajın aynısı (src/lib/auth.ts, kayitOl).
> export const EPOSTA_KAYITLI = "Bu e-posta adresiyle zaten bir hesap var.";
>
> // Çekirdeğin kullanıcıdan ihtiyaç duyduğu bilgiler. tenantId yalnızca TypeScript
> // istediği için verilir (musteriler/actions.ts ile aynı); asıl filtre "db" içindedir.
> type IslemYapan = Pick<AktifKullanici, "role" | "tenantId">;
>
> // Listede gösterilen bilgiler. Parola özeti BİLEREK yoktur.
> export type KullaniciSatiri = {
>   id: string;
>   name: string | null;
>   email: string;
>   role: Role;
>   createdAt: Date;
> };
>
> // Firmanın kullanıcılarını eklenme sırasına göre listeler.
> // Kiracı filtresi yüzünden yalnızca oturumdaki firmanın kullanıcıları gelir.
> // Rol kontrolü sayfada yapılır (requireManager); finance bu listeyi hiç görmez.
> export async function kullanicilariListele(db: TenantDb): Promise<KullaniciSatiri[]> {
>   return db.user.findMany({
>     orderBy: [{ createdAt: "asc" }, { email: "asc" }],
>     select: { id: true, name: true, email: true, role: true, createdAt: true },
>   });
> }
>
> // Firmaya yeni bir finance kullanıcısı ekler. YALNIZCA manager yapabilir.
> // girdiler: formdan gelen ham değerler (formData.get(...)). Burada doğrulanır.
> export async function kullaniciEkleCekirdek(
>   kullanici: IslemYapan,
>   db: TenantDb,
>   girdiler: { adSoyad: unknown; eposta: unknown; parola: unknown }
> ): Promise<FormDurumu> {
>   // 1) Rol kontrolü: finance kullanıcısı hiçbir sorgu yapılmadan durdurulur.
>   if (!yoneticiMi(kullanici.role)) {
>     return { durum: "hata", mesaj: MESAJ.yetkiYok };
>   }
>
>   // Hata olursa form bu değerlerle yeniden doldurulur. PAROLA BİLEREK YOK.
>   const degerler = {
>     adSoyad: typeof girdiler.adSoyad === "string" ? girdiler.adSoyad : "",
>     eposta: typeof girdiler.eposta === "string" ? girdiler.eposta : "",
>   };
>
>   // 2) Girdi doğrulama (sunucuda). E-posta kırpılır ve küçük harfe çevrilir.
>   const sonuc = kullaniciGirdisiniDogrula(girdiler);
>   if (!sonuc.ok) {
>     return {
>       durum: "hata",
>       mesaj: MESAJ.formHatali,
>       alanHatalari: sonuc.alanHatalari,
>       degerler,
>     };
>   }
>   const { adSoyad, eposta, parola } = sonuc.deger;
>
>   // 3) Parola özetlenir ve kullanıcı eklenir. Rol sabit: finance.
>   try {
>     const passwordHash = await parolaOzetle(parola);
>     await db.user.create({
>       // tenantId yalnızca TypeScript istediği için yazılır ve OTURUMDAN gelir.
>       // tenant.ts bu değeri zaten oturumdaki değerle zorla üzerine yazar.
>       data: {
>         tenantId: kullanici.tenantId,
>         name: adSoyad,
>         email: eposta,
>         passwordHash,
>         role: "finance",
>       },
>       select: { id: true },
>     });
>   } catch (hata) {
>     // Aynı e-posta bu firmada ya da başka bir firmada kayıtlı.
>     if (tekrarEdenKayitMi(hata)) {
>       return {
>         durum: "hata",
>         mesaj: MESAJ.formHatali,
>         alanHatalari: { eposta: EPOSTA_KAYITLI },
>         degerler,
>       };
>     }
>     // Ayrıntı kullanıcıya gösterilmez. Hata nesnesi ve girdiler loglanmaz.
>     console.error("Kullanıcı eklenirken beklenmeyen hata.");
>     return { durum: "hata", mesaj: MESAJ.beklenmeyen, degerler };
>   }
>
>   // Başarılı eklemede "degerler" dönülmez: form boşalır, yeni kayda hazır olur.
>   return {
>     durum: "basarili",
>     mesaj: `"${adSoyad}" finans rolüyle eklendi. Giriş bilgilerini kendisine güvenli bir yoldan iletin.`,
>   };
> }
> ```
>
> ### `src/lib/kullanici-yonetimi.test.ts`: içeriği yapıştır
>
> ```ts
> // ROL VE KİRACI TESTLERİ: KULLANICI EKLEME (Gün 14)
> //
> // Ne test edilir? src/lib/kullanici-yonetimi.ts içindeki kullaniciEkleCekirdek ve
> // kullanicilariListele. Sunucu işleminin çağırdığı fonksiyonların aynısıdır.
> // Tek fark: kullanıcı ve veritabanı nesnesi oturumdan değil, testten verilir.
> //
> // Testte eklenen bütün kullanıcılar A firmasına yazılır ve e-postaları bu
> // çalışmanın etiketiyle başlar (@example.com). testVerisiniTemizle() test
> // firmalarının bütün kullanıcılarını sildiği için ayrıca temizlik gerekmez.
> //
> // Sıra önemlidir: A firması 2 kullanıcıyla başlar (veri.ts: manager ve finance),
> // sayılar testler ilerledikçe artar.
> // Çalıştırmak için: npm run test:db
>
> import { describe, test, before, after } from "node:test";
> import assert from "node:assert/strict";
> // Önce test verisi yardımcısı: TEST_VERITABANI kontrolü onun içinde yapılır.
> import {
>   testFirmasiOlustur,
>   testVerisiniTemizle,
>   baglantiyiKapat,
>   CALISMA,
>   type TestFirmasi,
> } from "../test-destek/veri.ts";
> import bcrypt from "bcryptjs";
> import { tenantaBagliDb, type TenantDb } from "./tenant.ts";
> import {
>   kullaniciEkleCekirdek,
>   kullanicilariListele,
>   EPOSTA_KAYITLI,
> } from "./kullanici-yonetimi.ts";
> import { MESAJ } from "./islem.ts";
>
> let A: TestFirmasi;
> let B: TestFirmasi;
> let dbA: TenantDb;
> let dbB: TenantDb;
>
> // Sahte test parolası (gerçek bir parola değildir).
> const PAROLA = "Deneme-parola-123";
> const YENI_EPOSTA = `${CALISMA}-a-yeni@example.com`;
> // veri.ts'nin B firmasında oluşturduğu finance kullanıcısının e-postası.
> const B_EPOSTA = `${CALISMA}-b-finance@example.com`;
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
> // Kısa yardımcılar
> function yonetici(firma: TestFirmasi) {
>   return { role: "manager" as const, tenantId: firma.tenantId };
> }
> function formGirdisi(ek: Partial<Record<"adSoyad" | "eposta" | "parola", unknown>> = {}) {
>   return { adSoyad: "Deneme Finans", eposta: YENI_EPOSTA, parola: PAROLA, ...ek };
> }
> async function kullaniciSayisi(db: TenantDb): Promise<number> {
>   return db.user.count();
> }
>
> describe("finance kullanıcısı", () => {
>   test("kullanıcı ekleyemez, kayıt sayısı değişmez", async () => {
>     const sonuc = await kullaniciEkleCekirdek(
>       { role: "finance", tenantId: A.tenantId },
>       dbA,
>       formGirdisi()
>     );
>     assert.equal(sonuc.durum, "hata");
>     assert.equal(sonuc.mesaj, MESAJ.yetkiYok);
>     assert.equal(await kullaniciSayisi(dbA), 2);
>   });
> });
>
> describe("manager kullanıcısı: geçersiz girdi", () => {
>   test("alan hataları döner, parola geri gönderilmez, kayıt sayısı değişmez", async () => {
>     const sonuc = await kullaniciEkleCekirdek(
>       yonetici(A),
>       dbA,
>       formGirdisi({ adSoyad: "", eposta: "gecersiz", parola: "kisa1" })
>     );
>     assert.equal(sonuc.durum, "hata");
>     assert.equal(sonuc.mesaj, MESAJ.formHatali);
>     assert.deepEqual(Object.keys(sonuc.alanHatalari ?? {}).sort(), [
>       "adSoyad",
>       "eposta",
>       "parola",
>     ]);
>     // Form yalnızca ad ve e-postayla yeniden doldurulur.
>     assert.deepEqual(sonuc.degerler, { adSoyad: "", eposta: "gecersiz" });
>     assert.ok(!JSON.stringify(sonuc).includes("kisa1"), "parola sonuçta geçmemeli");
>     assert.equal(await kullaniciSayisi(dbA), 2);
>   });
> });
>
> describe("manager kullanıcısı: başarılı ekleme", () => {
>   test("finance olarak A'ya eklenir, e-posta küçük harfe çevrilir, parola özetlenir", async () => {
>     const sonuc = await kullaniciEkleCekirdek(
>       yonetici(A),
>       dbA,
>       formGirdisi({ eposta: `  ${YENI_EPOSTA.toUpperCase()}  ` })
>     );
>     assert.equal(sonuc.durum, "basarili");
>     assert.equal(
>       sonuc.mesaj,
>       '"Deneme Finans" finans rolüyle eklendi. Giriş bilgilerini kendisine güvenli bir yoldan iletin.'
>     );
>     assert.equal(sonuc.degerler, undefined, "başarıda form boşalmalı");
>
>     const kayit = await dbA.user.findFirst({
>       where: { email: YENI_EPOSTA },
>       select: { tenantId: true, role: true, name: true, passwordHash: true },
>     });
>     assert.ok(kayit, "kullanıcı A firmasında bulunmalı");
>     assert.equal(kayit.tenantId, A.tenantId);
>     assert.equal(kayit.role, "finance");
>     assert.equal(kayit.name, "Deneme Finans");
>     assert.notEqual(kayit.passwordHash, PAROLA, "parola düz metin saklanmamalı");
>     assert.ok(await bcrypt.compare(PAROLA, kayit.passwordHash), "özet parolayla eşleşmeli");
>     assert.equal(await kullaniciSayisi(dbA), 3);
>   });
>
>   test("liste: A yeni kullanıcıyı görür, B görmez, parola özeti listede yok", async () => {
>     const listeA = await kullanicilariListele(dbA);
>     assert.ok(listeA.some((k) => k.email === YENI_EPOSTA));
>     for (const satir of listeA) {
>       assert.ok(!("passwordHash" in satir), "listede parola özeti olmamalı");
>     }
>
>     const listeB = await kullanicilariListele(dbB);
>     assert.ok(!listeB.some((k) => k.email === YENI_EPOSTA));
>     assert.equal(listeB.length, 2);
>   });
> });
>
> describe("e-posta tekrarı", () => {
>   test("aynı firmada kayıtlı e-posta reddedilir (kayıt formuyla aynı mesaj)", async () => {
>     assert.equal(EPOSTA_KAYITLI, "Bu e-posta adresiyle zaten bir hesap var.");
>     const sonuc = await kullaniciEkleCekirdek(
>       yonetici(A),
>       dbA,
>       formGirdisi({ adSoyad: "Başka Kişi" })
>     );
>     assert.equal(sonuc.durum, "hata");
>     assert.equal(sonuc.mesaj, MESAJ.formHatali);
>     assert.deepEqual(sonuc.alanHatalari, { eposta: EPOSTA_KAYITLI });
>     assert.deepEqual(sonuc.degerler, { adSoyad: "Başka Kişi", eposta: YENI_EPOSTA });
>     assert.equal(await kullaniciSayisi(dbA), 3);
>   });
>
>   test("başka firmada kayıtlı e-posta da reddedilir, B'nin kullanıcısı değişmez", async () => {
>     const sonuc = await kullaniciEkleCekirdek(
>       yonetici(A),
>       dbA,
>       formGirdisi({ eposta: B_EPOSTA })
>     );
>     assert.equal(sonuc.durum, "hata");
>     assert.deepEqual(sonuc.alanHatalari, { eposta: EPOSTA_KAYITLI });
>     assert.equal(await kullaniciSayisi(dbA), 3);
>
>     const bKullanicisi = await dbB.user.findFirst({
>       where: { email: B_EPOSTA },
>       select: { tenantId: true, role: true, name: true },
>     });
>     assert.deepEqual(bKullanicisi, {
>       tenantId: B.tenantId,
>       role: "finance",
>       name: "Test Finans",
>     });
>   });
> });
>
> describe("kiracı izolasyonu", () => {
>   test("firmayı kullanıcı nesnesindeki tenantId değil, db belirler", async () => {
>     // Kullanıcı nesnesinde B yazsa bile A'nın db nesnesiyle yapılan ekleme A'ya gider
>     // (tenant.ts ekleme sırasında tenantId'yi oturumdaki değerle ezer).
>     const eposta = `${CALISMA}-a-ikinci@example.com`;
>     const sonuc = await kullaniciEkleCekirdek(
>       { role: "manager", tenantId: B.tenantId },
>       dbA,
>       formGirdisi({ eposta })
>     );
>     assert.equal(sonuc.durum, "basarili");
>
>     const kayit = await dbA.user.findFirst({
>       where: { email: eposta },
>       select: { tenantId: true },
>     });
>     assert.equal(kayit?.tenantId, A.tenantId);
>     assert.equal(await kullaniciSayisi(dbA), 4);
>     assert.equal(await kullaniciSayisi(dbB), 2);
>   });
> });
> ```
>
> ## 4) Kontrol
>
> 1. Hangi dosyaların değiştiğini gösterir. Parça 1'deki dört dosyanın yanında `auth.ts` ve `package.json` görünmeli. Yeni dosyalar burada görünmez, çünkü henüz git'e eklenmediler:
>    ```
>    git diff --stat
>    ```
> 2. Yeni dosyaların git tarafından görüldüğünü gösterir. İki yeni dosya `??` işaretiyle listelenmeli:
>    ```
>    git status --short
>    ```
> 3. TypeScript tür kontrolü yapar. Hiçbir dosyayı değiştirmez. Çıktı boş olmalı:
>    ```
>    npx tsc --noEmit
>    ```
> 4. Veritabanı gerektirmeyen testler. Sonuç **197 geçti, 0 kaldı** olmalı, yani değişmemeli. Burada `kurallar.test.ts`, yeni dosyanın ham `prisma` kullanmadığını da denetler:
>    ```
>    npm test 2>&1 | tail -n 8
>    ```
> 5. Veritabanı testleri. Sonuç **65 geçti, 0 kaldı** olmalı: önceki 57 ve 8 yeni test. Mevcut `giris.test.ts`, kayıt ve giriş akışının `parolaOzetle()` değişikliğinden sonra da çalıştığını gösterir:
>    ```
>    npm run test:db 2>&1 | tail -n 8
>    ```
>
> Bana `auth.ts` farkını, 3. adımın çıktısını ve iki test sonucunu gönder. Onayın gelmeden Parça 3'e geçmeyeceğim.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **`tsc` komutu:** Projede `npx tsc --noEmit` daha önce çalıştırılmamış olabilir. Hata çıkarsa ve bu hatalar bizim **dokunmadığımız** dosyalardaysa, onlar eski sorunlardır. O durumda yalnızca hangi dosyalarda olduklarını gönder, birlikte bakalım. Nasılsa Parça 3'teki `npm run build` aynı kontrolü yapacak.
> - **P2002 hatası:** Kiracı filtresinin (`tenant.ts`), veritabanının "tekrar eden kayıt" hatasını değiştirmeden ilettiğini varsayıyorum. Bunun doğruluğunu iki "e-posta tekrarı" testi gösterecek.
> - **Liste sırası:** Testlerde kullanıcıların eklenme sırası kontrol edilmiyor. Sıralama yalnızca görünüm içindir.
> - **Bekleme süresi:** bcrypt maliyeti 12 olduğu için `test:db` birkaç saniye daha uzun sürebilir.

### Prompt 8 · 25 Eki 2026 15:01

````text
Parça 2 tamam. auth.ts farkı beklendiği gibi (parolaOzetle eklendi, kayıt akışında tek satır değişti). npx tsc --noEmit hatasız. npm test: 197 geçti, 0 kaldı. npm run test:db: 64 geçti, 0 kaldı (57 + 7 yeni; senin 65 beklentin yanlıştı, dosyada 7 test var). Commit atmıyorum. Parça 3'e geç: kullanicilar/actions.ts, KullaniciFormu.tsx ve page.tsx. Yeni dosyaları touch ile boş açtır, page.tsx için tam dosya içeriği ver ("içeriğini tamamen şununla değiştir"). Önce kodu ver, ben uygulamadan önce incelenmesi için başka bir yerde gösterebilirim.
````

### Claude cevabı 8 · 25 Eki 2026 15:02

> Haklısın, dosyada 7 test var, hesabım yanlıştı: 1 + 1 + 2 + 2 + 1 = 7. Sonuç 64 geçti, 0 kaldı ve doğru.
>
> Aşağıda Parça 3'ün kodu var. Henüz uygulama, önce incele.
>
> ## 1) Yeni dosyaları boş olarak aç
>
> ```
> touch "src/app/(panel)/kullanicilar/actions.ts" "src/app/(panel)/kullanicilar/KullaniciFormu.tsx"
> ```
>
> Klasör adındaki parantezler yüzünden yollar tırnak içinde yazıldı.
>
> ## 2) `src/app/(panel)/kullanicilar/actions.ts`: içeriği yapıştır
>
> ```ts
> "use server";
>
> // KULLANICI SUNUCU İŞLEMLERİ (Gün 14): kullanıcı ekleme.
> //
> // Sunucu işlemleri dışarıdan doğrudan çağrılabilen uç noktalardır. Bu yüzden
> // yetki kontrolü işlemin içinde yapılır; finance kullanıcısının sayfayı
> // görememesi tek başına yeterli değildir. Rol kontrolü ve asıl mantık
> // src/lib/kullanici-yonetimi.ts içindedir (otomatik test edilebilsin diye).
> //
> // Formdan YALNIZCA üç alan okunur: adSoyad, eposta, parola. Forma "rol" ya da
> // "tenantId" adında bir alan eklense bile okunmaz: rol sunucuda sabit (finance),
> // firma oturumdan gelir.
> //
> // DİKKAT: requireUser() ve getTenantDb() giriş yapılmamışsa yönlendirme (redirect)
> // yapar. Yönlendirme bir hata olarak fırlatıldığı için bu çağrılar try/catch
> // bloklarının DIŞINDA tutulur. Çekirdeğin içindeki try/catch yalnızca veritabanı
> // işlemini sarar.
>
> import { revalidatePath } from "next/cache";
> import { requireUser } from "@/lib/auth";
> import { getTenantDb } from "@/lib/tenant";
> import { kullaniciEkleCekirdek } from "@/lib/kullanici-yonetimi";
> import type { FormDurumu } from "@/lib/islem";
>
> // Firmaya yeni bir finance kullanıcısı ekler. YALNIZCA manager yapabilir.
> export async function kullaniciEkle(
>   _onceki: FormDurumu,
>   formData: FormData
> ): Promise<FormDurumu> {
>   // Kullanıcı ve kiracıya bağlı veritabanı nesnesi: ikisi de OTURUMDAN gelir.
>   const kullanici = await requireUser();
>   const db = await getTenantDb();
>
>   const sonuc = await kullaniciEkleCekirdek(kullanici, db, {
>     adSoyad: formData.get("adSoyad"),
>     eposta: formData.get("eposta"),
>     parola: formData.get("parola"),
>   });
>
>   // Yalnızca başarılı işlemde liste yenilenir.
>   if (sonuc.durum === "basarili") {
>     revalidatePath("/kullanicilar");
>   }
>   return sonuc;
> }
> ```
>
> ## 3) `src/app/(panel)/kullanicilar/KullaniciFormu.tsx`: içeriği yapıştır
>
> ```tsx
> "use client";
>
> // Kullanıcı ekleme formu (Gün 14). Yalnızca manager'a gösterilir.
> // noValidate: tarayıcının kendi kontrolü kapalıdır. Bütün doğrulama sunucuda
> // yapılır ve Türkçe mesajlar her zaman aynı yerden gelir (MusteriFormu ile aynı yapı).
> // Formda rol alanı YOKTUR: eklenen kullanıcı her zaman finance olur, rolü sunucu yazar.
> // Hatadan sonra ad soyad ve e-posta korunur; parola bilerek boş kalır.
>
> import { useActionState } from "react";
> import FormAlani from "@/components/ui/FormAlani";
> import Dugme from "@/components/ui/Dugme";
> import IslemMesaji from "@/components/ui/IslemMesaji";
> import { BASLANGIC_DURUMU } from "@/lib/islem";
> import { kullaniciEkle } from "./actions";
>
> export default function KullaniciFormu() {
>   const [durum, formIslemi, bekliyor] = useActionState(kullaniciEkle, BASLANGIC_DURUMU);
>
>   // İşlemden dönen değer varsa onu, yoksa boş metni kullan. Parola burada yok.
>   const deger = (alan: "adSoyad" | "eposta") => durum.degerler?.[alan] ?? "";
>
>   return (
>     <form action={formIslemi} noValidate className="space-y-4">
>       <p className="text-sm text-slate-500">
>         Eklenen kullanıcı finans rolüyle açılır: müşteri, plan ve abonelik kayıtlarını
>         yönetir ve dashboard&apos;u görür. Ayarlara ve kullanıcılara erişemez.
>       </p>
>
>       <div className="grid gap-4 sm:grid-cols-2">
>         <FormAlani
>           etiket="Ad soyad"
>           name="adSoyad"
>           defaultValue={deger("adSoyad")}
>           hata={durum.alanHatalari?.adSoyad}
>           maxLength={100}
>           autoComplete="off"
>         />
>         <FormAlani
>           etiket="E-posta"
>           name="eposta"
>           type="email"
>           defaultValue={deger("eposta")}
>           hata={durum.alanHatalari?.eposta}
>           yardim="Kullanıcı bu e-postayla giriş yapar. Bir e-posta yalnızca tek bir hesapta kullanılabilir."
>           autoComplete="off"
>         />
>       </div>
>
>       <FormAlani
>         etiket="Parola"
>         name="parola"
>         type="password"
>         hata={durum.alanHatalari?.parola}
>         yardim="En az 8 karakter. Parolayı kullanıcıya güvenli bir yoldan iletin."
>         autoComplete="new-password"
>       />
>
>       <IslemMesaji durum={durum} />
>
>       <Dugme type="submit" disabled={bekliyor}>
>         {bekliyor ? "Ekleniyor..." : "Kullanıcı ekle"}
>       </Dugme>
>     </form>
>   );
> }
> ```
>
> ## 4) `src/app/(panel)/kullanicilar/page.tsx`: dosyanın içeriğini tamamen şununla değiştir
>
> ```tsx
> import { requireManager } from "@/lib/auth";
> import { getTenantDb } from "@/lib/tenant";
> import { kullanicilariListele, type KullaniciSatiri } from "@/lib/kullanici-yonetimi";
> import { tarihMetni } from "@/lib/bicim";
> import YetkiYok from "../YetkiYok";
> import SayfaBasligi from "@/components/ui/SayfaBasligi";
> import Rozet from "@/components/ui/Rozet";
> import KullaniciFormu from "./KullaniciFormu";
>
> // Kullanıcı yönetimi (Gün 14): firmanın kullanıcılarını listeleme ve yeni finance
> // kullanıcısı ekleme. Yalnızca manager görür, finance kullanıcısına "yetkiniz yok"
> // mesajı gösterilir.
> // Not: Sayfayı gizlemek yetki kontrolü değildir. Ekleme işlemi sunucuda ayrıca rol
> // kontrolü yapar (src/lib/kullanici-yonetimi.ts).
> // Kapsam dışı (ADR Gün 14): silme, rol değiştirme, pasife alma, parola sıfırlama,
> // davet e-postası.
>
> // Rolün ekrandaki Türkçe karşılığı ve rozet rengi.
> const ROL_GORUNUMU: Record<KullaniciSatiri["role"], { metin: string; ton: "indigo" | "gri" }> = {
>   manager: { metin: "Yönetici", ton: "indigo" },
>   finance: { metin: "Finans", ton: "gri" },
> };
>
> export default async function KullanicilarSayfasi() {
>   const kullanici = await requireManager();
>   if (!kullanici) return <YetkiYok />;
>
>   // Liste tenant filtresinden geçer: yalnızca kullanıcının kendi firması.
>   const db = await getTenantDb();
>   const kullanicilar = await kullanicilariListele(db);
>
>   return (
>     <div className="space-y-8">
>       <SayfaBasligi
>         baslik="Kullanıcılar"
>         aciklama="Firmanızın kullanıcıları ve rolleri. Bu sayfayı yalnızca firma yöneticisi görür."
>       />
>
>       <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
>         <h2 className="text-base font-semibold text-slate-900">Yeni finans kullanıcısı</h2>
>         <div className="mt-4">
>           <KullaniciFormu />
>         </div>
>       </section>
>
>       <section className="space-y-4">
>         <h2 className="text-base font-semibold text-slate-900">
>           Kullanıcı listesi ({kullanicilar.length})
>         </h2>
>
>         <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
>           <table className="min-w-full divide-y divide-slate-200 text-sm">
>             <thead className="bg-slate-50 text-left text-slate-600">
>               <tr>
>                 <th className="px-4 py-3 font-medium">Ad soyad</th>
>                 <th className="px-4 py-3 font-medium">E-posta</th>
>                 <th className="px-4 py-3 font-medium">Rol</th>
>                 <th className="px-4 py-3 font-medium">Eklenme tarihi</th>
>               </tr>
>             </thead>
>             <tbody className="divide-y divide-slate-100">
>               {kullanicilar.map((k) => (
>                 <tr key={k.id}>
>                   <td className="px-4 py-3 font-medium text-slate-900">{k.name ?? "—"}</td>
>                   <td className="px-4 py-3 text-slate-600">{k.email}</td>
>                   <td className="px-4 py-3">
>                     <Rozet ton={ROL_GORUNUMU[k.role].ton}>{ROL_GORUNUMU[k.role].metin}</Rozet>
>                   </td>
>                   <td className="px-4 py-3 text-slate-600">{tarihMetni(k.createdAt)}</td>
>                 </tr>
>               ))}
>             </tbody>
>           </table>
>         </div>
>       </section>
>     </div>
>   );
> }
> ```
>
> Neden boş liste durumu yok? Sayfaya yalnızca bir manager girebilir ve o manager da bu listede yer alır. Bu yüzden liste hiçbir zaman boş olmaz. `BosDurum` bileşeni ve "ilerleyen günlerde doldurulacak" yer tutucu metni bu yüzden kaldırıldı.
>
> ## 5) Uyguladıktan sonra kontrol
>
> 1. Değişen ve yeni dosyaları listeler. `page.tsx` değişmiş (`M`), iki yeni dosya `??` işaretiyle görünmeli:
>    ```
>    git status --short
>    ```
> 2. TypeScript tür kontrolü. Çıktı boş olmalı:
>    ```
>    npx tsc --noEmit
>    ```
> 3. Kod biçimi kontrolü. Hata çıkmamalı:
>    ```
>    npm run lint
>    ```
> 4. Veritabanı gerektirmeyen testler. Sonuç 197 geçti, 0 kaldı olmalı:
>    ```
>    npm test 2>&1 | tail -n 8
>    ```
> 5. Veritabanı testleri. Sonuç 64 geçti, 0 kaldı olmalı:
>    ```
>    npm run test:db 2>&1 | tail -n 8
>    ```
> 6. Uygulamayı yayına hazır hâlde derler. Son satırlarda hata olmamalı:
>    ```
>    npm run build 2>&1 | tail -n 15
>    ```
>
> Sonuçları getirdiğinde Parça 4'ü vereceğim: elle test adımları ve Neon temizliği için önce SELECT, ardından onayınla DELETE.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **Rol etiketleri:** Rozet bileşenindeki yorum "Yönetici" ve "Finans" etiketlerinden söz ediyor. Bu yüzden projede başka bir yerde, örneğin panel üst kısmında, aynı eşlemenin zaten olabileceğini düşünüyorum. İstersen `git grep -n '"Finans"' src` komutuyla bakabilirsin. Varsa ona uyacak şekilde değiştiririm. Yoksa bu hâliyle kalabilir.
> - **Form sıfırlama:** React'ın form işlemi bittikten sonra formu sıfırladığını ve alanlara sunucudan dönen değerlerin yeniden yazıldığını varsayıyorum. `MusteriFormu` da aynı yöntemi kullanıyor. Elle testte, hatadan sonra parola alanının boş, ad soyad ve e-posta alanlarının dolu kaldığını kontrol edeceğiz.
> - **`YetkiYok` yolu:** `../YetkiYok` yolunu ayarlar sayfasından aldım. Mevcut kullanıcılar sayfası da aynı yolu kullanıyor.

### Prompt 9 · 25 Eki 2026 15:07

````text
Parça 3 uygulandı. Dosyalar: kullanicilar/actions.ts, KullaniciFormu.tsx (yeni), page.tsx (değişti). npx tsc --noEmit hatasız. npm run lint temiz. npm run build başarılı (/kullanicilar dinamik rota olarak listelendi). npm test: 197 geçti, 0 kaldı. test:db'yi tekrar çalıştırmadım, src/lib'e dokunulmadı (64 geçti sonucu geçerli). Parça 4'e geç: elle test adımları ve Neon temizliği. Her adımı tek tek ver. Neon SQL'ini (SELECT ve DELETE) çalıştırmadan önce bana ve ana sohbete göstermem gerekiyor, ayrıca seçili dalın test dalı olduğunu kontrol ettir.
````

### Claude cevabı 9 · 25 Eki 2026 15:09

> Parça 4 aşağıda. Önce uygulamada elle test yapılacak, sonra Neon'da temizlik.
>
> **Neon SQL'i hakkında:** Sorguların hepsini aşağıda yazdım ama **bu mesajda hiçbirini çalıştırma.** Sıra şöyle olacak:
> 1. SQL'i ana sohbete gösterirsin.
> 2. SELECT sorgularını çalıştırıp sonuçları getirirsin.
> 3. Sonuçları birlikte kontrol ederiz.
> 4. DELETE adımına ancak senin onayınla geçilir.
>
> ## A. Elle test (test dalında)
>
> Kurallar:
> - Bütün hesaplar sahte, `@example.com` uzantılı.
> - Demo firmalara (Mavi Yazılım, Kuzey Teknoloji) girme.
> - Açacağın iki firmaya **müşteri, plan ya da abonelik ekleme.** Temizlik sorgusu bu firmalarda yalnızca kullanıcı olduğunu varsayıyor.
>
> Her adımın sonucunu "tamam" ya da "beklenenden farklı: …" diye not al. ADR'ye bu notlar yazılacak.
>
> 1. **Uygulamayı test dalında başlat.** `.env.test` kullanılır ve canlı veritabanına bağlanma koruması devrededir:
>    ```
>    npm run dev:test
>    ```
>    Tarayıcıda `http://localhost:3000/kayit` adresini aç.
>
> 2. **Firma A'yı kaydet.** Bu adım, `parolaOzetle()` değişikliğinden sonra kayıt akışını da sınar.
>    - Firma adı: `Elle Test A`
>    - Ad soyad: `Elle A Yonetici`
>    - E-posta: `elle-a.yonetici@example.com`
>    - Parola: sahte bir parola, örneğin `ElleTest-2026`
>
>    ✅ Beklenen: Dashboard açılır.
>
> 3. **Kullanıcılar sayfasını aç:** `http://localhost:3000/kullanicilar`
>
>    ✅ Beklenen:
>    - Sayfa yer tutucu değil, form ve tablo görünüyor.
>    - "Kullanıcı listesi (1)" yazıyor.
>    - Tek satır var: rozet "Yönetici", eklenme tarihi "25 Ekim 2026".
>
> 4. **Boş formu gönder.** Hiçbir alanı doldurmadan "Kullanıcı ekle" düğmesine bas.
>
>    ✅ Beklenen: Ad soyad, e-posta ve parola alanlarının üçünün altında da kırmızı hata mesajı çıkar.
>
> 5. **Yalnızca parolayı hatalı gir.**
>    - Ad soyad: `Elle A Finans`
>    - E-posta: `  ELLE-A.Finans@Example.com  ` (başında ve sonunda boşluk, büyük harfli)
>    - Parola: `kisa`
>
>    ✅ Beklenen:
>    - Yalnızca parola alanında "Parola en az 8 karakter olmalıdır." mesajı çıkar.
>    - Ad soyad ve e-posta alanları dolu kalır.
>    - **Parola alanı boştur.**
>
> 6. **Başarılı ekleme.** Ad soyad ve e-posta aynı kalsın, parolaya `ElleFinans-2026` yaz ve gönder.
>
>    ✅ Beklenen:
>    - Şu mesaj çıkar: "Elle A Finans" finans rolüyle eklendi…
>    - Form boşalır.
>    - Liste "(2)" olur.
>    - Yeni satırda e-posta **küçük harfle** ve boşluksuz görünür: `elle-a.finans@example.com`. Rozet "Finans" yazar.
>
> 7. **Aynı e-postayı tekrar ekle.** Ad soyad: `Baska Kisi`, e-posta: `elle-a.finans@example.com`, parola: `ElleFinans-2026`.
>
>    ✅ Beklenen: E-posta alanının altında "Bu e-posta adresiyle zaten bir hesap var." yazar. Liste hâlâ "(2)".
>
> 8. **Çıkış yap** ve `elle-a.finans@example.com` / `ElleFinans-2026` ile giriş yap.
>
>    ✅ Beklenen: Dashboard açılır.
>
> 9. **Finance yetkilerini dene.** Menüden Müşteriler, Planlar ve Abonelikler sayfalarına gir. Hiçbir şey ekleme, yalnızca sayfaları aç.
>
>    ✅ Beklenen: Üç sayfa da açılır.
>
> 10. **Yasak sayfaları adres çubuğuna yazarak dene:**
>     - `http://localhost:3000/ayarlar`
>     - `http://localhost:3000/kullanicilar`
>
>     ✅ Beklenen: İkisinde de "yetkiniz yok" ekranı çıkar. Kullanıcı listesi ve form **görünmez.**
>
> 11. **Çıkış yap** ve `http://localhost:3000/kayit` sayfasından Firma B'yi kaydet:
>     - Firma adı: `Elle Test B`
>     - Ad soyad: `Elle B Yonetici`
>     - E-posta: `elle-b.yonetici@example.com`
>     - Parola: `ElleTest-2026`
>
> 12. **İzolasyonu dene.** Firma B'de `/kullanicilar` sayfasını aç.
>
>     ✅ Beklenen: "Kullanıcı listesi (1)". Yalnızca `elle-b.yonetici@example.com` görünür. A firmasının iki kullanıcısı **görünmez.**
>
> 13. **Başka firmadaki e-postayı dene.** B'de şu bilgilerle kullanıcı eklemeyi dene: ad soyad `Deneme`, e-posta `elle-a.finans@example.com`, parola `ElleFinans-2026`.
>
>     ✅ Beklenen: "Bu e-posta adresiyle zaten bir hesap var." mesajı çıkar. Bu, ADR'ye yazacağımız B11 sınırının kullanıcı eklemedeki hâlidir. B'nin listesi "(1)" kalır.
>
> 14. **Sunucuyu durdur.** Terminalde Control+C tuşlarına bas.
>
> Sonuçta test dalında 2 firma (`Elle Test A`, `Elle Test B`) ve 3 kullanıcı (`elle-a.yonetici`, `elle-a.finans`, `elle-b.yonetici`) olmalı.
>
> ## B. Neon temizliği (çalıştırmadan önce göster)
>
> ### B1. Doğru dalda olduğunu kontrol et
>
> 1. Neon Console'da projeni aç, sol menüden **Branches** sayfasına gir.
> 2. Canlı dalın yanında **Default** etiketi vardır. Test dalı, `.env.test` dosyasının bağlandığı diğer daldır. Adını not et.
> 3. Sol menüden **SQL Editor** sayfasına geç. Üstteki dal seçicide **test dalının adı** seçili olmalı. **Default etiketli dal seçiliyse dur.**
> 4. İkinci güvence: Elle test hesapları yalnızca test dalında açıldı. Aşağıdaki SELECT 1 sorgusu bu yüzden yalnızca test dalında 3 satır döndürür. **0 satır gelirse yanlış daldasın, dur.**
>
> ### B2. SELECT sorguları (yalnızca okur, hiçbir şeyi değiştirmez)
>
> Not: Prisma sütun adlarını büyük-küçük harfli tuttuğu için `"tenantId"` gibi adlar çift tırnak içinde yazılıyor.
>
> **SELECT 1. Silinecek kullanıcılar.** Beklenen: 3 satır.
>
> ```sql
> SELECT u.email, u.role, u."createdAt", t.name AS firma
> FROM users u
> JOIN tenants t ON t.id = u."tenantId"
> WHERE u.email LIKE 'elle-%@example.com'
> ORDER BY u.email;
> ```
>
> **SELECT 2. Bu kullanıcıların firmaları ve firmalardaki diğer kayıtlar.** Beklenen: 2 satır, `Elle Test A` ve `Elle Test B`.
> - `kullanici` sütunu A'da 2, B'de 1 olmalı.
> - **Diğer bütün sayılar 0 olmalı.** Herhangi biri 0 değilse dur.
>
> ```sql
> SELECT t.id, t.name,
>   (SELECT count(*) FROM users x WHERE x."tenantId" = t.id) AS kullanici,
>   (SELECT count(*) FROM users x WHERE x."tenantId" = t.id
>      AND x.email NOT LIKE 'elle-%@example.com') AS elle_disi_kullanici,
>   (SELECT count(*) FROM customers c WHERE c."tenantId" = t.id) AS musteri,
>   (SELECT count(*) FROM plans p WHERE p."tenantId" = t.id) AS plan,
>   (SELECT count(*) FROM subscriptions s WHERE s."tenantId" = t.id) AS abonelik,
>   (SELECT count(*) FROM subscription_events e WHERE e."tenantId" = t.id) AS olay
> FROM tenants t
> WHERE t.id IN (SELECT "tenantId" FROM users WHERE email LIKE 'elle-%@example.com');
> ```
>
> **SELECT 3. Firma adlarının benzersiz olduğunu kontrol eder.** Beklenen: `2`.
>
> ```sql
> SELECT count(*) FROM tenants WHERE name IN ('Elle Test A', 'Elle Test B');
> ```
>
> Üç sonucu getir. **DELETE'e benim ve senin onayın olmadan geçme.**
>
> ### B3. DELETE sorguları (SELECT sonuçları onaylandıktan SONRA, sırayla)
>
> **DELETE 1. Kullanıcılar.** Silinen 3 e-postayı ve firma kimliklerini gösterir. Kimlikler SELECT 2'deki kimliklerle aynı olmalı.
>
> ```sql
> DELETE FROM users
> WHERE email LIKE 'elle-%@example.com'
> RETURNING email, "tenantId";
> ```
>
> **DELETE 2. Firmalar.** Yalnızca bu iki adı taşıyan ve içinde artık **hiçbir kayıt kalmamış** firmalar silinir. Beklenen: 2 satır.
>
> ```sql
> DELETE FROM tenants t
> WHERE t.name IN ('Elle Test A', 'Elle Test B')
>   AND NOT EXISTS (SELECT 1 FROM users x WHERE x."tenantId" = t.id)
>   AND NOT EXISTS (SELECT 1 FROM customers c WHERE c."tenantId" = t.id)
>   AND NOT EXISTS (SELECT 1 FROM plans p WHERE p."tenantId" = t.id)
>   AND NOT EXISTS (SELECT 1 FROM subscriptions s WHERE s."tenantId" = t.id)
>   AND NOT EXISTS (SELECT 1 FROM subscription_events e WHERE e."tenantId" = t.id)
> RETURNING id, name;
> ```
>
> **Son kontrol.** Beklenen: iki sütun da 0.
>
> ```sql
> SELECT
>   (SELECT count(*) FROM users WHERE email LIKE 'elle-%@example.com') AS kalan_kullanici,
>   (SELECT count(*) FROM tenants WHERE name IN ('Elle Test A', 'Elle Test B')) AS kalan_firma;
> ```
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **Rota adları:** Planlar ve abonelikler sayfalarının adreslerini bilmiyorum, bu yüzden "menüden" dedim. Kesin bildiklerim: `/dashboard`, `/musteriler`, `/ayarlar`, `/kullanicilar`, `/kayit`.
> - **Tablo ve sütun adları:** Tablo adlarını `schema.prisma` dosyasındaki `@@map` satırlarından aldım. Sütun adlarında `@map` olmadığı için camelCase olduklarını varsayıyorum. SELECT 1 hata verirse (örneğin "column does not exist"), hata mesajını getir, tahmin etmeden düzeltirim.
> - **Neon arayüzü:** Neon arayüzündeki menü adları ("Branches", "SQL Editor", "Default" etiketi) değişmiş olabilir. Dal seçicide hangi dalın seçili olduğundan emin olamazsan dur ve ekranda ne gördüğünü yaz.
> - **DELETE sırası:** Firmayı kullanıcılardan önce silmek veritabanı tarafından reddedilir (Prisma'nın varsayılan kısıtı). Bu yüzden sıra önce kullanıcılar, sonra firmalar.
> - **Giriş deneme sınırı:** Testte yanlış parola denemesi yapmıyoruz, bu yüzden 15 dakikalık deneme sınırına takılma beklenmiyor.

### Prompt 10 · 25 Eki 2026 16:02

````text
Parça 4 tamam. Elle test: 2-13. adımların hepsi beklenen sonucu verdi (kayıt, boş form hatası, parola hatası ve ad/e-posta korunması, parola alanının boş kalması, başarılı ekleme ve küçük harfli e-posta, tekrar eden e-posta hatası, finance girişi, müşteri/plan/abonelik açılması, ayarlar ve kullanıcılar sayfalarında yetkiniz yok, iki firma izolasyonu, başka firmadaki e-postanın aynı mesajla reddedilmesi). Neon temizliği: sen bana SQL'i LIKE 'elle-%' ve 'Elle Test A/B' adlarına göre vermiştin; test dalında 22 Ekim'den kalma eski elle- hesapları ve aynı adlı eski bir firma varmış, bu SQL onları silerdi. SQL'i ben e-posta adreslerine ve createdAt >= 2026-10-25 şartına bağlayıp çalıştırdım: 3 kullanıcı ve 2 firma silindi, eski kayıtlara dokunulmadı, son kontrol 0 / 0 / 1 (eski firma yerinde). Bunu ADR Gün 14 bölümüne kısa bir süreç notu olarak yaz (test dalında önceki günlerden kalma elle test kayıtları var, bilerek silinmedi, temizlik e-posta ve tarih şartıyla yapıldı). Parça 5'e geç: README (190. satırdaki bilinen sınır, test sayıları varsa güncelle, küçük "İnceleme için" bölümü), ADR Gün 14 bölümü, Prompt Günlüğü Gün 14 satırı. Belgelerde "proje önerisi" ifadesi geçmesin. Önce belgelerin eski içeriğini görmek için dosyaları toplamam gerekiyorsa komutu ver. Commit ekleri için bu sohbetin oturum adresini bana soracaksın.
````

### Claude cevabı 10 · 25 Eki 2026 16:03

> SQL konusunda haklısın, hata bendeydi. SELECT sorguları güvence olarak düşünülmüştü, ama DELETE koşulu ad desenine bağlı olduğu için çok genişti. Test dalında önceki günlerden kalma eşleşen kayıtlar olabileceğini hesaba katmadım. Koşulu tam e-posta adreslerine ve tarihe bağlaman doğru çözümdü. ADR'ye yazacağım süreç notu bunu da içerecek.
>
> ## Parça 5: önce belgelerin mevcut hâlini görmem gerekiyor
>
> ADR'nin ve Prompt Günlüğü'nün dosya adlarını ve yapısını tam bilmiyorum. Satır numaraları da Gün 13'ten beri değişmiş olabilir. Bu yüzden önce bir toplama komutu veriyorum.
>
> Bu komut hiçbir dosyayı değiştirmez. Dosya listesini, README'nin satır numaralı tamamını, `docs/` içindeki belgelerin başlıklarını, Gün 13 kaydının başlıklarını ve "proje önerisi" ifadesinin şu an nerede geçtiğini masaüstünde tek bir dosyaya yazar:
>
> ```
> {
>   echo "=== dosya listesi ==="
>   git ls-files README.md docs prompt_cevap
>   echo "=== satır sayıları ==="
>   wc -l README.md docs/*.md
>   echo "=== README.md (satır numaralı) ==="
>   cat -n README.md
>   for f in docs/*.md; do
>     echo "=== $f başlıklar ==="
>     grep -n "^#" "$f"
>   done
>   echo "=== prompt_cevap/gun_13_prompt_cevap.md başlıklar ==="
>   grep -n "^#" prompt_cevap/gun_13_prompt_cevap.md
>   echo "=== 'proje öneri' geçen yerler (README ve docs) ==="
>   git --no-pager grep -n -i -E "proje öneri|proje oneri" -- README.md docs
> } > ~/Desktop/gun14_belgeler1.txt
> ```
>
> Oluşan `gun14_belgeler1.txt` dosyasını bana ekle. Başlıklara bakıp ikinci turda yalnızca gereken bölümleri isteyeceğim: ADR'nin Gün 13 bölümü (biçim örneği olarak) ve sonu, Prompt Günlüğü tablosunun başlığı ve son satırları, Gün 13 kaydının giriş kısmı.
>
> ## Yazacaklarımın taslak içeriği (metinler belgeleri görünce kesinleşecek)
>
> **README**
> - **190. satır civarındaki bilinen sınır:** "Kullanıcı ekleme yer tutucu" ifadesi yerine şu yazılacak: "Kullanıcı yönetimi yalnızca listeleme ve finans kullanıcısı eklemeyi kapsar. Silme, rol değiştirme, pasife alma ve parola sıfırlama yoktur."
> - **Test sayıları:** Yazıyorsa 197 (veritabanı gerektirmeyen) ve 64 (veritabanı) olarak güncellenir. Yazmıyorsa dokunulmaz.
> - **"İnceleme için" bölümü:** Mevcut "ısıt" cümlesi genişletilir: Render'daki ilk açılış yaklaşık 1 dakika sürebilir, Neon uyanırken ilk sorgu gecikebilir. Ardından 4-5 maddelik bir sıra gelir: demo yöneticiyle giriş, dashboard, kullanıcılar sayfası, ikinci demo firmayla izolasyon kontrolü, ADR ve Prompt Günlüğü bağlantıları. Demo hesapların README'de nasıl yazıldığını görünce uyacağım.
>
> **ADR Gün 14 bölümü**
> - **Bağlam:** Gün 1 issue #1 (MUST) ve önceki günlerden kalan yer tutucu sayfa.
> - **Kararlar:**
>   - K14.1: Yalnızca finance eklenir, rolü sunucu belirler, formda rol alanı yoktur.
>   - K14.2: E-posta benzersizliği veritabanı kısıtıyla sağlanır. Kiracı filtresi yüzünden önceden arama yapılmaz.
>   - K14.3: `parolaOzetle()` eklendi, bcrypt maliyeti tek yerde.
>   - K14.4: Tarih Türkiye saatiyle gösterilir.
>   - K14.5: Çekirdek fonksiyon ve test deseni (`cac-ayari.ts` ile aynı).
> - **Kabul edilen sınırlar:**
>   - Davet e-postası, parola sıfırlama, silme, rol değiştirme ve pasife alma yok.
>   - Parola yalnızca yönetici tarafından belirlenir, parola değiştirme akışı yok.
>   - Kullanıcı sayısı üst sınırı yok.
>   - B11 kullanıcı eklemede de geçerli.
>   - Firmaya ikinci bir manager eklenemez.
> - **Testler:** 6 yeni birim test ve 7 yeni veritabanı testi. Toplam: 197 / 0 ve 64 / 0.
> - **Elle test:** 13 adımın sonuçları.
> - **Süreç notu (Neon test dalı):** Test dalında önceki günlerden kalma elle test kayıtları var, bilerek silinmedi. Ad desenine dayalı ilk temizlik sorgusu bu kayıtları da silerdi. Temizlik tam e-posta adresleri ve tarih şartıyla yapıldı: 3 kullanıcı ve 2 firma silindi, son kontrol 0 / 0 / 1.
> - **Geçmiş kayıtlar:** "259, 642 ve 992. satırlardaki yer tutucu ifadeleri geçmiş gün kayıtlarıdır, Gün 14'te dolduruldu" notu. Bu satırların kendisi değişmez.
>
> **Prompt Günlüğü:** Mevcut tablo biçimine uygun bir Gün 14 satırı. Senin gözlemlerin gerekiyorsa sorarım, uydurmam.
>
> **`prompt_cevap/gun_14_prompt_cevap.md`:** Daha önce plana aldığımız bu dosyayı da Gün 13 kaydının biçimiyle hazırlayacağım. İçeriğe [AD_DESENI] ve Neon maskeleri uygulanacak. İstemiyorsan söyle, plandan çıkarırım.
>
> Belgelerin hiçbirine "proje önerisi" yazılmayacak. Toplama komutundaki son kısım, bu ifadenin şu anki yerlerini gösterecek. Parça 5'in sonunda da aynı aramayla değişmediğini kontrol edeceğiz.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **Dosya adları:** ADR ve Prompt Günlüğü'nün `docs/` içinde olduğunu varsayıyorum. Değilse dosya listesi gösterecek.
> - **Finance demo hesabı:** README'deki "İnceleme için" sırasının demo firmalarda finance hesabı olup olmadığına bağlı olacağını düşünüyorum. Seed betiğini görmedim, README'den öğreneceğim.
> - **Oturum adresi:** Commit ve PR adımına gelince bu sohbetin oturum adresini senden isteyeceğim.

### Prompt 11 · 25 Eki 2026 16:06

````text
Dosya ekte (gun14_belgeler1.txt). İki düzeltme: (1) prompt_cevap/gun_14_prompt_cevap.md dosyasını sen hazırlama; kayıt dosyalarını ana sohbet veri dışa aktarmasından üretiyor. Sen yalnızca Prompt Günlüğü satırını yaz. (2) ADR'deki elle test bölümü kısa olsun: "13 adımın hepsi beklenen sonucu verdi" yeter. Prompt Günlüğü "AI çıktısını değiştirdim mi?" sütunu için gerçek düzeltmeler: (a) planda sunum ve proje önerisi şablon çelişkisi vardı; sunum yerine inceleme rehberi, proje önerisi teslim listesine ve belgelere girmedi; (b) manager rolü eklenebilsin mi sorusu: yalnızca finance seçildi; (c) test:db beklentisi 65 yazıldı, doğrusu 64 (dosyada 7 test var); (d) Neon temizlik SQL'i ad desenine bağlıydı, test dalında 22 Ekim'den kalan eski elle- kayıtları ve aynı adlı eski bir firma varmış, silinirdi; SQL e-posta adreslerine ve createdAt >= 2026-10-25 şartına bağlandı; (e) Neon SQL Editor ilk açılışta canlı dalda (Default) açıktı, orada yalnızca SELECT çalıştırıldı (0 satır), hemen test dalına geçildi. Ad soyad ve firma adı küçük harfle görünmesi bir hata değil, forma küçük harfle yazıldı. Ayrıca belgeleri yazarken ADR'nin mevcut biçimine ve Gün 13 bölümünün başlık düzenine uy.
````

_[ek dosya: gun14_belgeler1.txt]_

### Claude cevabı 11 · 25 Eki 2026 16:07

> İki düzeltmeyi not aldım:
> - `gun_14_prompt_cevap.md` dosyasını ben hazırlamıyorum, yalnızca Prompt Günlüğü satırını yazacağım.
> - ADR'deki elle test bölümü tek cümle olacak.
>
> Ayrıca: README'de test sayısı yazmıyor, o yüzden sayılara dokunmuyorum. `docs/` ve README'de "proje öneri" ifadesi hiç geçmiyor, bu da korunacak.
>
> README'yi tamamen görebildiğim için değişikliklerini şimdi veriyorum. ADR ile Prompt Günlüğü için önce biçim örneklerini görmem gerekiyor, en sonda ikinci toplama komutu var.
>
> ## Önce bir risk: canlı demo ve seed betiği
>
> README'nin 180. satırına göre seed betiği bir firmayı "demo firma" saymak için iki koşul arıyor:
> 1. Firmanın adı birebir "Mavi Yazılım" ya da "Kuzey Teknoloji" olmalı.
> 2. Firmanın **bütün kullanıcıları `@demo.example` uzantılı** olmalı.
>
> Artık arayüzden kullanıcı eklenebildiği için şu senaryo mümkün:
> 1. İnceleyen kişi canlıda Mavi Yazılım'a girer ve `deneme@gmail.com` gibi bir kullanıcı ekler.
> 2. Firmanın bütün kullanıcıları artık `@demo.example` uzantılı olmaz.
> 3. `npm run seed:demo:canli` bu firmayı demo saymaz ve sıfırlamadan durur.
>
> Arayüzde silme olmadığı için o kullanıcıyı ancak Neon'dan silebilirsin.
>
> Önerim: kod değiştirmeyelim. Bunun yerine:
> - README'deki "İnceleme için" bölümüne "denerken `@demo.example` uzantılı bir adres kullanın" ricası yazalım.
> - ADR'ye bilinen sınır olarak ekleyelim: "Böyle olursa eklenen kullanıcı Neon'da e-posta ve tarih şartıyla silinir, sonra seed çalıştırılır."
>
> Bunu tahmine dayanarak söylüyorum. Koşulun kodda gerçekten böyle olup olmadığını ikinci toplama komutuyla kontrol edeceğim.
>
> ## README değişiklikleri (VS Code'da Cmd+F ile bul ve değiştir)
>
> Üç değişiklik var. Bölüm adı "İnceleme için" olacak.
>
> **1. Yeni bölüm.** 25. satır ("İki firmanın verisi bilerek farklıdır…") ile `## Teknoloji` başlığı arasına, bir boş satır bırakarak şunu ekle:
>
> ```markdown
> ## İnceleme için
> 1. **Siteyi ısıt:** Canlı adresi açıp giriş sayfası gelene kadar bekleyin (uykudaysa yaklaşık 1 dakika). Ardından bir demo hesapla girip dashboard'u bir kez yükleyin: veritabanının uyanma gecikmesi bu ilk sorguda yaşanır, sonraki sayfalar hızlı açılır.
> 2. **Yönetici gözüyle:** `yonetici.mavi@demo.example` ile girin. Dashboard (metrikler, MRR grafiği, riskli abonelikler), Müşteriler, Planlar, Abonelikler, Ayarlar (CAC) ve Kullanıcılar (liste ve finans kullanıcısı ekleme) sayfalarına bakın. Kullanıcı eklemeyi denerseniz `@demo.example` uzantılı bir e-posta kullanın.
> 3. **Rol farkı:** `finans.mavi@demo.example` ile girin. Kayıt sayfaları açıktır; Ayarlar ve Kullanıcılar "Bu sayfaya erişim yetkiniz yok" gösterir.
> 4. **Kiracı izolasyonu:** İkinci bir tarayıcıda Kuzey Teknoloji hesabıyla girin (bkz. [İki firmanın karışmadığını doğrulama](#i̇ki-firmanın-karışmadığını-doğrulama)).
> 5. **Gerçek zamanlı uyarı:** Aynı firmanın iki hesabını iki ayrı tarayıcıda açın. Birinde bir aboneliği iptal edin, uyarı ötekinde sayfa yenilenmeden görünür. (İptal demo veriyi değiştirir; demo veri sıfırlanabilir.)
> 6. **Kod ve süreç:** `npm test` veritabanı istemez. Kararlar [ADR](docs/02_ADR.md), yapay zekâ ile çalışma süreci [Prompt Günlüğü](docs/03_Prompt_Gunlugu.md) ve [prompt ve cevaplar](prompt_cevap/README.md) içindedir.
>
> ```
>
> **2. Isıtma cümlesi.** Bilinen sınırlar bölümündeki cümle tekrar yazılmıyor, yeni bölüme yönlendiriliyor:
> - Bul: `İncelemeden önce siteyi açıp ısıtmak gerekir.`
> - Değiştir: `İncelemeden önce siteyi açıp ısıtmak gerekir (bkz. İnceleme için, 1. madde).`
>
> **3. Kullanıcı ekleme sınırı.** Eski 190. satırın tamamını bul:
> `- **Kullanıcı ekleme:** Kullanıcılar sayfası henüz yer tutucudur. Bu yüzden bir firmaya finans kullanıcısı arayüzden eklenemez. Demo firmalardaki finans hesapları seed betiğiyle oluşturulur.`
>
> Şununla değiştir:
> `- **Kullanıcı yönetimi:** Yönetici, Kullanıcılar sayfasında firmasının kullanıcılarını görür ve finans rolünde yeni kullanıcı ekler. Silme, rol değiştirme, pasife alma, parola sıfırlama ve davet e-postası yoktur; parolayı yönetici belirler ve kullanıcıya kendisi iletir. Firmaya ikinci bir yönetici eklenemez, kullanıcı sayısı için üst sınır yoktur. Gerekçeler [ADR, Gün 14 bölümünde](docs/02_ADR.md).`
>
> **İsteğe bağlı küçük doğruluk düzeltmesi.** Testler tablosundaki 161. satır:
> - Bul: `| Kiracı izolasyonu, pasife alma, dashboard verisi, riskli abonelikler, giriş |`
> - Değiştir: `| Kiracı izolasyonu, pasife alma, dashboard verisi, riskli abonelikler, giriş, kullanıcı ekleme |`
>
> İstemezsen bunu atla.
>
> **Kontrol.** Bu komut README'deki değişiklikleri gösterir: 3-4 yerde değişiklik ve yaklaşık 9 yeni satır görmelisin.
>
> ```
> git --no-pager diff --stat README.md
> ```
>
> 4. maddedeki bölüm bağlantısında Türkçe "İ" harfi var. GitHub bu harfi bağlantı adresine bazen farklı çevirir. Commit'ten sonra GitHub'da bağlantıya tıklayıp çalıştığını kontrol et. Çalışmazsa bağlantıyı kaldırıp yalnızca bölüm adını yazarız.
>
> ## İkinci toplama: ADR, Prompt Günlüğü ve seed koşulu
>
> Bu komut hiçbir dosyayı değiştirmez. Satır numaralarıyla şunları masaüstündeki bir dosyaya yazar:
> - ADR'nin baş kısmı (1-60): Bölüm 4 ve 5'e Gün 14 satırı gerekiyor mu, bakmak için.
> - ADR'nin Gün 13 bölümünün tamamı: biçim örneği olarak.
> - Prompt Günlüğü'nün başı ve ek kayıtlar tablosu.
> - Seed betiğindeki demo firma koşulu.
>
> ```
> {
>   echo "=== ADR 1-60 ==="
>   cat -n docs/02_ADR.md | sed -n '1,60p'
>   echo "=== ADR Gün 13 (1227-1358) ==="
>   cat -n docs/02_ADR.md | sed -n '1227,1358p'
>   echo "=== Prompt Günlüğü 1-12 ==="
>   cat -n docs/03_Prompt_Gunlugu.md | sed -n '1,12p'
>   echo "=== Prompt Günlüğü 158-184 ==="
>   cat -n docs/03_Prompt_Gunlugu.md | sed -n '158,184p'
>   echo "=== seed demo koşulu ==="
>   git --no-pager grep -n -E "demo\.example|endsWith|every\(" -- src/test-destek/seed-demo.ts src/test-destek/demo-kurulum.ts
> } > ~/Desktop/gun14_belgeler2.txt
> ```
>
> Bu çıktıdaki Gün 13 bölümünün içinde maskelenmiş ifadeler zaten olmalı, ama yine de göz at.
>
> ## ADR Gün 14 bölümü: taslak iskelet (biçim Gün 13'e göre kesinleşecek)
>
> `## Gün 14 kararları (25 Ekim 2026): kullanıcı yönetimi` başlığı altında şu alt başlıklar olacak:
>
> - **`### Kararlar`**
>   - K14.1: Yalnızca finance eklenir, rolü sunucu belirler, formda rol alanı yoktur.
>   - K14.2: E-posta benzersizliği veritabanı kısıtıyla sağlanır. Kiracı filtresi yüzünden önceden arama yapılmaz. Kayıt formundaki mesaj kullanılır.
>   - K14.3: `parolaOzetle()` eklendi, bcrypt maliyeti tek yerde. Kayıt akışında davranış değişmedi.
>   - K14.4: Tarih Türkiye saatiyle gösterilir.
>   - K14.5: Çekirdek fonksiyon ve test deseni `cac-ayari.ts` ile aynı. Testler: 6 birim ve 7 veritabanı testi, toplam 197/0 ve 64/0.
>   - 259, 642 ve 992. satırlardaki "yer tutucu" ifadeleri geçmiş kayıttır, Gün 14'te dolduruldu.
> - **`### Elle test`:** "Test dalında 13 adımın hepsi beklenen sonucu verdi."
> - **`### Bilinen sınırlar`**
>   - Davet e-postası, parola sıfırlama, silme, rol değiştirme ve pasife alma yok.
>   - Parola yalnızca yönetici tarafından belirlenir, parola değiştirme akışı yok.
>   - Kullanıcı sayısı üst sınırı yok.
>   - Firmaya ikinci bir manager eklenemez.
>   - B11 kullanıcı eklemede de geçerli.
>   - Seed koşulu ile ilgili risk (doğrulanırsa).
> - **`### Süreç notları`**
>   - Neon test dalında 22 Ekim'den kalma elle test kayıtları var, bilerek silinmedi. Ad desenine bağlı ilk temizlik sorgusu bu kayıtları da silerdi. Temizlik tam e-posta adresleri ve `createdAt >= 2026-10-25` şartıyla yapıldı: 3 kullanıcı ve 2 firma silindi, eski firma yerinde kaldı.
>   - SQL Editor ilk açılışta canlı dalda açıktı. Orada yalnızca bir SELECT çalıştı (0 satır döndü), hemen test dalına geçildi.
>
> **Prompt Günlüğü satırı:** "AI çıktısını değiştirdim mi?" sütununa senin verdiğin (a)-(e) maddeleri yazılacak. Satırın biçimi tablo başlığını görünce kesinleşecek.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **Seed koşulu:** Seed betiğinin koşulunu yalnızca README'den biliyorum. İkinci toplama bunu doğrulayacak. Koşul farklıysa README'deki ricayı ve ADR maddesini çıkarırım.
> - **Bölüm sırası:** "İnceleme için" bölümünü Demo hesaplar bölümünün hemen altına koydum, çünkü inceleyen kişi hesapları gördükten hemen sonra ne yapacağını okusun istedim. Başka bir yer tercih edersen söyle.
> - **SSE maddesi:** README'deki 5. madde (uyarının öteki tarayıcıda görünmesi) Gün 10'da doğrulanmış davranışa dayanıyor. Canlıda bugün ayrıca denenmedi. İstersen canlı doğrulama listesine ekleriz.

### Prompt 12 · 25 Eki 2026 16:09

````text
Dosya ekte (gun14_belgeler2.txt). README değişikliklerini ana sohbetle birlikte uyguluyorum; iki küçük değişiklikle: (1) 4. maddedeki bölüm bağlantısını kaldırdım (İ harfi anchor sorunu), yalnızca bölüm adı kalıyor; (2) 3. maddede yetki mesajını tırnaksız genel yazdım, çünkü tam mesajı doğrulamadık. Sen ADR Gün 14 bölümünü ve Prompt Günlüğü satırını yaz. Seed demo koşulunu ekteki çıktıdan doğrula; koşul gerçekten "bütün kullanıcıları @demo.example" ise ADR'ye bilinen sınır olarak yaz, değilse bana söyle, README ricasını çıkarırız. Metinleri nasıl uygulatacağını (perl ya da editör, hangi dosyaya hangi satıra) adım adım yaz, uzun tek satırlık perl komutları ve çok satırlı yapıştırma Terminal'de bozulabiliyor; büyük bloklar için dosyayı editörde açıp yapıştırmamı iste.
````

_[ek dosya: gun14_belgeler2.txt]_

### Claude cevabı 12 · 25 Eki 2026 16:11

> Seed koşulunu çıktıdan doğruladım. `seed-demo.ts` dosyasında şu koşul var:
>
> ```
> mevcut.users.length === 0 || !mevcut.users.every((u) => u.email.endsWith(DEMO_UZANTI))
> ```
>
> Yani firmanın kullanıcısı yoksa ya da **bütün** kullanıcıları `@demo.example` uzantılı değilse, betik o firmayı demo saymıyor. Ek olarak, kontrol özetinde "demo firmalardaki demo olmayan kullanıcı" sayısı ayrıca tutuluyor. Bu yüzden README'deki rica kalsın, ADR'ye de bilinen sınır olarak yazıyorum.
>
> README'deki iki değişikliğin uygun: bağlantıyı kaldırdın ve yetki mesajını tırnaksız yazdın. Prompt Günlüğü'ndeki (a) maddesini "proje önerisi" ifadesini kullanmadan yazdım.
>
> ## 1) ADR Gün 14 bölümü: editörde yapıştır
>
> 1. `docs/02_ADR.md` dosyasını VS Code'da aç.
> 2. Cmd+Aşağı ok ile dosyanın en sonuna git. Son satır 1358 olmalı ("…İkisi de düzeltildi.").
> 3. Enter'a iki kez basarak bir boş satır bırak.
> 4. Aşağıdaki bloğu yapıştır ve Cmd+S ile kaydet.
>
> ```markdown
> ## Gün 14 kararları (25 Ekim 2026): kullanıcı yönetimi
>
> **Durum:** Gün 1 issue #1 (MUST: kayıt, giriş, roller) firma sahibinin çalışanlarını rol ile ekleyebilmesini
> istiyordu, ancak Kullanıcılar sayfası o güne kadar yer tutucuydu. Gün 6, Gün 9 ve Gün 11 bölümlerindeki
> "yer tutucu" ifadeleri o günlerin durumudur, değiştirilmedi. Gün 14'te sayfa dolduruldu. Değişiklik
> `gun14-kullanici-yonetimi` dalında, tek PR ile girer.
> **Sonuç:** `npm test` 197 test (6 yeni), `npm run test:db` 64 test (7 yeni) geçiyor, kalan 0.
> `npx tsc --noEmit` ve `npm run lint` temiz, `npm run build` başarılı (`/kullanicilar` dinamik rota).
> Şema değişikliği ve yeni paket yok.
>
> ### Kararlar
>
> **K14.1: Yalnızca finans kullanıcısı eklenir**
> - **Karar:** Manager, Kullanıcılar sayfasında firmasının kullanıcılarını (ad soyad, e-posta, rol, eklenme
>   tarihi) görür ve yeni kullanıcı ekler. Eklenen kullanıcının rolü her zaman `finance`'tır. Formda rol alanı
>   yoktur, rolü sunucu yazar; formdan yalnızca ad soyad, e-posta ve parola okunur.
> - **Neden:** Silme ve rol değiştirme kapsam dışı olduğu için yanlışlıkla eklenen bir manager geri alınamazdı.
>   Firmanın tek manager'ı kayıt olan kişidir.
> - **Yetki:** Sayfa `requireManager()` ile korunur, finance "yetkiniz yok" ekranını görür. Ekleme işlemi rolü
>   sunucuda ayrıca kontrol eder (`kullaniciEkleCekirdek`); sayfayı gizlemek yetki sayılmaz.
> - **Oturum:** Yeni kullanıcı için oturum açılmaz, manager kendi oturumunda kalır.
>
> **K14.2: E-posta benzersizliği veritabanı kısıtıyla sağlanır**
> - Kullanıcı e-postası bütün sistemde benzersizdir (`email @unique`). Müşteri e-postasından farklı olarak firma
>   bazında değildir (Gün 4).
> - Önceden arama yapılmaz: `getTenantDb()` aramaya kendi firmanın filtresini eklediği için başka firmadaki
>   kaydı görmezdi. Ekleme denenir, tekrar eden kayıt hatası (P2002) `tekrarEdenKayitMi()` ile yakalanır ve
>   kayıt formundaki mesaj ("Bu e-posta adresiyle zaten bir hesap var.") e-posta alanında gösterilir.
> - E-posta kayıttaki gibi hazırlanır: kırpılır ve küçük harfe çevrilir (`epostaDogrula`).
>
> **K14.3: Girdi ve parola kuralları kayıtla aynı**
> - `kullaniciGirdisiniDogrula()` (`validation.ts`) kayıttaki kuralları kullanır: ad soyad 2-100 karakter,
>   parola en az 8 karakter ve en çok 72 bayt. Kayıttan farkı, müşteri formu gibi bütün alan hatalarını
>   birlikte döndürmesidir.
> - Parola `auth.ts` içindeki yeni `parolaOzetle()` ile bcrypt'le özetlenir. Kayıt da artık aynı fonksiyonu
>   kullanır, bcrypt maliyeti tek yerde kalır. Kayıt akışının davranışı değişmedi (`giris.test.ts` ve elle
>   test).
> - Parola hata durumunda forma geri gönderilmez ve loglanmaz. Beklenmeyen hatada log satırı sabit bir metindir.
>
> **K14.4: Mevcut yapıya uyuldu**
> - `tenant.ts` ve şema değişmedi. User tablosuna ekleme, kiracı filtresinin yazma beyaz listesinden geçer;
>   `tenantId` oturumdaki değerle ezilir.
> - Çekirdek ve test deseni `cac-ayari.ts` ile aynıdır: `src/lib/kullanici-yonetimi.ts`
>   (`kullanicilariListele`, `kullaniciEkleCekirdek`). Sunucu işlemi yalnızca oturumu okur. Liste parola
>   özetini hiç seçmez.
> - Eklenme tarihi `bicim.ts` içindeki yeni `tarihMetni()` ile Türkiye saatine göre gösterilir (Render
>   sunucusu UTC'de çalışır).
> - `package.json`'da yalnızca `test:db` listesine yeni test dosyası eklendi.
>
> **K14.5: Test kapsamı**
> - `npm test`: `validation.test.ts` (5 yeni) ve `bicim.test.ts` (1 yeni).
> - `npm run test:db`: `kullanici-yonetimi.test.ts` (7 test)
>   - finance kullanıcı ekleyemez
>   - geçersiz girdi alan hatası verir, parola geri dönmez
>   - başarılı eklemede rol finance, firma A, e-posta küçük harf, parola bcrypt özeti
>   - yeni kullanıcı A'nın listesinde görünür, B'ninkinde görünmez; listede parola özeti yoktur
>   - aynı firmadaki ve başka firmadaki e-posta aynı mesajla reddedilir
>   - firmayı kullanıcı nesnesindeki `tenantId` değil, `db` belirler
>
> ### Elle test
> Test dalında, iki yeni firma ve sahte `@example.com` hesaplarıyla 13 adımın hepsi beklenen sonucu verdi.
>
> ### Bilinen sınırlar
> - **Kapsam dışı:** Davet e-postası (e-posta bildirimi WON'T), parola sıfırlama, kullanıcı silme, rol
>   değiştirme, pasife alma.
> - **Parola:** Parolayı yalnızca yönetici belirler ve kullanıcıya kendisi iletir. Parola değiştirme akışı
>   yoktur.
> - **İkinci yönetici yok:** Firmaya manager eklenemez (K14.1).
> - **Üst sınır yok:** Kullanıcı sayısı için üst sınır, ekleme işlemi için hız sınırı yoktur (kayıt sınırı
>   olmamasıyla aynı, Gün 12).
> - **B11 kullanıcı eklemede de geçerli:** Mesaj, e-postanın başka bir firmada kayıtlı olduğunu belli eder.
>   Kayıt formu aynı bilgiyi zaten verdiği için belirsiz bir mesaj sızıntıyı kapatmazdı, yöneticiyi yanıltırdı.
> - **Demo firmaya demo olmayan kullanıcı:** Canlı demo hesaplar herkese açıktır. Biri demo firmaya
>   `@demo.example` dışında bir e-postayla kullanıcı eklerse seed o firmayı demo saymaz ve dokunmadan durur
>   (K13.3: bütün kullanıcılar `@demo.example` olmalı). Arayüzde silme olmadığı için eklenen kullanıcı Neon'da
>   e-posta ve tarih şartıyla silinir, ardından `seed:demo:canli` çalıştırılır. README'de denerken
>   `@demo.example` kullanılması rica edildi.
>
> ### Süreç notları
> - **Plan:** Gün 14 şablonu sunum hazırlığı istiyordu. Proje sunumsuz, depo, belgeler ve canlı uygulama
>   üzerinden incelendiği için sunum akışı yerine README'ye kısa bir "İnceleme için" bölümü eklendi. Kullanıcı
>   yönetimi temizlik işlerinden önce yapıldı.
> - **Önce mevcut dosyalar:** E-posta kuralı ve User tablosundaki yazma kuralları tahmin edilmedi. `tenant.ts`,
>   `auth.ts`, kayıt akışı, şema ve ayarlar sayfası gösterildikten sonra plan kesinleşti. Her parçadan sonra
>   testler çalıştırıldı.
> - **Neon test dalı temizliği:** Elle test hesapları test dalından silindi. Test dalında önceki günlerden
>   (22 Ekim) kalma elle test kayıtları ve aynı adlı eski bir firma vardır, bilerek silinmedi. AI'nın önerdiği
>   temizlik sorgusu ad desenine bağlıydı ve bu eski kayıtları da silerdi. Sorgu tam e-posta adreslerine ve
>   `createdAt >= 2026-10-25` şartına bağlanarak çalıştırıldı: 3 kullanıcı ve 2 firma silindi, son kontrol
>   0 / 0 / 1 (eski firma yerinde).
> - **Dal kontrolü:** Neon SQL Editor ilk açılışta canlı dalda (Default) açıktı. Orada yalnızca bir SELECT
>   çalıştı (0 satır), hemen test dalına geçildi. Silme sorgularından önce dal seçicisi kontrol edilir.
> - **Test sayısı:** AI `test:db` için 65 test bekledi. Dosyada 7 test vardır, doğrusu 64.
> - **Commit ekleri:** Claude Opus 5.5.
> ```
>
> ## 2) Prompt Günlüğü satırı: editörde yapıştır
>
> 1. `docs/03_Prompt_Gunlugu.md` dosyasını aç.
> 2. Cmd+Aşağı ok ile en sona git. Son satır, `| 13 |` ile başlayan satır olmalı (184. satır).
> 3. Bu satırın sonundayken **bir kez** Enter'a bas. **Araya boş satır koyma**, yoksa tablo bozulur.
> 4. Aşağıdaki tek satırı yapıştır ve kaydet.
>
> ```markdown
> | 14 | Gün 14 promptu: son kontrol ve inceleme hazırlığı; ek iş olarak issue #1'deki kullanıcı yönetimi (manager kendi firmasının kullanıcılarını listeler ve finans kullanıcısı ekler). Önce plan; mevcut dosyalar gösterildikten sonra onay, uygulama beş parçada ve her parçadan sonra testler. Plan ve uygulama bu sohbette yapıldı | `kullaniciGirdisiniDogrula` ve `tarihMetni` (6 birim testi, `npm test` 197), `auth.ts` içinde `parolaOzetle`, `kullanici-yonetimi.ts` ve `kullanici-yonetimi.test.ts` (7 test, `npm run test:db` 64), Kullanıcılar sayfası, form ve sunucu işlemi; README'de "İnceleme için" bölümü ve kullanıcı yönetimi sınırı; ADR Gün 14 bölümü | Evet: (1) Gün 14 şablonu sunum hazırlığı ve teslim listesi istiyordu, proje sunumsuz inceleniyor; sunum akışı yerine README'de kısa bir inceleme bölümü yazıldı, teslim listesi depoya konmadı; (2) AI manager rolünün de eklenip eklenemeyeceğini sordu, geri alınamayacağı için yalnızca finance seçildi; (3) AI `test:db` için 65 test bekledi, dosyada 7 test var, doğrusu 64; (4) AI'nın Neon temizlik SQL'i ad desenine bağlıydı, test dalında 22 Ekim'den kalan elle test kayıtları ve aynı adlı eski bir firma vardı ve silinirdi; SQL tam e-posta adreslerine ve `createdAt >= 2026-10-25` şartına bağlanarak çalıştırıldı; (5) Neon SQL Editor ilk açılışta canlı dalda (Default) açıktı, orada yalnızca SELECT çalıştı (0 satır), hemen test dalına geçildi |
> ```
>
> ## 3) Kontrol (her komut tek satır)
>
> 1. Belgelerde hangi dosyaların değiştiğini gösterir: README, ADR ve Prompt Günlüğü.
>    ```
>    git --no-pager diff --stat README.md docs
>    ```
> 2. ADR'de ve Prompt Günlüğü'nde silinen satır sayısını verir. Sonuç **0** olmalı, yalnızca ekleme yaptık:
>    ```
>    git --no-pager diff docs | grep -c '^-[^-]'
>    ```
> 3. Prompt Günlüğü'nün son iki satırının başını gösterir. `| 13 |` ve `| 14 |` alt alta görünmeli:
>    ```
>    tail -n 2 docs/03_Prompt_Gunlugu.md | cut -c1-8
>    ```
> 4. "Proje önerisi" ifadesini arar. **Hiç çıktı vermemeli:**
>    ```
>    git --no-pager grep -n -i -E "proje öneri|proje oneri" -- README.md docs
>    ```
> 5. Görsel kontrol: GitHub Desktop'ta ADR ve Prompt Günlüğü farkına bak. Yalnızca dosya sonunda yeşil satırlar olmalı.
>
> Sonuçları getirdiğinde son adıma geçeceğiz: commit öncesi üç tarama, commit ve PR. **O adımda senden bu sohbetin oturum adresini isteyeceğim.**
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **ADR Bölüm 5:** "Değişiklik geçmişi" tablosuna Gün 14 satırı eklemedim, çünkü Gün 13 de eklememişti. Kullanıcı yönetimi mimari kartı değiştirmiyor. İstersen tek satır eklerim.
> - **Hız sınırı:** "Ekleme işlemi için hız sınırı yoktur" cümlesi koda dayanıyor: çekirdekte deneme sınırı yok. Bu sınırı sen ayrıca istememiştin. Gereksiz bulursan cümleden çıkarabilirsin.
> - **"Yetkiniz yok":** ADR'de "yetkiniz yok" ifadesini tırnak içinde, genel bir ad olarak kullandım. README'de yaptığın gibi tırnaksız istersen K14.1'de değiştir.
> - **PR numarası:** PR numarasını henüz bilmediğim için ADR'de yazmadım ("tek PR ile girer"). Birleştikten sonra Gün 13'teki gibi numara ve commit kimliği eklemek istersen, bunu temizlik listesinin belge turunda yaparız.

### Prompt 13 · 25 Eki 2026 16:35

````text
Dosya ekte (gun14_yertutucu.txt): README ve docs içinde kalan köşeli parantezli yer tutucular. Kullanıcı yönetimi PR'ı (#47) birleşti ve canlıda doğrulandı; eski dallar da silindi. Şimdi bu yer tutucuları kapatacağız. Her biri için: (1) tahmin yazma; kesin kaynağı olan (git log tarihi, derleme sonucu) maddeleri nasıl bulacağımızı söyle; (2) kaynağı olmayanları ("ayrıntılı sonuç kaydedilmedi" gibi dürüst bir cümleyle) nasıl yazacağımızı söyle; (3) kullanıcıdan gözlem gerektirenleri (Prompt Günlüğü [doldur] hücreleri) ayrı listele, ben kendi gözlemlerimi sana yazacağım. Önce bana her dosya için kaç madde olduğunu ve hangi sırayla yapacağını söyle; kod değiştirme yok, yalnızca belge. Uzun komutları tek satır ver, büyük metinleri editörde yapıştırmam için ver.
````

_[ek dosya: gun14_yertutucu.txt]_

### Claude cevabı 13 · 25 Eki 2026 16:36

> Sayılar ve sıra aşağıda. Bu mesajda hiçbir dosyayı değiştirmiyoruz. Önce kanıtları topluyoruz, metinleri kanıtlar gelince yazacağım.
>
> ## Dosya başına madde sayısı
>
> | Dosya | Madde | Ne tür |
> |---|---|---|
> | README.md | 0 | — |
> | docs/02_ADR.md | 10 | 3 `[Tarih]` (56-58), 1 derleme sonucu (659), 6 `[SONUÇ: …]` (746-751) |
> | docs/03_Prompt_Gunlugu.md | 14 | 1 `[Tarih]` (9), 8 `[doldur]` (21, 23, 48, 50, 90, 92, 139, 141), 4 sonuç notu (160-163) ve listede olmayan 1 madde: 8. satırdaki `[örn. Claude, sürüm]` |
>
> Listede olmayan iki iş daha var, ikisi de temizlik notlarından:
> - **ADR Gün 10 bilinen sınırlarındaki köşeli parantezli cümle.** Senin arama desenin bunu yakalamamış olabilir.
> - **ADR Gün 11'deki `### Parça B kararları` başlığının başındaki iki boşluk.** Bu bir yer tutucu değil, ama aynı turda kapatılabilir.
>
> ## Sıra
>
> 1. **Kanıt toplama:** aşağıdaki komutlar. Hiçbir dosyayı değiştirmezler.
> 2. **ADR 56-58 tarihleri:** git geçmişi ve GitHub kaynaklarından.
> 3. **ADR 659 derleme sonucu:** Gün 10 kaydından ve Render'dan.
> 4. **ADR 746-751 ve Gün 10 bilinen sınır cümlesi:** Gün 10 kaydından ve senin hatırladıklarından. Kaynak yoksa dürüst cümle yazılır.
> 5. **ADR Gün 11 başlığındaki boşluk:** küçük bir perl düzeltmesi.
> 6. **Prompt Günlüğü'nün 14 maddesi:** senin gözlemlerin gelince.
> 7. **Son kontrol:** yer tutucu araması boş dönmeli. Ardından tek commit ve PR.
>
> ## Madde madde kaynak
>
> **A. Kesin kaynağı olabilecekler (tahmin yok)**
>
> | Satır | Kaynak | Bulunamazsa |
> |---|---|---|
> | ADR 56, "İlk sürüm" | ADR dosyasının depoya ilk girdiği commit'in tarihi (`git log --follow --diff-filter=A`). Dosya adı değiştiyse `--follow` eski adı da izler. | `tarih kaydedilmedi` |
> | ADR 57, "Neon'a geçiş" | Bu satırın ADR'ye ilk girdiği commit'in tarihi (`git log -S`). Satır depo açılırken zaten varsa, karar depodan önce verilmiş demektir. O durumda ilk commit tarihi yazılır ve sana söylerim. | `tarih kaydedilmedi` |
> | ADR 58, "Depo herkese açık" | Satırın ilk girdiği commit'in tarihi. Asıl olayın tarihi GitHub'da şu yoldan bulunabilir: profil → Settings → Archives → Security log, aramaya `repo` yaz, "made public" ya da `repo.access` kaydına bak. Kayıtlar 90 gün tutulur, bu yüzden bulunmalı. | Yalnızca commit tarihi |
> | ADR 659, `npm run build` | Gün 10 kaydında "build" araması. Ek kanıt: Render panelinde servis → **Events** bölümünde Gün 10 birleşmesinin dağıtımı "Deploy live" ise derleme başarılı demektir, çünkü Render da `npm run build` çalıştırıyor. | `sonuç kaydedilmedi` |
>
> Bulunanlar şöyle yazılır:
> - Satır 659, yerel sonuç kaydı yoksa: "`npm run build` yerel sonucu o gün kaydedilmedi; Gün 10 birleşmesinden sonraki Render dağıtımı başarılı (Render Events)." Bu cümle yalnızca Render bunu gösterirse yazılır.
> - Satır 57, satır zaten ilk commit'te varsa: tarih o commit'in tarihi olur. Süreç notuna da "karar depo açılmadan verildi" diye yazılır.
>
> **B. Kaynağı büyük olasılıkla olmayanlar (dürüst cümle)**
>
> Bunlar ADR 746-751'deki altı `[SONUÇ: …]` ve Gün 10 bilinen sınır cümlesi. Önce Gün 10 kaydında ararız. Senin Prompt Günlüğü'ndeki Gün 10 satırın da kısmi bir kaynak: "canlıda bağlantı, başlıklar ve `: nabiz` doğrulandı" diyor. Bu cümle, satır 748'in "üç başlık" kısmı için kanıt sayılabilir. Ama hangi üç başlık olduğu yazmıyor, o yüzden kaydı görmeden tamam demem.
>
> Kaynağı olmayan maddelerde test sorusu kalır, köşeli parantez sonuç cümlesine dönüşür. Örnek:
>
> `- Aynı firmada iptal, uyarı A'nın iki penceresinde görünüyor mu: ayrıntılı sonuç kaydedilmedi.`
>
> Bölümün sonuna tek bir not eklenir:
>
> `Not (25 Ekim 2026): Bu sonuçlar Gün 10'da kaydedilmedi ve sonradan tahminle doldurulmadı.`
>
> Bir sonucu kesin hatırlıyorsan, örneğin 401 dönüşünü, onu "sonradan hatırlanarak yazıldı" diye işaretleyebiliriz. Bu senin kararın.
>
> **C. Senin gözlemini gerektirenler (Prompt Günlüğü, 14 madde)**
>
> | Satır | Alan | Senden gereken |
> |---|---|---|
> | 8 | Kullanılan araç ve model | 3 turluk etkinlikte hangi aracı ve modeli kullandığın |
> | 9 | Tarih | Etkinliğin tarihi. Hatırlamıyorsan git geçmişinden bakarız, toplama komutunda var. |
> | 21, 23 | Başlangıç promptu: çıktı özeti, değerlendirme | Kendi gözlemin |
> | 48, 50 | Tur 1: çıktı özeti, değerlendirme | Kendi gözlemin |
> | 90, 92 | Tur 2: çıktı özeti, değerlendirme | Kendi gözlemin |
> | 139, 141 | Tur 3: çıktı özeti, değerlendirme | Kendi gözlemin |
> | 160 | Hangi turda çıktı en çok değişti? | Kendi gözlemin |
> | 161 | Hangi bileşen en fazla fark yarattı? | Kendi gözlemin |
> | 162 | Hangi varsayım yanlıştı? | Kendi gözlemin |
> | 163 | Hangi teknikler kullanıldı? | Kendi gözlemin |
>
> Dosyanın 4. satırındaki kural, bu alanların yapay zekâ gerçekten çalıştırıldıktan sonra senin gözlemlerinle doldurulmasını istiyor. Bu yüzden ben metin üretmeyeceğim. Senin yazdıklarını yalnızca imla ve tutarlılık açısından düzenleyip yerleştireceğim.
>
> Etkinlik hiç çalıştırılmadıysa ya da çıktılar saklanmadıysa, dürüst bir seçenek de var. Her hücreye "Bu tur için çıktı saklanmadı" yazılır, sonuç notlarına da proje boyunca gözlemlenenler yazılır. Bunu sen seç.
>
> ## Kanıt toplama (her komut tek satır, sırayla)
>
> Önce yeni dal açılır. Bu komutlar hiçbir dosyayı değiştirmez.
>
> 1. Ana dala geçer:
>    ```
>    git switch main
>    ```
> 2. GitHub'daki son hâli indirir:
>    ```
>    git pull
>    ```
> 3. Bu iş için yeni dalı açar:
>    ```
>    git switch -c gun14-belge-yertutucular
>    ```
>
> Aşağıdaki komutların her biri masaüstündeki `gun14_kanit.txt` dosyasına bir bölüm ekler. İlki dosyayı sıfırdan oluşturur, sonrakiler ekler.
>
> 4. ADR'nin depoya ilk girdiği commit:
>    ```
>    { echo "=== 1 ADR ilk commit ==="; git log --follow --diff-filter=A --format='%ad %h %s' --date=short -- docs/02_ADR.md; } > ~/Desktop/gun14_kanit.txt
>    ```
> 5. Deponun ilk üç commit'i:
>    ```
>    { echo "=== 2 depo ilk commitler ==="; git log --reverse --format='%ad %h %s' --date=short | head -n 3; } >> ~/Desktop/gun14_kanit.txt
>    ```
> 6. Neon satırının ADR'ye ilk girdiği commit:
>    ```
>    { echo "=== 3 Neon satiri ==="; git log --reverse --follow -S "Neon PostgreSQL" --format='%ad %h %s' --date=short -- docs/02_ADR.md | head -n 1; } >> ~/Desktop/gun14_kanit.txt
>    ```
> 7. Herkese açık satırının ADR'ye ilk girdiği commit:
>    ```
>    { echo "=== 4 public satiri ==="; git log --reverse --follow -S "herkese açık (public) yapıldı" --format='%ad %h %s' --date=short -- docs/02_ADR.md | head -n 1; } >> ~/Desktop/gun14_kanit.txt
>    ```
> 8. ADR'deki Gün 10 sonuç satırı ve elle test ile bilinen sınırlar bölümü:
>    ```
>    { echo "=== 5 ADR 656-660 ve 744-771 ==="; cat -n docs/02_ADR.md | sed -n '656,660p;744,771p'; } >> ~/Desktop/gun14_kanit.txt
>    ```
> 9. Gün 10 kaydında derleme ve elle test izleri. Satırlar 200 karakterde kesilir:
>    ```
>    { echo "=== 6 gun10 kaydi ==="; grep -n -i -E "build|derle|eventsource|401|offline|currentPeriodEnd|iki pencere" prompt_cevap/gun_10_prompt_cevap.md | cut -c1-200; } >> ~/Desktop/gun14_kanit.txt
>    ```
> 10. Gün 11 başlığındaki boşluklar. Boşluklar `·` olarak görünür:
>     ```
>     { echo "=== 7 Parca B basligi ==="; grep -n "Parça B kararları" docs/02_ADR.md | sed 's/ /·/g'; } >> ~/Desktop/gun14_kanit.txt
>     ```
> 11. Daha geniş bir yer tutucu araması. Senin listende olmayanları da yakalar:
>     ```
>     { echo "=== 8 genis arama ==="; git --no-pager grep -n -E "\[(Tarih|doldur|örn\.[^]]*|SONUÇ[^]]*|sonuç yazılacak)\]" -- README.md docs | cut -c1-160; } >> ~/Desktop/gun14_kanit.txt
>     ```
> 12. Prompt Günlüğü'nün tur bölümleri. Senin gözlemlerini doğru yere yerleştirmem için:
>     ```
>     { echo "=== 9 Prompt Gunlugu 13-157 ==="; cat -n docs/03_Prompt_Gunlugu.md | sed -n '13,157p'; } >> ~/Desktop/gun14_kanit.txt
>     ```
>
> Ayrıca iki şeye tarayıcıdan bakman gerekiyor:
> - **Render panelinde servisin Events bölümü:** 24 Ekim'deki Gün 10 birleşmesinin dağıtım durumu ("Deploy live" mı, "failed" mı) ve tarihi.
> - **GitHub Security log:** "made public" ya da `repo.access` kaydının tarihi.
>
> `gun14_kanit.txt` dosyasını, bu iki bilgiyi ve C tablosundaki gözlemlerini getir. A ve B maddelerinin metinlerini editörde yapıştıracağın bloklar hâlinde yazacağım.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **Pickaxe ve dosya adı:** `--follow` ile `-S` birlikte, dosya adı değişmişse bile çoğu durumda çalışır. 3. ve 4. bölümler boş gelirse dosya eski bir adla eklenmiş olabilir. O durumda komutu dosya adı olmadan tekrar veririm.
> - **Arayüz adları:** GitHub Security log'un 90 günlük saklama süresini ve Render'daki "Events" adını genel bilgiden söylüyorum. Arayüz farklıysa ekranda ne gördüğünü yaz.
> - **Commit tarihi ve karar tarihi:** "Değişiklik geçmişi"ndeki tarihi kararın ADR'ye yazıldığı gün olarak yorumluyorum. Kararın kendisi daha önce verilmiş olabilir. Bunu süreç notunda belirteceğim.
> - **Gün 10 bilinen sınır cümlesi:** Bu cümlenin hâlâ köşeli parantezli olup olmadığını bilmiyorum. Senin listende görünmüyor. 5. bölüm bunu gösterecek.

### Prompt 14 · 25 Eki 2026 16:51

````text
Dosya ekte (gun14_kanit.txt). Ek bilgiler: (1) GitHub Security log: repo.access kaydı yok; repo.create kaydına göre abonetakip deposu 18 Ekim 2026'da oluşturuldu. (2) Render: Gün 10 SSE birleşmesinin (#35, commit 5f9a45e) dağıtımı 24 Ekim 2026 saat 10:16'da (GMT+3) başarıyla tamamlandı, süre 1m10s, Auto-Deploy. Bu, ADR'deki npm run build satırı için kanıt; yerel build çıktısı o gün kaydedilmedi. (3) Prompt Günlüğü gözlemlerini ayrıca yazacağım. Önce kanıt dosyasından hangi yer tutucuların kesin kaynağı bulundu, hangileri bulunamadı, onu listele. Sonra ADR için yapıştırılacak metinleri ver. Tahmin yazma; kaynağı olmayan yerlere dürüst cümle yaz.
````

_[ek dosya: gun14_kanit.txt]_

### Claude cevabı 14 · 25 Eki 2026 16:52

> Kanıt dosyasını inceledim. Kısaca: bir kısmının kesin kaynağı var, altı test sonucunun kaynağı ise henüz doğrulanmış değil.
>
> ## 1. Kaynak durumu
>
> | Yer | Durum | Kaynak |
> |---|---|---|
> | ADR 56, İlk sürüm | **Kesin** | ADR'nin depoya ilk girdiği commit: `0e809a1`, 18 Ekim 2026 |
> | ADR 57, Neon'a geçiş | **Kısmen.** Satırın tarihi kesin, kararın kendi tarihi değil. | Satır ilk commit'te zaten vardı. Karar depo açılmadan önce, planlamada verilmiş. Ayrı bir tarihi kaydedilmemiş. |
> | ADR 58, Depo herkese açık | **Kısmen.** Satırın tarihi kesin, görünürlük değişikliği kaydı yok. | Satır ilk commit'te var. GitHub kayıtlarında `repo.create` 18 Ekim 2026, `repo.access` kaydı yok. |
> | ADR 659, `npm run build` | **Kesin, Render üzerinden.** Yerel çıktı kaydedilmemiş. | Render Events: #35 (`5f9a45e`), 24 Ekim 2026 10:16, başarılı. Render derlemesi `npm run build` çalıştırıyor (README, Mimari özet). |
> | ADR 746-751, altı sonuç | **Aday kaynak var, henüz doğrulanmadı** | Aşağıda açıklıyorum. |
> | ADR 756-757, köşeli parantezli cümle | **Yer tutucu değil, doğru bir ifade** | Cümle "Render'da denenmedi" diyor ve bu doğru. Yalnızca köşeli parantezler kaldırılır. |
> | ADR 895, Parça B başlığı | **Kesin** | Başta iki boşluk var (`··###`). Silinecek. |
> | Kurulum rehberi 228-233, `[örn. …]` | **Dokunulmaz** | Bunlar 225. satırdaki "Hata şablonu"nun bilerek bırakılmış doldurma alanları. |
> | Prompt Günlüğü 8, 9, 14 `[doldur]` ve 151-156'daki 24 boş `[ ]` kutusu | **Senin gözlemin** | Kutular senin listende yoktu. Onlar da tur gözlemi, aynı turda doldurulmalı ya da dürüstçe açıklanmalı. |
>
> **746-751 neden doğrulanmadı?** Gün 10 kaydının 3049-3054. satırlarında altı sonucun dolu bir hâli var. Örneğin "uyarı A'nın iki penceresinde sayfa yenilenmeden göründü". Ama bu satırlar `>` ile başlıyor, yani **yapay zekânın cevabından**. Hemen önceki satırlar da (3035-3040) yapay zekânın talimatı.
>
> Bu metin iki türlü oluşmuş olabilir:
> - Senin bildirdiğin sonuçların yapay zekâ tarafından yazıya geçirilmiş hâli.
> - Yapay zekânın sonuçları önceden varsayarak yazdığı bir taslak.
>
> Aynı şüphe 3111. satır için de geçerli ("`npm run build` başarılı"). Hemen ardından gelen 3117. satır senden "başarılı / hata" sonucunu soruyor. Bu, 3111'in bir taslak olduğunu düşündürüyor. Ayrıca ADR'de yer tutucular hâlâ duruyor, yani bu dolu metin hiç yapıştırılmamış.
>
> Bu yüzden bu satırları kanıt saymadan önce **senin kendi mesajını** görmem gerekiyor. B pencereleriyle ilgili sonuç satırı (3050) da arama çıktısına düşmemiş.
>
> Bu komut, Gün 10 kaydının ilgili aralığını satır numaralarıyla masaüstüne yazar. Hiçbir dosyayı değiştirmez:
>
> ```
> { echo "=== gun10 2985-3060 ==="; cat -n prompt_cevap/gun_10_prompt_cevap.md | sed -n '2985,3060p' | cut -c1-300; } > ~/Desktop/gun14_kanit2.txt
> ```
>
> Senin mesajında altı sonucun her biri açıkça yazıyorsa, ADR'ye onları yazarız. Yazmıyorsa ya da yalnızca yapay zekânın taslağı varsa, şu cümleyi yazarız: "ayrıntılı sonuç kaydedilmedi". 746-751 için metni bu çıktıdan sonra vereceğim.
>
> ## 2. ADR için hemen uygulanabilecekler (editörde, Cmd+F ile)
>
> Önce doğru dalda olduğunu kontrol et. Çıktı `gun14-belge-yertutucular` olmalı:
>
> ```
> git branch --show-current
> ```
>
> Sonra `docs/02_ADR.md` dosyasını VS Code'da aç.
>
> **a) Değişiklik geçmişi tarihleri (56-58).** Cmd+Option+F ile bul-değiştir kutusunu aç.
> - Bul: `| [Tarih] |`
> - Değiştir: `| 18 Ekim 2026 |`
> - "Tümünü değiştir" düğmesine bas. Kutuda **3 sonuç** görünmeli.
>
> **b) Değişiklik geçmişinin altına not.** 59. satırın (`| 24 Ekim 2026 | Gün 12 …`) sonuna git. Enter'a iki kez bas, böylece tablo ile not arasında bir boş satır kalır. Şunu yapıştır:
>
> ```markdown
> **Not (25 Ekim 2026):** İlk üç satır, ADR'nin depoya ilk girdiği commit'te (`0e809a1`, 18 Ekim 2026) zaten
> vardı. Bu kararlar depo açılmadan, planlama sırasında verildi; ayrı tarihleri kaydedilmediği için tarih olarak
> ADR'nin depoya girdiği gün yazıldı. GitHub güvenlik kaydında deponun oluşturulma tarihi (`repo.create`)
> 18 Ekim 2026'dır ve görünürlük değişikliği (`repo.access`) kaydı yoktur.
> ```
>
> Notun altında, `## Gün 2 kararları` başlığından önce bir boş satır kalmalı.
>
> **c) Gün 10 derleme sonucu (659).**
> - Bul: `` `npm run build` [sonuç yazılacak]. ``
> - Değiştir: `` `npm run build` yerel sonucu o gün kaydedilmedi; birleşmeden sonraki Render dağıtımı (Auto-Deploy, `npm run build` dahil) 24 Ekim 2026 10:16'da başarıyla tamamlandı (Render Events). ``
>
> **d) Gün 10 bilinen sınır cümlesi (756-757).** İki ayrı bul-değiştir:
> - Bul: `[Açık bir SSE bağlantısının`, değiştir: `Açık bir SSE bağlantısının`
> - Bul: `Render'da denenmedi.]`, değiştir: `Render'da denenmedi.`
>
> Kaydet: Cmd+S.
>
> **e) Parça B başlığındaki iki boşluk (895).** Bu komut, yalnızca bu başlığın başındaki iki boşluğu siler:
>
> ```
> perl -pi -e 's/^  (### Parça B kararları)/$1/' docs/02_ADR.md
> ```
>
> ## 3. Kontrol (her komut tek satır)
>
> 1. Başlığın artık `###` ile başladığını gösterir. Çıktı `895:###·Parça·B…` olmalı:
>    ```
>    grep -n "Parça B kararları" docs/02_ADR.md | sed 's/ /·/g'
>    ```
> 2. Kapatılan yer tutucuların kalmadığını kontrol eder. **Hiç çıktı vermemeli:**
>    ```
>    git --no-pager grep -n -E "\[Tarih\]|\[sonuç yazılacak\]|\[Açık bir SSE" -- docs/02_ADR.md
>    ```
> 3. ADR'de kalan yer tutucuları listeler. Yalnızca 746-751'deki altı `[SONUÇ: …]` satırı görünmeli:
>    ```
>    git --no-pager grep -n -E "\[(SONUÇ|Tarih|doldur)" -- docs/02_ADR.md | cut -c1-80
>    ```
> 4. Değişen satır sayısını gösterir:
>    ```
>    git --no-pager diff --stat docs/02_ADR.md
>    ```
>    Beklenti yaklaşık şöyle: 6 satır değişmiş (3 tarih, 659, 756, 757) ve başlıkta 1 satır değişmiş, ayrıca not için 5 satır eklenmiş.
>
> Sonuçları ve `gun14_kanit2.txt` dosyasını getir. Prompt Günlüğü gözlemlerini de yazarken 151-156'daki kutuları unutma: her tur için hangi kutuların işaretleneceğini de söyle.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **Satır 58'in metni:** Satır "herkese açık (public) yapıldı" diyor. Kayıtlarda görünürlük değişikliği olmadığı için depo büyük olasılıkla açık olarak oluşturuldu. Bunu nota çıkarım olarak yazmadım, yalnızca kayıttaki iki gerçeği yazdım. Satırın kendi metnini değiştirmedim, çünkü o günkü kaydın ifadesi.
> - **GitHub kayıt süresi:** GitHub güvenlik kaydının 90 gün tutulduğunu genel bilgiden söylüyorum. Depo 7 günlük olduğu için bu süre deponun bütün ömrünü kapsıyor olmalı.
> - **"`npm run build` dahil" ifadesi:** README'deki "Render derlemesi `npx prisma generate` ve `npm run build` yapar" cümlesine dayanıyor. Render ayarlarında build komutunu ayrıca görmedim. İstersen Render'da Settings → Build Command alanına bakıp doğrulayabilirsin.

### Prompt 15 · 25 Eki 2026 17:00

````text
Dosya ekte (gun14_kanit2.txt). ADR adımları tamam: tarihler, derleme sonucu, SSE cümlesi, tarih notu ve başlık düzeltmesi yapıldı; kalan yer tutucu yalnızca 752-757'deki altı [SONUÇ: …] satırı. Bu aralıkta benim kendi mesajlarım hangileri, yapay zekâ cevabı hangileri? Altı sonucun her biri benim mesajımda açıkça yazıyorsa ADR'ye onları yaz. Yalnızca yapay zekânın taslağı varsa ya da belirsizse "ayrıntılı sonuç kaydedilmedi" yaz. Metni editörde yapıştırmam için ver; satır numaralarını 752-757 olarak kullan.
````

_[ek dosya: gun14_kanit2.txt]_

### Claude cevabı 15 · 25 Eki 2026 17:01

> ## Bu aralıkta kim ne yazmış?
>
> Kayıtta **senin mesajların** `### Prompt` başlığı altında, `text` kod bloğu içinde. **Yapay zekânın cevapları** `### Claude cevabı` başlığı altında ve satırları `>` ile başlıyor.
>
> | Satırlar | Kimin | İçerik |
> |---|---|---|
> | 2985-2993 | Yapay zekâ (önceki cevabın sonu) | Test talimatları. 2991'de senden her madde için "oldu / olmadı" istiyor. |
> | 2998 (Prompt 22, 09:48) | **Sen** | Testleri canlı sitede mi, yerelde mi yapacağını soruyorsun. Sonuç yok. |
> | 3003-3011 (Cevap 21) | Yapay zekâ | "Yerel sitede" cevabı. |
> | 3016 (Prompt 23, 10:06) | **Sen** | **"her şey olması gerektiği gibi"**. Bu, aralıktaki tek sonuç ifadesi. |
> | 3021-3060 (Cevap 22) | Yapay zekâ | 3021'de "Tüm maddeleri geçmiş sayıyorum" diyor. 3049-3055'teki ayrıntılı sonuç maddeleri **yapay zekânın taslağı**. |
>
> **Sonuç:** Altı sonuçtan hiçbiri senin mesajında madde bazında yazmıyor. Senin mesajında yalnızca genel bir onay var.
>
> Taslaktaki ayrıntılar senin söylemediğin şeyler. Örneğin:
> - iptalin A finance penceresinden yapıldığı,
> - başlıkların değerleri,
> - "giriş sayfasında bant görünmedi",
> - 429 denemesinin atlandığı.
>
> Bu yüzden altı satıra "ayrıntılı sonuç kaydedilmedi" yazılacak. Senin genel onayın ise ayrı bir notta, kendi sözlerinle ve saatiyle kayda geçecek. Böylece hem bir şey uydurmuyoruz, hem de var olan kaydı yok saymıyoruz.
>
> ## ADR'ye yapıştırılacak metin (752-757)
>
> 1. `docs/02_ADR.md` dosyasını aç.
> 2. 752. satırın numarasına tıkla, Shift'e basılı tutarak 757. satırın numarasına tıkla. Altı `[SONUÇ: …]` satırı seçili olmalı.
> 3. Seçili alanın yerine aşağıdaki bloğu yapıştır.
> 4. Bloğun altında, `### Bilinen sınırlar` başlığından önce **bir boş satır** kaldığını kontrol et. Kaydet: Cmd+S.
>
> ```markdown
> - Aynı firmada iptal, uyarı A'nın iki penceresinde görünüyor mu: ayrıntılı sonuç kaydedilmedi.
> - B pencerelerinde uyarı görünmüyor mu, ters yönde de: ayrıntılı sonuç kaydedilmedi.
> - `events` isteği türü `eventsource`, üç başlık görünüyor mu: ayrıntılı sonuç kaydedilmedi.
> - Çıkış yapılmış pencerede `/api/events` 401 mi: ayrıntılı sonuç kaydedilmedi.
> - Sunucu yeniden başlatma ve "Offline" denemesinde hata ekranı çıkmadı mı, yeni uyarı ulaştı mı: ayrıntılı sonuç kaydedilmedi.
> - Neon SQL Editor'de tek kaydın `currentPeriodEnd` değeri güncellenerek riskli liste ve "Süresi geçmiş" etiketi: ayrıntılı sonuç kaydedilmedi.
>
> **Not (25 Ekim 2026):** Gün 10 sohbetinde bu adımlar için madde bazında sonuç yazılmadı. Geliştirici
> yalnızca genel bir onay verdi ("her şey olması gerektiği gibi", 24 Ekim 2026 10:06). Yapay zekânın bu
> onaydan sonra hazırladığı ayrıntılı sonuç taslağı geliştiricinin gözlemi olmadığı için kullanılmadı;
> sonuçlar sonradan tahminle doldurulmadı.
> ```
>
> ## Kontrol (her komut tek satır)
>
> 1. ADR'de yer tutucu kalmadığını kontrol eder. **Hiç çıktı vermemeli:**
>    ```
>    git --no-pager grep -n -E "\[(SONUÇ|Tarih|doldur|sonuç yazılacak)" -- docs/02_ADR.md
>    ```
> 2. Not ile başlık arasında boş satır olduğunu gösterir. Nottan sonra boş bir satır, ardından `### Bilinen sınırlar` görünmeli:
>    ```
>    grep -n -B 2 "^### Bilinen sınırlar" docs/02_ADR.md | sed -n '/kaydedilmedi\|tahminle/,+3p' | cut -c1-60
>    ```
> 3. Bütün belgelerde kalan yer tutucuları listeler. Yalnızca Prompt Günlüğü satırları ve kurulum rehberindeki hata şablonu (228-233) görünmeli:
>    ```
>    git --no-pager grep -n -E "\[(Tarih|doldur|örn\.[^]]*|SONUÇ[^]]*|sonuç yazılacak)\]" -- README.md docs | cut -c1-70
>    ```
>
> Sırada Prompt Günlüğü var. Gözlemlerini yazarken şunları ekle:
> - 8. satırdaki araç ve model,
> - 9. satırdaki tarih,
> - dört bölümün çıktı özeti ve değerlendirmesi,
> - dört sonuç notu,
> - 151-156'daki kontrol tablosunda her tur için işaretlenecek kutular.
>
> Etkinlik çalıştırılmadıysa ya da çıktılar saklanmadıysa onu da söyle, dürüst cümleyle yazarız.
>
> ## Varsayımlar ve emin olmadığım yerler
>
> - **"her şey olması gerektiği gibi":** Bu cümleyi, hemen önceki cevapta istenen maddelere (1-5, kırmızı ve sarı rozet) verilmiş genel bir yanıt olarak yorumluyorum. Hangi maddeleri kapsadığını kendisi söylemiyor. Bu yüzden ADR'de onu yalnızca "genel onay" olarak andım.
> - **401 kanıtı:** Gün 10 kaydının 1271. ve 1300. satırlarında `>` olmadan bir `HTTP/1.1 401 Unauthorized` çıktısı var. Bu senin yapıştırdığın `curl` çıktısı olabilir. Ama ADR'nin Durum satırı çerezsiz isteğin 401 döndüğünü zaten yazıyor, üstelik bu, tarayıcıdaki "çıkış yapılmış pencere" testinden farklı bir test. Bu yüzden 749'a kanıt olarak eklemedim.
> - **2. kontrol komutu:** Bu komut düzeni kabaca gösterir. Çıktısı karışık görünürse VS Code'da 760. satır civarına bakman yeterli.

### Prompt 16 · 25 Eki 2026 17:04

_[ek dosya: gun14_gunluk.txt]_

### Claude cevabı 16 · 25 Eki 2026 17:04

> Gönderdiğin dosya, Prompt Günlüğü'nün şu anki hâli (1-165). Senin gözlemlerin henüz bu dosyada yok. Ben bu alanları kendim doldurmayacağım, çünkü dosyanın 4. satırındaki kural bunların senin gözlemlerinle doldurulmasını istiyor. Dosyaya henüz dokunmuyorum.
>
> ## Önce: etkinliğin kaydı var mı?
>
> Bu komut, prompt ve cevap kayıtlarında üç turluk etkinliğin izini arar: Başlangıç promptunun metni ve tur başlıkları. Hiçbir dosyayı değiştirmez:
>
> ```
> grep -n -i -E "Bana bir abonelik takip|Tur 1|Tur 2|Tur 3|Blok 6" prompt_cevap/*.md | cut -c1-160
> ```
>
> Ne çıkarsa ona göre ilerleriz:
> - **Kayıt varsa:** Hangi gün ve hangi saatte yapıldığı belli olur. Bu, 9. satırdaki tarih için kaynak olur. Çıktıları okuyup kendi gözlemlerini yazabilirsin.
> - **Kayıt yoksa:** Etkinlik büyük olasılıkla bu belgede ayrıca çalıştırılmadı. O zaman aşağıdaki B seçeneği daha dürüst olur.
>
> ## Senden gereken: A ya da B
>
> **A) Etkinliği çalıştırdıysan**, aşağıdaki şablonu doldurup gönder. Kısa cümleler yeterli, ben yalnızca imla ve biçim düzeltip yerleştiririm.
>
> ```
> 8  Araç ve model:
> 9  Tarih:
>
> Başlangıç  Çıktı özeti:
>            Değerlendirme:
> Tur 1      Çıktı özeti:
>            Değerlendirme:
> Tur 2      Çıktı özeti:
>            Değerlendirme:
> Tur 3      Çıktı özeti:
>            Değerlendirme:
>
> Kontrol tablosu (her satır için 4 sütun, işaretli olanlara x yaz;
> sıra: Başlangıç, Tur 1, Tur 2, Tur 3):
> 151 Her satırı açıklayabiliyorum:
> 152 Modelin varsayımları doğru:
> 153 Önerilen paketler gerçekten var:
> 154 Yetki ve tenant kontrolleri yerinde:
> 155 Çalıştırıp test ettim:
> 156 Prompt Günlüğüne kaydettim:
>
> 160 En çok değişen tur:
> 161 En fazla fark yaratan bileşen:
> 162 Yanlış çıkan varsayım:
> 163 Kullanılan teknikler:
> ```
>
> **B) Etkinliği çalıştırmadıysan ya da çıktıları saklamadıysan**, alanlar dürüstçe şöyle doldurulur:
> - Tur alanlarına: "Bu tur çalıştırılmadı / çıktı saklanmadı." Hangisi doğruysa o yazılır.
> - Kontrol tablosu boş bırakılır. Altına tek satırlık bir not eklenir.
> - Sonuç notlarının yerine proje boyunca gözlediğin şeyleri yazarsın. Örneğin, altı bileşenli günlük promptlarda kısıtların ve "önce plan" kuralının yarattığı fark.
>
> B'yi seçersen, sonuç notları için kendi gözlemlerini yine senden isteyeceğim. Ama ek kayıtlar tablosundaki Gün 1-14 satırlarından bazı örnekleri sana hatırlatıcı olarak gösterebilirim. Tablodaki "AI çıktısını değiştirdim mi?" sütunu bunun için iyi bir kaynak.
>
> Arama sonucunu ve A ya da B seçimini gönder, metni editörde yapıştıracağın blok olarak hazırlayayım.


## Etkinlik: Başlangıç promptu

_Prompt Günlüğü etkinliği, Başlangıç promptu (yeni sohbet)._

### Prompt 1 · 25 Eki 2026 17:08

`````text
````markdown
## Başlangıç promptu

```
Bana bir abonelik takip uygulaması yap.
```

**Gözlenecekler:** Model çok kiracılı yapıyı kendiliğinden kurdu mu? Hangi teknolojiyi varsaydı? Rol ve yetki var mı? Metrik formülleri var mı?

**Çıktı özeti:** [doldur]

**Değerlendirme:** [doldur]
````
`````

### Claude cevabı 1 · 25 Eki 2026 17:09

> Bu, bir prompt değerlendirme şablonu gibi görünüyor. "Çıktı özeti" ve "Değerlendirme" alanları boş, ama hangi çıktıyı değerlendireceğimizi bilmiyorum. Ne yapmamı istediğinize göre ilerleyeyim:
>
> 1. **Test edilen model olayım:** "Bana bir abonelik takip uygulaması yap." promptunu sıfırdan alıp uygulamayı gerçekten yaparım. Siz de çok kiracılık, teknoloji varsayımı, rol/yetki ve metrik formüllerini çıktı üzerinden gözlemlersiniz. Ek bağlam vermeyeceğim ki test temiz kalsın.
> 2. **Değerlendirici olayım:** Başka bir modelin (ya da benim önceki bir oturumumun) çıktısını buraya yapıştırırsınız, ben de iki alanı doldururum.
> 3. **İkisi birden:** Önce uygulamayı yaparım, sonra şablonu doldururum. Yalnız bu durumda kendi çıktımı kendim puanlamış olurum, bu da değerlendirmeyi yanlı yapabilir.
>
> Hangisi?

### Prompt 2 · 25 Eki 2026 17:17

````text
1
````

### Claude cevabı 2 · 25 Eki 2026 17:17

> Kişisel abonelik takip uygulamasını tek sayfalık bir web uygulaması olarak hazırlıyorum.
> **Abonelik Defteri** hazır. Kişisel bir abonelik takip sayfası: abonelik ekleyip düzenleyebiliyor, silebiliyorsunuz, toplamları ve yaklaşan ödemeleri görüyorsunuz.
>
> - **Özet şeridi:** Aylık toplam, yıllık toplam, önümüzdeki 30 günün ödemeleri ve aktif abonelik sayısı.
> - **Aylık karşılık hesabı:** Haftalık ödemeler × 52/12, 3 aylıklar ÷ 3, yıllıklar ÷ 12 ile aylığa çevriliyor. Toplamlara yalnızca "Aktif" ve "Deneme" durumundakiler giriyor; duraklatılan ve iptal edilenler girmiyor.
> - **Para birimleri:** TRY, USD ve EUR destekleniyor. Döviz cinsinden abonelikler, "Döviz kurları" bölümüne sizin girdiğiniz kurla TL'ye çevriliyor. Varsayılan kurlar yaklaşık değerler, güncellemeniz gerekebilir.
> - **Tarihler:** Sonraki ödeme tarihi geçmişte kalırsa, ödeme sıklığına göre otomatik olarak ileri alınıyor. Önümüzdeki 3 gün içindeki ödemeler vurgulanıyor.
> - **Kategoriler:** Aylık harcamanın kategorilere göre dağılımı gösteriliyor. Liste aranabiliyor, duruma göre süzülebiliyor ve sıralanabiliyor.
> - **Saklama:** Kayıtlar hesabınıza özel saklanıyor; sayfayı paylaştığınız kişiler sizin kayıtlarınızı göremiyor. Sayfa ilk açıldığında boş geliyor, "Örnek kayıtları yükle" düğmesiyle denemelik veri ekleyebilirsiniz.
>
> Script'in sözdizimini kontrol ettim. Kayıt ekleme ve okumayı canlı sayfada denemedim, çünkü kayıtlarınız yalnızca sizin hesabınızdan görülebiliyor.


## Etkinlik: Tur 1 (Rol ve bağlam)

_Prompt Günlüğü etkinliği, Tur 1 (yeni sohbet)._

### Prompt 1 · 25 Eki 2026 17:09

`````text
````markdown
## Tur 1: Rol ve bağlam ekleme

**Eklenen bileşenler:** Rol, Bağlam

```
[Rol] Next.js, TypeScript ve PostgreSQL konusunda deneyimli, çok kiracılı
SaaS ürünleri geliştirmiş kıdemli bir yazılım geliştiricisi olarak davran.
Açıklamaları Türkçe yap.

[Bağlam] Küçük yazılım firmalarının müşteri aboneliklerini ve gelirini takip
etmesini sağlayan "AboneTakip" adlı bir SaaS ürünü geliştiriyorum. Ürünü
kullanan her firma bir kiracıdır ve yalnızca kendi verisini görmelidir.
Kullanıcı rolleri: manager (firma sahibi) ve finance (finans çalışanı).
Ürün; müşteri, plan ve abonelik kayıtlarını tutacak, MRR, churn, LTV ve
LTV/CAC metriklerini gösterecek. Tek geliştiriciyim ve 2 haftam var.

[Görev] Bu ürün için veri modelini tasarla.
```

**Gözlenecekler:** `tenant_id` tüm tablolarda var mı? Roller modelde yer aldı mı? Gereksiz tablo veya mikroservis önerisi geldi mi?

**Çıktı özeti:** [doldur]

**Değerlendirme:** [doldur]

````
`````

### Claude cevabı 1 · 25 Eki 2026 17:10

> # AboneTakip: Veri Modeli
>
> İki haftalık, tek geliştiricili bir proje için hedef şu: **bir Next.js uygulaması ve bir PostgreSQL veritabanı**, 7 tablo, ayrı servis yok. Kiracı izolasyonu veritabanı seviyesinde garanti altına alınıyor. Metrikler ayrı tablolarda tutulmuyor, sorgularla hesaplanıyor.
>
> ## Tablolar
>
> | Tablo | Amaç |
> |---|---|
> | `tenants` | Ürünü kullanan firmalar |
> | `users` | Firma kullanıcıları ve rolleri (manager / finance) |
> | `customers` | Firmanın kendi müşterileri |
> | `plans` | Firmanın sattığı planlar |
> | `subscriptions` | Aboneliğin **şu anki** durumu |
> | `subscription_events` | MRR değişim geçmişi (yeni, artış, azalış, churn, geri dönüş) |
> | `acquisition_costs` | Aylık müşteri edinme harcaması (CAC için) |
>
> ## Şema (PostgreSQL)
>
> ```sql
> CREATE TYPE user_role           AS ENUM ('manager', 'finance');
> CREATE TYPE billing_interval    AS ENUM ('month', 'year');
> CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'canceled');
> CREATE TYPE mrr_event_type      AS ENUM ('new', 'expansion', 'contraction', 'churn', 'reactivation');
>
> CREATE TABLE tenants (
>   id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
>   name        text NOT NULL,
>   currency    char(3) NOT NULL DEFAULT 'TRY',   -- kiracı başına tek para birimi
>   created_at  timestamptz NOT NULL DEFAULT now()
> );
>
> CREATE TABLE users (
>   id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
>   tenant_id     uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
>   email         text NOT NULL,
>   name          text NOT NULL,
>   role          user_role NOT NULL,
>   password_hash text,                            -- harici auth kullanılırsa NULL kalır
>   created_at    timestamptz NOT NULL DEFAULT now(),
>   UNIQUE (tenant_id, id)
> );
> CREATE UNIQUE INDEX users_email_uq ON users (lower(email));
>
> CREATE TABLE customers (
>   id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
>   tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
>   name         text NOT NULL,
>   email        text,
>   company_name text,
>   acquired_at  date NOT NULL DEFAULT current_date,
>   created_at   timestamptz NOT NULL DEFAULT now(),
>   UNIQUE (tenant_id, id)
> );
>
> CREATE TABLE plans (
>   id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
>   tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
>   name        text NOT NULL,
>   price_cents bigint NOT NULL CHECK (price_cents >= 0),
>   interval    billing_interval NOT NULL,
>   is_active   boolean NOT NULL DEFAULT true,
>   created_at  timestamptz NOT NULL DEFAULT now(),
>   UNIQUE (tenant_id, id),
>   UNIQUE (tenant_id, name)
> );
>
> CREATE TABLE subscriptions (
>   id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
>   tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
>   customer_id  uuid NOT NULL,
>   plan_id      uuid NOT NULL,
>   status       subscription_status NOT NULL,
>   quantity     int NOT NULL DEFAULT 1 CHECK (quantity > 0),
>   mrr_cents    bigint NOT NULL CHECK (mrr_cents >= 0),  -- aylığa normalize, anlık kopya
>   started_at   date NOT NULL,
>   canceled_at  date,
>   created_at   timestamptz NOT NULL DEFAULT now(),
>   UNIQUE (tenant_id, id),
>   FOREIGN KEY (tenant_id, customer_id) REFERENCES customers (tenant_id, id),
>   FOREIGN KEY (tenant_id, plan_id)     REFERENCES plans (tenant_id, id)
> );
> CREATE INDEX ON subscriptions (tenant_id, status);
>
> CREATE TABLE subscription_events (
>   id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
>   tenant_id        uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
>   subscription_id  uuid NOT NULL,
>   customer_id      uuid NOT NULL,
>   type             mrr_event_type NOT NULL,
>   mrr_delta_cents  bigint NOT NULL,              -- churn'de negatif
>   effective_date   date NOT NULL,
>   created_by       uuid,
>   created_at       timestamptz NOT NULL DEFAULT now(),
>   FOREIGN KEY (tenant_id, subscription_id) REFERENCES subscriptions (tenant_id, id),
>   FOREIGN KEY (tenant_id, customer_id)     REFERENCES customers (tenant_id, id),
>   FOREIGN KEY (tenant_id, created_by)      REFERENCES users (tenant_id, id)
> );
> CREATE INDEX ON subscription_events (tenant_id, effective_date);
>
> CREATE TABLE acquisition_costs (
>   id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
>   tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
>   month        date NOT NULL CHECK (extract(day FROM month) = 1),
>   amount_cents bigint NOT NULL CHECK (amount_cents >= 0),
>   note         text,
>   UNIQUE (tenant_id, month)
> );
> ```
>
> ## Önemli tasarım kararları
>
> **1. Kiracı izolasyonu üç katmanda.** Her tabloda `tenant_id` var. Ayrıca bileşik yabancı anahtarlar `(tenant_id, id)` kullanılıyor; böylece A firmasının aboneliği, B firmasının müşterisine bağlanamaz. Bunu veritabanı engeller, kodda unutulan bir `WHERE` engellemez. Son katman olarak Row Level Security (RLS) var:
>
> ```sql
> ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
> ALTER TABLE customers FORCE ROW LEVEL SECURITY;
> CREATE POLICY tenant_isolation ON customers
>   USING      (tenant_id = current_setting('app.tenant_id')::uuid)
>   WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
> -- users hariç diğer tüm kiracı tablolarına aynı politika
> ```
>
> Uygulamada her istek bir transaction içinde `SELECT set_config('app.tenant_id', $1, true)` ile başlar. Uygulamanın veritabanı kullanıcısı tablo sahibi ya da superuser olmamalıdır. `users` tablosunu RLS dışında bırakın, çünkü girişte kiracı henüz bilinmiyor. O tablodaki sorguları kodda `tenant_id` ile filtreleyin.
>
> **2. Güncel durum ve geçmiş ayrı tutuluyor.** `subscriptions` aboneliğin bugünkü halini, `subscription_events` ise MRR'ın nasıl değiştiğini tutar. Plan değişikliği, iptal ve yeni abonelik gibi her işlem, aynı transaction içinde bir olay kaydı da yazar. Bunu tek bir servis fonksiyonundan yapın. Bu tablo olmadan "geçen ayın MRR'ı neydi?" sorusu güvenilir şekilde yanıtlanamaz.
>
> **3. Para tamsayı olarak tutuluyor.** Tutarlar `bigint` cinsinden kuruş olarak saklanıyor; float kullanılmıyor. `mrr_cents`, abonelik oluşturulduğunda hesaplanıp kaydediliyor (yıllık planlarda fiyat/12 × adet). Bu sayede planın fiyatı sonradan değişse de geçmiş MRR bozulmaz.
>
> ## Metrik hesapları (tablo değil, sorgu)
>
> | Metrik | Hesap |
> |---|---|
> | **MRR (D tarihinde)** | `SUM(mrr_delta_cents) WHERE effective_date <= D` |
> | **Müşteri churn (ay)** | Ay içindeki `churn` olayı sayısı / ay başındaki aktif müşteri sayısı |
> | **ARPA** | MRR / aktif müşteri sayısı |
> | **LTV** | ARPA / aylık churn oranı (churn 0 ise "hesaplanamaz" gösterin) |
> | **CAC (dönem)** | `acquisition_costs` toplamı / dönemde edinilen yeni müşteri sayısı |
> | **LTV/CAC** | LTV / CAC |
>
> Önce bu hesapları düz sorgu olarak yazın. Yavaşlarsa, örneğin günlük yenilenen bir materialized view ekleyin. İki hafta içinde buna büyük ihtimalle gerek kalmaz.
>
> ## Roller
>
> Rol kontrolü uygulama katmanında, server action ve route handler'larda yapılır. RLS yalnızca kiracı izolasyonu için kullanılır.
>
> | İşlem | manager | finance |
> |---|:-:|:-:|
> | Kullanıcı davet etme / rol değiştirme | ✓ | |
> | Plan oluşturma / düzenleme | ✓ | |
> | Müşteri ve abonelik yönetimi | ✓ | ✓ |
> | Edinme maliyeti girişi | ✓ | ✓ |
> | Metrikleri görüntüleme | ✓ | ✓ |
>
> ## Bilerek dışarıda bırakılanlar
>
> Fatura ve ödeme tahsilatı, çoklu para birimi, bir kullanıcının birden fazla firmaya üye olması (bunun için ileride `memberships` tablosu eklenir), denetim kaydı (audit log) ve mikroservisler bu modelde yok. Bunların hiçbiri iki haftalık MVP için gerekli değil. Şema, ileride bunları eklemeyi zorlaştırmayacak şekilde kuruldu.
>
> ---
>
> **Şablon için:**
>
> **Çıktı özeti:** 7 tablolu, tek PostgreSQL üzerinde bir model önerildi: tenants, users, customers, plans, subscriptions, subscription_events ve acquisition_costs. İzolasyon için `tenant_id`, bileşik FK ve RLS kullanıldı. Metrikler sorguyla hesaplanıyor. Kapsam dışı bırakılan konular açıkça belirtildi.
>
> **Gözlenenler:** `tenant_id`, `tenants` dışındaki tüm tablolarda var. Roller `users.role` enum'unda tanımlı ve bir yetki tablosu verildi. Mikroservis önerisi yok. Tartışmaya açık tek ek tablo `subscription_events`; gerekçesi geçmiş MRR ve churn hesabı.


## Etkinlik: Tur 2 (Kısıt ve format)

_Prompt Günlüğü etkinliği, Tur 2 (yeni sohbet)._

### Prompt 1 · 25 Eki 2026 17:09

`````text
````markdown
## Tur 2: Kısıt ve format ekleme

**Eklenen bileşenler:** Kısıtlar, Çıktı formatı (görev somutlaştırıldı)

```
[Rol] Next.js, TypeScript ve PostgreSQL konusunda deneyimli, çok kiracılı
SaaS ürünleri geliştirmiş kıdemli bir yazılım geliştiricisi olarak davran.
Açıklamaları Türkçe yap.

[Bağlam] "AboneTakip": küçük yazılım firmaları için çok kiracılı abonelik,
MRR ve churn takip SaaS'ı. Her müşteri firma bir kiracıdır. Roller: manager
ve finance. Tek geliştirici, 2 hafta süre. Tek Next.js uygulaması ve tek
PostgreSQL veritabanı kullanılacak. Kiracı ayrımı ortak tablolar ve
tenant_id ile yapılacak.

[Görev] Prisma ile veri şemasını tasarla. Tablolar: TENANTS, USERS,
CUSTOMERS, PLANS, SUBSCRIPTIONS, SUBSCRIPTION_EVENTS. Ardından aktif
kullanıcının tenant_id değerini her sorguya uygulayan merkezi bir
yardımcı fonksiyon yaz.

[Kısıtlar]
- TENANTS dışındaki her tabloda tenant_id zorunlu olsun.
- Tenant filtresi tek bir yardımcı fonksiyondan uygulansın, sorgularda
  elle tekrar yazılmasın.
- Bir firmanın kullanıcısı başka firmanın verisine hiçbir koşulda erişemesin.
- Mikroservis, ek katman veya gereksiz kütüphane ekleme.
- Para birimi tek (TL), ödeme entegrasyonu yok.
- Secret değerler koda yazılmasın, ortam değişkeninden okunsun.

[Format] Önce veri modelini ve tablo ilişkilerini kısaca açıkla, sonra
Prisma şemasını yaz, sonra yardımcı fonksiyonu yaz, en sonda tenant
izolasyonunu doğrulayacak üç test senaryosu öner.
```

**Gözlenecekler:** Çıktı istenen sırayı izledi mi? Kısıtlar ihlal edildi mi? Tenant yardımcısı gerçekten merkezi mi?

**Çıktı özeti:** [doldur]

**Değerlendirme:** [doldur]
````
`````

### Claude cevabı 1 · 25 Eki 2026 17:10

> ## 1. Veri modeli ve ilişkiler
>
> Her müşteri firma bir **Tenant** kaydıdır. Diğer beş tablonun hepsinde zorunlu `tenantId` vardır.
>
> - **Tenant → User (1:N):** Firmanın kullanıcılarıdır, rolleri `MANAGER` veya `FINANCE` olur. E-posta global olarak tekildir. Böylece giriş sırasında kullanıcının hangi kiracıya ait olduğu e-postadan bulunur.
> - **Tenant → Customer (1:N):** Firmanın kendi abonelik müşterileridir.
> - **Tenant → Plan (1:N):** Firmanın sattığı planlardır. Fiyat `Int` olarak **kuruş** cinsinden tutulur. Tek para birimi (TL) olduğu için para birimi kolonu yoktur ve float yuvarlama hatası oluşmaz.
> - **Customer + Plan → Subscription (N:1, N:1):** Bir müşterinin bir plana aboneliğidir. `mrrKurus`, aylığa normalize edilmiş tutardır (yıllık planlarda fiyat/12). Böylece MRR tek bir `SUM` ile hesaplanır.
> - **Subscription → SubscriptionEvent (1:N):** Oluşturma, plan değişikliği, iptal ve yeniden aktivasyon olaylarıdır. `mrrDeltaKurus` alanı sayesinde MRR hareketi ve churn olaylardan hesaplanır.
>
> İzolasyon iki katmanda sağlanır:
>
> 1. **Uygulama katmanı:** Merkezi yardımcı, her sorguya `tenantId` ekler.
> 2. **Veritabanı katmanı:** Kiracı içi ilişkiler **bileşik yabancı anahtar** (`[tenantId, customerId] → Customer[tenantId, id]`) ile kurulur. Bir hata yardımcıyı atlatsa bile, A firmasının aboneliği B firmasının müşterisine veritabanı seviyesinde bağlanamaz.
>
> ## 2. Prisma şeması
>
> ```prisma
> // prisma/schema.prisma
> generator client {
>   provider = "prisma-client-js"
> }
>
> datasource db {
>   provider = "postgresql"
>   url      = env("DATABASE_URL") // secret koda yazılmaz
> }
>
> enum Role {
>   MANAGER
>   FINANCE
> }
>
> enum BillingInterval {
>   MONTHLY
>   YEARLY
> }
>
> enum SubscriptionStatus {
>   TRIALING
>   ACTIVE
>   CANCELED
> }
>
> enum SubscriptionEventType {
>   CREATED
>   PLAN_CHANGED
>   CANCELED
>   REACTIVATED
> }
>
> model Tenant {
>   id                 String              @id @default(cuid())
>   name               String
>   slug               String              @unique
>   createdAt          DateTime            @default(now())
>   users              User[]
>   customers          Customer[]
>   plans              Plan[]
>   subscriptions      Subscription[]
>   subscriptionEvents SubscriptionEvent[]
>
>   @@map("tenants")
> }
>
> model User {
>   id           String   @id @default(cuid())
>   tenantId     String
>   email        String   @unique
>   passwordHash String
>   name         String
>   role         Role
>   createdAt    DateTime @default(now())
>   tenant       Tenant   @relation(fields: [tenantId], references: [id])
>
>   @@index([tenantId])
>   @@map("users")
> }
>
> model Customer {
>   id            String         @id @default(cuid())
>   tenantId      String
>   name          String
>   email         String?
>   createdAt     DateTime       @default(now())
>   tenant        Tenant         @relation(fields: [tenantId], references: [id])
>   subscriptions Subscription[]
>
>   @@unique([tenantId, id])    // bileşik FK hedefi
>   @@unique([tenantId, email])
>   @@map("customers")
> }
>
> model Plan {
>   id            String          @id @default(cuid())
>   tenantId      String
>   name          String
>   priceKurus    Int
>   interval      BillingInterval
>   isActive      Boolean         @default(true)
>   createdAt     DateTime        @default(now())
>   tenant        Tenant          @relation(fields: [tenantId], references: [id])
>   subscriptions Subscription[]
>
>   @@unique([tenantId, id])
>   @@unique([tenantId, name])
>   @@map("plans")
> }
>
> model Subscription {
>   id         String              @id @default(cuid())
>   tenantId   String
>   customerId String
>   planId     String
>   status     SubscriptionStatus  @default(ACTIVE)
>   mrrKurus   Int
>   startedAt  DateTime
>   canceledAt DateTime?
>   createdAt  DateTime            @default(now())
>   updatedAt  DateTime            @updatedAt
>   tenant     Tenant              @relation(fields: [tenantId], references: [id])
>   customer   Customer            @relation(fields: [tenantId, customerId], references: [tenantId, id])
>   plan       Plan                @relation(fields: [tenantId, planId], references: [tenantId, id])
>   events     SubscriptionEvent[]
>
>   @@unique([tenantId, id])
>   @@index([tenantId, status])
>   @@index([tenantId, customerId])
>   @@map("subscriptions")
> }
>
> model SubscriptionEvent {
>   id             String                @id @default(cuid())
>   tenantId       String
>   subscriptionId String
>   type           SubscriptionEventType
>   mrrDeltaKurus  Int
>   occurredAt     DateTime              @default(now())
>   note           String?
>   tenant         Tenant                @relation(fields: [tenantId], references: [id])
>   subscription   Subscription          @relation(fields: [tenantId, subscriptionId], references: [tenantId, id])
>
>   @@index([tenantId, occurredAt])
>   @@index([tenantId, subscriptionId])
>   @@map("subscription_events")
> }
> ```
>
> ## 3. Merkezi tenant yardımcısı
>
> Ek kütüphane kullanılmaz. Yardımcı, Prisma'nın kendi Client Extension mekanizmasıyla yazılmıştır. Prisma 5+ gerektirir, çünkü `findUnique`/`update` gibi sorgularda `where` içine `tenantId` eklenebilmesi bu sürümle geldi.
>
> ```ts
> // src/lib/db.ts
> import { PrismaClient, Prisma } from "@prisma/client";
>
> const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
> const basePrisma = globalForPrisma.prisma ?? new PrismaClient();
> if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = basePrisma;
>
> const SCOPED_MODELS = new Set<string>([
>   "User", "Customer", "Plan", "Subscription", "SubscriptionEvent",
> ]);
>
> const WHERE_OPS = new Set<string>([
>   "findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow", "findMany",
>   "count", "aggregate", "groupBy",
>   "update", "updateMany", "upsert", "delete", "deleteMany",
> ]);
>
> const TENANT_ALLOWED_OPS = new Set<string>([
>   "findUnique", "findUniqueOrThrow", "findFirst", "update",
> ]);
>
> export function forTenant(tenantId: string) {
>   if (!tenantId) throw new Error("tenantId olmadan veritabanı erişimi yapılamaz");
>
>   return basePrisma.$extends({
>     name: "tenant-isolation",
>     query: {
>       $allModels: {
>         async $allOperations({ model, operation, args, query }) {
>           const a = (args ?? {}) as any;
>
>           // Tenant tablosu: yalnızca kendi kaydı, yalnızca okuma/güncelleme
>           if (model === "Tenant") {
>             if (!TENANT_ALLOWED_OPS.has(operation)) {
>               throw new Error(`Tenant üzerinde '${operation}' yasak`);
>             }
>             a.where = { ...a.where, id: tenantId };
>             return query(a);
>           }
>
>           // Bilinmeyen model: fail-closed
>           if (!SCOPED_MODELS.has(model)) {
>             throw new Error(`Kapsam dışı model: ${model}`);
>           }
>
>           // tenantId'yi değiştirme girişimi
>           if (["update", "updateMany", "upsert"].includes(operation)) {
>             const data = operation === "upsert" ? a.update : a.data;
>             if (data && "tenantId" in data) throw new Error("tenantId değiştirilemez");
>           }
>
>           if (WHERE_OPS.has(operation)) {
>             a.where = { ...a.where, tenantId }; // dışarıdan gelen tenantId ezilir
>           }
>           if (operation === "create") {
>             a.data = { ...a.data, tenantId };
>           }
>           if (operation === "upsert") {
>             a.create = { ...a.create, tenantId };
>           }
>           if (operation === "createMany" || operation === "createManyAndReturn") {
>             const rows = Array.isArray(a.data) ? a.data : [a.data];
>             a.data = rows.map((r: object) => ({ ...r, tenantId }));
>           }
>
>           return query(a);
>         },
>       },
>     },
>   });
> }
>
> export type TenantDb = ReturnType<typeof forTenant>;
>
> /** Yalnızca giriş akışında (e-postadan kullanıcı bulma) kullanılır. */
> export const systemDb = basePrisma;
> ```
>
> ```ts
> // src/lib/tenant-db.ts
> import { cache } from "react";
> import { forTenant } from "@/lib/db";
> import { getSession } from "@/lib/auth"; // projedeki mevcut oturum fonksiyonu
>
> /** Server Component, Route Handler ve Server Action'larda tek giriş noktası. */
> export const getTenantDb = cache(async () => {
>   const session = await getSession();
>   const tenantId = session?.user?.tenantId;
>   if (!tenantId) throw new Error("Yetkisiz erişim");
>   return forTenant(tenantId); // tenantId asla URL/body'den alınmaz, yalnızca oturumdan
> });
> ```
>
> Örnek kullanım. Sorgu kodunda `tenantId` hiç geçmez:
>
> ```ts
> const db = await getTenantDb();
> const mrr = await db.subscription.aggregate({
>   where: { status: "ACTIVE" },
>   _sum: { mrrKurus: true },
> });
> ```
>
> Notlar:
>
> - **Skaler yabancı anahtarlar:** Yazmalarda ilişkiler `customerId` ve `planId` gibi skaler alanlarla verilir, `connect` kullanılmaz. Yardımcı skaler `tenantId` eklediği için Prisma'nın "unchecked" girdi biçimi gerekir.
> - **`systemDb` sınırı:** `systemDb` yalnızca `auth` modülünde import edilmeli. Bunu ESLint'in yerleşik `no-restricted-imports` kuralıyla zorlamak ek kütüphane gerektirmez.
> - **Ham sorgular:** `$queryRaw` yardımcının kapsamı dışında kalır, bu projede kullanılmamalı.
>
> ## 4. Tenant izolasyonu için üç test senaryosu
>
> Her testte iki kiracı (A ve B) seed edilir. Her birinde müşteri, plan ve abonelik bulunur. Sonuçlar `systemDb` ile doğrulanır.
>
> 1. **Okuma izolasyonu**
>    - `forTenant(A).customer.findMany()` yalnızca A'nın müşterilerini döndürmeli.
>    - `forTenant(A).customer.findUnique({ where: { id: B_musteriId } })` `null` dönmeli.
>    - `where: { tenantId: B }` açıkça yazılsa bile sonuç boş olmalı, çünkü yardımcı bu değeri ezer.
>    - `count` ve `aggregate` sonuçlarına B'nin kayıtları karışmamalı.
>
> 2. **Yazma ve silme izolasyonu**
>    - `forTenant(A).subscription.update({ where: { id: B_abonelikId }, ... })` P2025 (kayıt bulunamadı) hatası vermeli.
>    - `updateMany` ve `deleteMany` ile B'nin kayıtları hedeflendiğinde `count: 0` dönmeli.
>    - `data: { tenantId: B }` ile güncelleme denemesi "tenantId değiştirilemez" hatası vermeli.
>    - Tüm bu denemelerden sonra B'nin kayıtları `systemDb` ile kontrol edildiğinde değişmemiş olmalı.
>
> 3. **İlişki üzerinden sızma**
>    - `forTenant(A).subscription.create({ data: { customerId: B_musteriId, planId: A_planId, ... } })` bileşik yabancı anahtar ihlaliyle (P2003) başarısız olmalı.
>    - `create` içinde `tenantId: B` gönderilirse kayıt yine A adına yazılmalı.
>    - Ek olarak, oturumunda `tenantId` olmayan bir isteğin `getTenantDb()` çağrısı "Yetkisiz erişim" hatası vermeli.


## Etkinlik: Tur 3 (Doğrulama)

_Prompt Günlüğü etkinliği, Tur 3 (yeni sohbet)._

### Prompt 1 · 25 Eki 2026 17:09

`````text
````markdown
## Tur 3: Doğrulama ekleme

**Eklenen bileşen:** Doğrulama (altı bileşenin hepsi)

```
[Rol] Next.js, TypeScript ve PostgreSQL konusunda deneyimli, çok kiracılı
SaaS ürünleri geliştirmiş kıdemli bir yazılım geliştiricisi olarak davran.
Açıklamaları Türkçe yap.

[Bağlam] "AboneTakip": küçük yazılım firmaları için çok kiracılı abonelik,
MRR ve churn takip SaaS'ı. Her müşteri firma bir kiracıdır. Roller: manager
ve finance. Tek geliştirici, 2 hafta süre. Tek Next.js uygulaması ve tek
PostgreSQL veritabanı. Kiracı ayrımı ortak tablolar ve tenant_id ile.
Metrik tanımlarım: MRR = aktif aboneliklerin aylık fiyat toplamı (yıllık
planlar 12'ye bölünür); churn = dönemde iptal edenler / dönem başındaki
aktif müşteriler.

[Görev] Prisma ile veri şemasını tasarla. Tablolar: TENANTS, USERS,
CUSTOMERS, PLANS, SUBSCRIPTIONS, SUBSCRIPTION_EVENTS. Ardından aktif
kullanıcının tenant_id değerini her sorguya uygulayan merkezi bir
yardımcı fonksiyon yaz.

[Kısıtlar]
- TENANTS dışındaki her tabloda tenant_id zorunlu olsun.
- Tenant filtresi tek bir yardımcı fonksiyondan uygulansın.
- Bir firmanın kullanıcısı başka firmanın verisine hiçbir koşulda erişemesin.
- Mikroservis, ek katman veya gereksiz kütüphane ekleme.
- Para birimi tek (TL), ödeme entegrasyonu yok.
- Secret değerler koda yazılmasın, ortam değişkeninden okunsun.

[Format] Önce veri modelini ve ilişkileri açıkla, sonra Prisma şemasını,
sonra yardımcı fonksiyonu yaz, en sonda tenant izolasyonunu doğrulayacak
üç test senaryosu öner.

[Doğrulama] Kodu yazmadan önce sırayla şunları düşün: (1) Hangi tablolar
etkilenir? (2) Hangi yetki ve tenant kontrolleri gerekir? (3) Hangi hata
durumları oluşabilir? Ardından yaptığın varsayımları listele. Emin
olmadığın bir Prisma sürümü, sözdizimi veya kütüphane bilgisi varsa
açıkça belirt. Var olduğundan emin olmadığın paket önerme.
```

**Gözlenecekler:** Varsayımlar listelendi mi? Emin olunmayan noktalar (örn. Prisma sürümüne bağlı sözdizimi) belirtildi mi? Yetki ve hata durumları cevaba yansıdı mı? Önerilen paketler gerçekten var mı (npmjs.com'da kontrol et)?

**Çıktı özeti:** [doldur]

**Değerlendirme:** [doldur]
````
`````

### Claude cevabı 1 · 25 Eki 2026 17:12

> ## 0. Kod öncesi doğrulama
>
> **(1) Etkilenen tablolar:** Altısı da etkileniyor. `TENANTS` kökte duruyor. `USERS`, `CUSTOMERS` ve `PLANS` doğrudan kiracıya bağlı. `SUBSCRIPTIONS` hem müşteriye hem plana bağlı. `SUBSCRIPTION_EVENTS` ise aboneliğe bağlı. En riskli tablolar `SUBSCRIPTIONS` ve `SUBSCRIPTION_EVENTS`, çünkü başka bir kiracının satırına referans verebilecek yabancı anahtarlar onlarda.
>
> **(2) Yetki ve tenant kontrolleri:**
> - `tenantId` hiçbir zaman istemciden (body, query, header) alınmamalı. Oturumdaki kullanıcı kimliğiyle veritabanından okunmalı.
> - Okuma, güncelleme ve silme işlemlerinde `where` koşuluna `tenantId` zorla eklenmeli. Oluşturma işlemlerinde `data` içine `tenantId` yazılmalı. Farklı bir `tenantId` gelirse işlem reddedilmeli. Güncellemede `tenantId` değiştirilememeli.
> - İlişkiler veritabanı seviyesinde kiracı içinde tutulmalı. Bunun için bileşik yabancı anahtar kullanılıyor: `(tenant_id, customer_id) → customers(tenant_id, id)`. Uygulama filtresi bir yerde atlansa bile A kiracısının aboneliği B'nin müşterisine bağlanamaz.
> - Rol kontrolü (manager / finance) tenant filtresinden ayrı bir katman olarak yapılmalı.
>
> **(3) Hata durumları:**
> - Oturum yoksa 401 dönülür.
> - Rol yetmiyorsa 403 dönülür.
> - Başka kiracının kaydı istenirse 404 dönülür, 403 değil. 403 dönmek kaydın var olduğunu sızdırır.
> - Başka kiracının ID'siyle ilişki kurulmaya çalışılırsa veritabanı FK hatası verir (Prisma `P2003`).
> - `data.tenantId` uyuşmazsa ya da desteklenmeyen bir model veya işlem kullanılırsa `TenantIsolationError` fırlatılır. Bu bir programcı hatasıdır, 500 olarak loglanır.
> - Ham SQL (`$queryRaw`) filtreyi tamamen atlar. Bu yüzden yasaklanmalı.
>
> **Varsayımlar:**
> 1. Bir kullanıcı tek bir kiracıya ait ve e-posta global olarak benzersiz. Bu, girişi basitleştiriyor.
> 2. Kimlik doğrulama çözümü belirtilmediği için onu soyut bıraktım. Oturumdan yalnızca `userId` alınıyor, `tenantId` ve `role` veritabanından okunuyor.
> 3. Para kuruş cinsinden `Int` olarak tutuluyor. Float yuvarlama hatalarından kaçınmak için böyle yaptım.
> 4. Aboneliğe fiyat ve periyot anlık görüntüsü (snapshot) yazılıyor. Plan fiyatı sonradan değişirse mevcut aboneliklerin MRR'ı kendiliğinden değişmiyor.
> 5. Churn müşteri bazında hesaplanıyor: müşterinin **son** aktif aboneliği iptal edildiğinde müşteri churn etmiş sayılıyor. Birden çok aboneliği olan müşteri için tanımınız farklıysa, şema aynı kalır ama sorgu değişir.
> 6. Durumlar yalnızca `ACTIVE` ve `CANCELED`. Ödeme entegrasyonu olmadığı için trial ve past_due durumlarını eklemedim.
> 7. PostgreSQL RLS (satır seviyesi güvenlik) "ek katman ekleme" kısıtı nedeniyle uygulanmadı. Bu kararın gerekçesi aşağıda.
>
> **Emin olmadığım noktalar:**
> - **Prisma sürümü:** Kod Prisma 6.x'i hedefliyor. Prisma 7'de jeneratör adının (`prisma-client`) ve `datasource url`'in `prisma.config.ts`'ye taşınması gibi değişiklikler olduğunu biliyorum, ancak ayrıntılardan emin değilim. Kurduğunuz sürümün belgelerine bakın.
> - **Çakışan alanlar:** Aynı `tenantId` alanının birden fazla bileşik ilişkide kullanılmasına Prisma'nın izin verdiğini düşünüyorum. Yine de `npx prisma validate` ile doğrulayın.
> - **Benzersiz olmayan alanla filtreleme:** `findUnique`, `update` ve `delete` işlemlerinin `where` koşuluna benzersiz olmayan bir alan (`tenantId`) eklemek Prisma 5.0'dan itibaren destekleniyor ("extendedWhereUnique"). Bu konuda oldukça eminim.
> - **`updateManyAndReturn`:** Prisma 6.2 ile geldiğini hatırlıyorum. Listede bulunması zararsız.
> - **CHECK kısıtları:** Prisma şemasında ifade edilemiyorlar. Migration SQL'ine elle eklenmeleri gerekiyor.
> - **Paketler:** Yalnızca `prisma`, `@prisma/client` ve Next.js'in önerdiği `server-only` paketini kullanıyorum. Hepsinin var olduğundan eminim.
>
> ---
>
> ## 1. Veri modeli ve ilişkiler
>
> ```
> TENANTS 1─* USERS
> TENANTS 1─* CUSTOMERS 1─* SUBSCRIPTIONS *─1 PLANS *─1 TENANTS
>                           SUBSCRIPTIONS 1─* SUBSCRIPTION_EVENTS
> ```
>
> - **USERS:** Kiracının çalışanları. Rolleri `MANAGER` veya `FINANCE`.
> - **CUSTOMERS:** Kiracının kendi müşterileri, yani MRR'ın kaynağı.
> - **PLANS:** Kiracının satış planları. Her planın fiyatı kuruş cinsinden ve periyodu `MONTHLY` veya `YEARLY`.
> - **SUBSCRIPTIONS:** Müşteri ile plan arasındaki bağ. Fiyat ve periyodun anlık görüntüsünü, ayrıca `startedAt` ve `canceledAt` alanlarını tutuyor. Belirli bir tarihteki aktiflik şu koşulla bulunuyor: `startedAt ≤ t` ve (`canceledAt` boş ya da `canceledAt > t`).
> - **SUBSCRIPTION_EVENTS:** Değişmez olay günlüğü (STARTED, PLAN_CHANGED, CANCELED). Her olay önceki ve sonraki fiyatı tutuyor, böylece geçmiş MRR yeniden kurulabiliyor. Churn paydası (dönem başındaki aktif müşteriler) ve payı (dönemdeki iptaller) buradan ve aboneliklerden hesaplanıyor.
>
> **MRR hesabı:** Aktif aboneliklerde aylık planların `priceKurus` değeri olduğu gibi, yıllık planlarınki 12'ye bölünerek toplanıyor. Yuvarlama satır satır değil, toplamın sonunda yapılıyor.
>
> **Her tabloda `@@unique([tenantId, id])` olmasının nedeni:** Bileşik yabancı anahtarların hedef gösterebileceği bir benzersiz anahtar sağlıyor. Ayrıca `tenantId` ile başlayan bir indeks oluşturduğu için kiracı filtreli sorgular hızlanıyor.
>
> ---
>
> ## 2. Prisma şeması
>
> ```prisma
> // prisma/schema.prisma — Prisma 6.x hedeflenmiştir
> generator client {
>   provider = "prisma-client-js"
> }
>
> datasource db {
>   provider = "postgresql"
>   url      = env("DATABASE_URL")
> }
>
> enum Role {
>   MANAGER
>   FINANCE
> }
>
> enum BillingInterval {
>   MONTHLY
>   YEARLY
> }
>
> enum SubscriptionStatus {
>   ACTIVE
>   CANCELED
> }
>
> enum SubscriptionEventType {
>   STARTED
>   PLAN_CHANGED
>   CANCELED
> }
>
> model Tenant {
>   id        String     @id @default(uuid()) @db.Uuid
>   name      String
>   createdAt DateTime   @default(now()) @map("created_at")
>
>   users     User[]
>   customers Customer[]
>   plans     Plan[]
>
>   @@map("tenants")
> }
>
> model User {
>   id        String   @id @default(uuid()) @db.Uuid
>   tenantId  String   @map("tenant_id") @db.Uuid
>   email     String   @unique
>   name      String
>   role      Role
>   createdAt DateTime @default(now()) @map("created_at")
>
>   tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Restrict)
>
>   @@unique([tenantId, id])
>   @@map("users")
> }
>
> model Customer {
>   id        String   @id @default(uuid()) @db.Uuid
>   tenantId  String   @map("tenant_id") @db.Uuid
>   name      String
>   email     String?
>   createdAt DateTime @default(now()) @map("created_at")
>
>   tenant        Tenant         @relation(fields: [tenantId], references: [id], onDelete: Restrict)
>   subscriptions Subscription[]
>
>   @@unique([tenantId, id])
>   @@unique([tenantId, email])
>   @@map("customers")
> }
>
> model Plan {
>   id         String          @id @default(uuid()) @db.Uuid
>   tenantId   String          @map("tenant_id") @db.Uuid
>   name       String
>   priceKurus Int             @map("price_kurus")
>   interval   BillingInterval
>   isActive   Boolean         @default(true) @map("is_active")
>   createdAt  DateTime        @default(now()) @map("created_at")
>
>   tenant        Tenant         @relation(fields: [tenantId], references: [id], onDelete: Restrict)
>   subscriptions Subscription[]
>
>   @@unique([tenantId, id])
>   @@unique([tenantId, name])
>   @@map("plans")
> }
>
> model Subscription {
>   id         String             @id @default(uuid()) @db.Uuid
>   tenantId   String             @map("tenant_id") @db.Uuid
>   customerId String             @map("customer_id") @db.Uuid
>   planId     String             @map("plan_id") @db.Uuid
>   status     SubscriptionStatus @default(ACTIVE)
>   priceKurus Int                @map("price_kurus") // anlık görüntü
>   interval   BillingInterval                        // anlık görüntü
>   startedAt  DateTime           @map("started_at")
>   canceledAt DateTime?          @map("canceled_at")
>   createdAt  DateTime           @default(now()) @map("created_at")
>
>   // Bileşik FK: müşteri ve plan aynı kiracıda olmak zorunda
>   customer Customer @relation(fields: [tenantId, customerId], references: [tenantId, id], onDelete: Restrict)
>   plan     Plan     @relation(fields: [tenantId, planId], references: [tenantId, id], onDelete: Restrict)
>   events   SubscriptionEvent[]
>
>   @@unique([tenantId, id])
>   @@index([tenantId, status])
>   @@index([tenantId, customerId])
>   @@map("subscriptions")
> }
>
> model SubscriptionEvent {
>   id                String                @id @default(uuid()) @db.Uuid
>   tenantId          String                @map("tenant_id") @db.Uuid
>   subscriptionId    String                @map("subscription_id") @db.Uuid
>   type              SubscriptionEventType
>   occurredAt        DateTime              @map("occurred_at")
>   priceKurusBefore  Int?                  @map("price_kurus_before")
>   priceKurusAfter   Int?                  @map("price_kurus_after")
>   intervalAfter     BillingInterval?      @map("interval_after")
>   createdAt         DateTime              @default(now()) @map("created_at")
>
>   subscription Subscription @relation(fields: [tenantId, subscriptionId], references: [tenantId, id], onDelete: Restrict)
>
>   @@index([tenantId, type, occurredAt])
>   @@index([tenantId, subscriptionId])
>   @@map("subscription_events")
> }
> ```
>
> `Subscription` ve `SubscriptionEvent` modellerinde `Tenant` ile doğrudan ilişki kurmadım. `tenant_id` sütunu zorunlu ve bileşik FK üzerinden kiracıya dolaylı olarak bağlı. Böylece aynı alanın üç ayrı ilişkide çakışmasından kaçınılıyor.
>
> Prisma'nın ifade edemediği kısıtları `prisma migrate dev --create-only` ile oluşturulan migration dosyasına elle ekleyin:
>
> ```sql
> ALTER TABLE plans ADD CONSTRAINT plans_price_nonneg CHECK (price_kurus >= 0);
> ALTER TABLE subscriptions ADD CONSTRAINT subs_price_nonneg CHECK (price_kurus >= 0);
> ALTER TABLE subscriptions ADD CONSTRAINT subs_cancel_consistent
>   CHECK ((status = 'CANCELED') = (canceled_at IS NOT NULL));
> ```
>
> ---
>
> ## 3. Merkezi tenant yardımcısı
>
> ```ts
> // lib/db.ts
> import "server-only";
> import { PrismaClient, Role } from "@prisma/client";
>
> // --- Tekil temel istemci (DATABASE_URL ortam değişkeninden okunur) ---
> const g = globalThis as unknown as { basePrisma?: PrismaClient };
> const basePrisma = g.basePrisma ?? new PrismaClient();
> if (process.env.NODE_ENV !== "production") g.basePrisma = basePrisma;
>
> // --- Hata sınıfları ---
> export class UnauthenticatedError extends Error {}          // → 401
> export class ForbiddenError extends Error {}                // → 403
> export class TenantIsolationError extends Error {}          // → 500 (programcı hatası)
>
> // Kiracıya bağlı modeller. Listede olmayan model reddedilir (fail-closed).
> const TENANT_MODELS = new Set([
>   "User", "Customer", "Plan", "Subscription", "SubscriptionEvent",
> ]);
>
> const WHERE_OPS = new Set([
>   "findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow",
>   "findMany", "count", "aggregate", "groupBy",
>   "update", "updateMany", "updateManyAndReturn", "delete", "deleteMany",
> ]);
>
> function assertTenantInData(data: any, tenantId: string) {
>   if (data?.tenantId !== undefined && data.tenantId !== tenantId) {
>     throw new TenantIsolationError("data.tenantId aktif kiracıyla uyuşmuyor");
>   }
> }
>
> function withTenantData(data: any, tenantId: string) {
>   assertTenantInData(data, tenantId);
>   return { ...data, tenantId };
> }
>
> function applyTenant(operation: string, args: any, tenantId: string) {
>   const a = { ...(args ?? {}) };
>
>   if (WHERE_OPS.has(operation)) {
>     // Kendi tenantId'miz en sona yazılır ve gelen değeri ezer
>     a.where = { ...(a.where ?? {}), tenantId };
>     if (operation.startsWith("update")) assertTenantInData(a.data, tenantId); // tenantId değiştirilemez
>     return a;
>   }
>
>   switch (operation) {
>     case "create":
>       a.data = withTenantData(a.data, tenantId);
>       return a;
>     case "createMany":
>     case "createManyAndReturn":
>       a.data = Array.isArray(a.data)
>         ? a.data.map((d: any) => withTenantData(d, tenantId))
>         : withTenantData(a.data, tenantId);
>       return a;
>     case "upsert":
>       a.where = { ...(a.where ?? {}), tenantId };
>       a.create = withTenantData(a.create, tenantId);
>       assertTenantInData(a.update, tenantId);
>       return a;
>     default:
>       throw new TenantIsolationError(`Desteklenmeyen işlem: ${operation}`);
>   }
> }
>
> /** Tüm sorgularına tenantId uygulanan istemci. Tek giriş noktası budur. */
> function forTenant(tenantId: string) {
>   if (!tenantId) throw new TenantIsolationError("tenantId boş");
>
>   return basePrisma.$extends({
>     name: "tenant-isolation",
>     query: {
>       $allModels: {
>         async $allOperations({ model, operation, args, query }) {
>           if (!TENANT_MODELS.has(model)) {
>             throw new TenantIsolationError(`${model} kiracı istemcisinden erişilemez`);
>           }
>           return query(applyTenant(operation, args, tenantId));
>         },
>       },
>     },
>   });
> }
>
> // --- Oturum entegrasyonu: kimlik doğrulama çözümünüze göre doldurun ---
> async function getSessionUserId(): Promise<string | null> {
>   throw new Error("Kimlik doğrulama sağlayıcınıza bağlayın");
> }
>
> export type CurrentUser = { id: string; tenantId: string; role: Role };
>
> /** Server Component / Route Handler / Server Action içinde kullanın. */
> export async function getTenantContext(...allowedRoles: Role[]) {
>   const userId = await getSessionUserId();
>   if (!userId) throw new UnauthenticatedError();
>
>   // tenantId ve rol oturumdan değil veritabanından okunur
>   const user = await basePrisma.user.findUnique({
>     where: { id: userId },
>     select: { id: true, tenantId: true, role: true },
>   });
>   if (!user) throw new UnauthenticatedError();
>   if (allowedRoles.length && !allowedRoles.includes(user.role)) {
>     throw new ForbiddenError();
>   }
>
>   return { db: forTenant(user.tenantId), user: user as CurrentUser };
> }
>
> // Yalnızca testler için dışa açılır
> export const __test = { forTenant, basePrisma };
> ```
>
> Kullanım örneği:
>
> ```ts
> const { db } = await getTenantContext("FINANCE", "MANAGER");
> const customer = await db.customer.findUnique({ where: { id } }); // B'nin ID'si → null → 404
> ```
>
> **Kurallar ve bilinen açıklar:**
> - `basePrisma` dışa açılmıyor. Yalnızca oturum çözümleme (kullanıcıyı ID ile bulma) bu dosyanın içinde kullanılıyor.
> - `$queryRaw` ve `$executeRaw` genişletilmiş istemcide de duruyor ve filtreyi atlıyor. Bunları kod incelemesinde yasaklayın, metrik sorgularını Prisma'nın `aggregate`/`groupBy` metotlarıyla yazın.
> - İç içe yazmalarda (nested write) eklenti yalnızca en üst seviyedeki işlemi görüyor. Burada güvenliği bileşik FK'ler sağlıyor. Abonelik oluştururken `customer: { connect }` yerine skaler alanları (`customerId`, `planId`) kullanın. İlişki bağlama ile skaler `tenantId` karışırsa Prisma doğrulama hatası verir.
> - `$transaction(async (tx) => ...)` genişletilmiş istemci üzerinden çağrılırsa `tx` de filtreyi devralıyor.
> - **Neden RLS yok:** Prisma ile RLS kullanmak her istekte bir transaction ve `set_config` çağrısı gerektiriyor. Bu da kısıtınıza aykırı bir katman. İki haftalık süre bittikten sonra ikinci savunma hattı olarak eklemeye değer.
>
> ---
>
> ## 4. Tenant izolasyonu test senaryoları
>
> Hazırlık: test veritabanına iki kiracı (A ve B) ekleyin. Her birinde bir kullanıcı, bir müşteri, bir plan ve bir abonelik olsun. Testlerde `__test.forTenant(A.id)` ile bir istemci oluşturun.
>
> 1. **Okuma izolasyonu:**
>    - A istemciyle `customer.findMany()` yalnızca A'nın müşterisini döndürmeli.
>    - B müşterisinin ID'siyle `findUnique` sorgusu `null` döndürmeli.
>    - `where: { tenantId: B.id }` açıkça verilse bile sonuç boş olmalı.
>    - `customer.findMany({ include: { subscriptions: true } })` B'nin aboneliğini içermemeli.
>
> 2. **Yazma izolasyonu:**
>    - B kaydına `update` veya `delete` uygulamak `P2025` hatası vermeli.
>    - `updateMany` ve `deleteMany` işlemleri B'nin kayıtları için `count: 0` döndürmeli.
>    - `create({ data: { tenantId: B.id, ... } })` ve `update({ data: { tenantId: B.id } })` `TenantIsolationError` fırlatmalı.
>    - Her testten sonra B'nin satırlarının değişmediği `basePrisma` ile doğrulanmalı.
>
> 3. **Kiracılar arası ilişki ve fail-closed davranış:**
>    - A istemciyle B müşterisinin `customerId` değeri kullanılarak abonelik oluşturmak `P2003` (FK ihlali) hatası vermeli. Bu, uygulama katmanı atlansa bile veritabanının engellediğini gösterir.
>    - A istemciyle `db.tenant.findMany()` çağrısı `TenantIsolationError` fırlatmalı.
>
> ---
>
> Bu çıktıyı kendi şablonunuzdaki "Gözlenecekler" maddelerine göre değerlendirmek isterseniz, "Çıktı özeti" ve "Değerlendirme" alanlarını birlikte doldurabiliriz.

