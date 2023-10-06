"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImageWithAnnotations } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function Annotations(): JSX.Element {
  const router = useRouter();

  const [imageWithAnnotations, setImageWithAnnotations] = useState<
    ImageWithAnnotations[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/annotation", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const imageWithAnnotations = (await res.json()).data;

      setImageWithAnnotations(imageWithAnnotations);
    }
    fetchData();
  }, []);

  const processedData = useMemo(() => {
    return imageWithAnnotations.map((imageWithAnnotation) => ({
      ...imageWithAnnotation,
      createdAt: new Date(
        imageWithAnnotation.createdAt as unknown as string
      ).toLocaleString(),
      annotations:
        imageWithAnnotation.annotations &&
        JSON.parse(imageWithAnnotation.annotations),
    }));
  }, [imageWithAnnotations]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image ID</TableHead>
          <TableHead>Path</TableHead>
          <TableHead>Latitude</TableHead>
          <TableHead>Longitude</TableHead>
          <TableHead>Is Annotated?</TableHead>
          <TableHead className="text-right">Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {imageWithAnnotations.map((imageWithAnnotation) => (
          <TableRow
            onClick={() => {
              router.push(`/annotations/${imageWithAnnotation.id}`);
            }}
            key={imageWithAnnotation.id}
          >
            <TableCell className="font-medium">
              {imageWithAnnotation.id}
            </TableCell>
            <TableCell className="font-medium">
              {imageWithAnnotation.imageUrl}
            </TableCell>
            <TableCell>{imageWithAnnotation.latitude}</TableCell>
            <TableCell>{imageWithAnnotation.longitude}</TableCell>
            <TableCell>
              {imageWithAnnotation.annotations ? "Yes" : "No"}
            </TableCell>
            <TableCell className="text-right">
              {imageWithAnnotation.createdAt.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
