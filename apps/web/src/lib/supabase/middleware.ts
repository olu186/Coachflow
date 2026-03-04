import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database, UserRole } from "@coachflow/api-types";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const isAuthRoute =
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup";
    const isProtected =
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/client");
    if (isProtected) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(login);
    }
    if (!isAuthRoute && request.nextUrl.pathname === "/") {
      return response;
    }
    return response;
  }

  // Authenticated: get role and enforce role-based redirects
  const { data: profile } = (await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()) as { data: { role: UserRole } | null };

  const role = profile?.role ?? "client";
  const path = request.nextUrl.pathname;

  if (path === "/") {
    if (role === "trainer") return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.redirect(new URL("/client/home", request.url));
  }

  if (path === "/login" || path === "/signup") {
    if (role === "trainer") return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.redirect(new URL("/client/home", request.url));
  }

  if (path.startsWith("/dashboard") && role !== "trainer") {
    return NextResponse.redirect(new URL("/client/home", request.url));
  }
  if (path.startsWith("/client") && role !== "client") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
