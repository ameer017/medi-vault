import { auth } from "@/auth";
import { canAccessPatientFiles } from "@/lib/files";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Sign in required", { status: 401 });
  }

  const { id } = await params;
  const doc = await prisma.patientDocument.findUnique({ where: { id } });
  if (!doc) return new Response("Not found", { status: 404 });

  const allowed = await canAccessPatientFiles(session.user, doc.patientId);
  if (!allowed) return new Response("Not found", { status: 404 });

  const inline = new URL(request.url).searchParams.get("inline") === "1";
  const disposition = inline ? "inline" : `attachment; filename="${doc.fileName.replaceAll('"', "")}"`;

  return new Response(Uint8Array.from(doc.data), {
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Length": String(doc.sizeBytes),
      "Content-Disposition": disposition,
      "Cache-Control": "private, max-age=60",
    },
  });
}
