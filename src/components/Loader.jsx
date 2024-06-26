import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen fixed z-50 w-full">
      <Loader2 className="animate-spin w-12 h-12 text-accent" />
    </div>
  );
}
