# Example 1: CMS + AI Media Intelligence (Day 1-2)

## Overview

**Goal**: Build a content management system with AI-powered media library

**What Makes It Agentic**:
- AI uses vision (ReadMedia) to understand images autonomously
- AI writes clustering code (PythonExecution) to find similar images
- AI searches web (Search) to find related content
- Shows real-time tool execution to users

---

## The Webapp: Content Management System

**Existing Features**:
- Media library grid (upload, browse images)
- Basic metadata (filename, size, upload date)
- Traditional folder organization
- Manual tagging/categorization

**Problem**:
- Manually tagging hundreds of images takes hours
- Finding specific images requires exact keyword match
- Can't search by visual content ("find sunset beach photos")
- No automated alt text for accessibility

---

## AI Integration Features

### Feature 1: Smart Image Search by Description
**User Flow**:
1. User types: "sunset beach photos" in search box
2. AI analyzes ALL images in library (ReadMedia)
3. Results show visually relevant images, not just filename matches

**Mix Tools**:
- `ReadMedia` - Vision analysis on all library images
- `PythonExecution` - Calculate similarity scores, rank results

**UI**: Search bar with "🤖 AI Search" toggle

---

### Feature 2: Automatic Image Tagging
**User Flow**:
1. User uploads new images to library
2. "Analyze with AI" button appears for untagged images
3. Sidebar shows: AI analyzing → generating tags → suggesting categories
4. User reviews and accepts/edits tags

**Mix Tools**:
- `ReadMedia` - Identify objects, scenes, colors, mood
- `PythonExecution` - Generate tag suggestions, categorize
- `Search` - (optional) Find related tags from similar images online

**UI**: Media grid + analysis sidebar with suggested tags

---

### Feature 3: Alt Text Generator
**User Flow**:
1. User selects image(s) without alt text
2. Clicks "Generate Alt Text"
3. Modal shows AI-generated descriptions
4. User can edit before saving

**Mix Tools**:
- `ReadMedia` - Analyze image content
- Generate descriptive, accessible alt text

**UI**: Bulk action button + review modal

---

### Feature 4: Similar Image Finder
**User Flow**:
1. User clicks "Find Similar" on any image
2. Sidebar shows: AI analyzing image → finding similar ones
3. Results display with similarity scores

**Mix Tools**:
- `ReadMedia` - Extract image features
- `PythonExecution` - Calculate image embeddings, find nearest neighbors
- `ShowMedia` - Display similarity grid

**UI**: Image detail view + similar images sidebar

---

## Technical Implementation

### Project Structure
```
cms-media-intelligence/
├── src/
│   ├── routes/
│   │   ├── index.tsx              # Media library grid
│   │   └── api/
│   │       ├── session.ts         # Mix session creation
│   │       ├── stream.$sessionId.ts # SSE streaming
│   │       └── upload.ts          # Image upload endpoint
│   ├── components/
│   │   ├── MediaGrid.tsx          # Image grid with selection
│   │   ├── SmartSearch.tsx        # AI-powered search bar
│   │   ├── AnalysisSidebar.tsx    # Shows AI tagging process
│   │   ├── AltTextModal.tsx       # Bulk alt text generation
│   │   └── SimilarImages.tsx      # Find similar feature
│   ├── lib/
│   │   ├── mix-client.ts
│   │   └── image-storage.ts       # Mock image database
├── public/
│   └── sample-images/             # Pre-loaded sample images
└── README.md
```

---

## Sample Images Setup

Include 20-30 diverse sample images:
- Nature (sunsets, beaches, mountains)
- Food (meals, desserts, drinks)
- Technology (devices, coding, office)
- People (portraits, groups, activities)
- Abstract (patterns, textures, colors)

This lets users immediately test AI features without uploading.

---

## Feature Implementation Details

### 1. Smart Search

**API Route** (`/api/smart-search.ts`):
```typescript
// User query: "sunset beach photos"
const prompt = `Analyze these images and find ones matching: "${query}"

Images:
${images.map(img => `@${img.url} (${img.filename})`).join('\n')}

Use ReadMedia to analyze each image. Return JSON array of matching image IDs with relevance scores 0-10.`

// AI uses ReadMedia autonomously on each image
// Returns ranked results
```

**Component** (`SmartSearch.tsx`):
- Text input with AI toggle
- Shows "Analyzing 24 images..." progress
- Displays results with relevance scores
- Falls back to filename search if AI toggle off

---

### 2. Auto-Tagging

**API Prompt**:
```typescript
const prompt = `Analyze these newly uploaded images and suggest tags:

${newImages.map(img => `@${img.url}`).join('\n')}

For each image, use ReadMedia to identify:
- Objects (e.g., "laptop", "coffee", "notebook")
- Scene type (e.g., "office", "outdoor", "portrait")
- Colors (dominant colors)
- Mood (e.g., "professional", "relaxed", "energetic")

Return JSON with suggested tags per image.`
```

**UI Flow**:
1. Upload images → Grid shows with "Untagged" badge
2. "Analyze All" button → Opens sidebar
3. Sidebar shows real-time:
   - 📸 Analyzing image 1 of 6...
   - 🏷️ Suggested tags: [laptop, office, work, desk]
   - ✅ Image 1 complete
4. User reviews all suggestions → Accept or edit → Save

---

### 3. Alt Text Generation

**API Prompt**:
```typescript
const prompt = `Generate accessibility-friendly alt text for these images:

${selectedImages.map(img => `@${img.url}`).join('\n')}

Requirements:
- Describe what's in the image clearly
- Keep under 125 characters
- Focus on content, not style
- Use natural language

Return JSON with alt text per image.`
```

**Bulk Action**:
- Select multiple images → "Generate Alt Text" button
- Modal shows all suggestions at once
- Edit any before applying to all

---

### 4. Similar Images

**API Prompt**:
```typescript
const prompt = `Find images similar to this one:

Target: @${targetImage.url}
Library: ${allImages.map(img => `@${img.url}`).join('\n')}

Use ReadMedia to analyze visual similarity. Use PythonExecution to calculate similarity scores (cosine similarity of image embeddings).

Return top 10 similar images with scores.`
```

**UI**:
- Click "Find Similar" on any image
- Sidebar shows: Target image at top → Similar images below with % scores
- Click any result to open it

---

## Real-Time Tool Visibility

Show users what AI is doing:

```typescript
// Tool tracking in AnalysisSidebar
onTool: (tool) => {
  if (tool.name === "ReadMedia") {
    updateStatus(`📸 Analyzing image: ${tool.input.file_path}`)
  }
  if (tool.name === "PythonExecution") {
    if (tool.input.includes("similarity")) {
      updateStatus("🔍 Calculating similarity scores...")
    }
    if (tool.input.includes("cluster")) {
      updateStatus("🧩 Grouping similar images...")
    }
  }
}
```

---

## Development Timeline

**Day 1 (6-8 hours)**:
- Project setup (TanStack Start + Mix SDK)
- Media library grid with sample images
- Image upload functionality
- Smart search UI + API integration
- Auto-tagging sidebar UI

**Day 2 (4-6 hours)**:
- Alt text generation modal
- Similar images finder
- Tool visibility implementation
- README with integration guide
- Testing with diverse images

**Total**: 10-14 hours

---

## Success Criteria

✅ Users can search by description ("sunset") not just filename
✅ Newly uploaded images get auto-suggested tags
✅ Bulk alt text generation works for accessibility
✅ Similar image finder shows visually related content
✅ Real-time tool visibility shows AI using ReadMedia
✅ Integration feels natural (not separate from CMS)
✅ Impossible to build with just OpenAI API (requires vision)

---

## Market Validation

**Target Users**: Content creators, marketers, bloggers
**Market Size**: 50M+ content creators
**Current Pain**: Manually tagging 1000 images takes 10+ hours
**AI Solution**: Auto-tag 1000 images in 10 minutes

**Existing Tools**:
- Google Photos AI search: Closed-source, not integratable
- Adobe Sensei: Expensive ($50+/month)
- Manual tagging: Free but time-consuming

**Mix Advantage**:
- Open-source integration
- Vision capabilities (ReadMedia)
- Customizable to specific CMS needs

---

## Key Messaging

**For Developers**:
- "Add AI image search to your CMS in 2 hours"
- "Vision-powered media library using Mix SDK"
- "Auto-tag thousands of images with ReadMedia"

**For End Users**:
- "Search your media library by describing what you see"
- "AI tags images automatically as you upload"
- "Find visually similar images instantly"

---

## Next Steps After Building

1. Demo video: Show searching "sunset" finding images
2. Blog post: "Building AI Image Search with Mix SDK"
3. Tweet: Code snippet showing ReadMedia integration
4. GitHub: Tag as "vision-ai", "cms", "image-search"

---

## Marketing & Social Media

### Core Message
**"I added AI image tagging to my CMS in 30 lines of code"**

### Twitter/X Thread (3 tweets)
```
🧵 I just added AI vision to my CMS.

Search images by description ("sunset beach")
Auto-tag images on upload
Generate alt text for accessibility

30 lines of code with Mix SDK's ReadMedia.

Here's what it does 👇

---

THE FEATURES:

1. Smart Search: "Find sunset photos" → AI analyzes all images
2. Auto-Tagging: Upload image → AI suggests tags (mountain, snow, landscape)
3. Alt Text: Bulk generate accessibility descriptions
4. All powered by ReadMedia vision tool

No manual image labeling needed.

---

THE CODE:

const prompt = `Analyze this image and suggest tags:
@${imageUrl}

Identify: objects, scene type, colors, mood

Return JSON with tags array`

// AI uses ReadMedia to analyze
// Returns: ["mountain", "snow", "sunset", "landscape"]

Demo: github.com/recreate-run/mix-cookbooks
```

### LinkedIn Post
```
🚀 Built AI vision into my CMS

- Search media by description
- Auto-tag images on upload
- Generate accessibility alt text
- Analyze 24 images in seconds

The key: Mix SDK's ReadMedia tool gives AI vision capabilities.
AI analyzes image content and suggests relevant tags.

No third-party APIs. No manual labeling.

Demo: github.com/recreate-run/mix-cookbooks
```

### Demo Video (30 seconds)
**Show:**
1. Select 1-2 images from grid
2. Click "Analyze with AI"
3. Sidebar shows: "Analyzing image..."
4. Tags appear: mountain, snow-capped peaks, clouds, sunset
5. All tags displayed in compact layout

**Caption:**
"AI image tagging in 30 lines. Upload → AI analyzes → Suggests tags. Vision-powered CMS. #AI #CMS"

### Recording Checklist
- [ ] Screen at 1920x1080, browser zoomed to 125%
- [ ] Show media grid with 24 images
- [ ] Select 1 image
- [ ] Click "Analyze with AI"
- [ ] Capture analysis progress
- [ ] Show generated tags appearing
- [ ] Demo "Generate Alt Text" feature
- [ ] Keep video under 60 seconds

