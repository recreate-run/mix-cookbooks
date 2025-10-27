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
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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
						className="pl-11 pr-24 "
						disabled={isSearching}
					/>
					{query && (
						<Button
							size="sm"
							variant="ghost"
							onClick={handleClear}
							className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						>
							<X className="w-4 h-4" />
						</Button>
					)}
				</div>
				<Button
					onClick={handleSearch}
					disabled={!query.trim() || isSearching}
					className=""
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

			<div className="flex items-center justify-between p-3 bg-card border rounded-lg">
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
							className="text-sm font-medium text-foreground cursor-pointer"
						>
							{aiEnabled ? (
								<span className="flex items-center gap-2">
									<Sparkles className="w-4 h-4 text-primary" />
									AI-Powered Search
								</span>
							) : (
								<span className="flex items-center gap-2">
									<Search className="w-4 h-4 text-muted-foreground" />
									Basic Search
								</span>
							)}
						</Label>
						<p className="text-xs text-muted-foreground mt-0.5">
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
