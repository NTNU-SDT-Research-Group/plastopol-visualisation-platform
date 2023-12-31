import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs";

// https://github.com/vercel/next.js/discussions/39957
export async function POST(request: NextRequest) {
  try {
    // * INFO: Form data is ordered when pushed in single key
    const formData = await request.formData();

    const annotations = formData.getAll("annotations") as (string | null)[];
    const metadata = formData.getAll("metadata");

    formData.getAll("images").forEach(async (blob, idx) => {
      const file = blob as File & { width: number; height: number };
      const fileName = `${Date.now()}-${file.name}`;
      const path = `upload/${fileName}`;
      const arrayBuffer = await file.arrayBuffer();

      fs.writeFileSync(`public/${path}`, Buffer.from(arrayBuffer));

      const imageMetadata = JSON.parse(metadata[idx] as string) as {
        width: number;
        height: number;
        scaledWidth: number | undefined;
        scaledHeight: number | undefined;
        location:
          | {
              latitude: number | undefined;
              longitude: number | undefined;
            }
          | undefined;
      };

      const createdEntry = await prisma.imageWithAnnotations.create({
        data: {
          imageUrl: path,
          type: file.type,
          width: imageMetadata.width,
          height: imageMetadata.height,
          scaledWidth: imageMetadata.scaledWidth,
          scaledHeight: imageMetadata.scaledHeight,
          annotations: annotations[idx],
          longitude: imageMetadata.location?.longitude,
          latitude: imageMetadata.location?.latitude,
        },
      });
    });

    return NextResponse.json({
      status: 200,
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Upload failed - ${err}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const imageWithAnnotations = await prisma.imageWithAnnotations.findUnique(
        {
          where: {
            id: parseInt(id),
          },
        }
      );

      return NextResponse.json({
        status: 200,
        data: imageWithAnnotations,
      });
    }

    const imageWithAnnotations = await prisma.imageWithAnnotations.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      status: 200,
      data: imageWithAnnotations,
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Upload failed - ${err}` },
      { status: 500 }
    );
  }
}
