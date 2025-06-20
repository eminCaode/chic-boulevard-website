import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createCustomer, getCustomer } from "./data-service";
import supabase from "./supabase-server";
import { auth as getSessionAuth } from "./auth"; // import edilen fonksiyona farklı isim ver

// 🔧 Environment variables kontrolü
console.log("🔧 Auth Environment Variables:");
console.log(
  "AUTH_GOOGLE_ID:",
  process.env.AUTH_GOOGLE_ID ? "✅ Mevcut" : "❌ Eksik"
);
console.log(
  "AUTH_GOOGLE_SECRET:",
  process.env.AUTH_GOOGLE_SECRET ? "✅ Mevcut" : "❌ Eksik"
);

// 🔥 Google sub'ını UUID formatına çeviren fonksiyon
function googleSubToUUID(sub) {
  if (!sub) return null;

  // Google sub'ını hash'le ve UUID formatına çevir
  const hash = require("crypto").createHash("md5").update(sub).digest("hex");

  // UUID v4 formatı: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(
    13,
    16
  )}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
}

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      console.log("🔐 authorized callback çalıştı", { auth: !!auth?.user });
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      console.log("🚀 signIn callback BAŞLADI!");
      console.log("user:", user);
      console.log("user.sub:", user.sub);
      console.log("account:", account);
      console.log("profile:", profile);
      console.log("profile.sub:", profile.sub);

      try {
        const existingCustomer = await getCustomer(user.email);
        console.log("Mevcut müşteri:", existingCustomer);

        // 🔥 Foreign key constraint sorunu var, auth_id'yi şimdilik null bırak
        // Sadece email ile customer'ı bulup session'a ekle
        console.log(
          "Foreign key constraint nedeniyle auth_id null bırakılıyor"
        );

        if (!existingCustomer) {
          console.log("Yeni müşteri oluşturuluyor...");
          await createCustomer({
            email: user.email,
            fullName: user.name ?? "Anonymous",
            auth_id: user.id, // 🔥 null bırak
          });
          console.log("Yeni müşteri oluşturuldu");
        } else {
          console.log("Mevcut müşteri bulundu, auth_id güncellenmiyor");
        }

        console.log("✅ signIn callback başarıyla tamamlandı");
        return true;
      } catch (error) {
        console.error("❌ signIn error:", error);
        return false;
      }
    },
    async session({ session, user }) {
      console.log("🔄 session callback çalıştı");
      const customer = await getCustomer(session.user.email);
      session.user.customerId = customer.id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: true, // 🔥 Debug modunu aktif et
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);

export async function getUserOrders() {
  const session = await getSessionAuth(); // ✅ Bunu kullanmalısın
  const customerId = session?.user?.customerId;
  if (!customerId) {
    console.log("Session bulunamadı");
    return [];
  }

  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Orders getirme hatası:", error);
      return [];
    }

    return orders || [];
  } catch (error) {
    console.error("getUserOrders genel hatası:", error);
    return [];
  }
}
