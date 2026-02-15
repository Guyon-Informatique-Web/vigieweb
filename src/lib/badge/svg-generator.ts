// Generateur de badges SVG pour l'uptime
// 3 styles : flat, flat-square, for-the-badge

type BadgeStyle = "flat" | "flat-square" | "for-the-badge";

function getUptimeColor(uptime: number): string {
  if (uptime >= 99) return "#22c55e"; // emerald-500
  if (uptime >= 95) return "#f59e0b"; // amber-500
  return "#ef4444"; // red-500
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function generateBadgeSvg(
  uptime: number | null,
  style: BadgeStyle = "flat"
): string {
  const uptimeText = uptime != null ? `${uptime.toFixed(1)}%` : "N/A";
  const label = "uptime";
  const brand = "Vigie Web";
  const leftColor = uptime != null ? getUptimeColor(uptime) : "#6b7280";
  const rightColor = "#4f46e5"; // indigo-600

  switch (style) {
    case "flat":
      return generateFlat(label, uptimeText, brand, leftColor, rightColor);
    case "flat-square":
      return generateFlatSquare(
        label,
        uptimeText,
        brand,
        leftColor,
        rightColor
      );
    case "for-the-badge":
      return generateForTheBadge(
        label,
        uptimeText,
        brand,
        leftColor,
        rightColor
      );
    default:
      return generateFlat(label, uptimeText, brand, leftColor, rightColor);
  }
}

function generateFlat(
  label: string,
  value: string,
  brand: string,
  leftColor: string,
  rightColor: string
): string {
  const leftText = `${escapeXml(label)} ${escapeXml(value)}`;
  const rightText = escapeXml(brand);
  const leftWidth = leftText.length * 6.5 + 20;
  const rightWidth = rightText.length * 6.5 + 20;
  const totalWidth = leftWidth + rightWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value} | ${brand}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${leftWidth}" height="20" fill="${leftColor}"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="20" fill="${rightColor}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text x="${leftWidth / 2}" y="14" fill="#010101" fill-opacity=".3">${leftText}</text>
    <text x="${leftWidth / 2}" y="13">${leftText}</text>
    <text x="${leftWidth + rightWidth / 2}" y="14" fill="#010101" fill-opacity=".3">${rightText}</text>
    <text x="${leftWidth + rightWidth / 2}" y="13">${rightText}</text>
  </g>
</svg>`;
}

function generateFlatSquare(
  label: string,
  value: string,
  brand: string,
  leftColor: string,
  rightColor: string
): string {
  const leftText = `${escapeXml(label)} ${escapeXml(value)}`;
  const rightText = escapeXml(brand);
  const leftWidth = leftText.length * 6.5 + 20;
  const rightWidth = rightText.length * 6.5 + 20;
  const totalWidth = leftWidth + rightWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value} | ${brand}</title>
  <g shape-rendering="crispEdges">
    <rect width="${leftWidth}" height="20" fill="${leftColor}"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="20" fill="${rightColor}"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text x="${leftWidth / 2}" y="14">${leftText}</text>
    <text x="${leftWidth + rightWidth / 2}" y="14">${rightText}</text>
  </g>
</svg>`;
}

function generateForTheBadge(
  label: string,
  value: string,
  brand: string,
  leftColor: string,
  rightColor: string
): string {
  const leftText = `${escapeXml(label.toUpperCase())} ${escapeXml(value)}`;
  const rightText = escapeXml(brand.toUpperCase());
  const leftWidth = leftText.length * 7.5 + 30;
  const rightWidth = rightText.length * 7.5 + 30;
  const totalWidth = leftWidth + rightWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="28" role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value} | ${brand}</title>
  <g shape-rendering="crispEdges">
    <rect width="${leftWidth}" height="28" fill="${leftColor}"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="28" fill="${rightColor}"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="10">
    <text x="${leftWidth / 2}" y="18" font-weight="bold" textLength="${leftWidth - 20}">${leftText}</text>
    <text x="${leftWidth + rightWidth / 2}" y="18" font-weight="bold" textLength="${rightWidth - 20}">${rightText}</text>
  </g>
</svg>`;
}
