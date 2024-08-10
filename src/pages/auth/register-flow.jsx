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
  { label: "Businesses", icon: Building2 },
  { label: "Jobs", icon: BriefcaseBusiness },
  { label: "Funding", icon: CircleDollarSign },
  { label: "Events", icon: CalendarCheck2 },
  { label: "Groups", icon: Users },
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
                  <div className="h-40 flex items-center justify-center my-2 border bg-secondary text-primary rounded-md">
                    <h1 className="text-xl">Step {index + 1}</h1>
                  </div>
                </Step>
              );
            })}
            <Footer />
          </Stepper>
        </div>
      </div>
    </main>
  );
}

const Footer = () => {
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
      <div className="w-full flex justify-end gap-2">
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
    </>
  );
};
