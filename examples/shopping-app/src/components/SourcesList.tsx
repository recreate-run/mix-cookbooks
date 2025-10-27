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
		<Card className="p-4 mb-4">
			<h3 className="text-sm font-semibold text-foreground mb-3">
				Sources ({sources.length})
			</h3>
			<div className="space-y-2 max-h-48 overflow-y-auto">
				{sources.map((source, idx) => (
					<div
						key={idx}
						className="flex items-start gap-2 p-2 rounded bg-muted"
					>
						<Badge
							variant="secondary"
							className="text-xs flex-shrink-0"
						>
							{idx + 1}
						</Badge>
						<div className="flex-1 min-w-0">
							<a
								href={source.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors break-all"
							>
								<span className="truncate">{source.title}</span>
								<ExternalLink className="w-3 h-3 flex-shrink-0" />
							</a>
							{source.status === "reading" && (
								<p className="text-xs text-primary mt-1 flex items-center gap-1">
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
