import { describe, it, expect } from "vitest";
import { urlSchema, createSiteSchema, updateSiteSchema } from "../validations";

describe("urlSchema", () => {
  it("accepte une URL HTTPS valide", () => {
    const result = urlSchema.safeParse("https://example.com");
    expect(result.success).toBe(true);
  });

  it("accepte une URL HTTP valide", () => {
    const result = urlSchema.safeParse("http://example.com");
    expect(result.success).toBe(true);
  });

  it("accepte une URL avec chemin et parametres", () => {
    const result = urlSchema.safeParse("https://example.com/page?q=test");
    expect(result.success).toBe(true);
  });

  it("rejette une URL sans protocole", () => {
    const result = urlSchema.safeParse("example.com");
    expect(result.success).toBe(false);
  });

  it("rejette une chaine vide", () => {
    const result = urlSchema.safeParse("");
    expect(result.success).toBe(false);
  });

  it("rejette un protocole ftp", () => {
    const result = urlSchema.safeParse("ftp://example.com");
    expect(result.success).toBe(false);
  });

  // Protection SSRF
  it("bloque localhost", () => {
    const result = urlSchema.safeParse("http://localhost");
    expect(result.success).toBe(false);
  });

  it("bloque 127.0.0.1", () => {
    const result = urlSchema.safeParse("http://127.0.0.1");
    expect(result.success).toBe(false);
  });

  it("bloque 0.0.0.0", () => {
    const result = urlSchema.safeParse("http://0.0.0.0");
    expect(result.success).toBe(false);
  });

  it("bloque les IPs privees 192.168.x.x", () => {
    const result = urlSchema.safeParse("http://192.168.1.1");
    expect(result.success).toBe(false);
  });

  it("bloque les IPs privees 10.x.x.x", () => {
    const result = urlSchema.safeParse("http://10.0.0.1");
    expect(result.success).toBe(false);
  });

  it("bloque les IPs privees 172.16.x.x", () => {
    const result = urlSchema.safeParse("http://172.16.0.1");
    expect(result.success).toBe(false);
  });

  it("bloque ::1 (IPv6 loopback)", () => {
    // new URL("http://[::1]").hostname retourne "[::1]" avec crochets
    const result = urlSchema.safeParse("http://[::1]");
    expect(result.success).toBe(false);
  });
});

describe("createSiteSchema", () => {
  it("accepte des donnees valides", () => {
    const result = createSiteSchema.safeParse({
      name: "Mon Site",
      url: "https://example.com",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Mon Site");
      expect(result.data.isActive).toBe(true); // default
    }
  });

  it("accepte isActive = false", () => {
    const result = createSiteSchema.safeParse({
      name: "Test",
      url: "https://example.com",
      isActive: false,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isActive).toBe(false);
    }
  });

  it("rejette un nom vide", () => {
    const result = createSiteSchema.safeParse({
      name: "",
      url: "https://example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejette un nom trop long (> 100 caracteres)", () => {
    const result = createSiteSchema.safeParse({
      name: "a".repeat(101),
      url: "https://example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejette sans champ url", () => {
    const result = createSiteSchema.safeParse({ name: "Test" });
    expect(result.success).toBe(false);
  });

  it("rejette une URL SSRF", () => {
    const result = createSiteSchema.safeParse({
      name: "Hack",
      url: "http://localhost:3000/admin",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateSiteSchema", () => {
  it("accepte un nom seul", () => {
    const result = updateSiteSchema.safeParse({ name: "Nouveau nom" });
    expect(result.success).toBe(true);
  });

  it("accepte isActive seul", () => {
    const result = updateSiteSchema.safeParse({ isActive: false });
    expect(result.success).toBe(true);
  });

  it("accepte un objet vide", () => {
    const result = updateSiteSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejette un nom vide si fourni", () => {
    const result = updateSiteSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });
});
