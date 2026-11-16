import type { ReactNode } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { ArrowRight, Info } from "lucide-react";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  actions,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="animate-fade-up space-y-3 pb-6 pt-6 sm:pt-10">
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h1>
        {actions}
      </div>
      {lead && <p className="max-w-2xl text-muted-foreground">{lead}</p>}
      {children}
    </header>
  );
}

export function SectionHeader({
  title,
  hint,
  link,
}: {
  title: ReactNode;
  hint?: ReactNode;
  link?: { label: string } & Pick<LinkProps, "to" | "params" | "search">;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      </div>
      {link && (
        <Link
          to={link.to}
          params={link.params}
          search={link.search}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          {link.label}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}

export function Notice({ children, tone = "amber", className }: { children: ReactNode; tone?: "amber" | "ink"; className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-2 rounded-md border px-3 py-2 text-sm",
        tone === "amber" ? "border-amber/30 bg-amber-soft text-foreground" : "border-primary/20 bg-primary-soft text-foreground",
        className,
      )}
    >
      <Info className={cn("mt-0.5 size-4 shrink-0", tone === "amber" ? "text-amber" : "text-primary")} />
      <div>{children}</div>
    </div>
  );
}

export function DemoNotice({ className }: { className?: string }) {
  const t = useT();
  return <Notice className={className}>{t.app.demoNotice}</Notice>;
}
