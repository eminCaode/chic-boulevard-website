import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
        <div className="text-red-600 text-5xl mb-4">❌</div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Ödeme İptal Edildi
        </h1>
        <p className="text-gray-600 mb-6">
          İşlem tamamlanmadan çıkış yaptınız. Dilerseniz tekrar
          deneyebilirsiniz.
        </p>
        <Link
          href="/cart"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Sepete Geri Dön
        </Link>
      </div>
    </div>
  );
}
