/**
 * Social media content calendar — one post every 3 days for the upcoming
 * month. These posts are scheduled MANUALLY by the team (there is no
 * connected social media API / auto-posting integration on this site), so
 * this calendar is a planning tool, not a log of automated activity.
 * Update `START_DATE` and the `TOPICS` list as real posting plans change.
 */
export type SocialPlatform = "Facebook" | "Instagram" | "Both";

export type SocialPost = {
  date: string;
  platform: SocialPlatform;
  topic: string;
  notes: string;
};

const START_DATE = "2026-07-08";
const POST_INTERVAL_DAYS = 3;
const CALENDAR_LENGTH_DAYS = 30;

const TOPICS: { platform: SocialPlatform; topic: string; notes: string }[] = [
  {
    platform: "Both",
    topic: "Before & after: recent SWFL roof replacement",
    notes: "Pull a real before/after pair from the gallery — high engagement format.",
  },
  {
    platform: "Instagram",
    topic: "Hurricane-season roof inspection checklist",
    notes: "Tie back to the storm-damage-quote landing page.",
  },
  {
    platform: "Facebook",
    topic: "Customer testimonial spotlight",
    notes: "Use a real 5-star Google review with the customer's permission.",
  },
  {
    platform: "Both",
    topic: "Now serving: Fort Myers roofing spotlight",
    notes: "Cross-promote the new /roofing-fort-myers landing page.",
  },
  {
    platform: "Instagram",
    topic: "Behind the scenes: crew on a metal roof install",
    notes: "Short reel/video format performs best here.",
  },
  {
    platform: "Facebook",
    topic: "Now serving: Naples & Bonita Springs",
    notes: "Cross-promote /roofing-naples and /roofing-bonita-springs.",
  },
  {
    platform: "Both",
    topic: "FAQ: how long does a roof replacement take?",
    notes: "Repurpose copy from the location page FAQ accordions.",
  },
  {
    platform: "Instagram",
    topic: "Material spotlight: standing seam metal vs. shingle",
    notes: "Link to the Materials page.",
  },
  {
    platform: "Facebook",
    topic: "Free quote reminder + phone number",
    notes: "Direct response post — link to /free-quote.",
  },
  {
    platform: "Both",
    topic: "Team/founder feature",
    notes: "Builds local trust — pair with license # and years in business.",
  },
  {
    platform: "Instagram",
    topic: "Storm damage warning signs homeowners miss",
    notes: "Educational post; link to /storm-damage-quote.",
  },
];

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const SOCIAL_POSTS: SocialPost[] = Array.from(
  { length: Math.floor(CALENDAR_LENGTH_DAYS / POST_INTERVAL_DAYS) + 1 },
  (_, i) => {
    const t = TOPICS[i % TOPICS.length];
    return {
      date: addDays(START_DATE, i * POST_INTERVAL_DAYS),
      platform: t.platform,
      topic: t.topic,
      notes: t.notes,
    };
  },
);
