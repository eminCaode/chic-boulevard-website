import { updateCustomerProfile } from "../_lib/action";

function PersonalInformationForm() {
  return (
    <form
      action={updateCustomerProfile}
      className="bg-white rounded-lg p-10 flex flex-col gap-5 w-125"
    >
      <h1 className="text-2xl font-semibold">Personal Information</h1>
      <div className="flex flex-col gap-1">
        <label htmlFor="first_name" className="text-xs text-gray-500">
          First Name*
        </label>
        <input
          required
          id="first_name"
          type="text"
          name="first_name"
          className="border border-gray-300 rounded-lg p-0.5"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="last_name" className="text-xs text-gray-500">
          Last Name*
        </label>
        <input
          required
          id="last_name"
          type="text"
          name="last_name"
          className="border border-gray-300 rounded-lg p-0.5"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-xs text-gray-500">
          E-mail*
        </label>
        <input
          required
          id="email"
          type="email"
          name="email"
          className="border border-gray-300 rounded-lg p-0.5"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="phone_number" className="text-xs text-gray-500">
          Phone Number*
        </label>
        <input
          required
          id="phone_number"
          type="tel"
          name="phone_number"
          className="border border-gray-300 rounded-lg p-0.5"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="gender" className="text-xs text-gray-500">
          Gender
        </label>
        <div className="flex items-center gap-2">
          <input id="men" value="men" type="radio" name="gender" />
          <label htmlFor="men">Men</label>

          <input id="women" value="women" type="radio" name="gender" />
          <label htmlFor="women">Women</label>
        </div>
      </div>
      <button
        type="submit"
        className="p-2 text-sm cursor-pointer text-white bg-black border border-gray-300 rounded-2xl"
      >
        SAVE
      </button>
    </form>
  );
}

export default PersonalInformationForm;
