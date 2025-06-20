// app/search/page.js
import { getFilteredProducts } from "@/app/_lib/action";
import SearchPageClient from "./SearchPageClient";

export default async function SearchPage({ searchParams }) {
  const query = searchParams.q || "";
  const results = await getFilteredProducts(query);

  return <SearchPageClient results={results} />;
}
