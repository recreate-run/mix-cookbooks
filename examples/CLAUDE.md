# Mix Cookbooks Examples - Development Guide

This guide explains how to create new consumer-facing webapp examples that demonstrate Mix SDK integration.

## Philosophy

**Goal**: Show developers how easy it is to add AI to existing webapps using Mix SDK.

**Key Principles**:
1. **Integration simplicity** - Examples show "add AI in X lines" not "build alternative to Y"
2. **Consumer-focused** - Build products regular people use (shopping, recipes, travel)
3. **Solid interactions** - Clear UI patterns (buttons, modals, cards) not just chat boxes
4. **Real data flows** - Show how to pass context/data to AI effectively
5. **Visual & concise** - Use tables, charts, emojis in AI responses

---

## Mix TStack Start Template

### What's Pre-Configured

Every example starts with a fully-configured template:

**Frontend Stack:**
- React 19 with TypeScript (strict mode)
- TanStack Start (SSR framework)
- TanStack Router (file-based routing)
- TanStack Query (data fetching)
- Tailwind CSS v4
- Shadcn UI components (50+ Radix UI components)

**Mix SDK Integration:**
- Mix TypeScript SDK v0.8.8 (installed)
- Mix client singleton (`src/lib/mix-client.ts`)
- Streaming utilities (`src/lib/mix-streaming.ts`)
- Environment configuration (`.env`)

**Developer Tools:**
- Biome (linting & formatting)
- Vite dev server with HMR
- TypeScript strict mode
- TanStack DevTools
- Makefile commands

### Project Structure Template

```
example-name/
├── src/
│   ├── routes/              # File-based routing
│   │   ├── __root.tsx      # Root layout (theme, fonts)
│   │   ├── index.tsx       # Home page
│   │   └── api/            # API routes (create these)
│   │       ├── session.ts           # Mix session creation
│   │       └── stream.$sessionId.ts # SSE streaming
│   ├── components/
│   │   ├── ui/             # Shadcn components (50+ available)
│   │   └── [custom]/       # Your components
│   ├── lib/
│   │   ├── mix-client.ts   # Mix SDK singleton (pre-configured)
│   │   ├── mix-streaming.ts # Streaming helpers
│   │   └── utils.ts        # Utility functions
│   ├── data/               # Types, dummy data
│   └── styles.css          # Tailwind imports
├── public/                 # Static assets
├── .env                    # MIX_SERVER_URL
├── package.json
├── tsconfig.json
├── Makefile                # Dev commands
├── CLAUDE.md               # Example-specific docs
└── README.md               # User-facing docs
```

---

## Creating a New Example

### Step 1: Setup Template

```bash
# Copy portfolio-analyzer as starting point
cd examples/
cp -r portfolio-analyzer my-new-example/
cd my-new-example/

# Install dependencies
bun install

# Verify it runs
make dev
make tail-log  # Check for errors
```

### Step 2: Plan Your Example

**Define the user flow:**
1. What problem does it solve?
2. What data/context does the user provide?
3. How does AI help? (compare, analyze, recommend, etc.)
4. What does the user see? (results, charts, recommendations)

**Example (Shopping Comparison):**
1. User selects 2+ laptops
2. User clicks "Compare with AI"
3. AI analyzes specs and creates comparison table
4. User asks follow-up questions

### Step 3: Create Data/Types

Create `src/data/[domain].ts` with:
- TypeScript interfaces for your domain
- Dummy data (5-10 items minimum)
- Realistic, complete data (don't skip fields)

```typescript
// src/data/products.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  specs: {
    // Complete specs here
  };
  image: string;
}

export const products: Product[] = [
  // 6-10 items with full data
];
```

### Step 4: Build UI Components

**Use Shadcn components exclusively:**

```bash
# Check available components
pnpx shadcn@latest

# Add components as needed
pnpx shadcn@latest add button
pnpx shadcn@latest add card
pnpx shadcn@latest add input
pnpx shadcn@latest add dialog
```

**Common UI patterns:**

**Grid/List View:**
```typescript
// src/components/ProductGrid.tsx
export function ProductGrid() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} onClick={() => toggleSelect(item.id)}>
          {/* Item content */}
        </Card>
      ))}
    </div>
  );
}
```

**Modal/Dialog for AI Interaction:**
```typescript
// src/components/ComparisonModal.tsx
export function ComparisonModal({ items, onClose }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    async function startAnalysis() {
      // 1. Create Mix session
      // 2. Build context with item details
      // 3. Stream AI response
    }
    startAnalysis();
  }, [items]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-[700px] flex flex-col">
        {/* Header, Messages, Input */}
      </Card>
    </div>
  );
}
```

### Step 5: Create API Routes

**Pattern 1: Session Creation** (`src/routes/api/session.ts`):

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { getMixClient, initializeMixPreferences } from "@/lib/mix-client";

export const Route = createFileRoute("/api/session")({
  server: {
    handlers: {
      POST: async () => {
        const mix = getMixClient();
        await initializeMixPreferences(mix);

        const session = await mix.sessions.create({
          title: "Your Example Title"
        });

        return new Response(JSON.stringify({ success: true, session }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    }
  }
});
```

**Pattern 2: SSE Streaming** (`src/routes/api/stream.$sessionId.ts`):

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { getMixClient } from "@/lib/mix-client";

export const Route = createFileRoute("/api/stream/$sessionId")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const { sessionId } = params;
        const url = new URL(request.url);
        const message = url.searchParams.get("message");

        if (!message) {
          return new Response("Missing message parameter", { status: 400 });
        }

        const mix = getMixClient();

        const stream = new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();

            function send(event: string, data: unknown) {
              const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
              controller.enqueue(encoder.encode(message));
            }

            try {
              const streamResponse = await mix.streaming.streamEvents({ sessionId });

              // Start sending message in parallel
              const sendPromise = mix.messages.send({
                id: sessionId,
                requestBody: { text: message }
              });

              // Process events from stream
              for await (const event of streamResponse.result) {
                if (!event.data) continue;
                send(event.event, event.data);

                if (event.event === "complete") {
                  await sendPromise;
                  controller.close();
                  return;
                }
              }

              await sendPromise;
              controller.close();
            } catch (error: unknown) {
              send("error", {
                error: error instanceof Error ? error.message : "Stream error"
              });
              controller.close();
            }
          }
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive"
          }
        });
      }
    }
  }
});
```

### Step 6: Implement AI Integration

**Critical Pattern: Context Passing**

```typescript
// Build rich context with ALL relevant data
const context = items.map(item => `
Item: ${item.name}
Price: $${item.price}
Details:
${Object.entries(item.specs)
  .map(([key, value]) => `  - ${key}: ${value}`)
  .join('\n')}
`).join('\n---\n');

// Create structured prompt
const prompt = `Compare these items in a CONCISE format with visual aids:

${context}

Create a comparison that includes:
1. **Comparison Table** - Key attributes side-by-side
2. **Visual Charts** - Use ASCII bar charts or ratings (★★★★☆)
3. **Quick Recommendations** - Best for different use cases
4. **One-Liner Strengths** - Highlight per item

Keep it CONCISE and VISUAL. Use emojis, tables, charts.`;
```

**Client-Side SSE Handling:**

```typescript
const eventSource = new EventSource(
  `/api/stream/${sessionId}?message=${encodeURIComponent(prompt)}`
);

eventSource.addEventListener("content", (event) => {
  const data = JSON.parse(event.data);
  if (data.content) {
    aiContent += data.content;
    setMessages([{ role: "assistant", content: aiContent }]);
  }
});

eventSource.addEventListener("complete", () => {
  setIsStreaming(false);
  eventSource.close();
});

eventSource.addEventListener("error", () => {
  setIsStreaming(false);
  eventSource.close();
});
```

---

## Design Guidelines

### Use Shadcn Components Only

**Available Components:**
```
accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb,
button, calendar, card, carousel, chart, checkbox, collapsible, combobox,
command, context-menu, data-table, date-picker, dialog, drawer, dropdown-menu,
form, hover-card, input, input-otp, label, menubar, navigation-menu,
pagination, popover, progress, radio-group, resizable, scroll-area, select,
separator, sheet, skeleton, slider, sonner, switch, table, tabs, textarea,
toast, toggle, toggle-group, tooltip
```

**Add as needed:**
```bash
pnpx shadcn@latest add [component-name]
```

### Color Scheme

**IMPORTANT: Always use shadcn semantic colors - NEVER hardcode colors**

Shadcn provides semantic color classes that automatically adapt to the theme.
**Never use hardcoded colors like `slate-900`, `purple-600`, `blue-400`, etc.**

**Semantic Color Classes:**
```typescript
// Backgrounds
className="bg-background"           // Main background
className="bg-card"                 // Card backgrounds
className="bg-popover"              // Popover backgrounds
className="bg-muted"                // Muted backgrounds

// Foregrounds (Text)
className="text-foreground"         // Primary text
className="text-muted-foreground"   // Secondary/muted text
className="text-card-foreground"    // Text on cards
className="text-popover-foreground" // Text in popovers

// Interactive Elements
className="bg-primary text-primary-foreground"       // Primary buttons/actions
className="bg-secondary text-secondary-foreground"   // Secondary buttons
className="bg-accent text-accent-foreground"         // Accent highlights
className="bg-destructive text-destructive-foreground" // Delete/danger actions

// Borders & Inputs
className="border-border"           // Standard borders
className="ring-ring"               // Focus rings
className="bg-input"                // Input backgrounds
```

**Example Usage:**
```typescript
// ❌ WRONG - Don't use hardcoded colors
<Card className="bg-slate-900 border-slate-700">
  <h2 className="text-purple-400">Title</h2>
  <p className="text-slate-300">Content</p>
  <Button className="bg-blue-600 hover:bg-blue-700">Click</Button>
</Card>

// ✅ CORRECT - Use shadcn semantic colors
<Card>
  <h2 className="text-foreground">Title</h2>
  <p className="text-muted-foreground">Content</p>
  <Button>Click</Button> {/* Primary colors applied by default */}
</Card>
```

**For Success/Warning/Error States:**
```typescript
// Use semantic colors with intent
className="text-green-600 dark:text-green-400"  // Success (if needed beyond primary)
className="text-yellow-600 dark:text-yellow-400" // Warning
className="text-destructive"                    // Error/danger
```

### Layout Patterns

**Full-page layout:**
```typescript
<div className="min-h-screen bg-background p-8">
  <div className="max-w-7xl mx-auto">
    {/* Content */}
  </div>
</div>
```

**Modal overlay:**
```typescript
<div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <Card className="w-full max-w-4xl h-[700px] flex flex-col">
    {/* Modal content */}
  </Card>
</div>
```

**Card layout:**
```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Icons

**Use Lucide React:**
```typescript
import { Check, X, Send, Loader2, ChevronDown } from "lucide-react";

<Button>
  <Send className="w-4 h-4" />
</Button>
```

---

## Code Style & Conventions

### File Naming

```
PascalCase    - Components (ProductGrid.tsx, ComparisonModal.tsx)
kebab-case    - Routes (stream.$sessionId.ts, session.ts)
camelCase     - Utilities (mixClient.ts, utils.ts)
lowercase     - Data (products.ts, recipes.ts)
```

### Import Ordering

```typescript
// 1. React/framework imports
import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

// 2. Local imports
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/ProductGrid";
import { getMixClient } from "@/lib/mix-client";
import type { Product } from "@/data/products";

// 3. Icons last
import { X, Send } from "lucide-react";
```

### Path Aliases

**Use `@/` prefix for all imports:**
```typescript
import { getMixClient } from "@/lib/mix-client";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";
```

### TypeScript

**Always define interfaces:**
```typescript
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ComparisonModalProps {
  products: Product[];
  onClose: () => void;
}
```

**Use type imports:**
```typescript
import type { Product } from "@/data/products";
```

### Component Structure

```typescript
"use client";  // If using client-side hooks

import statements...

interface Props {
  // Props definition
}

export function ComponentName({ props }: Props) {
  // 1. State declarations
  const [state, setState] = useState();

  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, [deps]);

  // 3. Handlers
  const handleAction = () => {
    // Handler logic
  };

  // 4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

---

## Development Workflow

### Commands (via Makefile)

```bash
make dev          # Start dev server (outputs to dev.log)
make tail-log     # View last 100 lines of dev.log
make typecheck    # Run TypeScript type checking
make clean        # Clean build artifacts
make help         # Show all commands
```

### Development Loop

1. Make changes to code
2. HMR auto-reloads (watch terminal or `make tail-log`)
3. Check for errors: `make tail-log`
4. Fix TypeScript errors: `make typecheck`
5. Repeat

**Important:**
- Dev server runs in background, outputs to `dev.log`
- Always check `dev.log` after changes
- Don't stop dev server unnecessarily
- HMR handles most reloads

### Testing Flow

**Without Mix Server:**
- UI interactions work
- Component rendering works
- Session creation fails (expected)

**With Mix Server:**
```bash
cd ../../mix && make dev
```
- Full AI streaming works
- Test complete user flow
- Test follow-up questions

---

## Common Patterns

### Pattern 1: Selection + Action

```typescript
// User selects items from grid
const [selected, setSelected] = useState<string[]>([]);

// Action enabled when selection criteria met
<Button
  disabled={selected.length < 2}
  onClick={handleAction}
>
  Action ({selected.length})
</Button>
```

### Pattern 2: Modal for AI Interaction

```typescript
// Open modal with selected items
const [showModal, setShowModal] = useState(false);
const selectedItems = items.filter(i => selected.includes(i.id));

{showModal && (
  <Modal
    items={selectedItems}
    onClose={() => setShowModal(false)}
  />
)}
```

### Pattern 3: Auto-start AI on Modal Open

```typescript
useEffect(() => {
  async function startAnalysis() {
    // 1. Create session
    const res = await fetch("/api/session", { method: "POST" });
    const { session } = await res.json();
    setSessionId(session.id);

    // 2. Build context
    const context = buildContext(items);

    // 3. Start streaming
    const eventSource = new EventSource(
      `/api/stream/${session.id}?message=${encodeURIComponent(context)}`
    );
    // ... handle events
  }
  startAnalysis();
}, [items]);
```

### Pattern 4: Follow-up Questions

```typescript
const handleAsk = async () => {
  const userMessage = input.trim();
  setMessages(prev => [...prev, { role: "user", content: userMessage }]);

  // Add context to follow-up
  const contextualPrompt = `Regarding the ${topic}: ${userMessage}`;

  // Stream response (same SSE pattern)
  const eventSource = new EventSource(
    `/api/stream/${sessionId}?message=${encodeURIComponent(contextualPrompt)}`
  );
};
```

### Pattern 5: Streaming Message Updates

```typescript
// Initialize with empty message
setMessages([{ role: "assistant", content: "" }]);

eventSource.addEventListener("content", (event) => {
  const data = JSON.parse(event.data);
  if (data.content) {
    aiContent += data.content;
    // Update last message
    setMessages(prev => {
      const updated = [...prev];
      updated[updated.length - 1].content = aiContent;
      return updated;
    });
  }
});
```

---

## Example Checklist

Before submitting a new example, verify:

### Functionality
- [ ] Creates Mix session successfully
- [ ] Streams AI responses in real-time
- [ ] Context passing works (AI has all data)
- [ ] Follow-up questions work
- [ ] Error handling present (session creation, streaming)
- [ ] Loading states shown during streaming

### UI/UX
- [ ] Uses only Shadcn components
- [ ] Dark theme with slate palette
- [ ] Consistent spacing (p-4, p-6, gap-4, gap-6)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Clear visual feedback (selection, loading, streaming)
- [ ] Icons from Lucide React

### Code Quality
- [ ] TypeScript strict mode (no `any`)
- [ ] All interfaces defined
- [ ] Path aliases use `@/` prefix
- [ ] Proper import ordering
- [ ] No console.logs in production code
- [ ] Comments explain complex logic

### Documentation
- [ ] CLAUDE.md in example directory (template-specific docs)
- [ ] README.md with setup instructions
- [ ] Code comments for AI integration patterns
- [ ] Environment variables documented

### Testing
- [ ] Runs without errors: `make dev && make tail-log`
- [ ] TypeScript compiles: `make typecheck`
- [ ] UI works without Mix server (graceful degradation)
- [ ] Full flow works with Mix server running
- [ ] Mobile responsive

---

## Tips & Best Practices

### Context is King

**Good context:**
```typescript
const context = `
Product: MacBook Pro M3
Price: $1999
Specs:
  - Processor: Apple M3 Pro (12-core)
  - RAM: 18GB
  - Storage: 512GB SSD
  - Display: 14.2" Liquid Retina XDR
  - Battery: 17 hours
  - Weight: 3.5 lbs
`;
```

**Bad context:**
```typescript
const context = `Compare ${product.name}`;  // Not enough data!
```

### Prompt Engineering

**Be specific about format:**
```
Create a comparison that includes:
1. **Table** - Side-by-side specs
2. **Charts** - ASCII bars or star ratings
3. **Recommendations** - Best for X, Y, Z

Keep it CONCISE and VISUAL.
```

**Use structure, not prose:**
```
✅ "Provide: 1. Table 2. Charts 3. Recommendations"
❌ "Can you please compare these products nicely?"
```

### Performance

- Create session once, reuse for follow-ups
- Don't refetch data unnecessarily
- Use `useEffect` deps correctly
- Close EventSource connections

### Error Handling

```typescript
try {
  const res = await fetch("/api/session", { method: "POST" });
  if (!res.ok) throw new Error("Failed to create session");
  // ... success path
} catch (error) {
  console.error("Error:", error);
  setMessages([{
    role: "assistant",
    content: "Sorry, I couldn't start the analysis. Please make sure Mix server is running."
  }]);
}
```

---

## Resources

**Documentation:**
- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

**Mix SDK:**
- [Mix TypeScript SDK](https://github.com/recreate-run/mix-typescript-sdk)
- [Mix Documentation](https://recreate.run/docs/mix)
- [Mix Repository](https://github.com/recreate-run/mix)

**Examples:**
- `portfolio-analyzer/` - CSV upload, file handling, data visualization
- `shopping-app/` - Product comparison, selection UI, follow-up questions

---

## Code Style Reminder

Per mix-cookbooks/CLAUDE.md:

1. **Simple & readable** - No premature optimization, minimal abstraction
2. **Never mock AI calls** - Always use real Mix SDK
3. **No backward compatibility** - Unless explicitly requested
4. **Fail fast** - Don't handle errors gracefully, raise immediately

Focus on clear implementation that's easy to understand and iterate on.

---

## Social Media Content (Post-Build)

After completing each example, create social media content templates to showcase Mix SDK's integration simplicity.

### Why Social Media Content Matters

Examples are great. But **showing how easy integration is** drives adoption.

The goal: "Make your webapp agentic in X lines of code"

### Required Content Templates

For each example, create these templates in the plan file (e.g., `plan/day-01-shopping-assistant.md`):

#### 1. Twitter/X Thread (6 tweets)

**Structure:**
```
Tweet 1: Hook - "I added [feature] in X lines of code 🤯"
Tweet 2: Problem/solution framing
Tweet 3: Code snippet (15-20 lines max)
Tweet 4: Demo video/GIF placeholder
Tweet 5: Value proposition (what Mix SDK handles)
Tweet 6: CTA with links
```

**Example:**
```
I just added AI product comparison to an e-commerce site.

It took 15 lines of code. 🤯

Here's how easy it is with Mix SDK 👇

[Thread continues with problem, code, demo, value, CTA]
```

**Key elements:**
- Lead with the number (15 lines, 2 hours, etc.)
- Show real code, not pseudocode
- Emphasize "integration" not "building from scratch"
- End with clear call-to-action

#### 2. LinkedIn Post

**Structure:**
```markdown
🚀 [Compelling headline about the build]

[THE CHALLENGE section]
[THE SOLUTION section]
[THE IMPLEMENTATION section with code]
[THE RESULTS section with checkmarks]
[THE BEST PART section - what you didn't have to do]

🔗 Links
🛠️ Tech stack

#Hashtags
```

**Tone:**
- Professional but approachable
- Business value emphasis
- "I learned" framing (authentic)
- Technical enough to be credible

**Example opening:**
```
🚀 I just built an AI product comparison feature in 2 hours

And it only took 15 lines of code.

Here's what I learned about adding AI to existing webapps:
```

#### 3. Reddit Post (r/webdev, r/reactjs)

**Title format:**
```
"I added [feature] to [use case] in X lines of code"
```

**Body structure:**
```markdown
[Brief introduction - what you built and why]

[What users can do - bullet points]

**The cool part:** [Key technical insight]

**The stack:**
[Technologies used]

**Code snippet:**
[10-15 lines of actual code]

**Why I like [technology]:**
[3-4 bullet points of benefits]

Full code + live demo: [link]

Feedback welcome!
```

**Tone:**
- Developer-to-developer
- Technical details upfront
- Humble ("exploring", "feedback welcome")
- Code-first, marketing-last

#### 4. Dev.to / Hashnode Article

**Title options (provide 3):**
1. "I Built [Feature] in X Lines of Code"
2. "How to Add [Feature] to Your Webapp Without [Pain Point]"
3. "Building [Feature]: A Practical Guide with [Technology]"

**Article outline:**
```markdown
## The Problem
[User pain point, business impact]

## What We're Building
[Feature overview with bullets]

## The Stack
[Technologies with brief explanations]

## The Code
[Step-by-step with code blocks]

## Key Patterns
[Technical patterns explained]

## Demo
[Screenshots/GIFs]

## Why [Technology]?
[Benefits with checkmarks]

## Try It Yourself
[Links to code and instructions]

## Conclusion
[Key takeaway, CTA]
```

**Length:** 5-10 minute read (800-1500 words)

#### 5. YouTube/Video Script

**Format:**
```
[0:00] Hook - shocking statement or question
[0:15] Problem - what users face today
[0:30] Demo - show the solution working
[1:00] Code - explain the implementation
[1:30] Features - what makes it powerful
[2:00] Stack - technologies used
[2:30] Why it matters - bigger picture
[3:00] CTA - links and next steps
```

**Visual suggestions:**
- Screen recording of working demo
- Code editor with syntax highlighting
- Architecture diagram (simple)
- Before/after comparison

#### 6. Visual Assets

Create placeholders for:

1. **Before/After comparison**
   - Before: Current pain point (tabs, confusion, slow)
   - After: AI solution (clean, fast, intuitive)

2. **Code snippet card**
   - Highlighted code (15-20 lines max)
   - "That's all it takes" caption
   - Mix SDK logo/badge

3. **Feature showcase GIF**
   - Key interaction flow (5-10 seconds)
   - Shows input → AI processing → result
   - Includes follow-up question

4. **Stats card**
   - "X lines of code"
   - "Y hours build time"
   - "Real-time streaming"
   - "Multi-model routing"

5. **Architecture diagram**
   - Simple flow: User → UI → Mix SDK → AI
   - "No backend complexity" annotation

### Content Guidelines

#### Core Messages to Emphasize

Every piece of content should include at least 3 of these:

1. **Speed**: "15 lines of code, 2 hours build time"
2. **Simplicity**: "No backend rewrite needed"
3. **Integration**: "Drops into any webapp"
4. **Power**: "Multi-model routing built-in"
5. **UX**: "Real-time streaming, sidebar layout"
6. **Accessibility**: "Make any webapp agentic"

#### Hashtag Strategy

**Twitter/X:**
```
#AI #WebDev #React #OpenSource #TypeScript #LLM #BuildInPublic
```

**LinkedIn:**
```
#ArtificialIntelligence #WebDevelopment #ReactJS #SoftwareEngineering #LLM #TechInnovation
```

**Dev.to:**
```
#ai #webdev #react #typescript #tutorial
```

**Reddit:**
No hashtags, use flair: "Project" or "Tutorial"

#### Writing Style

**Do:**
- Lead with value (X lines of code, Y hours)
- Show real code, not pseudocode
- Use concrete examples ("laptop comparison" not "product analysis")
- Include before/after comparisons
- Emphasize what you DON'T have to do
- End with clear CTAs

**Don't:**
- Use marketing fluff ("revolutionary", "game-changer")
- Hide the tech stack
- Make it about you (focus on the technology)
- Promise what you can't deliver
- Skip the "how" and only show the "what"

### Posting Strategy

**Week 1:**
- Day 1: Twitter thread (build anticipation)
- Day 2: LinkedIn post (professional audience)
- Day 3: Reddit (dev communities feedback)

**Week 2:**
- Day 1: Dev.to article (detailed walkthrough)
- Day 3: YouTube video (visual learners)
- Day 5: Twitter follow-up with metrics

**Ongoing:**
- Share user implementations
- Answer questions promptly
- Create follow-up content based on feedback
- Cross-post to relevant communities

### Example Template Location

See `plan/day-01-shopping-assistant.md` for complete social media templates.

Each example should include:
- All 5 content formats (Twitter, LinkedIn, Reddit, Blog, Video)
- Visual asset suggestions
- Platform-specific hashtags
- 2-week posting strategy

### Metrics to Track

After posting, track and iterate:

- **Engagement**: Likes, retweets, comments
- **Traffic**: Link clicks to repo/demo
- **Adoption**: Stars, forks, npm downloads
- **Questions**: Common pain points in comments
- **Conversions**: Sign-ups, deployments

Use feedback to improve:
- Code examples (if people ask same questions)
- Documentation (if setup is confusing)
- Future examples (what features people want)

---

## Summary Checklist

When creating a new example, ensure you:

### Functionality
- [ ] Creates Mix session successfully
- [ ] Streams AI responses in real-time
- [ ] Context passing works (AI has all data)
- [ ] Follow-up questions work
- [ ] Error handling present
- [ ] Loading states shown

### Code Quality
- [ ] TypeScript strict mode (no `any`)
- [ ] All interfaces defined
- [ ] Path aliases use `@/` prefix
- [ ] Proper import ordering
- [ ] Comments explain complex logic
- [ ] Follows code style guide

### Documentation
- [ ] Example README.md with setup
- [ ] Code comments for key patterns
- [ ] Environment variables documented
- [ ] CLAUDE.md updated (if needed)

### Social Media
- [ ] Twitter/X thread template (6 tweets)
- [ ] LinkedIn post template
- [ ] Reddit post template
- [ ] Blog post outline + 3 titles
- [ ] YouTube script with timestamps
- [ ] Visual asset suggestions (5 types)
- [ ] Platform-specific hashtags
- [ ] 2-week posting strategy

### Testing
- [ ] Runs without errors: `make dev && make tail-log`
- [ ] TypeScript compiles: `make typecheck`
- [ ] UI works without Mix server
- [ ] Full flow works with Mix server
- [ ] Mobile responsive

---
