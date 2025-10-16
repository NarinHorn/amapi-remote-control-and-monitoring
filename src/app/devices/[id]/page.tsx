import DeviceDetail from "../../../components/devices/device-detail";

export default function DeviceDetailPage({ params }: { params: { id: string } }) {
	return (
		<main className="p-6">
			<DeviceDetail deviceId={params.id} />
		</main>
	);
}


