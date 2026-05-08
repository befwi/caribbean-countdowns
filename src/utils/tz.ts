// Returns the UTC offset for a timezone on a given date, in milliseconds.
// e.g. tzOffsetMs("2026-05-10", "America/St_Lucia") → -14400000 (UTC-4)
function tzOffsetMs(dateStr: string, tz: string): number {
  const noonUTC = new Date(dateStr + "T12:00:00Z");
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(noonUTC);
  const h = parseInt(parts.find(p => p.type === "hour")!.value);
  const m = parseInt(parts.find(p => p.type === "minute")!.value);
  return ((h - 12) * 60 + m) * 60000;
}

export function tzDayStart(dateStr: string, tz: string): number {
  const [y, mo, d] = dateStr.split("-").map(Number);
  return Date.UTC(y, mo - 1, d, 0, 0, 0) - tzOffsetMs(dateStr, tz);
}

export function tzDayEnd(dateStr: string, tz: string): number {
  const [y, mo, d] = dateStr.split("-").map(Number);
  return Date.UTC(y, mo - 1, d, 23, 59, 59, 999) - tzOffsetMs(dateStr, tz);
}
