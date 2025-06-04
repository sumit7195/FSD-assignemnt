import { NextResponse } from "next/server";

export const BACKEND_URL = "http://localhost:4000/api/v1/dishes";

export async function GET() {
  try {
    // Fetch dishes from your backend
    const response = await fetch(BACKEND_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const dishes = await response.json();
    console.log("dishes",dishes)
    return NextResponse.json(dishes);
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return NextResponse.json(
      { error: "Failed to fetch dishes from backend" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "ingredients",
      "diet",
      "prep_time",
      "cook_time",
      "flavor_profile",
      "course",
      "state",
      "region",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Forward the request to your backend
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const newDish = await response.json();
    return NextResponse.json(newDish, { status: 201 });
  } catch (error) {
    console.error("Error creating dish:", error);
    return NextResponse.json(
      { error: "Failed to create dish in backend" },
      { status: 500 }
    );
  }
}

// Add this if you need to handle the possible-dishes endpoint
export async function PUT(request: Request) {
  try {
    const { ingredients } = await request.json();

    if (!ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: "Ingredients array is required" },
        { status: 400 }
      );
    }

    // Call the possible-dishes endpoint on your backend
    const response = await fetch(`${BACKEND_URL}/possible-dishes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const possibleDishes = await response.json();
    return NextResponse.json(possibleDishes);
  } catch (error) {
    console.error("Error finding possible dishes:", error);
    return NextResponse.json(
      { error: "Failed to find possible dishes" },
      { status: 500 }
    );
  }
}
