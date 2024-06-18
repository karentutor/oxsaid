import { Separator } from "@/components/ui/separator";

export default function ProfileConnectionList() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Connection List</h3>
        <p className="text-sm text-muted">
          Manage you connection list & preferences.
        </p>
      </div>
      <Separator />
    </div>
  );
}
