"use client";

import { ExternalLink, Loader2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

export interface Source {
	url: string;
	title: string;
	status: "reading" | "complete";
}

interface SourcesListProps {
	sources: Source[];
}

export function SourcesList({ sources }: SourcesListProps) {
	if (sources.length === 0) return null;

	return (
		<Card className="bg-slate-900/50 border-purple-500/20 p-4 mb-4">
			<h3 className="text-sm font-semibold text-purple-200 mb-3">
				Sources ({sources.length})
			</h3>
			<div className="space-y-2 max-h-48 overflow-y-auto">
				{sources.map((source, idx) => (
					<div
						key={idx}
						className="flex items-start gap-2 p-2 rounded bg-slate-800/50"
					>
						<Badge
							variant="secondary"
							className="text-xs bg-purple-900/30 text-purple-200 border-purple-500/30 flex-shrink-0"
						>
							{idx + 1}
						</Badge>
						<div className="flex-1 min-w-0">
							<a
								href={source.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-purple-300 hover:text-purple-200 flex items-center gap-1 transition-colors break-all"
							>
								<span className="truncate">{source.title}</span>
								<ExternalLink className="w-3 h-3 flex-shrink-0" />
							</a>
							{source.status === "reading" && (
								<p className="text-xs text-purple-400 mt-1 flex items-center gap-1">
									<Loader2 className="w-3 h-3 animate-spin" />
									Reading...
								</p>
							)}
						</div>
					</div>
				))}
			</div>
		</Card>
	);
}
