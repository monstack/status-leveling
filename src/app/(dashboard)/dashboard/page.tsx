import { DailyLogForm } from "@/components/rpg/DailyLogForm";
import { CharacterPanelWrapper } from "@/components/rpg/CharacterPanelWrapper";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const today = new Date();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-xs text-muted-foreground">DAILY LOG</h1>
        <p className="text-sm text-foreground mt-1">{formatDate(today)}</p>
      </div>

      {/* Character panel */}
      <CharacterPanelWrapper />

      {/* Log form */}
      <DailyLogForm />
    </div>
  );
}
