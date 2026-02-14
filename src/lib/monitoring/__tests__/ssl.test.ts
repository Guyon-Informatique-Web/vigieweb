import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { EventEmitter } from "events";

// Mock du module tls
vi.mock("tls", () => {
  return {
    default: {
      connect: vi.fn(),
    },
  };
});

import tls from "tls";
import { checkSSL } from "../ssl";

const mockConnect = tls.connect as ReturnType<typeof vi.fn>;

function createMockSocket() {
  const socket = new EventEmitter() as EventEmitter & {
    getPeerCertificate: ReturnType<typeof vi.fn>;
    destroy: ReturnType<typeof vi.fn>;
  };
  socket.getPeerCertificate = vi.fn();
  socket.destroy = vi.fn();
  return socket;
}

beforeEach(() => {
  mockConnect.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("checkSSL", () => {
  it("retourne invalide pour une URL HTTP (pas HTTPS)", async () => {
    const result = await checkSSL("http://example.com");
    expect(result.valid).toBe(false);
    expect(result.errorMessage).toBe("Le site n'utilise pas HTTPS");
    expect(mockConnect).not.toHaveBeenCalled();
  });

  it("retourne valide pour un certificat non expire", async () => {
    const socket = createMockSocket();
    const futureDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // +90 jours

    socket.getPeerCertificate.mockReturnValue({
      valid_to: futureDate.toISOString(),
      issuer: { O: "Let's Encrypt", CN: "R3" },
    });

    mockConnect.mockImplementation((_opts: unknown, callback: () => void) => {
      setTimeout(() => callback(), 0);
      return socket;
    });

    const result = await checkSSL("https://example.com");

    expect(result.valid).toBe(true);
    expect(result.daysRemaining).toBeGreaterThan(80);
    expect(result.issuer).toBe("Let's Encrypt");
    expect(result.expiresAt).toBeInstanceOf(Date);
    expect(result.errorMessage).toBeNull();
  });

  it("retourne invalide pour un certificat expire", async () => {
    const socket = createMockSocket();
    const pastDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // -10 jours

    socket.getPeerCertificate.mockReturnValue({
      valid_to: pastDate.toISOString(),
      issuer: { O: "DigiCert" },
    });

    mockConnect.mockImplementation((_opts: unknown, callback: () => void) => {
      setTimeout(() => callback(), 0);
      return socket;
    });

    const result = await checkSSL("https://expired.example.com");

    expect(result.valid).toBe(false);
    expect(result.daysRemaining).toBeLessThan(0);
    expect(result.issuer).toBe("DigiCert");
  });

  it("gere un certificat sans valid_to", async () => {
    const socket = createMockSocket();

    socket.getPeerCertificate.mockReturnValue({});

    mockConnect.mockImplementation((_opts: unknown, callback: () => void) => {
      setTimeout(() => callback(), 0);
      return socket;
    });

    const result = await checkSSL("https://no-cert.example.com");

    expect(result.valid).toBe(false);
    expect(result.errorMessage).toBe("Impossible de lire le certificat");
  });

  it("gere les erreurs de connexion", async () => {
    const socket = createMockSocket();

    mockConnect.mockImplementation(() => {
      setTimeout(() => socket.emit("error", new Error("ECONNREFUSED")), 0);
      return socket;
    });

    const result = await checkSSL("https://offline.example.com");

    expect(result.valid).toBe(false);
    expect(result.errorMessage).toBe("ECONNREFUSED");
  });

  it("gere le timeout SSL", async () => {
    const socket = createMockSocket();

    mockConnect.mockImplementation(() => {
      setTimeout(() => socket.emit("timeout"), 0);
      return socket;
    });

    const result = await checkSSL("https://slow.example.com");

    expect(result.valid).toBe(false);
    expect(result.errorMessage).toBe("Timeout connexion SSL");
  });

  it("utilise le port 443 par defaut", async () => {
    const socket = createMockSocket();
    socket.getPeerCertificate.mockReturnValue({
      valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      issuer: { O: "Test" },
    });

    mockConnect.mockImplementation((_opts: unknown, callback: () => void) => {
      setTimeout(() => callback(), 0);
      return socket;
    });

    await checkSSL("https://example.com");

    expect(mockConnect).toHaveBeenCalledWith(
      expect.objectContaining({ host: "example.com", port: 443 }),
      expect.any(Function)
    );
  });

  it("utilise un port custom si specifie dans l'URL", async () => {
    const socket = createMockSocket();
    socket.getPeerCertificate.mockReturnValue({
      valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      issuer: { CN: "Test CA" },
    });

    mockConnect.mockImplementation((_opts: unknown, callback: () => void) => {
      setTimeout(() => callback(), 0);
      return socket;
    });

    await checkSSL("https://example.com:8443");

    expect(mockConnect).toHaveBeenCalledWith(
      expect.objectContaining({ port: 8443 }),
      expect.any(Function)
    );
  });

  it("fallback sur CN si O absent dans issuer", async () => {
    const socket = createMockSocket();
    socket.getPeerCertificate.mockReturnValue({
      valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      issuer: { CN: "R3" },
    });

    mockConnect.mockImplementation((_opts: unknown, callback: () => void) => {
      setTimeout(() => callback(), 0);
      return socket;
    });

    const result = await checkSSL("https://example.com");
    expect(result.issuer).toBe("R3");
  });
});
