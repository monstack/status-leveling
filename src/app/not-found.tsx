import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="text-5xl">🗺️</div>
        <h1 className="font-display text-xs text-foreground">404 — NOT FOUND</h1>
        <p className="text-sm text-muted-foreground">This area of the map is uncharted.</p>
        <Link
          href="/dashboard"
          className="inline-block mt-2 text-xs font-display text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
        >
          RETURN TO BASE
        </Link>
      </div>
    </div>
  );
}
