import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ChevronRight as ChevronRightIcon,
  Info as InfoIcon,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import useAuth from "@/hooks/useAuth"; // Import the useAuth hook

const Section = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-2"> {/* Adding margin-bottom to create space between sections */}
      <CardHeader className="p-3 flex flex-row">
        <div className="font-semibold w-full">{title}</div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild className="cursor-pointer">
              <InfoIcon size={16} />
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-48">
                {`Follow ${title.toLowerCase()} that interest you to personalize your feed.`}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
        <div className="text-center p-6">
          <p className="text-sm text-zinc-500">{content}</p>
        </div>
        <CollapsibleTrigger asChild>
          <div className="mt-1 ml-3 text-zinc-500 flex flex-row text-sm p-2 items-center font-semibold cursor-pointer">
            {isOpen ? "View less recommendations" : "View all recommendations"}
            <ChevronRightIcon size={18} />
          </div>
        </CollapsibleTrigger>
      </Collapsible>
    </Card>
  );
};

const ContributionsActivities = () => {
  const { auth } = useAuth(); // Access the auth object from the useAuth hook
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    if (auth.user) {
      const fetchBusinesses = async () => {
        try {
          const response = await axios.get(`/api/businesses/${auth.user.id}`);
          if (response.data.isSuccess) {
            setBusinesses(response.data.business);
            console.log(response.data.business)
          }
        } catch (error) {
          console.error("Error fetching businesses:", error);
        }
      };

      fetchBusinesses();
    }
  }, [auth.user]);

  return (
    <aside className="[grid-area:aside]">
      <h2 className="font-semibold text-lg p-4">Your Contributions & Activities</h2>
      <Section
        title="Business"
        content={
          businesses.length > 0
            ? businesses.map((business) => (
                <div key={business._id}>
                  <h3>{business.name.name}</h3>
                  <p>{business.description}</p>
                </div>
              ))
            : "No business"
        }
      />
      <Section title="Jobs" content="No jobs" />
      <Section title="Funding" content="No funding" />
      <Section title="Events" content="No events" />
    </aside>
  );
};

export default ContributionsActivities;
