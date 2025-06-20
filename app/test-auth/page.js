import { auth } from "../_lib/auth";

export default async function TestAuthPage() {
  const session = await auth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Sayfası</h1>

      <div className="space-y-4">
        <div>
          <strong>Session Durumu:</strong>{" "}
          {session ? "✅ Giriş yapılmış" : "❌ Giriş yapılmamış"}
        </div>

        {session?.user && (
          <div>
            <strong>Kullanıcı:</strong> {session.user.email}
          </div>
        )}

        <div>
          <strong>Customer ID:</strong> {session?.user?.customerId || "Yok"}
        </div>
      </div>
    </div>
  );
}
