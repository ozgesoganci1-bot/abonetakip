// ROL KURALLARI
//
// Rol kararları bu dosyadaki saf fonksiyonlarla verilir: veritabanına ve çereze
// dokunmazlar, aynı girdiye her zaman aynı sonucu verirler. Bu yüzden testlerden
// doğrudan çağrılabilirler.
//
// Rol kontrolü her zaman SUNUCUDA yapılır. Arayüzde düğme gizlemek yetki kontrolü değildir.

import type { Role } from "../../generated/prisma/enums";

// Yalnızca firma yöneticisine (manager) açık işlemler için kullanılır.
// Bugün bu kurala bağlı olanlar: müşteri pasife alma, plan pasife alma,
// Ayarlar ve Kullanıcılar sayfaları.
export function yoneticiMi(rol: Role): boolean {
  return rol === "manager";
}