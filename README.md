# Fixing Time in JavaScript: Meet Temporal

Lightning talk for [ZurichJS](https://zurichjs.com). Built with [Slidev](https://sli.dev).

## Setup

```bash
pnpm install
```

## Develop

```bash
pnpm dev
```

Opens `http://localhost:3030`. Edits to `slides.md` hot-reload.

## Present

1. **Laptop**: `http://localhost:3030/presenter/` — current slide, next slide, notes, timer
2. **Projector**: `http://localhost:3030/` — fullscreen (`F`), drag to external display
3. They sync automatically — advance on one, both advance

### Keys

| Key | Action |
| --- | --- |
| `Space` / `→` | next step (advances `v-clicks` one by one, then next slide) |
| `←` | back |
| `F` | fullscreen |
| `D` | toggle dark / light |
| `O` | slide overview |
| `G` | go to slide by number |

Before walking on stage: extended display (not mirrored), fullscreen projector window, confirm one `→` advances both.

## Build

```bash
pnpm build      # static SPA → dist/
pnpm export     # PDF (requires playwright-chromium)
```
