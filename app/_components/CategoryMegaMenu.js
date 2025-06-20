"use client";

import Image from "next/image";
import Link from "next/link";

export default function CategoryMegaMenu({ groupedItems, title }) {
  console.log("groupedItems:", groupedItems);
  return (
    <div className=" flex flex-row gap-15 py-8 px-15 justify-between items-start ">
      <h1 className="text-3xl font-semibold">{title}</h1>
      {Object.entries(groupedItems).map(([gender, items]) => (
        <div key={gender}>
          <Link
            href={`/${gender}/${title}`}
            className="text-gray-800 font-semibold mb-2"
          >
            {gender}
          </Link>
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.id}>
                {console.log(item)}
                <Link
                  href={`/${item.full_path}`}
                  className=" text-sm hover:underline capitalize "
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
