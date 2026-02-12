"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: {
    displayName: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(undefined);
    setSuccess(false);

    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.displayName,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Join NASDAQ Insights to track your favorite companies
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
          {success ? (
            <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
              <p className="text-center text-sm text-green-800 dark:text-green-200">
                Registration successful! Redirecting to login...
              </p>
            </div>
          ) : (
            <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
          )}
        </div>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
