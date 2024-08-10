/* eslint-disable react/prop-types */
import { cn } from "@/lib/utils";
import { Card, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import moment from "moment";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { ConfirmDelete } from "./FeedItem";
import BusinessForm from "./business/BusinessForm";
import { defaultBusiness } from "@/pages/business";
import { useState } from "react";

export default function BusinessCard({ item, onDelete, isMyBusiness = false }) {
  const [selectedBusiness, setSelectedBusiness] = useState(defaultBusiness);
  return (
    <Card
      className={cn(
        "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent/10"
      )}
    >
      <CardHeader className="relative p-0 w-full">
        <img
          src={item.picturePath ? item.picturePath : "/imgs/about.jpg"}
          alt={item.name}
          className="rounded-lg object-cover w-full h-48"
        />
        <div
          className={cn(
            "ml-auto text-sm text-accent hover:!text-primary absolute top-2 right-4 bg-background py-0.5 px-2 rounded-2xl"
          )}
        >
          {moment(item.createdAt).calendar()}
        </div>
      </CardHeader>
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold text-lg">{item.name.name}</div>
            {item.isLessThanTwoYears && (
              <span className="flex h-2 w-2 rounded-full bg-blue-600" />
            )}
          </div>
          <div
            className={cn(
              "ml-auto text-xs text-accent hover:!text-primary flex items-center gap-4"
            )}
          >
            <Badge className="ml-auto">{item.visibility}</Badge>
            {moment(item.createdAt).startOf().fromNow()}
          </div>
        </div>
        <div className="text-sm font-semibold">
          address: <span className="font-medium">{item.address}</span>
        </div>
        <div className="text-sm font-semibold">
          field:{" "}
          <span className="font-medium">
            {item.occupation} | {item.subOccupation}
          </span>
        </div>
        <div className="text-sm font-semibold">
          created by:{" "}
          <span className="font-medium">
            {item.userId.firstName} {item.userId.lastName}
          </span>
        </div>
      </div>
      <div className="line-clamp-2 font-semibold text-sm">
        description:{" "}
        <span className="font-medium">
          {item.description.substring(0, 300)}
        </span>
      </div>
      {isMyBusiness ? (
        <div className="flex items-center">
          <BusinessForm
            type="edit"
            selectedBusiness={selectedBusiness}
            setSelectedBusiness={setSelectedBusiness}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                type="button"
                onClick={() => setSelectedBusiness(item)}
              >
                <Edit size={14} /> Edit
              </Button>
            }
          />
          <ConfirmDelete onDelete={onDelete} />
        </div>
      ) : null}
    </Card>
  );
}
