import { Suspense } from "react";
import { auth } from "../_lib/auth";
import CartContent from "./CartContent";
import Spinner from "../_components/Spinner";
import { getCart } from "../_lib/action";
import { redirect } from "next/navigation";

export default async function CartPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const customerId = session.user.customerId;
  const cart = await getCart(customerId);

  return (
    <Suspense fallback={<Spinner />}>
      <CartContent cart={cart} />
    </Suspense>
  );
}
