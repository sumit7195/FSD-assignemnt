import { Request, Response } from "express";
import Dish from "../models/dishes.model";
import mongoose from "mongoose";

export const addDish = async (req: Request, res: Response) => {
  // Changed return type to Promise<void>
  try {
    const {
      name,
      ingredients,
      diet,
      cook_time,
      flavor_profile,
      course,
      state,
      region,
      prep_time,
    } = req.body;

    if (
      !name ||
      !ingredients ||
      !diet ||
      !cook_time ||
      !prep_time ||
      !flavor_profile ||
      !course
    ) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const newDish = new Dish({
      name,
      ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
      diet,
      cook_time,
      prep_time,
      flavor_profile,
      course,
      state: state || undefined,
      region: region || undefined,
    });

    const savedDish = await newDish.save();
    res.status(201).json({
      message: "Cuisine added successfully",
      data: savedDish,
    });
  } catch (error) {
    console.error("Error adding cuisine:", error);
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllDishes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      diet,
      course,
      region,
      state,
      search, // General search term (name, ingredients, or region)
      name, // Specific name search
      ingredient, // Specific ingredient search
      sort = "name", // Default sort by name
      order = "asc", // Default sort order
    } = req.query;

    const filter: Record<string, any> = {};
    const sortOptions: Record<string, any> = {};

    // Basic filters
    if (diet) filter.diet = diet;
    if (course) filter.course = course;
    if (region) filter.region = region;
    if (state) filter.state = state;

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search as string, "i");
      filter.$or = [
        { name: searchRegex },
        { ingredients: searchRegex },
        { region: searchRegex },
        { state: searchRegex },
      ];
    }

    // Specific name search
    if (name) {
      filter.name = new RegExp(name as string, "i");
    }

    // Specific ingredient search
    if (ingredient) {
      filter.ingredients = new RegExp(ingredient as string, "i");
    }

    // Sorting
    if (sort) {
      sortOptions[sort as string] = order === "desc" ? -1 : 1;
    }

    console.log("Filter:", filter);
    console.log("Sort Options:", sortOptions);

    // Get all dishes with applied filters and sorting
    const dishes = await Dish.find(filter)
      .sort(sortOptions)
      .collation({ locale: "en", strength: 2 }); // Case-insensitive sorting

    res.status(200).json({
      message: "Dishes retrieved successfully",
      count: dishes.length,
      data: dishes,
    });
  } catch (err) {
    console.error("Error fetching dishes:", err);
    res.status(500).json({
      message: "Server error",
      error: err instanceof Error ? err.message : "unknown error",
    });
  }
};

//find all dishes by ingredients
export const getPossibleDishes = async (req: Request, res: Response) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      res.status(400).json({ error: "Ingredients array required!" });
      return;
    }

    // Clean and prepare the ingredients
    const cleanedIngredients = ingredients.map((i) => i.trim().toLowerCase());

    const possibleDishes = await Dish.aggregate([
      {
        $addFields: {
          ingredientsArray: {
            $map: {
              input: { $split: ["$ingredients", ","] },
              as: "ing",
              in: { $trim: { input: { $toLower: "$$ing" } } }, // Trim and lowercase
            },
          },
        },
      },
      {
        $addFields: {
          // Count how many ingredients you have for each dish
          matchedIngredientsCount: {
            $size: {
              $setIntersection: ["$ingredientsArray", cleanedIngredients],
            },
          },
          // Total ingredients in the dish
          totalIngredientsCount: { $size: "$ingredientsArray" },
        },
      },
      {
        // Filter out dishes with no matching ingredients
        $match: {
          matchedIngredientsCount: { $gt: 0 },
        },
      },
      {
        // Add a percentage match field
        $addFields: {
          matchPercentage: {
            $multiply: [
              {
                $divide: ["$matchedIngredientsCount", "$totalIngredientsCount"],
              },
              100,
            ],
          },
        },
      },
      {
        // Sort by best match first
        $sort: { matchPercentage: -1, matchedIngredientsCount: -1 },
      },
    ]);

    res.json({ data: possibleDishes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

//find the details for dish
export const getDetailsOfCuisine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log("req", id);
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid cuisine ID format",
      });
      return;
    }

    const cuisine = await Dish.findById(id);

    if (!cuisine) {
      res.status(404).json({
        success: false,
        message: "Cuisine not found",
      });
      return;
    }

    res.status(200).json({
      status: true,
      data: cuisine,
    });
  } catch (err) {
    console.error("Error fetching cuisine details:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : "unknown error",
    });
  }
};
