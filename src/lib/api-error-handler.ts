// Wrapper pour les routes API Next.js
// Capture automatiquement les erreurs non gerees et les log via ErrorLogger

import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/lib/error-logger";
import { getClientIp } from "@/lib/rate-limit";
import type { ErrorCategory } from "@/generated/prisma/client";

type RouteHandler = (
  request: NextRequest,
  context?: { params?: Promise<Record<string, string>> }
) => Promise<NextResponse> | NextResponse;

export function withErrorHandling(
  handler: RouteHandler,
  category: ErrorCategory = "API"
) {
  return async (
    request: NextRequest,
    context?: { params?: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur interne inconnue";
      const stack = error instanceof Error ? error.stack : undefined;

      await logError("ERROR", category, errorMessage, {
        trace: stack,
        requestMethod: request.method,
        requestUri: request.nextUrl.pathname,
        requestIp: getClientIp(request.headers),
      });

      return NextResponse.json(
        { error: "Erreur interne du serveur" },
        { status: 500 }
      );
    }
  };
}
