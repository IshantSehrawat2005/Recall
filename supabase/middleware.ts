import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { checkSupabaseEnvVars } from "../src/utils/env";

export const updateSession = async (request: NextRequest) => {
  try {
    // Check if environment variables are available
    const envVars = checkSupabaseEnvVars();

    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      envVars.NEXT_PUBLIC_SUPABASE_URL as string,
      envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll().map(({ name, value }) => ({
              name,
              value,
            }));
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              });
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    const { data: { user }, error } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/sign-in', '/sign-up', '/forgot-password', '/auth/callback'];
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));

    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/profile', '/graph', '/groups', '/profile-setup'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Auth routes (sign-in, sign-up)
    const authRoutes = ['/sign-in', '/sign-up'];
    const isAuthRoute = authRoutes.some(route => pathname === route);

    // If user is not authenticated and trying to access protected route
    if (!user && isProtectedRoute) {
      const redirectUrl = new URL('/sign-in', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If user is authenticated
    if (user) {
      // If user is on auth routes (sign-in, sign-up), redirect to appropriate page
      if (isAuthRoute) {
        // Check if user has completed profile
        const { data: userProfile } = await supabase
          .from('users')
          .select('profile_completed')
          .eq('id', user.id)
          .single();

        if (userProfile?.profile_completed) {
          // User has completed profile, redirect to dashboard
          return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
          // User hasn't completed profile, redirect to profile setup
          return NextResponse.redirect(new URL('/profile-setup', request.url));
        }
      }

      // If user is on home page and authenticated, redirect based on profile completion
      if (pathname === '/') {
        const { data: userProfile } = await supabase
          .from('users')
          .select('profile_completed')
          .eq('id', user.id)
          .single();

        if (userProfile?.profile_completed) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
          return NextResponse.redirect(new URL('/profile-setup', request.url));
        }
      }

      // If user is on profile-setup but has already completed profile, redirect to dashboard
      if (pathname.startsWith('/profile-setup')) {
        const { data: userProfile } = await supabase
          .from('users')
          .select('profile_completed')
          .eq('id', user.id)
          .single();

        if (userProfile?.profile_completed) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }

      // If user is on dashboard but hasn't completed profile, redirect to profile setup
      if (pathname.startsWith('/dashboard')) {
        const { data: userProfile } = await supabase
          .from('users')
          .select('profile_completed')
          .eq('id', user.id)
          .single();

        if (!userProfile?.profile_completed) {
          return NextResponse.redirect(new URL('/profile-setup', request.url));
        }
      }
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    console.error("Middleware error:", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
