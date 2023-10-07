"use client";

import { ImageWithAnnotations } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import Map, { Marker } from "react-map-gl";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";

export default function Page({ params }: { params: { id: string } }) {
  const [imageWithAnnotations, setImageWithAnnotations] =
    useState<ImageWithAnnotations>();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "/api/annotation?" +
          new URLSearchParams({
            id: params.id,
          }),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const imageWithAnnotations = (await res.json()).data;
      setImageWithAnnotations(imageWithAnnotations);
    }
    fetchData();
  }, [params.id]);

  const parsedAnnotations = useMemo(
    () =>
      imageWithAnnotations?.annotations &&
      JSON.parse(imageWithAnnotations.annotations),
    [imageWithAnnotations]
  );

  console.log(parsedAnnotations);

  if (!imageWithAnnotations) {
    return null;
  }

  const aspectRatio = imageWithAnnotations.width / imageWithAnnotations.height;

  return (
    <div className="flex h-screen">
      <div className="flex items-center justify-center flex-1 p-2 bg-black">
        <div
          style={{
            aspectRatio,
          }}
          className={cn(
            aspectRatio < 1 ? "max-h-[95%]" : "max-w-[95%]",
            "overflow-hidden rounded-sm"
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            width="100%"
            height="100%"
            alt="annotated image"
            src={`/api/public/${imageWithAnnotations.imageUrl}`}
          />
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-center flex-1 p-1">
          {parsedAnnotations.length !== 0 ? (
            <Textarea
              contentEditable={false}
              value={JSON.stringify(parsedAnnotations, null, "\t")}
              className="h-full bg-slate-100 color-slate-900"
            />
          ) : (
            "Annotations not available"
          )}
        </div>
        <div className="w-full h-[1px] bg-slate-300"></div>
        <div className="flex-1 p-1">
          {imageWithAnnotations.latitude && imageWithAnnotations.longitude ? (
            <div className="w-full h-full overflow-hidden rounded-md">
              <Map
                initialViewState={{
                  latitude: imageWithAnnotations.latitude,
                  longitude: imageWithAnnotations.longitude,
                  zoom: 14.5,
                  bearing: 0,
                  pitch: 0,
                }}
                styleDiffing={true}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
              >
                <Marker
                  key={"marker"}
                  longitude={imageWithAnnotations.longitude}
                  latitude={imageWithAnnotations.latitude}
                  anchor="bottom"
                >
                  <MapPin className="stroke-red-800 fill-red-300" />
                </Marker>
              </Map>
            </div>
          ) : (
            "No location data available"
          )}
        </div>
      </div>
    </div>
  );
}
