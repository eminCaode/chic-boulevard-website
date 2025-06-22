"use server";

import Stripe from "stripe";
import { auth, signIn, signOut } from "./auth";
import supabase from "./supabase-server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signInAction() {
  await signIn("google", { redirectTo: "/" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function addToFavorites(productId) {
  const session = await auth();
  if (!session || !session.user?.customerId) {
    // 🔁 Kullanıcı login değil → yönlendir
    redirect("/login");
  }
  const customer_id = session.user.customerId;

  const { data: existing, error: controlError } = await supabase
    .from("favorites")
    .select("id")
    .eq("customer_id", customer_id)
    .eq("product_id", productId)
    .maybeSingle();

  if (controlError) throw new Error("favori kontrolünde hata");

  if (existing) {
    return null;
  }

  const { error } = await supabase
    .from("favorites")
    .insert([{ customer_id, product_id: productId }]);

  if (error) {
    throw new Error("Fava eklenemedi.");
  }
}

export async function deleteFromFavorites(productId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in.");
  const customer_id = session.user.customerId;
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("customer_id", customer_id)
    .eq("product_id", productId);
  if (error) {
    throw new Error("Favoriden silinemedi.");
  }
}

export async function addToCart(cartData) {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }

  const customer_id = session.user.customerId;

  let variant;

  // 🔀 VARYANTI BULMA
  if (cartData.size_id) {
    // Tek bedenli ürün (tops, shoes vs.)
    const { data, error } = await supabase
      .from("product_variants")
      .select("id")
      .eq("product_id", cartData.product_id)
      .eq("color_id", cartData.color_id)
      .eq("size_id", cartData.size_id)
      .maybeSingle();

    if (!data || error) {
      throw new Error("Ürün varyantı bulunamadı.");
    }

    variant = data;
  } else if (cartData.waist_id && cartData.length_id) {
    // Bottoms ürünleri
    const { data, error } = await supabase
      .from("product_variants")
      .select("id")
      .eq("product_id", cartData.product_id)
      .eq("waist_size_id", cartData.waist_id)
      .eq("length_size_id", cartData.length_id)
      .maybeSingle();

    if (!data || error) {
      throw new Error("Ürün varyantı bulunamadı.");
    }

    variant = data;
  } else {
    throw new Error("Geçersiz beden bilgisi gönderildi.");
  }

  // 🔄 SEPETE EKLEME/GÜNCELLEME
  const { data: existing, error: controlError } = await supabase
    .from("cart")
    .select("id, quantity")
    .eq("customer_id", customer_id)
    .eq("product_variant_id", variant.id)
    .maybeSingle();

  if (controlError) throw new Error("Sepet kontrolü yapılamadı.");

  if (existing) {
    const { error: updateError } = await supabase
      .from("cart")
      .update({
        quantity: existing.quantity + cartData.quantity,
        updated_at: new Date(),
      })
      .eq("id", existing.id);

    if (updateError) {
      throw new Error("Sepet güncellenemedi.");
    }
  } else {
    const { error: insertError } = await supabase.from("cart").insert([
      {
        customer_id,
        product_variant_id: variant.id,
        quantity: cartData.quantity,
        created_at: new Date(),
      },
    ]);

    if (insertError) {
      throw new Error("Ürün sepete eklenemedi.");
    }
  }
}

export async function deleteFromCart({ product_variant_id }) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in.");
  const customer_id = session.user.customerId;

  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("customer_id", customer_id)
    .eq("product_variant_id", product_variant_id);

  if (error) {
    throw new Error("Carttan silinemedi.");
  }

  revalidatePath("/cart");
}

export async function getCart() {
  const session = await auth();
  const customerId = session?.user?.customerId;

  if (!customerId) {
    return [];
  }

  const { data, error } = await supabase
    .from("cart")
    .select(
      `
      id,
      quantity,
      product_variant_id (
        id,
        product_id,
        size_id,
        color_id,
        waist_size_id,
        length_size_id,
        products (
          id,
          name,
          price,
          imgurl,
          slug
        ),
        sizes!product_variants_size_id_fkey (
          id,
          name
        ),
        colors (
          id,
          name
        ),
        waist_size:waist_size_id (
          id,
          name
        ),
        length_size:length_size_id (
          id,
          name
        )
      )
    `
    )
    .eq("customer_id", customerId);

  if (error) {
    throw error;
  }

  return data;
}

export async function getFavorites() {
  const session = await auth();
  const customerId = session?.user?.customerId;
  if (!customerId) {
    throw new Error("Geçerli bir müşteri ID'si sağlanmadı.");
  }
  const { data, error } = await supabase
    .from("favorites")
    .select("products(*)")
    .eq("customer_id", customerId);

  if (error) {
    throw error;
  }
  return data.map((item) => item.products.id); // ✅ sadeleştirilmiş veri
}

export async function isFavorite(productId) {
  const session = await auth();
  const customerId = session?.user?.customerId;
  if (!customerId) {
    throw new Error("Geçerli bir müşteri ID'si sağlanmadı.");
  }
  const { data, error } = await supabase
    .from("favorites")
    .select("products(*)")
    .eq("customer_id", customerId)
    .eq("product_id", productId);

  if (error) {
    return false;
  }
  return data.length > 0;
}

export async function updateCustomerProfile(formData) {
  const session = await auth();
  const customerId = session?.user?.customerId;

  if (!customerId) {
    throw new Error("Geçerli bir müşteri ID'si sağlanmadı.");
  }

  const plainData = Object.fromEntries(formData.entries());

  const { first_name, last_name, email, phone_number, gender } = plainData;

  const { data, error } = await supabase
    .from("customers")
    .update({ first_name, last_name, email, phone_number, gender })
    .eq("id", customerId);

  if (error) {
    throw new Error("Profil bilgisi güncellenemedi.");
  }
}

export async function addCustomerAddress(formData) {
  const session = await auth();
  const customerId = session?.user?.customerId;
  if (!customerId) {
    throw new Error("Geçerli bir müşteri ID'si sağlanmadı.");
  }

  const plainData = Object.fromEntries(formData.entries());
  const {
    title,
    first_name,
    last_name,
    address,
    province,
    city,
    country,
    postal_code,
    phone_number,
  } = plainData;

  const { data, error } = await supabase.from("addresses").insert({
    customer_id: customerId,
    first_name,
    last_name,
    title,
    address,
    province,
    city,
    country,
    postal_code,
    phone_number,
    is_default: true,
  });

  if (error) {
    throw new Error("Adres bilgisi eklenemedi.");
  }
  revalidatePath("/account/addresses");
}

export async function updateCustomerAddress(formData) {
  const session = await auth();
  const customerId = session?.user?.customerId;
  if (!customerId) {
    throw new Error("Geçerli bir müşteri ID'si sağlanmadı.");
  }

  const plainData = Object.fromEntries(formData.entries());
  const {
    title,
    first_name,
    last_name,
    address,
    province,
    city,
    country,
    postal_code,
    phone_number,
  } = plainData;

  const { data, error } = await supabase
    .from("addresses")
    .update({
      customer_id: customerId,
      first_name,
      last_name,
      title,
      address,
      province,
      city,
      country,
      postal_code,
      phone_number,
      is_default: false,
    })
    .eq("customer_id", customerId);

  if (error) {
    throw new Error("Adres bilgisi güncellenemedi.");
  }
  revalidatePath("/account/addresses");
}

export async function getAddress() {
  const session = await auth();
  const customerId = session?.user?.customerId;
  if (!customerId) {
    throw new Error("Geçerli bir müşteri ID'si sağlanmadı.");
  }

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("customer_id", customerId);

  if (error) {
    throw new Error("Adres bilgisi alınamadı.");
  }

  return data;
}

export async function deleteAddress(addressId) {
  const session = await auth();
  const customerId = session?.user?.customerId;
  if (!customerId) {
    throw new Error("Geçerli bir müşteri ID'si sağlanmadı.");
  }

  const { data, error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("customer_id", customerId);

  if (error) {
    throw new Error("Adres bilgisi silinemedi.");
  }

  return data;
}

export async function getFilteredProducts(query) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
  *,
  categories(size_type),
  product_variants(
    *,
    waist_size:sizes!fk_waist_size(name),
    length_size:sizes!fk_length_size(name),
    sizes:sizes!product_variants_size_id_fkey(name)
  )
`
    )
    .ilike("name", `%${query}%`);

  if (error) {
    return [];
  }

  return data;
}

export async function updateCartQuantity({ product_variant_id, quantity }) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in.");
  const customer_id = session.user.customerId;

  const { error } = await supabase
    .from("cart")
    .update({ quantity, updated_at: new Date() })
    .eq("customer_id", customer_id)
    .eq("product_variant_id", product_variant_id);

  if (error) {
    throw new Error("Sepet güncellenemedi.");
  }
}

export async function createOrderFromAddress(addressId) {
  const session = await auth();
  const customerId = session?.user?.customerId;

  if (!customerId || !addressId) {
    throw new Error("Gerekli bilgiler eksik.");
  }

  // 1. Siparişi oluştur
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      address_id: addressId,
      status: "pending",
    })
    .select()
    .single();

  if (orderError) {
    throw new Error("Sipariş oluşturulamadı.");
  }

  const orderId = order.id;

  // 2. Sepet içeriklerini al
  const { data: cartItems, error: cartError } = await supabase
    .from("cart")
    .select("quantity, product_variant_id ( id, product_id )")
    .eq("customer_id", customerId);

  if (cartError || !cartItems?.length) {
    throw new Error("Sepet alınamadı.");
  }

  const variantIds = cartItems.map((item) => item.product_variant_id.id);

  // 3. Ürünleri al
  const { data: products, error: productError } = await supabase
    .from("products")
    .select("id, price")
    .in(
      "id",
      cartItems.map((item) => item.product_variant_id.product_id)
    );

  if (productError || !products?.length) {
    throw new Error("Ürün bilgileri alınamadı.");
  }

  // 4. Order_items oluştur
  const orderItemsPayload = [];

  for (const item of cartItems) {
    const variant = item.product_variant_id;
    const product = products.find((p) => p.id === variant.product_id);

    if (!variant || !product) continue;

    const price = Number(product.price);
    if (isNaN(price)) continue;

    orderItemsPayload.push({
      order_id: orderId,
      product_id: product.id,
      product_variant_id: variant.id,
      quantity: item.quantity,
      price,
      total_price: price * item.quantity,
    });
  }

  if (orderItemsPayload.length === 0) {
    throw new Error("Sipariş ürünleri hazırlanamadı.");
  }

  const { error: insertError } = await supabase
    .from("order_items")
    .insert(orderItemsPayload);

  if (insertError) {
    throw new Error("Sipariş ürünleri eklenemedi.");
  }

  return orderId;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export async function createStripeSession(orderId) {
  const session = await auth();
  const customerId = session?.user?.customerId;
  if (!customerId) throw new Error("Giriş yapılmamış.");

  const { data: cartItems, error } = await supabase
    .from("cart")
    .select(
      `
      quantity,
      product_variant_id (
        id,
        products (
          name,
          price
        )
      )
    `
    )
    .eq("customer_id", customerId);

  if (error || !cartItems || cartItems.length === 0) {
    throw new Error("Sepet boş ya da yüklenemedi.");
  }

  const line_items = cartItems.map((item) => {
    const product = item.product_variant_id?.products;
    return {
      quantity: item.quantity,
      price_data: {
        currency: "try",
        product_data: { name: product?.name ?? "Ürün" },
        unit_amount: Math.round(Number(product?.price) * 100),
      },
    };
  });

  const sessionObj = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    metadata: {
      order_id: orderId,
      customer_id: customerId,
    },
  });

  // Stripe session'ı orders tablosuna yaz
  await supabase
    .from("orders")
    .update({ stripe_session: sessionObj.id })
    .eq("id", orderId);

  return sessionObj.url;
}
