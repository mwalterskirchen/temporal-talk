const start = Temporal.ZonedDateTime.from("2025-10-25T09:00[Europe/Zurich]");
const next  = start.add({ days: 1 }); // calendar day, not 24h

console.log(next.toString()); // 2025-10-26T09:00:00+01:00[Europe/Zurich]

const hours = start.until(next, { largestUnit: "hour" });
console.log(hours.toString()); // PT25H — Oct 26 was 25 hours long
