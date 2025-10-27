"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Search, Sparkles, X } from "lucide-react";

interface SmartSearchProps {
	onSearch: (query: string, aiEnabled: boolean) => void;
	isSearching?: boolean;
}

export function SmartSearch({ onSearch, isSearching }: SmartSearchProps) {
	const [query, setQuery] = useState("");
	const [aiEnabled, setAiEnabled] = useState(true);

	const handleSearch = () => {
		if (query.trim()) {
			onSearch(query.trim(), aiEnabled);
		}
	};

	const handleClear = () => {
		setQuery("");
		onSearch("", aiEnabled);
	};

	return (
		<div className="space-y-4">
			<div className="flex gap-3">
				<div className="flex-1 relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
					<Input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && !isSearching && handleSearch()}
						placeholder={
							aiEnabled
								? 'Try "sunset beach" or "team working together"'
								: "Search by filename or tags..."
						}
						className="pl-11 pr-24 bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
						disabled={isSearching}
					/>
					{query && (
						<Button
							size="sm"
							variant="ghost"
							onClick={handleClear}
							className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
						>
							<X className="w-4 h-4" />
						</Button>
					)}
				</div>
				<Button
					onClick={handleSearch}
					disabled={!query.trim() || isSearching}
					className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white shadow-lg shadow-purple-500/30 disabled:opacity-50"
				>
					{isSearching ? (
						<>
							<Sparkles className="w-4 h-4 mr-2 animate-pulse" />
							Searching...
						</>
					) : (
						<>
							<Search className="w-4 h-4 mr-2" />
							Search
						</>
					)}
				</Button>
			</div>

			<div className="flex items-center justify-between p-3 bg-slate-900/30 border border-slate-700/30 rounded-lg">
				<div className="flex items-center gap-3">
					<Switch
						id="ai-search"
						checked={aiEnabled}
						onCheckedChange={setAiEnabled}
						disabled={isSearching}
					/>
					<div>
						<Label
							htmlFor="ai-search"
							className="text-sm font-medium text-white cursor-pointer"
						>
							{aiEnabled ? (
								<span className="flex items-center gap-2">
									<Sparkles className="w-4 h-4 text-purple-400" />
									AI-Powered Search
								</span>
							) : (
								<span className="flex items-center gap-2">
									<Search className="w-4 h-4 text-slate-400" />
									Basic Search
								</span>
							)}
						</Label>
						<p className="text-xs text-slate-400 mt-0.5">
							{aiEnabled
								? "Search by visual content and descriptions"
								: "Search by filename and tags only"}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
