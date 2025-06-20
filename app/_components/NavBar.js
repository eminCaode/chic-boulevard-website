"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { HiOutlineUser, HiOutlineShoppingCart } from "react-icons/hi";
import { HiOutlineStar } from "react-icons/hi2";
import CategoryMegaMenu from "./CategoryMegaMenu";
import { groupCategoryChildrenByGender } from "@/app/_lib/groupCategoryChildrenByGender";
import { getCategories } from "../_lib/data-service";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import CartModal from "./CartModal";
import Spinner from "./Spinner";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

function Navbar({ session }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [groupedItems, setGroupedItems] = useState(null);
  const { openCartModal, closeCartModal, cartModal } = useCart();
  const [search, setSearch] = useState("");
  const router = useRouter();
  const topLevelCategorySlugs = [
    "tops",
    "bottoms",
    "outerwear",
    "shoes",
    "accessories",
    "bags",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() === "") return;
    router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  const handleCategoryHover = async (slug) => {
    setActiveMenu(slug);

    const allCategories = await getCategories();
    const grouped = groupCategoryChildrenByGender(slug, allCategories);
    setGroupedItems(grouped);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white h-20 px-8 flex justify-between items-center shadow">
      {/* Logo */}
      <Link href="/">
        <Logo />
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-0.5 h-full  font-semibold text-sm ">
        {topLevelCategorySlugs.map((slug) => (
          <div
            key={slug}
            className="uppercase h-full px-2 py-1 items-center justify-center flex "
            onMouseEnter={() => handleCategoryHover(slug)}
            onMouseLeave={() => {
              setActiveMenu(null);
              setGroupedItems(null);
            }}
          >
            <Link
              href={`/${slug}`}
              className={`cursor-pointer ${
                activeMenu === slug && "text-red-800 transition duration-100"
              }`}
            >
              {slug}
            </Link>

            {activeMenu === slug && groupedItems && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scaleY: 0.98 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0.98 }}
                  transition={{ duration: 0.08, ease: "easeOut" }}
                  style={{ transformOrigin: "top" }}
                  className="absolute top-full left-0 w-full bg-white shadow-lg p-6 rounded-b-2xl z-50 border-t border-gray-300"
                >
                  <CategoryMegaMenu groupedItems={groupedItems} title={slug} />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        ))}
      </div>

      {/* Arama */}
      <form onSubmit={handleSearch} className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="ARA"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 pr-10 rounded-[12px] border border-gray-300 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          <FiSearch size={18} />
        </button>
      </form>

      {/* Kullanıcı İkonları */}
      <div className="flex gap-4 h-full items-center">
        {session?.user?.image ? (
          <Link href="/account/orders" className="w-full">
            <Image
              src={session.user.image}
              alt={session.user.name}
              width={30}
              height={30}
              className="rounded-4xl"
              referrerPolicy="no-referrer"
            />
          </Link>
        ) : (
          <Link href="/account" className="w-full">
            <HiOutlineUser className="h-6 w-6" />
          </Link>
        )}

        <Link href="/account/favorites" className="w-full">
          <HiOutlineStar className="h-6 w-6" />
        </Link>
        <div
          onMouseEnter={() => openCartModal()}
          onMouseLeave={() => closeCartModal()}
          className="h-full flex items-center justify-center"
        >
          <Link href="/cart" className="w-full relative">
            <HiOutlineShoppingCart className="h-6 w-6" />
          </Link>

          {cartModal && (
            <Suspense fallback={<Spinner />}>
              <CartModal session={session} />
            </Suspense>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
