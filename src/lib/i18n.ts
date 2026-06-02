// Lightweight client/server i18n stub. Real next-intl wiring is a follow-up.
// Used so copy is centralized and ready for translation.

export type Locale = "en" | "bn";

const dict: Record<Locale, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.doctors": "Doctors",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "cta.book": "Book appointment",
    "cta.signin": "Sign in",
    "footer.tagline": "Compassionate, evidence-based care for every patient.",
  },
  bn: {
    "nav.home": "হোম",
    "nav.about": "পরিচিতি",
    "nav.services": "সেবা",
    "nav.doctors": "চিকিৎসকগণ",
    "nav.blog": "ব্লগ",
    "nav.contact": "যোগাযোগ",
    "cta.book": "অ্যাপয়েন্টমেন্ট নিন",
    "cta.signin": "সাইন ইন",
    "footer.tagline": "প্রতিটি রোগীর জন্য সহানুভূতিশীল, প্রমাণ-ভিত্তিক চিকিৎসা।",
  },
};

export function t(key: string, locale: Locale = "en") {
  return dict[locale]?.[key] ?? dict.en[key] ?? key;
}
