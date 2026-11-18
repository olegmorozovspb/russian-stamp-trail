import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, LayoutDashboard, Smartphone, Stamp, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Container, PageHeader } from "@/components/common/page";
import { SelectField } from "@/components/common/controls";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCollection } from "@/stores/collection";
import { useRouteBuilder } from "@/stores/route-builder";
import { dictionaries, useT } from "@/i18n";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Профиль — Карта туристических печатей России" },
      { name: "description", content: "Данные коллекции и маршрута в этом браузере, язык интерфейса и информация о проекте." },
      { property: "og:title", content: "Профиль — Карта туристических печатей" },
      { property: "og:description", content: "Коллекция, маршрут и настройки." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const t = useT();
  const collection = useCollection();
  const route = useRouteBuilder();

  return (
    <Container className="max-w-3xl">
      <PageHeader title={t.profile.title} />
      <div className="space-y-4">
        <section className="surface flex items-start gap-4 p-5">
          <div className="grid size-14 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
            <UserRound className="size-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{t.profile.guest}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.profile.guestText}</p>
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="mb-3 text-xl font-bold">{t.profile.stats}</h2>
          <dl className="grid grid-cols-2 gap-3">
            <Link to="/collection" className="rounded-md border border-border p-3 hover:border-primary/40">
              <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><Stamp className="size-3.5" />{t.profile.collected}</dt>
              <dd className="font-display text-3xl font-extrabold text-stamp">{collection.list.length}</dd>
            </Link>
            <Link to="/routes" className="rounded-md border border-border p-3 hover:border-primary/40">
              <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><Compass className="size-3.5" />{t.profile.routeStops}</dt>
              <dd className="font-display text-3xl font-extrabold text-primary">{route.stops.length}</dd>
            </Link>
          </dl>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="mt-3 text-stamp hover:text-stamp" disabled={!collection.list.length && !route.stops.length}>
                {t.profile.clearData}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.profile.clearConfirmTitle}</AlertDialogTitle>
                <AlertDialogDescription>{t.profile.clearConfirmText}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    collection.clear();
                    route.clear();
                    toast(t.profile.cleared);
                  }}
                >
                  {t.common.delete}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>

        <section className="surface p-5">
          <SelectField label={t.profile.language} value="ru" onChange={() => undefined} className="max-w-xs">
            {Object.keys(dictionaries).map((l) => (
              <option key={l} value={l}>Русский</option>
            ))}
          </SelectField>
          <p className="mt-2 text-xs text-muted-foreground">{t.profile.languageNote}</p>
        </section>

        <section className="surface space-y-2 p-5">
          <h2 className="flex items-center gap-2 text-xl font-bold"><Smartphone className="size-5 text-primary" />{t.profile.install}</h2>
          <p className="text-sm text-muted-foreground">{t.profile.installText}</p>
        </section>

        <section className="surface space-y-2 p-5">
          <h2 className="text-xl font-bold">{t.profile.about}</h2>
          <p className="text-sm text-muted-foreground">{t.profile.aboutText}</p>
          <p className="text-sm text-muted-foreground">{t.app.demoNotice}</p>
        </section>

        <section className="surface p-5">
          <h2 className="mb-3 text-xl font-bold">{t.profile.links}</h2>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="paper"><Link to="/routes"><Compass />{t.nav.routes}</Link></Button>
            <Button asChild variant="paper"><Link to="/admin"><LayoutDashboard />{t.nav.admin}</Link></Button>
          </div>
        </section>
      </div>
    </Container>
  );
}
