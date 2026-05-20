export interface Event {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  venue: string;
  address: string;
  organizer: string;
  ticketsUrl: string;
  posterUrl: string;
  badgeLabel: string;
}

export const events: Event[] = [
  {
    id: "full-circle",
    title: "The Full Circle Event",
    subtitle: "A must be at event!",
    date: "May 30, 2026",
    venue: "Texas Pride BBQ",
    address: "Adkin, Texas — San Antonio",
    organizer: "Nava Collective, LLC",
    ticketsUrl: "https://www.navacollectivellc.com",
    posterUrl:
      "https://img1.wsimg.com/isteam/ip/e4a3c6f0-da92-42a7-82a9-a8cc93706dd9/IMG_1836.JPG",
    badgeLabel: "Tickets on sale now!",
  },
];
