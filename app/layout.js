import "@/app/_styles/globals.css";
import { Inter } from "next/font/google";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { CartProvider } from "./context/CartContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    template: "%s / Chic-Boulevard",
    default: "Welcome / Chic-Boulevard",
  },
  description:
    "Chic-boulevard presents e commerce service related to clothing, shoes, accessories to reach customers ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-gray-100 min-h-screen ${inter.className}`}>
        <CartProvider>
          <Header />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
