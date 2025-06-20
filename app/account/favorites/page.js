import { auth } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import { getFavorites } from "@/app/_lib/data-service";
import FavoriteClientPage from "./FavoriteClientPage";

export default async function FavoritesPage() {
  const session = await auth();

  // Eğer giriş yapılmamışsa login sayfasına yönlendir
  if (!session?.user) {
    redirect("/login");
  }

  const favorites = await getFavorites(session.user.customerId);
  return <FavoriteClientPage favorites={favorites} />;
}
