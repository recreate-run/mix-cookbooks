"use client";

import { useEffect, useState } from "react";
import type { MediaAsset } from "@/data/media";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X, Sparkles, Loader2, CheckCircle, Image as ImageIcon } from "lucide-react";
import { Progress } from "./ui/progress";

interface AnalysisResult {
	imageId: string;
	tags: string[];
	category?: string;
	description?: string;
}

interface AnalysisSidebarProps {
	images: MediaAsset[];
	onClose: () => void;
	onComplete: (results: AnalysisResult[]) => void;
}

export function AnalysisSidebar({
	images,
	onClose,
	onComplete,
}: AnalysisSidebarProps) {
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [results, setResults] = useState<AnalysisResult[]>([]);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [aiResponse, setAiResponse] = useState("");

	useEffect(() => {
		startAnalysis();
	}, []);

	const startAnalysis = async () => {
		try {
			console.log("[AnalysisSidebar] Starting analysis for", images.length, "images");
			setIsAnalyzing(true);

			// 1. Create Mix session
			console.log("[AnalysisSidebar] Creating Mix session...");
			const sessionRes = await fetch("/api/session", { method: "POST" });
			console.log("[AnalysisSidebar] Session response status:", sessionRes.status);
			if (!sessionRes.ok) throw new Error("Failed to create session");

			const sessionData = await sessionRes.json();
			const sid = sessionData.session.id;
			console.log("[AnalysisSidebar] Session created:", sid);
			setSessionId(sid);

			// 2. Build prompt for analyzing images
			const imageUrls = images.map((img) => img.url).join("\n");
			const prompt = `Analyze these images and suggest tags for each one:

${images.map((img, i) => `Image ${i + 1}: @${img.url}`).join("\n")}

For each image, identify:
1. Main objects/subjects (e.g., "laptop", "sunset", "people")
2. Scene type (e.g., "office", "outdoor", "portrait")
3. Dominant colors
4. Mood/feeling (e.g., "professional", "calm", "energetic")

Return the analysis in this JSON format:
{
  "images": [
    {
      "index": 0,
      "tags": ["tag1", "tag2", "tag3"],
      "category": "nature|food|tech|people|abstract",
      "description": "Brief description"
    }
  ]
}

Use ReadMedia tool to analyze each image visually.`;

			console.log("[AnalysisSidebar] Starting stream for session:", sid);
			console.log("[AnalysisSidebar] Prompt length:", prompt.length);

			// 3. Start streaming
			let responseText = "";
			const streamUrl = `/api/stream/${sid}?message=${encodeURIComponent(prompt)}`;
			console.log("[AnalysisSidebar] Stream URL:", streamUrl);

			const eventSource = new EventSource(streamUrl);

			eventSource.addEventListener("content", (event) => {
				console.log("[AnalysisSidebar] Received content event:", event.data);
				const data = JSON.parse(event.data);
				if (data.content) {
					responseText += data.content;
					setAiResponse(responseText);
					console.log("[AnalysisSidebar] Updated response text length:", responseText.length);
				}
			});

			eventSource.addEventListener("tool_call", (event) => {
				console.log("[AnalysisSidebar] Received tool_call event:", event.data);
				const data = JSON.parse(event.data);
				if (data.name === "ReadMedia") {
					console.log("[AnalysisSidebar] ReadMedia called for:", data.input?.url);
					// Find which image is being analyzed
					const imageIndex = images.findIndex((img) =>
						data.input?.url?.includes(img.id),
					);
					if (imageIndex !== -1) {
						console.log("[AnalysisSidebar] Analyzing image index:", imageIndex);
						setCurrentIndex(imageIndex);
					}
				}
			});

			eventSource.addEventListener("complete", () => {
				console.log("[AnalysisSidebar] Received complete event");
				console.log("[AnalysisSidebar] Final response text:", responseText);
				setIsAnalyzing(false);
				eventSource.close();

				// Try to parse JSON response
				try {
					console.log("[AnalysisSidebar] Attempting to parse JSON response");
					// Look for JSON in the response
					const jsonMatch = responseText.match(/\{[\s\S]*\}/);
					if (jsonMatch) {
						console.log("[AnalysisSidebar] Found JSON match:", jsonMatch[0].substring(0, 100) + "...");
						const parsed = JSON.parse(jsonMatch[0]);
						console.log("[AnalysisSidebar] Parsed JSON:", parsed);
						if (parsed.images) {
							console.log("[AnalysisSidebar] Found", parsed.images.length, "image results");
							const analysisResults: AnalysisResult[] = parsed.images.map(
								(img: {
									index: number;
									tags: string[];
									category: string;
									description: string;
								}) => ({
									imageId: images[img.index]?.id || "",
									tags: img.tags || [],
									category: img.category,
									description: img.description,
								}),
							);
							console.log("[AnalysisSidebar] Setting results:", analysisResults);
							setResults(analysisResults);
							console.log("[AnalysisSidebar] Calling onComplete with results");
							onComplete(analysisResults);
						} else {
							console.warn("[AnalysisSidebar] No images array found in parsed JSON");
						}
					} else {
						console.warn("[AnalysisSidebar] No JSON found in response text");
					}
				} catch (e) {
					console.error("[AnalysisSidebar] Failed to parse analysis results:", e);
					setError("Failed to parse results: " + (e instanceof Error ? e.message : "Unknown error"));
				}
			});

			eventSource.addEventListener("error", (event) => {
				console.error("[AnalysisSidebar] EventSource error:", event);
				setError("Analysis failed. Please try again.");
				setIsAnalyzing(false);
				eventSource.close();
			});

			eventSource.onerror = (event) => {
				console.error("[AnalysisSidebar] EventSource onerror:", event);
			};

			console.log("[AnalysisSidebar] EventSource listeners attached");
		} catch (err) {
			console.error("[AnalysisSidebar] Analysis error:", err);
			setError(
				err instanceof Error ? err.message : "Failed to start analysis",
			);
			setIsAnalyzing(false);
		}
	};

	const progress = images.length > 0 ? (currentIndex / images.length) * 100 : 0;

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
				onClick={onClose}
			/>

			{/* Sidebar */}
			<div className="fixed right-0 top-0 h-full w-full md:w-[600px] lg:w-[700px] z-50 animate-in slide-in-from-right duration-300">
				<Card className="h-full bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 border-l border-purple-500/20 shadow-2xl shadow-purple-500/10 rounded-none flex flex-col overflow-hidden">
					{/* Header */}
					<div className="relative p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-950/30 via-slate-900/50 to-fuchsia-950/30">
						<div className="flex justify-between items-start">
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-2">
									<div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 shadow-lg shadow-purple-500/50">
										<Sparkles className="w-5 h-5 text-white" />
									</div>
									<div>
										<h2 className="text-xl font-bold bg-gradient-to-r from-purple-200 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
											AI Image Analysis
										</h2>
										<p className="text-xs text-purple-300/70 mt-0.5">
											Analyzing {images.length} image{images.length !== 1 ? "s" : ""}
										</p>
									</div>
								</div>
							</div>
							<Button
								variant="ghost"
								size="icon"
								onClick={onClose}
								className="text-purple-300/70 hover:text-purple-100 hover:bg-purple-900/30"
							>
								<X className="w-5 h-5" />
							</Button>
						</div>

						{/* Progress */}
						{isAnalyzing && (
							<div className="mt-4 space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span className="text-purple-200">
										Analyzing image {currentIndex + 1} of {images.length}
									</span>
									<span className="text-purple-300">{Math.round(progress)}%</span>
								</div>
								<Progress value={progress} className="h-2" />
							</div>
						)}
					</div>

					{/* Content */}
					<div className="flex-1 overflow-y-auto p-6 space-y-4">
						{error && (
							<Card className="p-4 bg-red-900/20 border-red-500/30">
								<p className="text-red-200 text-sm">{error}</p>
							</Card>
						)}

						{/* Completion Message - Show at top when done */}
						{!isAnalyzing && results.length > 0 && (
							<Card className="p-3 bg-green-900/20 border-green-500/30">
								<div className="flex items-center gap-2 text-green-200">
									<CheckCircle className="w-4 h-4" />
									<div>
										<p className="text-sm font-medium">Analysis Complete!</p>
										<p className="text-xs text-green-300/70">
											Analyzed {results.length} image{results.length !== 1 ? "s" : ""} and generated tags
										</p>
									</div>
								</div>
							</Card>
						)}

						{/* Images being analyzed - Compact single column */}
						<div className="space-y-2">
							{images.map((image, index) => (
								<Card
									key={image.id}
									className={`p-2 transition-all ${
										index === currentIndex && isAnalyzing
											? "ring-2 ring-purple-500 bg-slate-900/70"
											: index < currentIndex
												? "bg-slate-900/50"
												: "bg-slate-900/30 opacity-60"
									}`}
								>
									<div className="flex items-start gap-3">
										<div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
											<img
												src={image.thumbnailUrl}
												alt={image.filename}
												className="w-full h-full object-cover"
											/>
											{index < currentIndex && (
												<div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
													<CheckCircle className="w-5 h-5 text-green-400" />
												</div>
											)}
											{index === currentIndex && isAnalyzing && (
												<div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
													<Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
												</div>
											)}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-xs font-medium text-white truncate mb-1">
												{image.filename}
											</p>
											{results[index] && results[index].tags.length > 0 && (
												<div className="flex flex-wrap gap-1">
													{results[index].tags.map((tag) => (
														<Badge
															key={tag}
															variant="secondary"
															className="bg-purple-900/30 text-purple-200 border-purple-500/30 text-xs px-1.5 py-0"
														>
															{tag}
														</Badge>
													))}
												</div>
											)}
										</div>
									</div>
								</Card>
							))}
						</div>

						{/* AI Response - Collapsed by default, show only if useful */}
						{aiResponse && !isAnalyzing && (
							<details className="group">
								<summary className="cursor-pointer list-none">
									<Card className="p-3 bg-slate-900/50 border-purple-500/20 hover:bg-slate-900/70 transition-colors">
										<div className="flex items-center justify-between">
											<h3 className="text-sm font-semibold text-purple-200">
												View Raw Analysis
											</h3>
											<span className="text-purple-300 text-xs group-open:rotate-180 transition-transform">
												▼
											</span>
										</div>
									</Card>
								</summary>
								<Card className="mt-2 p-3 bg-slate-900/50 border-purple-500/20">
									<div className="text-xs text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
										{aiResponse}
									</div>
								</Card>
							</details>
						)}
					</div>

					{/* Footer */}
					<div className="p-4 border-t border-purple-500/20 bg-slate-950/50">
						<Button
							onClick={onClose}
							className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white"
							disabled={isAnalyzing}
						>
							{isAnalyzing ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Analyzing...
								</>
							) : (
								"Done"
							)}
						</Button>
					</div>
				</Card>
			</div>
		</>
	);
}
