// Prisma yapılandırma dosyası (Prisma 7)
// Veritabanı adresi yalnızca .env dosyasından okunur, buraya yazılmaz.
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Veritabanı şemasının bulunduğu dosya
  schema: "prisma/schema.prisma",
  // Geçiş (migration) dosyalarının tutulacağı klasör
  migrations: {
    path: "prisma/migrations",
  },
  // Geçişler doğrudan (direct) adresle çalışır
  datasource: {
    url: env("DIRECT_URL"),
  },
});