import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Slider from "rc-slider";

import "rc-slider/assets/index.css";
import { DatePicker } from "./DatePicker";

type MapControlsProps = {
  className?: string;
  startDate?: Date;
  endDate?: Date;
  setStartDate: (date?: Date) => void;
  setEndDate: (date?: Date) => void;
};

export function MapControls({
  className,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: MapControlsProps) {
  return (
    <Card className={cn(className, "w-[420px] ")}>
      <CardHeader>
        <CardTitle>Marine Litter Accumulation</CardTitle>
        <CardDescription>Select a date range</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex space-x-2">
          <DatePicker
            title="Start Date"
            onChange={setStartDate}
            date={startDate}
          />
          <DatePicker title="End Date" onChange={setEndDate} date={endDate} />
        </div>
        <Slider allowCross={false} range />
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        <Button variant="outline">Reset</Button>
        <Button>Play</Button>
      </CardFooter>
    </Card>
  );
}
