import { Separator } from "@/components/ui/separator";

export default function ProfilePosts() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Posts</h3>
        <p className="text-sm text-muted">
          This is how others will see your posts on the site.
        </p>
      </div>
      <Separator />
      {/* <ProfileForm /> */}
    </div>
  );
}
