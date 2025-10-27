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
			<div className="min-h-screen bg-background p-8">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<div className="flex justify-between items-center mb-8">
						<div>
							<h1 className="text-4xl font-bold text-foreground mb-2">
								Premium Laptops
							</h1>
							<p className="text-muted-foreground">
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
							>
								📊 Compare Specs
								{selected.length > 0 && ` (${selected.length})`}
							</Button>
							<Button
								onClick={() => handleCompare("research")}
								disabled={selected.length < 2}
								size="lg"
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
								className={`cursor-pointer transition-all hover:shadow-xl ${
									selected.includes(product.id)
										? "ring-4 ring-primary"
										: "hover:border-ring"
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
														? "bg-primary border-primary"
														: "border-muted-foreground hover:border-ring"
												}`}
											>
												{selected.includes(product.id) && (
													<Check className="w-4 h-4 text-primary-foreground" />
												)}
											</div>
											<div>
												<h3 className="font-semibold text-lg text-foreground">
													{product.name}
												</h3>
												<p className="text-muted-foreground text-sm">
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
									<p className="text-3xl font-bold text-primary mb-4">
										${product.price.toLocaleString()}
									</p>

									{/* Specs */}
									<div className="space-y-2 text-sm text-foreground">
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
