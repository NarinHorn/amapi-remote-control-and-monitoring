"use client";
import useSWR from "swr";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";
import { Device, DeviceStatus } from "@/types/device";
import { MapPin, Battery, Wifi, Shield, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const statusConfig = {
	online: { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
	offline: { variant: "destructive" as const, icon: XCircle, color: "text-red-600" },
	lost: { variant: "destructive" as const, icon: AlertTriangle, color: "text-orange-600" },
	restricted: { variant: "secondary" as const, icon: Clock, color: "text-yellow-600" },
	non_compliant: { variant: "destructive" as const, icon: AlertTriangle, color: "text-red-600" },
	unknown: { variant: "outline" as const, icon: Clock, color: "text-gray-600" },
};

const complianceConfig = {
	compliant: { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
	non_compliant: { variant: "destructive" as const, icon: XCircle, color: "text-red-600" },
	pending: { variant: "secondary" as const, icon: Clock, color: "text-yellow-600" },
	unknown: { variant: "outline" as const, icon: Clock, color: "text-gray-600" },
};

export default function DevicesTable() {
	const { data, isLoading } = useSWR<{ devices: Device[] }>("/api/devices", fetcher, { refreshInterval: 10_000 });
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<DeviceStatus | "all">("all");
	const [complianceFilter, setComplianceFilter] = useState<string>("all");
	
	const devices = data?.devices ?? [];
	const filtered = useMemo(() => {
		let result = devices;
		
		if (query) {
			const q = query.toLowerCase();
			result = result.filter((d) =>
				[d.name, d.model, d.owner, d.id, d.userEmail].some((v) => v?.toLowerCase().includes(q))
			);
		}
		
		if (statusFilter !== "all") {
			result = result.filter((d) => d.status === statusFilter);
		}
		
		if (complianceFilter !== "all") {
			result = result.filter((d) => d.complianceStatus === complianceFilter);
		}
		
		return result;
	}, [devices, query, statusFilter, complianceFilter]);

	const getStatusIcon = (status: DeviceStatus) => {
		const config = statusConfig[status];
		const Icon = config.icon;
		return <Icon className={`w-4 h-4 ${config.color}`} />;
	};

	const getComplianceIcon = (status: Device["complianceStatus"]) => {
		const config = complianceConfig[status];
		const Icon = config.icon;
		return <Icon className={`w-4 h-4 ${config.color}`} />;
	};

	const getBatteryIcon = (level: number) => {
		if (level > 75) return <Battery className="w-4 h-4 text-green-600" />;
		if (level > 25) return <Battery className="w-4 h-4 text-yellow-600" />;
		return <Battery className="w-4 h-4 text-red-600" />;
	};

	const getNetworkIcon = (type: Device["networkType"]) => {
		if (type === "wifi") return <Wifi className="w-4 h-4 text-blue-600" />;
		if (type === "cellular") return <Wifi className="w-4 h-4 text-green-600" />;
		if (type === "ethernet") return <Wifi className="w-4 h-4 text-purple-600" />;
		return <Wifi className="w-4 h-4 text-gray-400" />;
	};

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="w-5 h-5" />
						Device Management
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4 mb-4">
						<Input
							placeholder="Search devices..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="flex-1"
						/>
						<Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as DeviceStatus | "all")}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="online">Online</SelectItem>
								<SelectItem value="offline">Offline</SelectItem>
								<SelectItem value="lost">Lost</SelectItem>
								<SelectItem value="restricted">Restricted</SelectItem>
								<SelectItem value="non_compliant">Non-compliant</SelectItem>
							</SelectContent>
						</Select>
						<Select value={complianceFilter} onValueChange={setComplianceFilter}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Compliance" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Compliance</SelectItem>
								<SelectItem value="compliant">Compliant</SelectItem>
								<SelectItem value="non_compliant">Non-compliant</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
							</SelectContent>
						</Select>
					</div>
					
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<div className="text-muted-foreground">Loading devices...</div>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Device</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Compliance</TableHead>
									<TableHead>Battery</TableHead>
									<TableHead>Network</TableHead>
									<TableHead>Location</TableHead>
									<TableHead>Last Seen</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filtered.map((d) => (
									<TableRow key={d.id} className={d.isLostMode ? "bg-orange-50 dark:bg-orange-950" : ""}>
										<TableCell>
											<div>
												<Link className="font-medium hover:underline" href={`/devices/${d.id}`}>
													{d.name}
												</Link>
												<div className="text-sm text-muted-foreground">
													{d.model} • {d.id}
												</div>
												<div className="text-xs text-muted-foreground">
													{d.userEmail}
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												{getStatusIcon(d.status)}
												<Badge variant={statusConfig[d.status].variant}>
													{d.status}
												</Badge>
												{d.isLostMode && (
													<Badge variant="destructive" className="text-xs">
														Lost Mode
													</Badge>
												)}
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												{getComplianceIcon(d.complianceStatus)}
												<Badge variant={complianceConfig[d.complianceStatus].variant}>
													{d.complianceStatus}
												</Badge>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												{getBatteryIcon(d.batteryLevel)}
												<span className="text-sm">{Math.round(d.batteryLevel)}%</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												{getNetworkIcon(d.networkType)}
												<span className="text-sm capitalize">{d.networkType}</span>
											</div>
										</TableCell>
										<TableCell>
											{d.location ? (
												<div className="flex items-center gap-1 text-sm">
													<MapPin className="w-3 h-3" />
													<span>{d.location.latitude.toFixed(4)}, {d.location.longitude.toFixed(4)}</span>
												</div>
											) : (
												<span className="text-muted-foreground text-sm">No location</span>
											)}
										</TableCell>
										<TableCell>
											<div className="text-sm">
												{new Date(d.lastSeenAt).toLocaleString()}
											</div>
										</TableCell>
										<TableCell>
											<Button size="sm" asChild>
												<Link href={`/devices/${d.id}`}>Manage</Link>
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
					
					{filtered.length === 0 && !isLoading && (
						<div className="text-center py-8 text-muted-foreground">
							No devices found matching your criteria.
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}


