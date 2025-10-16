import { NextRequest } from "next/server";
import { listDevices } from "@/server/mockStore";

export async function GET(_req: NextRequest) {
	return Response.json({ devices: listDevices() });
}


