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
import { Progress } from "@/components/ui/progress";

type MapControlsProps = {
  className?: string;
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  toggleAnimation: () => void;
  resetAnimation: () => void;
  isAnimating: boolean;
  animationProgress: number;
};

export function MapControls({
  className,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  toggleAnimation,
  resetAnimation,
  isAnimating,
  animationProgress,
}: MapControlsProps) {
  return (
    <Card className={cn(className, "w-[420px] bg-white/80 backdrop-blur-sm")}>
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
        <div className="w-full pt-2">
          <Progress
            value={Math.ceil(animationProgress)}
            className="w-full h-[4px]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        <Button variant="outline" onClick={resetAnimation}>
          Reset
        </Button>
        <Button onClick={toggleAnimation}>
          {isAnimating ? "Pause" : "Play"}
        </Button>
      </CardFooter>
    </Card>
  );
}
