// Schemas de validation Zod pour les API routes

import { z } from "zod";

// Validation URL : doit etre une URL valide avec protocole http(s)
export const urlSchema = z
  .string()
  .url("URL invalide")
  .refine(
    (url) => url.startsWith("http://") || url.startsWith("https://"),
    "L'URL doit commencer par http:// ou https://"
  )
  .refine((url) => {
    // Bloquer les IPs privees et localhost (protection SSRF)
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname;
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "0.0.0.0" ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.") ||
        hostname.startsWith("172.16.") ||
        hostname === "::1"
      ) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }, "Les adresses locales et privees ne sont pas autorisees");

// Schema pour ajouter un site
export const createSiteSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne peut pas depasser 100 caracteres"),
  url: urlSchema,
  isActive: z.boolean().optional().default(true),
});

// Schema pour modifier un site
export const updateSiteSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne peut pas depasser 100 caracteres")
    .optional(),
  isActive: z.boolean().optional(),
});

export type CreateSiteInput = z.infer<typeof createSiteSchema>;
export type UpdateSiteInput = z.infer<typeof updateSiteSchema>;
