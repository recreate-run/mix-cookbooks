import { createFileRoute } from "@tanstack/react-router";
import { ProductGrid } from "@/components/ProductGrid";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return <ProductGrid />;
}
