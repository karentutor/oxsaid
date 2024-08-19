/* eslint-disable react/prop-types */
import {
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  CircleDollarSign,
  CirclePlus,
  Users,
} from "lucide-react";

import { Step, Stepper, useStepper } from "@/components/stepper";
import { Button } from "@/components/ui/button";
import BusinessForm from "@/components/dashboard/business/BusinessForm";
import JobForm from "@/components/dashboard/jobs/job-form";
import FundForm from "@/components/dashboard/funding/fund-form";
import EventForm from "@/components/dashboard/events/event-form";
import GroupForm from "@/components/dashboard/groups/group-form";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    label: "Businesses",
    icon: Building2,
    optional: true,
    actionComp: (
      <BusinessForm
        type="add"
        trigger={
          <Button className="flex items-center gap-2" size="sm">
            <CirclePlus size={14} /> List Business
          </Button>
        }
      />
    ),
    img: "/imgs/business.svg",
    title: "Empower Your Business",
    subtitle:
      "Create and manage your business profile, connect with alums, and grow your brand.",
  },
  {
    label: "Jobs",
    icon: BriefcaseBusiness,
    optional: true,
    actionComp: (
      <JobForm
        type="add"
        trigger={
          <Button className="flex items-center gap-2" size="sm">
            <CirclePlus size={14} /> Create Job
          </Button>
        }
      />
    ),
    img: "/imgs/jobs.svg",
    title: "Find the Perfect Job",
    subtitle:
      "Explore job opportunities, apply to positions, and advance your career.",
  },
  {
    label: "Funding",
    icon: CircleDollarSign,
    optional: true,
    actionComp: (
      <FundForm
        type="add"
        isSeeking
        trigger={
          <Button className="flex items-center gap-2">
            <CirclePlus size={14} /> Apply for Fund
          </Button>
        }
      />
    ),
    img: "/imgs/funding.svg",
    title: "Secure Your Funding",
    subtitle:
      "Access funding opportunities, submit applications, and manage your finances.",
  },
  {
    label: "Events",
    icon: CalendarCheck2,
    optional: true,
    actionComp: (
      <EventForm
        type="add"
        trigger={
          <Button className="flex items-center gap-2">
            <CirclePlus size={14} /> Create Event
          </Button>
        }
      />
    ),
    img: "/imgs/events.svg",
    title: "Host and Attend Events",
    subtitle:
      "Create events, invite participants, and engage with your community.",
  },
  {
    label: "Groups",
    icon: Users,
    optional: true,
    actionComp: (
      <GroupForm
        type="add"
        trigger={
          <Button className="flex items-center gap-2">
            <CirclePlus size={14} /> Create Group
          </Button>
        }
      />
    ),
    img: "/imgs/groups.svg",
    title: "Build and Join Groups",
    subtitle:
      "Connect with like-minded individuals, share ideas, and grow together.",
  },
];

export default function RegisterFlow() {
  return (
    <main className="relative">
      <div className="pattern w-full -z-50 h-screen fixed top-0 right-0 left-0 flex items-center justify-center" />
      <div className="max-w-3xl w-full mx-auto py-8 px-4">
        <div className="flex w-full flex-col gap-4">
          <Stepper initialStep={0} steps={steps}>
            {steps.map((stepProps, index) => {
              return (
                <Step key={stepProps.label} {...stepProps}>
                  <div className="relative flex items-center text-center justify-center flex-col gap-4 p-6 my-2 border border-secondary text-primary rounded-md">
                    <span className="absolute top-2 right-3 text-accent text-sm">
                      {index + 1} / {steps.length}
                    </span>
                    <img
                      src={stepProps.img}
                      alt={stepProps.title}
                      className="w-60"
                    />
                    <h1 className="text-2xl lg:text-3xl font-semibold">
                      {stepProps.title}
                    </h1>
                    <p className="max-w-sm">{stepProps.subtitle}</p>
                  </div>
                  <Footer actionComp={stepProps.actionComp} />
                </Step>
              );
            })}
          </Stepper>
        </div>
      </div>
    </main>
  );
}

const Footer = ({ actionComp }) => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper();
  const navigate = useNavigate();
  return (
    <>
      {hasCompletedAllSteps && (
        <div className="h-40 flex items-center justify-center my-2 border bg-secondary text-primary rounded-md">
          <h1 className="text-xl">Woohoo! You&apos;re ready to go! 🎉</h1>
        </div>
      )}
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-2">
          {hasCompletedAllSteps ? (
            <Button size="sm" onClick={resetSteps}>
              Reset
            </Button>
          ) : (
            <>
              <Button
                disabled={isDisabledStep}
                onClick={prevStep}
                size="sm"
                variant="secondary"
              >
                Prev
              </Button>
              <Button
                size="sm"
                onClick={
                  isLastStep
                    ? () => navigate("/home", { replace: true })
                    : nextStep
                }
              >
                {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
              </Button>
            </>
          )}
        </div>
        {actionComp}
      </div>
    </>
  );
};
