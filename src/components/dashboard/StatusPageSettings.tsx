// Parametres de la page de statut publique
// Toggle, champ slug, checkboxes pour les sites

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, ExternalLink } from "lucide-react";

interface SiteOption {
  id: string;
  name: string;
}

interface StatusPageSettingsProps {
  enabled: boolean;
  slug: string;
  selectedSiteIds: string[];
  sites: SiteOption[];
}

export function StatusPageSettings({
  enabled: initialEnabled,
  slug: initialSlug,
  selectedSiteIds: initialSiteIds,
  sites,
}: StatusPageSettingsProps) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initialEnabled);
  const [slug, setSlug] = useState(initialSlug);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSiteIds);
  const [saving, setSaving] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vigieweb.fr";

  const handleSave = async () => {
    if (enabled && !slug.trim()) {
      toast.error("Le slug est requis pour activer la page de statut");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/settings/status-page", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statusPageEnabled: enabled,
          statusSlug: slug.trim().toLowerCase(),
          statusSiteIds: selectedIds,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Erreur lors de la sauvegarde");
        return;
      }

      toast.success("Page de statut mise a jour");
      router.refresh();
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setSaving(false);
    }
  };

  const toggleSite = (siteId: string) => {
    setSelectedIds((prev) =>
      prev.includes(siteId)
        ? prev.filter((id) => id !== siteId)
        : [...prev, siteId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Page de statut publique</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label>Activer la page de statut</Label>
            <p className="text-sm text-muted-foreground">
              Rendez visible l&apos;etat de vos sites sur une page publique
            </p>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="status-slug">URL de la page</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {baseUrl}/status/
            </span>
            <Input
              id="status-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="mon-entreprise"
              className="max-w-xs"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Lettres minuscules, chiffres et tirets uniquement (3-50 caracteres)
          </p>
        </div>

        {/* Selection des sites */}
        <div className="space-y-3">
          <Label>Sites a afficher</Label>
          {sites.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucun site configure. Ajoutez d&apos;abord un site a surveiller.
            </p>
          ) : (
            <div className="space-y-2">
              {sites.map((site) => (
                <div key={site.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`site-${site.id}`}
                    checked={selectedIds.includes(site.id)}
                    onCheckedChange={() => toggleSite(site.id)}
                  />
                  <label
                    htmlFor={`site-${site.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {site.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lien vers la page */}
        {enabled && slug && (
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="text-sm">
              Votre page de statut :{" "}
              <a
                href={`${baseUrl}/status/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {baseUrl}/status/{slug}
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        )}

        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer
        </Button>
      </CardContent>
    </Card>
  );
}
