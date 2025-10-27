"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { sampleMedia } from "@/data/media";
import type { MediaAsset } from "@/data/media";
import { MediaGrid } from "@/components/MediaGrid";
import { SmartSearch } from "@/components/SmartSearch";
import { AnalysisSidebar } from "@/components/AnalysisSidebar";
import { AltTextModal } from "@/components/AltTextModal";
import { Sparkles, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const [media, setMedia] = useState<MediaAsset[]>(sampleMedia);
	const [isSearching, setIsSearching] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [showAnalysisSidebar, setShowAnalysisSidebar] = useState(false);
	const [showAltTextModal, setShowAltTextModal] = useState(false);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	const handleSearch = (query: string, aiEnabled: boolean) => {
		setSearchQuery(query);

		if (!query) {
			// Reset to all media
			setMedia(sampleMedia);
			return;
		}

		if (!aiEnabled) {
			// Basic search: filter by filename and tags
			const filtered = sampleMedia.filter(
				(item) =>
					item.filename.toLowerCase().includes(query.toLowerCase()) ||
					item.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
			);
			setMedia(filtered);
		} else {
			// AI search would go here (we'll implement the API route later)
			// For now, show a simple filter as placeholder
			setIsSearching(true);
			setTimeout(() => {
				const filtered = sampleMedia.filter(
					(item) =>
						item.filename.toLowerCase().includes(query.toLowerCase()) ||
						item.tags.some((tag) =>
							tag.toLowerCase().includes(query.toLowerCase()),
						) ||
						item.category.toLowerCase().includes(query.toLowerCase()),
				);
				setMedia(filtered);
				setIsSearching(false);
			}, 1000);
		}
	};

	const handleAnalyzeImages = (ids: string[]) => {
		setSelectedIds(ids);
		setShowAnalysisSidebar(true);
	};

	const handleGenerateAltText = (ids: string[]) => {
		setSelectedIds(ids);
		setShowAltTextModal(true);
	};

	const handleAnalysisComplete = (
		results: { imageId: string; tags: string[] }[],
	) => {
		console.log("[App] Analysis complete, updating media with results:", results);
		// Update media with new tags
		setMedia((prev) =>
			prev.map((item) => {
				const result = results.find((r) => r.imageId === item.id);
				if (result) {
					return { ...item, tags: result.tags };
				}
				return item;
			}),
		);
		// Don't auto-close - let user review results and click "Done"
		console.log("[App] Media updated, sidebar will stay open for user to review");
	};

	const handleAltTextSave = (
		results: { imageId: string; altText: string }[],
	) => {
		// Update media with new alt text
		setMedia((prev) =>
			prev.map((item) => {
				const result = results.find((r) => r.imageId === item.id);
				if (result) {
					return { ...item, altText: result.altText };
				}
				return item;
			}),
		);
		setShowAltTextModal(false);
	};

	const handleFindSimilar = (id: string) => {
		console.log("Find similar to:", id);
		// TODO: Implement similar image finder
	};

	const selectedImages = media.filter((m) => selectedIds.includes(m.id));

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-2">
						<div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 shadow-lg shadow-purple-500/50">
							<ImageIcon className="w-6 h-6 text-white" />
						</div>
						<div>
							<h1 className="text-3xl font-bold bg-gradient-to-r from-purple-200 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
								Media Library
							</h1>
							<p className="text-slate-400 text-sm">
								AI-powered content management with smart search, auto-tagging,
								and visual similarity
							</p>
						</div>
					</div>
				</div>

				{/* Search */}
				<div className="mb-8">
					<SmartSearch onSearch={handleSearch} isSearching={isSearching} />
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
					<div className="p-4 bg-slate-900/50 border border-slate-700/30 rounded-lg">
						<p className="text-sm text-slate-400">Total Media</p>
						<p className="text-2xl font-bold text-white">
							{searchQuery ? media.length : sampleMedia.length}
						</p>
					</div>
					<div className="p-4 bg-slate-900/50 border border-slate-700/30 rounded-lg">
						<p className="text-sm text-slate-400">With Alt Text</p>
						<p className="text-2xl font-bold text-white">
							{(searchQuery ? media : sampleMedia).filter((m) => m.altText)
								.length}
						</p>
					</div>
					<div className="p-4 bg-slate-900/50 border border-slate-700/30 rounded-lg">
						<p className="text-sm text-slate-400">Categories</p>
						<p className="text-2xl font-bold text-white">5</p>
					</div>
				</div>

				{/* Results Info */}
				{searchQuery && (
					<div className="mb-6 flex items-center gap-2 text-sm text-slate-300">
						<Sparkles className="w-4 h-4 text-purple-400" />
						<span>
							Found {media.length} result{media.length !== 1 ? "s" : ""} for "
							{searchQuery}"
						</span>
					</div>
				)}

				{/* Media Grid */}
				<MediaGrid
					media={media}
					onAnalyzeImages={handleAnalyzeImages}
					onGenerateAltText={handleGenerateAltText}
					onFindSimilar={handleFindSimilar}
				/>
			</div>

			{/* Analysis Sidebar */}
			{showAnalysisSidebar && (
				<AnalysisSidebar
					images={selectedImages}
					onClose={() => setShowAnalysisSidebar(false)}
					onComplete={handleAnalysisComplete}
				/>
			)}

			{/* Alt Text Modal */}
			{showAltTextModal && (
				<AltTextModal
					images={selectedImages}
					onClose={() => setShowAltTextModal(false)}
					onSave={handleAltTextSave}
				/>
			)}
		</div>
	);
}
