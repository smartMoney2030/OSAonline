export interface Business {
  id: string;
  name: string;
  badge?: string;
  descriptionEn: string;
  descriptionEs?: string;
  phone?: string;
  website?: string;
  websiteLabel?: string;
  youtubeId?: string;
}

export interface CityGroup {
  city: string;
  businesses: Business[];
}

export const cityGroups: CityGroup[] = [
  {
    city: "San Antonio",
    businesses: [
      {
        id: "dogwood-sa",
        name: "Dogwood Home Health Care, LLC",
        badge: "Over A Decade of Care",
        descriptionEn:
          "Compassionate, bilingual home health care services you can trust. Serving families with dignity and respect.",
        descriptionEs:
          "Atención médica domiciliaria compasiva y bilingüe que usted puede confiar. Sirviendo a familias con dignidad y respeto.",
        website: "https://www.dogwoodhomehealth.com",
        websiteLabel: "dogwoodhomehealth.com",
      },
      {
        id: "robles-sa",
        name: "Robles Jr. Law",
        badge: "Veteran Backed",
        descriptionEn:
          "Personal Injury Law Firm serving Fort Worth, Dallas, San Antonio and beyond. Fighting for the people who need it most.",
        descriptionEs:
          "Firma de abogados de lesiones personales sirviendo Fort Worth, Dallas, San Antonio y más. Luchando por quienes más lo necesitan.",
        phone: "(726) 241-2523",
        youtubeId: "oMUy54r4o8o",
      },
      {
        id: "oasis-sa",
        name: "Oasis Tax & Financial Services",
        descriptionEn:
          "Professional tax preparation and financial services for individuals and small businesses. Ask for Carol Lopez.",
        phone: "(210) 683-7241",
      },
    ],
  },
  {
    city: "Austin",
    businesses: [
      {
        id: "robles-austin",
        name: "Robles Jr. Law",
        badge: "Veteran Backed",
        descriptionEn:
          "Personal Injury Law Firm serving Fort Worth, Dallas, San Antonio and beyond. Fighting for the people who need it most.",
        descriptionEs:
          "Firma de abogados de lesiones personales sirviendo Fort Worth, Dallas, San Antonio y más. Luchando por quienes más lo necesitan.",
        phone: "(726) 241-2523",
        youtubeId: "oMUy54r4o8o",
      },
    ],
  },
  {
    city: "Houston",
    businesses: [
      {
        id: "robles-houston",
        name: "Robles Jr. Law",
        badge: "Veteran Backed",
        descriptionEn:
          "Personal Injury Law Firm serving Fort Worth, Dallas, San Antonio and beyond. Fighting for the people who need it most.",
        descriptionEs:
          "Firma de abogados de lesiones personales sirviendo Fort Worth, Dallas, San Antonio y más. Luchando por quienes más lo necesitan.",
        phone: "(726) 241-2523",
        youtubeId: "oMUy54r4o8o",
      },
    ],
  },
  {
    city: "DFW",
    businesses: [
      {
        id: "robles-dfw",
        name: "Robles Jr. Law",
        badge: "Veteran Backed",
        descriptionEn:
          "Personal Injury Law Firm serving Fort Worth, Dallas, San Antonio and beyond. Fighting for the people who need it most.",
        descriptionEs:
          "Firma de abogados de lesiones personales sirviendo Fort Worth, Dallas, San Antonio y más. Luchando por quienes más lo necesitan.",
        phone: "(726) 241-2523",
        youtubeId: "oMUy54r4o8o",
      },
    ],
  },
  {
    city: "Rio Grande Valley",
    businesses: [
      {
        id: "dogwood-rgv",
        name: "Dogwood Home Health Care, LLC",
        badge: "Over A Decade of Care",
        descriptionEn:
          "Compassionate, bilingual home health care services you can trust. Serving families with dignity and respect.",
        descriptionEs:
          "Atención médica domiciliaria compasiva y bilingüe que usted puede confiar. Sirviendo a familias con dignidad y respeto.",
        website: "https://www.dogwoodhomehealth.com",
        websiteLabel: "dogwoodhomehealth.com",
      },
      {
        id: "robles-rgv",
        name: "Robles Jr. Law",
        badge: "Veteran Backed",
        descriptionEn:
          "Personal Injury Law Firm serving Fort Worth, Dallas, San Antonio and beyond. Fighting for the people who need it most.",
        descriptionEs:
          "Firma de abogados de lesiones personales sirviendo Fort Worth, Dallas, San Antonio y más. Luchando por quienes más lo necesitan.",
        phone: "(726) 241-2523",
        youtubeId: "oMUy54r4o8o",
      },
    ],
  },
];

export const allBusinesses: Business[] = cityGroups.flatMap((g) => g.businesses);
