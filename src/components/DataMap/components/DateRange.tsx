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

export function DateRangePicker({ className }: { className?: string }) {
  return (
    <Card className={cn(className, "w-[350px]")}>
      <CardHeader>
        <CardTitle>Marine Litter Accumulation</CardTitle>
        <CardDescription>23rd June 2013 - 13th August 2021</CardDescription>
      </CardHeader>
      <CardContent>
        <Slider allowCross={false} range />
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        <Button variant="outline">Reset</Button>
        <Button>Play</Button>
      </CardFooter>
    </Card>
  );
}
