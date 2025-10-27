"use client";

import { Card } from "./ui/card";

interface ChartsDisplayProps {
	charts: string[];
	titles?: string[];
}

export function ChartsDisplay({ charts, titles = [] }: ChartsDisplayProps) {
	if (charts.length === 0) return null;

	return (
		<Card className="bg-slate-900/50 border-purple-500/20 p-4 mb-4">
			<h3 className="text-sm font-semibold text-purple-200 mb-3">
				Analysis & Visualizations
			</h3>
			<div className="space-y-4">
				{charts.map((chartUrl, idx) => (
					<div key={idx}>
						{titles[idx] && (
							<p className="text-xs text-slate-400 mb-2">{titles[idx]}</p>
						)}
						<img
							src={chartUrl}
							alt={titles[idx] || `Chart ${idx + 1}`}
							className="w-full rounded-lg border border-purple-500/20 bg-white"
						/>
					</div>
				))}
			</div>
		</Card>
	);
}
