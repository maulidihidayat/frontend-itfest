"use client";

import { useState } from "react";
import axios from "../lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  type: "login" | "signup";
}

export default function AuthForm({ type }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = type === "login" ? "/auth/login" : "/auth/signup";

    try {
      const res = await axios.post(url, { email, password });
      alert(`${type === "login" ? "Login" : "Registrasi"} berhasil!`);
      router.push("/");
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        `Gagal ${type === "login" ? "login" : "registrasi"}`;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 bg-white">
      <div className="w-full max-w-md p-8 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Judul */}
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
          {type === "login" ? "Masuk ke Akunmu" : "Buat Akun Baru"}
        </h2>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
          {type === "login"
            ? "Silakan login dengan email & password kamu."
            : "Daftarkan akunmu sekarang, gratis!"}
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded dark:bg-red-950 dark:text-red-300 dark:border-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Email"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
          >
            {loading
              ? type === "login"
                ? "Logging in..."
                : "Registering..."
              : type === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        {/* Link Ganti Mode */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {type === "login" ? (
            <>
              Belum punya akun?{" "}
              <Link
                href="/auth/register"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Daftar sekarang
              </Link>
            </>
          ) : (
            <>
              Sudah punya akun?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Login di sini
              </Link>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
