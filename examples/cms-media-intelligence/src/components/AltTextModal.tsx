"use client";

import { useEffect, useState } from "react";
import type { MediaAsset } from "@/data/media";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { X, Type, Loader2, CheckCircle } from "lucide-react";

interface AltTextResult {
	imageId: string;
	altText: string;
}

interface AltTextModalProps {
	images: MediaAsset[];
	onClose: () => void;
	onSave: (results: AltTextResult[]) => void;
}

export function AltTextModal({ images, onClose, onSave }: AltTextModalProps) {
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [results, setResults] = useState<AltTextResult[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		generateAltText();
	}, []);

	const generateAltText = async () => {
		try {
			setIsGenerating(true);

			// 1. Create Mix session
			const sessionRes = await fetch("/api/session", { method: "POST" });
			if (!sessionRes.ok) throw new Error("Failed to create session");

			const sessionData = await sessionRes.json();
			const sid = sessionData.session.id;
			setSessionId(sid);

			// 2. Build prompt for alt text generation
			const prompt = `Generate accessibility-friendly alt text for these images:

${images.map((img, i) => `Image ${i + 1}: @${img.url}`).join("\n")}

Requirements for each alt text:
- Describe what's visible in the image clearly and concisely
- Keep under 125 characters
- Focus on content, not artistic style
- Use natural, descriptive language
- Be specific about main subjects

Return in JSON format:
{
  "images": [
    {
      "index": 0,
      "altText": "Description of image"
    }
  ]
}

Use ReadMedia to analyze each image.`;

			// 3. Start streaming
			let responseText = "";
			const eventSource = new EventSource(
				`/api/stream/${sid}?message=${encodeURIComponent(prompt)}`,
			);

			eventSource.addEventListener("content", (event) => {
				const data = JSON.parse(event.data);
				if (data.content) {
					responseText += data.content;
				}
			});

			eventSource.addEventListener("complete", () => {
				setIsGenerating(false);
				eventSource.close();

				// Parse JSON response
				try {
					const jsonMatch = responseText.match(/\{[\s\S]*\}/);
					if (jsonMatch) {
						const parsed = JSON.parse(jsonMatch[0]);
						if (parsed.images) {
							const altTextResults: AltTextResult[] = parsed.images.map(
								(img: { index: number; altText: string }) => ({
									imageId: images[img.index]?.id || "",
									altText: img.altText || "",
								}),
							);
							setResults(altTextResults);
						}
					}
				} catch (e) {
					console.error("Failed to parse alt text results:", e);
					setError("Failed to parse results. Please try again.");
				}
			});

			eventSource.addEventListener("error", () => {
				setError("Generation failed. Please try again.");
				setIsGenerating(false);
				eventSource.close();
			});
		} catch (err) {
			console.error("Alt text generation error:", err);
			setError(
				err instanceof Error ? err.message : "Failed to generate alt text",
			);
			setIsGenerating(false);
		}
	};

	const handleAltTextChange = (imageId: string, newAltText: string) => {
		setResults((prev) =>
			prev.map((r) => (r.imageId === imageId ? { ...r, altText: newAltText } : r)),
		);
	};

	const handleSave = () => {
		onSave(results);
		onClose();
	};

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="fixed inset-0 flex items-center justify-center z-50 p-4">
				<Card className="w-full max-w-4xl max-h-[80vh] bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 border border-purple-500/20 shadow-2xl shadow-purple-500/10 flex flex-col overflow-hidden">
					{/* Header */}
					<div className="p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-950/30 via-slate-900/50 to-fuchsia-950/30">
						<div className="flex justify-between items-start">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 shadow-lg shadow-blue-500/50">
									<Type className="w-5 h-5 text-white" />
								</div>
								<div>
									<h2 className="text-xl font-bold bg-gradient-to-r from-blue-200 via-cyan-200 to-teal-200 bg-clip-text text-transparent">
										Generate Alt Text
									</h2>
									<p className="text-xs text-purple-300/70 mt-0.5">
										AI-generated descriptions for {images.length} image
										{images.length !== 1 ? "s" : ""}
									</p>
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
					</div>

					{/* Content */}
					<div className="flex-1 overflow-y-auto p-6">
						{error && (
							<Card className="p-4 bg-red-900/20 border-red-500/30 mb-4">
								<p className="text-red-200 text-sm">{error}</p>
							</Card>
						)}

						{isGenerating && (
							<Card className="p-8 bg-slate-900/50 border-purple-500/20 text-center">
								<Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-3" />
								<p className="text-purple-200 font-medium">
									Generating alt text...
								</p>
								<p className="text-xs text-purple-300/70 mt-1">
									Analyzing images with AI
								</p>
							</Card>
						)}

						{!isGenerating && results.length > 0 && (
							<div className="space-y-4">
								{results.map((result, index) => {
									const image = images.find((img) => img.id === result.imageId);
									if (!image) return null;

									return (
										<Card
											key={result.imageId}
											className="p-4 bg-slate-900/50 border-purple-500/20"
										>
											<div className="flex gap-4">
												<div className="w-24 h-24 rounded overflow-hidden flex-shrink-0">
													<img
														src={image.thumbnailUrl}
														alt={image.filename}
														className="w-full h-full object-cover"
													/>
												</div>
												<div className="flex-1 space-y-2">
													<div className="flex items-center justify-between">
														<p className="text-sm font-medium text-white">
															{image.filename}
														</p>
														<div className="flex items-center gap-1 text-xs text-slate-400">
															<span>{result.altText.length}/125</span>
														</div>
													</div>
													<Textarea
														value={result.altText}
														onChange={(e) =>
															handleAltTextChange(
																result.imageId,
																e.target.value,
															)
														}
														placeholder="Alt text description..."
														className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 text-sm resize-none"
														rows={2}
														maxLength={125}
													/>
												</div>
											</div>
										</Card>
									);
								})}
							</div>
						)}
					</div>

					{/* Footer */}
					<div className="p-4 border-t border-purple-500/20 bg-slate-950/50 flex gap-2">
						<Button
							onClick={onClose}
							variant="outline"
							className="flex-1 border-purple-500/30 text-purple-200 hover:bg-purple-900/30"
							disabled={isGenerating}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSave}
							className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
							disabled={isGenerating || results.length === 0}
						>
							<CheckCircle className="w-4 h-4 mr-2" />
							Save Alt Text
						</Button>
					</div>
				</Card>
			</div>
		</>
	);
}
