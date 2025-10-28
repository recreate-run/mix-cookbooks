"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Upload, X, FileText, AlertCircle } from "lucide-react";

interface DataUploadZoneProps {
	onUpload: (file: File, data: string) => void;
	onClose: () => void;
}

export function DataUploadZone({ onUpload, onClose }: DataUploadZoneProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const processFile = useCallback(
		(file: File) => {
			setError(null);

			// Validate file type
			if (!file.name.endsWith(".csv")) {
				setError("Please upload a CSV file");
				return;
			}

			// Validate file size (max 10MB)
			if (file.size > 10 * 1024 * 1024) {
				setError("File size must be less than 10MB");
				return;
			}

			setSelectedFile(file);

			// Read file content
			const reader = new FileReader();
			reader.onload = (e) => {
				const content = e.target?.result as string;
				onUpload(file, content);
			};
			reader.onerror = () => {
				setError("Failed to read file");
			};
			reader.readAsText(file);
		},
		[onUpload],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);

			const files = Array.from(e.dataTransfer.files);
			if (files.length > 0) {
				processFile(files[0]);
			}
		},
		[processFile],
	);

	const handleFileSelect = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (files && files.length > 0) {
				processFile(files[0]);
			}
		},
		[processFile],
	);

	const loadSampleFile = useCallback(
		async (filename: string) => {
			try {
				setError(null);
				// Fetch the sample CSV from the public directory
				const response = await fetch(`/sample-data/${filename}`);
				if (!response.ok) throw new Error("Failed to load sample file");

				const content = await response.text();
				const file = new File([content], filename, { type: "text/csv" });

				setSelectedFile(file);
				onUpload(file, content);
			} catch (err) {
				setError(
					`Failed to load ${filename}: ${err instanceof Error ? err.message : "Unknown error"}`,
				);
			}
		},
		[onUpload],
	);

	return (
		<div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<Card className="w-full max-w-2xl">
				<CardContent className="pt-6">
					{/* Header */}
					<div className="flex items-center justify-between mb-6">
						<div>
							<h2 className="text-2xl font-bold text-foreground">
								Upload CSV File
							</h2>
							<p className="text-muted-foreground text-sm mt-1">
								Upload a CSV file to analyze with AI
							</p>
						</div>
						<Button variant="ghost" size="icon" onClick={onClose}>
							<X className="w-5 h-5" />
						</Button>
					</div>

					{/* Error Message */}
					{error && (
						<div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2">
							<AlertCircle className="w-4 h-4 text-destructive" />
							<p className="text-sm text-destructive">{error}</p>
						</div>
					)}

					{/* Upload Zone */}
					<div
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
							isDragging
								? "border-primary bg-primary/5"
								: "border-border bg-muted/30"
						}`}
					>
						<div className="flex flex-col items-center gap-4">
							<div className="p-4 rounded-full bg-primary/10">
								<Upload className="w-8 h-8 text-primary" />
							</div>

							<div>
								<p className="text-foreground font-medium mb-1">
									Drop your CSV file here
								</p>
								<p className="text-muted-foreground text-sm">or click to browse</p>
							</div>

							<input
								type="file"
								accept=".csv"
								onChange={handleFileSelect}
								className="hidden"
								id="file-upload"
							/>
							<label htmlFor="file-upload">
								<Button asChild variant="outline">
									<span>
										<FileText className="w-4 h-4 mr-2" />
										Choose File
									</span>
								</Button>
							</label>

							<p className="text-muted-foreground text-xs">
								Maximum file size: 10MB
							</p>
						</div>
					</div>

					{/* Selected File */}
					{selectedFile && (
						<div className="mt-4 p-4 rounded-lg bg-muted border border-border flex items-center justify-between">
							<div className="flex items-center gap-3">
								<FileText className="w-5 h-5 text-primary" />
								<div>
									<p className="text-foreground font-medium text-sm">
										{selectedFile.name}
									</p>
									<p className="text-muted-foreground text-xs">
										{(selectedFile.size / 1024).toFixed(2)} KB
									</p>
								</div>
							</div>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setSelectedFile(null)}
							>
								<X className="w-4 h-4" />
							</Button>
						</div>
					)}

					{/* Sample Files */}
					<div className="mt-6 pt-6 border-t border-border">
						<p className="text-sm font-medium text-foreground mb-3">
							Try our sample datasets:
						</p>
						<div className="flex flex-wrap gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => loadSampleFile("sales_2024.csv")}
							>
								Sales Data (50 rows)
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => loadSampleFile("user_signups.csv")}
							>
								User Signups (300 rows)
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => loadSampleFile("product_analytics.csv")}
							>
								Product Analytics (200 rows)
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
