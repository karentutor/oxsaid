// /* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  Info as InfoIcon,
} from "lucide-react";
import { Card, CardHeader } from "../ui/card";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import AsideFooter from "./AsideFooter"; // Assuming this is a separate component

const Aside = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="[grid-area:aside]">
      <Card>
        <CardHeader className="p-3 flex flex-row">
          <div className="font-semibold w-full">Connection List</div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="cursor-pointer">
                <InfoIcon size={16} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-48">
                  Follow connections that interest you to personalize your feed.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
          <div className="text-center p-6">
            <p className="text-sm text-zinc-500">No connections</p>
          </div>
          <CollapsibleTrigger asChild>
            <div className="mt-1 ml-3 text-zinc-500 flex flex-row text-sm p-2 items-center font-semibold cursor-pointer">
              {isOpen ? "View less recommendations" : "View all recommendations"}
              <ChevronRightIcon size={18} />
            </div>
          </CollapsibleTrigger>
        </Collapsible>
      </Card>
      <AsideFooter />
    </aside>
  );
};

export default Aside;
