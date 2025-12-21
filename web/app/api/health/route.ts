export const runtime = "edge";

import { NextResponse } from "next/server";

export async function GET() {
  const r = await fetch(`${process.env.API_BASE_URL}/health`, {
    cache: "no-store",
  });

  const data = await r.json();
  return NextResponse.json(data);
}
