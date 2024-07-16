import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const AsideFooterLink = ({ text, subItems }) => (
  <span className="m-1 cursor-pointer hover:underline hover:text-blue-500">
    {subItems ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className="flex flex-row">
            {text}
            <ChevronDown size={15} />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          {subItems.map((item) => (
            <DropdownMenuItem key={item.text}>
              <span>{item.text}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      text
    )}
  </span>
);

export default AsideFooterLink;
