export type DeviceStatus = "online" | "offline" | "restricted" | "unknown" | "lost" | "non_compliant";

export type DeviceComplianceStatus = "compliant" | "non_compliant" | "pending" | "unknown";

export type Device = {
	id: string;
	name: string;
	model: string;
	owner: string;
	osVersion: string;
	lastSeenAt: number;
	status: DeviceStatus;
	batteryLevel: number; // 0-100
	networkType: "wifi" | "cellular" | "ethernet" | "none";
	ipAddress?: string;
	location?: {
		latitude: number;
		longitude: number;
		accuracy: number;
		lastUpdated: number;
	};
	complianceStatus: DeviceComplianceStatus;
	isLostMode: boolean;
	enrollmentTime: number;
	policyName?: string;
	userEmail?: string;
};

export type CommandType =
	| "lock"
	| "reboot"
	| "wipe"
	| "showMessage"
	| "enableLostMode"
	| "disableLostMode"
	| "resetPassword"
	| "clearAppData";

export type DeviceCommand = {
	id: string;
	deviceId: string;
	type: CommandType;
	createdAt: number;
	status: "pending" | "sent" | "acknowledged" | "error" | "queued";
	payload?: {
		message?: string;
		title?: string;
		password?: string;
		appPackage?: string;
	};
	executedAt?: number;
	errorMessage?: string;
};

export type TelemetryEvent = {
	deviceId: string;
	timestamp: number;
	batteryLevel: number;
	networkType: Device["networkType"];
	cpuLoadPct: number;
	storageFreeGb: number;
	location?: Device["location"];
	isLostMode: boolean;
	complianceStatus: DeviceComplianceStatus;
};

export type DeviceHealthMetrics = {
	deviceId: string;
	batteryHealth: "good" | "fair" | "poor" | "critical";
	storageHealth: "good" | "fair" | "poor" | "critical";
	networkHealth: "good" | "fair" | "poor" | "critical";
	securityHealth: "good" | "fair" | "poor" | "critical";
	lastHealthCheck: number;
};


