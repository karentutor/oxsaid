import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessCard from "./BusinessCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const BusinessList = ({ businesses, onDelete, onEdit, isLoading, showEditDelete }) => {
  console.log("Businesses in BusinessList:", businesses); // Log the businesses data

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {isLoading ? ( 
          <Card>
            <div className="flex flex-col gap-6 p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-60" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="w-16 h-6 rounded-lg" />
              </div>
              <div className="flex flex-col space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-14" />
                </div>
              </div>
            </div>
          </Card>
        ) : businesses.length > 0 ? (
          businesses.map((item) => (
            <BusinessCard 
              key={item._id} 
              item={item} 
              onDelete={() => onDelete(item._id)} 
              onEdit={() => onEdit(item._id)} 
              showEditDelete={showEditDelete} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
            <h3 className="text-3xl lg:text-4xl font-semibold">
              No Businesses Found
            </h3>
            <p className="text-black/70">
              Would you like to create one where you work or own?
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default BusinessList;
  
