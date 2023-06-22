import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs";

// https://github.com/vercel/next.js/discussions/39957
export async function POST(request: NextRequest) {
  try {
    // * INFO: Form data is ordered when pushed in single key
    const formData = await request.formData();

    formData.getAll("images").forEach(async (blob) => {
      const file = blob as File;
      const fileName = `${Date.now()}-${file.name}`;
      const path = `upload/${fileName}`;
      const arrayBuffer = await file.arrayBuffer();

      fs.writeFileSync(`public/${path}`, Buffer.from(arrayBuffer));

      const createdEntry = await prisma.imageWithAnnotations.create({
        data: {
          imageUrl: path,
        },
      });

      console.log(createdEntry);
    });

    // console.log(JSON.parse(formData.get("annotations") as string));

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
