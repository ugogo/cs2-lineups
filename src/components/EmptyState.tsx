import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center",
        className,
      )}
    >
      <CrosshairIcon />
      <p className="mt-4 font-heading text-lg uppercase tracking-wider text-foreground">
        {title}
      </p>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

function CrosshairIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="size-12 text-primary/40"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M24 4v8M24 36v8M4 24h8M36 24h8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
