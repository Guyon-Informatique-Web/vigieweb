// Logique de verification SSL
// Verifie la validite et la date d'expiration du certificat

import tls from "tls";

interface SSLResult {
  valid: boolean;
  expiresAt: Date | null;
  issuer: string | null;
  daysRemaining: number | null;
  errorMessage: string | null;
}

export async function checkSSL(url: string): Promise<SSLResult> {
  try {
    const parsedUrl = new URL(url);

    // SSL uniquement pour HTTPS
    if (parsedUrl.protocol !== "https:") {
      return {
        valid: false,
        expiresAt: null,
        issuer: null,
        daysRemaining: null,
        errorMessage: "Le site n'utilise pas HTTPS",
      };
    }

    const hostname = parsedUrl.hostname;
    const port = parseInt(parsedUrl.port) || 443;

    return new Promise((resolve) => {
      const socket = tls.connect(
        { host: hostname, port, servername: hostname, timeout: 10000 },
        () => {
          const cert = socket.getPeerCertificate();

          if (!cert || !cert.valid_to) {
            socket.destroy();
            resolve({
              valid: false,
              expiresAt: null,
              issuer: null,
              daysRemaining: null,
              errorMessage: "Impossible de lire le certificat",
            });
            return;
          }

          const expiresAt = new Date(cert.valid_to);
          const now = new Date();
          const daysRemaining = Math.floor(
            (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );

          const issuer = cert.issuer
            ? cert.issuer.O || cert.issuer.CN || "Inconnu"
            : "Inconnu";

          socket.destroy();
          resolve({
            valid: daysRemaining > 0,
            expiresAt,
            issuer,
            daysRemaining,
            errorMessage: null,
          });
        }
      );

      socket.on("error", (error) => {
        socket.destroy();
        resolve({
          valid: false,
          expiresAt: null,
          issuer: null,
          daysRemaining: null,
          errorMessage: error.message,
        });
      });

      socket.on("timeout", () => {
        socket.destroy();
        resolve({
          valid: false,
          expiresAt: null,
          issuer: null,
          daysRemaining: null,
          errorMessage: "Timeout connexion SSL",
        });
      });
    });
  } catch (error) {
    return {
      valid: false,
      expiresAt: null,
      issuer: null,
      daysRemaining: null,
      errorMessage:
        error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
