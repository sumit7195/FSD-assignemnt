import { NextResponse } from "next/server"
import dishesData from "@/data/indian_food.json"
import { BACKEND_URL } from "../dishes/route"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase() || ""

    if (!query) {
      return NextResponse.json([])
    }

    const response = await fetch(`${BACKEND_URL}?search=${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error searching dishes:", error)
    return NextResponse.json({ error: "Failed to search dishes" }, { status: 500 })
  }
}
