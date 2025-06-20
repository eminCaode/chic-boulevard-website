import AccountLayoutBar from "../_components/AccountLayoutBar";

export default function RootLayout({ children }) {
  return (
    <div className="flex  items-start pt-15 pl-20 min-h-screen bg-gray-100 gap-10">
      <nav className="sticky top-25 self-start">
        <AccountLayoutBar />
      </nav>
      <main className="min-h-screen">{children}</main>
    </div>
  );
}
