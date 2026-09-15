import { PagedTable } from "@/components/ui/paged-table";
import { Td, Th } from "@/components/ui/table";
import { formatDateTime } from "@/lib/datetime";
import { prisma } from "@/lib/db";

export const metadata = { title: "Audit" };

export default async function AuditPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { actor: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Audit log</h1>
        <p className="text-sm text-[var(--muted)]">Who opened a chart, granted access, or wrote a note.</p>
      </div>
      <PagedTable
        header={
          <tr>
            <Th>When</Th>
            <Th>Actor</Th>
            <Th>Action</Th>
            <Th>Detail</Th>
          </tr>
        }
        rows={logs.map((log) => (
          <tr key={log.id}>
            <Td className="whitespace-nowrap">{formatDateTime(log.createdAt)}</Td>
            <Td>{log.actor?.name ?? "Public"}</Td>
            <Td className="font-mono text-xs">{log.action}</Td>
            <Td>{log.detail ?? "—"}</Td>
          </tr>
        ))}
      />
    </div>
  );
}
