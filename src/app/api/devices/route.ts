import { NextRequest } from "next/server";
import { listDevices } from "@/server/mockStore";

export async function GET() {
	return Response.json({ devices: listDevices() });
}


