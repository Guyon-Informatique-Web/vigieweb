import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { checkUptime } from "../uptime";

// Mock global fetch
const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("checkUptime", () => {
  it("retourne UP pour un statut 200 rapide", async () => {
    mockFetch.mockResolvedValue({ status: 200 });

    const result = await checkUptime("https://example.com");

    expect(result.status).toBe("UP");
    expect(result.statusCode).toBe(200);
    expect(result.responseTime).toBeGreaterThanOrEqual(0);
    expect(result.errorMessage).toBeNull();
  });

  it("retourne DOWN pour un statut 500", async () => {
    mockFetch.mockResolvedValue({ status: 500 });

    const result = await checkUptime("https://example.com");
    expect(result.status).toBe("DOWN");
    expect(result.statusCode).toBe(500);
  });

  it("retourne DOWN pour un statut 503", async () => {
    mockFetch.mockResolvedValue({ status: 503 });

    const result = await checkUptime("https://example.com");
    expect(result.status).toBe("DOWN");
  });

  it("retourne DOWN pour un 404", async () => {
    mockFetch.mockResolvedValue({ status: 404 });

    const result = await checkUptime("https://example.com");
    expect(result.status).toBe("DOWN");
    expect(result.statusCode).toBe(404);
  });

  it("retourne DEGRADED pour un statut 403", async () => {
    mockFetch.mockResolvedValue({ status: 403 });

    const result = await checkUptime("https://example.com");
    expect(result.status).toBe("DEGRADED");
    expect(result.statusCode).toBe(403);
  });

  it("retourne DEGRADED pour un temps de reponse > 3s", async () => {
    // Simuler une reponse lente
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ status: 200 }), 3100)
        )
    );

    const result = await checkUptime("https://slow.example.com");
    expect(result.status).toBe("DEGRADED");
    expect(result.statusCode).toBe(200);
    expect(result.responseTime).toBeGreaterThan(3000);
  });

  it("retourne DOWN avec message d'erreur quand fetch echoue", async () => {
    mockFetch.mockRejectedValue(new Error("ECONNREFUSED"));

    const result = await checkUptime("https://offline.example.com");
    expect(result.status).toBe("DOWN");
    expect(result.statusCode).toBeNull();
    expect(result.errorMessage).toBe("ECONNREFUSED");
  });

  it("retourne DOWN avec timeout message quand aborte", async () => {
    mockFetch.mockRejectedValue(new Error("The operation was aborted"));

    const result = await checkUptime("https://timeout.example.com");
    expect(result.status).toBe("DOWN");
    expect(result.errorMessage).toBe("Timeout (10s)");
  });

  it("passe les bons headers User-Agent", async () => {
    mockFetch.mockResolvedValue({ status: 200 });

    await checkUptime("https://example.com");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://example.com",
      expect.objectContaining({
        method: "GET",
        redirect: "follow",
        headers: { "User-Agent": "VigieWeb Monitor/1.0" },
      })
    );
  });

  it("retourne UP pour un statut 301 (redirection)", async () => {
    mockFetch.mockResolvedValue({ status: 301 });

    const result = await checkUptime("https://redirect.example.com");
    expect(result.status).toBe("UP");
    expect(result.statusCode).toBe(301);
  });
});
