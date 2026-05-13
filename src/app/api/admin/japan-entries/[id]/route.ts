import { NextResponse } from "next/server";

const DISABLED_BODY = {
  error: "service_unavailable",
  message: "Admin write API is disabled (Supabase has been sunset).",
};

export const dynamic = "force-dynamic";

export function PATCH() {
  return NextResponse.json(DISABLED_BODY, { status: 503 });
}

export function DELETE() {
  return NextResponse.json(DISABLED_BODY, { status: 503 });
}
