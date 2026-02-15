// Admin : tableau des erreurs systeme
// Liste paginee avec filtre par level et bouton "Marquer resolu"

"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Check } from "lucide-react";

interface ErrorRow {
  id: string;
  level: string;
  category: string;
  message: string;
  file: string | null;
  requestUri: string | null;
  isResolved: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const levelColors: Record<string, string> = {
  DEBUG: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  INFO: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  WARNING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  ERROR: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  CRITICAL: "bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-300",
};

const levels = ["", "DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"];

export default function AdminErrorsPage() {
  const [errors, setErrors] = useState<ErrorRow[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [levelFilter, setLevelFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchErrors = useCallback(async (page: number, level: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "20" });
      if (level) params.set("level", level);

      const res = await fetch(`/api/admin/errors?${params}`);
      if (!res.ok) return;

      const data = await res.json();
      setErrors(data.errors);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchErrors(1, levelFilter);
  }, [fetchErrors, levelFilter]);

  async function markResolved(id: string) {
    const res = await fetch("/api/admin/errors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isResolved: true }),
    });

    if (res.ok) {
      setErrors((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isResolved: true } : e))
      );
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Erreurs systeme</h1>

      <Card>
        <CardHeader>
          <CardTitle>Journal des erreurs</CardTitle>
          <div className="mt-2 flex gap-2">
            {levels.map((level) => (
              <Button
                key={level || "all"}
                variant={levelFilter === level ? "default" : "outline"}
                size="sm"
                onClick={() => setLevelFilter(level)}
              >
                {level || "Tous"}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Chargement...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Categorie</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Resolu</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errors.map((err) => (
                    <TableRow key={err.id}>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(new Date(err.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className={levelColors[err.level] || ""}>
                          {err.level}
                        </Badge>
                      </TableCell>
                      <TableCell>{err.category}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {err.message}
                      </TableCell>
                      <TableCell>
                        {err.isResolved ? (
                          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                            Oui
                          </Badge>
                        ) : (
                          <Badge variant="outline">Non</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {!err.isResolved && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markResolved(err.id)}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Resoudre
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {errors.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Aucune erreur trouvee
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {pagination.total} erreur{pagination.total > 1 ? "s" : ""}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page <= 1}
                      onClick={() => fetchErrors(pagination.page - 1, levelFilter)}
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
                      onClick={() => fetchErrors(pagination.page + 1, levelFilter)}
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
