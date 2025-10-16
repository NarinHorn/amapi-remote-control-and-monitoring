import { NextRequest } from "next/server";
import { startTelemetrySimulator, subscribeTelemetry } from "@/server/mockStore";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	startTelemetrySimulator();
	const { id: deviceId } = await params;
	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		start(controller) {
			controller.enqueue(encoder.encode(`: connected\n\n`));
			const unsubscribe = subscribeTelemetry(deviceId, (event) => {
				controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
			});
			const heartbeat = setInterval(() => {
				controller.enqueue(encoder.encode(`: heartbeat\n\n`));
			}, 15000);
			controller.enqueue(encoder.encode(`retry: 5000\n\n`));
			return () => {
				clearInterval(heartbeat);
				unsubscribe();
			};
		},
	});
	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache, no-transform",
			Connection: "keep-alive",
		},
	});
}


