import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Portfolio Analyzer - Mix SDK Example",
			},
			{
				name: "description",
				content: "AI-powered portfolio analysis with CSV upload, real-time streaming, and visualizations using Mix SDK and TanStack Start",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	shellComponent: RootDocument,
});

function RootComponent() {
	return <Outlet />;
}

function NotFoundComponent() {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-6">
			<div className="text-center">
				<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
					404 - Page Not Found
				</h1>
				<p className="text-gray-600 dark:text-gray-400 mb-8">
					The page you're looking for doesn't exist.
				</p>
				<a
					href="/"
					className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
				>
					Go Home
				</a>
			</div>
		</div>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
