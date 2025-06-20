"use client";
import { addToCart, deleteFromFavorites } from "@/app/_lib/action";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

function FavoriteClientPage({ favorites }) {
  console.log("favorites", favorites);
  const [favList, setFavList] = useState(favorites);
  const [selectedSizes, setSelectedSizes] = useState({});
  const { refreshCart } = useCart();
  const [loadingProductId, setLoadingProductId] = useState(null);

  const removeFromFavorite = async (productId) => {
    await deleteFromFavorites(productId);
    setFavList((prev) => prev.filter((f) => f.products.id !== productId));
  };

  const handleAddToCart = async (product) => {
    const selectedSize = selectedSizes[product.id];
    if (!selectedSize) {
      alert("Lütfen beden seçiniz.");
      return;
    }
    setLoadingProductId(product.id);

    const cartData = {
      product_id: product.id,
      size_id: getSizeId(selectedSize),
      color_id: 2,
      quantity: 1,
    };
    await addToCart(cartData);
    refreshCart();

    setLoadingProductId(null);
  };
  return (
    <div className="pr-10 pb-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Favorilerim</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {favList.map((f) => (
          <div
            key={f.products.id}
            className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative">
              <Link className="" href={`/product/${f.products.slug}`}>
                <div className="w-full h-70 ">
                  <Image
                    src={f.products.imgurl}
                    alt={f.products.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromFavorite(f.products.id);
                }}
                className="absolute z-10 text-3xl right-5 top-5"
              >
                <FaStar />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-2">
              <Link href={`/product/${f.products.slug}`}>
                <h2 className="text-xl font-semibold text-gray-700">
                  {f.products.name}
                </h2>
              </Link>
              <p className="text-lg text-gray-600">{f.products.price} ₺</p>

              <div className="flex items-center gap-2 justify-between mt-4">
                <select
                  name="sizeOption"
                  value={selectedSizes[f.products.id] || ""}
                  onChange={(e) =>
                    setSelectedSizes((prev) => ({
                      ...prev,
                      [f.products.id]: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="" disabled>
                    Select
                  </option>

                  {[
                    ...new Set(
                      f.products.product_variants
                        ?.filter((v) => v.stock > 0)
                        ?.map((variant) => {
                          if (variant.size?.name) return variant.size.name;
                          if (variant.waist?.name && variant.length?.name)
                            return `${variant.waist.name} / ${variant.length.name}`;
                          return null;
                        })
                        .filter(Boolean) // null/undefined varsa at
                    ),
                  ].map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(f.products);
                  }}
                  disabled={loadingProductId === f.products.id}
                  className="bg-black  text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  {loadingProductId === f.products.id
                    ? "Ekleniyor..."
                    : "Sepete Ekle"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoriteClientPage;

function getSizeId(selectedSize) {
  const map = {
    XS: 1,
    S: 2,
    M: 3,
    L: 4,
    XL: 5,
    XXL: 6,
  };
  return map[selectedSize] ?? 2; // default fallback
}
