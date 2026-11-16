import { Check, Plus, Route as RouteIcon, Stamp as StampIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n";
import { useCollection } from "@/stores/collection";
import { useRouteBuilder } from "@/stores/route-builder";
import { cn } from "@/lib/utils";

export function CollectButton({ stampId, size = "default", className }: { stampId: string; size?: "sm" | "default" | "lg"; className?: string }) {
  const t = useT();
  const { ids, toggle } = useCollection();
  const collected = ids.has(stampId);
  return (
    <Button
      size={size}
      variant={collected ? "collected" : "default"}
      aria-pressed={collected}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(stampId);
        toast(collected ? t.place.uncollectedToast : t.place.collectedToast);
      }}
      title={collected ? t.place.removeFromCollection : t.place.addToCollection}
    >
      {collected ? <Check /> : <StampIcon />}
      {collected ? t.place.inCollection : t.place.addToCollection}
    </Button>
  );
}

export function AddToRouteButton({ placeId, size = "default", className }: { placeId: string; size?: "sm" | "default" | "lg"; className?: string }) {
  const t = useT();
  const { has, add } = useRouteBuilder();
  const inRoute = has(placeId);
  return (
    <Button
      size={size}
      variant="paper"
      disabled={inRoute}
      className={cn(className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add(placeId);
        toast(t.place.routeToast);
      }}
    >
      {inRoute ? <RouteIcon /> : <Plus />}
      {inRoute ? t.place.inRoute : t.place.addToRoute}
    </Button>
  );
}
