"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 💡 Added for immediate programmatic routing
import { signIn, signUp } from "@/lib/auth-client";

export default function AuthForm() {
  const router = useRouter(); // 💡 Initialize the Next.js router
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignUp) {
      // Handle User Registration
      await signUp.email(
        {
          email,
          password,
          name,
        },
        {
          onSuccess: () => {
            // 💡 Triggered immediately when backend sends 200 OK
            router.push("/problems");
            router.refresh();
          },
          onError: (ctx) => {
            setError(
              ctx.error.message || "Something went wrong during sign up.",
            );
            setLoading(false);
          },
        },
      );
    } else {
      // Handle User Login
      await signIn.email(
        {
          email,
          password,
        },
        {
          onSuccess: () => {
            // 💡 Route existing users straight inside immediately
            router.push("/problems");
            router.refresh();
          },
          onError: (ctx) => {
            setError(ctx.error.message || "Invalid email or password.");
            setLoading(false);
          },
        },
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {isSignUp ? "Create an Account" : "Welcome Back"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-black"
              placeholder="John Doe"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-black"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-black"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-semibold transition disabled:bg-blue-400"
        >
          {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(""); // Clean up old message when switching contexts
          }}
          className="text-blue-600 hover:underline font-medium focus:outline-none"
        >
          {isSignUp ? "Sign In" : "Register here"}
        </button>
      </div>
    </div>
  );
}
