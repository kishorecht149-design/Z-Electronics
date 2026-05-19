import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    app: "z-electronics-frontend",
    status: "ok",
    timestamp: new Date().toISOString()
  });
}
