import Link from "next/link";
import SignOutButton from "./SignOutButton";
import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineStar, HiOutlineMapPin, HiOutlineCube } from "react-icons/hi2";

function AccountLayoutBar() {
  return (
    <div className="flex flex-col gap-5 bg-white py-10 px-8 w-70 rounded-2xl border border-gray-300">
      <span>
        👋 Welcome, <strong>Emincan</strong>
      </span>
      <Link href="/account/orders">
        <span className="flex gap-1 items-center">
          <HiOutlineCube />
          Orders
        </span>
      </Link>
      <Link href="/account/favorites">
        <span className="flex gap-1 items-center">
          <HiOutlineStar />
          Favorites
        </span>
      </Link>
      <Link href="/account/profile">
        <span className="flex gap-1 items-center">
          <HiOutlineUser />
          Profile
        </span>
      </Link>
      <Link href="/account/address">
        <span className="flex gap-1 items-center">
          <HiOutlineMapPin />
          Address
        </span>
      </Link>

      <SignOutButton />
    </div>
  );
}

export default AccountLayoutBar;
