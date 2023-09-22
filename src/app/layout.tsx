import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import SideNav from "@/components/SideNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Plastopol",
  description: "Marine plastic pollution data visualization",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "w-full min-h-screen max-h-screen h-screen flex"
        )}
      >
        <SideNav className="z-[2]" />
        <div className="flex-1 overflow-auto z-[1]">{children}</div>
      </body>
    </html>
  );
}
