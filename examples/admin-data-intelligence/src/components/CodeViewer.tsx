"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Code, Copy, Check } from "lucide-react";

interface CodeViewerProps {
	code: string;
	language?: string;
}

export function CodeViewer({ code, language = "python" }: CodeViewerProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Code className="w-4 h-4 text-primary" />
						<CardTitle className="text-sm text-foreground">
							Generated Code
						</CardTitle>
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7"
						onClick={handleCopy}
					>
						{copied ? (
							<Check className="w-3 h-3 text-green-600 dark:text-green-400" />
						) : (
							<Copy className="w-3 h-3" />
						)}
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="relative">
					<pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto max-h-60 border border-border">
						<code className="text-foreground">{code}</code>
					</pre>
					<div className="absolute top-2 right-2">
						<span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
							{language}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
