import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { productId: "1", productName: "Producto A", quantity: 10 },
    { productId: "2", productName: "Producto B", quantity: 7 }
  ]);
} 