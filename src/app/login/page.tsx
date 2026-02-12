"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (data.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", data.user.id)
          .single();

        setAuth({
          user: {
            id: data.user.id,
            email: data.user.email!,
            displayName: profile?.display_name || data.user.email!.split("@")[0],
          },
        });

        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to access your watchlist and personalized insights
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
        </div>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
