import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

// Ana sayfa: giriş durumuna göre yönlendirir.
export default async function AnaSayfa() {
  const kullanici = await getCurrentUser();
  redirect(kullanici ? "/dashboard" : "/giris");
}