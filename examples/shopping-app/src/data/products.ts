export interface Product {
	id: string;
	name: string;
	price: number;
	brand: string;
	specs: {
		processor: string;
		ram: string;
		storage: string;
		display: string;
		battery: string;
		graphics?: string;
		weight: string;
	};
	image: string;
}

export const products: Product[] = [
	{
		id: "1",
		name: 'MacBook Pro 14"',
		price: 1999,
		brand: "Apple",
		specs: {
			processor: "M3 Pro",
			ram: "16GB",
			storage: "512GB SSD",
			display: '14.2" Liquid Retina XDR',
			battery: "17 hours",
			weight: "3.5 lbs",
		},
		image: "https://placehold.co/300x200/1e293b/white?text=MacBook+Pro",
	},
	{
		id: "2",
		name: "Dell XPS 15",
		price: 1799,
		brand: "Dell",
		specs: {
			processor: "Intel Core i7-13700H",
			ram: "16GB",
			storage: "512GB SSD",
			display: '15.6" FHD+',
			battery: "12 hours",
			graphics: "NVIDIA RTX 4050",
			weight: "4.2 lbs",
		},
		image: "https://placehold.co/300x200/334155/white?text=Dell+XPS+15",
	},
	{
		id: "3",
		name: "Lenovo ThinkPad X1 Carbon",
		price: 1899,
		brand: "Lenovo",
		specs: {
			processor: "Intel Core i7-1365U",
			ram: "16GB",
			storage: "512GB SSD",
			display: '14" WUXGA',
			battery: "15 hours",
			weight: "2.5 lbs",
		},
		image: "https://placehold.co/300x200/475569/white?text=ThinkPad+X1",
	},
	{
		id: "4",
		name: "ASUS ROG Zephyrus G14",
		price: 1649,
		brand: "ASUS",
		specs: {
			processor: "AMD Ryzen 9 7940HS",
			ram: "16GB",
			storage: "1TB SSD",
			display: '14" QHD',
			battery: "10 hours",
			graphics: "NVIDIA RTX 4060",
			weight: "3.6 lbs",
		},
		image: "https://placehold.co/300x200/64748b/white?text=ROG+G14",
	},
	{
		id: "5",
		name: "Microsoft Surface Laptop 5",
		price: 1499,
		brand: "Microsoft",
		specs: {
			processor: "Intel Core i7-1255U",
			ram: "16GB",
			storage: "512GB SSD",
			display: '13.5" PixelSense',
			battery: "18 hours",
			weight: "2.8 lbs",
		},
		image: "https://placehold.co/300x200/94a3b8/white?text=Surface+Laptop",
	},
	{
		id: "6",
		name: "HP Spectre x360",
		price: 1549,
		brand: "HP",
		specs: {
			processor: "Intel Core i7-1355U",
			ram: "16GB",
			storage: "512GB SSD",
			display: '13.5" WUXGA+ Touch',
			battery: "16 hours",
			weight: "3.0 lbs",
		},
		image: "https://placehold.co/300x200/cbd5e1/white?text=HP+Spectre",
	},
];
