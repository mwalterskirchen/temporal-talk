---
theme: default
transition: fade
layout: center
---

# Fixing Time in JavaScript: Meet Temporal

Make time handling feel less cursed

<div class="abs-b w-full text-center mb-6 text-sm opacity-70">
  Maximilian Walterskirchen · Senior Software Engineer @ inplan
  <div class="text-xs mt-1 opacity-80">
    github.com/mwalterskirchen · linkedin.com/in/mwalterskirchen
  </div>
</div>

<!-- ZurichJS lightning talk. Target: 7 min talk + 3 min Q&A. Senior-dev audience.

Spoken intro (5s before the hook):
"I'm Maximilian, Senior Engineer at inplan — workforce management for hospitals.
Which means I spend a lot of time thinking about time. Here's one story." -->

---
layout: center
---

# I needed to say: 09:00 to 17:00.

<div v-click class="mt-6 text-2xl opacity-90">

No date. Just hours on a clock.

</div>

<div v-click class="mt-4 text-xl opacity-70">

`Date` could not do it.

</div>

<!-- Story beat (30s). Shift scheduling at work. Every workaround was a lie.
Click pacing: say each line, click, let it land.
"Today: the API that would have saved me three weeks." -->

---

# Prediction 1

## What does this print?

```ts
console.log(new Date("09:00").getHours());
```

<!-- Forced binary: "A number between 0 and 23? Or NaN? Hands up."
Click to reveal: NaN — Invalid Date, Date cannot parse a bare time. -->

<v-click>

<div class="mt-4">

Output: <code class="!text-red-400 !bg-red-500/10">NaN</code> — `Date` cannot represent a time without a date.

</div>

</v-click>

---

# Same question. Temporal.

```ts
console.log(Temporal.PlainTime.from("09:00").hour);
```

<!-- Expected output: 9
Point to land: the type exists because the concept exists.
"Date has one type pretending to be six. Temporal gives each concept its own type." -->

<v-click>

<div class="mt-4">

Output: <code class="!text-green-400 !bg-green-500/10">9</code>

</div>

</v-click>

---

# The mental model

## One slide. That's it.

<v-clicks>

- <code>Temporal.Instant</code> — an exact moment in time
- <code>Temporal.PlainDate</code> — a calendar date (birthday, invoice date)
- <code>Temporal.PlainTime</code> — a clock time (09:00, shift start)
- <code>Temporal.PlainDateTime</code> — wall-clock date + time, no zone
- <code>Temporal.ZonedDateTime</code> — a wall-clock value in a named time zone
- <code>Temporal.Duration</code> — a length of time, not a point (8h shift, 30min timeout)

</v-clicks>

<!-- 45s. Do not dwell. The types will reappear in the next two demos.
Click through each — gives you a beat per type.
"The type carries intent. That is the real upgrade." -->

---

# Prediction 2

## 15:00 UTC. What's the local time?

```ts {1|3|4|all}
const instant = Temporal.Instant.from("2025-05-28T15:00:00Z");

console.log(instant.toZonedDateTimeISO("Europe/Zurich").toString());
console.log(instant.toZonedDateTimeISO("America/New_York").toString());
```

<!-- Ask the room: "Shout it out — Zurich first. Now New York."
Expected output:
  2025-05-28T17:00:00+02:00[Europe/Zurich]
  2025-05-28T11:00:00-04:00[America/New_York]
Warm-up prediction — they'll get it right. Contrast: Date gave a wrong answer, Temporal gave the expected one. -->

<v-click>

```
2025-05-28T17:00:00+02:00[Europe/Zurich]
2025-05-28T11:00:00-04:00[America/New_York]
```

</v-click>

---
layout: center
---

# Oct 26, 2025 · Zurich

## Clocks fall back at 3 AM. So 02:30 happens...

```ts
const local = Temporal.PlainDateTime.from("2025-10-26T02:30:00");
```

<div class="flex gap-12 justify-center mt-8 text-2xl">
  <div v-click class="opacity-90">0 times?</div>
  <div v-click class="opacity-90">1 time?</div>
  <div v-click class="opacity-90">2 times?</div>
</div>

<!-- Forced binary hand-raise. Reveal each option as you say it (three clicks).
Count the room. Let them commit before the reveal.
If nobody answers: "Tough crowd. OK, I'll pick for you." -->

---

# Same wall clock. Two real moments.

```ts {3-4|6-7|all}
const local = Temporal.PlainDateTime.from("2025-10-26T02:30:00");

const earlier = local.toZonedDateTime("Europe/Zurich", { disambiguation: "earlier" });
const later   = local.toZonedDateTime("Europe/Zurich", { disambiguation: "later"   });

console.log(earlier.toInstant().toString());
console.log(later.toInstant().toString());
```

<!-- Expected output:
  2025-10-26T00:30:00Z  (CEST, UTC+2, before the fallback)
  2025-10-26T01:30:00Z  (CET,  UTC+1, after the fallback)
Punchline: "Same wall clock. Two real moments, one hour apart.
Date would silently pick one and never tell you. Temporal makes you pick."
Local-angle bonus: "This was seven months ago. Your codebase probably has this bug."

Bonus if time permits:
  local.toZonedDateTime("Europe/Zurich", { disambiguation: "reject" })
  → throws RangeError. "Or tell it to refuse to guess." -->

<v-click>

<div class="mt-2 font-mono text-lg">

<div><span class="opacity-60">earlier →</span> 2025-10-26T<span class="text-amber-400">00:30:00Z</span></div>
<div><span class="opacity-60">later   →</span> 2025-10-26T<span class="text-amber-400">01:30:00Z</span></div>

</div>

<div class="mt-3 text-sm opacity-70">One hour apart. <code>Date</code> would silently pick one.</div>

</v-click>

<v-click>

<div class="mt-5 text-lg">
This was six months ago. Your codebase probably has this bug.
</div>

</v-click>

---

# If you remember one slide

## Ask the question. The type follows.

<v-clicks>

- "What happened?" → **<code>Temporal.Instant</code>**
- "What did the human mean?" → **<code>Temporal.Plain&#42;</code>**
- "What time is it there?" → **<code>Temporal.ZonedDateTime</code>**

</v-clicks>

<!-- The takeaway. Click through. One question per beat. Then move on. -->

---

# You can use this now

<v-clicks>

- **Stage 4** — spec is locked, API won't change
- **Chrome & Firefox** — shipped natively
- **Safari** — behind a preview flag
- **Node 26** — ships with it
- **TypeScript 6** — types included out of the box

</v-clicks>

<v-click>

<div class="mt-6 opacity-90">

Not there yet? <code>temporal-polyfill</code> — drop-in, same API as native.

</div>

</v-click>

<v-click>

<div class="mt-5 text-sm">
  <div><strong>One caveat</strong> — most of the ecosystem still speaks <code>Date</code> (Prisma, Zod, date-fns, …).</div>
  <div class="opacity-60 ml-4">Convert at boundaries.</div>
</div>

</v-click>

<v-click>

<div class="mt-3 text-sm">
  <div><strong>Good news</strong> — the stdlib is rich.</div>
  <div class="opacity-60 ml-4">You may not need a date library at all.</div>
</div>

</v-click>

<!-- 20s. Answers "can I ship this?" + preempts "but what about Prisma?"
Polyfill today, swap for native later. Convert at library boundaries for now.
Stdlib replaces most of what date-fns/dayjs offered — their reason to exist was Date's gaps. -->


---
layout: center
---

# JavaScript didn't need a better date library.

## It needed better <span v-mark.red.underline="{ at: 1, strokeWidth: 3 }">time types</span>.

<!-- Final line. Click once — marker draws under "time types". Pause. Thanks. Advance to Q&A. -->

---
layout: center
---

# Questions?

<div class="abs-b w-full text-center mb-6 text-sm opacity-70">
  github.com/mwalterskirchen · linkedin.com/in/mwalterskirchen
</div>

<!-- Pre-written answers for the three most likely questions:

Q: Why not just UTC everywhere?
  UTC works for past events. Breaks for future scheduled events.
  If DST rules change, "9am Zurich" must stay 9am — 07:00Z cannot.
  ZonedDateTime keeps wall-clock intent + derived instant.

Q: When should I keep using Date?
  Interop only. Convert at library boundaries.
  No new-code case where Date beats the right Temporal type.

Q: DB — Instant or local time?
  Past "when did this happen" → Instant (UTC timestamp).
  Future "when should this happen in a place" → local time + named zone.
  Test: if DST rules change tomorrow, must the stored value change?
  Yes → local. No → instant. -->
