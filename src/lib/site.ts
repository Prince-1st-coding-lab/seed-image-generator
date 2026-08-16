export const SITE = {
  name: "Amigos Wooden Vases",
  tagline: "Ubuhanga mu giti, uburanga mu nzu yawe",
  phonePrimary: "+250789450358",
  phonePrimaryDisplay: "+250 789 450 358",
  phoneSecondary: "+250735329961",
  phoneSecondaryDisplay: "+250 735 329 961",
  whatsapp: "250789450358",
  instagram: "https://www.instagram.com/amigos_wooden_vases",
  instagramHandle: "@amigos_wooden_vases",
  location: "Gasabo, Gakinjiro ka Gisozi, Kigali, Rwanda",
  mapsUrl: "https://maps.google.com/?q=Gakinjiro+ka+Gisozi,+Gasabo,+Kigali,+Rwanda",
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function productWhatsappLink(productName: string) {
  return whatsappLink(
    `Hello Amigos Wooden Vases, I'm interested in the ${productName}. Could you please give me more information?`,
  );
}

export const generalWhatsappLink = whatsappLink(
  "Hello Amigos Wooden Vases, I would like to ask about your wooden designs.",
);
