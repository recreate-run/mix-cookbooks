"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/data/products";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { X, Send, Loader2, Sparkles, User } from "lucide-react";
import { Input } from "./ui/input";

import type { ResearchStep } from "./ResearchProgress";
import { ResearchProgress } from "./ResearchProgress";
import type { Source } from "./SourcesList";
import { SourcesList } from "./SourcesList";
import { ChartsDisplay } from "./ChartsDisplay";

interface ComparisonModalProps {
	products: Product[];
	mode: "specs" | "research";
	onClose: () => void;
}

interface Message {
	role: "user" | "assistant";
	content: string;
}

export function ComparisonModal({
	products,
	mode: initialMode,
	onClose,
}: ComparisonModalProps) {
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const [mode, setMode] = useState<"specs" | "research">(initialMode);

	// Research mode state
	const [researchSteps, setResearchSteps] = useState<ResearchStep[]>([]);
	const [sources, setSources] = useState<Source[]>([]);
	const [charts, setCharts] = useState<string[]>([]);

	// Tool tracking helper
	const updateStepStatus = (
		icon: string,
		status: "pending" | "in_progress" | "complete",
	) => {
		setResearchSteps((prev) =>
			prev.map((step) =>
				step.icon === icon ? { ...step, status } : step,
			),
		);
	};

	const updateStepDetails = (icon: string, details: string) => {
		setResearchSteps((prev) =>
			prev.map((step) =>
				step.icon === icon ? { ...step, details } : step,
			),
		);
	};

	// biome-ignore lint/suspicious/noExplicitAny: Tool data structure varies
	const handleToolUse = (tool: any) => {
		if (tool.name === "Search") {
			updateStepStatus("🔍", "in_progress");
			const query = tool.input?.query || "";
			if (query) {
				updateStepDetails("🔍", `Searching: "${query.slice(0, 50)}..."`);
			}
			setTimeout(() => {
				updateStepStatus("🔍", "complete");
				updateStepStatus("📖", "in_progress");
			}, 1000);
		}

		if (tool.name === "ReadText") {
			updateStepStatus("📖", "in_progress");
			// Update count
			setTimeout(() => {
				setSources((prev) => {
					updateStepDetails("📖", `Read ${prev.length} sources`);
					return prev;
				});
			}, 500);
		}

		if (tool.name === "PythonExecution") {
			const code = tool.input?.code || tool.input || "";

			if (
				code.includes("sentiment") ||
				code.includes("positive") ||
				code.includes("negative")
			) {
				updateStepStatus("📊", "in_progress");
				updateStepDetails("📊", "Analyzing sentiment...");
				setTimeout(() => updateStepStatus("📊", "complete"), 1500);
			}

			if (code.includes("matplotlib") || code.includes("plt.")) {
				updateStepStatus("📈", "in_progress");
				updateStepDetails("📈", "Creating comparison charts...");
				setTimeout(() => updateStepStatus("📈", "complete"), 1500);
			}
		}

		if (tool.name === "ShowMedia") {
			updateStepStatus("📈", "complete");
			updateStepStatus("✍️", "in_progress");

			// Extract chart URLs
			try {
				const outputs = tool.input?.outputs || [];
				const chartUrls = outputs
					.filter((o: { type: string }) => o.type === "image")
					.map((o: { url: string }) => o.url);

				if (chartUrls.length > 0) {
					setCharts((prev) => [...prev, ...chartUrls]);
				}
			} catch {}
		}
	};

	// Initialize research steps for research mode
	useEffect(() => {
		if (mode === "research") {
			setResearchSteps([
				{ icon: "🔍", label: "Searching for reviews", status: "pending" },
				{
					icon: "📖",
					label: "Reading sources",
					status: "pending",
					details: "",
				},
				{ icon: "📊", label: "Analyzing sentiment", status: "pending" },
				{ icon: "📈", label: "Generating visualizations", status: "pending" },
				{ icon: "✍️", label: "Writing synthesis", status: "pending" },
			]);
		}
	}, [mode]);

	// Create session and start comparison
	useEffect(() => {
		async function startComparison() {
			try {
				// 1. Create Mix session
				const sessionRes = await fetch("/api/session", { method: "POST" });
				if (!sessionRes.ok) throw new Error("Failed to create session");

				const sessionData = await sessionRes.json();
				const sid = sessionData.session.id;
				setSessionId(sid);

				// 2. Build context with product details
				const productContext = products
					.map(
						(p) => `
Product: ${p.name}
Brand: ${p.brand}
Price: $${p.price}
Specs:
  - Processor: ${p.specs.processor}
  - RAM: ${p.specs.ram}
  - Storage: ${p.specs.storage}
  - Display: ${p.specs.display}
  - Battery: ${p.specs.battery}
  ${p.specs.graphics ? `- Graphics: ${p.specs.graphics}` : ""}
  - Weight: ${p.specs.weight}
`,
					)
					.join("\n---\n");

				// 3. Build prompt based on mode
				const prompt =
					mode === "specs"
						? `Compare these laptops in a CONCISE format with visual aids:

${productContext}

Create a comparison that includes:

1. **Comparison Table** - Key specs side-by-side (processor, RAM, storage, battery, weight, price)

2. **Visual Charts** - Use ASCII bar charts or rating scales (★★★★☆) for:
   - Performance (based on processor/RAM)
   - Portability (based on weight/battery)
   - Value for Money (price vs specs)
   - Gaming Capability (if graphics card present)

3. **One-Liner Strengths** - Single sentence per laptop highlighting main advantage

4. **Best For** - Quick recommendations:
   - 💼 Best for Work:
   - 🎮 Best for Gaming:
   - ✈️ Best for Travel:
   - 💰 Best Value:

Keep it CONCISE and VISUAL. Use emojis, tables, and charts to make comparisons easy to understand at a glance.`
						: `Research and compare these products using web sources:

Products:
${products.map((p) => `- ${p.name} (${p.brand}, $${p.price})`).join("\n")}

Your autonomous workflow:
1. Use Search tool to find professional reviews for each product (search for "[product name] review 2024")
2. Use ReadText tool to read 3-5 review articles per product from reputable tech sites
3. Use PythonExecution tool to:
   - Extract sentiment (positive/negative/neutral) from reviews
   - Aggregate expert ratings if available
   - Calculate average scores and statistics
4. Use ShowMedia tool to generate:
   - Sentiment comparison chart (bar chart or pie chart)
   - Expert ratings comparison (bar chart)
   - Pros/cons visualization
5. Write a comprehensive synthesis with inline citations [1][2][3]

Requirements:
- Every claim must be cited with source number [1][2]
- Provide complete source list at end with URLs
- Compare based on REAL user/expert opinions, not just specs
- Include sentiment analysis showing positive/negative feedback
- Show aggregated expert ratings if found

Focus on: real-world performance, value for money, reliability, user satisfaction, common issues reported.`;

				// 4. Start streaming AI response
				setIsStreaming(true);
				let aiContent = "";
				setMessages([{ role: "assistant", content: "" }]);

				const eventSource = new EventSource(
					`/api/stream/${sid}?message=${encodeURIComponent(prompt)}`,
				);

				eventSource.addEventListener("content", (event) => {
					const data = JSON.parse(event.data);
					if (data.content) {
						aiContent += data.content;
						setMessages([{ role: "assistant", content: aiContent }]);
					}
				});

				// Track tool usage for research mode
				if (mode === "research") {
					eventSource.addEventListener("tool_call", (event) => {
						const data = JSON.parse(event.data);
						handleToolUse(data);
					});

					eventSource.addEventListener("tool_parameter_delta", (event) => {
						const data = JSON.parse(event.data);
						if (data.name === "ReadText" && data.parameter === "url") {
							// Extract domain from URL for display
							try {
								const url = data.delta || "";
								if (url.startsWith("http")) {
									const domain = new URL(url).hostname.replace("www.", "");
									setSources((prev) => [
										...prev,
										{ url, title: domain, status: "reading" },
									]);
								}
							} catch {}
						}
					});
				}

				eventSource.addEventListener("complete", () => {
					setIsStreaming(false);
					eventSource.close();
					if (mode === "research") {
						// Mark all steps complete
						setResearchSteps((prev) =>
							prev.map((step) => ({ ...step, status: "complete" })),
						);
						// Mark all sources complete
						setSources((prev) =>
							prev.map((s) => ({ ...s, status: "complete" })),
						);
					}
				});

				eventSource.addEventListener("error", () => {
					setIsStreaming(false);
					eventSource.close();
				});

				eventSource.onerror = () => {
					setIsStreaming(false);
					eventSource.close();
				};
			} catch (error) {
				console.error("Failed to start comparison:", error);
				setMessages([
					{
						role: "assistant",
						content:
							"Sorry, I couldn't start the comparison. Please make sure Mix server is running.",
					},
				]);
			}
		}

		startComparison();
	}, [products, mode]);

	// Handle follow-up questions
	const handleAsk = async () => {
		if (!input.trim() || !sessionId || isStreaming) return;

		const userMessage = input.trim();
		setInput("");

		// Add user question
		setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

		// Remind AI about the products in context
		const productNames = products.map((p) => p.name).join(" and ");
		const contextualPrompt = `Regarding the ${productNames} comparison: ${userMessage}`;

		// Stream AI answer
		setIsStreaming(true);
		let aiContent = "";
		setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

		const eventSource = new EventSource(
			`/api/stream/${sessionId}?message=${encodeURIComponent(contextualPrompt)}`,
		);

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

		eventSource.addEventListener("complete", () => {
			setIsStreaming(false);
			eventSource.close();
		});

		eventSource.addEventListener("error", () => {
			setIsStreaming(false);
			eventSource.close();
		});
	};

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
				onClick={onClose}
			/>

			{/* Sidebar */}
			<div className="fixed right-0 top-0 h-full w-full md:w-[600px] lg:w-[700px] z-50 animate-in slide-in-from-right duration-300">
				<Card className="h-full bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 border-l border-purple-500/20 shadow-2xl shadow-purple-500/10 rounded-none flex flex-col overflow-hidden">
					{/* Header */}
					<div className="relative p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-950/30 via-slate-900/50 to-fuchsia-950/30">
						<div className="flex justify-between items-start">
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-3">
									<div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 shadow-lg shadow-purple-500/50">
										<Sparkles className="w-5 h-5 text-white" />
									</div>
									<div>
										<h2 className="text-xl font-bold bg-gradient-to-r from-purple-200 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
											AI Product Comparison
										</h2>
										<p className="text-xs text-purple-300/70 mt-0.5">
											Powered by Mix AI
										</p>
									</div>
								</div>
								<div className="flex flex-wrap gap-2">
									{products.map((product) => (
										<Badge
											key={product.id}
											variant="secondary"
											className="bg-purple-900/30 text-purple-200 border-purple-500/30 px-2 py-0.5 text-xs hover:bg-purple-900/40 transition-colors"
										>
											{product.name}
										</Badge>
									))}
								</div>
							</div>
							<Button
								variant="ghost"
								size="icon"
								onClick={onClose}
								className="text-purple-300/70 hover:text-purple-100 hover:bg-purple-900/30"
							>
								<X className="w-5 h-5" />
							</Button>
						</div>
					</div>

				{/* Mode Toggle */}
				<div className="px-4 py-3 border-b border-purple-500/20 bg-slate-950/50">
					<div className="flex gap-2">
						<Button
							variant={mode === "specs" ? "default" : "outline"}
							size="sm"
							onClick={() => setMode("specs")}
							disabled={isStreaming}
							className={
								mode === "specs"
									? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white"
									: "border-purple-500/30 text-purple-300 hover:bg-purple-900/30"
							}
						>
							📊 Compare Specs (Fast)
						</Button>
						<Button
							variant={mode === "research" ? "default" : "outline"}
							size="sm"
							onClick={() => setMode("research")}
							disabled={isStreaming}
							className={
								mode === "research"
									? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white"
									: "border-purple-500/30 text-purple-300 hover:bg-purple-900/30"
							}
						>
							🔍 Research with AI (Thorough)
						</Button>
					</div>
					<p className="text-xs text-purple-300/50 mt-2">
						{mode === "specs"
							? "Quick comparison based on product specs"
							: "In-depth research with web search, reviews, and sentiment analysis"}
					</p>
				</div>

				{/* Messages */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-950/50 to-purple-950/20">
					{/* Research Components (show when in research mode) */}
					{mode === "research" && researchSteps.length > 0 && (
						<>
							<ResearchProgress steps={researchSteps} />
							<SourcesList sources={sources} />
							<ChartsDisplay charts={charts} />
						</>
					)}

					{messages.map((msg, idx) => (
						<div
							key={idx}
							className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
						>
							{msg.role === "assistant" && (
								<div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
									<Sparkles className="w-3.5 h-3.5 text-white" />
								</div>
							)}
							<div
								className={`max-w-[85%] rounded-2xl shadow-lg ${
									msg.role === "user"
										? "bg-gradient-to-br from-fuchsia-600 to-pink-600 text-white shadow-fuchsia-500/20"
										: "bg-slate-900/90 text-slate-100 border border-purple-500/20 shadow-purple-500/10"
								}`}
							>
								<div className="px-5 py-4">
									<div className="flex items-center gap-2 mb-2">
										<p className="text-xs font-semibold uppercase tracking-wide opacity-70">
											{msg.role === "user" ? "You" : "AI Assistant"}
										</p>
										{isStreaming && idx === messages.length - 1 && (
											<div className="flex gap-1">
												<span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
												<span
													className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse"
													style={{ animationDelay: "0.2s" }}
												/>
												<span
													className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse"
													style={{ animationDelay: "0.4s" }}
												/>
											</div>
										)}
									</div>
									<div className="text-sm whitespace-pre-wrap leading-relaxed">
										{msg.content || (
											<span className="text-purple-300/60 italic">
												Thinking...
											</span>
										)}
									</div>
								</div>
							</div>
							{msg.role === "user" && (
								<div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-fuchsia-600 to-pink-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
									<User className="w-3.5 h-3.5 text-white" />
								</div>
							)}
						</div>
					))}

					{isStreaming && messages.length === 0 && (
						<div className="flex flex-col items-center justify-center py-16 space-y-4">
							<div className="relative">
								<div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50">
									<Sparkles className="w-7 h-7 text-white" />
								</div>
								<div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-ping opacity-20" />
							</div>
							<div className="text-center space-y-2">
								<p className="text-base font-semibold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
									Analyzing products...
								</p>
								<p className="text-xs text-purple-300/60">
									AI is comparing specs, features, and value
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Input for follow-up questions */}
				<div className="p-4 border-t border-purple-500/20 bg-gradient-to-r from-purple-950/30 via-slate-900/50 to-fuchsia-950/30">
					<div className="flex items-start gap-2 mb-3">
						<div className="flex-1">
							<p className="text-xs font-medium text-purple-200 mb-1">
								Ask follow-up questions
							</p>
							<p className="text-xs text-purple-300/50">
								Try: "Which is best for gaming?" or "Compare battery life"
							</p>
						</div>
					</div>
					<div className="flex gap-2">
						<Input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && !isStreaming && handleAsk()}
							placeholder="Ask a question..."
							className="flex-1 bg-slate-900/50 border-purple-500/30 text-white placeholder:text-purple-300/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
							disabled={isStreaming}
						/>
						<Button
							onClick={handleAsk}
							disabled={isStreaming || !input.trim()}
							className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						>
							<Send className="w-4 h-4" />
						</Button>
					</div>
				</div>
				</Card>
			</div>
		</>
	);
}
