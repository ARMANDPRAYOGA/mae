---
name: MAE - Manga Anime Edits
description: Community gaming hub for manga/anime fans with mini-games, leaderboards, and events
colors:
  violet-pulse: "#8b5cf6"
  violet-deep: "#7c3aed"
  sakura-glow: "#f472b6"
  ink-black: "#0a0a0a"
  ink-surface: "#16161d"
  ink-panel: "#1e1e2e"
  ink-border: "#2a2a3a"
  ash-text: "#ededed"
  ash-muted: "#a1a1aa"
  ember-red: "#ef4444"
  gold-achievement: "#eab308"
  ink-input: "#1a1a2e"
  ink-navbar: "#0f0f17"
typography:
  body:
    fontFamily: "Geist, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.025em"
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.violet-pulse}"
    textColor: "{colors.ash-text}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.violet-deep}"
  button-secondary:
    backgroundColor: "{colors.ink-panel}"
    textColor: "{colors.ash-text}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-danger:
    backgroundColor: "{colors.ember-red}"
    textColor: "{colors.ash-text}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  input:
    backgroundColor: "{colors.ink-input}"
    textColor: "{colors.ash-text}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  card:
    backgroundColor: "{colors.ink-surface}"
    textColor: "{colors.ash-text}"
    rounded: "{rounded.lg}"
    padding: "24px"
  badge:
    backgroundColor: "translucent"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  navbar:
    backgroundColor: "{colors.ink-navbar}"
    textColor: "{colors.ash-text}"
    height: "64px"
---

# Design System: MAE - Manga Anime Edits

## 1. Overview

**Creative North Star: "The Tournament Stage"**

MAE is a competitive arena for manga/anime fans. The interface is a dark stage where player identities, scores, and rankings command attention. Every screen is built around one question: who's winning, and can you beat them?

This system rejects generic SaaS dashboards with their blue-white corporatism, overly childish gamification with cartoon badges, dark-mode-for-the-sake-of-dark-mode crypto/neon aesthetics, and cluttered gaming portals with flashing banners. The dark theme is not a style choice; it's the stage. Light surfaces would break the spotlight effect.

The density is medium: enough information to feel competitive, not enough to overwhelm. Scores, badges, and player names are the visual hierarchy's first-class citizens. Navigation is secondary to play.

**Key Characteristics:**
- Dark canvas with purple and pink as the only accent colors, creating a focused spotlight effect
- Tactile, punchy interactions: buttons respond with clear hover shifts, cards acknowledge your presence with border highlights
- Scores and rankings are always visible; competition is the ambient atmosphere
- Indonesian-first copy, casual and energetic, never corporate
- Mobile-first: every touch target is generous, every layout stacks cleanly

## 2. Colors: The Violet Pulse Palette

The palette is a dark stage with two accent spotlights: electric violet and sakura pink. Neutrals are tinted toward violet (chroma ~0.008) to keep the dark surfaces warm, never sterile.

### Primary
- **Violet Pulse** (`#8b5cf6`): The main accent. Used for primary buttons, active nav states, score highlights, avatar fallback backgrounds, and input focus rings. It's the color of "you can interact with this."
- **Violet Deep** (`#7c3aed`): Hover state for primary buttons and darker emphasis. Never used at rest; it only appears as a response.

### Secondary
- **Sakura Glow** (`#f472b6`): The community accent. Used for admin badges, the gradient brand wordmark, and secondary emphasis. It signals identity and belonging, not action.

### Tertiary
- **Gold Achievement** (`#eab308`): Reserved exclusively for achievements and top-rank indicators. Never used on buttons or interactive elements. Its rarity is the point.
- **Ember Red** (`#ef4444`): Destructive actions only: delete buttons, danger confirmations. Never for errors (use text + icon instead).

### Neutral
- **Ink Black** (`#0a0a0a`): The stage floor. Page background.
- **Ink Surface** (`#16161d`): Cards and elevated containers. One step above the floor.
- **Ink Panel** (`#1e1e2e`): Secondary surfaces: navbar, input hover states, secondary button backgrounds.
- **Ink Border** (`#2a2a3a`): All borders and dividers. Subtle but visible.
- **Ink Input** (`#1a1a2e`): Input field backgrounds. Slightly lighter than Ink Surface to signal interactivity.
- **Ash Text** (`#ededed`): Primary text. High contrast on dark surfaces.
- **Ash Muted** (`#a1a1aa`): Secondary text, labels, timestamps, hints.

### Named Rules

**The Spotlight Rule.** Only two colors carry action: Violet Pulse for interaction, Sakura Glow for identity. If an element isn't a button, input, or link, it doesn't get Violet Pulse. If it isn't about community or role, it doesn't get Sakura Glow.

**The Gold Rarity Rule.** Gold Achievement appears only on earned achievements and top-3 leaderboard positions. If you see gold on a button or a decorative element, the design is wrong.

## 3. Typography

**Display Font:** Geist (with system-ui fallback)
**Body Font:** Geist (with system-ui fallback)
**Mono Font:** Geist Mono (with ui-monospace fallback)

**Character:** Geist is a modern geometric sans with sharp terminals and even weight distribution. It reads as technical without being cold, which fits a competitive gaming tool. The mono variant is used for IDs, scores, and data that should feel precise.

### Hierarchy
- **Display** (700, `2.25rem`, line-height 1.1): Page titles only. One per screen. "Leaderboard", "Mini Games", "MAE - Manga Anime Edits".
- **Headline** (700, `1.875rem`, line-height 1.2): Section headers within a page. "Kelola Member", "Buat Game Baru".
- **Title** (600, `1.25rem`, line-height 1.3): Card headings, game titles, event names.
- **Body** (400, `1rem`, line-height 1.6, max 75ch): Descriptions, bio text, event details. Body text never exceeds 75 characters per line.
- **Label** (600, `0.75rem`, line-height 1.4, letter-spacing 0.025em): Badges, metadata labels, timestamps, small hints. Always semibold.
- **Mono** (400, `0.875rem`, line-height 1.5): User IDs, scores, numerical data that should feel precise.

### Named Rules

**The One Display Rule.** One display heading per screen. If you have two `2.25rem` headings on the same page, one of them is wrong. Use headline for the second.

**The Mono Data Rule.** Scores, IDs, and numerical rankings use Geist Mono. Names, descriptions, and labels do not. This creates an instant visual distinction between "who" and "how much."

## 4. Elevation

MAE uses tonal layering, not shadows. The dark palette creates depth through surface differentiation: Ink Black (floor) < Ink Surface (cards) < Ink Panel (navbar/secondary). No box-shadows exist in the system.

The one exception is the input focus ring: a `0 0 0 2px` outline in Violet Pulse at 20% opacity. This is functional, not decorative; it signals "this element has keyboard focus."

### Named Rules

**The Flat Stage Rule.** Surfaces are flat. Depth is conveyed through color, not shadow. If you're adding a `box-shadow`, you're adding visual noise, not hierarchy.

**The Focus Ring Rule.** Every interactive element (buttons, inputs, links that receive focus) must have a visible focus indicator. The Violet Pulse ring at 20% opacity is the standard. Never remove focus outlines for aesthetics.

## 5. Components

### Buttons

Three variants, each with a clear job. Buttons are tactile: hover darkens, focus rings, active depresses slightly.

- **Shape:** 8px radius (`rounded-md`), medium padding (`12px 24px` for primary, `8px 16px` for secondary/danger)
- **Primary:** Violet Pulse background, Ash Text, semibold. Hover shifts to Violet Deep. Used for the main action on any screen: "Mainkan", "Login", "Buat Game".
- **Secondary:** Ink Panel background with Ink Border, Ash Text. Hover lightens to `#2a2a3e`. Used for supporting actions: "Kembali", "Keluar", "Kelola Soal".
- **Danger:** Ember Red background, Ash Text. Hover darkens to `#dc2626`. Used for destructive actions only: "Hapus", "Hapus Akun".
- **Focus:** All buttons get the Violet Pulse ring at 20% opacity on `:focus-visible`.
- **Disabled:** 50% opacity, `cursor: not-allowed`. No hover state change.

### Chips / Badges

Pill-shaped labels for roles and categories. Translucent backgrounds with saturated text.

- **Shape:** Pill (`9999px` radius), small padding (`4px 12px`), label font size
- **Admin Badge:** Sakura Glow at 20% opacity background, Sakura Glow text. Signals admin role.
- **Member Badge:** Violet Pulse at 20% opacity background, Violet Pulse text. Signals member role.
- **Game Type Badge:** Same pattern, using Sakura Glow for Quiz, Violet Pulse for Teka-Teki.
- **Gold Badge:** Gold Achievement at 20% opacity background, Gold Achievement text. Achievements only.

### Cards / Containers

Elevated surfaces for content grouping. Cards are the primary content container.

- **Corner Style:** 12px radius (`rounded-lg`)
- **Background:** Ink Surface
- **Border:** 1px Ink Border at rest. Hover shifts to Violet Pulse on interactive cards (game cards, profile cards, leaderboard rows).
- **Internal Padding:** 24px (`padding-lg`)
- **No shadow.** Flat by The Flat Stage Rule.

### Inputs / Fields

Text entry with clear affordance. Dark background signals "you can type here."

- **Style:** Ink Input background, 1px Ink Border, 8px radius, 12px 16px padding
- **Focus:** Border shifts to Violet Pulse, 2px ring at 20% opacity. No shadow.
- **Error:** Red-400 text below the field. No red border (text + icon is sufficient per accessibility guidelines).
- **Disabled:** 50% opacity, `cursor: not-allowed`.

### Navigation

Sticky top bar with the brand name and role-aware links.

- **Style:** Ink Navbar background, 64px height, sticky top-0 with z-50
- **Brand:** "MAE - Manga Anime Edits" in the Violet Pulse-to-Sakura Glow gradient (the one place gradient text is allowed, as it's the brand wordmark)
- **Links:** Ash Muted text at rest, Ash Text on hover with Ink Panel background. Active link gets Violet Pulse background with white text.
- **Mobile:** Hamburger menu, full-width stacked links, same active treatment.
- **User Info:** Name + role badge on the right. Logout button as secondary variant.

### Profile Avatars

Circular identity markers. The first letter of the name is the fallback.

- **Shape:** Circular, sizes: 40px (list rows), 48px (leaderboard), 56px (profile cards), 96px (profile page)
- **Fallback:** Violet Pulse background, white text, centered initial
- **Image:** `object-cover` within the circle

## 6. Do's and Don'ts

### Do:
- **Do** use Violet Pulse exclusively for interactive elements (buttons, links, active states, focus rings). Its rarity on non-interactive surfaces is the point.
- **Do** keep the dark palette consistent. Every surface should be one of: Ink Black, Ink Surface, Ink Panel, Ink Input, Ink Navbar. No custom dark grays.
- **Do** use Geist Mono for scores, IDs, and numerical data. The visual distinction between "who" (Geist Sans) and "how much" (Geist Mono) is intentional.
- **Do** keep badges pill-shaped with translucent backgrounds. They're labels, not buttons.
- **Do** make every touch target at least 44px tall on mobile. This is a mobile-first community app.
- **Do** use Indonesian for all UI copy. The audience is Indonesian teens/young adults.
- **Do** show one display heading per screen. Second-level headings use headline size.
- **Do** use 200ms transitions on hover states. Fast enough to feel responsive, slow enough to notice.

### Don't:
- **Don't** use gradient text anywhere except the "MAE - Manga Anime Edits" brand wordmark. PRODUCT.md explicitly bans gradient text as decorative and meaningless. The brand wordmark is the sole exception.
- **Don't** use generic SaaS dashboard aesthetics (blue/white, corporate card grids, boring tables). This is a gaming community, not a project management tool.
- **Don't** add cartoon badges, excessive animations, or childish gamification elements. The audience is teens and young adults, not children.
- **Don't** use dark mode with purple gradients and neon accents as a default aesthetic. The dark theme is a stage, not a style statement.
- **Don't** create cluttered gaming portals with flashing banners. The interface is focused, not noisy.
- **Don't** add box-shadows to cards or containers. Depth is tonal, not shadow-based.
- **Don't** use display fonts in buttons, labels, or data. Display is for page titles only.
- **Don't** nest cards inside cards. One level of card elevation is the maximum.
- **Don't** use `#000` or `#fff` directly. All blacks and whites are tinted toward the violet hue.
- **Don't** animate layout properties (width, height, margin, padding). Transitions on color and opacity only.
- **Don't** use modals as a first solution. Exhaust inline and progressive alternatives first.
