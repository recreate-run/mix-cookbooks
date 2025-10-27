"use client";

import { useState } from "react";
import type { MediaAsset } from "@/data/media";
import { formatFileSize, formatDate } from "@/data/media";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Check, Sparkles, Type, Copy } from "lucide-react";

interface MediaGridProps {
	media: MediaAsset[];
	onSelectImage?: (id: string) => void;
	onAnalyzeImages?: (ids: string[]) => void;
	onGenerateAltText?: (ids: string[]) => void;
	onFindSimilar?: (id: string) => void;
}

export function MediaGrid({
	media,
	onSelectImage,
	onAnalyzeImages,
	onGenerateAltText,
	onFindSimilar,
}: MediaGridProps) {
	const [selected, setSelected] = useState<string[]>([]);

	const toggleSelect = (id: string) => {
		setSelected((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
		onSelectImage?.(id);
	};

	const handleAnalyzeSelected = () => {
		if (selected.length > 0) {
			onAnalyzeImages?.(selected);
		}
	};

	const handleGenerateAltText = () => {
		if (selected.length > 0) {
			onGenerateAltText?.(selected);
		}
	};

	return (
		<div className="space-y-6">
			{/* Bulk Actions */}
			{selected.length > 0 && (
				<div className="sticky top-4 z-10 bg-gradient-to-r from-purple-900/90 via-fuchsia-900/90 to-purple-900/90 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 shadow-lg shadow-purple-500/20">
					<div className="flex items-center justify-between">
						<p className="text-purple-100 font-medium">
							{selected.length} image{selected.length !== 1 ? "s" : ""}{" "}
							selected
						</p>
						<div className="flex gap-2">
							<Button
								onClick={() => setSelected([])}
								variant="outline"
								size="sm"
								className="border-purple-500/30 text-purple-200 hover:bg-purple-800/30"
							>
								Clear Selection
							</Button>
							{onAnalyzeImages && (
								<Button
									onClick={handleAnalyzeSelected}
									size="sm"
									className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white shadow-lg shadow-purple-500/30"
								>
									<Sparkles className="w-4 h-4 mr-2" />
									Analyze with AI
								</Button>
							)}
							{onGenerateAltText && (
								<Button
									onClick={handleGenerateAltText}
									size="sm"
									className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30"
								>
									<Type className="w-4 h-4 mr-2" />
									Generate Alt Text
								</Button>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Media Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{media.map((item) => (
					<Card
						key={item.id}
						className={`group cursor-pointer transition-all overflow-hidden ${
							selected.includes(item.id)
								? "ring-4 ring-purple-500 bg-gradient-to-br from-slate-900/90 to-purple-950/50 border-purple-500/50 shadow-purple-500/20"
								: "bg-slate-900/50 hover:bg-slate-900/70 border-slate-700/30 hover:border-purple-500/30"
						}`}
						onClick={() => toggleSelect(item.id)}
					>
						{/* Image */}
						<div className="relative aspect-square overflow-hidden bg-slate-800">
							<img
								src={item.thumbnailUrl}
								alt={item.altText || item.filename}
								className="w-full h-full object-cover transition-transform group-hover:scale-105"
								loading="lazy"
							/>

							{/* Selection Indicator */}
							<div className="absolute top-2 left-2">
								<div
									className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
										selected.includes(item.id)
											? "bg-gradient-to-br from-purple-500 to-pink-500 border-purple-500 shadow-lg shadow-purple-500/30"
											: "border-white/50 bg-black/30 group-hover:border-purple-500/50"
									}`}
								>
									{selected.includes(item.id) && (
										<Check className="w-4 h-4 text-white" />
									)}
								</div>
							</div>

							{/* Category Badge */}
							<div className="absolute top-2 right-2">
								<Badge
									variant="secondary"
									className="bg-black/50 text-white border-white/20 backdrop-blur-sm text-xs"
								>
									{item.category}
								</Badge>
							</div>

							{/* Quick Actions (on hover) */}
							<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<div className="flex gap-1">
									{onFindSimilar && (
										<Button
											size="sm"
											variant="secondary"
											className="flex-1 text-xs bg-black/50 hover:bg-black/70 text-white border-white/20"
											onClick={(e) => {
												e.stopPropagation();
												onFindSimilar(item.id);
											}}
										>
											<Copy className="w-3 h-3 mr-1" />
											Similar
										</Button>
									)}
								</div>
							</div>
						</div>

						{/* Metadata */}
						<div className="p-3 space-y-2">
							<div>
								<h3 className="font-medium text-white text-sm truncate">
									{item.filename}
								</h3>
								<p className="text-xs text-slate-400">
									{formatFileSize(item.size)} • {formatDate(item.uploadDate)}
								</p>
							</div>

							{/* Tags */}
							{item.tags.length > 0 && (
								<div className="flex flex-wrap gap-1">
									{item.tags.slice(0, 3).map((tag) => (
										<Badge
											key={tag}
											variant="secondary"
											className="bg-purple-900/30 text-purple-200 border-purple-500/30 text-xs px-1.5 py-0"
										>
											{tag}
										</Badge>
									))}
									{item.tags.length > 3 && (
										<Badge
											variant="secondary"
											className="bg-slate-700/30 text-slate-400 border-slate-600/30 text-xs px-1.5 py-0"
										>
											+{item.tags.length - 3}
										</Badge>
									)}
								</div>
							)}

							{/* Alt Text Indicator */}
							{item.altText && (
								<div className="flex items-center gap-1 text-xs text-green-400">
									<Type className="w-3 h-3" />
									<span>Alt text set</span>
								</div>
							)}
						</div>
					</Card>
				))}
			</div>

			{/* Empty State */}
			{media.length === 0 && (
				<div className="text-center py-16">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
						<Sparkles className="w-8 h-8 text-slate-500" />
					</div>
					<h3 className="text-lg font-semibold text-white mb-2">
						No media found
					</h3>
					<p className="text-slate-400">
						Upload images or try a different search
					</p>
				</div>
			)}
		</div>
	);
}
