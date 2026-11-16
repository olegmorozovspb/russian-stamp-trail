/** DEMO DATA — fictional passports for visual testing. Not real tourist projects. */
import type { Passport, PassportStamp } from "@/types/domain";
import { demoPassportCovers } from "./media";

const DEMO_SOURCE = { type: "demo" as const, name: "Демонстрационные данные" };
const base = {
  status: "published" as const,
  source: DEMO_SOURCE,
  isDemo: true,
  lastVerifiedAt: "2026-09-20T10:00:00Z",
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-09-20T10:00:00Z",
};

export const demoPassports: Passport[] = [
  {
    id: "pp-golden",
    name: "Демо-паспорт «Золотое кольцо»",
    coverImage: demoPassportCovers.blue,
    geography: "Ярославская и Владимирская области",
    regionIds: ["yaroslavl-obl", "vladimir-obl"],
    description: "Пример паспорта, объединяющего печати нескольких старинных городов. Создан для демонстрации интерфейса.",
    organizer: "Демо-организатор",
    ...base,
  },
  {
    id: "pp-volga",
    name: "Демо-паспорт «Волжские берега»",
    coverImage: demoPassportCovers.red,
    geography: "Города на Волге",
    regionIds: ["yaroslavl-obl", "nizhny-obl", "tatarstan"],
    description: "Пример паспорта для путешествия вдоль реки: печати кофеен, музеев и мастерских.",
    organizer: "Демо-организатор",
    ...base,
  },
  {
    id: "pp-baltic",
    name: "Демо-паспорт «Балтийский берег»",
    coverImage: demoPassportCovers.red,
    geography: "Калининградская область",
    regionIds: ["kaliningrad-obl"],
    description: "Пример небольшого регионального паспорта на две точки.",
    organizer: "Демо-организатор",
    ...base,
  },
  {
    id: "pp-books",
    name: "Демо-паспорт «Книжные лавки»",
    coverImage: demoPassportCovers.blue,
    geography: "Разные города России",
    regionIds: ["moscow", "spb", "kaliningrad-obl"],
    description: "Пример тематического паспорта: печати книжных магазинов и библиотек в разных городах.",
    organizer: "Демо-организатор",
    ...base,
  },
];

const links: Record<string, string[]> = {
  "pp-golden": ["s-yaroslavl-byt", "s-rostov", "s-vladimir-tic", "s-suzdal-tic", "s-suzdal-house-1"],
  "pp-volga": ["s-yaroslavl-pristan", "s-nizhny-pristan", "s-nizhny-fleet", "s-kazan-tic-2", "s-sviyazhsk"],
  "pp-baltic": ["s-kaliningrad-library", "s-zelenogradsk-mayak"],
  "pp-books": ["s-moscow-strannik-2", "s-spb-strannik", "s-spb-pereplet", "s-kaliningrad-library"],
};

export const demoPassportStamps: PassportStamp[] = Object.entries(links).flatMap(([passportId, ids]) =>
  ids.map((stampId, position) => ({ passportId, stampId, position })),
);
