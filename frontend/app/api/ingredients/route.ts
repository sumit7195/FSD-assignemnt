import { NextResponse } from "next/server"
import dishesData from "@/data/indian_food.json"
import { BACKEND_URL } from "../dishes/route";

export async function GET() {
  try {
    // Extract all unique ingredients from all dishes
    const allIngredients = new Set<string>()

    const response = await fetch(BACKEND_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const {data} = await response.json()
    // console.log("dishes", JSON.stringify(dishes))

    data.forEach((dish:any) => {
      dish.ingredients.split(',').forEach((ingredient: string) => {
        allIngredients.add(ingredient.trim())
      })
    })

    // Convert to array and sort alphabetically
    const sortedIngredients = Array.from(allIngredients).sort()

    console.log("sorteIngredients", sortedIngredients);

    return NextResponse.json(sortedIngredients)
  } catch (error) {
    console.error("Error fetching ingredients:", error)
    return NextResponse.json({ error: "Failed to fetch ingredients" }, { status: 500 })
  }
}
