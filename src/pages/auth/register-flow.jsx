/* eslint-disable react/prop-types */
import {
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  CircleDollarSign,
  Users,
} from "lucide-react";

import { Step, Stepper, useStepper } from "@/components/stepper";
import { Button } from "@/components/ui/button";

const steps = [
  {
    label: "Businesses",
    icon: Building2,
    optional: true,
    onActionClick: () => console.log("clicked"),
    title: "Empower Your Business",
    subtitle:
      "Create and manage your business profile, connect with clients, and grow your brand.",
    actionText: "Create Business",
  },
  {
    label: "Jobs",
    icon: BriefcaseBusiness,
    optional: true,
    onActionClick: () => console.log("clicked"),
    title: "Find the Perfect Job",
    subtitle:
      "Explore job opportunities, apply to positions, and advance your career.",
    actionText: "Create a job",
  },
  {
    label: "Funding",
    icon: CircleDollarSign,
    optional: true,
    onActionClick: () => console.log("clicked"),
    title: "Secure Your Funding",
    subtitle:
      "Access funding opportunities, submit applications, and manage your finances.",
    actionText: "Create a funding",
  },
  {
    label: "Events",
    icon: CalendarCheck2,
    optional: true,
    onActionClick: () => console.log("clicked"),
    title: "Host and Attend Events",
    subtitle:
      "Create events, invite participants, and engage with your community.",
    actionText: "Create Event",
  },
  {
    label: "Groups",
    icon: Users,
    optional: true,
    onActionClick: () => console.log("clicked"),
    title: "Build and Join Groups",
    subtitle:
      "Connect with like-minded individuals, share ideas, and grow together.",
    actionText: "Create Groups",
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
                  <div className="h-40 relative flex justify-center flex-col gap-4 p-6 my-2 border border-secondary text-primary rounded-md">
                    <span className="absolute top-2 right-3 text-accent text-sm">
                      {index + 1} / {steps.length}
                    </span>
                    <h1 className="text-2xl lg:text-3xl font-semibold">
                      {stepProps.title}
                    </h1>
                    <p className="">{stepProps.subtitle}</p>
                  </div>
                  <Footer
                    onActionClick={stepProps.onActionClick}
                    actionText={stepProps.actionText}
                  />
                </Step>
              );
            })}
          </Stepper>
        </div>
      </div>
    </main>
  );
}

const Footer = ({ onActionClick, actionText }) => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper();
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
              <Button size="sm" onClick={nextStep}>
                {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
              </Button>
            </>
          )}
        </div>
        <Button size="sm" onClick={onActionClick}>
          {actionText}
        </Button>
      </div>
    </>
  );
};
