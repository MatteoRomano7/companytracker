"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        // Fetch user profile
        supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .single()
          .then(({ data: profile }) => {
            setAuth({
              user: {
                id: user.id,
                email: user.email!,
                displayName: profile?.display_name || user.email!.split("@")[0],
              },
            });
          });
      }
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", session.user.id)
          .single();

        setAuth({
          user: {
            id: session.user.id,
            email: session.user.email!,
            displayName:
              profile?.display_name || session.user.email!.split("@")[0],
          },
        });
      } else if (event === "SIGNED_OUT") {
        clearAuth();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth, clearAuth]);

  return <>{children}</>;
}
