"use server";

import { auth } from "./auth";

export async function getUserOrders(supabase) {
  const session = await auth();
  const customerId = session?.user?.customerId;

  if (!customerId) {
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
      return [];
    }

    return data || [];
  } catch (err) {
    return [];
  }
}
