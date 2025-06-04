import mongoose, { Schema } from "mongoose";

enum DietType {
  VEG = "vegetarian",
  NON_VEG = "non vegetarian",
}

enum FlavorType {
  SWEET = "sweet",
  BITTER = "bitter",
  SPICY = "spicy",
  SOUR = "sour", // Consider adding this common Indian flavor
  SAVORY = "savory", // Consider adding this
}

enum CourseType {
  DESSERT = "dessert",
  MAIN_COURSE = "mainCourse",
  SNACK = "snack",
  STARTER = "starter", // Consider adding this common course
}

interface IDish extends mongoose.Document {
  name: string;
  ingredients: string;
  diet: DietType;
  cook_time: number;
  prep_time: number;
  flavor_profile: FlavorType;
  course: CourseType;
  state?: string; // Make optional with ?
  region?: string; // Fixed typo from "reqion" to "region"
}

const dishesSchema = new Schema<IDish>(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Added to remove whitespace
    },
    ingredients: 
      {
        type: String,
        required: true,
        trim: true,
      },
    diet: {
      type: String,
      enum: Object.values(DietType),
      required: true,
    },
    cook_time: {
      type: Number,
      required: true,
      default: -1
    },
    prep_time: {
      type: Number,
      required: true,
      default: -1
    },
    flavor_profile: {
      type: String,
      enum: Object.values(FlavorType),
      required: true,
    },
    course: {
      type: String,
      enum: Object.values(CourseType),
      required: true,
    },
    state: {
      type: String,
      required: false,
      default: undefined,
    },
    region: {
      // Fixed typo from "reqion" to "region"
      type: String,
      required: false,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search functionality
dishesSchema.index({
  name: "text",
  ingredients: "text",
  state: "text",
  region: "text",
});

const Dish = mongoose.model<IDish>("Dish", dishesSchema);

export default Dish;
