import { Separator } from "@/components/ui/separator";

export default function ProfileJobs() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Jobs</h3>
        <p className="text-sm text-muted">Manage your active/inactive jobs.</p>
      </div>
      <Separator />
    </div>
  );
}
