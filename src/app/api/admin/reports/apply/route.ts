import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function POST() {
  return NextResponse.json(
    {
      error: "service_unavailable",
      message: "Admin reports apply is disabled (Supabase has been sunset).",
    },
    { status: 503 },
  );
}
