import { FacilityForm } from "@/components/forms";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PagedTable } from "@/components/ui/paged-table";
import { Td, Th } from "@/components/ui/table";
import { prisma } from "@/lib/db";

export const metadata = { title: "Facilities" };

export default async function FacilitiesPage() {
  const facilities = await prisma.facility.findMany({
    include: { _count: { select: { clinicians: true, records: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Facilities</h1>
        <p className="text-sm text-[var(--muted)]">Teaching hospitals and private clinics on the vault network.</p>
      </div>
      <Card>
        <CardHeader>
          <h2 className="font-display text-xl">Add facility</h2>
        </CardHeader>
        <CardBody>
          <FacilityForm />
        </CardBody>
      </Card>
      <PagedTable
        header={
          <tr>
            <Th>Code</Th>
            <Th>Name</Th>
            <Th>City</Th>
            <Th>Clinicians</Th>
            <Th>Notes</Th>
          </tr>
        }
        rows={facilities.map((facility) => (
          <tr key={facility.id}>
            <Td className="font-mono">{facility.code}</Td>
            <Td>{facility.name}</Td>
            <Td>{facility.city}</Td>
            <Td>{facility._count.clinicians}</Td>
            <Td>{facility._count.records}</Td>
          </tr>
        ))}
      />
    </div>
  );
}
