"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import ProductModal from "./ProductModal";
import { useRouter } from "next/navigation";
import { useDraggable } from "react-use-draggable-scroll";

const Section = ({ title, products }) => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoverElement, setHoverElement] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [modalProduct, setModalProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const itemsPerPage = 6;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const ref = useRef({});
  const { events } = useDraggable(ref);

  const scrollToIndex = (pageIndex) => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.firstChild;
    const productWidth = card?.offsetWidth || 0;
    const gap = parseInt(window.getComputedStyle(scrollRef.current).gap) || 0;

    const offset = (productWidth + gap) * itemsPerPage * pageIndex;

    scrollRef.current.scrollTo({
      left: offset,
      behavior: "smooth",
    });
    setCurrentIndex(pageIndex);
  };

  const handleSizeClick = (e, product, sizeLabel) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(sizeLabel);
    setModalProduct(product);
    setIsModalOpen(true);
  };

  return (
    <section className="my-12 px-18 relative">
      <h2 className="font-semibold text-2xl mb-8">{title}</h2>
      <div className="relative">
        <button
          onClick={() => {
            const prevPage = Math.max(currentIndex - 1, 0);
            scrollToIndex(prevPage);
          }}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-21
             bg-white text-gray-700 hover:text-white
             hover:bg-black shadow-lg
             border border-gray-300 hover:border-black
             p-3 rounded-full transition-all duration-300 ease-in-out
             flex items-center justify-center cursor-pointer "
          aria-label="Sola Kaydır"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex custom-scroll overflow-hidden gap-4 scrollbar-hide scroll-smooth"
        >
          {products.map((product) => {
            const sizeType = product.categories?.size_type;

            const isWaistLength = sizeType === "waist_length";

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
                : sizeType === "none"
                ? ["STD"]
                : ["bilinmiyor"];

            return (
              <div
                key={product.id}
                className="w-[216px] border border-gray-200 flex-shrink-0 rounded-2xl bg-white overflow-hidden"
                onMouseEnter={() => setHoverElement(product.id)}
                onMouseLeave={() => setHoverElement(null)}
              >
                <div className="relative w-full h-[287px] overflow-hidden border-b border-gray-200 rounded-t-2xl">
                  <Image
                    src={product.imgurl}
                    alt={product.name}
                    onClick={() => router.push(`/product/${product.slug}`)}
                    width={220}
                    height={320}
                    className="rounded-t-2xl w-full h-full object-cover cursor-pointer"
                  />

                  <div
                    className={`absolute left-0 right-0 bottom-0 z-10 transition-all duration-600 ease-in-out ${
                      hoverElement === product.id
                        ? "translate-y-0 opacity-100"
                        : "translate-y-full opacity-0"
                    }`}
                  >
                    <div
                      ref={ref}
                      {...events}
                      className="flex flex-col gap-2 py-2 overflow-y-auto max-h-[160px] scrollbar-hide px-4 w-full bg-white border-t border-gray-200"
                    >
                      {isWaistLength ? (
                        <button
                          onClick={(e) => {
                            handleSizeClick(e, product);
                          }}
                          className="w-full py-2 cursor-pointer"
                        >
                          Sepete ekle
                        </button>
                      ) : (
                        <div className="flex gap-2 flex-wrap">
                          {showSizesArray.map((sizeLabel, index) => {
                            const matchedVariant =
                              product.product_variants.find(
                                (variant) => variant.sizes?.name === sizeLabel
                              );
                            const isOutOfStock =
                              !matchedVariant || matchedVariant.stock <= 0;
                            return (
                              <button
                                key={index}
                                disabled={isOutOfStock}
                                className={`px-3 py-2 text-sm font-medium rounded-md border transition ${
                                  isOutOfStock
                                    ? "opacity-50 cursor-not-allowed border-gray-200"
                                    : "cursor-pointer border-white hover:text-red-800 hover:border hover:border-yellow-400"
                                }`}
                                onClick={(e) => {
                                  if (!isOutOfStock) {
                                    handleSizeClick(e, product, sizeLabel);
                                  }
                                }}
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

                <div
                  className="p-[24px] cursor-pointer"
                  onClick={() => router.push(`/product/${product.slug}`)}
                >
                  <p className="font-medium capitalize">{product.name}</p>
                  <p className="text-gray-700 font-semibold mt-[12px]">
                    ${product.price}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => {
            const nextPage = Math.min(currentIndex + 1, totalPages - 1);
            scrollToIndex(nextPage);
          }}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10
             bg-white text-gray-700 hover:text-white
             hover:bg-black shadow-lg
             border border-gray-300 hover:border-black
             p-3 rounded-full transition-all duration-300 ease-in-out
             flex items-center justify-center cursor-pointer"
          aria-label="Sağa Kaydır"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="flex justify-center mt-10 gap-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToIndex(idx)}
            className={`w-2 h-2 rounded-full cursor-pointer ${
              idx === currentIndex ? "bg-black px-3 transition" : "bg-gray-400"
            }`}
          />
        ))}
      </div>

      {isModalOpen && modalProduct && (
        <ProductModal
          product={modalProduct}
          size={selectedSize}
          onClose={() => setIsModalOpen(false)}
          setSelectedSize={setSelectedSize}
        />
      )}
    </section>
  );
};

export default Section;
