// Middleware Next.js principal
// Gere la session Supabase et la protection des routes

import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Proteger le dashboard et les pages auth
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
