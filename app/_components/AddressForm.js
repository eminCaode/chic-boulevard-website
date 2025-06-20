import { addCustomerAddress, updateCustomerAddress } from "../_lib/action";

function AddressForm({ setShowForm, addressInfo }) {
  return (
    <form
      action={addressInfo ? updateCustomerAddress : addCustomerAddress}
      className="bg-white rounded-lg p-10 flex flex-col gap-5 w-full"
    >
      <h1 className="text-2xl font-semibold">Address Information</h1>

      <div className=" flex flex-row gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="first_name" className="text-xs text-gray-500">
            First name*
          </label>
          <input
            defaultValue={addressInfo?.first_name}
            id="first_name"
            name="first_name"
            maxLength={20}
            type="text"
            required
            className="border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="last_name" className="text-xs text-gray-500">
            Last name*
          </label>
          <input
            defaultValue={addressInfo?.last_name}
            id="last_name"
            name="last_name"
            maxLength={20}
            type="text"
            required
            className="border border-gray-300 rounded-lg p-2"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-xs text-gray-500">
          Address Title*
        </label>
        <input
          defaultValue={addressInfo?.title}
          id="title"
          name="title"
          maxLength={20}
          type="text"
          required
          className="border border-gray-300 rounded-lg p-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="address" className="text-xs text-gray-500">
          Address Line*
        </label>
        <textarea
          defaultValue={addressInfo?.address}
          id="address"
          rows={4}
          name="address"
          type="text"
          required
          className="border resize-none border-gray-300 rounded-lg p-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="province" className="text-xs text-gray-500">
          Province*
        </label>
        <input
          defaultValue={addressInfo?.province}
          maxLength={40}
          id="province"
          name="province"
          required
          className="border border-gray-300 rounded-lg p-2"
        ></input>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="city" className="text-xs text-gray-500">
          City*
        </label>
        <input
          defaultValue={addressInfo?.city}
          maxLength={40}
          id="city"
          name="city"
          type="text"
          required
          className="border border-gray-300 rounded-lg p-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="country" className="text-xs text-gray-500">
          Country*
        </label>
        <input
          defaultValue={addressInfo?.country}
          maxLength={40}
          id="country"
          name="country"
          type="text"
          required
          className="border border-gray-300 rounded-lg p-2"
        />
      </div>
      <div className=" flex flex-row gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="postal_code" className="text-xs text-gray-500">
            Postal Code*
          </label>
          <input
            defaultValue={addressInfo?.postal_code}
            maxLength={5}
            id="postal_code"
            name="postal_code"
            type="text"
            required
            className="border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone_number" className="text-xs text-gray-500">
            Phone number*
          </label>
          <input
            defaultValue={addressInfo?.phone_number}
            id="phone_number"
            name="phone_number"
            type="tel"
            required
            className="border border-gray-300 rounded-lg p-2"
          />
        </div>
      </div>
      <div className="w-full flex flex-row gap-1">
        <button
          onClick={() => setShowForm(false)}
          type="reset"
          className="w-full p-2 text-sm cursor-pointer text-white bg-black border border-gray-300 rounded-2xl"
        >
          CANCEL
        </button>

        <button
          type="submit"
          className=" w-full p-2 text-sm cursor-pointer text-white bg-black border border-gray-300 rounded-2xl"
        >
          SAVE
        </button>
      </div>
    </form>
  );
}

export default AddressForm;
