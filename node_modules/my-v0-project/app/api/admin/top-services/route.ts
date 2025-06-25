import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { serviceId: "1", serviceName: "Servicio X", count: 15 },
    { serviceId: "2", serviceName: "Servicio Y", count: 8 }
  ]);
} 