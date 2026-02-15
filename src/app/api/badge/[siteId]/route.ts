// API badge SVG publique
// GET : verifie badgeEnabled, retourne SVG avec cache 5 min

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateBadgeSvg } from "@/lib/badge/svg-generator";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;

  // Recuperer le site
  const site = await prisma.site.findUnique({
    where: { id: siteId },
    select: {
      badgeEnabled: true,
      uptimePercentage: true,
    },
  });

  if (!site || !site.badgeEnabled) {
    return new NextResponse("Badge non disponible", { status: 404 });
  }

  // Style depuis les query params
  const style = request.nextUrl.searchParams.get("style") as
    | "flat"
    | "flat-square"
    | "for-the-badge"
    | null;
  const validStyles = ["flat", "flat-square", "for-the-badge"];
  const badgeStyle = style && validStyles.includes(style) ? style : "flat";

  const svg = generateBadgeSvg(site.uptimePercentage, badgeStyle);

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
