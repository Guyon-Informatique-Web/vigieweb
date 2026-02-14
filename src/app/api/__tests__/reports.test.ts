import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    site: {
      findFirst: vi.fn(),
    },
    check: {
      findMany: vi.fn(),
    },
    alert: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getAuthUser: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn(() => ({ success: true, remaining: 9, resetAt: Date.now() + 60000 })),
  getClientIp: vi.fn(() => "1.2.3.4"),
}));

import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { GET } from "@/app/api/reports/route";

const mockUser = {
  id: "user-123",
  email: "test@example.com",
  plan: "PRO", // Rapports disponibles en PRO
  name: null,
  avatarUrl: null,
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  notifyEmail: true,
  notifyDiscord: false,
  discordWebhookUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockSite = {
  id: "site-1",
  userId: "user-123",
  name: "Mon Site",
  url: "https://example.com",
  currentStatus: "UP",
  sslExpiresAt: null,
  sslIssuer: null,
  domainExpiresAt: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  // Re-set le mock rate-limit (clearAllMocks ne reset pas mockReturnValue)
  (rateLimit as ReturnType<typeof vi.fn>).mockReturnValue({ success: true, remaining: 9, resetAt: Date.now() + 60000 });
  (getAuthUser as ReturnType<typeof vi.fn>).mockResolvedValue({ user: mockUser, error: null });
});

function createRequest(params: string) {
  const request = new Request(`http://localhost/api/reports?${params}`) as import("next/server").NextRequest;
  Object.defineProperty(request, "nextUrl", {
    value: new URL(`http://localhost/api/reports?${params}`),
  });
  return request;
}

describe("GET /api/reports", () => {
  it("genere un rapport avec les statistiques", async () => {
    (prisma.site.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockSite);
    (prisma.check.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
      { status: "UP", responseTime: 100, checkedAt: new Date() },
      { status: "UP", responseTime: 200, checkedAt: new Date() },
      { status: "DOWN", responseTime: null, checkedAt: new Date() },
    ]);
    (prisma.alert.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
      { type: "SITE_DOWN", severity: "CRITICAL", title: "Down", message: "Offline", createdAt: new Date() },
    ]);

    const response = await GET(createRequest("siteId=site-1"));
    const data = await response.json();

    expect(data.site.name).toBe("Mon Site");
    expect(data.stats.totalChecks).toBe(3);
    expect(data.stats.uptimePercentage).toBeCloseTo(66.67, 1);
    expect(data.stats.avgResponseTime).toBe(150);
    expect(data.stats.minResponseTime).toBe(100);
    expect(data.stats.maxResponseTime).toBe(200);
    expect(data.stats.incidentCount).toBe(1);
    expect(data.incidents).toHaveLength(1);
  });

  it("retourne 403 pour le plan FREE (rapports non disponibles)", async () => {
    (getAuthUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { ...mockUser, plan: "FREE" },
      error: null,
    });

    const response = await GET(createRequest("siteId=site-1"));
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toContain("Pro");
  });

  it("retourne 400 sans siteId", async () => {
    const response = await GET(createRequest(""));
    expect(response.status).toBe(400);
  });

  it("retourne 404 pour un site inexistant", async () => {
    (prisma.site.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const response = await GET(createRequest("siteId=nope"));
    expect(response.status).toBe(404);
  });

  it("retourne 404 pour un site d'un autre utilisateur", async () => {
    (prisma.site.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    // findFirst avec where userId filtre deja

    const response = await GET(createRequest("siteId=other-site"));
    expect(response.status).toBe(404);
  });

  it("gere un rapport sans checks (stats null)", async () => {
    (prisma.site.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockSite);
    (prisma.check.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.alert.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const response = await GET(createRequest("siteId=site-1"));
    const data = await response.json();

    expect(data.stats.totalChecks).toBe(0);
    expect(data.stats.uptimePercentage).toBeNull();
    expect(data.stats.avgResponseTime).toBeNull();
    expect(data.incidents).toHaveLength(0);
  });

  it("retourne 429 quand rate limit atteint", async () => {
    (rateLimit as ReturnType<typeof vi.fn>).mockReturnValue({ success: false, remaining: 0, resetAt: Date.now() + 60000 });

    const response = await GET(createRequest("siteId=site-1"));
    expect(response.status).toBe(429);
  });

  it("autorise les rapports pour le plan AGENCY", async () => {
    (getAuthUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { ...mockUser, plan: "AGENCY" },
      error: null,
    });
    (prisma.site.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockSite);
    (prisma.check.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.alert.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const response = await GET(createRequest("siteId=site-1"));
    expect(response.status).toBe(200);
  });
});
