import { Suspense } from "react";
import Navbar from "./NavBar";
import { auth } from "../_lib/auth";
import Spinner from "./Spinner";

async function Header() {
  const session = await auth();
  console.log(session);
  return (
    <header>
      <Suspense fallback={<Spinner />}>
        <Navbar session={session} />
      </Suspense>
    </header>
  );
}

export default Header;
