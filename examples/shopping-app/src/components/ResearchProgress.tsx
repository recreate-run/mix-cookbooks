"use client";

import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { Card } from "./ui/card";

export interface ResearchStep {
	icon: string;
	label: string;
	status: "pending" | "in_progress" | "complete";
	details?: string;
}

interface ResearchProgressProps {
	steps: ResearchStep[];
}

export function ResearchProgress({ steps }: ResearchProgressProps) {
	return (
		<Card className="bg-slate-900/50 border-purple-500/20 p-4 mb-4">
			<h3 className="text-sm font-semibold text-purple-200 mb-3">
				Research Progress
			</h3>
			<div className="space-y-2">
				{steps.map((step, idx) => (
					<div key={idx} className="flex items-start gap-2">
						<div className="flex-shrink-0 mt-0.5">
							{step.status === "complete" && (
								<CheckCircle className="w-4 h-4 text-green-400" />
							)}
							{step.status === "in_progress" && (
								<Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
							)}
							{step.status === "pending" && (
								<Circle className="w-4 h-4 text-slate-600" />
							)}
						</div>
						<div className="flex-1 min-w-0">
							<p
								className={`text-sm ${
									step.status === "complete"
										? "text-slate-300"
										: step.status === "in_progress"
											? "text-purple-200 font-medium"
											: "text-slate-500"
								}`}
							>
								{step.icon} {step.label}
							</p>
							{step.details && (
								<p className="text-xs text-purple-400 mt-1">{step.details}</p>
							)}
						</div>
					</div>
				))}
			</div>
		</Card>
	);
}
