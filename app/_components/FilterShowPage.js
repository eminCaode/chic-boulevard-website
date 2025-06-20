"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import ProductModal from "./ProductModal";
import { FaRegStar, FaStar } from "react-icons/fa";
import { addToFavorites, deleteFromFavorites } from "../_lib/action";
import ThereIsNoProducts from "./ThereIsNoProducts";

function FilterShowPage({ products = [], slugPath, favorites = [] }) {
  const [hoverElement, setHoverElement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [modalProduct, setModalProduct] = useState(null);
  const [favoriteList, setFavoriteList] = useState(favorites);
  const [isPending, startTransition] = useTransition();

  const toggleFavorite = (productId) => {
    startTransition(async () => {
      if (favoriteList.includes(productId)) {
        await deleteFromFavorites(productId);
        setFavoriteList((prev) => prev.filter((id) => id !== productId));
      } else {
        await addToFavorites(productId);
        setFavoriteList((prev) => [...prev, productId]);
      }
    });
  };

  let title = slugPath.length > 1 ? slugPath.at(-1) : slugPath.join(" ");

  if (products.length === 0) return <ThereIsNoProducts />;

  return (
    <div className="px-12 lg:px-20 py-10">
      {/* Başlık */}
      <div className="flex flex-col mb-10 gap-5">
        <span className="text-xs text-gray-400 capitalize">
          home / {slugPath.join(" / ")}
        </span>
        <div className="uppercase text-3xl gap-2 flex items-center">
          <span className="font-semibold">{title}</span>
          <span className="text-xs mt-1 text-gray-500">
            ({products.length} Products)
          </span>
        </div>
      </div>

      {/* Ürünler */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const sizeType = product.categories?.size_type;
          const isFav = favoriteList.includes(product.id);

          const waistSizes = [
            ...new Set(
              product.product_variants
                .map((v) => v.waist_size?.name)
                .filter(Boolean)
            ),
          ];
          const lengthSizes = [
            ...new Set(
              product.product_variants
                .map((v) => v.length_size?.name)
                .filter(Boolean)
            ),
          ];

          const showSizesArray =
            sizeType === "single"
              ? ["XS", "S", "M", "L", "XL", "XXL"]
              : sizeType === "numeric"
              ? ["39", "40", "41", "42", "43", "44"]
              : sizeType === "waist_length"
              ? ["Sepete Ekle"]
              : ["STD"];

          return (
            <div
              key={product.id}
              onMouseEnter={() => setHoverElement(product.id)}
              onMouseLeave={() => setHoverElement(null)}
              className="border border-gray-200 rounded-2xl bg-white overflow-hidden hover:shadow-md transition"
            >
              <Link href={`/product/${product.slug}`}>
                {/* Görsel */}
                <div className="relative w-full h-[425px] border-b border-gray-200">
                  <Image
                    src={product.imgurl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className="absolute z-10 text-3xl right-5 top-5"
                  >
                    {isFav ? <FaStar /> : <FaRegStar />}
                  </button>

                  {/* Hover Beden Seçimi */}
                  <div
                    className={`absolute left-0 right-0 bottom-0 z-10 transition-all duration-600 ease-in-out ${
                      hoverElement === product.id
                        ? "translate-y-0 opacity-100"
                        : "translate-y-full opacity-0"
                    }`}
                  >
                    <div className="flex justify-center items-center py-2 bg-white border-t border-gray-200">
                      {sizeType === "waist_length" ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedSize(""); // ilk başta size değil, waist+length seçilecek
                            setModalProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="px-4 py-2 text-md w-full  text-black rounded-xl cursor-pointer"
                        >
                          Sepete Ekle
                        </button>
                      ) : (
                        <div className="flex gap-1 flex-wrap justify-center">
                          {showSizesArray.map((sizeLabel) => {
                            const matchedVariant =
                              product.product_variants.find(
                                (v) =>
                                  v.sizes?.name === sizeLabel ||
                                  `${v.waist_size?.name} / ${v.length_size?.name}` ===
                                    sizeLabel
                              );

                            const isOutOfStock =
                              !matchedVariant || matchedVariant.stock <= 0;

                            return (
                              <button
                                onClick={(e) => {
                                  if (!isOutOfStock) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedSize(sizeLabel);
                                    setModalProduct(product);
                                    setIsModalOpen(true);
                                  }
                                }}
                                disabled={isOutOfStock}
                                key={sizeLabel}
                                className={`px-3 py-2 text-sm font-medium rounded-md border ${
                                  isOutOfStock
                                    ? "opacity-50 cursor-not-allowed border-gray-200"
                                    : "cursor-pointer border-white hover:text-red-800 hover:border hover:border-yellow-400"
                                }`}
                              >
                                {sizeLabel}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Bilgi */}
              <div
                className="p-4 cursor-pointer"
                onClick={() =>
                  (window.location.href = `/product/${product.slug}`)
                }
              >
                <p className="text-md mb-6 font-medium capitalize">
                  {product.name}
                </p>
                <p className="text-gray-700 font-semibold">${product.price}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && modalProduct && (
        <ProductModal
          product={modalProduct}
          size={selectedSize}
          onClose={() => setIsModalOpen(false)}
          setSelectedSize={setSelectedSize}
        />
      )}
    </div>
  );
}

export default FilterShowPage;
