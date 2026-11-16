/**
 * DEMO DATA. Region and city names are real, descriptions are short neutral notes.
 * Coordinates are approximate city centres used only to place demo markers.
 */
import type { City, Region } from "@/types/domain";

const ts = { createdAt: "2026-01-10T09:00:00Z", updatedAt: "2026-01-10T09:00:00Z" };

export const demoRegions: Region[] = [
  { id: "moscow", name: "Москва", description: "Столица России: музеи, книжные магазины и исторический центр.", center: { lat: 55.7558, lng: 37.6173 }, status: "published", ...ts },
  { id: "spb", name: "Санкт-Петербург", description: "Город на Неве с плотным историческим центром и множеством музеев.", center: { lat: 59.9343, lng: 30.3351 }, status: "published", ...ts },
  { id: "tatarstan", name: "Республика Татарстан", description: "Казань и остров-град Свияжск на Волге.", center: { lat: 55.79, lng: 49.12 }, status: "published", ...ts },
  { id: "yaroslavl-obl", name: "Ярославская область", description: "Города Золотого кольца на Волге и у озера Неро.", center: { lat: 57.4, lng: 39.6 }, status: "published", ...ts },
  { id: "vladimir-obl", name: "Владимирская область", description: "Белокаменная архитектура Владимира и Суздаля.", center: { lat: 56.25, lng: 40.43 }, status: "published", ...ts },
  { id: "nizhny-obl", name: "Нижегородская область", description: "Слияние Оки и Волги, кремль и набережные.", center: { lat: 56.33, lng: 44.0 }, status: "published", ...ts },
  { id: "kaliningrad-obl", name: "Калининградская область", description: "Балтийское побережье и Куршская коса.", center: { lat: 54.8, lng: 20.5 }, status: "published", ...ts },
  { id: "sverdlovsk-obl", name: "Свердловская область", description: "Урал и Екатеринбург на границе Европы и Азии.", center: { lat: 56.84, lng: 60.6 }, status: "published", ...ts },
  { id: "irkutsk-obl", name: "Иркутская область", description: "Иркутск и посёлки на берегу Байкала.", center: { lat: 52.1, lng: 104.5 }, status: "published", ...ts },
];

export const demoCities: City[] = [
  { id: "moscow", regionId: "moscow", name: "Москва", description: "Крупнейший город страны с большим числом музеев и книжных магазинов.", location: { lat: 55.7558, lng: 37.6173 }, status: "published", ...ts },
  { id: "spb", regionId: "spb", name: "Санкт-Петербург", description: "Исторический центр, каналы и музеи — удобно собирать печати пешком.", location: { lat: 59.9343, lng: 30.3351 }, status: "published", ...ts },
  { id: "kazan", regionId: "tatarstan", name: "Казань", description: "Столица Татарстана с кремлём и пешеходной улицей Баумана.", location: { lat: 55.7963, lng: 49.1088 }, status: "published", ...ts },
  { id: "sviyazhsk", regionId: "tatarstan", name: "Свияжск", description: "Небольшой остров-град у слияния Волги и Свияги.", location: { lat: 55.7713, lng: 48.6597 }, status: "published", ...ts },
  { id: "yaroslavl", regionId: "yaroslavl-obl", name: "Ярославль", description: "Старинный город на Волге, входит в Золотое кольцо.", location: { lat: 57.6261, lng: 39.8845 }, status: "published", ...ts },
  { id: "rostov", regionId: "yaroslavl-obl", name: "Ростов Великий", description: "Город у озера Неро с известным кремлём.", location: { lat: 57.1859, lng: 39.4146 }, status: "published", ...ts },
  { id: "vladimir", regionId: "vladimir-obl", name: "Владимир", description: "Один из древнейших городов Северо-Восточной Руси.", location: { lat: 56.1291, lng: 40.4066 }, status: "published", ...ts },
  { id: "suzdal", regionId: "vladimir-obl", name: "Суздаль", description: "Компактный город-музей, удобный для маршрута за один день.", location: { lat: 56.4197, lng: 40.4494 }, status: "published", ...ts },
  { id: "nizhny", regionId: "nizhny-obl", name: "Нижний Новгород", description: "Город на слиянии Оки и Волги.", location: { lat: 56.3269, lng: 44.0059 }, status: "published", ...ts },
  { id: "kaliningrad", regionId: "kaliningrad-obl", name: "Калининград", description: "Самый западный областной центр России.", location: { lat: 54.7104, lng: 20.4522 }, status: "published", ...ts },
  { id: "zelenogradsk", regionId: "kaliningrad-obl", name: "Зеленоградск", description: "Курортный город на берегу Балтийского моря.", location: { lat: 54.959, lng: 20.4757 }, status: "published", ...ts },
  { id: "ekaterinburg", regionId: "sverdlovsk-obl", name: "Екатеринбург", description: "Крупный город Урала.", location: { lat: 56.8389, lng: 60.6057 }, status: "published", ...ts },
  { id: "irkutsk", regionId: "irkutsk-obl", name: "Иркутск", description: "Исторический город в 70 км от Байкала.", location: { lat: 52.287, lng: 104.305 }, status: "published", ...ts },
  { id: "listvyanka", regionId: "irkutsk-obl", name: "Листвянка", description: "Посёлок на берегу Байкала у истока Ангары.", location: { lat: 51.8536, lng: 104.8653 }, status: "published", ...ts },
];
