import { getProductBySlug } from "@/app/_lib/data-service";
import ProductDetailClient from "./ProductDetailClient";
import { isFavorite } from "@/app/_lib/action";
import { auth } from "@/app/_lib/auth"; // 👈 EKLENDİ

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product)
    return <div className="p-10 text-red-600">Ürün bulunamadı.</div>;

  const session = await auth(); // 👈 EKLENDİ

  // 👇 Eğer kullanıcı varsa favori kontrolü yap, yoksa false
  const favorite = session?.user?.customerId
    ? await isFavorite(product.id)
    : false;

  return <ProductDetailClient product={product} favorite={favorite} />;
}
