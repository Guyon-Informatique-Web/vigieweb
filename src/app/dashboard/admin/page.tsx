// Dashboard admin : vue d'ensemble
// Accessible uniquement aux utilisateurs isAdmin

import type { Metadata } from "next";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Globe, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Administration",
};

export default async function AdminPage() {
  const { user, error } = await getAuthUser();
  if (error || !user) redirect("/login");
  if (!user.isAdmin) redirect("/dashboard");

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [totalUsers, proUsers, agencyUsers, totalSites, unresolvedErrors] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { plan: "PRO" } }),
      prisma.user.count({ where: { plan: "AGENCY" } }),
      prisma.site.count({ where: { isActive: true } }),
      prisma.errorLog.count({ where: { isResolved: false } }),
    ]);

  const mrr = Math.round((proUsers * 9.99 + agencyUsers * 29.99) * 100) / 100;

  const stats = [
    {
      title: "Utilisateurs",
      value: totalUsers.toString(),
      icon: Users,
      color: "text-indigo-600",
      href: "/dashboard/admin/users",
    },
    {
      title: "MRR",
      value: `${mrr} EUR`,
      icon: DollarSign,
      color: "text-emerald-600",
      href: "/dashboard/admin/users",
    },
    {
      title: "Sites actifs",
      value: totalSites.toString(),
      icon: Globe,
      color: "text-blue-600",
      href: "/dashboard/admin/users",
    },
    {
      title: "Erreurs",
      value: unresolvedErrors.toString(),
      icon: AlertTriangle,
      color: "text-red-600",
      href: "/dashboard/admin/errors",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Administration</h1>

      {/* Cartes stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Liens rapides */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/admin/users">
          <Button variant="outline" className="w-full">
            Utilisateurs
          </Button>
        </Link>
        <Link href="/dashboard/admin/errors">
          <Button variant="outline" className="w-full">
            Erreurs systeme
          </Button>
        </Link>
        <Link href="/dashboard/admin/subscribers">
          <Button variant="outline" className="w-full">
            Newsletter
          </Button>
        </Link>
      </div>
    </div>
  );
}
