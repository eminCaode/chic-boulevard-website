import Image from "next/image";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { getUserOrders } from "@/app/_lib/auth-data";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function OrdersPage() {
  // ✅ Next.js 15 için cookies()'i await etmemiz gerekiyor
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const orders = await getUserOrders(supabase);

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex items-start justify-center px-4 ">
        <div className="max-w-md w-full rounded-xl p-8 text-center ">
          <div className="flex justify-center">
            <Image
              src="/box.png"
              alt="No products found"
              width={150}
              height={150}
              className="mb-6 opacity-70"
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Henüz siparişiniz yok
          </h1>
          <p className="text-gray-500 text-sm mb-4">
            Alışveriş yapmaya başlayarak sipariş listenizi oluşturun.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4"> Siparişlerim</h1>

      {orders &&
        orders.length > 0 &&
        orders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-200 bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 mb-4 gap-1">
              <div>
                <span className="font-medium text-md text-gray-700">
                  Sipariş No: #{order.id}
                </span>
                <span className="block text-sm text-gray-400">
                  {order.items?.[0]?.created_at
                    ? format(
                        new Date(order.items[0].created_at),
                        "dd MMMM yyyy HH:mm",
                        { locale: tr }
                      )
                    : "Tarih yok"}
                </span>
              </div>
              <span
                className={`capitalize font-semibold text-sm mt-1 sm:mt-0 ${
                  order.status === "paid"
                    ? "text-green-600"
                    : order.status === "pending"
                    ? "text-yellow-600"
                    : "text-gray-500"
                }`}
              >
                Durum: {order.status}
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => {
                  const product = item.product_variant_id.products;
                  const variant = item.product_variant_id;

                  const sizeLabel =
                    variant.size?.name ||
                    (variant.waist_size?.name || variant.length_size?.name
                      ? `${variant.waist_size?.name ?? ""}${
                          variant.length_size?.name
                            ? " / " + variant.length_size.name
                            : ""
                        }`
                      : "-");

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 py-5"
                    >
                      <div className="flex items-start gap-4 w-full">
                        <Image
                          src={product?.imgurl || "/placeholder.jpg"}
                          alt={product?.name || "Ürün"}
                          width={72}
                          height={72}
                          className="rounded-lg object-cover border"
                        />
                        <div className="flex flex-col justify-between w-full">
                          <p className="font-semibold text-base text-gray-800 mb-1">
                            {product?.name}
                          </p>
                          <p className="text-sm text-gray-500 mb-1">
                            Renk: {variant.colors?.name || "-"} · Beden:{" "}
                            {sizeLabel}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} × {item.price.toFixed(2)}₺
                          </p>
                        </div>
                      </div>
                      <div className="text-right font-semibold text-black text-sm min-w-[80px]">
                        {item.total_price.toFixed(2)}₺
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-400 text-sm p-4">
                  Sipariş ürünü yok
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4 border-t pt-4 text-sm font-bold text-black">
              Toplam:{" "}
              {order.items
                ? order.items
                    .reduce((sum, i) => sum + (i.total_price ?? 0), 0)
                    .toFixed(2)
                : "0.00"}
              ₺
            </div>
          </div>
        ))}
    </div>
  );
}
