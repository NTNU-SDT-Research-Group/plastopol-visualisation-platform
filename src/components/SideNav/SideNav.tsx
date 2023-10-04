"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Map, BarChart3, LayoutList } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export function ButtonDemo() {
  return <Button>Button</Button>;
}

type SideNavProps = {
  className?: string;
};

export default function SideNav({ className }: SideNavProps): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className={cn(className, "flex flex-col h-full shadow-lg")}>
      <div className="p-2">
        <Image
          alt="NTNU Logo"
          src={"/images/ntnu-logo.png"}
          width={40}
          height={40}
        />
      </div>
      <div className="h-[1px] w-full bg-gray-200"></div>
      <div className="flex flex-col items-center p-2 space-y-2">
        <Button
          variant="ghost"
          size="icon"
          className={cn({
            "bg-gray-200": pathname === "/",
          })}
          onClick={() => {
            router.push("/");
          }}
        >
          <Map className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn({
            "bg-gray-200": pathname === "/metrics",
          })}
        >
          <BarChart3 className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn({
            "bg-gray-200": pathname === "/annotations",
          })}
          onClick={() => {
            router.push("/annotations");
          }}
        >
          <LayoutList className="w-6 h-6" />
        </Button>
      </div>
    </nav>
  );
}
