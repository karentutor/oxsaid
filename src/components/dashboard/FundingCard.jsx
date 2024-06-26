/* eslint-disable react/prop-types */
import moment from "moment";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

export default function FundingCard({ item }) {
  return (
    <Card className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent/10">
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="font-semibold">
              amount: <span className="text-2xl">{item.amount}$</span>
            </div>
          </div>
          <div
            className={cn(
              "ml-auto text-xs text-accent hover:!text-primary flex items-center gap-2"
            )}
          >
            {moment(item.createdAt).startOf().fromNow()}
          </div>
        </div>
        <div className="text-xs font-semibold">
          field:{" "}
          <span className="font-medium">
            {item.occupation} | {item.subOccupation}
          </span>
        </div>
        <div className="text-xs font-semibold">
          created by:{" "}
          <span className="font-medium">
            {item.userId.firstName} {item.userId.lastName}
          </span>
        </div>
        <div className="text-xs font-semibold">
          business:{" "}
          <span className="font-medium">{item?.name?.name?.name}</span>
        </div>
      </div>
      <div className="text-xs font-semibold text-muted">
        description:{" "}
        <span className="font-medium">
          {item.description.substring(0, 300)}
        </span>
      </div>
    </Card>
  );
}
