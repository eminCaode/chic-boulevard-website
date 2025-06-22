"use client";

import Image from "next/image";
import { useCart } from "../context/CartContext";
import { deleteFromCart } from "../_lib/action";
import { useRouter } from "next/navigation";

export default function CartModal() {
  const { cart, refreshCart } = useCart(); // Yerel state yerine global cart kullan
  const router = useRouter();

  const total = cart.reduce((acc, item) => {
    const price = item.product_variant_id?.products?.price ?? 0;
    return acc + price * item.quantity;
  }, 0);

  const handleDelete = async (product_variant_id) => {
    try {
      await deleteFromCart({ product_variant_id });
      // Silme işleminden sonra cart'ı yenile
      await refreshCart();
    } catch (error) {
      throw error;
    }
  };

  const getSizeLabel = (variant) => {
    const waist = variant.waist_size?.name;
    const length = variant.length_size?.name;
    const size = variant.sizes?.name;

    if (waist && length) return `${waist} / ${length}`;
    if (size) return size;
    return "-";
  };

  return (
    <div className="bg-white rounded-b-2xl py-6 px-6 flex flex-col gap-4 w-[400px] absolute z-50 top-20 right-3 border border-gray-300">
      <h1 className="font-bold text-lg">
        My Shopping Cart ({cart.length} product
        {cart.length !== 1 && "s"})
      </h1>

      <div className="relative">
        <div className="flex flex-col gap-4 max-h-[230px] custom-scroll overflow-y-auto pr-2">
          {cart.map((item) => {
            const product = item.product_variant_id?.products;
            const variant = item.product_variant_id;

            return (
              <div
                key={item.id}
                className="flex flex-row gap-2 border border-gray-300 rounded-lg relative"
              >
                <Image
                  className="rounded-lg"
                  src={product?.imgurl ?? "/placeholder.jpg"}
                  alt={product?.name ?? "Ürün"}
                  width={100}
                  height={120}
                />
                <div className="flex flex-col py-4 px-2 justify-between gap-1">
                  <span>{product?.name}</span>
                  <span>{product?.price ?? 0} TL</span>
                  <div className="flex gap-3 text-sm text-gray-500">
                    <span>Beden: {getSizeLabel(variant)}</span>
                    <span>Adet: {item.quantity}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(variant?.id)}
                  className="absolute z-5 top-2 right-3"
                >
                  X
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between font-semibold mt-2">
        <span>Total:</span>
        <span>{total.toFixed(2)} TL</span>
      </div>

      <button
        onClick={() => {
          if (cart.length > 0) {
            router.push("/checkout/address");
          }
        }}
        className="py-3 w-full bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
      >
        Alışverişi Tamamla
      </button>
    </div>
  );
}
