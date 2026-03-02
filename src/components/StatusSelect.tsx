import React, { useState } from "react";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import * as SelectPrimitive from "@radix-ui/react-select@2.1.6";
import { cn } from "./ui/utils";

interface StatusSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  className?: string;
}

const statusOptions = [
  { value: "unprocessed", label: "Не обработана" },
  { value: "awaiting", label: "Ожидаю ответа" },
  { value: "no-answer", label: "Недозвон" },
  { value: "agreed", label: "Договорились" },
  { value: "not-interested", label: "Не интересует" }
];

// Кастомный SelectItem без галочки
function StatusSelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 px-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export function StatusSelect({ value = "", onValueChange, className = "" }: StatusSelectProps) {
  return (
    <Select value={value || undefined} onValueChange={onValueChange}>
      <SelectTrigger 
        className={`w-auto min-w-[80px] h-7 px-3 py-1 text-xs bg-gray-100 border-none hover:bg-gray-200 focus:ring-1 focus:ring-blue-500 transition-colors ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue placeholder="Статус" />
      </SelectTrigger>
      <SelectContent 
        position="popper" 
        side="bottom" 
        align="start"
        className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        sideOffset={4}
        avoidCollisions={true}
      >
        {statusOptions.map((option) => (
          <StatusSelectItem key={option.value} value={option.value} className="text-xs">
            {option.label}
          </StatusSelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}