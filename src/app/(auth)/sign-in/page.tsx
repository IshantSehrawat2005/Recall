import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthProviders } from "@/components/oauth-providers";
import Link from "next/link";

interface LoginProps {
  searchParams: Promise<Message & { redirect?: string }>;
}

export default async function SignInPage({ searchParams }: LoginProps) {
  const message = await searchParams;
  const redirect = "redirect" in message ? message.redirect : undefined;

  // Check for session expired message
  const isSessionExpired = "message" in message && message.message === "session_expired";

  if ("message" in message && !isSessionExpired) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
        <form className="flex flex-col space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
            {isSessionExpired && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  🔒 Your session has expired due to inactivity. Please sign in again to continue.
                </p>
              </div>
            )}
            {redirect && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  📍 Please sign in to access {redirect}
                </p>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                className="text-primary font-medium hover:underline transition-all"
                href="/sign-up"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-all"
                  href="/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Your password"
                className="w-full"
                required
              />
            </div>
          </div>

          <SubmitButton
            className="w-full"
            pendingText="Signing in..."
            formAction={signInAction}
          >
            Sign in
          </SubmitButton>

          <OAuthProviders />

          <div className="text-center">
            <FormMessage message={message} />
          </div>
        </form>
      </div>
    </div>
  );
} 