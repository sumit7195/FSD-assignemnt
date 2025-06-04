"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
var DietType;
(function (DietType) {
    DietType["VEG"] = "vegetarian";
    DietType["NON_VEG"] = "non vegetarian";
})(DietType || (DietType = {}));
var FlavorType;
(function (FlavorType) {
    FlavorType["SWEET"] = "sweet";
    FlavorType["BITTER"] = "bitter";
    FlavorType["SPICY"] = "spicy";
    FlavorType["SOUR"] = "sour";
    FlavorType["SAVORY"] = "savory";
})(FlavorType || (FlavorType = {}));
var CourseType;
(function (CourseType) {
    CourseType["DESSERT"] = "dessert";
    CourseType["MAIN_COURSE"] = "mainCourse";
    CourseType["SNACK"] = "snack";
    CourseType["STARTER"] = "starter";
})(CourseType || (CourseType = {}));
const dishesSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Added to remove whitespace
    },
    ingredients: {
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
}, {
    timestamps: true,
});
// Text index for search functionality
dishesSchema.index({
    name: "text",
    ingredients: "text",
    state: "text",
    region: "text",
});
const Dish = mongoose_1.default.model("Dish", dishesSchema);
exports.default = Dish;
//# sourceMappingURL=dishes.model.js.map