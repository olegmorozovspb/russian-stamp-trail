/** DEMO DATA — example curated routes built from demo places. */
import type { Route } from "@/types/domain";

function route(id: string, title: string, description: string, cityIds: string[], placeIds: string[], created: string): Route {
  return {
    id,
    title,
    description,
    kind: "curated",
    ownerId: null,
    cityIds,
    stops: placeIds.map((placeId, i) => ({ id: `${id}-stop-${i}`, routeId: id, placeId, position: i })),
    status: "published",
    isDemo: true,
    createdAt: `${created}T10:00:00Z`,
    updatedAt: `${created}T10:00:00Z`,
  };
}

export const demoRoutes: Route[] = [
  route("r-suzdal-vladimir", "Демо-маршрут: Владимир и Суздаль", "Пример маршрута на день: информационный центр Владимира и две точки в Суздале.", ["vladimir", "suzdal"], ["p-vladimir-tic", "p-suzdal-tic", "p-suzdal-house"], "2026-09-01"),
  route("r-yaroslavl", "Демо-маршрут: Ярославль и Ростов", "Пример маршрута по двум городам Ярославской области.", ["yaroslavl", "rostov"], ["p-yaroslavl-byt", "p-yaroslavl-pristan", "p-rostov-kraeved"], "2026-09-10"),
  route("r-baltic", "Демо-маршрут: Калининград и побережье", "Пример маршрута от городской библиотеки к морю.", ["kaliningrad", "zelenogradsk"], ["p-kaliningrad-library", "p-zelenogradsk-mayak"], "2026-09-15"),
  route("r-kazan", "Демо-маршрут: Казань и Свияжск", "Пример маршрута на выходные по Татарстану.", ["kazan", "sviyazhsk"], ["p-kazan-tic", "p-kazan-dvor", "p-sviyazhsk-ottisk"], "2026-10-01"),
];
