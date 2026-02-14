import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    alert: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getAuthUser: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { GET } from "@/app/api/alerts/route";
import { PATCH } from "@/app/api/alerts/[id]/route";
import { POST as READ_ALL } from "@/app/api/alerts/read-all/route";

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

const mockAlert = {
  id: "alert-1",
  userId: "user-123",
  siteId: "site-1",
  type: "SITE_DOWN",
  severity: "CRITICAL",
  title: "Site hors ligne",
  message: "Le site ne repond pas",
  isRead: false,
  isResolved: false,
  resolvedAt: null,
  emailSent: true,
  discordSent: false,
  createdAt: new Date(),
  site: { name: "Mon Site", url: "https://example.com" },
};

beforeEach(() => {
  vi.clearAllMocks();
  (getAuthUser as ReturnType<typeof vi.fn>).mockResolvedValue({ user: mockUser, error: null });
});

describe("GET /api/alerts", () => {
  it("retourne les alertes avec pagination", async () => {
    (prisma.alert.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([mockAlert]);
    (prisma.alert.count as ReturnType<typeof vi.fn>).mockResolvedValue(1);

    const request = new Request("http://localhost/api/alerts") as import("next/server").NextRequest;
    // NextRequest a besoin de nextUrl, on cast
    Object.defineProperty(request, "nextUrl", {
      value: new URL("http://localhost/api/alerts"),
    });

    const response = await GET(request);
    const data = await response.json();

    expect(data.alerts).toHaveLength(1);
    expect(data.pagination.total).toBe(1);
    expect(data.pagination.page).toBe(1);
  });

  it("filtre par siteId", async () => {
    (prisma.alert.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.alert.count as ReturnType<typeof vi.fn>).mockResolvedValue(0);

    const request = new Request("http://localhost/api/alerts?siteId=site-1") as import("next/server").NextRequest;
    Object.defineProperty(request, "nextUrl", {
      value: new URL("http://localhost/api/alerts?siteId=site-1"),
    });

    await GET(request);

    expect(prisma.alert.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ siteId: "site-1" }),
      })
    );
  });

  it("filtre par type et severity", async () => {
    (prisma.alert.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.alert.count as ReturnType<typeof vi.fn>).mockResolvedValue(0);

    const request = new Request("http://localhost/api/alerts?type=SITE_DOWN&severity=CRITICAL") as import("next/server").NextRequest;
    Object.defineProperty(request, "nextUrl", {
      value: new URL("http://localhost/api/alerts?type=SITE_DOWN&severity=CRITICAL"),
    });

    await GET(request);

    expect(prisma.alert.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          type: "SITE_DOWN",
          severity: "CRITICAL",
        }),
      })
    );
  });

  it("filtre par isRead=false", async () => {
    (prisma.alert.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (prisma.alert.count as ReturnType<typeof vi.fn>).mockResolvedValue(0);

    const request = new Request("http://localhost/api/alerts?isRead=false") as import("next/server").NextRequest;
    Object.defineProperty(request, "nextUrl", {
      value: new URL("http://localhost/api/alerts?isRead=false"),
    });

    await GET(request);

    expect(prisma.alert.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isRead: false }),
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

    const request = new Request("http://localhost/api/alerts") as import("next/server").NextRequest;
    Object.defineProperty(request, "nextUrl", {
      value: new URL("http://localhost/api/alerts"),
    });

    const response = await GET(request);
    expect(response.status).toBe(401);
  });
});

describe("PATCH /api/alerts/[id]", () => {
  it("marque une alerte comme lue", async () => {
    (prisma.alert.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockAlert);
    (prisma.alert.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockAlert,
      isRead: true,
    });

    const request = new Request("http://localhost", {
      method: "PATCH",
      body: JSON.stringify({ isRead: true }),
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: "alert-1" }),
    });
    const data = await response.json();

    expect(data.isRead).toBe(true);
    expect(prisma.alert.update).toHaveBeenCalledWith({
      where: { id: "alert-1" },
      data: { isRead: true },
    });
  });

  it("marque une alerte comme resolue avec date", async () => {
    (prisma.alert.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockAlert);
    (prisma.alert.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockAlert,
      isResolved: true,
      resolvedAt: new Date(),
    });

    const request = new Request("http://localhost", {
      method: "PATCH",
      body: JSON.stringify({ isResolved: true }),
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: "alert-1" }),
    });

    expect(prisma.alert.update).toHaveBeenCalledWith({
      where: { id: "alert-1" },
      data: expect.objectContaining({
        isResolved: true,
        resolvedAt: expect.any(Date),
      }),
    });

    const data = await response.json();
    expect(data.isResolved).toBe(true);
  });

  it("retourne 404 pour une alerte inexistante", async () => {
    (prisma.alert.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const request = new Request("http://localhost", {
      method: "PATCH",
      body: JSON.stringify({ isRead: true }),
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: "nope" }),
    });
    expect(response.status).toBe(404);
  });

  it("retourne 404 pour une alerte d'un autre utilisateur", async () => {
    (prisma.alert.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockAlert,
      userId: "autre-user",
    });

    const request = new Request("http://localhost", {
      method: "PATCH",
      body: JSON.stringify({ isRead: true }),
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: "alert-1" }),
    });
    expect(response.status).toBe(404);
  });
});

describe("POST /api/alerts/read-all", () => {
  it("marque toutes les alertes comme lues", async () => {
    (prisma.alert.updateMany as ReturnType<typeof vi.fn>).mockResolvedValue({ count: 5 });

    const response = await READ_ALL();
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(prisma.alert.updateMany).toHaveBeenCalledWith({
      where: { userId: "user-123", isRead: false },
      data: { isRead: true },
    });
  });
});
