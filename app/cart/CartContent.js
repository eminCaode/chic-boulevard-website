"use client";

import Image from "next/image";
import { deleteFromCart, updateCartQuantity } from "../_lib/action";
import { startTransition } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartContent({ cart }) {
  const router = useRouter();

  const total = cart.reduce((sum, item) => {
    const price = item.product_variant_id?.products?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const handleDelete = (item, e) => {
    e.preventDefault();
    startTransition(async () => {
      await deleteFromCart({
        product_variant_id: item.product_variant_id?.id,
      });
      router.refresh();
    });
  };

  const changeQuantity = (item, diff) => {
    const newQty = item.quantity + diff;
    if (newQty < 1) return;

    startTransition(async () => {
      await updateCartQuantity({
        product_variant_id: item.product_variant_id?.id,
        quantity: newQty,
      });
      router.refresh();
    });
  };
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Image
          src="/box.png"
          alt="Boş Sepet"
          width={160}
          height={160}
          className="mb-6"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sepetiniz boş</h2>
        <p className="text-gray-500 mb-6">
          Henüz bir ürün eklemediniz. Alışverişe başlamak ister misiniz?
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 cursor-pointer bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  return (
    <>
      <h1 className="pt-8 pl-25 text-3xl font-bold mb-4">SEPETİM</h1>
      <div className="pb-8 px-25 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cart.length === 0 ? (
            <p>Sepetiniz boş.</p>
          ) : (
            cart.map((item) => {
              const product = item.product_variant_id?.products;
              return (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-center justify-between border border-gray-300 bg-white rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-5 w-full md:w-1/2">
                    <Link href={`/product/${product?.slug}`}>
                      <Image
                        src={product?.imgurl ?? "/placeholder.jpg"}
                        alt={product?.name ?? "Ürün"}
                        width={100}
                        height={80}
                        className="rounded"
                      />
                    </Link>
                    <div>
                      <Link href={`/product/${product?.slug}`}>
                        <p className="font-medium">{product?.name}</p>
                      </Link>
                      <p className="text-sm text-gray-500">
                        Renk: {item.product_variant_id.colors?.name ?? "-"} ·
                        Beden:{" "}
                        {item.product_variant_id.sizes?.name ??
                          (item.product_variant_id.waist_size?.name &&
                          item.product_variant_id.length_size?.name
                            ? `${item.product_variant_id.waist_size.name} / ${item.product_variant_id.length_size.name}`
                            : "-")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-15 pr-15 mt-4 md:mt-0">
                    <div className="flex items-center gap-2">
                      <button onClick={() => changeQuantity(item, -1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => changeQuantity(item, 1)}>+</button>
                    </div>
                    <span>{product?.price ?? 0} ₺</span>
                    <button
                      onClick={(e) => handleDelete(item, e)}
                      className="hover:underline text-xl cursor-pointer"
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="border border-gray-300 bg-white rounded-lg p-6 shadow-md h-fit">
          <h2 className="text-lg font-semibold mb-4">Sipariş Özeti</h2>
          <div className="flex justify-between mb-2">
            <span>
              Ara Toplam ({cart.reduce((sum, item) => sum + item.quantity, 0)}{" "}
              ürün)
            </span>
            <span>{total.toFixed(2)} ₺</span>
          </div>
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>Kargo</span>
            <span>Sonra Hesaplanacak</span>
          </div>
          <div className="flex justify-between text-red-600 font-medium mb-4 text-sm">
            <span>Üye Ol %10 İndirim Kazan</span>
            <span>-{(total * 0.1).toFixed(2)} ₺</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Toplam</span>
            <span>{(total * 0.9).toFixed(2)} ₺</span>
          </div>
          <button
            onClick={() => router.push("/checkout/address")}
            className="mt-6 w-full cursor-pointer bg-black text-white py-3 rounded-lg text-sm font-semibold"
          >
            Devam Et
          </button>
        </div>
      </div>
    </>
  );
}

function getSizeId(size) {
  const map = {
    XS: 1,
    S: 2,
    M: 3,
    L: 4,
    XL: 5,
    XXL: 6,
  };
  return map[size] ?? 2;
}
