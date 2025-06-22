"use client";
import AddressForm from "@/app/_components/AddressForm";
import { deleteAddress } from "@/app/_lib/action";
import { useState } from "react";

function AddressClientPage({ addresses }) {
  const [showForm, setShowForm] = useState(false);
  const [addressList, setAddressList] = useState(addresses);
  const [addressInfo, setAddressInfo] = useState(addresses);

  const handleDeleteAddress = async (id) => {
    await deleteAddress(id);
    setAddressList((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdateAddress = async (address) => {
    const addressInfo = {
      id: address.id,
      first_name: address.first_name,
      last_name: address.last_name,
      customer_id: address.customer_id,
      title: address.title,
      address: address.address,
      province: address.province,
      city: address.city,
      country: address.country,
      postal_code: address.postal_code,
      phone_number: address.phone_number,
    };
    setAddressInfo(addressInfo);
    setShowForm(true);
  };
  return (
    <div className="flex flex-col gap-3">
      {showForm ? (
        <AddressForm setShowForm={setShowForm} addressInfo={addressInfo} />
      ) : (
        <div className="flex flex-col gap-5 ">
          <h1>MY ADDRESSES</h1>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-md max-w-50 text-white bg-black px-3 py-3"
          >
            Add new address
          </button>
          {addressList.map((address) => {
            return (
              <div
                className="flex flex-row h-30 w-250 border justify-between items-center border-gray-300 p-5 rounded-2xl"
                key={address.id}
              >
                <div className="flex flex-row gap-10 items-center">
                  <div>{address.title}</div>
                  <div>
                    <div>
                      {address.first_name} {address.last_name}
                    </div>
                    <div>{address.address}</div>
                    <div>
                      <div>
                        {address.province} / {address.city}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-2 text-xs h-full ">
                  <button onClick={() => handleUpdateAddress(address)}>
                    UPDATE
                  </button>
                  <button onClick={() => handleDeleteAddress(address.id)}>
                    DELETE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AddressClientPage;
