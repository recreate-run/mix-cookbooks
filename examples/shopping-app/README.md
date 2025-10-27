# Shopping App with Autonomous AI Research

AI-powered laptop comparison with two modes: quick specs comparison and thorough autonomous web research.

## What This Example Demonstrates

This example shows how to integrate **autonomous AI research** into an e-commerce webapp. It goes beyond simple spec comparison by enabling AI to search the web, read reviews, analyze sentiment, and provide cited recommendations.

### Two Comparison Modes

**📊 Compare Specs (Fast)**
- Quick comparison based on local product specs
- ASCII charts and ratings
- Best for: Quick decisions, known products
- Time: ~5-10 seconds

**🔍 Research with AI (Thorough)**
- Autonomous web search for reviews
- Reads 5-10 professional review articles
- Sentiment analysis across sources
- AI-generated comparison charts
- Every claim cited with source URLs
- Best for: Thorough research, fact-checking
- Time: ~30-60 seconds

## Key Features

### Autonomous Tool Usage
The AI autonomously decides which tools to use:
- **Search** - Finds professional reviews (TechRadar, CNET, The Verge, etc.)
- **ReadText** - Reads review articles to extract opinions
- **PythonExecution** - Analyzes sentiment, aggregates ratings
- **ShowMedia** - Generates comparison charts (sentiment, ratings)

### Real-Time Research Visibility
Users see the AI working in real-time:
```
🔍 Searching for MacBook Pro M3 reviews...
📖 Reading TechRadar: MacBook Pro M3 Review
📖 Reading CNET: Is the MacBook Pro M3 Worth It?
📊 Analyzing sentiment across 6 sources...
📈 Generating comparison charts...
✍️ Writing synthesis with citations...
```

### Citation System
Every claim is backed by sources:
> Based on 6 professional reviews, the MacBook Pro M3 receives consistently higher praise [1][2][3]. TechRadar notes "exceptional M3 chip performance" [1].
>
> **Sources:**
> 1. [TechRadar: MacBook Pro M3 Review](https://techradar.com/...)
> 2. [CNET: Is the MacBook Pro M3 Worth It?](https://cnet.com/...)

This solves the AI hallucination problem - every recommendation is verifiable.

## Tech Stack

- **Frontend**: React 19 + TypeScript + TanStack Start
- **UI**: Tailwind CSS v4 + Shadcn components
- **AI**: Mix SDK v0.8.8 (autonomous agents)
- **Streaming**: Server-Sent Events (SSE)

## Quick Start

### Prerequisites
- Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- Mix server running (see below)

### Run the App

```bash
# Install dependencies
bun install

# Start dev server
make dev

# View logs
make tail-log
```

Visit `http://localhost:3000`

### Start Mix Server

In a separate terminal:
```bash
cd /path/to/mix
make dev
```

The app connects to Mix server at `http://localhost:8088` (configured in `.env`)

## How It Works

### Architecture

```
User selects products → Two action buttons appear
                         ↓
              ┌──────────┴─────────┐
              ↓                     ↓
    📊 Compare Specs      🔍 Research with AI
    (Fast, local data)    (Thorough, web research)
              ↓                     ↓
         ComparisonModal opens with selected mode
              ↓
    Creates Mix session → Sends prompt → Streams response
              ↓
    Shows real-time tool usage & results
```

### Integration Pattern: Sidebar Modal

The comparison opens in a **right-side sidebar** (not a full-page modal):
- ✅ Non-blocking - keeps product grid visible
- ✅ Real-time streaming updates
- ✅ Follow-up questions capability
- ✅ Easy to close and select different products

### Research Mode Tool Flow

1. **User clicks "Research with AI"** on 2-3 selected products
2. **AI searches web** autonomously for "[product name] review 2024"
3. **AI reads 5-10 articles** from reputable tech sites
4. **AI analyzes sentiment** using Python (positive/negative/neutral)
5. **AI generates charts** (sentiment comparison, expert ratings)
6. **AI writes synthesis** with inline citations [1][2][3]
7. **Sources displayed** with clickable URLs

### Code Structure

```
src/
├── components/
│   ├── ProductGrid.tsx           # Product selection + action buttons
│   ├── ComparisonModal.tsx       # Main comparison UI with 2 modes
│   ├── ResearchProgress.tsx      # Real-time research step tracker
│   ├── SourcesList.tsx           # Displays URLs AI read
│   └── ChartsDisplay.tsx         # Shows AI-generated visualizations
├── routes/
│   └── api/
│       ├── session.ts            # Creates Mix session
│       └── stream.$sessionId.ts  # SSE streaming endpoint
├── data/
│   └── products.ts               # Laptop data (6 products)
└── lib/
    ├── mix-client.ts             # Mix SDK singleton
    └── mix-streaming.ts          # Streaming helpers
```

## Development

```bash
# Start dev server (auto-reload)
make dev

# View logs
make tail-log

# Run type checking
make typecheck

# Format code
make format
```

## Why This Example Matters

### Problem It Solves

**Traditional e-commerce limitation**: Product pages only show specs and maybe a few cherry-picked testimonials. Users have to manually:
1. Google "[product name] review"
2. Open 10+ tabs
3. Read multiple reviews
4. Try to remember key points
5. Manually compare findings

**This example automates all of that** - AI does the research, reading, analysis, and comparison.

### Specs Mode vs Research Mode

| Aspect | Specs Mode | Research Mode |
|--------|------------|---------------|
| **Data Source** | Local product data | Web reviews + specs |
| **Speed** | ~5 seconds | ~30-60 seconds |
| **Tools Used** | None (just AI reasoning) | Search, ReadText, PythonExecution, ShowMedia |
| **Output** | Spec comparison table, ASCII charts | Sentiment analysis, expert ratings, cited synthesis |
| **Trust** | Based on manufacturer specs | Based on real expert/user opinions |
| **Citations** | None | Every claim cited [1][2][3] |
| **Use Case** | Quick spec check | Thorough buying decision |

### What Makes It Agentic

This isn't just "AI chat" - it's autonomous multi-step research:

1. **AI decides what to search** (doesn't need explicit instructions)
2. **AI selects reputable sources** (TechRadar, CNET, not random blogs)
3. **AI reads full articles** (not just snippets)
4. **AI writes analysis code** (sentiment extraction, rating aggregation)
5. **AI generates visualizations** (matplotlib charts)
6. **AI synthesizes findings** (not just copy-paste)

**You can't do this with ChatGPT/Claude alone** - no web search, no code execution, no visualizations.

## Impossible with OpenAI Alone

This example requires Mix because:

- ❌ OpenAI API: No web search
- ❌ OpenAI API: No code execution
- ❌ OpenAI API: No visualization generation
- ✅ Mix SDK: All of the above + autonomous tool orchestration

## Key Integration Patterns

### Pattern 1: Two-Mode Button

Instead of replacing existing functionality, **add AI as enhancement**:

```tsx
<Button onClick={() => handleCompare("specs")}>
  📊 Compare Specs (Fast)
</Button>
<Button onClick={() => handleCompare("research")}>
  🔍 Research with AI (Thorough)
</Button>
```

Users choose when to use AI (for important decisions) vs quick comparisons.

### Pattern 2: Real-Time Tool Visibility

Show users what AI is doing (builds trust):

```tsx
{mode === "research" && (
  <>
    <ResearchProgress steps={researchSteps} />
    <SourcesList sources={sources} />
    <ChartsDisplay charts={charts} />
  </>
)}
```

Users see:
- 🔍 Which searches AI ran
- 📖 Which articles AI read (with URLs)
- 📊 When AI is analyzing data
- 📈 Charts AI generated

### Pattern 3: Citation Tracking

Track sources as AI reads them:

```tsx
eventSource.addEventListener("tool_parameter_delta", (event) => {
  if (data.name === "ReadText" && data.parameter === "url") {
    setSources(prev => [...prev, {
      url: data.delta,
      title: extractDomain(data.delta),
      status: "reading"
    }]);
  }
});
```

Then AI includes citations in output: "According to TechRadar [1]..."

## Learn More

- **Mix SDK**: [Documentation](https://recreate.run/docs/mix)
- **TanStack Start**: [Documentation](https://tanstack.com/start)
- **Shadcn UI**: [Components](https://ui.shadcn.com)

## License

MIT
