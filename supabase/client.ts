import { createBrowserClient } from "@supabase/ssr";
import { checkSupabaseEnvVars } from "../src/utils/env";

export const createClient = () => {
  // Check if environment variables are available
  const envVars = checkSupabaseEnvVars();

  return createBrowserClient(
    envVars.NEXT_PUBLIC_SUPABASE_URL as string,
    envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
};
