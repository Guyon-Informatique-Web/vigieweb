// Formulaire newsletter reutilisable
// Utilise dans le blog, le footer et la landing page

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface NewsletterFormProps {
  source: "landing" | "blog" | "footer";
  className?: string;
}

type FormState = "idle" | "loading" | "success" | "error";

export function NewsletterForm({ source, className }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setState("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });

      if (response.status === 429) {
        setState("error");
        setErrorMessage("Trop de requetes. Reessayez dans quelques instants.");
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        setState("error");
        setErrorMessage(data.error || "Une erreur est survenue");
        return;
      }

      setState("success");
      setEmail("");
    } catch {
      setState("error");
      setErrorMessage("Erreur de connexion. Verifiez votre connexion internet.");
    }
  };

  if (state === "success") {
    return (
      <div className={className}>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-5 w-5" />
          <p className="text-sm font-medium">
            Inscription confirmee. Merci !
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={state === "loading"}
          className="max-w-xs"
        />
        <Button type="submit" disabled={state === "loading"}>
          {state === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "S'inscrire"
          )}
        </Button>
      </div>
      {state === "error" && (
        <div className="mt-2 flex items-center gap-1 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {errorMessage}
        </div>
      )}
    </form>
  );
}
