import { Device, DeviceCommand, TelemetryEvent, DeviceHealthMetrics } from "@/types/device";

const devices: Device[] = [
	{
		id: "dev-001",
		name: "Kiosk Entrance",
		model: "Pixel 6",
		owner: "Lobby",
		osVersion: "Android 14",
		lastSeenAt: Date.now() - 30_000,
		status: "online",
		batteryLevel: 82,
		networkType: "wifi",
		ipAddress: "10.0.0.21",
		location: {
			latitude: 37.7749,
			longitude: -122.4194,
			accuracy: 10,
			lastUpdated: Date.now() - 30_000,
		},
		complianceStatus: "compliant",
		isLostMode: false,
		enrollmentTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
		policyName: "Kiosk Policy",
		userEmail: "kiosk@company.com",
	},
	{
		id: "dev-002",
		name: "Warehouse Scanner",
		model: "Zebra TC52",
		owner: "Warehouse A",
		osVersion: "Android 12",
		lastSeenAt: Date.now() - 60 * 60 * 1000,
		status: "offline",
		batteryLevel: 0,
		networkType: "none",
		complianceStatus: "non_compliant",
		isLostMode: false,
		enrollmentTime: Date.now() - 60 * 24 * 60 * 60 * 1000,
		policyName: "Warehouse Policy",
		userEmail: "warehouse@company.com",
	},
	{
		id: "dev-003",
		name: "Field Tablet",
		model: "Samsung Tab Active3",
		owner: "Field Team",
		osVersion: "Android 13",
		lastSeenAt: Date.now() - 5_000,
		status: "online",
		batteryLevel: 56,
		networkType: "cellular",
		ipAddress: "172.16.5.42",
		location: {
			latitude: 37.7849,
			longitude: -122.4094,
			accuracy: 5,
			lastUpdated: Date.now() - 5_000,
		},
		complianceStatus: "compliant",
		isLostMode: false,
		enrollmentTime: Date.now() - 15 * 24 * 60 * 60 * 1000,
		policyName: "Field Policy",
		userEmail: "field@company.com",
	},
	{
		id: "dev-004",
		name: "Lost Device",
		model: "Pixel 7",
		owner: "Sales Team",
		osVersion: "Android 14",
		lastSeenAt: Date.now() - 2 * 60 * 60 * 1000,
		status: "lost",
		batteryLevel: 23,
		networkType: "cellular",
		location: {
			latitude: 37.7649,
			longitude: -122.4294,
			accuracy: 15,
			lastUpdated: Date.now() - 2 * 60 * 60 * 1000,
		},
		complianceStatus: "compliant",
		isLostMode: true,
		enrollmentTime: Date.now() - 45 * 24 * 60 * 60 * 1000,
		policyName: "Sales Policy",
		userEmail: "sales@company.com",
	},
];

const commands: DeviceCommand[] = [];
const healthMetrics: Map<string, DeviceHealthMetrics> = new Map();

export function listDevices(): Device[] {
	return devices.slice();
}

export function getDevice(deviceId: string): Device | undefined {
	return devices.find((d) => d.id === deviceId);
}

export function pushCommand(cmd: DeviceCommand): DeviceCommand {
	commands.unshift(cmd);
	return cmd;
}

export function listCommands(deviceId: string): DeviceCommand[] {
	return commands.filter((c) => c.deviceId === deviceId);
}

export function getHealthMetrics(deviceId: string): DeviceHealthMetrics | undefined {
	return healthMetrics.get(deviceId);
}

export function updateHealthMetrics(deviceId: string, metrics: DeviceHealthMetrics): void {
	healthMetrics.set(deviceId, metrics);
}

// Simple telemetry generator per device
const listeners = new Map<string, Set<(e: TelemetryEvent) => void>>();

export function subscribeTelemetry(
	deviceId: string,
	listener: (e: TelemetryEvent) => void
): () => void {
	let set = listeners.get(deviceId);
	if (!set) {
		set = new Set();
		listeners.set(deviceId, set);
	}
	set.add(listener);
	return () => {
		set!.delete(listener);
	};
}

// Background simulator
let simulatorStarted = false;
export function startTelemetrySimulator(): void {
	if (simulatorStarted) return;
	simulatorStarted = true;
	setInterval(() => {
		for (const d of devices) {
			if (d.status === "offline") continue;
			
			// Update battery
			d.batteryLevel = Math.max(0, Math.min(100, d.batteryLevel + (Math.random() * 2 - 1)));
			d.lastSeenAt = Date.now();
			
			// Update location slightly for online devices
			if (d.location && d.status === "online") {
				d.location.latitude += (Math.random() - 0.5) * 0.001;
				d.location.longitude += (Math.random() - 0.5) * 0.001;
				d.location.lastUpdated = Date.now();
			}
			
			const event: TelemetryEvent = {
				deviceId: d.id,
				timestamp: Date.now(),
				batteryLevel: Math.round(d.batteryLevel),
				networkType: d.networkType,
				cpuLoadPct: Math.round(20 + Math.random() * 60),
				storageFreeGb: Math.round(4 + Math.random() * 28),
				location: d.location,
				isLostMode: d.isLostMode,
				complianceStatus: d.complianceStatus,
			};
			
			// Update health metrics
			const health: DeviceHealthMetrics = {
				deviceId: d.id,
				batteryHealth: d.batteryLevel > 50 ? "good" : d.batteryLevel > 20 ? "fair" : d.batteryLevel > 10 ? "poor" : "critical",
				storageHealth: event.storageFreeGb > 20 ? "good" : event.storageFreeGb > 10 ? "fair" : event.storageFreeGb > 5 ? "poor" : "critical",
				networkHealth: d.networkType === "none" ? "critical" : d.networkType === "cellular" ? "fair" : "good",
				securityHealth: d.complianceStatus === "compliant" ? "good" : "poor",
				lastHealthCheck: Date.now(),
			};
			updateHealthMetrics(d.id, health);
			
			const subs = listeners.get(d.id);
			subs?.forEach((fn) => fn(event));
		}
	}, 3_000);
}


