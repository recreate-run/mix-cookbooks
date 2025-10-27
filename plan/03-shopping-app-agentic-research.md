# Example 3: Shopping App + Autonomous Product Research (Enhancement)

## Overview

**Goal**: Enhance existing shopping-app with autonomous web research capabilities

**Current State**: Shopping-app compares products using local data
**Enhancement**: Add autonomous web research, multi-source analysis, citations

**What Makes It Agentic**:
- AI searches web autonomously for product reviews (Search)
- AI reads 5-10 review articles (ReadText)
- AI analyzes sentiment across sources (PythonExecution)
- AI generates comparison charts (ShowMedia)
- Every claim cited with source URLs

---

## Current Shopping-App (What We Have)

**Existing Features**:
- Product grid with 6 laptops
- Rich product specs (processor, RAM, storage, display, battery)
- Select 2+ products → Compare button
- ComparisonModal with AI analysis
- Follow-up questions

**Current Limitations**:
- Uses only LOCAL product data (specs we provide)
- No external research or validation
- No price checking or availability
- No real review analysis
- Can't answer: "What do real users say?"

**Current Mix Usage**:
- Session management ✅
- SSE streaming ✅
- Context passing ✅
- Follow-up questions ✅
- BUT: No Search, ReadText, PythonExecution, ShowMedia

---

## Enhancement: Add Autonomous Research

### New Feature: "Research with AI" Mode

**User Flow**:
1. User selects 2-3 products (same as current)
2. TWO buttons appear:
   - "Compare Specs" (existing fast comparison)
   - "Research with AI" (NEW autonomous research)
3. User clicks "Research with AI"
4. Sidebar shows real-time research process:
   - 🔍 Searching web for MacBook Pro M3 reviews...
   - 📖 Reading TechRadar review...
   - 📖 Reading CNET review...
   - 📖 Reading The Verge review...
   - 🔍 Searching for Dell XPS 15 reviews...
   - 📖 Reading PCMag review...
   - 📊 Analyzing sentiment across 8 sources...
   - 📈 Generating comparison charts...
5. Results include:
   - Sentiment analysis chart (positive/neutral/negative per product)
   - Expert ratings aggregation (bar chart)
   - Pros/cons extracted from reviews
   - Price trends (if found)
   - Cited recommendations with source links
   - "According to [TechRadar]..." inline citations

---

## Technical Implementation

### Enhanced ComparisonModal

**Add Research Mode Toggle**:
```typescript
<div className="flex gap-2 mb-4">
  <Button
    variant={mode === "specs" ? "default" : "outline"}
    onClick={() => setMode("specs")}
  >
    📊 Compare Specs (Fast)
  </Button>
  <Button
    variant={mode === "research" ? "default" : "outline"}
    onClick={() => setMode("research")}
  >
    🔍 Research with AI (Thorough)
  </Button>
</div>
```

**Two Different Prompts**:

1. **Specs Mode** (current, fast):
```typescript
const prompt = `Compare these laptops based on specs:

${productContext}

Create comparison table, ratings, recommendations.`
```

2. **Research Mode** (NEW, autonomous):
```typescript
const prompt = `Research and compare these products using web sources:

Products:
- ${products.map(p => p.name).join('\n- ')}

Your autonomous workflow:
1. Use Search tool to find professional reviews for each product
2. Use ReadText tool to read 3-5 review articles per product
3. Use PythonExecution to:
   - Extract sentiment (positive/negative/neutral)
   - Aggregate expert ratings
   - Calculate average scores
4. Use ShowMedia to generate:
   - Sentiment comparison chart
   - Expert ratings bar chart
   - Pros/cons comparison
5. Write synthesis with inline citations [1][2][3]

Requirements:
- Every claim must be cited with source number
- Provide source list at end with URLs
- Compare based on REAL user/expert opinions, not just specs

Focus on: performance, value, reliability, user satisfaction.`
```

---

### New Components

**1. ResearchProgress Component**:
Shows real-time research steps
```typescript
<Card className="bg-slate-900/50 border-purple-500/20 p-4">
  <h3 className="text-sm font-semibold text-purple-200 mb-3">
    Research Progress
  </h3>
  <div className="space-y-2">
    {researchSteps.map((step, idx) => (
      <div key={idx} className="flex items-center gap-2">
        {step.status === "complete" && <CheckCircle />}
        {step.status === "in_progress" && <Loader2 className="animate-spin" />}
        {step.status === "pending" && <Circle />}
        <p>{step.icon} {step.label}</p>
        {step.details && <p className="text-xs text-purple-400">{step.details}</p>}
      </div>
    ))}
  </div>
</Card>
```

**Research Steps to Track**:
1. 🔍 Searching for reviews
2. 📖 Reading sources (show count)
3. 📊 Analyzing sentiment
4. 📈 Generating visualizations
5. ✍️ Writing synthesis

**2. SourcesList Component**:
Shows all sources read by AI
```typescript
<Card className="bg-slate-900/50 border-purple-500/20 p-4">
  <h3 className="text-sm font-semibold text-purple-200 mb-3">
    Sources ({sources.length})
  </h3>
  <div className="space-y-2">
    {sources.map((source, idx) => (
      <div key={idx} className="flex items-start gap-2">
        <Badge variant="secondary" className="text-xs">{idx + 1}</Badge>
        <div className="flex-1">
          <a
            href={source.url}
            target="_blank"
            rel="noopener"
            className="text-purple-300 hover:text-purple-200 flex items-center gap-1"
          >
            {source.title}
            <ExternalLink className="w-3 h-3" />
          </a>
          {source.status === "reading" && (
            <p className="text-xs text-purple-400 mt-1">Reading...</p>
          )}
        </div>
      </div>
    ))}
  </div>
</Card>
```

**3. ChartsDisplay Component**:
Shows AI-generated visualizations
```typescript
{charts.length > 0 && (
  <Card className="bg-slate-900/50 border-purple-500/20 p-4">
    <h3 className="text-sm font-semibold text-purple-200 mb-3">
      Analysis & Visualizations
    </h3>
    <div className="space-y-3">
      {charts.map((chartUrl, idx) => (
        <div key={idx}>
          <p className="text-xs text-slate-400 mb-1">{chartTitles[idx]}</p>
          <img
            src={chartUrl}
            alt={`Chart ${idx + 1}`}
            className="w-full rounded-lg border border-purple-500/20"
          />
        </div>
      ))}
    </div>
  </Card>
)}
```

---

### Tool Tracking Implementation

```typescript
function handleToolUse(tool: any) {
  if (tool.name === "Search") {
    updateStepStatus("🔍", "in_progress")
    const query = tool.input?.query || ""
    updateStepDetails("🔍", `Searching: "${query}"`)

    // Mark as complete after delay
    setTimeout(() => updateStepStatus("🔍", "complete"), 1000)
  }

  if (tool.name === "ReadText") {
    updateStepStatus("📖", "in_progress")
    const url = tool.input?.url || ""
    const domain = new URL(url).hostname.replace("www.", "")

    // Add to sources list
    setSources(prev => [...prev, {
      url,
      title: domain,
      status: "reading"
    }])

    // Mark source as complete
    setTimeout(() => {
      setSources(prev =>
        prev.map(s => s.url === url ? { ...s, status: "complete" } : s)
      )
    }, 2000)
  }

  if (tool.name === "PythonExecution") {
    updateStepStatus("📊", "in_progress")
    const code = tool.input?.code || tool.input || ""

    if (code.includes("sentiment")) {
      updateStepDetails("📊", "Analyzing sentiment...")
    }
    if (code.includes("matplotlib") || code.includes("plt.")) {
      updateStepStatus("📈", "in_progress")
      updateStepDetails("📈", "Creating comparison charts...")
    }

    setTimeout(() => updateStepStatus("📊", "complete"), 1500)
  }

  if (tool.name === "ShowMedia") {
    updateStepStatus("📈", "complete")
    updateStepStatus("✍️", "in_progress")

    // Extract chart URLs
    const outputs = tool.input?.outputs || []
    const chartUrls = outputs
      .filter(o => o.type === "image")
      .map(o => o.url)

    setCharts(prev => [...prev, ...chartUrls])
  }
}
```

---

## Comparison: Specs Mode vs Research Mode

| Feature | Specs Mode (Current) | Research Mode (NEW) |
|---------|---------------------|---------------------|
| **Speed** | Fast (5-10 seconds) | Thorough (30-60 seconds) |
| **Data Source** | Local product specs | Web reviews + specs |
| **Citations** | None | Every claim cited |
| **Sentiment** | N/A | Sentiment analysis from reviews |
| **Expert Ratings** | N/A | Aggregated from sources |
| **Charts** | ASCII bars | Real matplotlib charts |
| **Trust Level** | Specs-based | Evidence-based |

**When to Use Each**:
- **Specs Mode**: Quick spec comparison, already know products
- **Research Mode**: Want expert/user opinions, fact-checking, thorough research

---

## UI Changes Needed

### 1. ProductGrid.tsx
**Current**: One "Compare" button
**New**: Two buttons (or dropdown)

```typescript
<div className="flex gap-2">
  <Button
    onClick={() => handleCompare("specs")}
    disabled={selected.length < 2}
    variant="outline"
  >
    📊 Compare Specs
  </Button>
  <Button
    onClick={() => handleCompare("research")}
    disabled={selected.length < 2}
    className="bg-gradient-to-r from-purple-600 to-fuchsia-600"
  >
    🔍 Research with AI
  </Button>
</div>
```

### 2. ComparisonModal.tsx
**Additions**:
- Mode toggle (specs vs research)
- Research progress component
- Sources list component
- Charts display component
- Completion badge with stats

**Layout**:
```
┌─────────────────────────────────┐
│ Header: Product Names            │
│ [Specs Mode] [Research Mode]     │
├─────────────────────────────────┤
│                                  │
│ Research Progress (if research)  │
│ ✅ Searched web                   │
│ ✅ Read 8 sources                 │
│ ⏳ Analyzing sentiment...         │
│                                  │
│ Sources (8)                      │
│ [1] TechRadar: MacBook Review    │
│ [2] CNET: Is M3 Worth It?        │
│ ...                              │
│                                  │
│ Charts                           │
│ [Sentiment Chart]                │
│ [Expert Ratings]                 │
│                                  │
│ Analysis (with citations)        │
│ According to TechRadar [1]...    │
│                                  │
│ Completion Badge                 │
│ ✅ Researched 8 sources,          │
│    analyzed sentiment,           │
│    generated 2 charts            │
│                                  │
├─────────────────────────────────┤
│ Follow-up Input                  │
└─────────────────────────────────┘
```

---

## Development Plan

### Phase 1: Add Research Mode (4 hours)
1. Add mode toggle to ComparisonModal
2. Create research-specific prompt
3. Implement tool tracking (Search, ReadText, PythonExecution, ShowMedia)
4. Add ResearchProgress component
5. Test with 2 products

### Phase 2: Add Source Tracking (2 hours)
1. Create SourcesList component
2. Track URLs from ReadText events
3. Display sources with numbers
4. Link citations [1][2] to source URLs

### Phase 3: Add Visualizations (2 hours)
1. Create ChartsDisplay component
2. Handle ShowMedia events
3. Display generated charts inline
4. Add chart titles/descriptions

### Phase 4: Polish & Test (2 hours)
1. Completion badge with stats
2. Error handling (no sources found)
3. Mobile responsive design
4. Test with all product combinations
5. Update README

**Total**: 10 hours

---

## Example Research Output

**User selects**: MacBook Pro M3, Dell XPS 15

**AI Research Process** (visible to user):
```
🔍 Searching for MacBook Pro M3 reviews...
📖 Reading TechRadar: MacBook Pro M3 Review (2024)
📖 Reading CNET: Is the MacBook Pro M3 Worth It?
📖 Reading The Verge: MacBook Pro M3 Long-term Review
🔍 Searching for Dell XPS 15 reviews...
📖 Reading PCMag: Dell XPS 15 Review
📖 Reading Tom's Hardware: Dell XPS 15 Analysis
📖 Reading LaptopMag: Dell XPS 15 Tested
📊 Analyzing sentiment across 6 sources...
📈 Generating comparison charts...
✍️ Writing synthesis with citations...
```

**AI Output** (in modal):

**Sentiment Analysis Chart**:
```
MacBook Pro M3:  ████████░░ 82% Positive
Dell XPS 15:     ██████░░░░ 65% Positive
```

**Expert Ratings** (aggregated):
```
MacBook Pro M3:  4.5/5 (3 reviews)
Dell XPS 15:     4.2/5 (3 reviews)
```

**Analysis**:
> Based on 6 professional reviews, the MacBook Pro M3 receives consistently higher praise for its performance and battery life [1][2][3]. TechRadar notes "exceptional M3 chip performance for creative work" [1], while CNET highlights "industry-leading 18-hour battery life" [2].
>
> The Dell XPS 15 is praised for its display quality and value [4][5], with PCMag calling it "the best Windows laptop for productivity" [4]. However, Tom's Hardware notes "thermal throttling under sustained load" [5].
>
> **For video editing**: MacBook Pro M3 (unanimous recommendation [1][2][3])
> **For gaming**: Dell XPS 15 (better GPU options [4][6])
> **For value**: Dell XPS 15 ($400 less for similar specs [4])

**Sources**:
1. [TechRadar: MacBook Pro M3 Review](https://techradar.com/...)
2. [CNET: Is the MacBook Pro M3 Worth It?](https://cnet.com/...)
3. [The Verge: MacBook Pro M3 Long-term Review](https://theverge.com/...)
4. [PCMag: Dell XPS 15 Review](https://pcmag.com/...)
5. [Tom's Hardware: Dell XPS 15 Analysis](https://tomshardware.com/...)
6. [LaptopMag: Dell XPS 15 Tested](https://laptopmag.com/...)

---

## Success Criteria

✅ Two modes: Fast specs comparison + Thorough research
✅ Real-time visibility: Shows AI searching, reading sources
✅ Source tracking: Displays all URLs AI read
✅ Citations: Every claim linked to source [1][2][3]
✅ Visualizations: Sentiment charts, ratings graphs
✅ Tool usage: Search + ReadText + PythonExecution + ShowMedia
✅ Completion stats: "Researched 8 sources, generated 2 charts"
✅ Impossible with OpenAI alone (requires autonomous web search)

---

## Key Messaging

**For Developers**:
- "Added autonomous research to shopping-app in 10 hours"
- "AI searches 8 sources, analyzes sentiment, generates charts"
- "Every claim cited - solves AI hallucination problem"

**For Users**:
- "Research Mode: AI reads reviews for you"
- "See what real experts say, not just specs"
- "Every recommendation backed by sources"

**Marketing Angle**:
- **Before**: Compare specs (anyone can do this)
- **After**: AI researches web, reads reviews, provides cited analysis (ONLY Mix can do this)

---

## Files to Modify

1. `examples/shopping-app/src/components/ProductGrid.tsx`
   - Add two buttons (specs mode + research mode)
   - Pass mode to ComparisonModal

2. `examples/shopping-app/src/components/ComparisonModal.tsx`
   - Add mode toggle at top
   - Add ResearchProgress component
   - Add SourcesList component
   - Add ChartsDisplay component
   - Implement tool tracking logic
   - Update prompt based on mode

3. `examples/shopping-app/README.md`
   - Document research mode
   - Show example with citations
   - Explain autonomous workflow

4. Create new components:
   - `src/components/ResearchProgress.tsx`
   - `src/components/SourcesList.tsx`
   - `src/components/ChartsDisplay.tsx`

---

## Why This Enhancement Matters

**Current shopping-app**:
- ✅ Good: Shows integration pattern
- ❌ Limitation: Uses only local data (like ChatGPT)
- ❌ Missing: Autonomous tool use (Search, ReadText, Python, ShowMedia)

**Enhanced shopping-app**:
- ✅ Shows complete autonomous workflow
- ✅ Demonstrates ALL Mix tools in one example
- ✅ Solves real problem: "Is AI making this up?"
- ✅ Clear value prop: Cited, evidence-based recommendations

This makes shopping-app our **flagship integration example** that showcases everything Mix can do.
