// Admin : tableau des utilisateurs
// Liste paginee avec recherche par email

"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  sitesCount: number;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const planColors: Record<string, string> = {
  FREE: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  PRO: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  AGENCY: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async (page: number, searchTerm: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "20" });
      if (searchTerm) params.set("search", searchTerm);

      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) return;

      const data = await res.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(1, search);
  }, [fetchUsers, search]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Utilisateurs</h1>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <Input
            placeholder="Rechercher par email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-2 max-w-sm"
          />
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Chargement...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Sites</TableHead>
                    <TableHead>Inscription</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.email}</p>
                          {user.name && (
                            <p className="text-sm text-muted-foreground">
                              {user.name}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={planColors[user.plan] || ""}>
                          {user.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.sitesCount}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(new Date(user.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Aucun utilisateur trouve
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {pagination.total} utilisateur{pagination.total > 1 ? "s" : ""}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page <= 1}
                      onClick={() => fetchUsers(pagination.page - 1, search)}
                    >
                      Precedent
                    </Button>
                    <span className="flex items-center text-sm text-muted-foreground">
                      {pagination.page} / {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => fetchUsers(pagination.page + 1, search)}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
