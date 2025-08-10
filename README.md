# World Population Race Visualization

An interactive **Bar Chart Race** application built with **Next.js 15**, **React 19**, and **TypeScript**, visualizing the population changes of countries over time.  
This project follows a **modular, testable, and scalable architecture**, adhering to senior-level development practices.

---

## 🚀 Demo

You can view the live demo deployed on Vercel here: [Live Demo](https://nextjs-world-population-race.vercel.app/)

## 🚀 Features

- **Dynamic Bar Chart Race Animation**
  - Smooth FLIP-based animations using the Web Animations API.
  - Stable rankings for consistent bar transitions.
  - Support for any configurable top-N country limit.

- **Modular Architecture**
  - Components split into presentational and logic layers.
  - Core animation logic extracted into hooks for unit testing.
  - Reusable utility and data processing modules.

- **Accessibility (A11y)**
  - Live region announcements for screen readers.
  - Keyboard navigation with Arrow keys and Page Up/Down.

- **Performance Optimizations**
  - Memoized scale calculations.
  - Minimized re-renders using `memo` and `useMemo`.
  - Reduced DOM mutations by skipping unnecessary animations.

- **Theming & Styling**
  - TailwindCSS-based responsive design.
  - Gradient backgrounds, shadows, and hover effects.
  - Dark-friendly contrast adjustments.

- **Data Pipeline**
  - JSON dataset parsing with schema validation.
  - Data normalization & deduplication.
  - Stable rankings for animation consistency.

- **Testing**
  - **Vitest** for unit tests (hooks, utils).
  - **React Testing Library** for component behavior tests.
  - Full mock coverage for animation and DOM APIs.

---

## 📂 Folder Structure

```
src/
├── components/
│   └── chart/
│       ├── AnimatedBackground.tsx
│       ├── BarChart.tsx
│       ├── BarRow.tsx
│       ├── ChartDefs.tsx
│       ├── ChartPage.tsx
│       └── Pagination.tsx
│
├── constants/
│   ├── animation.ts
│   ├── background.ts
│   └── chart.ts
│
├── hooks/
│   ├── chart/
│   │   ├── useA11yAnnouncement.ts
│   │   ├── useBarChartAnimation.ts
│   │   ├── useChartDimensions.ts
│   │   ├── useChartScales.ts
│   │   └── useChartState.ts
│   ├── useMeasure.ts
│   ├── useQueryState.ts
│   ├── useReducedMotion.ts
│   └── useTweenedRows.ts
│
├── lib/
│   ├── chart/
│   │   ├── colors.ts
│   │   ├── format.ts
│   │   └── scales.ts
│   └── data/
│       ├── chart/
│       ├── index.ts
│       ├── loader.ts
│       ├── normalize.ts
│       ├── parse.ts
│       ├── rankings.ts
│       ├── schema.ts
│       ├── types.ts
│       ├── populationByYear.json
│       └── populationByYear-2.json
│
├── types/
│   ├── background.ts
│   ├── chart.ts
│   └── country-flag-emoji.d.ts
│
├── utils/
│   ├── animation.ts
│   ├── a11y.ts
│   ├── background.ts
│   └── chart.ts
│
└── test/
    ├── dom/
    │   └── hooks/
    └── setup.dom.ts
```

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Animations:** Web Animations API + FLIP technique
- **Testing:**
  - Vitest (unit tests)
  - React Testing Library (DOM/component tests)
- **Data Validation:** Zod
- **State Management:** React hooks

---

## ⚙️ Setup & Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build production bundle
pnpm build

# Run tests (unit + DOM)
pnpm test
```

---

## 🧪 Testing Strategy

- **Unit Tests** (`vitest`, Node environment)
  - Utils
  - Data processing
  - Pure hooks (no DOM)
- **DOM/Component Tests** (`vitest` + `@testing-library/react`, JSDOM environment)
  - Components
  - DOM-dependent hooks
- **Mocked Animations**
  - Web Animations API
  - `requestAnimationFrame`

Run tests:

```bash
pnpm test
pnpm test:ui  # with Vitest UI
```

---

## 🔧 Configuration Highlights

- **Vitest Multi-Project Setup**
  - Node environment for fast, pure logic tests.
  - JSDOM environment for React components.
- **Coverage thresholds:** 80%+ lines, functions, and statements.

---

## 📈 Performance Notes

- FLIP animations ensure minimal layout thrashing.
- Stable data rankings prevent bar jitter.
- Gradual transitions keep animation smooth on updates.
- Avoids redundant animations when values are unchanged.

---

## 👨‍💻 Author

Senior-level architecture & implementation by **[ZEESHAN AHMED]**.
