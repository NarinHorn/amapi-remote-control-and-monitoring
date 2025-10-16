import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
	Smartphone, 
	Shield, 
	AlertTriangle, 
	CheckCircle, 
	XCircle, 
	MapPin,
	Activity,
	TrendingUp,
	Users,
	Settings
} from "lucide-react";

export default function Home() {
  return (
		<main className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Android Device Management</h1>
					<p className="text-muted-foreground mt-2">
						Comprehensive remote control and monitoring for your Android device fleet
					</p>
				</div>
				<Button asChild>
					<Link href="/devices">
						<Smartphone className="w-4 h-4 mr-2" />
						Manage Devices
					</Link>
				</Button>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Devices</CardTitle>
						<Smartphone className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">4</div>
						<p className="text-xs text-muted-foreground">
							+1 from last month
						</p>
					</CardContent>
				</Card>
				
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Online Devices</CardTitle>
						<CheckCircle className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">2</div>
						<p className="text-xs text-muted-foreground">
							50% of total devices
						</p>
					</CardContent>
				</Card>
				
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Compliant Devices</CardTitle>
						<Shield className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">3</div>
						<p className="text-xs text-muted-foreground">
							75% compliance rate
						</p>
					</CardContent>
				</Card>
				
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Lost Mode Active</CardTitle>
						<AlertTriangle className="h-4 w-4 text-orange-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">1</div>
						<p className="text-xs text-muted-foreground">
							Requires attention
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Device Status Overview */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Activity className="w-5 h-5" />
							Device Status Overview
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-green-600" />
								<span>Online</span>
							</div>
							<Badge variant="default">2 devices</Badge>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<XCircle className="w-4 h-4 text-red-600" />
								<span>Offline</span>
							</div>
							<Badge variant="destructive">1 device</Badge>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<AlertTriangle className="w-4 h-4 text-orange-600" />
								<span>Lost Mode</span>
							</div>
							<Badge variant="destructive">1 device</Badge>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-blue-600" />
								<span>Non-compliant</span>
							</div>
							<Badge variant="secondary">1 device</Badge>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="w-5 h-5" />
							Recent Activity
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center justify-between text-sm">
							<div className="flex items-center gap-2">
								<MapPin className="w-4 h-4 text-blue-600" />
								<span>Location updated</span>
							</div>
							<span className="text-muted-foreground">2m ago</span>
						</div>
						<div className="flex items-center justify-between text-sm">
							<div className="flex items-center gap-2">
								<AlertTriangle className="w-4 h-4 text-orange-600" />
								<span>Lost Mode enabled</span>
							</div>
							<span className="text-muted-foreground">1h ago</span>
						</div>
						<div className="flex items-center justify-between text-sm">
							<div className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-green-600" />
								<span>Device enrolled</span>
							</div>
							<span className="text-muted-foreground">2d ago</span>
						</div>
						<div className="flex items-center justify-between text-sm">
							<div className="flex items-center gap-2">
								<Settings className="w-4 h-4 text-gray-600" />
								<span>Policy updated</span>
							</div>
							<span className="text-muted-foreground">3d ago</span>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Settings className="w-5 h-5" />
						Quick Actions
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Button asChild variant="outline" className="h-20 flex-col gap-2">
							<Link href="/devices">
								<Smartphone className="w-6 h-6" />
								<span>View All Devices</span>
							</Link>
						</Button>
						<Button asChild variant="outline" className="h-20 flex-col gap-2">
							<Link href="/devices?status=lost">
								<AlertTriangle className="w-6 h-6" />
								<span>Lost Devices</span>
							</Link>
						</Button>
						<Button asChild variant="outline" className="h-20 flex-col gap-2">
							<Link href="/devices?compliance=non_compliant">
								<Shield className="w-6 h-6" />
								<span>Non-compliant</span>
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Features Overview */}
			<Card>
				<CardHeader>
					<CardTitle>Android Management API Features</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<MapPin className="w-5 h-5 text-blue-600" />
								<h3 className="font-semibold">Location Tracking</h3>
							</div>
							<p className="text-sm text-muted-foreground">
								Real-time GPS tracking for logistics, field workers, and lost device recovery
							</p>
						</div>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<AlertTriangle className="w-5 h-5 text-orange-600" />
								<h3 className="font-semibold">Lost Mode</h3>
							</div>
							<p className="text-sm text-muted-foreground">
								Secure lost/stolen devices with offline command queuing and automatic locking
							</p>
						</div>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Shield className="w-5 h-5 text-green-600" />
								<h3 className="font-semibold">Remote Control</h3>
							</div>
							<p className="text-sm text-muted-foreground">
								Lock, reboot, wipe, and send messages to devices remotely
							</p>
						</div>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Activity className="w-5 h-5 text-purple-600" />
								<h3 className="font-semibold">Live Monitoring</h3>
							</div>
							<p className="text-sm text-muted-foreground">
								Real-time battery, CPU, storage, and network monitoring via SSE
							</p>
						</div>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<CheckCircle className="w-5 h-5 text-blue-600" />
								<h3 className="font-semibold">Compliance</h3>
							</div>
							<p className="text-sm text-muted-foreground">
								Monitor device compliance status and security posture
							</p>
						</div>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Users className="w-5 h-5 text-indigo-600" />
								<h3 className="font-semibold">User Management</h3>
							</div>
							<p className="text-sm text-muted-foreground">
								Associate devices with users and manage enrollment tokens
							</p>
						</div>
        </div>
				</CardContent>
			</Card>
      </main>
  );
}
