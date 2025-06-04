import { NextResponse } from "next/server";
import dishesData from "@/data/indian_food.json";
import { BACKEND_URL } from "../dishes/route";

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();

    if (!ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: "Invalid ingredients provided" },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/possible-dishes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ingredients: ingredients,
      }),
    });

    const possibleDishes = await response.json();

    console.log("possible match", possibleDishes);

    return NextResponse.json(possibleDishes);
  } catch (error) {
    console.error("Error suggesting dishes:", error);
    return NextResponse.json(
      { error: "Failed to suggest dishes" },
      { status: 500 }
    );
  }
}
