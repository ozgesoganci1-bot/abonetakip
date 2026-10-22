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
// Uygulamadaki TEK tanımdır: kayıt (auth.ts) ve bütün sunucu işlemleri bunu kullanır.
export function tekrarEdenKayitMi(hata: unknown): boolean {
  return (
    typeof hata === "object" &&
    hata !== null &&
    "code" in hata &&
    (hata as { code: unknown }).code === "P2002"
  );
}