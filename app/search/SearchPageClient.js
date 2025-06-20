"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import ProductModal from "@/app/_components/ProductModal";
import { FaRegStar, FaStar } from "react-icons/fa";
import { addToFavorites, deleteFromFavorites } from "@/app/_lib/action";

export default function SearchPageClient({ results = [] }) {
  const [hoverElement, setHoverElement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [modalProduct, setModalProduct] = useState(null);
  const [favoriteList, setFavoriteList] = useState([]);
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

  if (!results.length) {
    return (
      <div className="flex flex-col items-center justify-center px-12 lg:px-20 py-20 text-gray-600 rounded-xl ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mb-6 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Üzgünüz, sonuç bulunamadı
        </h2>
        <p className="text-sm text-gray-500 mb-4 text-center max-w-md">
          Aradığınız kriterlere uygun ürün bulamadık. Yazım hatası olmadığından
          emin olun ya da farklı anahtar kelimeler deneyin.
        </p>
        <button
          onClick={() => window.history.back()}
          className="text-sm text-white cursor-pointer bg-black px-4 py-2 rounded-lg hover:bg-gray-900 transition"
        >
          Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div className="px-12 lg:px-20 py-10">
      <p className="text-gray-400 text-xs mb-4">Home / Arama Sonuçları</p>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Arama Sonuçları ({results.length} Ürün)
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((product) => {
          const sizeType = product.categories?.size_type;
          const isFav = favoriteList.includes(product.id);

          const showSizesArray =
            sizeType === "single"
              ? ["XS", "S", "M", "L", "XL", "XXL"]
              : sizeType === "numeric"
              ? ["39", "40", "41", "42", "43", "44"]
              : ["STD"];

          return (
            <div
              key={product.id}
              onMouseEnter={() => setHoverElement(product.id)}
              onMouseLeave={() => setHoverElement(null)}
              className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-md transition"
            >
              {/* Görsel */}
              <div className="relative w-full h-[425px] border-b border-gray-200">
                <Link href={`/product/${product.slug}`}>
                  <Image
                    src={product.imgurl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </Link>

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
                          setSelectedSize(""); // ilk başta size değil
                          setModalProduct(product);
                          setIsModalOpen(true);
                        }}
                        className="px-4 py-2 text-md w-full cursor-pointer  text-black rounded-xl "
                      >
                        Sepete Ekle
                      </button>
                    ) : (
                      <div className="flex gap-1 flex-wrap justify-center">
                        {showSizesArray.map((sizeLabel) => {
                          const matchedVariant = product.product_variants.find(
                            (variant) => variant.sizes?.name === sizeLabel
                          );

                          const isOutOfStock =
                            !matchedVariant || matchedVariant.stock <= 0;

                          return (
                            <button
                              key={sizeLabel}
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
                              className={`px-3 py-2 text-sm font-medium rounded-md transition border border-white ${
                                isOutOfStock
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:text-red-800 hover:border-yellow-400"
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

              {/* Bilgi */}
              <div className="p-4">
                <Link href={`/product/${product.slug}`}>
                  <p className="text-md mb-6 font-medium capitalize">
                    {product.name}
                  </p>
                </Link>
                <p className="text-gray-700 font-semibold mt-2">
                  ${product.price}
                </p>
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
