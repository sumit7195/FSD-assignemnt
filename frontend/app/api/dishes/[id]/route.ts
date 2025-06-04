import { NextResponse } from "next/server";
import dishesData from "@/data/indian_food.json";
import { BACKEND_URL } from "../route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dishId = params.id;

    console.log("dishId",dishId)
    const response = await fetch(`${BACKEND_URL}/${dishId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log('response', response)

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const dishes = await response.json();
    return NextResponse.json(dishes);
  } catch (error) {
    console.error("Error fetching dish:", error);
    return NextResponse.json(
      { error: "Failed to fetch dish" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const dishId = Number.parseInt(params.id);

    // For demo purposes, return updated data
    return NextResponse.json({
      ...data,
      id: dishId,
    });
  } catch (error) {
    console.error("Error updating dish:", error);
    return NextResponse.json(
      { error: "Failed to update dish" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    return NextResponse.json({
      success: true,
      message: "Dish deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting dish:", error);
    return NextResponse.json(
      { error: "Failed to delete dish" },
      { status: 500 }
    );
  }
}
