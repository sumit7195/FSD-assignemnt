"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dish_controller_1 = require("../controller/dish.controller");
const router = express_1.default.Router();
router.get("/", dish_controller_1.getAllDishes);
//get details for dishes
router.get("/:id", dish_controller_1.getDetailsOfCuisine);
router.post("/", dish_controller_1.addDish);
//find all possible dishes by ingredients
router.post("/possible-dishes", dish_controller_1.getPossibleDishes);
exports.default = router;
//# sourceMappingURL=dish.routes.js.map