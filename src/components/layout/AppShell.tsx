import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, Stamp, UserRound } from "lucide-react";
import { useT } from "@/i18n";
import { useCollection } from "@/stores/collection";
import { cn } from "@/lib/utils";
import { primaryNav, secondaryNav } from "./nav-items";

export function Logo({ compact }: { compact?: boolean }) {
  const t = useT();
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label={t.app.name}>
      <span className="grid size-9 shrink-0 -rotate-6 place-items-center rounded-full border-2 border-dashed border-primary text-primary">
        <Stamp className="size-4" />
      </span>
      <span className={cn("min-w-0 font-display font-extrabold leading-[1.05] text-foreground", compact ? "text-base" : "text-lg")}>
        <span className="block truncate">Карта туристических</span>
        <span className="block truncate text-primary">печатей России</span>
      </span>
    </Link>
  );
}

function CountBubble({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-stamp px-1 text-[10px] font-bold leading-none text-stamp-foreground">
      {n}
    </span>
  );
}

function Header() {
  const t = useT();
  const { list } = useCollection();
  const items = [...primaryNav.slice(0, 4), ...secondaryNav, ...primaryNav.slice(4)];
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-[var(--header-h)] max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Logo compact />
        <nav aria-label={t.nav.main} className="ml-auto hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-primary-soft data-[status=active]:text-accent-foreground"
            >
              <span className="relative">
                {item.label(t)}
                {item.to === "/collection" && <CountBubble n={list.length} />}
              </span>
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <Link
            to="/routes"
            aria-label={t.nav.routes}
            className="grid size-10 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground data-[status=active]:text-primary lg:hidden"
          >
            <Compass className="size-5" />
          </Link>
          <Link
            to="/profile"
            aria-label={t.nav.profile}
            className="grid size-10 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground data-[status=active]:text-primary"
          >
            <UserRound className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function BottomNav() {
  const t = useT();
  const { list } = useCollection();
  return (
    <nav
      aria-label={t.nav.main}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto grid h-[var(--bottom-nav-h)] max-w-lg grid-cols-5">
        {primaryNav.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                activeOptions={{ exact: item.exact }}
                className="group flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground data-[status=active]:text-primary"
              >
                <span className="relative grid h-7 w-12 place-items-center rounded-full transition-colors group-data-[status=active]:bg-primary-soft">
                  <Icon className="size-5" />
                  {item.to === "/collection" && <CountBubble n={list.length} />}
                </span>
                <span className="max-w-full truncate px-0.5">{(item.short ?? item.label)(t)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Footer() {
  const t = useT();
  return (
    <footer className="mt-16 border-t border-border bg-paper-deep/60">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-2">
          <Logo compact />
          <p className="max-w-sm text-muted-foreground">{t.app.tagline}.</p>
          <p className="max-w-sm text-xs text-muted-foreground">{t.app.demoNotice}</p>
        </div>
        <ul className="space-y-1.5">
          {[...primaryNav, ...secondaryNav].map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="text-muted-foreground hover:text-primary">
                {item.label(t)}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="space-y-1.5">
          <li>
            <Link to="/profile" className="text-muted-foreground hover:text-primary">{t.nav.profile}</Link>
          </li>
          <li>
            <Link to="/admin" className="text-muted-foreground hover:text-primary">{t.nav.admin}</Link>
          </li>
          <li className="pt-2 text-xs text-muted-foreground">{t.map.attributionNote}</li>
        </ul>
      </div>
    </footer>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const t = useT();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const fullBleed = pathname === "/map";
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-card focus:px-3 focus:py-2">
        {t.app.skipToContent}
      </a>
      <Header />
      <main id="main" className={cn("flex-1", fullBleed ? "" : "pb-[calc(var(--bottom-nav-h)+1.5rem)] lg:pb-0")}>
        {children}
      </main>
      {!fullBleed && <Footer />}
      {!fullBleed && <div className="h-[var(--bottom-nav-h)] lg:hidden" aria-hidden />}
      <BottomNav />
    </div>
  );
}
