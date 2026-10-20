// Uygulamanın tek veritabanı bağlantısı (Prisma 7 + PostgreSQL sürücü adaptörü).
//
// ÖNEMLİ KURAL: Bu dosyadaki ham "prisma" nesnesi yalnızca şu üç dosyada
// içe aktarılabilir: src/lib/db.ts, src/lib/auth.ts, src/lib/tenant.ts.
// Diğer bütün veri sorguları src/lib/tenant.ts içindeki getTenantDb()
// üzerinden yapılır. Böylece tenantId filtresi hiçbir sorguda unutulmaz.

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

// Yeni bir Prisma istemcisi oluşturur.
function createPrismaClient(): PrismaClient {
  // Bağlantı adresi yalnızca ortam değişkeninden okunur (havuzlu Neon adresi).
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    // Adres tanımlı değilse uygulama açık bir mesajla durur.
    // Mesajda adresin kendisi asla yazdırılmaz.
    throw new Error(
      "DATABASE_URL ortam değişkeni tanımlı değil. .env dosyasını kontrol edin."
    );
  }

  // Prisma 7'de PostgreSQL'e bağlanmak için sürücü adaptörü zorunludur.
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
}

// Geliştirme sırasında (npm run dev) dosya her kaydedildiğinde kod yeniden
// yüklenir. Her yüklemede yeni bağlantı açılırsa Neon'un bağlantı sınırı
// dolabilir. Bu yüzden istemciyi global bir alanda saklayıp yeniden kullanıyoruz.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Daha önce oluşturulmuş bir istemci varsa onu kullan, yoksa yenisini oluştur.
export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

// Yalnızca geliştirme ortamında global alana kaydet.
// Render'da (production) sunucu bir kez başlar, buna gerek yoktur.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}