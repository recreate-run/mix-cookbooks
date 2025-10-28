# Example 2: Admin Panel + Data Intelligence (Day 3-4)

## Overview

**Goal**: Add AI data analysis to typical CRUD admin dashboard

**What Makes It Agentic**:
- AI writes pandas/matplotlib code autonomously (PythonExecution)
- AI decides what analysis to run based on data structure
- Shows code AI generated in real-time
- Users see "You wrote 0 lines" value proposition

---

## The Webapp: Admin Dashboard

**Existing Features**:
- Data tables (users, orders, products, analytics)
- CSV export/import
- Basic filters and sorting
- Static charts (pre-configured)

**Problem**:
- Admins need custom analysis but don't know pandas
- Static dashboards don't answer ad-hoc questions
- Exporting to Excel for analysis is tedious
- No way to explore data freely

---

## AI Integration Features

### Feature 1: CSV Intelligence
**User Flow**:
1. Admin uploads CSV file (sales data, user metrics, etc.)
2. "Analyze with AI" button triggers analysis
3. Modal shows:
   - 📊 AI loading data...
   - 🧹 AI cleaning data (handling nulls)...
   - 📈 AI generating 5 visualizations...
   - 💡 AI identifying key insights...
4. Results: Charts + insights + generated Python code (collapsible)
5. Admin can ask follow-ups: "Show me outliers", "Compare Q1 vs Q2"

**Mix Tools**:
- `ReadText` - Load CSV data
- `PythonExecution` - pandas analysis, matplotlib charts (AI writes ALL code)
- `ShowMedia` - Display generated charts
- Tool visibility showing each step

**UI**: Data upload zone + analysis modal with code viewer

---

### Feature 2: Anomaly Explanation
**User Flow**:
1. Admin sees metric drop in dashboard: "Signups down 40% this week"
2. Clicks "Explain with AI"
3. Modal shows:
   - 🔍 AI analyzing signup data...
   - 📊 AI comparing to historical trends...
   - 🔎 AI checking for patterns...
4. Results: Root cause analysis + supporting charts + recommendations

**Mix Tools**:
- `ReadText` - Load time-series data
- `PythonExecution` - Statistical analysis, anomaly detection algorithms
- `ShowMedia` - Trend charts, comparison visualizations

**UI**: Metric card with "Explain" button → analysis modal

---

### Feature 3: Natural Language Queries
**User Flow**:
1. Admin types: "Show me users who signed up in Q4 but never converted"
2. AI writes pandas query code
3. Results table appears with matching users
4. Admin can export or ask follow-up: "Why didn't they convert?"

**Mix Tools**:
- `PythonExecution` - Write and execute pandas/SQL query
- Show generated code so admin can learn

**UI**: Search bar with "Ask AI" mode toggle

---

### Feature 4: Smart Report Generation
**User Flow**:
1. Admin: "Create monthly business review for November"
2. AI autonomously:
   - Loads relevant data (sales, users, revenue)
   - Calculates key metrics (MoM growth, retention, churn)
   - Generates 5-8 visualizations
   - Writes executive summary
3. Results: Full report with charts, ready to share

**Mix Tools**:
- `ReadText` - Load multiple data sources
- `PythonExecution` - Calculate metrics, create visualizations
- `ShowMedia` - Display report charts

**UI**: "Generate Report" button → report builder modal

---

## Technical Implementation

### Project Structure
```
admin-data-intelligence/
├── src/
│   ├── routes/
│   │   ├── index.tsx              # Dashboard overview
│   │   ├── data.tsx               # Data tables page
│   │   └── api/
│   │       ├── session.ts
│   │       ├── stream.$sessionId.ts
│   │       └── upload-csv.ts
│   ├── components/
│   │   ├── DataUploadZone.tsx     # CSV upload with drag-drop
│   │   ├── AnalysisModal.tsx      # Shows AI analysis process
│   │   ├── CodeViewer.tsx         # Displays AI-generated code
│   │   ├── MetricCard.tsx         # Dashboard metric with "Explain" button
│   │   └── ChartDisplay.tsx       # Renders AI-generated charts
│   ├── lib/
│   │   ├── mix-client.ts
│   │   └── mock-data.ts           # Sample datasets
├── sample-data/
│   ├── sales_2024.csv
│   ├── user_signups.csv
│   └── product_analytics.csv
└── README.md
```

---

## Sample Datasets

Include 3 realistic CSV files:

**1. sales_2024.csv** (500 rows):
- Columns: date, product_id, category, quantity, revenue, region
- Realistic sales patterns with seasonality
- Some anomalies (sudden drops/spikes)

**2. user_signups.csv** (300 rows):
- Columns: signup_date, user_id, source, plan, converted, days_to_convert
- Conversion funnel data
- Churned users identifiable

**3. product_analytics.csv** (200 rows):
- Columns: product_name, views, clicks, purchases, rating, reviews_count
- E-commerce metrics
- Clear winners and losers

---

## Feature Implementation Details

### 1. CSV Intelligence

**API Prompt**:
```typescript
const prompt = `Autonomously analyze this CSV file:

@${fileUrl}

Your workflow:
1. Load CSV with pandas
2. Explore structure (df.info(), df.describe())
3. Clean data (handle nulls, fix types)
4. Identify key patterns and trends
5. Generate 4-5 meaningful visualizations (matplotlib)
6. Provide actionable insights

Show your work - display the Python code you write.`
```

**Real-Time Tool Visibility**:
```typescript
onTool: (tool) => {
  if (tool.name === "ReadText") {
    addStep({ icon: "📊", label: "Loading CSV file", status: "in_progress" })
  }
  if (tool.name === "PythonExecution") {
    const code = tool.input.code || tool.input

    if (code.includes("pd.read_csv")) {
      updateStep("📊", "complete")
      addStep({ icon: "🔍", label: "Analyzing structure", status: "in_progress" })
    }
    if (code.includes("dropna") || code.includes("fillna")) {
      updateStep("🔍", "complete")
      addStep({ icon: "🧹", label: "Cleaning data", status: "in_progress" })
    }
    if (code.includes("matplotlib") || code.includes("plt.")) {
      updateStep("🧹", "complete")
      addStep({ icon: "📊", label: "Generating visualizations", status: "in_progress" })
    }

    // Store code for display
    addCodeBlock({ language: "python", code })
  }
  if (tool.name === "ShowMedia") {
    updateStep("📊", "complete")
    addStep({ icon: "✅", label: "Analysis complete", status: "complete" })
  }
}
```

**Code Viewer Component**:
```typescript
<Collapsible>
  <CollapsibleTrigger>
    <Code className="w-4 h-4" />
    View AI-Generated Code ({codeBlocks.length} files)
  </CollapsibleTrigger>
  <CollapsibleContent>
    {codeBlocks.map((block, idx) => (
      <Card key={idx} className="bg-slate-950">
        <pre><code>{block.code}</code></pre>
        <Button onClick={() => copyCode(block.code)}>
          <Copy /> Copy
        </Button>
      </Card>
    ))}
    <Badge className="mt-2">
      ⭐ You wrote 0 lines. AI wrote {totalLines} lines.
    </Badge>
  </CollapsibleContent>
</Collapsible>
```

---

### 2. Anomaly Explanation

**API Prompt for Metric Drop**:
```typescript
const prompt = `Explain this anomaly:

Metric: User Signups
Current: 120 signups this week
Previous: 200 signups last week
Change: -40%

Dataset: @${signupDataUrl}

Autonomously:
1. Load the time-series data
2. Use Python to analyze trends (7-day MA, monthly patterns)
3. Compare to historical data
4. Identify potential causes (seasonal, traffic source changes, etc.)
5. Generate comparison charts
6. Provide 3-5 actionable hypotheses

Use PythonExecution with pandas and matplotlib.`
```

**UI - Metric Card**:
```typescript
<Card className="p-4">
  <div className="flex justify-between items-start">
    <div>
      <p className="text-sm text-slate-400">User Signups</p>
      <p className="text-3xl font-bold">120</p>
      <Badge className="bg-red-900/30 text-red-300">
        ↓ 40% vs last week
      </Badge>
    </div>
    <Button
      onClick={openAnomalyAnalysis}
      variant="outline"
      size="sm"
    >
      <Search className="w-4 h-4 mr-1" />
      Explain
    </Button>
  </div>
</Card>
```

---

### 3. Natural Language Queries

**API Prompt**:
```typescript
const prompt = `Answer this query about the data:

Query: "${userQuery}"
Dataset: @${dataUrl}

Use PythonExecution to:
1. Write pandas code to query the data
2. Execute and get results
3. Format results as a clear table
4. If insights are found, explain them

Return results + the Python code you wrote.`
```

**Follow-Up Pattern**:
```typescript
// User: "Show me users who signed up in Q4 but never converted"
// AI writes: df[(df['signup_date'] >= '2024-10-01') & (df['converted'] == False)]

// User follow-up: "Why didn't they convert?"
// AI: Analyzes converted vs non-converted users, finds patterns
```

---

### 4. Report Generation

**API Prompt**:
```typescript
const prompt = `Generate a business review report for November 2024:

Data sources:
- Sales: @${salesUrl}
- Users: @${usersUrl}
- Products: @${productsUrl}

Create a comprehensive report with:
1. **Key Metrics** - Revenue, signups, conversion rate, MoM growth
2. **Visualizations** (5-8 charts):
   - Revenue trend (line chart)
   - Top products (bar chart)
   - User acquisition sources (pie chart)
   - Conversion funnel (waterfall chart)
   - Regional performance (heatmap)
3. **Insights** - 3-5 bullet points with data-backed observations
4. **Recommendations** - Action items based on data

Use PythonExecution with pandas + matplotlib to create all visualizations.`
```

---

## Development Timeline

**Day 3 (4-6 hours)**:
- Admin dashboard layout (metric cards, data table)
- CSV upload functionality
- Analysis modal UI
- Tool visibility implementation
- Code viewer component

**Day 4 (4-6 hours)**:
- Anomaly explanation feature
- Natural language query UI
- Report generation
- Sample datasets integration
- README + testing

**Total**: 8-12 hours

---

## Success Criteria

✅ CSV upload → AI generates insights + charts automatically
✅ Shows Python code AI wrote (proves "you wrote 0 lines")
✅ Anomaly explanation provides root cause analysis
✅ Natural language queries work ("show me X")
✅ Real-time tool visibility shows AI writing code
✅ Follow-up questions refine analysis
✅ Impossible with just OpenAI (requires code execution)

---

## Key Differentiators

### vs Excel/Google Sheets:
- Excel: Manual analysis, formulas, pivot tables
- Admin AI: Ask in English, get insights instantly

### vs BI Tools (Tableau, Looker):
- BI Tools: Pre-configured dashboards, expensive ($70/user/month)
- Admin AI: Ad-hoc analysis, free with Mix SDK

### vs OpenAI API:
- OpenAI: Suggests pandas code as text
- Admin AI: Writes AND executes code, shows actual results

---

## Code Viewer: Key Messaging

**Emphasis on AI Code Generation**:
```typescript
<Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20">
  <CheckCircle className="text-green-400" />
  <div>
    <p className="font-semibold">Analysis Complete</p>
    <p className="text-sm">
      AI wrote {totalCodeLines} lines of Python code (pandas + matplotlib)
      You wrote 0 lines. 🎉
    </p>
  </div>
</Card>
```

This reinforces the core value prop: **AI writes the implementation.**

---

## Market Validation

**Target Users**: SaaS admins, operations teams, non-technical analysts
**Market Size**: Every SaaS product has an admin dashboard
**Current Pain**: Need data scientist ($120K/year) or manual Excel work

**Existing Solutions**:
- Hire data analyst: Expensive, slow turnaround
- Learn pandas/SQL: Weeks of learning curve
- BI tools: $70-300/user/month, requires setup

**Mix Advantage**:
- Zero learning curve (ask in English)
- Instant analysis (seconds vs hours)
- Shows generated code (learn by watching AI)
- Free integration (Mix SDK cost only)

---

## Next Steps After Building

1. Demo video: Upload CSV → AI analyzes → Show code viewer
2. Blog post: "I Added Data Analysis to My Admin Panel in 2 Hours"
3. Tweet: Side-by-side (Excel manual vs AI automated)
4. GitHub: Tag "data-analysis", "admin-dashboard", "ai-analytics"

---

## Marketing & Social Media

### Core Message
**"I added AI data analysis to my admin panel. Admins ask questions in English. AI writes the Python code. Users see charts. Zero analysis code written."**

### LinkedIn Post
```
I just added AI data analysis to an admin dashboard.

Upload CSV → AI writes Python → Charts appear in real-time.

Admin Data Intelligence features:
• Natural language queries ("show me Q4 signups")
• Real-time chart generation as AI analyzes
• AI-generated code viewer (523 lines written, 0 by me)
• Full scrollable results with all visualizations

Total integration: ~40 lines with Mix SDK.

The old way:
Export to Excel → Write formulas → Create charts manually → Hours of work

The new way:
Upload CSV → Ask in English → Get insights instantly

Mix SDK provides:
→ PythonExecution (AI writes & runs pandas/matplotlib)
→ ShowMedia (displays charts in real-time)
→ Session context (multi-turn conversations)

We're not saying "replace data analysts."

We're saying "admins shouldn't need pandas to analyze their data."

Full code: https://github.com/recreate-run/mix-cookbooks

#BuildInPublic #AI #DataAnalysis #TypeScript
```

### Twitter/X Thread (5 tweets)
```
Tweet 1 (Hook):
I just added AI data analysis to an admin dashboard.

Upload CSV → AI writes Python → Charts appear in real-time.

40 lines of code with Mix SDK.

Here's what it does 👇

---

Tweet 2 (Problem):
The old way:
• Export to Excel
• Write formulas manually
• Create charts one by one
• Hours of tedious work

The new way:
• Upload CSV
• Ask in English: "show me Q4 signups"
• AI generates insights + visualizations
• Seconds, not hours

---

Tweet 3 (Features):
What makes it powerful:

✅ Natural language queries
✅ Real-time chart generation
✅ Shows AI-generated Python code
✅ Full scrollable results
✅ Follow-up questions work

AI wrote 523 lines of pandas/matplotlib.
I wrote 0 lines. 🎉

---

Tweet 4 (Code):
The integration:

const prompt = `Analyze this CSV: @${fileUrl}

Use pandas to:
1. Load and clean data
2. Generate visualizations
3. Identify insights

Show your Python code!`

Mix SDK handles execution, streaming, and chart display.

---

Tweet 5 (CTA):
We're not saying "replace data analysts."

We're saying "admins shouldn't need pandas to analyze their data."

Full working code + demo:
github.com/recreate-run/mix-cookbooks

#BuildInPublic #AI #DataAnalysis #TypeScript
```

### Demo Video (60 seconds)
**Show:**
1. [0-10s] Upload sales_2024.csv, click "Analyze with AI"
2. [10-25s] Sidebar shows real-time tool execution
3. [25-40s] Charts appear one by one during streaming
4. [40-50s] Scroll to show all results visible
5. [50-60s] Expand code viewer: "AI wrote 523 lines. You wrote 0."

**Caption:**
"AI data analysis in 40 lines. Upload CSV → AI writes Python → See charts in real-time. #AI #DataAnalysis"

### Recording Checklist
- [ ] Screen at 1920x1080, browser zoomed to 125%
- [ ] Show dashboard with sample metrics
- [ ] Upload CSV and trigger analysis
- [ ] Capture real-time chart appearances (3-4 charts)
- [ ] Show full scrolling of results
- [ ] Expand code viewer showing Python code
- [ ] Keep under 60 seconds
