import { Suspense } from "react";
import DevicesTable from "@/components/devices/devices-table";

export default function DevicesPage() {
	return (
		<main className="p-6 space-y-4">
			<h1 className="text-2xl font-semibold">Devices</h1>
			<Suspense fallback={<div>Loading devices…</div>}>
				<DevicesTable />
			</Suspense>
		</main>
	);
}


