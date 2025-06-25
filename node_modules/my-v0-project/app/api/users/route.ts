import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/config/firebase/firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = await getAuth().verifyIdToken(token);
    const db = getFirestore();
    // Leer el rol desde Firestore
    const userDoc = await db.collection("users").doc(decoded.uid).get();
    const userData = userDoc.data();
    if (!userData || userData.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const usersSnapshot = await db.collection("users").get();
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
} 