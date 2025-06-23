"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { createStripeSession } from "@/app/_lib/action";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    if (!orderId) return;

    async function redirectToStripe() {
      try {
        const url = await createStripeSession(orderId);
        window.location.href = url; // ✅ doğru yönlendirme
      } catch (err) {
        console.error(err);
        alert("Ödeme başlatılamadı.");
      }
    }

    redirectToStripe();
  }, [orderId]);

  return (
    <div className="text-center py-20">
      <h1 className="text-xl font-semibold">Stripea yönlendiriliyorsunuz...</h1>
    </div>
  );
}
