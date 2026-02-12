"use client";

import { useAuthStore } from "@/store";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "./Navbar";
import { useRouter } from "next/navigation";

export function NavbarWrapper() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearAuth();
    router.push("/");
  };

  return (
    <Navbar
      isLoggedIn={!!user}
      displayName={user?.displayName}
      email={user?.email}
      onLogout={handleLogout}
    />
  );
}
