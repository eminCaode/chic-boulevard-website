import { getAddress } from "@/app/_lib/action";
import AddressClientPage from "./AddressClientPage";

async function page() {
  const addresses = await getAddress();
  return <AddressClientPage addresses={addresses} />;
}

export default page;
