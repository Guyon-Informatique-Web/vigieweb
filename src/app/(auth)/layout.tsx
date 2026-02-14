// Layout des pages d'authentification
// Centree verticalement avec logo en haut

import Link from "next/link";
import { Shield } from "lucide-react";
import { APP_CONFIG } from "@/config/app";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-8">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-2xl font-bold"
      >
        <Shield className="h-8 w-8 text-indigo-600" />
        <span>{APP_CONFIG.name}</span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
