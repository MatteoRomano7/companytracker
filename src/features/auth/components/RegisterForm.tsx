"use client";

import * as React from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RegisterFormProps {
  /** Called when the form is submitted with valid data */
  onSubmit: (data: {
    displayName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  /** Whether the form is currently submitting */
  isLoading?: boolean;
  /** Server-side error message */
  error?: string;
  /** Additional CSS classes */
  className?: string;
}

export function RegisterForm({
  onSubmit,
  isLoading = false,
  error,
  className,
}: RegisterFormProps) {
  const [displayName, setDisplayName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [clientError, setClientError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setClientError(null);

    if (password.length < 8) {
      setClientError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setClientError("Passwords do not match.");
      return;
    }

    await onSubmit({ displayName, email, password });
  }

  const displayedError = clientError || error;

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <UserPlus className="size-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Create an account</CardTitle>
        <CardDescription>
          Get started with NASDAQ Insights for free
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {displayedError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
              {displayedError}
            </div>
          )}
          <div className="space-y-2">
            <label
              htmlFor="register-name"
              className="text-sm font-medium leading-none"
            >
              Display Name
            </label>
            <Input
              id="register-name"
              type="text"
              placeholder="John Doe"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="register-email"
              className="text-sm font-medium leading-none"
            >
              Email
            </label>
            <Input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="register-password"
              className="text-sm font-medium leading-none"
            >
              Password
            </label>
            <Input
              id="register-password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="new-password"
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="register-confirm-password"
              className="text-sm font-medium leading-none"
            >
              Confirm Password
            </label>
            <Input
              id="register-confirm-password"
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
