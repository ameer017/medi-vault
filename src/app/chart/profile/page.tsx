import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile-form";
import { EmptyState } from "@/components/states";
import { getOwnPatient } from "@/lib/access";
import { requirePatient } from "@/lib/session";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await requirePatient("/chart/profile");
  const patient = await getOwnPatient(session.user.id);
  if (!patient) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState title="No chart yet" body="Your vault profile could not be loaded." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--teal)]">Your details</p>
      <h1 className="mt-1 font-display text-5xl">Profile</h1>
      <p className="mb-6 text-sm text-[var(--muted)]">
        Blood group, genotype and emergency contacts also appear on your public emergency card.
      </p>
      <Card>
        <CardHeader>
          <h2 className="font-display text-xl">Personal and emergency</h2>
        </CardHeader>
        <CardBody>
          <ProfileForm
            name={patient.user.name}
            phone={patient.user.phone}
            dateOfBirth={patient.dateOfBirth}
            sex={patient.sex}
            bloodGroup={patient.bloodGroup}
            genotype={patient.genotype}
            nhiaNumber={patient.nhiaNumber}
            emergencyName={patient.emergencyName}
            emergencyPhone={patient.emergencyPhone}
          />
        </CardBody>
      </Card>
    </div>
  );
}
