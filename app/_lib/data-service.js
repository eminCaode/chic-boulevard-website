import supabase from "./supabase";

export const getProducts = async function () {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
  *,
  categories(size_type),
  product_variants(
    *,
    waist_size:sizes!fk_waist_size(name),
    length_size:sizes!fk_length_size(name),
    sizes:sizes!product_variants_size_id_fkey(name)
  )
`
    )
    .order("name");
  if (error) {
    console.error(error);
    throw new Error("Products could not be loaded");
  }
  return data;
};

export const getCategories = async function () {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) {
    console.error(error);
    throw new Error("Categories could not be loaded");
  }
  return data;
};

// full_path'e göre kategori çek
export async function getCategoryByFullPath(path) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .like("full_path", path)
    .maybeSingle();

  if (error) {
    console.error("Kategori bulunamadı:", error.message);
    return null;
  }

  return data;
}

export async function getProductsByCategory(categoryId) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId);

  if (error) {
    console.error("Ürün çekme hatası:", error.message);
    return [];
  }

  return data;
}

// Kategorileri parent_id'ye göre hiyerarşik ağaç haline getir
export function buildCategoryMap(categories) {
  const map = {};
  categories.forEach((cat) => {
    map[cat.id] = { ...cat, children: [] };
  });
  categories.forEach((cat) => {
    if (cat.parent_id) {
      map[cat.parent_id]?.children.push(map[cat.id]);
    }
  });
  return map;
}

// Bir kategorinin altındaki tüm id'leri döner (kendi dahil)
export function getDescendantIds(map, rootId) {
  const ids = [rootId];
  const stack = [rootId];
  while (stack.length) {
    const current = stack.pop();
    const node = map[current];
    if (node?.children) {
      for (const child of node.children) {
        ids.push(child.id);
        stack.push(child.id);
      }
    }
  }
  return ids;
}

export async function getProductsByCategoryTree(categoryIds) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
  *,
  categories(size_type),
  product_variants(
    *,
    waist_size:sizes!fk_waist_size(name),
    length_size:sizes!fk_length_size(name),
    sizes:sizes!product_variants_size_id_fkey(name)
  )
`
    )
    .in("category_id", categoryIds);

  if (error) {
    console.error("Ürün çekme hatası:", error.message);
    return [];
  }

  return data;
}

export function findBestCategoryMatch(slugs, allCategories) {
  const inputPath = slugs.join("/");

  const match = allCategories.find(
    (cat) =>
      cat.full_path.endsWith(slugs.at(-1)) && // örn: "tops"
      cat.full_path.startsWith(slugs[0]) // örn: "men"
  );

  return match || null;
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-") // boşluklar ve özel karakterler yerine tire
    .replace(/^-+|-+$/g, ""); // baş ve sondaki tireleri sil
}

export function findAllMatchingCategoriesBySlug(slug, allCategories) {
  return allCategories.filter((cat) => cat.full_path.endsWith(slug));
}

async function generateAndUpdateProductSlugs() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name");

  if (error) {
    console.error("Ürünler alınamadı:", error);
    return;
  }

  for (const product of products) {
    const slug = slugify(product.name);

    const { error: updateError } = await supabase
      .from("products")
      .update({ slug })
      .eq("id", product.id);

    if (updateError) {
      console.error(
        `Slug güncellenemedi (${product.id}):`,
        updateError.message
      );
    } else {
      console.log(`Slug güncellendi: ${product.name} → ${slug}`);
    }
  }
}

export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
  *,
  categories(size_type),
  product_variants(
    *,
    waist_size:sizes!fk_waist_size(name),
    length_size:sizes!fk_length_size(name),
    sizes:sizes!product_variants_size_id_fkey(name)
  )
`
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Ürün alınamadı:", error.message);
    return null;
  }

  return data;
}

export async function createCustomer({ email, fullName, auth_id }) {
  const [first_name, ...rest] = fullName.split(" ");
  const last_name = rest.join(" ") || "";

  const { data, error } = await supabase.from("customers").insert([
    {
      email,
      first_name,
      last_name,
      auth_id, // 🔥 burası eklendi
    },
  ]);

  if (error) {
    console.error("Müşteri oluşturulamadı:", error.message);
    throw error;
  }

  return data;
}

export async function getCustomer(email) {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("Müşteri alınamadı:", error.message);
    throw error;
  }

  return data;
}

export async function getFavorites(customerId) {
  if (!customerId) {
    throw new Error("Geçerli bir müşteri ID'si sağlanmadı.");
  }

  const { data, error } = await supabase
    .from("favorites")
    .select(
      `
  products (
    *,
    product_variants (
      id,
      stock,
      size:sizes!product_variants_size_id_fkey (name),
      waist:sizes!fk_waist_size (name),
      length:sizes!fk_length_size (name)
    )
  )
`
    )

    .eq("customer_id", customerId);

  if (error) {
    console.error("Favorites cannot get.", error.message);
    throw error;
  }

  return data;
}
