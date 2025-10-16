"use client";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ZoomIn, ZoomOut, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MockGoogleMapProps {
	latitude: number;
	longitude: number;
	accuracy?: number;
	deviceName?: string;
	className?: string;
}

export default function MockGoogleMap({ 
	latitude, 
	longitude, 
	accuracy = 10, 
	deviceName = "Device Location",
	className = ""
}: MockGoogleMapProps) {
	return (
		<Card className={`overflow-hidden ${className}`}>
			<CardContent className="p-0">
				<div className="relative">
					{/* Mock Google Maps Image */}
					<div className="relative w-full h-96 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900">
						{/* Grid pattern to simulate map */}
						<div className="absolute inset-0 opacity-20">
							<svg width="100%" height="100%" className="absolute inset-0">
								<defs>
									<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
										<path d="M 40 0 L 0 0 0 40" fill="none" stroke="#666" strokeWidth="1"/>
									</pattern>
								</defs>
								<rect width="100%" height="100%" fill="url(#grid)" />
							</svg>
						</div>
						
						{/* Mock street lines */}
						<div className="absolute inset-0">
							<svg width="100%" height="100%" className="absolute inset-0">
								{/* Horizontal streets */}
								<line x1="0" y1="30%" x2="100%" y2="30%" stroke="#333" strokeWidth="3" opacity="0.6"/>
								<line x1="0" y1="50%" x2="100%" y2="50%" stroke="#333" strokeWidth="3" opacity="0.6"/>
								<line x1="0" y1="70%" x2="100%" y2="70%" stroke="#333" strokeWidth="3" opacity="0.6"/>
								
								{/* Vertical streets */}
								<line x1="20%" y1="0" x2="20%" y2="100%" stroke="#333" strokeWidth="3" opacity="0.6"/>
								<line x1="50%" y1="0" x2="50%" y2="100%" stroke="#333" strokeWidth="3" opacity="0.6"/>
								<line x1="80%" y1="0" x2="80%" y2="100%" stroke="#333" strokeWidth="3" opacity="0.6"/>
							</svg>
						</div>

						{/* Mock buildings */}
						<div className="absolute top-20 left-16 w-8 h-12 bg-gray-400 rounded-sm opacity-70"></div>
						<div className="absolute top-32 right-20 w-6 h-16 bg-gray-500 rounded-sm opacity-70"></div>
						<div className="absolute bottom-20 left-32 w-10 h-8 bg-gray-400 rounded-sm opacity-70"></div>
						<div className="absolute bottom-32 right-16 w-7 h-14 bg-gray-500 rounded-sm opacity-70"></div>

						{/* Device location marker */}
						<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
							<div className="relative">
								{/* Accuracy circle */}
								<div 
									className="absolute border-2 border-red-400 rounded-full opacity-50"
									style={{
										width: `${Math.max(20, accuracy * 2)}px`,
										height: `${Math.max(20, accuracy * 2)}px`,
										left: '50%',
										top: '50%',
										transform: 'translate(-50%, -50%)'
									}}
								></div>
								
								{/* Device marker */}
								<div className="relative z-10">
									<div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
										<MapPin className="w-3 h-3 text-white" />
									</div>
									{/* Marker shadow */}
									<div className="absolute top-1 left-1 w-6 h-6 bg-black rounded-full opacity-20 -z-10"></div>
								</div>
							</div>
						</div>

						{/* Mock Google Maps UI elements */}
						<div className="absolute top-4 left-4 right-4 flex justify-between items-start">
							{/* Search bar */}
							<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 min-w-64">
								<MapPin className="w-4 h-4 text-gray-500" />
								<span className="text-sm text-gray-600 dark:text-gray-300">
									{latitude.toFixed(6)}, {longitude.toFixed(6)}
								</span>
							</div>
							
							{/* Map controls */}
							<div className="flex flex-col gap-2">
								<Button size="sm" variant="outline" className="bg-white dark:bg-gray-800 shadow-lg">
									<Layers className="w-4 h-4" />
								</Button>
								<Button size="sm" variant="outline" className="bg-white dark:bg-gray-800 shadow-lg">
									<ZoomIn className="w-4 h-4" />
								</Button>
								<Button size="sm" variant="outline" className="bg-white dark:bg-gray-800 shadow-lg">
									<ZoomOut className="w-4 h-4" />
								</Button>
							</div>
						</div>

						{/* Device info card */}
						<div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-w-xs">
							<div className="flex items-center gap-2 mb-1">
								<MapPin className="w-4 h-4 text-red-500" />
								<span className="font-medium text-sm">{deviceName}</span>
							</div>
							<div className="text-xs text-gray-600 dark:text-gray-300">
								<div>Lat: {latitude.toFixed(6)}</div>
								<div>Lng: {longitude.toFixed(6)}</div>
								<div>Accuracy: ±{accuracy}m</div>
							</div>
						</div>

						{/* Mock Google branding */}
						<div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded px-2 py-1 shadow-lg">
							<div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
								Google Maps
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
