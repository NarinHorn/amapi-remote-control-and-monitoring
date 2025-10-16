import { NextRequest } from "next/server";
import { pushCommand } from "@/server/mockStore";
import { DeviceCommand } from "@/types/device";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id: deviceId } = await params;
	const body = await req.json();
	const now = Date.now();
	const command: DeviceCommand = {
		id: `cmd-${now}-${Math.random().toString(36).slice(2, 8)}`,
		deviceId,
		type: body.type,
		createdAt: now,
		status: "sent",
		payload: body.payload,
	};
	pushCommand(command);
	return Response.json({ command });
}


