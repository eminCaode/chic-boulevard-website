"use client";
import Image from "next/image";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FiInfo, FiTruck, FiCreditCard } from "react-icons/fi";
import {
  addToCart,
  addToFavorites,
  deleteFromFavorites,
} from "@/app/_lib/action";
import { useState, useTransition } from "react";
import { useCart } from "@/app/context/CartContext";

export default function ProductDetailClient({ product, favorite }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedWaist, setSelectedWaist] = useState("");
  const [selectedLength, setSelectedLength] = useState("");
  const [isPending, startTransition] = useTransition();
  const { refreshCart, openCartModal } = useCart();
  const [isFavorite, setIsFavorite] = useState(favorite);
  const [error, setError] = useState("");

  const toggleFavorite = () => {
    startTransition(async () => {
      isFavorite
        ? await deleteFromFavorites(product.id)
        : await addToFavorites(product.id);
      setIsFavorite((prev) => !prev);
    });
  };

  const sizeType = product.categories?.size_type;

  const handleForm = () => {
    if (sizeType === "waist_length" && (!selectedWaist || !selectedLength)) {
      setError("Lütfen bel ve boy ölçüsü seçin.");
      return;
    }
    if (sizeType !== "waist_length" && !selectedSize) {
      setError("Lütfen beden seçin.");
      return;
    }

    const cartData =
      sizeType === "waist_length"
        ? {
            product_id: product.id,
            waist_id: getWaistId(selectedWaist),
            length_id: getLengthId(selectedLength),
            quantity: 1,
          }
        : {
            product_id: product.id,
            size_id: getSizeId(selectedSize),
            color_id: product.product_variants[0]?.color_id,
            quantity: 1,
          };

    setError("");
    startTransition(async () => {
      await addToCart(cartData);
      await refreshCart();
      openCartModal();
      setSelectedSize("");
      setSelectedWaist("");
      setSelectedLength("");
    });
  };

  const showWaists = getWaistArray(product);
  const showLengths = getLengthArray(product);
  const showSizesArray =
    sizeType === "single"
      ? ["XS", "S", "M", "L", "XL", "XXL"]
      : sizeType === "numeric"
      ? ["39", "40", "41", "42", "43", "44"]
      : ["STD"];

  return (
    <div className="md:p-12 max-w-screen-xl mx-auto">
      <p className="text-gray-400 text-xs mb-4">
        Home / Women / Clothing / Tops / {product.name}
      </p>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex flex-col w-full max-h-[800px] overflow-y-auto lg:w-3/5 gap-2">
          <div className="relative w-full h-[800px] rounded-xl overflow-hidden shadow-sm bg-white">
            <Image
              src={product.imgurl}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Image
                key={i}
                src={product.imgurl}
                alt={`${product.name} thumbnail ${i + 1}`}
                width={100}
                height={80}
                className="object-cover rounded-md"
              />
            ))}
          </div>
        </div>

        <div className="w-full lg:w-2/5 space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold text-gray-800">
            {product.price} $
          </p>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">SIZE</h4>
            {sizeType === "waist_length" ? (
              <>
                <p className="text-sm text-gray-500">Waist:</p>
                <div className="flex gap-2 flex-wrap mb-2">
                  {showWaists.map((waist) => {
                    const isDisabled = !product.product_variants.some(
                      (v) => v.waist_size?.name === waist
                    );
                    return (
                      <button
                        key={waist}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          setSelectedWaist(waist);
                          setError(null);
                        }}
                        className={`px-4 py-2 rounded-xl text-sm border transition ${
                          selectedWaist === waist
                            ? "border-yellow-400 text-red-800"
                            : "border-gray-200 hover:text-red-800 hover:border-yellow-400"
                        } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {waist}
                      </button>
                    );
                  })}
                </div>

                <p className="text-sm text-gray-500 mt-2">Length:</p>
                <div className="flex gap-2 flex-wrap">
                  {showLengths.map((length) => {
                    const isDisabled = !product.product_variants.some(
                      (v) =>
                        v.waist_size?.name === selectedWaist &&
                        v.length_size?.name === length
                    );
                    return (
                      <button
                        key={length}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          setSelectedLength(length);
                          setError(null);
                        }}
                        className={`px-4 py-2 rounded-xl text-sm border transition ${
                          selectedLength === length
                            ? "border-yellow-400 text-red-800"
                            : "border-gray-200 hover:text-red-800 hover:border-yellow-400"
                        } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {length}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {showSizesArray.map((sizeLabel) => {
                  const matchedVariant = product.product_variants.find(
                    (variant) => variant.sizes?.name === sizeLabel
                  );
                  const isOutOfStock =
                    !matchedVariant || matchedVariant.stock <= 0;
                  return (
                    <button
                      key={sizeLabel}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSize(sizeLabel)}
                      className={`px-4 py-2 rounded-xl text-sm border transition ${
                        selectedSize === sizeLabel
                          ? "border-yellow-400 text-red-800"
                          : "border-gray-200 hover:text-red-800 hover:border-yellow-400"
                      } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {sizeLabel}
                    </button>
                  );
                })}
              </div>
            )}
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            <p className="text-sm text-gray-500 mt-2 cursor-pointer">
              📝 Size Table
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleForm}
              disabled={isPending}
              className={`flex-1 text-white font-semibold text-sm rounded-md py-3 px-4 transition
                ${
                  isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-900"
                }`}
            >
              {isPending ? "Adding..." : "ADD TO CART"}
            </button>

            <button
              type="button"
              className="bg-white border border-gray-300 p-3 rounded-md hover:border-red-500"
              onClick={toggleFavorite}
            >
              {isFavorite ? (
                <FaStar className="text-black" />
              ) : (
                <FaRegStar className="text-black" />
              )}
            </button>
          </div>

          <div className="space-y-3 pt-6">
            <DropdownItem icon={<FiInfo />} title="ÜRÜN BİLGİSİ" />
            <DropdownItem
              icon={<FiTruck />}
              title="TESLİMAT VE İADE KOŞULLARI"
            />
            <DropdownItem icon={<FiCreditCard />} title="TAKSİT SEÇENEKLERİ" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DropdownItem({ icon, title }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-md hover:shadow-sm cursor-pointer">
      <div className="flex items-center gap-3 text-sm font-medium">
        {icon}
        {title}
      </div>
      <span className="text-xl text-gray-400">›</span>
    </div>
  );
}

function getWaistArray(product) {
  return [
    ...new Set(
      product.product_variants.map((v) => v.waist_size?.name).filter(Boolean)
    ),
  ];
}

function getLengthArray(product) {
  return [
    ...new Set(
      product.product_variants.map((v) => v.length_size?.name).filter(Boolean)
    ),
  ];
}

function getWaistId(name) {
  const map = { "28W": 16, "30W": 17, "32W": 18, "34W": 19, "36W": 20 };
  return map[name] ?? null;
}

function getLengthId(name) {
  const map = { "28L": 21, "30L": 22, "32L": 23, "34L": 24, "36L": 25 };
  return map[name] ?? null;
}

function getSizeId(name) {
  const map = {
    XS: 1,
    S: 2,
    M: 3,
    L: 4,
    XL: 5,
    XXL: 6,
    36: 7,
    37: 8,
    38: 9,
    39: 10,
    40: 11,
    41: 12,
    42: 13,
    43: 14,
    44: 15,
    STD: 26,
  };
  return map[name] ?? null;
}
