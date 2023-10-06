"use client";

import { ImageWithAnnotations } from "@prisma/client";
import { useEffect, useState } from "react";
import Image from "next/image";

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

  if (!imageWithAnnotations) {
    return null;
  }

  return (
    <div>
      <Image
        width={300}
        height={300}
        alt="annotated image"
        src={"/" + imageWithAnnotations.imageUrl}
      />
    </div>
  );
}
