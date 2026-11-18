/**
 * DEMO DATA — FOR VISUAL TESTING ONLY.
 * All organizations, places and stamps below are fictional. They carry `isDemo: true`
 * and «(демо)» in their names so they are never presented as confirmed real venues.
 * Coordinates are offsets around real city centres; addresses are placeholders.
 */
import type {
  Organization,
  OrganizationType,
  OpeningHours,
  Place,
  PublicationStatus,
  Stamp,
  StampAvailability,
  StampCondition,
  StampPrice,
} from "@/types/domain";
import { demoCities } from "./geo";
import { demoPlaceImages, demoStampImages } from "./media";

const DEMO_SOURCE = { type: "demo" as const, name: "Демонстрационные данные" };

function hours(open: string, close: string, closedDays: number[] = [], note?: string): OpeningHours {
  return {
    regular: [0, 1, 2, 3, 4, 5, 6].map((d) => ({
      day: d as 0,
      open: closedDays.includes(d) ? null : open,
      close: closedDays.includes(d) ? null : close,
    })),
    note,
  };
}

type OrgSpec = [id: string, name: string, type: OrganizationType, description: string];

const orgSpecs: OrgSpec[] = [
  ["org-strannik", "Книжная лавка «Странник» (демо)", "bookstore", "Вымышленная сеть небольших книжных лавок с краеведческими книгами."],
  ["org-byt", "Музей городского быта (демо)", "museum", "Вымышленный музей повседневной жизни горожан."],
  ["org-tic", "Туристический информационный центр (демо)", "tourist_center", "Вымышленная сеть информационных центров для туристов."],
  ["org-pristan", "Кофейня «Тихая пристань» (демо)", "cafe", "Вымышленная сеть кофеен у воды."],
  ["org-kraeved", "Краеведческий музей (демо)", "museum", "Вымышленный краеведческий музей."],
  ["org-kreml-house", "Гостевой дом «У кремля» (демо)", "hotel", "Вымышленный гостевой дом с печатью на ресепшене."],
  ["org-ottisk", "Сувенирная мастерская «Оттиск» (демо)", "shop", "Вымышленная мастерская, где печати вырезают вручную."],
  ["org-mayak", "Морской музей-маяк (демо)", "museum", "Вымышленный музей в здании маяка."],
  ["org-library", "Городская библиотека (демо)", "library", "Вымышленная библиотека с краеведческим отделом."],
  ["org-puppets", "Театр кукол (демо)", "theatre", "Вымышленный театр кукол."],
  ["org-eco", "Экологический центр «Берег» (демо)", "park", "Вымышленный экоцентр на берегу озера."],
  ["org-tea", "Кафе «Сибирский чай» (демо)", "cafe", "Вымышленное кафе с травяными чаями."],
  ["org-fleet", "Музей речного флота (демо)", "museum", "Вымышленный музей о судоходстве."],
  ["org-dvor", "Арт-пространство «Двор» (демо)", "other", "Вымышленное арт-пространство с выставками и кафе."],
  ["org-pereplet", "Книжный клуб «Переплёт» (демо)", "bookstore", "Вымышленный книжный клуб с антикварным отделом."],
];

export const demoOrganizations: Organization[] = orgSpecs.map(([id, name, type, description]) => ({
  id,
  name,
  type,
  description,
  status: "published",
  lastVerifiedAt: "2026-09-01T10:00:00Z",
  source: DEMO_SOURCE,
  isDemo: true,
  createdAt: "2026-02-01T10:00:00Z",
  updatedAt: "2026-09-01T10:00:00Z",
}));

type PhotoKey = keyof typeof demoPlaceImages;
interface PlaceSpec {
  id: string;
  org: string;
  city: string;
  d: [number, number];
  photo: PhotoKey;
  created: string;
  verified: string | null;
  status?: PublicationStatus;
  hours?: OpeningHours;
  notice?: string;
  nameSuffix?: string;
}

const placeSpecs: PlaceSpec[] = [
  { id: "p-moscow-strannik", org: "org-strannik", city: "moscow", d: [0.004, -0.012], photo: "bookstore", created: "2026-03-02", verified: "2026-10-12" },
  { id: "p-moscow-dvor", org: "org-dvor", city: "moscow", d: [-0.009, 0.015], photo: "cafe", created: "2026-08-20", verified: "2026-10-01", hours: hours("12:00", "22:00") },
  { id: "p-spb-strannik", org: "org-strannik", city: "spb", d: [0.003, 0.006], photo: "bookstore", created: "2026-03-05", verified: "2026-09-28" },
  { id: "p-spb-pereplet", org: "org-pereplet", city: "spb", d: [-0.006, -0.01], photo: "bookstore", created: "2026-10-14", verified: "2026-10-14" },
  { id: "p-kazan-tic", org: "org-tic", city: "kazan", d: [0.002, -0.004], photo: "info", created: "2026-04-11", verified: "2026-09-15", hours: hours("09:00", "18:00", [6]) },
  { id: "p-kazan-dvor", org: "org-dvor", city: "kazan", d: [-0.005, 0.008], photo: "cafe", created: "2026-09-03", verified: "2026-09-03", hours: hours("11:00", "21:00") },
  { id: "p-sviyazhsk-ottisk", org: "org-ottisk", city: "sviyazhsk", d: [0.001, 0.002], photo: "embankment", created: "2026-05-20", verified: "2026-08-02", hours: hours("10:00", "17:00", [0], "С ноября по апрель — только по выходным (демо).") },
  { id: "p-yaroslavl-byt", org: "org-byt", city: "yaroslavl", d: [0.003, 0.004], photo: "museum", created: "2026-02-15", verified: "2026-10-05", hours: hours("10:00", "18:00", [0]) },
  { id: "p-yaroslavl-pristan", org: "org-pristan", city: "yaroslavl", d: [-0.004, 0.009], photo: "cafe", created: "2026-07-01", verified: "2026-09-21", hours: hours("08:00", "21:00") },
  { id: "p-rostov-kraeved", org: "org-kraeved", city: "rostov", d: [0.002, 0.001], photo: "museum", created: "2026-02-20", verified: "2025-11-10", status: "needs_update", hours: hours("10:00", "17:00", [0, 1]) },
  { id: "p-vladimir-tic", org: "org-tic", city: "vladimir", d: [0.001, -0.003], photo: "info", created: "2026-04-01", verified: "2026-10-09", hours: hours("09:00", "18:00") },
  { id: "p-suzdal-tic", org: "org-tic", city: "suzdal", d: [-0.002, 0.002], photo: "info", created: "2026-04-03", verified: "2026-10-09", hours: hours("09:00", "19:00") },
  { id: "p-suzdal-house", org: "org-kreml-house", city: "suzdal", d: [0.004, -0.005], photo: "cafe", created: "2026-06-18", verified: "2026-09-30", hours: hours("08:00", "23:00", [], "Печать выдают на ресепшене круглосуточно для гостей и до 23:00 для всех (демо).") },
  { id: "p-nizhny-pristan", org: "org-pristan", city: "nizhny", d: [0.003, -0.006], photo: "cafe", created: "2026-07-12", verified: "2026-10-02", hours: hours("08:00", "22:00") },
  { id: "p-nizhny-fleet", org: "org-fleet", city: "nizhny", d: [-0.006, 0.01], photo: "embankment", created: "2026-05-05", verified: "2026-08-25", hours: hours("10:00", "18:00", [0]) },
  { id: "p-kaliningrad-library", org: "org-library", city: "kaliningrad", d: [0.004, 0.003], photo: "bookstore", created: "2026-06-01", verified: "2026-09-10", hours: hours("10:00", "20:00", [6]) },
  { id: "p-zelenogradsk-mayak", org: "org-mayak", city: "zelenogradsk", d: [0.002, -0.001], photo: "embankment", created: "2026-06-03", verified: "2026-09-11", hours: hours("10:00", "18:00") },
  { id: "p-ekb-puppets", org: "org-puppets", city: "ekaterinburg", d: [0.002, 0.004], photo: "museum", created: "2026-05-15", verified: "2026-07-30", status: "temporarily_unavailable", notice: "Временно закрыто на ремонт. Печать недоступна до окончания работ (демо)." },
  { id: "p-irkutsk-tea", org: "org-tea", city: "irkutsk", d: [0.003, -0.002], photo: "cafe", created: "2026-08-08", verified: "2026-10-11", hours: hours("09:00", "22:00") },
  { id: "p-listvyanka-eco", org: "org-eco", city: "listvyanka", d: [0.001, 0.004], photo: "embankment", created: "2026-08-10", verified: "2026-09-02", hours: hours("10:00", "18:00", [0]) },
  // Admin-only demo records (not visible in the public catalog)
  { id: "p-kazan-draft", org: "org-strannik", city: "kazan", d: [0.008, 0.012], photo: "bookstore", created: "2026-11-01", verified: null, status: "draft" },
  { id: "p-irkutsk-pending", org: "org-tic", city: "irkutsk", d: [-0.004, 0.006], photo: "info", created: "2026-11-05", verified: null, status: "pending_review" },
];

const orgById = new Map(demoOrganizations.map((o) => [o.id, o]));
const cityById = new Map(demoCities.map((c) => [c.id, c]));

export const demoPlaces: Place[] = placeSpecs.map((s, i) => {
  const city = cityById.get(s.city)!;
  const org = orgById.get(s.org)!;
  return {
    id: s.id,
    organizationId: s.org,
    cityId: s.city,
    name: org.name,
    address: `ул. Демонстрационная, ${10 + i} (адрес-заглушка)`,
    location: { lat: +(city.location.lat + s.d[0]).toFixed(5), lng: +(city.location.lng + s.d[1]).toFixed(5) },
    photos: [demoPlaceImages[s.photo]],
    openingHours: s.hours ?? hours("10:00", "20:00"),
    temporaryNotice: s.notice,
    status: s.status ?? "published",
    lastVerifiedAt: s.verified ? `${s.verified}T12:00:00Z` : null,
    source: DEMO_SOURCE,
    isDemo: true,
    createdAt: `${s.created}T10:00:00Z`,
    updatedAt: `${s.verified ?? s.created}T12:00:00Z`,
  };
});

const C = {
  free: (id: string): StampCondition => ({ id, type: "free", text: "Бесплатно, достаточно попросить на кассе или стойке." }),
  purchase: (id: string, what = "любой покупке"): StampCondition => ({ id, type: "purchase", text: `При ${what}.` }),
  ticket: (id: string): StampCondition => ({ id, type: "ticket", text: "При наличии входного билета." }),
  staff: (id: string): StampCondition => ({ id, type: "ask_staff", text: "Обратиться к администратору зала." }),
  own: (id: string): StampCondition => ({ id, type: "own_passport", text: "Ставится в свой паспорт, блокнот или на открытку." }),
};

const FREE: StampPrice = { kind: "free" };
const UNKNOWN: StampPrice = { kind: "unknown" };
const paid = (amount: number): StampPrice => ({ kind: "paid", amount, currency: "RUB" });

interface StampSpec {
  id: string;
  place: string;
  name: string | null;
  description: string;
  img: number;
  conditions: StampCondition[];
  price: StampPrice;
  availability?: StampAvailability;
  status?: PublicationStatus;
  created: string;
}

const stampSpecs: StampSpec[] = [
  { id: "s-moscow-strannik-1", place: "p-moscow-strannik", name: "Башня", description: "Круглая печать с силуэтом башни и двойной рамкой.", img: 0, conditions: [C.free("c1"), C.own("c2")], price: FREE, created: "2026-03-02" },
  { id: "s-moscow-strannik-2", place: "p-moscow-strannik", name: null, description: "Небольшая печать с совой на раскрытой книге.", img: 3, conditions: [C.purchase("c1", "покупке открытки или книги")], price: UNKNOWN, created: "2026-03-10" },
  { id: "s-moscow-dvor", place: "p-moscow-dvor", name: null, description: "Сезонная печать арт-пространства, рисунок меняется с каждой выставкой.", img: 1, conditions: [C.staff("c1")], price: FREE, created: "2026-08-20" },
  { id: "s-spb-strannik", place: "p-spb-strannik", name: "Пароход на Неве", description: "Квадратная печать с фигурной рамкой и пароходом.", img: 1, conditions: [C.free("c1"), C.own("c2")], price: FREE, created: "2026-03-05" },
  { id: "s-spb-pereplet", place: "p-spb-pereplet", name: null, description: "Печать книжного клуба: сова, книга и чашка кофе.", img: 3, conditions: [C.purchase("c1")], price: paid(50), created: "2026-10-14" },
  { id: "s-kazan-tic-1", place: "p-kazan-tic", name: "Кремль", description: "Основная печать информационного центра.", img: 0, conditions: [C.free("c1")], price: FREE, created: "2026-04-11" },
  { id: "s-kazan-tic-2", place: "p-kazan-tic", name: "Волжская", description: "Дополнительная печать с речным мотивом.", img: 1, conditions: [C.free("c1"), C.own("c2")], price: FREE, created: "2026-06-01" },
  { id: "s-kazan-dvor", place: "p-kazan-dvor", name: null, description: "Печать арт-пространства с рамкой из звёзд.", img: 2, conditions: [C.purchase("c1", "заказе в кафе")], price: UNKNOWN, created: "2026-09-03" },
  { id: "s-sviyazhsk", place: "p-sviyazhsk-ottisk", name: "Остров-град", description: "Печать ручной резьбы с храмом и берёзами.", img: 2, conditions: [C.free("c1"), C.own("c2")], price: FREE, created: "2026-05-20" },
  { id: "s-yaroslavl-byt", place: "p-yaroslavl-byt", name: null, description: "Музейная печать с изображением храма.", img: 2, conditions: [C.ticket("c1")], price: paid(0), created: "2026-02-15" },
  { id: "s-yaroslavl-pristan", place: "p-yaroslavl-pristan", name: "Пристань", description: "Печать кофейни с пароходом и маяком.", img: 1, conditions: [C.purchase("c1", "любом заказе")], price: UNKNOWN, created: "2026-07-01" },
  { id: "s-rostov", place: "p-rostov-kraeved", name: null, description: "Печать музея. Информация давно не проверялась.", img: 0, conditions: [C.ticket("c1"), C.staff("c2")], price: UNKNOWN, availability: "unknown", status: "needs_update", created: "2026-02-20" },
  { id: "s-vladimir-tic", place: "p-vladimir-tic", name: "Белый камень", description: "Круглая печать информационного центра.", img: 2, conditions: [C.free("c1")], price: FREE, created: "2026-04-01" },
  { id: "s-suzdal-tic", place: "p-suzdal-tic", name: null, description: "Печать с куполами и звёздами по кругу.", img: 2, conditions: [C.free("c1"), C.own("c2")], price: FREE, created: "2026-04-03" },
  { id: "s-suzdal-house-1", place: "p-suzdal-house", name: "У кремля", description: "Печать гостевого дома с башней.", img: 0, conditions: [C.free("c1")], price: FREE, created: "2026-06-18" },
  { id: "s-suzdal-house-2", place: "p-suzdal-house", name: null, description: "Вторая печать — с совой, ставится по запросу.", img: 3, conditions: [C.staff("c1")], price: paid(30), created: "2026-07-02" },
  { id: "s-nizhny-pristan", place: "p-nizhny-pristan", name: "Стрелка", description: "Печать кофейни у слияния рек.", img: 1, conditions: [C.purchase("c1", "любом заказе")], price: UNKNOWN, created: "2026-07-12" },
  { id: "s-nizhny-fleet", place: "p-nizhny-fleet", name: null, description: "Печать музея с колёсным пароходом.", img: 1, conditions: [C.ticket("c1")], price: paid(0), created: "2026-05-05" },
  { id: "s-kaliningrad-library", place: "p-kaliningrad-library", name: null, description: "Библиотечная печать с книгой.", img: 3, conditions: [C.free("c1"), C.own("c2")], price: FREE, created: "2026-06-01" },
  { id: "s-zelenogradsk-mayak", place: "p-zelenogradsk-mayak", name: "Маяк", description: "Печать с маяком и волнами.", img: 1, conditions: [C.ticket("c1")], price: paid(100), created: "2026-06-03" },
  { id: "s-ekb-puppets", place: "p-ekb-puppets", name: null, description: "Печать театра. Сейчас недоступна из-за ремонта.", img: 3, conditions: [C.staff("c1")], price: UNKNOWN, availability: "temporarily_unavailable", status: "temporarily_unavailable", created: "2026-05-15" },
  { id: "s-irkutsk-tea", place: "p-irkutsk-tea", name: "Сибирский чай", description: "Печать кафе с узором из трав.", img: 2, conditions: [C.purchase("c1", "заказе чая")], price: UNKNOWN, created: "2026-08-08" },
  { id: "s-listvyanka-eco", place: "p-listvyanka-eco", name: "Байкал", description: "Печать экоцентра с волной и берегом.", img: 1, conditions: [C.free("c1"), C.own("c2")], price: FREE, created: "2026-08-10" },
  // Admin-only demo records
  { id: "s-kazan-draft", place: "p-kazan-draft", name: null, description: "Черновик печати, ожидает фотографии.", img: 3, conditions: [], price: UNKNOWN, availability: "unknown", status: "draft", created: "2026-11-01" },
  { id: "s-irkutsk-pending", place: "p-irkutsk-pending", name: "Ангара", description: "Предложено партнёром, ожидает проверки.", img: 1, conditions: [C.free("c1")], price: FREE, status: "pending_review", created: "2026-11-05" },
];

const placeById = new Map(demoPlaces.map((p) => [p.id, p]));

export const demoStamps: Stamp[] = stampSpecs.map((s) => {
  const place = placeById.get(s.place)!;
  return {
    id: s.id,
    placeId: s.place,
    name: s.name,
    description: s.description,
    photos: demoStampImages[s.img] ? [demoStampImages[s.img]!] : [],
    conditions: s.conditions.map((c) => ({ ...c, id: `${s.id}-${c.id}` })),
    // paid(0) above means «входит в стоимость билета» — normalised to unknown price with ticket condition
    price: s.price.kind === "paid" && s.price.amount === 0 ? { kind: "unknown" } : s.price,
    availability: s.availability ?? "available",
    status: s.status ?? "published",
    lastVerifiedAt: place.lastVerifiedAt,
    source: DEMO_SOURCE,
    isDemo: true,
    createdAt: `${s.created}T10:00:00Z`,
    updatedAt: place.updatedAt,
  };
});
