import type { APIRoute, GetStaticPaths } from "astro";
import festivals2026 from '../../data/festivals-2026.json';
import festivals2027 from '../../data/festivals-2027.json';

type Festival = {
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
  city?: string;
  country: string;
  website?: string;
};

const festivalsByYear: Record<string, Festival[]> = {
  '2026': festivals2026 as Festival[],
  '2027': festivals2027 as Festival[],
};

// Merge all years into a single array for "all"
const allFestivals: Festival[] = [
  ...festivalsByYear['2026'],
  ...festivalsByYear['2027'],
];

function toIcalDate(dateStr: string) {
  return dateStr.replace(/-/g, "");
}

function escapeIcal(str: string = "") {
  return str.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
}

function buildIcal(entries: Festival[]) {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Caribbean Festival Deadlines//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Caribbean Festival Deadlines",
    "X-WR-TIMEZONE:America/Martinique",
  ];

  for (const f of entries) {
    const uid = `${f.name.toLowerCase().replace(/\s+/g, "-")}@caribbean-festival-deadlines`;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTART;VALUE=DATE:${toIcalDate(f.startDate)}`,
      `DTEND;VALUE=DATE:${toIcalDate(f.endDate)}`,
      `SUMMARY:${escapeIcal(f.name)}`,
      `DESCRIPTION:${escapeIcal(f.description ?? "")}`,
      `LOCATION:${escapeIcal(`${f.city ?? ""}, ${f.country}`)}`,
      `URL:${f.website ?? ""}`,
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export const getStaticPaths: GetStaticPaths = () => {
  const countries = [
    ...new Set(allFestivals.map((f) => f.country).filter(Boolean)),
  ];
  return [
    { params: { country: "all" } },
    ...countries.map((c) => ({
      params: { country: c.toLowerCase().replace(/\s+/g, "-") },
    })),
  ];
};

export const GET: APIRoute = ({ params }) => {
  const { country } = params;
  const year = params.year as string | undefined; // if you later add year param

  const source =
    country === "all"
      ? allFestivals
      : allFestivals.filter(
          (f) => f.country.toLowerCase().replace(/\s+/g, "-") === country
        );

  return new Response(buildIcal(source), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${country}.ics"`,
    },
  });
};
