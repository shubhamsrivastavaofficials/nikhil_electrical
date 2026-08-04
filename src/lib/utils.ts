export const BUSINESS = {
  name: 'New Nikhil Electrical',
  tagline: 'Trusted Electrical Shop, Repair Center & Wholesale Supplier',
  addressLine: 'Tikona Park, Lalganj, Rae Bareli, Uttar Pradesh',
  fullAddress: 'Tikona Park, Lalganj, Rae Bareli, Uttar Pradesh, India',
  phone: '+91 8887688890',
  phoneDisplay: '+91 88876 88890',
  phoneHref: 'tel:+918887688890',
  whatsappNumber: '918887688890',
  mapsQuery: 'New Nikhil Electrical, Tikona Park, Lalganj, Rae Bareli, Uttar Pradesh',
  mapsEmbedSrc:
    'https://www.google.com/maps?q=Tikona+Park,+Lalganj,+Rae+Bareli,+Uttar+Pradesh&output=embed',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Tikona+Park,+Lalganj,+Rae+Bareli,+Uttar+Pradesh',
};

export function whatsappLink(message?: string) {
  const text = message || `Hello, I'm interested in your electrical services at ${BUSINESS.name}.`;
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
