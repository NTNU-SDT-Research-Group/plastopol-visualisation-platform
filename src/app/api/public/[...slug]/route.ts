import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { slug: string[] } }
) {
  const { slug } = context.params;

  if (slug && slug.length) {
    const publicDir = __dirname.split(".next")[0] + "public/";
    const fileUrl = slug.join("/");
    const imageBuffer = fs.readFileSync(publicDir + fileUrl);

    try {
      const response = new NextResponse(imageBuffer);
      response.headers.set("content-type", "image/png");
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  return new NextResponse(null, { status: 404 });
}
