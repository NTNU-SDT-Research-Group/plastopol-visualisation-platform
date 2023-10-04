"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImageWithAnnotations } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";

export default function Annotations(): JSX.Element {
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
      console.log(imageWithAnnotations);

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
          <TableHead>Path</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Author ID</TableHead>
          <TableHead>Is Annotated?</TableHead>
          <TableHead className="text-right">Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {imageWithAnnotations.map((imageWithAnnotation) => (
          <TableRow key={imageWithAnnotation.id}>
            <TableCell className="font-medium">
              {imageWithAnnotation.imageUrl}
            </TableCell>
            <TableCell>{imageWithAnnotation.type}</TableCell>
            <TableCell>{imageWithAnnotation.authorId}</TableCell>
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
