"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AddressForm from "@/app/_components/AddressForm";
import { createOrderFromAddress } from "@/app/_lib/action";

export default function CheckoutAddressClient({ addresses }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [addressList, setAddressList] = useState(addresses);

  const handleSelect = async (addressId) => {
    try {
      const orderId = await createOrderFromAddress(addressId);
      router.push(`/checkout/payment?order_id=${orderId}`);
    } catch (err) {
      alert("Sipariş oluşturulamadı.");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Teslimat Adresi Seç</h1>

      {showForm ? (
        <AddressForm
          setShowForm={setShowForm}
          onSaved={async () => {
            setShowForm(false);
            const res = await fetch("/api/user/addresses");
            const data = await res.json();
            setAddressList(data);
          }}
        />
      ) : (
        <>
          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white py-2 px-4 rounded mb-6"
          >
            Yeni Adres Ekle
          </button>

          <div className="space-y-4">
            {addressList.map((address) => (
              <div
                key={address.id}
                className="border p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">{address.title}</div>
                  <div>{address.address}</div>
                  <div>
                    {address.province} / {address.city} - {address.postal_code}
                  </div>
                </div>
                <button
                  onClick={() => handleSelect(address.id)}
                  className="bg-black cursor-pointer text-white px-4 py-2 rounded"
                >
                  Bu Adresi Kullan
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
