"use client";

import { useState } from "react";

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout başlatılamadı.");
      }
    } catch (error) {
      throw error;
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      style={{
        padding: "1rem",
        backgroundColor: "#6772e5",
        color: "white",
        borderRadius: 4,
        cursor: "pointer",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? "Yönlendiriliyor..." : "Satın Al - $19.99"}
    </button>
  );
}
