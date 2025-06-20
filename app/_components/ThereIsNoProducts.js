import Image from "next/image";
import Link from "next/link";

function ThereIsNoProducts() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <Image
        src="/box.png" // Bu görseli `public` klasörüne eklemeyi unutma
        alt="No products found"
        width={150}
        height={150}
        className="mb-6 opacity-70"
      />
      <h2 className="text-2xl font-semibold text-gray-700">Ürün bulunamadı</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        Seçtiğiniz kategoriye ait ürünler şu anda mevcut değil. Filtreleri
        değiştirerek tekrar deneyebilirsiniz.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900 transition"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}

export default ThereIsNoProducts;
