export interface MediaAsset {
	id: string;
	filename: string;
	url: string;
	thumbnailUrl: string;
	size: number;
	uploadDate: Date;
	tags: string[];
	altText?: string;
	category: "nature" | "food" | "tech" | "people" | "abstract";
}

// Sample media library with diverse images (using placeholder service)
export const sampleMedia: MediaAsset[] = [
	// Nature
	{
		id: "1",
		filename: "sunset-beach.jpg",
		url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
		size: 2457600,
		uploadDate: new Date("2024-01-15"),
		tags: ["sunset", "beach", "ocean"],
		category: "nature",
	},
	{
		id: "2",
		filename: "mountain-landscape.jpg",
		url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
		size: 3145728,
		uploadDate: new Date("2024-01-16"),
		tags: ["mountain", "landscape", "nature"],
		category: "nature",
	},
	{
		id: "3",
		filename: "forest-path.jpg",
		url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
		size: 2097152,
		uploadDate: new Date("2024-01-17"),
		tags: ["forest", "trees", "path"],
		category: "nature",
	},
	// Food
	{
		id: "4",
		filename: "coffee-desk.jpg",
		url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
		size: 1835008,
		uploadDate: new Date("2024-01-18"),
		tags: ["coffee", "desk", "workspace"],
		category: "food",
	},
	{
		id: "5",
		filename: "restaurant-meal.jpg",
		url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
		size: 2621440,
		uploadDate: new Date("2024-01-19"),
		tags: ["food", "meal", "restaurant"],
		category: "food",
	},
	{
		id: "6",
		filename: "fresh-fruits.jpg",
		url: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400",
		size: 1572864,
		uploadDate: new Date("2024-01-20"),
		tags: ["fruits", "healthy", "fresh"],
		category: "food",
	},
	// Tech
	{
		id: "7",
		filename: "laptop-workspace.jpg",
		url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
		size: 2359296,
		uploadDate: new Date("2024-01-21"),
		tags: ["laptop", "coding", "workspace"],
		category: "tech",
	},
	{
		id: "8",
		filename: "smartphone-closeup.jpg",
		url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
		size: 1966080,
		uploadDate: new Date("2024-01-22"),
		tags: ["phone", "technology", "mobile"],
		category: "tech",
	},
	{
		id: "9",
		filename: "office-desk.jpg",
		url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400",
		size: 2752512,
		uploadDate: new Date("2024-01-23"),
		tags: ["office", "desk", "professional"],
		category: "tech",
	},
	// People
	{
		id: "10",
		filename: "team-meeting.jpg",
		url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
		size: 3407872,
		uploadDate: new Date("2024-01-24"),
		tags: ["team", "meeting", "collaboration"],
		category: "people",
	},
	{
		id: "11",
		filename: "portrait-woman.jpg",
		url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
		size: 1310720,
		uploadDate: new Date("2024-01-25"),
		tags: ["portrait", "professional", "person"],
		category: "people",
	},
	{
		id: "12",
		filename: "working-together.jpg",
		url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400",
		size: 2883584,
		uploadDate: new Date("2024-01-26"),
		tags: ["teamwork", "office", "collaboration"],
		category: "people",
	},
	// Abstract
	{
		id: "13",
		filename: "geometric-pattern.jpg",
		url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400",
		size: 1048576,
		uploadDate: new Date("2024-01-27"),
		tags: ["abstract", "pattern", "geometric"],
		category: "abstract",
	},
	{
		id: "14",
		filename: "colorful-paint.jpg",
		url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400",
		size: 1572864,
		uploadDate: new Date("2024-01-28"),
		tags: ["abstract", "colors", "art"],
		category: "abstract",
	},
	{
		id: "15",
		filename: "texture-closeup.jpg",
		url: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=400",
		size: 983040,
		uploadDate: new Date("2024-01-29"),
		tags: ["texture", "abstract", "pattern"],
		category: "abstract",
	},
	// More Nature
	{
		id: "16",
		filename: "ocean-waves.jpg",
		url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400",
		size: 2621440,
		uploadDate: new Date("2024-01-30"),
		tags: ["ocean", "waves", "water"],
		category: "nature",
	},
	{
		id: "17",
		filename: "flower-closeup.jpg",
		url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400",
		size: 1441792,
		uploadDate: new Date("2024-01-31"),
		tags: ["flower", "nature", "closeup"],
		category: "nature",
	},
	{
		id: "18",
		filename: "desert-landscape.jpg",
		url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400",
		size: 2097152,
		uploadDate: new Date("2024-02-01"),
		tags: ["desert", "landscape", "sand"],
		category: "nature",
	},
	// More Food
	{
		id: "19",
		filename: "breakfast-plate.jpg",
		url: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400",
		size: 2228224,
		uploadDate: new Date("2024-02-02"),
		tags: ["breakfast", "food", "healthy"],
		category: "food",
	},
	{
		id: "20",
		filename: "pizza-slice.jpg",
		url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
		size: 1835008,
		uploadDate: new Date("2024-02-03"),
		tags: ["pizza", "food", "restaurant"],
		category: "food",
	},
	// More Tech
	{
		id: "21",
		filename: "keyboard-closeup.jpg",
		url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
		size: 1703936,
		uploadDate: new Date("2024-02-04"),
		tags: ["keyboard", "tech", "workspace"],
		category: "tech",
	},
	{
		id: "22",
		filename: "monitor-desk.jpg",
		url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
		size: 2490368,
		uploadDate: new Date("2024-02-05"),
		tags: ["monitor", "desk", "workspace"],
		category: "tech",
	},
	// More People
	{
		id: "23",
		filename: "business-handshake.jpg",
		url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400",
		size: 2097152,
		uploadDate: new Date("2024-02-06"),
		tags: ["business", "handshake", "professional"],
		category: "people",
	},
	{
		id: "24",
		filename: "creative-team.jpg",
		url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400",
		size: 3145728,
		uploadDate: new Date("2024-02-07"),
		tags: ["team", "creative", "office"],
		category: "people",
	},
];

// Helper function to format file size
export function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Helper function to format date
export function formatDate(date: Date): string {
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}
