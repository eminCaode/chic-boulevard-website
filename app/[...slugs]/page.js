import FilterShowPage from "../_components/FilterShowPage";
import { getFavorites } from "../_lib/action";
import { auth } from "../_lib/auth"; // 👈 EKLENDİ

import {
  getCategories,
  buildCategoryMap,
  getDescendantIds,
  getProductsByCategoryTree,
  findBestCategoryMatch,
  findAllMatchingCategoriesBySlug,
} from "../_lib/data-service";

export default async function Page({ params }) {
  const session = await auth(); // 👈 EKLENDİ

  const { slugs } = await params;
  const allCategories = await getCategories();
  const map = buildCategoryMap(allCategories);

  let matchedCategories = [];

  if (slugs.length === 1) {
    matchedCategories = findAllMatchingCategoriesBySlug(
      slugs[0],
      allCategories
    );
  } else {
    const fullPath = slugs.join("/");
    const exactMatch = allCategories.find((cat) => cat.full_path === fullPath);
    const fallbackMatch = findBestCategoryMatch(slugs, allCategories);

    if (exactMatch) matchedCategories = [exactMatch];
    else if (fallbackMatch) matchedCategories = [fallbackMatch];
  }

  if (matchedCategories.length === 0) {
    return <div className="p-8 text-red-700 text-lg">Kategori bulunamadı.</div>;
  }

  const allCategoryIds = matchedCategories.flatMap((cat) =>
    getDescendantIds(map, cat.id)
  );

  const uniqueCategoryIds = [...new Set(allCategoryIds)];
  const products = await getProductsByCategoryTree(uniqueCategoryIds);

  // 👇 Eğer session varsa customerId kullan, yoksa boş dizi dön
  let favorites = [];
  if (session?.user?.customerId) {
    favorites = await getFavorites(session.user.customerId);
  }

  return (
    <div>
      <FilterShowPage
        products={products}
        slugPath={slugs}
        favorites={favorites}
        categoryName={matchedCategories[0]?.name || ""}
        productCount={products.length}
      />
    </div>
  );
}
