"use client";
import { OAuthButtons } from "@/components/oauth-buttons";
import { useCallback } from "react";
import { createClient } from "../../supabase/client";

export function SignUpOAuth() {
  const handleOAuth = useCallback(async (provider: string) => {
    if (provider !== "google" && provider !== "github") return;
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: provider as "google" | "github",
      options: { redirectTo: window.location.origin + "/auth/callback" },
    });
  }, []);

  return <OAuthButtons onProvider={handleOAuth} />;
}
