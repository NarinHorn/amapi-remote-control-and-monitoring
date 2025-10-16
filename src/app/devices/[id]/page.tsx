import DeviceDetail from "../../../components/devices/device-detail";
import { Metadata } from "next";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function DeviceDetailPage({ params }: PageProps) {
	const { id } = await params;
	
	return (
		<main className="p-6">
			<DeviceDetail deviceId={id} />
		</main>
	);
}