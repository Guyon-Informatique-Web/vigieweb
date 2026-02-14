// Configuration Prisma - connexion BDD
// Les URLs sont dans .env.local

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Utiliser DIRECT_URL pour les migrations (PgBouncer ne supporte pas db push)
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
