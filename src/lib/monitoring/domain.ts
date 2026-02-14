// Logique de verification d'expiration de domaine
// Utilise l'API RDAP (remplacement moderne de WHOIS, sans dependance externe)

interface DomainResult {
  expiresAt: Date | null;
  daysRemaining: number | null;
  errorMessage: string | null;
}

// Mapping des TLD vers les serveurs RDAP
const RDAP_SERVERS: Record<string, string> = {
  com: "https://rdap.verisign.com/com/v1",
  net: "https://rdap.verisign.com/net/v1",
  org: "https://rdap.org/org/v1",
  fr: "https://rdap.nic.fr/domain",
  io: "https://rdap.nic.io/domain",
  dev: "https://rdap.nic.google/domain",
  app: "https://rdap.nic.google/domain",
};

export async function checkDomain(url: string): Promise<DomainResult> {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    // Extraire le domaine principal (ex: example.com depuis www.example.com)
    const parts = hostname.split(".");
    const tld = parts[parts.length - 1];
    const domain = parts.slice(-2).join(".");

    const rdapServer = RDAP_SERVERS[tld];

    if (!rdapServer) {
      return {
        expiresAt: null,
        daysRemaining: null,
        errorMessage: `TLD .${tld} non supporte pour la verification de domaine`,
      };
    }

    const rdapUrl = rdapServer.includes("/domain")
      ? `${rdapServer}/${domain}`
      : `${rdapServer}/domain/${domain}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(rdapUrl, {
      signal: controller.signal,
      headers: { Accept: "application/rdap+json" },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        expiresAt: null,
        daysRemaining: null,
        errorMessage: `RDAP erreur HTTP ${response.status}`,
      };
    }

    const data = await response.json();

    // Chercher la date d'expiration dans les evenements RDAP
    const expirationEvent = data.events?.find(
      (event: { eventAction: string }) =>
        event.eventAction === "expiration"
    );

    if (!expirationEvent?.eventDate) {
      return {
        expiresAt: null,
        daysRemaining: null,
        errorMessage: "Date d'expiration non trouvee dans la reponse RDAP",
      };
    }

    const expiresAt = new Date(expirationEvent.eventDate);
    const now = new Date();
    const daysRemaining = Math.floor(
      (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return { expiresAt, daysRemaining, errorMessage: null };
  } catch (error) {
    return {
      expiresAt: null,
      daysRemaining: null,
      errorMessage:
        error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
