// Barre d'uptime 90 jours
// Affiche un carre par jour : vert (>99%), jaune (95-99%), rouge (<95%), gris (pas de donnees)

"use client";

interface UptimeDay {
  date: string;
  uptimePercent: number;
}

interface UptimeBarProps {
  days: UptimeDay[];
}

function getColor(percent: number): string {
  if (percent >= 99) return "bg-emerald-500";
  if (percent >= 95) return "bg-amber-500";
  return "bg-red-500";
}

function getLabel(percent: number): string {
  if (percent >= 99) return "Operationnel";
  if (percent >= 95) return "Degrade";
  return "Incident";
}

export function UptimeBar({ days }: UptimeBarProps) {
  // Completer les 90 derniers jours
  const today = new Date();
  const allDays: (UptimeDay | null)[] = [];
  const dayMap = new Map(days.map((d) => [d.date, d]));

  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    allDays.push(dayMap.get(key) || null);
  }

  return (
    <div>
      <div className="flex gap-0.5">
        {allDays.map((day, i) => (
          <div
            key={i}
            className={`h-8 flex-1 rounded-sm ${
              day ? getColor(day.uptimePercent) : "bg-muted"
            }`}
            title={
              day
                ? `${day.date} : ${day.uptimePercent}% - ${getLabel(day.uptimePercent)}`
                : "Pas de donnees"
            }
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>90 jours</span>
        <span>Aujourd&apos;hui</span>
      </div>
    </div>
  );
}
