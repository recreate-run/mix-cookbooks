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
		<Card className="p-4 mb-4">
			<h3 className="text-sm font-semibold text-foreground mb-3">
				Research Progress
			</h3>
			<div className="space-y-2">
				{steps.map((step, idx) => (
					<div key={idx} className="flex items-start gap-2">
						<div className="flex-shrink-0 mt-0.5">
							{step.status === "complete" && (
								<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
							)}
							{step.status === "in_progress" && (
								<Loader2 className="w-4 h-4 text-primary animate-spin" />
							)}
							{step.status === "pending" && (
								<Circle className="w-4 h-4 text-muted-foreground" />
							)}
						</div>
						<div className="flex-1 min-w-0">
							<p
								className={`text-sm ${
									step.status === "complete"
										? "text-foreground"
										: step.status === "in_progress"
											? "text-foreground font-medium"
											: "text-muted-foreground"
								}`}
							>
								{step.icon} {step.label}
							</p>
							{step.details && (
								<p className="text-xs text-primary mt-1">{step.details}</p>
							)}
						</div>
					</div>
				))}
			</div>
		</Card>
	);
}
