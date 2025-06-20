"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useTransition } from "react";
import { addToCart } from "../_lib/action";
import { useCart } from "../context/CartContext";

function ProductModal({ product, size, setSelectedSize, onClose }) {
  const [clickContinue, setClickContinue] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef();
  const { refreshCart } = useCart();

  const [selectedWaist, setSelectedWaist] = useState("");
  const [selectedLength, setSelectedLength] = useState("");

  const sizeType = product.categories?.size_type;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      (sizeType === "waist_length" && (!selectedWaist || !selectedLength)) ||
      (sizeType !== "waist_length" && !size)
    ) {
      setError("Lütfen geçerli bir beden seçin.");
      return;
    }

    const cartData =
      sizeType === "waist_length"
        ? {
            product_id: product.id,
            waist_id: getWaistId(selectedWaist, product),
            length_id: getLengthId(selectedLength, product),
            quantity: 1,
          }
        : {
            product_id: product.id,
            size_id: getSizeId(size),
            color_id: 2,
            quantity: 1,
          };
    console.log("Sepete eklenmek istenen veriler:", cartData);
    console.log("Waist ID:", getWaistId(selectedWaist, product));
    console.log("Length ID:", getLengthId(selectedLength, product));

    console.log("Varyantlarda waist ve length isimleri:");
    console.log(product.product_variants.map((v) => v.waist_size?.name));
    console.log(product.product_variants.map((v) => v.length_size?.name));
    console.log("Seçilen:", selectedWaist, selectedLength);

    startTransition(async () => {
      try {
        await addToCart(cartData);
        setClickContinue(true);
        refreshCart();
      } catch (err) {
        setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    });
  };

  const showSizesArray =
    sizeType === "single"
      ? ["XS", "S", "M", "L", "XL", "XXL"]
      : sizeType === "numeric"
      ? ["39", "40", "41", "42", "43", "44"]
      : ["STD"];

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 bg-opacity-50">
      <div className="relative bg-white w-[650px] h-[400px] rounded-2xl flex shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 text-xl hover:text-black"
        >
          ✕
        </button>

        <div className="w-[300px] overflow-hidden rounded-l-2xl">
          <Image
            src={product.imgurl}
            alt={product.name}
            width={300}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-1/2 p-6">
          {!clickContinue ? (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 py-5"
            >
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="font-normal">{product.price} $</p>

              {sizeType === "waist_length" ? (
                <>
                  <p className="text-sm text-gray-500">Waist:</p>
                  <div className="flex gap-2 flex-wrap">
                    {getWaistArray(product).map((waist) => {
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
                          } ${
                            isDisabled ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {waist}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-sm text-gray-500 mt-2">Length:</p>
                  <div className="flex gap-2 flex-wrap">
                    {getLengthArray(product).map((length) => {
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
                          } ${
                            isDisabled ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {length}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-500">BEDEN:</p>
                  <div className="flex gap-3 flex-wrap">
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
                          className={`px-5 py-2 rounded-xl text-sm font-medium transition cursor-pointer
                            ${
                              sizeLabel === size
                                ? "border-yellow-400 border text-red-800"
                                : "border border-gray-200 hover:text-red-800 hover:border-yellow-400"
                            }
                            ${
                              isOutOfStock
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          onClick={() => {
                            setSelectedSize(sizeLabel);
                            setError(null);
                          }}
                        >
                          {sizeLabel}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={isPending}
                className="mt-4 px-4 py-2 text-white bg-black rounded-2xl text-center w-full cursor-pointer hover:bg-gray-900 transition"
              >
                {isPending ? "Ekleniyor..." : "Continue"}
              </button>
            </form>
          ) : (
            <div className="flex flex-col w-full justify-center gap-4 py-5">
              <p className="text-green-600 font-medium">
                ✅ Ürün sepete eklendi.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Sepete giderek işlemi tamamlayabilir ya da alışverişe devam
                edebilirsiniz.
              </p>
              <div className="flex mt-4 gap-2 text-sm">
                <button
                  className="px-4 py-2 text-red-700 border border-gray-300 rounded-lg cursor-pointer hover:text-red-900"
                  onClick={onClose}
                >
                  Alışverişe Devam
                </button>
                <Link
                  href="/cart"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
                >
                  Sepete Git
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductModal;

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
  const map = {
    "28W": 16,
    "30W": 17,
    "32W": 18,
    "34W": 19,
    "36W": 20,
  };
  return map[name] ?? null;
}

function getLengthId(name) {
  const map = {
    "28L": 21,
    "30L": 22,
    "32L": 23,
    "34L": 24,
    "36L": 25,
  };
  return map[name] ?? null;
}

function getSizeId(selectedSize) {
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
  };
  return map[selectedSize] ?? null;
}
