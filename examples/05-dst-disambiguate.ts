const local = Temporal.PlainDateTime.from("2025-10-26T02:30:00");

const earlier = local.toZonedDateTime("Europe/Zurich", { disambiguation: "earlier" });
const later   = local.toZonedDateTime("Europe/Zurich", { disambiguation: "later"   });

console.log(earlier.toInstant().toString());
console.log(later.toInstant().toString());

local.toZonedDateTime("Europe/Zurich", { disambiguation: "reject" }); // throws
