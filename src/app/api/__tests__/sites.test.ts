import { describe, it, expect, vi, beforeEach } from "vitest";

// Mocks des modules externes
vi.mock("@/lib/prisma", () => ({
  prisma: {
    site: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getAuthUser: vi.fn(),
}));

// Mock rate-limit : toujours autoriser par defaut
vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn(() => ({ success: true, remaining: 9, resetAt: Date.now() + 60000 })),
  getClientIp: vi.fn(() => "1.2.3.4"),
}));

import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { GET, POST } from "@/app/api/sites/route";
import { GET as GET_SITE, PATCH, DELETE } from "@/app/api/sites/[id]/route";

const mockUser = {
  id: "user-123",
  email: "test@example.com",
  plan: "FREE",
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
  isActive: true,
  currentStatus: "UP",
  lastCheckedAt: null,
  sslExpiresAt: null,
  sslIssuer: null,
  domainExpiresAt: null,
  domainRegistrar: null,
  uptimePercentage: null,
  avgResponseTime: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
  (getAuthUser as ReturnType<typeof vi.fn>).mockResolvedValue({ user: mockUser, error: null });
});

describe("GET /api/sites", () => {
  it("retourne la liste des sites de l'utilisateur", async () => {
    (prisma.site.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([mockSite]);

    const response = await GET();
    const data = await response.json();

    expect(data).toHaveLength(1);
    expect(data[0].name).toBe("Mon Site");
    expect(prisma.site.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-123" },
      })
    );
  });

  it("retourne 401 si non authentifie", async () => {
    (getAuthUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: null,
      error: new Response(JSON.stringify({ error: "Non authentifie" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    });

    const response = await GET();
    expect(response.status).toBe(401);
  });
});

describe("POST /api/sites", () => {
  function createRequest(body: unknown) {
    return new Request("http://localhost/api/sites", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }) as import("next/server").NextRequest;
  }

  it("cree un site avec des donnees valides", async () => {
    (prisma.site.count as ReturnType<typeof vi.fn>).mockResolvedValue(0);
    (prisma.site.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockSite);

    const response = await POST(createRequest({ name: "Mon Site", url: "https://example.com" }));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.name).toBe("Mon Site");
  });

  it("retourne 400 pour une URL invalide", async () => {
    const response = await POST(createRequest({ name: "Bad", url: "not-a-url" }));
    expect(response.status).toBe(400);
  });

  it("retourne 400 pour un nom vide", async () => {
    const response = await POST(createRequest({ name: "", url: "https://example.com" }));
    expect(response.status).toBe(400);
  });

  it("retourne 400 pour une URL SSRF (localhost)", async () => {
    const response = await POST(createRequest({ name: "Hack", url: "http://localhost:3000" }));
    expect(response.status).toBe(400);
  });

  it("retourne 403 quand la limite du plan FREE est atteinte", async () => {
    (prisma.site.count as ReturnType<typeof vi.fn>).mockResolvedValue(1); // FREE = max 1 site

    const response = await POST(createRequest({ name: "Trop", url: "https://example.com" }));
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toContain("Limite");
  });

  it("autorise 10 sites pour le plan PRO", async () => {
    (getAuthUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { ...mockUser, plan: "PRO" },
      error: null,
    });
    (prisma.site.count as ReturnType<typeof vi.fn>).mockResolvedValue(5);
    (prisma.site.create as ReturnType<typeof vi.fn>).mockResolvedValue(mockSite);

    const response = await POST(createRequest({ name: "Pro Site", url: "https://pro.com" }));
    expect(response.status).toBe(201);
  });

  it("retourne 429 quand le rate limit est atteint", async () => {
    (rateLimit as ReturnType<typeof vi.fn>).mockReturnValue({ success: false, remaining: 0, resetAt: Date.now() + 60000 });

    const response = await POST(createRequest({ name: "Flood", url: "https://example.com" }));
    expect(response.status).toBe(429);
  });
});

describe("GET /api/sites/[id]", () => {
  it("retourne le detail d'un site", async () => {
    (prisma.site.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockSite);

    const response = await GET_SITE(new Request("http://localhost"), {
      params: Promise.resolve({ id: "site-1" }),
    });
    const data = await response.json();

    expect(data.name).toBe("Mon Site");
  });

  it("retourne 404 pour un site inexistant", async () => {
    (prisma.site.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const response = await GET_SITE(new Request("http://localhost"), {
      params: Promise.resolve({ id: "nope" }),
    });
    expect(response.status).toBe(404);
  });

  it("retourne 404 pour un site d'un autre utilisateur", async () => {
    (prisma.site.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockSite,
      userId: "autre-user",
    });

    const response = await GET_SITE(new Request("http://localhost"), {
      params: Promise.resolve({ id: "site-1" }),
    });
    expect(response.status).toBe(404);
  });
});

describe("PATCH /api/sites/[id]", () => {
  it("met a jour le nom du site", async () => {
    (prisma.site.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockSite);
    (prisma.site.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockSite,
      name: "Nouveau Nom",
    });

    const request = new Request("http://localhost", {
      method: "PATCH",
      body: JSON.stringify({ name: "Nouveau Nom" }),
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: "site-1" }),
    });
    const data = await response.json();

    expect(data.name).toBe("Nouveau Nom");
  });

  it("retourne 400 pour des donnees invalides", async () => {
    (prisma.site.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockSite);

    const request = new Request("http://localhost", {
      method: "PATCH",
      body: JSON.stringify({ name: "" }),
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: "site-1" }),
    });
    expect(response.status).toBe(400);
  });
});

describe("DELETE /api/sites/[id]", () => {
  it("supprime un site existant", async () => {
    (prisma.site.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockSite);
    (prisma.site.delete as ReturnType<typeof vi.fn>).mockResolvedValue(mockSite);

    const response = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({ id: "site-1" }),
    });
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(prisma.site.delete).toHaveBeenCalledWith({ where: { id: "site-1" } });
  });

  it("retourne 404 pour un site inexistant", async () => {
    (prisma.site.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const response = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({ id: "nope" }),
    });
    expect(response.status).toBe(404);
  });
});
