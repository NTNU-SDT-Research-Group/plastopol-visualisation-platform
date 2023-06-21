import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  const res = "Hello";

  return NextResponse.json(res);
}