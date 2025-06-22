import Link from "next/link";
import { signInAction } from "../_lib/action";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 space-y-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to Chic-Boulevard
        </h1>
        <p className="text-gray-600">Sign in to continue</p>

        <form action={signInAction}>
          <button
            type="submit"
            className="w-full flex items-center cursor-pointer justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition text-gray-700 font-medium"
          >
            <FcGoogle size={24} />
            <span>Continue with Google</span>
          </button>
        </form>

        <p className="text-xs text-gray-500 pt-4">
          By signing in, you agree to our{" "}
          <Link href="/" className="underline hover:text-gray-700">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/" className="underline hover:text-gray-700">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
