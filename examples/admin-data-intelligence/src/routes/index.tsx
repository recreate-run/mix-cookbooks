"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataUploadZone } from "@/components/DataUploadZone";
import { AnalysisModal } from "@/components/AnalysisModal";
import {
	BarChart3,
	Users,
	ShoppingCart,
	TrendingDown,
	Sparkles,
	Upload,
} from "lucide-react";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const [showUploadZone, setShowUploadZone] = useState(false);
	const [showAnalysisModal, setShowAnalysisModal] = useState(false);
	const [analysisType, setAnalysisType] = useState<
		"csv_intelligence" | "anomaly_explanation"
	>("csv_intelligence");
	const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
	const [uploadedData, setUploadedData] = useState<{
		file: File;
		content: string;
	} | null>(null);

	const handleFileUpload = (file: File, content: string) => {
		console.log("File uploaded:", file.name);
		setUploadedData({ file, content });
		setShowUploadZone(false);

		// Open analysis modal with CSV intelligence
		setAnalysisType("csv_intelligence");
		setShowAnalysisModal(true);
	};

	// Sample metrics (these would come from API in production)
	const metrics = [
		{
			id: "revenue",
			title: "Monthly Revenue",
			value: "$124,592",
			change: "-12%",
			trend: "down" as const,
			icon: BarChart3,
			anomaly: true,
		},
		{
			id: "users",
			title: "Active Users",
			value: "8,234",
			change: "+5%",
			trend: "up" as const,
			icon: Users,
			anomaly: false,
		},
		{
			id: "orders",
			title: "Total Orders",
			value: "1,429",
			change: "-8%",
			trend: "down" as const,
			icon: ShoppingCart,
			anomaly: true,
		},
		{
			id: "conversion",
			title: "Conversion Rate",
			value: "3.24%",
			change: "-15%",
			trend: "down" as const,
			icon: TrendingDown,
			anomaly: true,
		},
	];

	const handleExplainAnomaly = (metricId: string) => {
		console.log("Explain anomaly for:", metricId);
		const metric = metrics.find((m) => m.id === metricId);
		if (metric) {
			setSelectedMetric(metric.title);
			setAnalysisType("anomaly_explanation");

			// Set dummy data for anomaly explanation
			const dummyData = {
				file: new File([""], "metrics.csv"),
				content: `date,revenue,orders,conversion\n2024-01-01,124592,1429,3.24\n2024-02-01,142000,1580,3.45\n2024-03-01,98000,1120,2.87`,
			};
			setUploadedData(dummyData);
			setShowAnalysisModal(true);
		}
	};

	const loadSampleCSV = async (filename: string) => {
		try {
			const response = await fetch(`/sample-data/${filename}`);
			if (!response.ok) throw new Error("Failed to load sample file");

			const content = await response.text();
			const file = new File([content], filename, { type: "text/csv" });

			setUploadedData({ file, content });
			setAnalysisType("csv_intelligence");
			setShowAnalysisModal(true);
		} catch (error) {
			console.error("Error loading sample CSV:", error);
		}
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-2">
						<div className="p-2 rounded-lg bg-primary">
							<BarChart3 className="w-6 h-6 text-primary-foreground" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-foreground">
								Admin Dashboard
							</h1>
							<p className="text-muted-foreground text-sm">
								AI-powered data intelligence - Upload CSV, explain anomalies,
								generate insights
							</p>
						</div>
					</div>
				</div>

				{/* Upload Section */}
				<Card className="mb-8">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-semibold text-foreground mb-1">
									CSV Intelligence
								</h3>
								<p className="text-muted-foreground text-sm">
									Upload a CSV file and let AI analyze it, create charts, and
									generate insights
								</p>
							</div>
							<Button onClick={() => setShowUploadZone(true)} size="lg">
								<Upload className="w-4 h-4 mr-2" />
								Upload CSV
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Metrics Grid */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold text-foreground">
							Key Metrics
						</h2>
						<Badge variant="secondary" className="text-xs">
							Last 30 days
						</Badge>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{metrics.map((metric) => {
							const Icon = metric.icon;
							return (
								<Card key={metric.id}>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium text-muted-foreground">
											{metric.title}
										</CardTitle>
										<Icon className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold text-foreground mb-1">
											{metric.value}
										</div>
										<div className="flex items-center justify-between">
											<span
												className={
													metric.trend === "up"
														? "text-green-600 dark:text-green-400 text-sm"
														: "text-red-600 dark:text-red-400 text-sm"
												}
											>
												{metric.change} vs last month
											</span>
										</div>
										{metric.anomaly && (
											<Button
												onClick={() => handleExplainAnomaly(metric.id)}
												variant="outline"
												size="sm"
												className="w-full mt-3"
											>
												<Sparkles className="w-3 h-3 mr-1" />
												Explain with AI
											</Button>
										)}
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>

				{/* Sample Data Section */}
				<Card>
					<CardHeader>
						<CardTitle className="text-foreground">Sample Datasets</CardTitle>
						<p className="text-muted-foreground text-sm">
							Try our sample CSV files to see AI analysis in action
						</p>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<Card className="border">
								<CardContent className="pt-4">
									<h3 className="font-semibold text-foreground mb-1">
										Sales Data
									</h3>
									<p className="text-muted-foreground text-sm mb-3">
										50 rows of sales data with products, revenue, and regions
									</p>
									<Button
										variant="outline"
										size="sm"
										className="w-full"
										onClick={() => loadSampleCSV("sales_2024.csv")}
									>
										<Upload className="w-3 h-3 mr-1" />
										Load Sample
									</Button>
								</CardContent>
							</Card>

							<Card className="border">
								<CardContent className="pt-4">
									<h3 className="font-semibold text-foreground mb-1">
										User Signups
									</h3>
									<p className="text-muted-foreground text-sm mb-3">
										300 rows of user signup data with conversion metrics
									</p>
									<Button
										variant="outline"
										size="sm"
										className="w-full"
										onClick={() => loadSampleCSV("user_signups.csv")}
									>
										<Upload className="w-3 h-3 mr-1" />
										Load Sample
									</Button>
								</CardContent>
							</Card>

							<Card className="border">
								<CardContent className="pt-4">
									<h3 className="font-semibold text-foreground mb-1">
										Product Analytics
									</h3>
									<p className="text-muted-foreground text-sm mb-3">
										200 rows of product performance data with ratings
									</p>
									<Button
										variant="outline"
										size="sm"
										className="w-full"
										onClick={() => loadSampleCSV("product_analytics.csv")}
									>
										<Upload className="w-3 h-3 mr-1" />
										Load Sample
									</Button>
								</CardContent>
							</Card>
						</div>
					</CardContent>
				</Card>

				{/* Upload Zone Modal */}
				{showUploadZone && (
					<DataUploadZone
						onUpload={handleFileUpload}
						onClose={() => setShowUploadZone(false)}
					/>
				)}

				{/* Analysis Modal */}
				{showAnalysisModal && uploadedData && (
					<AnalysisModal
						file={uploadedData.file}
						onClose={() => setShowAnalysisModal(false)}
						type={analysisType}
						metricName={selectedMetric || undefined}
					/>
				)}
			</div>
		</div>
	);
}
