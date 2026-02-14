// Composant client pour les parametres de notification
// Toggles email/Discord, URL webhook, bouton tester

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Mail, MessageSquare, Loader2, Send } from "lucide-react";

interface NotificationsClientProps {
  notifyEmail: boolean;
  notifyDiscord: boolean;
  discordWebhookUrl: string;
  plan: string;
}

export function NotificationsClient({
  notifyEmail: initialEmail,
  notifyDiscord: initialDiscord,
  discordWebhookUrl: initialWebhookUrl,
  plan,
}: NotificationsClientProps) {
  const [notifyEmail, setNotifyEmail] = useState(initialEmail);
  const [notifyDiscord, setNotifyDiscord] = useState(initialDiscord);
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  // Discord uniquement disponible pour les plans Pro et Agence
  const discordAvailable = plan !== "FREE";

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/settings/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notifyEmail,
          notifyDiscord: discordAvailable ? notifyDiscord : false,
          discordWebhookUrl: webhookUrl || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Erreur lors de la sauvegarde");
        return;
      }

      toast.success("Preferences sauvegardees");
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setSaving(false);
    }
  };

  const handleTestDiscord = async () => {
    if (!webhookUrl) {
      toast.error("Entrez une URL de webhook Discord");
      return;
    }

    setTesting(true);
    try {
      const response = await fetch("/api/settings/notifications/test-discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Echec du test");
        return;
      }

      toast.success("Notification de test envoyee sur Discord");
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Mail className="h-5 w-5" />
            Notifications par email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Recevoir les alertes par email</Label>
              <p className="text-sm text-muted-foreground">
                Un email sera envoye a chaque alerte detectee
              </p>
            </div>
            <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
          </div>
        </CardContent>
      </Card>

      {/* Discord */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-5 w-5" />
            Notifications Discord
            {!discordAvailable && (
              <Badge variant="secondary">Pro / Agence</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Recevoir les alertes sur Discord</Label>
              <p className="text-sm text-muted-foreground">
                Un message sera envoye dans votre canal Discord
              </p>
            </div>
            <Switch
              checked={notifyDiscord}
              onCheckedChange={setNotifyDiscord}
              disabled={!discordAvailable}
            />
          </div>

          {discordAvailable && notifyDiscord && (
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">URL du webhook Discord</Label>
              <div className="flex gap-2">
                <Input
                  id="webhookUrl"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={handleTestDiscord}
                  disabled={testing || !webhookUrl}
                >
                  {testing ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-1 h-4 w-4" />
                  )}
                  Tester
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Parametres du serveur &gt; Integrations &gt; Webhooks &gt;
                Nouveau webhook
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bouton sauvegarder */}
      <Button onClick={handleSave} disabled={saving}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sauvegarder les preferences
      </Button>
    </div>
  );
}
