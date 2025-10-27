# Mix SDK Integration Examples - Build Plan

## Overview
6 NEW consumer-focused examples showing how to integrate Mix SDK into existing webapps. Each example demonstrates "integration simplicity" - adding AI with minimal code changes.

**Focus:** Products commonly used by regular people, not developer tools.

## Core Philosophy
**"Add AI to your existing app, don't rebuild it"**

- ✅ Integration, not replacement
- ✅ 15-40 lines of Mix SDK code
- ✅ Works with existing apps
- ✅ Copy-paste ready
- ❌ NOT standalone products
- ❌ NOT "better alternatives"

## Daily Schedule

| Day | Example | Key Feature | Lines | Time |
|-----|---------|-------------|-------|------|
| 1 | [Shopping Assistant](./day-01-shopping-assistant.md) | Product comparison | 15 | 2-3h |
| 2 | [Recipe Remix](./day-02-recipe-remix.md) | Image analysis + substitutions | 20 | 2-3h |
| 3 | [Travel Planner](./day-03-travel-planner.md) | **Parallel subagents** | 35 | 4-5h |
| 4 | [Financial Analyzer](./day-05-financial-analyzer.md) | Data insights + viz | 30 | 4-5h |
| 5 | [Content Repurposer](./day-06-content-repurposer.md) | Multi-platform generation | 25 | 3-4h |
| 6 | [Document Q&A](./day-07-document-qa.md) | Multi-doc chat | 30 | 4-5h |

**Total:** 6 consumer-focused examples, 20-24 hours

## Priority Order

### 🔥 Must Build (High Impact)
1. **Day 1 - Shopping Assistant** (simplest, great demo, high consumer appeal)
2. **Day 2 - Recipe Remix** (visual + practical, everyone cooks)
3. **Day 3 - Travel Planner** (shows subagents! everyone travels)

### 🎯 Should Build (Strong Value)
4. **Day 4 - Financial Analyzer** (personal finance, broad appeal)
5. **Day 5 - Content Repurposer** (creators, influencers, marketers)

### 💡 Nice to Have
6. **Day 6 - Document Q&A** (similar to existing PDF example)

## What Makes These Different?

### vs Existing Cookbook Examples
**Existing:** CLI demos (Python/TS scripts)
**New:** Full webapp integrations (React components)

**Existing:** Show Mix SDK features
**New:** Show how to add to existing consumer apps

### Key Differentiators
1. **Consumer-focused** - Products regular people use daily
2. **Subagents** (Day 3) - Show Task tool in action
3. **Integration patterns** - Sidebar, modal, panel
4. **Before/after** code comparisons
5. **Real use cases** - Not just feature demos

## Tech Stack (All Examples)

```
React 19 + TypeScript
├── TanStack Start (SSR framework)
├── TanStack Router (file-based routing)
├── Mix TypeScript SDK 0.9.1
├── Tailwind CSS v4
├── Radix UI (components)
└── Recharts (visualizations)
```

## Standard Code Pattern

Every example uses this pattern:

```typescript
// 1. Initialize (1 line)
const mix = new Mix({ serverURL: "http://localhost:8088" })

// 2. Create session (1 line)
const session = await mix.sessions.create({ title: "..." })

// 3. Handle interaction (10-30 lines)
await sendWithCallbacks(mix, session.id, prompt, {
  onContent: (text) => updateUI(text),
  onTool: (tool) => handleTool(tool),
  onError: (error) => showError(error)
})
```

## Project Structure

```
mix-cookbooks/
├── plan/                           # This directory
│   ├── README.md                   # Overview
│   ├── day-01-shopping-assistant.md
│   ├── day-02-recipe-remix.md
│   ├── day-03-travel-planner.md
│   ├── day-04-code-reviewer.md
│   ├── day-05-financial-analyzer.md
│   ├── day-06-content-repurposer.md
│   └── day-07-document-qa.md
│
└── examples/                       # Built webapps
    ├── portfolio-analyzer/         # Already exists
    ├── shopping-assistant/         # Day 1 - NEW
    ├── recipe-remix/               # Day 2 - NEW
    ├── travel-planner/             # Day 3 - NEW
    ├── financial-analyzer/         # Day 4 - NEW
    ├── content-repurposer/         # Day 5 - NEW
    └── document-qa/                # Day 6 - NEW
```

## How to Build Each Example

### Step 1: Set up base
```bash
cp -r mix-tstart-demo examples/[example-name]
cd examples/[example-name]
bun install
```

### Step 2: Create routes
```
src/routes/
├── index.tsx           # Landing/upload page
├── session.$id.tsx     # Main interaction page
└── api/
    ├── session.ts      # Create Mix session
    ├── upload.ts       # File upload (if needed)
    └── stream.$id.ts   # SSE streaming
```

### Step 3: Build components
```
src/components/
├── ChatInterface.tsx   # Reusable chat UI
├── FileUploader.tsx    # Drag-and-drop upload
└── [example-specific]/ # Custom components
```

### Step 4: Integrate Mix SDK
```typescript
// lib/mix-client.ts
import { Mix } from "mix-typescript-sdk"

export const mix = new Mix({
  serverURL: process.env.MIX_SERVER_URL || "http://localhost:8088"
})
```

### Step 5: Document
- README with integration guide
- Before/after code comparison
- Demo video (2-3 min)

## Success Criteria

Each example must:
- ✅ Show clear "before/after" integration
- ✅ Use <50 lines of Mix SDK code
- ✅ Work as drop-in component
- ✅ Include README
- ✅ Have working demo
- ✅ Focus on one integration pattern

## Reusable Components

Build once, use everywhere:

```typescript
// ChatInterface.tsx
export function ChatInterface({ session, onMessage }) {
  // Standard chat UI for all examples
}

// StreamingMessage.tsx
export function StreamingMessage({ content, isStreaming }) {
  // Displays streaming text with cursor
}

// SessionManager.tsx
export function SessionManager({ onSessionChange }) {
  // Create/switch/delete sessions
}

// FileUpload.tsx
export function FileUpload({ onUpload, accept }) {
  // Drag-and-drop file upload
}
```

## Key Mix SDK Features to Showcase

1. **Day 1-2:** Basic streaming + file upload
2. **Day 3:** Task tool with parallel subagents ⭐
3. **Day 4:** Data analysis + visualizations
4. **Day 5:** Parallel message generation
5. **Day 6:** Multi-document context

## Getting Started

### Prerequisites
```bash
# Start Mix server
cd mix && make dev

# Or without DevTools
./start_mix.sh
```

### Build First Example
```bash
cd mix-cookbooks
cp -r mix-tstart-demo examples/shopping-assistant
cd examples/shopping-assistant
bun install
bun run dev
```

## Content Strategy

For each example, create:
1. ✅ Working webapp in `examples/`
2. ✅ README with integration guide
3. ✅ Demo video (2-3 min)
4. ✅ Blog post (750 words)
5. ✅ Twitter thread (5-7 tweets)
6. ✅ Before/after code snippets

## Notes
- Start with Day 1 (simplest)
- Reuse portfolio-analyzer patterns
- Keep examples focused
- Don't over-engineer
- Ship daily for momentum
