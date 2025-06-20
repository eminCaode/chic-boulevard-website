import Image from "next/image";
import bg from "@/public/homepageImage.png";
import Section from "./_components/Section";
import { getProducts } from "./_lib/data-service";
import Link from "next/link";

export default async function Home() {
  const products = await getProducts();
  return (
    <>
      <div className="w-full h-[592px] relative">
        <Image
          src={bg}
          alt="bg"
          fill={true}
          style={{ objectFit: "cover", objectPosition: "top" }}
          quality={100}
          placeholder="blur"
        />
        <div className="absolute inset-0 flex flex-col justify-end items-end text-white bg-black/30 text-center px-4 pb-18 pr-18">
          <Link
            href="/tops"
            className="mt-6 px-5 py-3 cursor-pointer bg-white text-black font-semibold rounded-xl shadow hover:bg-gray-100 transition"
          >
            DISCOVER
          </Link>
        </div>
      </div>

      <Section title="BEST SELLERS" products={products} />
      <Section title="HIGHLIGHTS" products={products} />
      <Section title="DISCOVER NEW PRODUCTS" products={products} />
    </>
  );
}
