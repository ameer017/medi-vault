import { ClinicianForm } from "@/components/forms";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PagedTable } from "@/components/ui/paged-table";
import { Td, Th } from "@/components/ui/table";
import { prisma } from "@/lib/db";

export const metadata = { title: "People" };

export default async function PeoplePage() {
  const [users, facilities] = await Promise.all([
    prisma.user.findMany({
      include: { clinicianProfile: { include: { facility: true } }, patientProfile: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.facility.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">People</h1>
        <p className="text-sm text-[var(--muted)]">Patients self-register. Clinicians are created here.</p>
      </div>
      <Card>
        <CardHeader>
          <h2 className="font-display text-xl">Add clinician</h2>
        </CardHeader>
        <CardBody>
          <ClinicianForm facilities={facilities} />
        </CardBody>
      </Card>
      <PagedTable
        header={
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Facility</Th>
          </tr>
        }
        rows={users.map((user) => (
          <tr key={user.id}>
            <Td>{user.name}</Td>
            <Td>{user.email}</Td>
            <Td>
              <Badge tone={user.role === "ADMIN" ? "ink" : user.role === "CLINICIAN" ? "teal" : "muted"}>
                {user.role}
              </Badge>
            </Td>
            <Td>{user.clinicianProfile?.facility.code ?? "—"}</Td>
          </tr>
        ))}
      />
    </div>
  );
}
