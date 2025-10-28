"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { CodeViewer } from "./CodeViewer";
import { ChartDisplay } from "./ChartDisplay";
import {
	X,
	Send,
	Loader2,
	Sparkles,
	Code,
	BarChart3,
	User,
} from "lucide-react";

interface Message {
	role: "user" | "assistant";
	content: string;
	charts?: any[]; // ShowMedia tool outputs
	code?: string; // Extracted Python code
}

interface ToolExecution {
	toolName: string;
	status: "running" | "completed" | "error";
	input: string;
	output?: string;
	code: string;
}

interface AnalysisModalProps {
	file: File;
	onClose: () => void;
	type: "csv_intelligence" | "anomaly_explanation";
	metricName?: string; // For anomaly explanation
}

export function AnalysisModal({
	file,
	onClose,
	type,
	metricName,
}: AnalysisModalProps) {
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const [toolExecutions, setToolExecutions] = useState<ToolExecution[]>([]);
	const [currentCharts, setCurrentCharts] = useState<any[]>([]);
	const [currentCode, setCurrentCode] = useState<string>("");
	const contentEndRef = useRef<HTMLDivElement>(null);
	const eventSourceRef = useRef<EventSource | null>(null);
	const hasStartedRef = useRef(false);

	// Auto-scroll to bottom when messages or charts update
	useEffect(() => {
		contentEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, currentCharts]);

	// Start analysis on mount
	useEffect(() => {
		// Prevent duplicate runs in StrictMode
		if (hasStartedRef.current) return;
		hasStartedRef.current = true;

		async function startAnalysis() {
			try {
				// Create session
				const res = await fetch("/api/session", { method: "POST" });
				if (!res.ok) throw new Error("Failed to create session");

				const { session } = await res.json();
				setSessionId(session.id);

				// Upload CSV file to Mix
				const formData = new FormData();
				formData.append("file", file);
				formData.append("sessionId", session.id);

				const uploadRes = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});

				if (!uploadRes.ok) throw new Error("Failed to upload CSV file");

				const { file: uploadedFile } = await uploadRes.json();

				// Build initial prompt based on type
				let initialPrompt = "";
				if (type === "csv_intelligence") {
					initialPrompt = `Analyze this CSV file and provide comprehensive insights:

CSV File: @${uploadedFile.url}

Please:
1. Load and analyze the CSV data using pandas
2. Provide data structure summary (columns, rows, data types)
3. Calculate key statistics (mean, median, trends)
4. Create visualizations using matplotlib/seaborn
5. Identify patterns, trends, outliers, and insights
6. Provide 3-5 actionable recommendations

Show me your Python code and analysis!`;
				} else {
					initialPrompt = `Analyze the anomaly in the metric "${metricName}" using this data:

CSV File: @${uploadedFile.url}

Please:
1. Load the data using pandas
2. Analyze what caused the drop in ${metricName}
3. Show Python analysis with statistics
4. Identify contributing factors
5. Suggest corrective actions

Show me your Python code and analysis!`;
				}

				// Start streaming
				startStreaming(session.id, initialPrompt);
			} catch (error) {
				console.error("Error starting analysis:", error);
				setMessages([
					{
						role: "assistant",
						content:
							"Sorry, I couldn't start the analysis. Please make sure Mix server is running.",
					},
				]);
			}
		}

		startAnalysis();

		// Cleanup function
		return () => {
			if (eventSourceRef.current) {
				eventSourceRef.current.close();
				eventSourceRef.current = null;
			}
		};
	}, [file, type, metricName]);

	const startStreaming = (sessionId: string, message: string) => {
		// Close existing EventSource if any
		if (eventSourceRef.current) {
			eventSourceRef.current.close();
		}

		setIsStreaming(true);
		setCurrentCharts([]);
		setCurrentCode("");
		let aiContent = "";

		const eventSource = new EventSource(
			`/api/stream/${sessionId}?message=${encodeURIComponent(message)}`,
		);

		// Store in ref for cleanup
		eventSourceRef.current = eventSource;

		// Initialize empty assistant message
		setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

		eventSource.addEventListener("content", (event) => {
			const data = JSON.parse(event.data);
			if (data.content) {
				aiContent += data.content;
				setMessages((prev) => {
					const updated = [...prev];
					updated[updated.length - 1].content = aiContent;
					return updated;
				});
			}
		});

		eventSource.addEventListener("tool", (event) => {
			const data = JSON.parse(event.data);

			// Add tool execution tracking for all tools
			setToolExecutions((prev) => [
				...prev,
				{
					toolName: data.name || "Unknown Tool",
					status: "running",
					input: data.input || "",
					code: "",
				},
			]);

			// Capture ShowMedia tools for chart display
			if (data.name === "ShowMedia") {
				setCurrentCharts((prev) => [...prev, data]);
			}
		});

		eventSource.addEventListener("tool_parameter_delta", (event) => {
			const data = JSON.parse(event.data);
			// Build up the tool input/code
			setToolExecutions((prev) => {
				const updated = [...prev];
				const lastTool = updated[updated.length - 1];
				if (lastTool && data.input) {
					// Accumulate the input deltas (remove surrounding quotes)
					const delta = data.input.replace(/^"|"$/g, "");
					lastTool.input = (lastTool.input || "") + delta;
				}
				return updated;
			});
		});

		eventSource.addEventListener("tool_execution_start", () => {
			// Update tool status
			setToolExecutions((prev) => {
				const updated = [...prev];
				const lastTool = updated[updated.length - 1];
				if (lastTool) {
					lastTool.status = "running";
				}
				return updated;
			});
		});

		eventSource.addEventListener("tool_execution_complete", (event) => {
			const data = JSON.parse(event.data);

			// Update tool with output and extract code
			setToolExecutions((prev) => {
				const updated = [...prev];
				const lastTool = updated[updated.length - 1];
				if (lastTool) {
					lastTool.status = "completed";
					lastTool.output = data.result || "Completed";

					// Extract Python code from Bash tool input
					if (lastTool.toolName === "Bash" && lastTool.input) {
						try {
							const inputJson = JSON.parse(lastTool.input);
							if (inputJson.command) {
								// Extract Python code from the command
								const command = inputJson.command;
								// Look for python -c "..." pattern
								const pythonMatch = command.match(/python\s+-c\s+['"]([\s\S]*)['"]/);
								if (pythonMatch) {
									const code = pythonMatch[1]
										.replace(/\\n/g, "\n")
										.replace(/\\"/g, '"')
										.replace(/\\'/g, "'");
									lastTool.code = code;
									setCurrentCode((prev) => prev ? `${prev}\n\n${code}` : code);
								} else {
									lastTool.code = command;
								}
							}
						} catch (e) {
							console.error("Failed to parse tool input:", e);
						}
					}
				}
				return updated;
			});
		});

		eventSource.addEventListener("complete", () => {
			setIsStreaming(false);

			// Attach charts and code to the last message
			setMessages((prev) => {
				const updated = [...prev];
				const lastMessage = updated[updated.length - 1];
				if (lastMessage && lastMessage.role === "assistant") {
					const charts = currentCharts.length > 0 ? [...currentCharts] : undefined;
					const code = currentCode || undefined;

					lastMessage.charts = charts;
					lastMessage.code = code;
				}
				return updated;
			});

			// Mark all running tools as completed
			setToolExecutions((prev) =>
				prev.map((tool) =>
					tool.status === "running" ? { ...tool, status: "completed" } : tool,
				),
			);
			eventSource.close();
			eventSourceRef.current = null;
		});

		eventSource.addEventListener("error", () => {
			setIsStreaming(false);
			eventSource.close();
			eventSourceRef.current = null;
		});
	};

	const handleAsk = async () => {
		if (!input.trim() || !sessionId || isStreaming) return;

		const userMessage = input.trim();
		setInput("");

		// Add user message
		setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

		// Start streaming response
		startStreaming(sessionId, userMessage);
	};

	const totalCodeLines = toolExecutions
		.filter((t) => t.code)
		.reduce((acc, t) => acc + (t.code?.split("\n").length || 0), 0);

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
				onClick={onClose}
			/>

			{/* Sidebar */}
			<div className="fixed right-0 top-0 h-full w-full md:w-[700px] lg:w-[800px] z-50 animate-in slide-in-from-right duration-300">
				<Card className="h-full border-l rounded-none flex flex-col overflow-hidden">
					{/* Header */}
					<div className="relative p-6 border-b">
						<div className="flex justify-between items-start">
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-2">
									<div className="p-2 rounded-lg bg-primary">
										{type === "csv_intelligence" ? (
											<BarChart3 className="w-5 h-5 text-primary-foreground" />
										) : (
											<Sparkles className="w-5 h-5 text-primary-foreground" />
										)}
									</div>
									<div>
										<h2 className="text-xl font-bold text-foreground">
											{type === "csv_intelligence"
												? "AI Data Analysis"
												: `Anomaly: ${metricName}`}
										</h2>
										<p className="text-xs text-muted-foreground mt-0.5">
											{type === "csv_intelligence"
												? `Analyzing ${file.name}`
												: "AI is analyzing what caused this drop"}
										</p>
									</div>
								</div>
								{totalCodeLines > 0 && (
									<div className="flex gap-2 mt-2">
										<Badge variant="outline" className="text-xs">
											<Code className="w-3 h-3 mr-1" />
											{totalCodeLines} lines of code generated
										</Badge>
										<Badge variant="secondary" className="text-xs">
											You wrote: 0 lines
										</Badge>
									</div>
								)}
							</div>
							<Button variant="ghost" size="icon" onClick={onClose}>
								<X className="w-5 h-5" />
							</Button>
						</div>

						{/* Tool Status */}
						{isStreaming && toolExecutions.length > 0 && (
							<div className="mt-3 flex flex-wrap gap-2">
								{toolExecutions.slice(-3).map((tool, index) => (
									<div
										key={index}
										className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-xs"
									>
										{tool.status === "running" && (
											<Loader2 className="w-3 h-3 animate-spin text-primary" />
										)}
										<span className="text-foreground">{tool.toolName}</span>
										<Badge
											variant={
												tool.status === "completed"
													? "default"
													: tool.status === "error"
														? "destructive"
														: "secondary"
											}
											className="text-xs px-1.5 py-0"
										>
											{tool.status}
										</Badge>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Messages Area - Fully Scrollable */}
					<div className="flex-1 overflow-y-auto p-4 space-y-4">
						{messages.map((msg, idx) => (
							<div key={idx} className="space-y-4">
								<div
									className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
								>
									{msg.role === "assistant" && (
										<div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
											<Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
										</div>
									)}
									<div className={`max-w-[85%] ${msg.role === "user" ? "order-1" : ""}`}>
										<div
											className={`rounded-2xl ${
												msg.role === "user"
													? "bg-primary text-primary-foreground"
													: "bg-card text-card-foreground border"
											}`}
										>
											<div className="px-5 py-4">
												<div className="flex items-center gap-2 mb-2">
													<p className="text-xs font-semibold uppercase tracking-wide opacity-70">
														{msg.role === "user" ? "You" : "AI Assistant"}
													</p>
													{isStreaming && idx === messages.length - 1 && (
														<div className="flex gap-1">
															<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
															<span
																className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
																style={{ animationDelay: "0.2s" }}
															/>
															<span
																className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
																style={{ animationDelay: "0.4s" }}
															/>
														</div>
													)}
												</div>
												<div className="text-sm whitespace-pre-wrap leading-relaxed">
													{msg.content || (
														<span className="text-muted-foreground italic">
															Thinking...
														</span>
													)}
												</div>
											</div>
										</div>

										{/* Code Display */}
										{msg.code && (
											<details className="mt-3 group">
												<summary className="cursor-pointer list-none">
													<Card className="hover:bg-muted transition-colors">
														<CardContent className="p-3">
															<div className="flex items-center justify-between">
																<div className="flex items-center gap-2">
																	<Code className="w-4 h-4 text-primary" />
																	<h3 className="text-sm font-semibold text-foreground">
																		View Generated Code
																	</h3>
																	<Badge variant="secondary" className="text-xs">
																		{msg.code.split("\n").length} lines
																	</Badge>
																</div>
																<span className="text-muted-foreground text-xs group-open:rotate-180 transition-transform">
																	▼
																</span>
															</div>
														</CardContent>
													</Card>
												</summary>
												<div className="mt-2">
													<CodeViewer code={msg.code} language="python" />
												</div>
											</details>
										)}
									</div>
									{msg.role === "user" && (
										<div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center order-2">
											<User className="w-3.5 h-3.5 text-primary-foreground" />
										</div>
									)}
								</div>
							</div>
						))}

						{/* Charts Display - Show during streaming */}
						{currentCharts.length > 0 && (
							<div className="space-y-6">
								{currentCharts.map((chart, index) => (
									<ChartDisplay key={index} tool={chart} />
								))}
							</div>
						)}

						{isStreaming && messages.length === 0 && (
							<div className="flex flex-col items-center justify-center py-16 space-y-4">
								<div className="relative">
									<div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
										<Sparkles className="w-7 h-7 text-primary-foreground" />
									</div>
									<div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
								</div>
								<div className="text-center space-y-2">
									<p className="text-base font-semibold text-foreground">
										Analyzing data...
									</p>
									<p className="text-xs text-muted-foreground">
										AI is loading and processing your data
									</p>
								</div>
							</div>
						)}

						<div ref={contentEndRef} />
					</div>

					{/* Input for follow-up questions */}
					<div className="p-4 border-t">
						<div className="flex items-start gap-2 mb-3">
							<div className="flex-1">
								<p className="text-xs font-medium text-foreground mb-1">
									Ask follow-up questions
								</p>
								<p className="text-xs text-muted-foreground">
									Try: "Show me outliers" or "Compare trends by region"
								</p>
							</div>
						</div>
						<div className="flex gap-2">
							<Input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										handleAsk();
									}
								}}
								placeholder="Ask a question..."
								className="flex-1 text-sm"
								disabled={isStreaming || !sessionId}
							/>
							<Button onClick={handleAsk} disabled={isStreaming || !input.trim()}>
								<Send className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</Card>
			</div>
		</>
	);
}
