import { describe, it, expect, beforeEach, vi } from "vitest";

// On importe dynamiquement pour pouvoir reset le module entre les tests
let rateLimit: typeof import("../rate-limit").rateLimit;
let getClientIp: typeof import("../rate-limit").getClientIp;

beforeEach(async () => {
  // Reimporter le module pour obtenir un store vierge
  vi.resetModules();
  const mod = await import("../rate-limit");
  rateLimit = mod.rateLimit;
  getClientIp = mod.getClientIp;
});

describe("rateLimit", () => {
  it("autorise la premiere requete", () => {
    const result = rateLimit("test-key", { maxRequests: 5, windowSeconds: 60 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("decremente le compteur a chaque appel", () => {
    rateLimit("counter", { maxRequests: 3, windowSeconds: 60 });
    const r2 = rateLimit("counter", { maxRequests: 3, windowSeconds: 60 });
    const r3 = rateLimit("counter", { maxRequests: 3, windowSeconds: 60 });

    expect(r2.remaining).toBe(1);
    expect(r3.remaining).toBe(0);
    expect(r3.success).toBe(true);
  });

  it("bloque apres avoir atteint la limite", () => {
    const opts = { maxRequests: 2, windowSeconds: 60 };
    rateLimit("block", opts);
    rateLimit("block", opts);
    const blocked = rateLimit("block", opts);

    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("utilise des cles independantes", () => {
    const opts = { maxRequests: 1, windowSeconds: 60 };
    rateLimit("a", opts);
    const resultB = rateLimit("b", opts);

    expect(resultB.success).toBe(true);
  });

  it("reset apres expiration de la fenetre", () => {
    vi.useFakeTimers();

    const opts = { maxRequests: 1, windowSeconds: 10 };
    rateLimit("expire", opts);
    const blocked = rateLimit("expire", opts);
    expect(blocked.success).toBe(false);

    // Avancer de 11 secondes
    vi.advanceTimersByTime(11_000);

    const afterExpiry = rateLimit("expire", opts);
    expect(afterExpiry.success).toBe(true);
    expect(afterExpiry.remaining).toBe(0);

    vi.useRealTimers();
  });

  it("retourne un resetAt dans le futur", () => {
    const now = Date.now();
    const result = rateLimit("time", { maxRequests: 5, windowSeconds: 30 });
    expect(result.resetAt).toBeGreaterThan(now);
    expect(result.resetAt).toBeLessThanOrEqual(now + 30_000 + 10);
  });

  it("effectue le cleanup des entrees expirees", () => {
    vi.useFakeTimers();

    // Creer une entree avec fenetre courte
    rateLimit("cleanup-test", { maxRequests: 1, windowSeconds: 1 });

    // Avancer au-dela de la fenetre + intervalle de cleanup (60s)
    vi.advanceTimersByTime(61_000);

    // Nouvel appel declenche le cleanup, l'entree expiree est supprimee
    const result = rateLimit("cleanup-test", { maxRequests: 1, windowSeconds: 1 });
    expect(result.success).toBe(true);

    vi.useRealTimers();
  });
});

describe("getClientIp", () => {
  it("extrait l'IP depuis x-forwarded-for", () => {
    const headers = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    expect(getClientIp(headers)).toBe("1.2.3.4");
  });

  it("extrait l'IP depuis x-real-ip si x-forwarded-for absent", () => {
    const headers = new Headers({ "x-real-ip": "9.8.7.6" });
    expect(getClientIp(headers)).toBe("9.8.7.6");
  });

  it("retourne 'unknown' sans headers IP", () => {
    const headers = new Headers();
    expect(getClientIp(headers)).toBe("unknown");
  });

  it("trim les espaces dans x-forwarded-for", () => {
    const headers = new Headers({ "x-forwarded-for": "  10.0.0.1 , 10.0.0.2" });
    expect(getClientIp(headers)).toBe("10.0.0.1");
  });
});
