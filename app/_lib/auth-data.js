"use server";

import { auth } from "./auth";
import supabase from "./supabase-server";

export async function getUserOrders() {
  const session = await auth();
  const customerId = session?.user?.customerId;

  if (!customerId) {
    console.log("❌ Session bulunamadı");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        items:order_items (
          *,
          product_variant_id:product_variants (
            *,
            products ( name, imgurl ),
            size: sizes!product_variants_size_id_fkey (name),
            waist_size: sizes!fk_waist_size (name),
            length_size: sizes!fk_length_size (name),
            colors ( name )
          )
        )
      `
      )
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Orders getirme hatası:", error);
      return [];
    }

    console.log("✅ Siparişler:", data);
    return data || [];
  } catch (err) {
    console.error("❌ getUserOrders genel hatası:", err);
    return [];
  }
}
