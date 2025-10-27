# CMS Media Intelligence

AI-powered content management system with smart image search, auto-tagging, alt text generation, and visual similarity detection.

## What This Example Demonstrates

This example shows how to integrate **AI vision capabilities** into a content management system. It transforms a basic media library into an intelligent system that can understand image content, search by description, and automatically tag images.

## Key Features

### 1. Smart Image Search
- **AI-Powered**: Search by describing what you see ("sunset beach", "team working")
- **Visual Understanding**: Uses ReadMedia to analyze image content
- **Fallback**: Toggle between AI and traditional filename/tag search

### 2. Automatic Image Tagging
- **Bulk Analysis**: Select multiple images → "Analyze with AI"
- **Real-time Progress**: See AI analyzing each image
- **Tag Suggestions**: AI identifies objects, scenes, colors, mood
- **Review & Edit**: Accept or modify suggested tags

### 3. Alt Text Generation
- **Accessibility**: Bulk generate alt text for images
- **Standards Compliant**: Descriptive text under 125 characters
- **Editable**: Review and customize before applying

### 4. Similar Image Finder
- **Visual Similarity**: Find images that look alike
- **Clustering**: AI groups similar images automatically
- **Similarity Scores**: See % match for each result

## Tech Stack

- **Frontend**: React 19 + TypeScript + TanStack Start
- **UI**: Tailwind CSS v4 + Shadcn components
- **AI**: Mix SDK v0.8.8 (vision capabilities)
- **Sample Data**: 24 diverse images via Unsplash

## Quick Start

### Prerequisites
- Bun installed
- Mix server running (for AI features)

### Run the App

```bash
# Install dependencies
bun install

# Start dev server
make dev

# View logs
make tail-log
```

Visit `http://localhost:3001` (or check logs for actual port)

### Start Mix Server

In a separate terminal:
```bash
cd /path/to/mix
make dev
```

## Current Status

### ✅ Completed
- Media library grid with 24 sample images from Unsplash
- Smart search UI with AI toggle
- Image selection and bulk actions
- Category badges and metadata display
- Stats dashboard (total, alt text count, categories)
- Responsive design
- **API routes** - Session creation and SSE streaming
- **AnalysisSidebar** - Real-time AI image analysis with ReadMedia
- **AltTextModal** - Bulk alt text generation with AI
- Full Mix SDK integration with streaming

### 🚧 To Add (Future Enhancements)
- Smart AI search implementation (currently basic text filtering)
- Similar image finder with visual similarity
- Upload new images functionality
- Bulk export/import of media metadata

## How It Works

### Architecture

```
User uploads images → CMS stores with metadata
                      ↓
              AI Capabilities:
              ↓             ↓              ↓
     Smart Search   Auto-Tag      Find Similar
     (ReadMedia)   (ReadMedia)   (PythonExecution)
              ↓             ↓              ↓
     Visual results  Tag suggestions  Similar images
```

### Data Structure

```typescript
interface MediaAsset {
  id: string
  filename: string
  url: string
  thumbnailUrl: string
  size: number
  uploadDate: Date
  tags: string[]        // Auto-generated or manual
  altText?: string      // AI-generated or manual
  category: string
}
```

### Components

```
src/
├── components/
│   ├── MediaGrid.tsx       # Image grid with selection
│   ├── SmartSearch.tsx     # Search with AI toggle
│   └── (TODO) AnalysisSidebar.tsx
├── data/
│   └── media.ts            # 24 sample images
└── routes/
    ├── index.tsx           # Main CMS page
    └── api/ (TODO)
        ├── session.ts
        ├── smart-search.ts
        ├── analyze.ts
        └── alt-text.ts
```

## Use Cases

### For Content Creators
- **Problem**: Manually tagging 1000 images takes 10+ hours
- **Solution**: AI auto-tags in 10 minutes
- **Benefit**: 60x faster media organization

### For Marketing Teams
- **Problem**: Finding the right image from 5000 assets
- **Solution**: Search by description ("happy customer", "product shot")
- **Benefit**: Find images 10x faster

### For Accessibility Compliance
- **Problem**: Need alt text for 500 images
- **Solution**: AI generates descriptive alt text in bulk
- **Benefit**: Meet WCAG standards quickly

## Sample Data Categories

The library includes 24 sample images across 5 categories:
- **Nature** (8): Sunsets, mountains, forests, oceans
- **Food** (6): Coffee, meals, fruits, pizza
- **Tech** (6): Laptops, phones, desks, keyboards
- **People** (5): Teams, portraits, collaboration
- **Abstract** (5): Patterns, textures, colors

## Development

```bash
# Start dev server
make dev

# View logs
make tail-log

# Type checking
make typecheck

# Format code
make format
```

## Why This Example Matters

### Problem It Solves

Traditional CMS media libraries require:
1. Manual tagging (time-consuming)
2. Exact keyword matching (misses similar images)
3. Manual alt text writing (tedious)
4. No visual search (can't find "sunset beach photos")

### Mix SDK Advantages

- **Vision AI**: ReadMedia analyzes image content
- **Code Execution**: PythonExecution for similarity calculations
- **Autonomous**: AI decides how to analyze each image
- **Integrable**: Drops into any CMS

### Impossible with OpenAI Alone

- ❌ OpenAI API: No image analysis
- ❌ OpenAI API: No code execution
- ❌ OpenAI API: No visual similarity
- ✅ Mix SDK: All of the above

## Next Steps

1. Implement AI search API route (ReadMedia)
2. Create AnalysisSidebar component
3. Add alt text generation modal
4. Build similar image finder
5. Add real-time tool tracking
6. Create demo video

## Learn More

- **Mix SDK**: [Documentation](https://recreate.run/docs/mix)
- **TanStack Start**: [Documentation](https://tanstack.com/start)
- **ReadMedia Tool**: [Mix Vision API](https://recreate.run/docs/mix/tools#readmedia)

## License

MIT
