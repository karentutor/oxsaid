import AllJobs from "@/components/dashboard/AllJobs";
import PostJob from "@/components/dashboard/PostJob";
import { useState } from "react";

export const defaultJob = {
  jobTitle: "",
  country: "",
  city: "",
  salary: "",
  occupation: "",
  subOccupation: "",
  business: "",
  description: "",
};

export default function Jobs() {
  const [formStatus, setFormStatus] = useState("create");
  const [selectedJob, setSelectedJob] = useState(defaultJob);

  return (
    <main className="pt-4 grid gap-6 two-column-grid">
      <PostJob
        selectedJob={selectedJob}
        formStatus={formStatus}
        setFormStatus={setFormStatus}
        setSelectedJob={setSelectedJob}
      />
      <AllJobs
        setSelectedJob={setSelectedJob}
        setFormStatus={setFormStatus}
        selectedJob={selectedJob}
      />
    </main>
  );
}
