# Closira Mobile — Dashboard App

A polished React Native mobile dashboard for Closira business owners to monitor customer communications, act on escalations, and manage follow-ups.

---

## Quick Start

```bash
cd frontend
npm install
npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android) or press `i` for iOS Simulator / `a` for Android Emulator.

---

## Screenshots

| Dashboard | Leads | Escalations | Follow-ups | Conversation |
|---|---|---|---|---|
| ![Dashboard](docs/dashboard.png) | ![Leads](docs/leads.png) | ![Escalations](docs/escalations.png) | ![Followups](docs/followups.png) | ![Conversation](docs/conversation.png) |
> Screenshots taken from web build (npx expo start --web)

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React Native | 0.74 | Cross-platform mobile |
| Expo | ~51 | Build tooling, icons |
| TypeScript | ~5.3 | Type safety |
| React Navigation | 6 | Stack + Tab navigation |
| NativeWind | 2.x | Tailwind utility classes |
| @expo/vector-icons | 14 | Ionicons icon set |

---

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ChannelBadge.tsx      — WhatsApp/Email/Call coloured badge
│   ├── StatusBadge.tsx       — Enquiry status pill
│   ├── StatCard.tsx          — Dashboard metric card
│   ├── LeadCard.tsx          — Tappable lead list item
│   ├── EscalationCard.tsx    — Escalation alert card with resolve action
│   ├── FollowUpCard.tsx      — Follow-up task card with mark-done
│   ├── EmptyState.tsx        — Empty list placeholder
│   └── ScreenHeader.tsx      — Consistent screen header
├── screens/           # Full screens
│   ├── HomeScreen.tsx        — Dashboard: stats + activity feed
│   ├── LeadsScreen.tsx       — Filtered leads list
│   ├── EscalationsScreen.tsx — Active escalation alerts
│   ├── FollowUpsScreen.tsx   — Scheduled follow-up tasks
│   └── ConversationDetailScreen.tsx — Full thread + timeline + SOP
├── navigation/
│   └── index.tsx             — Bottom tabs + stack navigator
├── mock/
│   ├── enquiries.ts          — 6 realistic enquiry records
│   └── dashboard.ts          — Stats + activity feed data
├── types/
│   └── index.ts              — All TypeScript interfaces
├── constants/
│   └── index.ts              — Colors, spacing, font sizes, radii
└── utils/
    └── index.ts              — formatRelativeTime, badge color helpers
```

---

## Screens

### Home (Dashboard)
- Live stats: total leads today, missed enquiries, open escalations, follow-ups due
- Quick action buttons linking to each tab
- Activity feed showing all recent events with channel badges

### Leads
- Full list of inbound enquiries with filter tabs (All / Open / Processing / Qualified / Escalated)
- Each card shows: customer avatar, name, message preview, channel badge, status badge, SOP tag, relative time
- Tap any card to open Conversation Detail

### Escalations
- Active escalation alerts with urgency-coloured left strip (red = high, amber = medium)
- Per-card Resolve button with confirmation dialog (removes card from list — simulates state update)
- Alert banner when escalations are pending

### Follow-ups
- Grouped into Pending and Completed sections
- Due time badge turns red and shows "Overdue" when past due
- Mark as Done action fades the card and moves it to the Completed group

### Conversation Detail
- Full message thread with customer/AI bubble layout
- SOP match banner (sky-blue)
- AI Summary panel (amber)
- Escalation reason banner (red) when applicable
- Chronological status timeline with connecting lines
- Follow-up task list with status pills

---

## Styling Decision: NativeWind vs StyleSheet

**Decision: StyleSheet with design tokens**

NativeWind (Tailwind for React Native) is excellent for rapid prototyping but has limitations:
- Class-name autocompletion is unreliable in NativeWind v2 with TypeScript strict mode
- Dynamic colours (e.g. `backgroundColor: COLORS.accent + '20'` for opacity variants) aren't expressible as static Tailwind classes
- Design token constants (`COLORS`, `SPACING`, `FONT_SIZE`) give the same maintainability benefit as Tailwind's config without the build complexity

All colours, spacing, and radius values are in `src/constants/index.ts` — a single source of truth that behaves exactly like a Tailwind theme config.

---

## Mock Data

All mock data lives in `src/mock/` as typed JSON-shaped objects — structured exactly as a real API response would look, including `id`, `job_id`, ISO timestamps, nested arrays for `status_timeline`, `follow_ups`, and `conversation_history`. This makes the API integration path trivial: swap mock imports for `fetch()` calls.

---

## Color System

| Context | Color |
|---|---|
| WhatsApp channel | `#22C55E` (green) |
| Email channel | `#3B82F6` (blue) |
| Call channel | `#F59E0B` (amber) |
| Status: New/Open | `#38BDF8` (sky blue) |
| Status: Qualified | `#22C55E` (green) |
| Status: Escalated | `#EF4444` (red) |
| Status: Processing | `#A78BFA` (purple) |
| Urgency: High | `#EF4444` |
| Urgency: Medium | `#F59E0B` |
| Urgency: Low | `#22C55E` |

---

## Known Limitations

1. **No real API integration** — all data is mock. Replace mock imports with `fetch()` calls to the backend.
2. **No authentication** — a real app would have login/session management.
3. **No persistent state** — resolving escalations or marking follow-ups done resets on reload. Add AsyncStorage or a state manager (Zustand/Redux) for persistence.
4. **No push notifications** — a real dashboard would receive real-time escalation alerts via WebSocket or push.
5. **NativeWind classes partially applied** — dynamic colour logic uses StyleSheet directly; static utility classes could be added progressively.
