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

<!-- 7 min talk + 3 min Q&A. Senior devs.

Say:
- I'm Maximilian, Senior Eng @ inplan
- Today: why Date is broken, and the API that fixes it

Do: breathe. Slow start. -->

---
layout: center
---

<h1 class="text-center">One type. Six jobs.</h1>

<div class="flex justify-center mt-4">
  <img src="/multitasking.gif" class="h-44 rounded" />
</div>

<div v-click class="mt-6 text-xl opacity-90 text-center">

`Date` handles instants, dates, times, wall clocks, zones, and durations.

</div>

<div v-click class="mt-4 text-xl opacity-90 text-center">

All as the same type. That's where it breaks.

</div>

<!-- 20s. Problem framing, no story.

Say:
- JavaScript's Date is one type doing six jobs
- (click) instants, dates, times, wall clocks, zones, durations
- (click) all the same type — that's where it breaks
- Next slide: watch it break

Do: click, click, move on. Don't dwell. -->

---

# What would `Date` do?

```ts
console.log(new Date("09:00").getHours());
```

<v-click>

<div class="mt-4">

Output: <code class="!text-red-400 !bg-red-500/10">NaN</code> — `Date` cannot represent a time without a date.

</div>

</v-click>

<!-- Say:
- Simpler attempt — just parse "09:00"
- (click) NaN. Date can't represent a time without a date.
- One type for six concepts. It breaks.

Do: straight reveal, no hands-up. Keep pace. -->

---

# Same question. Temporal.

```ts
console.log(Temporal.PlainTime.from("09:00").hour);
```

<!-- Say:
- Same question, Temporal
- Output: 9
- Date = one type pretending to be six
- Temporal = a type per concept

Do: click reveal. Short beat, move on. -->

<v-click>

<div class="mt-4">

Output: <code class="!text-green-400 !bg-green-500/10">9</code>

</div>

</v-click>

---

# The mental model

## One slide. That's it.

<v-clicks>

<div>

- <code>Temporal.Instant</code> — an exact moment in time
  <div class="ml-6 text-sm opacity-60">server log timestamp · the moment that ticked</div>

</div>

<div>

- <code>Temporal.PlainDate</code> — a calendar date
  <div class="ml-6 text-sm opacity-60">birthday, invoice date · no time, no zone</div>

</div>

<div>

- <code>Temporal.PlainTime</code> — a clock time
  <div class="ml-6 text-sm opacity-60">09:00, shift start · what a wall clock shows</div>

</div>

<div>

- <code>Temporal.PlainDateTime</code> — wall-clock date + time, no zone
  <div class="ml-6 text-sm opacity-60">"meet at 3pm on the 5th" — zone implied by context</div>

</div>

<div>

- <code>Temporal.ZonedDateTime</code> — wall clock pinned to a named zone
  <div class="ml-6 text-sm opacity-60">"3pm on the 5th, Europe/Zurich" — DST-aware</div>

</div>

<div>

- <code>Temporal.Duration</code> — a length of time, not a point
  <div class="ml-6 text-sm opacity-60">8h shift, 30min timeout · how long, not when</div>

</div>

</v-clicks>

<!-- 90s. Slow down here — these types anchor the rest of the talk.

Say (full beat per click, breathe between):
- Instant → exact moment in time, like a server log timestamp
- PlainDate → a calendar date, birthdays, invoices
- PlainTime → a clock time, like my 09:00 shift start
- PlainDateTime → wall clock + date, still no zone — local intent
- ZonedDateTime → wall clock pinned to a named zone, DST-aware
- Duration → a length, not a point — 8h shift, 30min timeout

Land: "The type carries intent. That's the upgrade over Date."

Do: click per bullet. Resist the urge to rush — this is the load-bearing slide. -->

---

# Now with zones

## 15:00 UTC. What's the local time in Zurich and New York?

```ts {1|3|4}
const instant = Temporal.Instant.from("2025-05-28T15:00:00Z");

console.log(instant.toZonedDateTimeISO("Europe/Zurich").toString());
console.log(instant.toZonedDateTimeISO("America/New_York").toString());
```

<!-- Say:
- 15:00 UTC. Zurich? New York?
- Short pause, let them think, then click.

Output:
  Zurich → 17:00+02:00
  NY     → 11:00-04:00

Land: "Date gave you NaN. Temporal gave the expected answer." -->

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

<div class="flex gap-12 justify-center mt-8 text-2xl opacity-90">
  <div>0 times?</div>
  <div>1 time?</div>
  <div>2 times?</div>
</div>

<!-- Say:
- Oct 26, Zurich, clocks fall back at 3 AM
- So 02:30 happens... how often?
- Hands up: 0 / 1 / 2

Do: count each. Pause between.

If silent: "Tough crowd. I'll pick for you." -->

---

# Same wall clock. Two real moments.

```ts {3-4|6-7}
const local = Temporal.PlainDateTime.from("2025-10-26T02:30:00");

const earlier = local.toZonedDateTime("Europe/Zurich", { disambiguation: "earlier" });
const later   = local.toZonedDateTime("Europe/Zurich", { disambiguation: "later"   });

console.log(earlier.toInstant().toString());
console.log(later.toInstant().toString());
```

<!-- Say:
- Answer: 2 times
- Same wall clock → two real moments, 1h apart
- Date silently picks one, never tells you
- Temporal makes you pick
- This was 6 months ago — your codebase has this bug

Do: click 1 = earlier/later lines. Click 2 = bug line. Pause.

Output:
  earlier → 00:30:00Z (CEST)
  later   → 01:30:00Z (CET)

If time: mention disambiguation: "reject" → throws. "Or refuse to guess." -->

<v-click>

<div class="mt-2 font-mono text-lg">

<div><span class="opacity-60">earlier →</span> 2025-10-26T<span class="text-amber-400">00:30:00Z</span></div>
<div><span class="opacity-60">later   →</span> 2025-10-26T<span class="text-amber-400">01:30:00Z</span></div>

</div>

<div class="mt-3 text-base">One hour apart. <code>Date</code> would silently pick one.</div>

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
- "How long?" → **<code>Temporal.Duration</code>**

</v-clicks>

<!-- Say (one beat per click):
- What happened? → Instant
- What did the human mean? → Plain*
- What time is it there? → ZonedDateTime
- How long? → Duration

Land: "Ask the question. The type follows."

Do: click, say, pause. Move on. -->

---

# You can use this now

<v-clicks>

- **Stage 4** — spec is locked, API won't change
- **Chrome & Firefox** — shipped natively
- **Safari** — behind a preview flag
- **Node 26** — will ship with it (not yet released)
- **TypeScript 6+** — types available via `"lib": ["ESNext"]` in `tsconfig.json`

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

<!-- 20s. Answers "can I ship this?"

Say:
- Stage 4 → API locked
- Chrome + FF native, Safari flag
- Node 26 will ship with it (not released yet)
- TS 6+ → add "ESNext" to lib in tsconfig
- Not yet? → temporal-polyfill, same API
- Caveat: ecosystem still Date (Prisma, Zod, date-fns)
- Convert at boundaries
- Stdlib is rich → may not need a date lib

Do: click per bullet. Don't rush caveat. -->


---
layout: center
---

# JavaScript didn't need a better <span v-mark.red="{ at: 1, type: 'strike-through', strokeWidth: 3 }">date library</span>.

## It needed better <span v-mark.red.underline="{ at: 2, strokeWidth: 3 }">time types</span>.

<!-- Say:
- JS didn't need a better date library (click 1 = strike)
- It needed better time types (click 2 = underline)

Do: pause after second line before Q&A. Let it land. -->

---
layout: center
---

# Questions?

<div class="flex gap-16 justify-center mt-10">
  <div class="flex flex-col items-center gap-2">
    <img src="/qr-slides.svg" class="w-40 h-40 bg-white p-2 rounded" />
    <div class="text-sm opacity-80">slides</div>
  </div>
  <div class="flex flex-col items-center gap-2">
    <img src="/qr-repo.svg" class="w-40 h-40 bg-white p-2 rounded" />
    <div class="text-sm opacity-80">repo</div>
  </div>
</div>

<div class="abs-b w-full text-center mb-6 text-sm opacity-70">
  github.com/mwalterskirchen · linkedin.com/in/mwalterskirchen
</div>

<!-- Say: "Questions? And grab the slides / repo."

Do: breathe. Scan room. Wait.

If asked "Why not just UTC everywhere?":
- UTC fine for past events
- Breaks for future scheduled events
- If DST changes, "9am Zurich" must stay 9am — 07:00Z can't
- ZonedDateTime keeps intent + derived instant

If asked "When keep using Date?":
- Interop only, convert at boundaries
- No new-code case where Date wins

If asked "DB: Instant or local?":
- Past "when did it happen" → Instant
- Future "when in a place" → local + named zone
- Test: if DST rules change tomorrow, must stored value change?
  Yes → local. No → Instant. -->
