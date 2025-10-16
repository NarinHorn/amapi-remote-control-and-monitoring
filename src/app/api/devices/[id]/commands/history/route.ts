import { NextRequest } from "next/server";
import { listCommands } from "@/server/mockStore";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
	return Response.json({ commands: listCommands(params.id) });
}


