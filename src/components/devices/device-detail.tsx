"use client";
import useSWR from "swr";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Device, DeviceCommand, TelemetryEvent } from "@/types/device";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
	MapPin, 
	Battery, 
	Wifi, 
	AlertTriangle, 
	CheckCircle, 
	XCircle, 
	Clock,
	Lock,
	RotateCcw,
	Trash2,
	MessageSquare,
	Eye,
	EyeOff,
	Key,
	Smartphone,
	Activity,
	HardDrive,
	Cpu,
	Signal
} from "lucide-react";
import MockGoogleMap from "@/components/ui/mock-google-map";

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

export default function DeviceDetail({ deviceId }: { deviceId: string }) {
	const { data } = useSWR<{ devices: Device[] }>("/api/devices", fetcher, { refreshInterval: 15_000 });
	const device = useMemo(() => data?.devices.find((d) => d.id === deviceId), [data, deviceId]);
	const [telemetry, setTelemetry] = useState<TelemetryEvent | null>(null);
	const [history, setHistory] = useState<DeviceCommand[]>([]);
	const titleRef = useRef<HTMLInputElement>(null);
	const messageRef = useRef<HTMLTextAreaElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		let closed = false;
		const es = new EventSource(`/api/devices/${deviceId}/telemetry`);
		es.onmessage = (ev) => {
			try {
				const e = JSON.parse(ev.data) as TelemetryEvent;
				setTelemetry(e);
			} catch {}
		};
		es.onerror = () => {
			if (!closed) toast.warning("Telemetry connection lost, retrying…");
		};
		fetch(`/api/devices/${deviceId}/commands/history`).then((r) => r.json()).then((j) => setHistory(j.commands as DeviceCommand[]));
		return () => {
			closed = true;
			es.close();
		};
	}, [deviceId]);

	async function sendCommand(type: DeviceCommand["type"], payload?: Record<string, unknown>) {
		const res = await fetch(`/api/devices/${deviceId}/commands`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ type, payload }),
		});
		const json = await res.json();
		setHistory((h) => [json.command as DeviceCommand, ...h]);
		toast.success(`Command ${type} sent`);
	}

	if (!device) return <div>Loading…</div>;

	const getStatusIcon = (status: Device["status"]) => {
		const config = statusConfig[status];
		const Icon = config.icon;
		return <Icon className={`w-5 h-5 ${config.color}`} />;
	};

	const getComplianceIcon = (status: Device["complianceStatus"]) => {
		const config = complianceConfig[status];
		const Icon = config.icon;
		return <Icon className={`w-5 h-5 ${config.color}`} />;
	};

	const formatTimeAgo = (timestamp: number) => {
		const now = Date.now();
		const diff = now - timestamp;
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);
		
		if (days > 0) return `${days}d ago`;
		if (hours > 0) return `${hours}h ago`;
		if (minutes > 0) return `${minutes}m ago`;
		return "Just now";
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<Smartphone className="w-6 h-6" />
						<h1 className="text-2xl font-semibold">{device.name}</h1>
					</div>
					<div className="flex items-center gap-2">
						{getStatusIcon(device.status)}
						<Badge variant={statusConfig[device.status].variant}>
							{device.status}
						</Badge>
						{device.isLostMode && (
							<Badge variant="destructive">
								<AlertTriangle className="w-3 h-3 mr-1" />
								Lost Mode
							</Badge>
						)}
					</div>
				</div>
				<div className="flex items-center gap-2">
					{getComplianceIcon(device.complianceStatus)}
					<Badge variant={complianceConfig[device.complianceStatus].variant}>
						{device.complianceStatus}
					</Badge>
				</div>
			</div>

			{/* Lost Mode Alert */}
			{device.isLostMode && (
				<Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
					<AlertTriangle className="h-4 w-4 text-orange-600" />
					<AlertDescription className="text-orange-800 dark:text-orange-200">
						This device is in Lost Mode. Location tracking is active and the device will be locked when it comes online.
					</AlertDescription>
				</Alert>
			)}

			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="location">Location</TabsTrigger>
					<TabsTrigger value="actions">Remote Actions</TabsTrigger>
					<TabsTrigger value="history">Command History</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-4">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						{/* Device Info */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Smartphone className="w-5 h-5" />
									Device Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Model:</span>
									<span>{device.model}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">OS Version:</span>
									<span>{device.osVersion}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Owner:</span>
									<span>{device.owner}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">User Email:</span>
									<span>{device.userEmail}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Policy:</span>
									<span>{device.policyName}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Enrolled:</span>
									<span>{formatTimeAgo(device.enrollmentTime)}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">IP Address:</span>
									<span>{device.ipAddress || "Unknown"}</span>
								</div>
							</CardContent>
						</Card>

						{/* Live Telemetry */}
						<Card className="lg:col-span-2">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Activity className="w-5 h-5" />
									Live Telemetry
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<div className="flex items-center justify-between text-sm">
											<div className="flex items-center gap-2">
												<Battery className="w-4 h-4" />
												<span>Battery</span>
											</div>
											<span>{Math.round(telemetry?.batteryLevel ?? device.batteryLevel)}%</span>
										</div>
										<Progress value={telemetry?.batteryLevel ?? device.batteryLevel} />
									</div>
									
									<div className="space-y-2">
										<div className="flex items-center justify-between text-sm">
											<div className="flex items-center gap-2">
												<Cpu className="w-4 h-4" />
												<span>CPU Load</span>
											</div>
											<span>{telemetry?.cpuLoadPct ?? 0}%</span>
										</div>
										<Progress value={telemetry?.cpuLoadPct ?? 0} />
									</div>
									
									<div className="space-y-2">
										<div className="flex items-center justify-between text-sm">
											<div className="flex items-center gap-2">
												<HardDrive className="w-4 h-4" />
												<span>Storage Free</span>
											</div>
											<span>{telemetry?.storageFreeGb ?? 0} GB</span>
										</div>
										<Progress value={((telemetry?.storageFreeGb ?? 0) / 32) * 100} />
									</div>
									
									<div className="space-y-2">
										<div className="flex items-center justify-between text-sm">
											<div className="flex items-center gap-2">
												<Signal className="w-4 h-4" />
												<span>Network</span>
											</div>
											<span className="capitalize">{telemetry?.networkType ?? device.networkType}</span>
										</div>
										<div className="flex items-center gap-2">
											<Wifi className={`w-4 h-4 ${
												(telemetry?.networkType ?? device.networkType) === "wifi" ? "text-blue-600" :
												(telemetry?.networkType ?? device.networkType) === "cellular" ? "text-green-600" :
												"text-gray-400"
											}`} />
											<span className="text-xs text-muted-foreground">
												{formatTimeAgo(device.lastSeenAt)}
											</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="location" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<MapPin className="w-5 h-5" />
								Location Tracking
							</CardTitle>
						</CardHeader>
						<CardContent>
							{device.location ? (
								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
										<div>
											<div className="text-muted-foreground">Latitude</div>
											<div className="font-mono">{device.location.latitude.toFixed(6)}</div>
										</div>
										<div>
											<div className="text-muted-foreground">Longitude</div>
											<div className="font-mono">{device.location.longitude.toFixed(6)}</div>
										</div>
										<div>
											<div className="text-muted-foreground">Accuracy</div>
											<div>{device.location.accuracy}m</div>
										</div>
									</div>
									<div className="text-sm text-muted-foreground">
										Last updated: {formatTimeAgo(device.location.lastUpdated)}
									</div>
									{/* Mock Google Maps Integration */}
									<MockGoogleMap
										latitude={device.location.latitude}
										longitude={device.location.longitude}
										accuracy={device.location.accuracy}
										deviceName={device.name}
										className="mt-4"
									/>
								</div>
							) : (
								<div className="text-center py-8 text-muted-foreground">
									<MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
									<div>No location data available</div>
									<div className="text-sm">Location tracking may be disabled or device is offline</div>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="actions" className="space-y-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						{/* Basic Actions */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Lock className="w-5 h-5" />
									Basic Actions
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="grid grid-cols-2 gap-2">
									<Button onClick={() => sendCommand("lock")} variant="outline">
										<Lock className="w-4 h-4 mr-2" />
										Lock Device
									</Button>
									<Button onClick={() => sendCommand("reboot")} variant="secondary">
										<RotateCcw className="w-4 h-4 mr-2" />
										Reboot
									</Button>
								</div>
								<Button onClick={() => sendCommand("wipe")} variant="destructive" className="w-full">
									<Trash2 className="w-4 h-4 mr-2" />
									Factory Reset
								</Button>
							</CardContent>
						</Card>

						{/* Lost Mode */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<AlertTriangle className="w-5 h-5" />
									Lost Mode
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								{device.isLostMode ? (
									<div className="space-y-2">
										<Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
											<AlertTriangle className="h-4 w-4 text-orange-600" />
											<AlertDescription className="text-orange-800 dark:text-orange-200">
												Lost Mode is active
											</AlertDescription>
										</Alert>
										<Button onClick={() => sendCommand("disableLostMode")} variant="outline" className="w-full">
											<EyeOff className="w-4 h-4 mr-2" />
											Disable Lost Mode
										</Button>
									</div>
								) : (
									<div className="space-y-2">
										<div className="text-sm text-muted-foreground">
											Enable Lost Mode to track and secure a lost device
										</div>
										<Button onClick={() => sendCommand("enableLostMode")} variant="destructive" className="w-full">
											<Eye className="w-4 h-4 mr-2" />
											Enable Lost Mode
										</Button>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Advanced Actions */}
						<Card className="lg:col-span-2">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Key className="w-5 h-5" />
									Advanced Actions
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<label className="text-sm font-medium">Reset Password</label>
										<div className="flex gap-2">
											<Input ref={passwordRef} placeholder="New password" type="password" />
											<Button onClick={() => sendCommand("resetPassword", { password: passwordRef.current?.value })}>
												<Key className="w-4 h-4 mr-2" />
												Reset
											</Button>
										</div>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-medium">Clear App Data</label>
										<div className="flex gap-2">
											<Input placeholder="App package name" />
											<Button variant="secondary">
												<Trash2 className="w-4 h-4 mr-2" />
												Clear
											</Button>
										</div>
									</div>
								</div>
								
								<Separator />
								
								<div className="space-y-3">
									<label className="text-sm font-medium">Send Message to Device</label>
									<div className="grid gap-2 md:grid-cols-3">
										<Input ref={titleRef} placeholder="Message title" />
										<Textarea ref={messageRef} className="md:col-span-2" placeholder="Message body" rows={3} />
									</div>
									<Button
										onClick={() =>
											sendCommand("showMessage", {
												title: titleRef.current?.value,
												message: messageRef.current?.value,
											})
										}
										className="w-full"
									>
										<MessageSquare className="w-4 h-4 mr-2" />
										Send Message
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="history" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Clock className="w-5 h-5" />
								Command History
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{history.map((c) => (
									<div key={c.id} className="flex items-center justify-between border rounded-lg p-3">
										<div className="flex items-center gap-3">
											<Badge variant="outline">{c.type}</Badge>
											<div className="text-sm">
												<div className="font-medium">{new Date(c.createdAt).toLocaleString()}</div>
												{c.payload && (
													<div className="text-muted-foreground text-xs">
														{c.payload.title && `Title: ${c.payload.title}`}
														{c.payload.message && `Message: ${c.payload.message.substring(0, 50)}...`}
													</div>
												)}
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Badge 
												variant={
													c.status === "acknowledged" ? "default" :
													c.status === "error" ? "destructive" :
													c.status === "queued" ? "secondary" :
													"outline"
												}
											>
												{c.status}
											</Badge>
											{c.executedAt && (
												<div className="text-xs text-muted-foreground">
													Executed: {formatTimeAgo(c.executedAt)}
												</div>
											)}
										</div>
									</div>
								))}
								{history.length === 0 && (
									<div className="text-center py-8 text-muted-foreground">
										<Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
										<div>No commands sent yet</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}


