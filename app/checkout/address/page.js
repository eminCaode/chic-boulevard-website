import { getAddress } from "@/app/_lib/action";
import CheckoutAddressClient from "./CheckoutAddressClient";

async function page() {
  const addresses = await getAddress();
  return (
    <div>
      <CheckoutAddressClient addresses={addresses} />
    </div>
  );
}

export default page;
