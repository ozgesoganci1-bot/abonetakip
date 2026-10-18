# Proje Fikri Önerisi

**Ders:** Sunucu Tabanlı Programlama (YBS, 3. sınıf)
**Proje adı:** AboneTakip (çalışma adı)
**Tek cümle:** Küçük yazılım firmaları için abonelik, MRR ve churn takip SaaS'ı.
**Geliştirici:** [Ad Soyad] • **Öğrenci no:** [No] • **Tarih:** [Tarih]
**GitHub deposu:** [Depo bağlantısı] • **Canlı adres:** [Render bağlantısı]
**Depo görünürlüğü:** Herkese açık (public)

---

## 1. Hangi iş problemini çözüyor?

Küçük yazılım firmaları müşteri aboneliklerini ve gelirini genellikle elektronik tablolarda elle takip ediyor. Hangi müşterinin ne zaman başladığı, kimin ayrıldığı ve bu ay düzenli gelirin ne kadar olduğu tek bir yerde görünmüyor. Sonuç olarak yönetici şu sorulara güvenilir cevap veremiyor:

- Aylık düzenli gelirimiz (MRR) ne kadar ve nasıl değişiyor?
- Müşteri kaybı (churn) oranımız kaç?
- Bir müşteri bize ortalama ne kadar kazandırıyor (LTV) ve bunu kazanmak için harcadığımıza değiyor mu (LTV/CAC)?

Bu yüzden fiyatlama ve pazarlama kararları sezgiyle alınıyor. AboneTakip, aboneliklerin yaşam döngüsünü (başlat, yenile, iptal) kayıt altına alır ve yöneticiye bu metrikleri tek ekranda gösterir.

Ürünün bir iş modeli ve bir mimari kararı olduğunu da hesaba katıyoruz (3. hafta): ürün abonelikle satılan çok kiracılı bir SaaS'tır ve her müşteri firma yalnızca kendi verisini görür.

## 2. Kullanıcısı kim?

| Rol | Kim? | Ne yapabilir? |
|---|---|---|
| **Manager** | Firma sahibi / yönetici | Dashboard'u görür, plan ve CAC ayarlarını yönetir, kullanıcı ekler, tüm kayıtlara erişir |
| **Finance** | Finans çalışanı | Müşteri, plan ve abonelik kayıtlarını girer, dashboard'u görüntüler. Ayarları ve kullanıcıları yönetemez |

## 3. Tek kiracılı mı, SaaS mı?

**Çok kiracılı SaaS.** Ürünü kullanan her yazılım firması bir kiracıdır (tenant). Tüm kiracılar tek uygulamayı ve tek veritabanını paylaşır. Veri ayrımı ortak tablolar ve `tenant_id` sütunuyla yapılır (3. hafta, üçüncü yaklaşım). Güvenlik artık veritabanının değil kodun sorumluluğunda olduğu için tenant filtresi her sorguda ve tek bir merkezden uygulanır.

## 4. MVP'deki MUST özellikler (en fazla 5)

1. **Kiracı kaydı, giriş ve rol bazlı erişim** (manager, finance)
2. **Müşteri ve plan yönetimi** (ekleme, düzenleme, pasife alma)
3. **Abonelik yaşam döngüsü** (başlat, yenile, iptal) ve olay kaydı
4. **KPI dashboard:** MRR, aylık churn, LTV, LTV/CAC
5. **Kiracı izolasyonu** (her sorguda `tenant_id`, tek merkezden)

### MoSCoW özeti

| Öncelik | İçerik |
|---|---|
| MUST | Yukarıdaki 5 madde |
| SHOULD | SSE ile iptal ve riskli abonelik uyarısı, aylık MRR grafiği |
| COULD | CSV dışa aktarma, plan bazlı kırılım |
| WON'T | Ödeme entegrasyonu, çoklu para birimi, e-posta bildirimi, mikroservis |

## 5. Başarı ölçütü

İki farklı kiracıyla giriş yapıldığında her biri yalnızca kendi müşteri, plan, abonelik ve metriklerini görür. Dashboard'daki MRR, churn, LTV ve LTV/CAC değerleri dersteki formüllerle elle hesaplanan sonuçlarla eşleşir.

## 6. Kapsam ve süre

Tek geliştirici, 2 hafta, GitHub ile entegre. Tek Next.js uygulaması ve tek veritabanı kullanılır. Mikroservis ve micro frontend, bu ölçek için aşırı mühendislik olduğundan kullanılmaz (3. hafta, "Her mimari her ölçeğe uygun değildir").
