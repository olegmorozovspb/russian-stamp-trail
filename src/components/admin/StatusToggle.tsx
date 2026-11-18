import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { PublicationStatus } from "@/types/domain";
import { useT } from "@/i18n";
import { useAdmin } from "./admin-store";

export function PublishToggle({ entity, id, status }: { entity: "places" | "stamps" | "passports"; id: string; status: PublicationStatus }) {
  const t = useT();
  const { dispatch } = useAdmin();
  const isPublished = status === "published";
  return (
    <Button
      size="sm"
      variant={isPublished ? "ghost" : "soft"}
      onClick={() => {
        dispatch({ type: "setStatus", entity, id, status: isPublished ? "draft" : "published" });
        toast(isPublished ? t.admin.unpublished : t.admin.published);
      }}
    >
      {isPublished ? t.admin.unpublish : t.admin.publish}
    </Button>
  );
}
