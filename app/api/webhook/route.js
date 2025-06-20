import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook doğrulama hatası:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = parseInt(session.metadata?.order_id);
    const customerId = session.metadata?.customer_id;

    if (!orderId || !customerId) {
      console.error("❌ Eksik metadata:", { orderId, customerId });
      return new Response("Eksik metadata", { status: 400 });
    }

    // ✅ 0. Zaten order_items yazılmış mı?
    const { data: existingItems, error: existingError } = await supabase
      .from("order_items")
      .select("id")
      .eq("order_id", orderId);

    if (existingError) {
      console.error("❌ Order kontrol hatası:", existingError.message);
      return new Response("Order kontrol hatası", { status: 500 });
    }

    if (existingItems.length > 0) {
      // 🛑 Zaten yazılmış → sadece order'ı paid yap ve sepeti sil
      await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderId);
      await supabase.from("cart").delete().eq("customer_id", customerId);
      console.log("🛑 Webhook: order_items zaten var, tekrar yazılmadı.");
      return new Response("ok", { status: 200 });
    }

    // 🔄 1. Sepeti al
    const { data: cartItems, error: cartError } = await supabase
      .from("cart")
      .select("quantity, product_variant_id")
      .eq("customer_id", customerId);

    if (cartError || !cartItems?.length) {
      console.error("❌ Sepet alınamadı:", cartError?.message || cartItems);
      return new Response("Sepet alınamadı", { status: 500 });
    }

    const variantIds = cartItems.map((item) => item.product_variant_id);

    // 🔄 2. Varyantları al
    const { data: variants, error: variantError } = await supabase
      .from("product_variants")
      .select("id, stock, product_id")
      .in("id", variantIds);

    if (variantError || !variants?.length) {
      console.error(
        "❌ Varyantlar alınamadı:",
        variantError?.message || variants
      );
      return new Response("Varyantlar alınamadı", { status: 500 });
    }

    // 🔄 3. Ürünleri al
    const productIds = variants.map((v) => v.product_id);
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id, price")
      .in("id", productIds);

    if (productError || !products?.length) {
      console.error("❌ Ürünler alınamadı:", productError?.message || products);
      return new Response("Ürünler alınamadı", { status: 500 });
    }

    // 🔄 4. order_items payload'u oluştur
    const orderItemsPayload = [];

    for (const item of cartItems) {
      const variant = variants.find((v) => v.id === item.product_variant_id);
      const product = variant
        ? products.find((p) => p.id === variant.product_id)
        : null;

      if (!variant || !product) {
        console.warn("⚠️ Eşleşme bulunamadı:", { variant, product });
        continue;
      }

      const price = Number(product.price);
      if (isNaN(price)) {
        console.warn("⚠️ Fiyat geçersiz:", product.price);
        continue;
      }

      orderItemsPayload.push({
        order_id: orderId,
        product_id: product.id,
        product_variant_id: variant.id,
        quantity: item.quantity,
        price,
        total_price: price * item.quantity,
      });
    }

    if (!orderItemsPayload.length) {
      console.error("❌ Hiçbir order_item oluşturulamadı.");
      return new Response("Ürünler eklenemedi", { status: 500 });
    }

    const { error: insertError } = await supabase
      .from("order_items")
      .insert(orderItemsPayload);

    if (insertError) {
      console.error("❌ order_items eklenemedi:", insertError.message);
      return new Response("Sipariş ürünleri eklenemedi", { status: 500 });
    }

    // 🔄 5. Stokları güncelle
    for (const item of cartItems) {
      const variant = variants.find((v) => v.id === item.product_variant_id);
      if (!variant) continue;

      const newStock = Math.max((variant.stock || 0) - item.quantity, 0);
      await supabase
        .from("product_variants")
        .update({ stock: newStock })
        .eq("id", variant.id);
    }

    // ✅ 6. Sipariş durumu "paid"
    await supabase.from("orders").update({ status: "paid" }).eq("id", orderId);

    // ✅ 7. Sepeti temizle
    await supabase.from("cart").delete().eq("customer_id", customerId);

    console.log("✅ Webhook: Sipariş başarıyla işlendi.");
  }

  return new Response("ok", { status: 200 });
}
