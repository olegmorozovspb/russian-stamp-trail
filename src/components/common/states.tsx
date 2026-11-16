import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, SearchX, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  text,
  action,
  icon,
  className,
}: {
  title: string;
  text?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("surface flex flex-col items-center gap-3 px-6 py-10 text-center", className)}>
      <div className="stamp-ring grid size-14 place-items-center text-primary">{icon ?? <SearchX className="size-6" />}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      {text && <p className="max-w-sm text-sm text-muted-foreground">{text}</p>}
      {action}
    </div>
  );
}

export function LoadingState({ label }: { label?: string }) {
  const t = useT();
  return (
    <div className="flex min-h-[40vh] items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
      <Loader2 className="size-4 animate-spin" />
      {label ?? t.common.loading}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  const t = useT();
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <EmptyState
        icon={<TriangleAlert className="size-6" />}
        title={t.common.errorTitle}
        text={t.common.errorText}
        action={onRetry && <Button onClick={onRetry}>{t.common.retry}</Button>}
      />
    </div>
  );
}

export function NotFoundState() {
  const t = useT();
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <EmptyState
        title={t.common.notFoundTitle}
        text={t.common.notFoundText}
        action={
          <Button asChild>
            <Link to="/">{t.common.toHome}</Link>
          </Button>
        }
      />
    </div>
  );
}
