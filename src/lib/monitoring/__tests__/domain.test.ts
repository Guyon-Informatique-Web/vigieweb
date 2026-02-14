import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { checkDomain } from "../domain";

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("checkDomain", () => {
  it("retourne les infos de domaine pour un .com", async () => {
    const expiresDate = "2027-03-15T00:00:00Z";

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        events: [
          { eventAction: "registration", eventDate: "2020-01-01T00:00:00Z" },
          { eventAction: "expiration", eventDate: expiresDate },
        ],
        entities: [
          {
            roles: ["registrar"],
            vcardArray: ["vcard", [["fn", {}, "text", "OVHcloud"]]],
          },
        ],
      }),
    });

    const result = await checkDomain("https://example.com");

    expect(result.expiresAt).toBeInstanceOf(Date);
    expect(result.daysRemaining).toBeGreaterThan(0);
    expect(result.registrar).toBe("OVHcloud");
    expect(result.errorMessage).toBeNull();
  });

  it("extrait le domaine principal depuis un sous-domaine", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        events: [{ eventAction: "expiration", eventDate: "2027-01-01T00:00:00Z" }],
        entities: [],
      }),
    });

    await checkDomain("https://www.sub.example.com/page");

    // Doit appeler RDAP avec "example.com" et non "www.sub.example.com"
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/domain/example.com"),
      expect.any(Object)
    );
  });

  it("retourne une erreur pour un TLD non supporte", async () => {
    const result = await checkDomain("https://example.xyz");

    expect(result.expiresAt).toBeNull();
    expect(result.errorMessage).toContain(".xyz");
    expect(result.errorMessage).toContain("non supporte");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("gere une erreur HTTP du serveur RDAP", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
    });

    const result = await checkDomain("https://inexistant.com");

    expect(result.expiresAt).toBeNull();
    expect(result.errorMessage).toContain("404");
  });

  it("gere l'absence de date d'expiration dans la reponse", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        events: [{ eventAction: "registration", eventDate: "2020-01-01T00:00:00Z" }],
        entities: [
          {
            roles: ["registrar"],
            handle: "OVH-HANDLE",
          },
        ],
      }),
    });

    const result = await checkDomain("https://example.fr");

    expect(result.expiresAt).toBeNull();
    expect(result.registrar).toBe("OVH-HANDLE"); // fallback sur handle
    expect(result.errorMessage).toContain("non trouvee");
  });

  it("gere le timeout fetch (abort)", async () => {
    mockFetch.mockRejectedValue(new Error("The operation was aborted"));

    const result = await checkDomain("https://slow-rdap.com");

    expect(result.expiresAt).toBeNull();
    expect(result.errorMessage).toBe("The operation was aborted");
  });

  it("gere les erreurs reseau", async () => {
    mockFetch.mockRejectedValue(new Error("ECONNREFUSED"));

    const result = await checkDomain("https://example.net");

    expect(result.errorMessage).toBe("ECONNREFUSED");
  });

  it("utilise le bon serveur RDAP pour .fr", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        events: [{ eventAction: "expiration", eventDate: "2027-01-01T00:00:00Z" }],
        entities: [],
      }),
    });

    await checkDomain("https://example.fr");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("rdap.nic.fr"),
      expect.any(Object)
    );
  });

  it("supporte les TLD .io, .dev, .app", async () => {
    for (const tld of ["io", "dev", "app"]) {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          events: [{ eventAction: "expiration", eventDate: "2027-06-01T00:00:00Z" }],
          entities: [],
        }),
      });

      const result = await checkDomain(`https://example.${tld}`);
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(result.errorMessage).toBeNull();
    }
  });

  it("envoie le header Accept RDAP", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        events: [{ eventAction: "expiration", eventDate: "2027-01-01T00:00:00Z" }],
        entities: [],
      }),
    });

    await checkDomain("https://example.com");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { Accept: "application/rdap+json" },
      })
    );
  });
});
