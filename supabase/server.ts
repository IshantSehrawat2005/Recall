import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { checkSupabaseEnvVars } from "../src/utils/env";

export const createClient = async () => {
  const cookieStore = cookies();

  // Check if environment variables are available
  const envVars = checkSupabaseEnvVars();

  return createServerClient(
    envVars.NEXT_PUBLIC_SUPABASE_URL as string,
    envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map(({ name, value }) => ({
            name,
            value,
          }));
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
};
