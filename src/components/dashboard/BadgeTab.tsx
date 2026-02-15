// Onglet Badge dans le detail d'un site
// Preview 3 styles, toggle, code embed HTML + Markdown, bouton copier

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, Loader2 } from "lucide-react";

interface BadgeTabProps {
  siteId: string;
  siteName: string;
  badgeEnabled: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vigieweb.fr";

const styles = [
  { key: "flat", label: "Flat" },
  { key: "flat-square", label: "Flat Square" },
  { key: "for-the-badge", label: "For the Badge" },
] as const;

export function BadgeTab({ siteId, siteName, badgeEnabled }: BadgeTabProps) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(badgeEnabled);
  const [saving, setSaving] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>("flat");

  const badgeUrl = `${BASE_URL}/api/badge/${siteId}?style=${selectedStyle}`;
  const siteUrl = `${BASE_URL}`;

  const htmlCode = `<a href="${siteUrl}" target="_blank" rel="noopener noreferrer"><img src="${badgeUrl}" alt="Uptime ${siteName} - Vigie Web" /></a>`;
  const markdownCode = `[![Uptime ${siteName} - Vigie Web](${badgeUrl})](${siteUrl})`;

  const handleToggle = async (value: boolean) => {
    setEnabled(value);
    setSaving(true);
    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ badgeEnabled: value }),
      });

      if (!response.ok) {
        toast.error("Erreur lors de la mise a jour");
        setEnabled(!value);
        return;
      }

      toast.success(value ? "Badge active" : "Badge desactive");
      router.refresh();
    } catch {
      toast.error("Erreur de connexion");
      setEnabled(!value);
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Code ${label} copie`);
    } catch {
      toast.error("Impossible de copier");
    }
  };

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Badge uptime</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Activer le badge public</Label>
              <p className="text-sm text-muted-foreground">
                Permet d&apos;integrer un badge uptime sur vos sites
              </p>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={handleToggle}
              disabled={saving}
            />
          </div>
          {saving && (
            <Loader2 className="mt-2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </CardContent>
      </Card>

      {enabled && (
        <>
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Apercu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                {styles.map((s) => (
                  <Button
                    key={s.key}
                    variant={selectedStyle === s.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStyle(s.key)}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
              <div className="rounded-lg border bg-muted/50 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={badgeUrl}
                  alt={`Badge uptime ${siteName}`}
                  className="h-auto"
                />
              </div>
            </CardContent>
          </Card>

          {/* Code embed */}
          <Card>
            <CardHeader>
              <CardTitle>Integrer le badge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <Label>HTML</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(htmlCode, "HTML")}
                  >
                    <Copy className="mr-1 h-3 w-3" />
                    Copier
                  </Button>
                </div>
                <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                  <code>{htmlCode}</code>
                </pre>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <Label>Markdown</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(markdownCode, "Markdown")}
                  >
                    <Copy className="mr-1 h-3 w-3" />
                    Copier
                  </Button>
                </div>
                <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                  <code>{markdownCode}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
