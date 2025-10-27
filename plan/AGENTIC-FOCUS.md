# Mix SDK: Agentic Capabilities Focus Plan

## The Problem with Current Examples

**What we built:** Chat completion with product data
**What anyone could do:** Use OpenAI API with same data
**What we're missing:** Showcasing Mix's autonomous, agentic capabilities

## Core Insight: Mix is NOT an API Wrapper

Mix SDK provides:
- ✅ **14 built-in tools** for autonomous action
- ✅ **Multi-step autonomous workflows**
- ✅ **Code execution** (Python, Bash)
- ✅ **Web search** (Brave API)
- ✅ **Media analysis** (images, video, PDFs)
- ✅ **Visualization generation** (ShowMedia)
- ✅ **Multi-model routing** (Claude/Gemini/GPT)

**This is what we need to showcase!**

---

## New Example Strategy

Every example MUST demonstrate:
1. **Autonomous tool use** - AI decides what tools to use
2. **Multi-step workflows** - AI breaks down complex tasks
3. **Self-directed research** - AI searches/analyzes without hand-holding
4. **Visualization creation** - AI generates charts/graphs
5. **Code execution** - AI writes and runs analysis code

---

## Example 1: Smart Product Research Agent

### What Makes It Agentic

**User:** "Compare these 3 laptops and help me decide"

**AI Autonomously:**
1. **Search** tool → Finds professional reviews for each laptop
2. **ReadText** tool → Reads multiple review articles
3. **PythonExecution** → Analyzes sentiment and extract ratings
4. **PythonExecution** → Generates comparison data
5. **ShowMedia** → Creates comparison charts (performance, price, ratings)
6. **Content** → Synthesizes recommendations

### Key Difference from Current Example

```typescript
// ❌ What we built (not agentic)
const context = `
Product 1: MacBook Pro M3, $1999
Product 2: Dell XPS 15, $1599
...
`
await send(`Compare: ${context}`)
// AI only analyzes what YOU provide

// ✅ Agentic approach
await send("Compare MacBook Pro M3 vs Dell XPS 15 vs ThinkPad X1")
// AI autonomously:
// - Searches for reviews
// - Reads professional opinions
// - Analyzes sentiment across sources
// - Generates comparison charts
// - Provides evidence-based recommendations
```

### User Flow

1. User enters 2-3 product names (just names, no specs!)
2. Sidebar opens showing "AI is researching..."
3. **Real-time tool visibility:**
   - 🔍 Searching for "MacBook Pro M3 reviews"
   - 📖 Reading TechRadar review
   - 📖 Reading CNET review
   - 🔍 Searching for "Dell XPS 15 reviews"
   - 📊 Analyzing 12 reviews
   - 📈 Generating comparison charts
4. AI presents:
   - Sentiment analysis chart
   - Price/performance scatter plot
   - Rating comparison bar chart
   - Evidence-based recommendation with sources

### Code Pattern

```typescript
await sendWithCallbacks(mix, sessionId,
  "Research and compare: MacBook Pro M3, Dell XPS 15, ThinkPad X1 Carbon",
  {
    onTool: (tool) => {
      // Show what AI is doing
      if (tool.name === "Search") {
        showStatus(`🔍 Searching: ${tool.input.query}`);
      }
      if (tool.name === "ReadText") {
        showStatus(`📖 Reading: ${tool.input.url}`);
      }
      if (tool.name === "PythonExecution") {
        showStatus("📊 Analyzing data...");
      }
      if (tool.name === "ShowMedia") {
        displayCharts(tool.input.outputs);
      }
    },
    onContent: (text) => updateComparison(text)
  }
);
```

### What User Sees

```
🔍 Searching for MacBook Pro M3 reviews...
📖 Reading TechRadar: MacBook Pro M3 Review
📖 Reading CNET: Is the M3 MacBook Pro worth it?
🔍 Searching for Dell XPS 15 reviews...
📖 Reading PCMag: Dell XPS 15 Review
📊 Analyzing 8 professional reviews...
📈 Generating comparison charts...

[Chart 1: Sentiment Analysis]
[Chart 2: Price vs Performance]
[Chart 3: Expert Ratings]

Based on 8 professional reviews:
- MacBook Pro M3: Best for video editing (avg: 4.5/5)
- Dell XPS 15: Best value for performance (avg: 4.2/5)
- ThinkPad X1: Best for business/travel (avg: 4.3/5)

Sources: [TechRadar] [CNET] [PCMag] [...]
```

**This is AGENTIC!**

---

## Example 2: Visual Product Analyzer

### What Makes It Agentic

**User:** Uploads 3 product images

**AI Autonomously:**
1. **ReadMedia** → Analyzes each product image
2. **ReadMedia** → Extracts visible specifications
3. **Search** → Finds official specs for identified products
4. **PythonExecution** → Compares extracted vs official specs
5. **ShowMedia** → Creates visual comparison overlay
6. **Content** → Explains differences

### User Flow

1. User uploads product images (phone cameras, screenshots, etc.)
2. AI shows: "Analyzing images..."
3. **Tool usage visible:**
   - 📸 Analyzing image 1/3
   - 🔍 Identified: MacBook Pro M3
   - 🌐 Searching for official specs
   - 📸 Analyzing image 2/3
   - 🔍 Identified: Dell XPS 15
   - 📊 Comparing specifications
4. AI presents:
   - Side-by-side annotated images
   - Spec extraction confidence scores
   - Official vs observed differences
   - Recommendations based on visual analysis

### Code Pattern

```typescript
const files = await Promise.all(
  images.map(img => mix.files.upload({ id: sessionId, file: img }))
);

await sendWithCallbacks(mix, sessionId,
  `Analyze these product images and compare: ${files.map(f => `@${f.url}`).join(' ')}`,
  {
    onTool: (tool) => {
      if (tool.name === "ReadMedia") {
        showStatus(`📸 Analyzing ${tool.input.file_path}`);
      }
      if (tool.name === "Search") {
        showStatus(`🌐 Searching: ${tool.input.query}`);
      }
    }
  }
);
```

**This showcases ReadMedia + Search + autonomous workflow!**

---

## Example 3: Recipe Nutrition Analyzer

### What Makes It Agentic

**User:** "Find healthy pasta recipes under 500 calories"

**AI Autonomously:**
1. **Search** → Finds 5-10 pasta recipes
2. **ReadText** → Extracts ingredients from each recipe
3. **PythonExecution** → Calculates nutrition using USDA database
4. **PythonExecution** → Filters recipes < 500 cal
5. **ShowMedia** → Creates nutrition comparison chart
6. **ShowMedia** → Generates macro distribution pie charts
7. **Content** → Recommends top 3 with rationale

### User Flow

1. User enters dietary requirements
2. AI shows research process:
   - 🔍 Searching for healthy pasta recipes
   - 📖 Reading AllRecipes: Whole Wheat Pasta Primavera
   - 📖 Reading Tasty: Low-Cal Aglio e Olio
   - 🧮 Calculating nutrition for 8 recipes
   - 📊 Creating comparison charts
3. AI presents:
   - Nutrition comparison table (auto-generated)
   - Calorie distribution chart
   - Macro breakdown (protein/carbs/fat)
   - Top 3 recommendations with prep time

### Code Pattern

```typescript
await sendWithCallbacks(mix, sessionId,
  "Find and analyze healthy pasta recipes under 500 calories",
  {
    onTool: (tool) => {
      if (tool.name === "Search") {
        showStatus(`🔍 ${tool.input.query}`);
      }
      if (tool.name === "PythonExecution") {
        showStatus("🧮 Calculating nutrition...");
      }
      if (tool.name === "ShowMedia") {
        displayCharts(tool.input.outputs);
      }
    }
  }
);
```

**This showcases Search + PythonExecution + ShowMedia!**

---

## Example 4: Video Product Demo Analyzer

### What Makes It Agentic

**User:** "Analyze the iPhone 16 Pro keynote and extract key features"

**AI Autonomously:**
1. **Search** → Finds iPhone 16 Pro keynote video
2. **ReadMedia** → Analyzes video content
3. **ReadMedia** → Identifies key moments (features discussed)
4. **Bash** → Downloads video segments
5. **PythonExecution** → Creates timestamp index
6. **ShowMedia** → Displays video clips with feature annotations
7. **Content** → Summarizes features with timestamps

### User Flow

1. User enters product + "keynote" or "demo"
2. AI shows:
   - 🔍 Finding iPhone 16 Pro keynote
   - 🎥 Analyzing 45-minute video
   - 🎯 Identified 8 key features
   - ⬇️ Downloading feature segments
   - 📹 Creating annotated clips
3. AI presents:
   - 8 short clips (10-20s each) showing features
   - Timestamp index for full video
   - Feature summary with visual evidence
   - Comparison with previous model

### Code Pattern

```typescript
await sendWithCallbacks(mix, sessionId,
  "Find and analyze the iPhone 16 Pro keynote video, extract key features",
  {
    onTool: (tool) => {
      if (tool.name === "Search") {
        showStatus(`🔍 Finding keynote video`);
      }
      if (tool.name === "ReadMedia") {
        showStatus(`🎥 Analyzing video`);
      }
      if (tool.name === "Bash") {
        showStatus(`⬇️ Downloading segments`);
      }
    }
  }
);
```

**This showcases Search + ReadMedia (video) + Bash + multi-step!**

---

## Example 5: Travel Planning with Research

### What Makes It Agentic

**User:** "Plan a 3-day trip to Tokyo in March"

**AI Autonomously:**
1. **Search** → Weather in Tokyo in March
2. **Search** → Top attractions in Tokyo
3. **ReadText** → Reads travel guides
4. **Search** → Restaurant recommendations
5. **PythonExecution** → Creates day-by-day itinerary
6. **ShowMedia** → Generates timeline visualization
7. **ShowMedia** → Creates budget breakdown chart
8. **Content** → Detailed plan with reasoning

### User Flow

1. User enters destination and duration
2. AI shows:
   - 🌤️ Checking weather for Tokyo in March
   - 🗼 Researching top attractions
   - 🍜 Finding restaurant recommendations
   - 📅 Creating 3-day itinerary
   - 💰 Calculating budget
   - 📊 Generating visualizations
3. AI presents:
   - Day-by-day timeline (visual)
   - Budget breakdown chart
   - Map with route planning
   - Weather-appropriate recommendations

**This showcases Search + PythonExecution + ShowMedia for planning!**

---

## Example 6: Data Analysis from Scratch

### What Makes It Agentic

**User:** Uploads sales CSV - "Find insights"

**AI Autonomously:**
1. **ReadText** → Loads CSV
2. **PythonExecution** → `df.info()` to understand structure
3. **PythonExecution** → Cleans data (handles nulls, types)
4. **PythonExecution** → Calculates key metrics
5. **PythonExecution** → Generates 4-5 matplotlib charts
6. **ShowMedia** → Displays all charts
7. **Content** → Explains insights

### User Flow

1. User uploads CSV
2. AI shows:
   - 📊 Loading sales_data.csv
   - 🔍 Analyzing structure (500 rows, 8 columns)
   - 🧹 Cleaning data (3% missing values handled)
   - 📈 Calculating metrics
   - 📊 Generating visualizations
   - 🎯 Identifying key insights
3. AI presents:
   - 5 auto-generated charts (sales trends, top products, etc.)
   - Key metrics highlighted
   - Actionable insights
   - Anomaly detection

### Code Pattern

```typescript
const file = await mix.files.upload({ id: sessionId, file: csvFile });

await sendWithCallbacks(mix, sessionId,
  `Analyze @${file.url} and find key insights`,
  {
    onTool: (tool) => {
      if (tool.name === "PythonExecution") {
        showStatus("📊 Running analysis...");
      }
      if (tool.name === "ShowMedia") {
        // Auto-display charts as they're generated
        displayCharts(tool.input.outputs);
      }
    }
  }
);
```

**This is the portfolio-analyzer pattern - already agentic!**

---

## Core Patterns to Emphasize

### Pattern 1: Multi-Step Research

```typescript
// User gives high-level task
await send("Research the best laptops for video editing under $2000");

// AI autonomously:
// 1. Search for "best laptops video editing 2024"
// 2. ReadText on 5-10 articles
// 3. Extract product names and specs
// 4. Search for pricing
// 5. PythonExecution to analyze/filter
// 6. ShowMedia to visualize results
// 7. Synthesize recommendation

// YOU wrote zero research/analysis code!
```

### Pattern 2: Visual Analysis

```typescript
// User uploads images
await send(`Compare products in these images: ${files.join(' ')}`);

// AI autonomously:
// 1. ReadMedia on each image
// 2. Identifies products
// 3. Search for official specs
// 4. PythonExecution to compare
// 5. ShowMedia for visual comparison
// 6. Explains differences

// YOU wrote zero image analysis code!
```

### Pattern 3: Data Analysis

```typescript
// User uploads CSV
await send("Analyze this data and find insights");

// AI autonomously:
// 1. ReadText to load CSV
// 2. PythonExecution (pandas) to explore
// 3. PythonExecution to clean data
// 4. PythonExecution (matplotlib) to visualize
// 5. ShowMedia to display charts
// 6. Explains findings

// YOU wrote zero pandas/matplotlib code!
```

### Pattern 4: Content Creation

```typescript
// User gives creative task
await send("Find the top cat video and create a 5-sec TikTok clip");

// AI autonomously:
// 1. Search for "top cat videos 2024"
// 2. ReadMedia to analyze videos
// 3. Bash to download best video
// 4. PythonExecution (ffmpeg) to clip
// 5. PythonExecution to add effects
// 6. ShowMedia to display result

// YOU wrote zero video editing code!
```

---

## Social Media Messaging (Revised)

### Before (What We Had)

> "I added AI product comparison to an e-commerce site in 15 lines of code"

**Problem:** Anyone can do this with OpenAI API

### After (Agentic Focus)

> "I built a product research agent that autonomously:
> - 🔍 Searches the web for reviews
> - 📖 Analyzes 10+ articles
> - 📊 Generates comparison charts
> - 💡 Provides evidence-based recommendations
>
> 15 lines of code. Zero analysis code written.
>
> This is what agentic AI looks like."

**Key difference:** Emphasize AUTONOMY and TOOL USE

---

## Revised Example Priorities

### High Priority (Showcase Agentic)

1. **Smart Product Research** - Search + ReadText + PythonExecution + ShowMedia
2. **Data Analysis Agent** - ReadText + PythonExecution + ShowMedia (charts!)
3. **Recipe Nutrition Analyzer** - Search + PythonExecution + ShowMedia
4. **Visual Product Analyzer** - ReadMedia + Search + comparison

### Medium Priority

5. **Travel Planner** - Search + PythonExecution + ShowMedia (itinerary)
6. **Video Analyzer** - Search + ReadMedia (video) + Bash + clips

### Lower Priority (Less Agentic)

7. **Chat completion** - This is what we built, but it's not agentic

---

## Implementation Strategy

### Phase 1: Pick ONE Agentic Example

**Recommendation: Data Analysis Agent (portfolio-analyzer pattern)**

Why:
- ✅ Already exists in Mix examples
- ✅ Clearly shows PythonExecution autonomy
- ✅ ShowMedia charts are impressive
- ✅ Anyone can test with their own CSV
- ✅ Demonstrates code the user didn't write

**Modify existing portfolio-analyzer to:**
- Show tool usage in real-time
- Emphasize "AI wrote all the analysis code"
- Display charts as they're generated
- Add follow-up analysis questions

### Phase 2: Add Smart Product Research

**New example showing:**
- AI autonomously searches web
- AI reads multiple sources
- AI analyzes sentiment
- AI generates comparison charts
- User provides only product names

### Phase 3: Add Visual Analyzer

**New example showing:**
- Upload product images
- AI identifies products
- AI searches for official specs
- AI compares visual vs official
- User writes zero image analysis code

---

## Key Messaging Points

### What to Emphasize

1. **"AI decides what tools to use"**
   - Not: "I configured tools"
   - Yes: "AI autonomously chose to search the web"

2. **"Zero analysis code written"**
   - Not: "AI helped me write code"
   - Yes: "AI wrote and ran all the analysis code itself"

3. **"Multi-step autonomous workflow"**
   - Not: "AI responded to my prompt"
   - Yes: "AI broke down the task and executed 7 steps autonomously"

4. **"Evidence-based with sources"**
   - Not: "AI gave an opinion"
   - Yes: "AI researched 10 sources and synthesized findings"

5. **"Visualization generation"**
   - Not: "I displayed AI's text response"
   - Yes: "AI generated 4 charts using ShowMedia"

### What NOT to Say

❌ "Chat with AI about products"
❌ "AI-powered product descriptions"
❌ "Get AI recommendations"
❌ "Conversational interface"

### What TO Say

✅ "AI autonomously researches products"
✅ "AI writes and runs analysis code"
✅ "AI generates comparison visualizations"
✅ "AI conducts multi-step research workflows"
✅ "Zero analysis code written by developer"

---

## Example Code Snippet (Agentic)

```typescript
// This is what you write:
const mix = new Mix({ serverURL: "http://localhost:8088" });
const session = await mix.sessions.create();

await sendWithCallbacks(mix, session.id,
  "Research MacBook Pro M3 vs Dell XPS 15, generate comparison charts",
  {
    onTool: (tool) => console.log(`AI using: ${tool.name}`),
    onContent: updateUI
  }
);

// This is what AI does autonomously:
// 1. Search("MacBook Pro M3 reviews")
// 2. ReadText(techradar.com/review)
// 3. ReadText(cnet.com/review)
// 4. Search("Dell XPS 15 reviews")
// 5. ReadText(pcmag.com/review)
// 6. PythonExecution(sentiment analysis code)
// 7. PythonExecution(matplotlib chart code)
// 8. ShowMedia(comparison_chart.png)
// 9. Content(synthesis with sources)

// YOU wrote: 10 lines
// AI wrote: 50+ lines of analysis code
// AI executed: 9 autonomous steps
```

---

## Success Metrics

### Agentic vs Non-Agentic

| Metric | Non-Agentic (Current) | Agentic (Goal) |
|--------|---------------------|---------------|
| **User code** | 100 lines | 15 lines |
| **AI-generated code** | 0 lines | 50+ lines |
| **Tools used** | 0 | 5-7 tools |
| **Autonomous steps** | 1 (text gen) | 5-10 steps |
| **Research sources** | 0 (user provides) | 5-10 sources |
| **Visualizations** | 0 | 3-5 charts |
| **"I could do this with OpenAI API"** | Yes | No |

---

## Next Steps

1. ✅ **Acknowledge current examples aren't agentic**
2. ✅ **Create this plan focused on autonomous capabilities**
3. ⏭️ **Rewrite shopping-app OR build data-analysis-agent**
4. ⏭️ **Emphasize tool usage visibility in UI**
5. ⏭️ **Update social media templates to focus on autonomy**
6. ⏭️ **Create comparison: "With OpenAI API vs With Mix SDK"**

---

## The Core Difference

### OpenAI API (Text Generation)
```
User: "Compare these laptops: [specs]"
AI: "Here's a comparison..."
```
**You provide everything. AI generates text.**

### Mix SDK (Agentic)
```
User: "Compare MacBook Pro M3 vs Dell XPS 15"
AI:
  → Searches web for reviews
  → Reads 8 professional reviews
  → Analyzes sentiment across sources
  → Generates comparison charts
  → Provides evidence-based recommendation
```
**You provide task. AI autonomously executes multi-step workflow with tools.**

**THIS is what we need to showcase!**
