export function groupCategoryChildrenByGender(slug, categories) {
  const result = {};

  // 1. Tüm slug eşleşen kategorileri bul (örn. tüm "tops")
  const matching = categories.filter((cat) => cat.slug === slug);

  for (const cat of matching) {
    let gender = "";
    let children = "";
    // 2. parent → clothing | grandParent → men/women/unisex
    const parent = categories.find((p) => p.id === cat.parent_id);
    if (
      parent.name === "men" ||
      parent.name === "women" ||
      parent.name === "unisex"
    ) {
      gender = parent?.name || "Other";
      children = categories.filter((c) => c.parent_id === cat.id);
    } else {
      const grandParent =
        parent && categories.find((p) => p.id === parent.parent_id);

      gender = grandParent?.name || "Other";
      children = categories.filter((c) => c.parent_id === cat.id);
    }

    // 3. Alt kategorileri bul

    if (!result[gender]) result[gender] = [];
    result[gender].push(...children);
  }

  return result;
}
