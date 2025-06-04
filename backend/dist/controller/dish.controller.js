"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDetailsOfCuisine = exports.getPossibleDishes = exports.getAllDishes = exports.addDish = void 0;
const dishes_model_1 = __importDefault(require("../models/dishes.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const addDish = async (req, res) => {
    // Changed return type to Promise<void>
    try {
        const { name, ingredients, diet, cook_time, flavor_profile, course, state, region, prep_time, } = req.body;
        if (!name ||
            !ingredients ||
            !diet ||
            !cook_time ||
            !prep_time ||
            !flavor_profile ||
            !course) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const newDish = new dishes_model_1.default({
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
    }
    catch (error) {
        console.error("Error adding cuisine:", error);
        res.status(500).json({
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.addDish = addDish;
const getAllDishes = async (req, res) => {
    try {
        const { diet, course, region, state, search, // General search term (name, ingredients, or region)
        name, // Specific name search
        ingredient, // Specific ingredient search
        sort = "name", // Default sort by name
        order = "asc", // Default sort order
         } = req.query;
        const filter = {};
        const sortOptions = {};
        // Basic filters
        if (diet)
            filter.diet = diet;
        if (course)
            filter.course = course;
        if (region)
            filter.region = region;
        if (state)
            filter.state = state;
        // Search functionality
        if (search) {
            const searchRegex = new RegExp(search, "i");
            filter.$or = [
                { name: searchRegex },
                { ingredients: searchRegex },
                { region: searchRegex },
                { state: searchRegex },
            ];
        }
        // Specific name search
        if (name) {
            filter.name = new RegExp(name, "i");
        }
        // Specific ingredient search
        if (ingredient) {
            filter.ingredients = new RegExp(ingredient, "i");
        }
        // Sorting
        if (sort) {
            sortOptions[sort] = order === "desc" ? -1 : 1;
        }
        console.log("Filter:", filter);
        console.log("Sort Options:", sortOptions);
        // Get all dishes with applied filters and sorting
        const dishes = await dishes_model_1.default.find(filter)
            .sort(sortOptions)
            .collation({ locale: "en", strength: 2 }); // Case-insensitive sorting
        res.status(200).json({
            message: "Dishes retrieved successfully",
            count: dishes.length,
            data: dishes,
        });
    }
    catch (err) {
        console.error("Error fetching dishes:", err);
        res.status(500).json({
            message: "Server error",
            error: err instanceof Error ? err.message : "unknown error",
        });
    }
};
exports.getAllDishes = getAllDishes;
//find all dishes by ingredients
const getPossibleDishes = async (req, res) => {
    try {
        const { ingredients } = req.body;
        if (!ingredients || !Array.isArray(ingredients)) {
            res.status(400).json({ error: "Ingredients array required!" });
            return;
        }
        // Clean and prepare the ingredients
        const cleanedIngredients = ingredients.map((i) => i.trim().toLowerCase());
        const possibleDishes = await dishes_model_1.default.aggregate([
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getPossibleDishes = getPossibleDishes;
//find the details for dish
const getDetailsOfCuisine = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("req", id);
        // Validate the ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid cuisine ID format",
            });
            return;
        }
        const cuisine = await dishes_model_1.default.findById(id);
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
    }
    catch (err) {
        console.error("Error fetching cuisine details:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err instanceof Error ? err.message : "unknown error",
        });
    }
};
exports.getDetailsOfCuisine = getDetailsOfCuisine;
//# sourceMappingURL=dish.controller.js.map