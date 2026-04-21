const instant = Temporal.Instant.from("2025-05-28T15:00:00Z");

console.log(instant.toZonedDateTimeISO("Europe/Zurich").toString());
console.log(instant.toZonedDateTimeISO("America/New_York").toString());
