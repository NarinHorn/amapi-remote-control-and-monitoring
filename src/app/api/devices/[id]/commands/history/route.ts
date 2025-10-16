import { listCommands } from "@/server/mockStore";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return Response.json({ commands: listCommands(id) });
}


