"use client";

import { useState } from "react";
import { products } from "@/data/products";
import { ComparisonModal } from "./ComparisonModal";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Check } from "lucide-react";

export function ProductGrid() {
	const [selected, setSelected] = useState<string[]>([]);
	const [showComparison, setShowComparison] = useState(false);

	const toggleSelect = (id: string) => {
		setSelected((prev) =>
			prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
		);
	};

	const [comparisonMode, setComparisonMode] = useState<
		"specs" | "research" | null
	>(null);

	const handleCompare = (mode: "specs" | "research") => {
		if (selected.length >= 2) {
			setComparisonMode(mode);
			setShowComparison(true);
		}
	};

	const selectedProducts = products.filter((p) => selected.includes(p.id));

	return (
		<>
			<div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 p-8">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<div className="flex justify-between items-center mb-8">
						<div>
							<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-200 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent mb-2">
								Premium Laptops
							</h1>
							<p className="text-purple-300/60">
								Select 2 or more products to compare with AI
							</p>
						</div>

						{/* Compare Buttons */}
						<div className="flex gap-3">
							<Button
								onClick={() => handleCompare("specs")}
								disabled={selected.length < 2}
								size="lg"
								variant="outline"
								className="border-purple-500/30 text-purple-200 hover:bg-purple-900/30 hover:text-purple-100 disabled:opacity-50 transition-all"
							>
								📊 Compare Specs
								{selected.length > 0 && ` (${selected.length})`}
							</Button>
							<Button
								onClick={() => handleCompare("research")}
								disabled={selected.length < 2}
								size="lg"
								className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30 disabled:opacity-50 transition-all"
							>
								🔍 Research with AI
								{selected.length > 0 && ` (${selected.length})`}
							</Button>
						</div>
					</div>

					{/* Product Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{products.map((product) => (
							<Card
								key={product.id}
								className={`cursor-pointer transition-all hover:shadow-xl border ${
									selected.includes(product.id)
										? "ring-4 ring-purple-500 bg-gradient-to-br from-slate-900/90 to-purple-950/50 border-purple-500/50 shadow-purple-500/20"
										: "bg-slate-900/50 hover:bg-slate-900/70 border-slate-700/30 hover:border-purple-500/30"
								}`}
								onClick={() => toggleSelect(product.id)}
							>
								<div className="p-6">
									{/* Selection Indicator */}
									<div className="flex items-start justify-between mb-4">
										<div className="flex items-center gap-2">
											<div
												className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
													selected.includes(product.id)
														? "bg-gradient-to-br from-purple-500 to-pink-500 border-purple-500 shadow-lg shadow-purple-500/30"
														: "border-slate-600 hover:border-purple-500/50"
												}`}
											>
												{selected.includes(product.id) && (
													<Check className="w-4 h-4 text-white" />
												)}
											</div>
											<div>
												<h3 className="font-semibold text-lg text-white">
													{product.name}
												</h3>
												<p className="text-purple-300/60 text-sm">
													{product.brand}
												</p>
											</div>
										</div>
									</div>

									{/* Product Image */}
									<img
										src={product.image}
										alt={product.name}
										className="w-full h-40 object-cover rounded-lg mb-4"
									/>

									{/* Price */}
									<p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent mb-4">
										${product.price.toLocaleString()}
									</p>

									{/* Specs */}
									<div className="space-y-2 text-sm text-slate-300">
										<p>• {product.specs.processor}</p>
										<p>• {product.specs.ram} RAM</p>
										<p>• {product.specs.storage}</p>
										<p>• {product.specs.battery} battery</p>
										{product.specs.graphics && (
											<p>• {product.specs.graphics}</p>
										)}
										<p>• {product.specs.weight}</p>
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>
			</div>

			{/* Comparison Modal */}
			{showComparison && comparisonMode && (
				<ComparisonModal
					products={selectedProducts}
					mode={comparisonMode}
					onClose={() => {
						setShowComparison(false);
						setComparisonMode(null);
					}}
				/>
			)}
		</>
	);
}
