/**
 * Single source of truth for the event details.
 * Edit any field here and the whole invite updates.
 */

export const event = {
  couple: {
    first: "Devin",
    second: "Jessica",
  },
  date: {
    // ISO so we can format consistently; deadline comparison uses this too.
    iso: "2026-05-02T18:00:00-05:00", // May 2, 2026 · 6:00 PM CDT (Birmingham)
    dayLabel: "Saturday",
    monthLabel: "May",
    dayNumber: "02",
    yearLabel: "2026",
    timeLabel: "6:00 PM",
  },
  venue: {
    name: "The home of Devin",
    addressLine1: "4400 5th Avenue South",
    addressLine2: "Birmingham, Alabama",
  },
  parking:
    "Park along the 4th Avenue South neighboorhood, or by Bruto in the parking lot.",
  dressCode: "Casual / Cocktail attire",
  rsvp: {
    deadlineIso: "2026-04-28T23:59:00-05:00",
    deadlineLabel: "Sunday, April 28",
  },
  city: "Birmingham, Alabama",
  cityShort: "Birmingham, AL",
  romanYear: "MMXXVI",
  issueLabel: "Invitation Nº 01",
} as const;

export type EventConfig = typeof event;
