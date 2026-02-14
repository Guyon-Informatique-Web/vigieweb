// Template React Email pour les alertes
// Email clair et concis avec lien vers le dashboard

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface AlertEmailProps {
  siteName: string;
  siteUrl: string;
  alertTitle: string;
  alertMessage: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  dashboardUrl: string;
  settingsUrl: string;
}

const severityColors = {
  INFO: "#3B82F6",
  WARNING: "#F59E0B",
  CRITICAL: "#EF4444",
};

const severityLabels = {
  INFO: "Information",
  WARNING: "Avertissement",
  CRITICAL: "Critique",
};

export function AlertEmail({
  siteName,
  siteUrl,
  alertTitle,
  alertMessage,
  severity,
  dashboardUrl,
  settingsUrl,
}: AlertEmailProps) {
  const color = severityColors[severity];

  return (
    <Html>
      <Head />
      <Preview>
        {alertTitle} - {siteName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* En-tete */}
          <Section style={header}>
            <Text style={logo}>Vigie Web</Text>
          </Section>

          {/* Badge severite */}
          <Section
            style={{
              ...severityBadge,
              backgroundColor: color,
            }}
          >
            <Text style={severityText}>{severityLabels[severity]}</Text>
          </Section>

          {/* Contenu */}
          <Heading style={heading}>{alertTitle}</Heading>

          <Text style={paragraph}>
            Un probleme a ete detecte sur votre site{" "}
            <Link href={siteUrl} style={link}>
              {siteName}
            </Link>{" "}
            :
          </Text>

          <Section style={detailBox}>
            <Text style={detailText}>{alertMessage}</Text>
            <Text style={detailMeta}>
              Site : {siteUrl}
              <br />
              Detection : {new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}
            </Text>
          </Section>

          {/* CTA */}
          <Section style={buttonSection}>
            <Button style={button} href={dashboardUrl}>
              Voir les details
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            Cet email a ete envoye par Vigie Web.
            <br />
            <Link href={settingsUrl} style={footerLink}>
              Gerer mes notifications
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles inline pour compatibilite email
const main = {
  backgroundColor: "#F9FAFB",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const header = {
  padding: "24px 0",
  textAlign: "center" as const,
};

const logo = {
  fontSize: "24px",
  fontWeight: "bold" as const,
  color: "#4F46E5",
  margin: "0",
};

const severityBadge = {
  borderRadius: "6px",
  padding: "8px 16px",
  textAlign: "center" as const,
  marginBottom: "16px",
};

const severityText = {
  color: "#FFFFFF",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0",
  textTransform: "uppercase" as const,
};

const heading = {
  fontSize: "22px",
  fontWeight: "bold" as const,
  color: "#111827",
  margin: "16px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#374151",
};

const link = {
  color: "#4F46E5",
  textDecoration: "underline",
};

const detailBox = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E5E7EB",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
};

const detailText = {
  fontSize: "15px",
  color: "#111827",
  fontWeight: "500" as const,
  margin: "0 0 8px 0",
};

const detailMeta = {
  fontSize: "13px",
  color: "#6B7280",
  margin: "0",
  lineHeight: "20px",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#4F46E5",
  color: "#FFFFFF",
  fontSize: "16px",
  fontWeight: "600" as const,
  padding: "12px 24px",
  borderRadius: "8px",
  textDecoration: "none",
};

const hr = {
  borderColor: "#E5E7EB",
  margin: "24px 0",
};

const footer = {
  fontSize: "12px",
  color: "#9CA3AF",
  textAlign: "center" as const,
  lineHeight: "20px",
};

const footerLink = {
  color: "#6B7280",
  textDecoration: "underline",
};
