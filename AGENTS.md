<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project architecture rules

- UI never imports `src/data/demo/*` directly; pages read data via `src/services/queries.ts` → `catalogService` → `dataSource`. Why: swapping demo data for Supabase only means implementing `CatalogDataSource` (`src/services/data-source.ts`).
- Pure catalog/route/collection rules live in `src/services/catalog-logic.ts` and `src/lib/*-logic.ts` with unit tests next to them. Why: keeps business rules testable and provider-independent.
- Place, Organization, Stamp and Passport stay separate entities (`src/types/domain.ts`); stamp name is optional. Why: one org → many places, one place → many stamps, one stamp → many passports.
- All user-facing strings go through `src/i18n` (`useT()`), never hard-coded in components. Why: more languages are planned.
- `src/components/map/StampMap.tsx` is the only file that touches Leaflet; it loads Leaflet dynamically after mount and reads tiles/attribution from `src/lib/map/config.ts`. Why: SSR safety and a replaceable map provider.
- Guest collection and route builder persist in localStorage via `src/stores/local-store.ts` (server snapshot = empty). Why: no auth yet; avoids hydration mismatch; replace with Supabase tables later behind the same hooks.
- Admin panel edits are in-memory only (`src/components/admin/admin-store.tsx`) and carry no access control. Why: demo UI until server-side roles exist.
- tsconfig has `exactOptionalPropertyTypes` and `noPropertyAccessFromIndexSignature` off. Why: they conflict with TanStack Router search/link typing; `noUncheckedIndexedAccess` stays on.
- Base CSS gives every `.grid` `minmax(0,1fr)` columns. Why: implicit grid columns with truncated text overflowed phone screens.
