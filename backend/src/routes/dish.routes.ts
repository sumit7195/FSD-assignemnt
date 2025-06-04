import express from "express";
import {
  addDish,
  getAllDishes,
  getPossibleDishes,
  getDetailsOfCuisine,
} from "../controller/dish.controller";

const router = express.Router();

router.get("/", getAllDishes);
//get details for dishes
router.get("/:id", getDetailsOfCuisine);

router.post("/", addDish);

//find all possible dishes by ingredients
router.post("/possible-dishes", getPossibleDishes);

export default router;
