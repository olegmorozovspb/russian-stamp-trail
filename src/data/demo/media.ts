/** DEMO DATA — illustrative images generated for visual testing, not photos of real venues. */
import stampKremlin from "@/assets/stamp-kremlin.jpg";
import stampRiver from "@/assets/stamp-river.jpg";
import stampDomes from "@/assets/stamp-domes.jpg";
import stampBook from "@/assets/stamp-book.jpg";
import placeBookstore from "@/assets/place-bookstore.jpg";
import placeMuseum from "@/assets/place-museum.jpg";
import placeCafe from "@/assets/place-cafe.jpg";
import placeInfo from "@/assets/place-info.jpg";
import placeEmbankment from "@/assets/place-embankment.jpg";
import passportBlue from "@/assets/passport-blue.jpg";
import passportRed from "@/assets/passport-red.jpg";
import type { Photo } from "@/types/domain";

const credit = "Иллюстрация (демо)";

export const demoStampImages: Photo[] = [
  { id: "img-stamp-kremlin", url: stampKremlin, alt: "Пример оттиска печати с башней", credit },
  { id: "img-stamp-river", url: stampRiver, alt: "Пример оттиска печати с пароходом", credit },
  { id: "img-stamp-domes", url: stampDomes, alt: "Пример оттиска печати с храмом", credit },
  { id: "img-stamp-book", url: stampBook, alt: "Пример оттиска печати с книгой и совой", credit },
];

export const demoPlaceImages = {
  bookstore: { id: "img-bookstore", url: placeBookstore, alt: "Книжная лавка (иллюстрация)", credit },
  museum: { id: "img-museum", url: placeMuseum, alt: "Зал краеведческого музея (иллюстрация)", credit },
  cafe: { id: "img-cafe", url: placeCafe, alt: "Кафе в историческом доме (иллюстрация)", credit },
  info: { id: "img-info", url: placeInfo, alt: "Туристический информационный центр (иллюстрация)", credit },
  embankment: { id: "img-embankment", url: placeEmbankment, alt: "Набережная старого города (иллюстрация)", credit },
} satisfies Record<string, Photo>;

export const demoPassportCovers = {
  blue: { id: "img-passport-blue", url: passportBlue, alt: "Обложка паспорта (иллюстрация)", credit },
  red: { id: "img-passport-red", url: passportRed, alt: "Обложка паспорта (иллюстрация)", credit },
} satisfies Record<string, Photo>;
