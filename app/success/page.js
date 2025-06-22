"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useEffect } from "react";

export default function SuccessPage() {
  const { clearCart, refreshCart } = useCart();

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
        <div className="text-green-600 text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Ödeme Başarılı!
        </h1>
        <p className="text-gray-600 mb-6">
          Siparişiniz başarıyla oluşturuldu. Ödemeniz için teşekkür ederiz.
        </p>
        <Link
          href="/account/orders"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Siparişlerimi Görüntüle
        </Link>
      </div>
    </div>
  );
}
