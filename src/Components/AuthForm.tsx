"use client";

import { useState } from "react";
import axios from "../lib/axios";
import { useRouter } from "next/navigation";

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

      alert(`${type === "login" ? "Login" : "Signup"} berhasil!`);
      router.push("/");
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        `Gagal ${type === "login" ? "login" : "signup"}`;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-center capitalize">
        {type === "login" ? "Login" : "Register"}
      </h2>

      {error && (
        <div className="p-2 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Email"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Password"
        required
      />

      <button
        type="submit"
        className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        disabled={loading}
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
  );
}
