"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const dish_routes_1 = __importDefault(require("./routes/dish.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});
const startSever = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log("Connected to MongoDB");
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`server running on PORT ${PORT}`);
        });
    }
    catch (err) { }
};
startSever();
app.get("/health", async (req, res) => {
    res.send({ message: "Health OK!" });
});
app.use("/api/v1/dishes", dish_routes_1.default);
//# sourceMappingURL=index.js.map