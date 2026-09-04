import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/dbConfig.js";
import userRoute from "./Routers/authRoute.js";
import restaurantRoute from "./Routers/restaurantRoute.js";

dotenv.config();

//app init
const app = express();

//default mddlewares
app.use(cors());
app.use(express.json());

//DB connect 
connectDB();

//default Route
app.get("/", (req, res)=>{
    res.status(200).send("Welcome to Restaurant Reservation backend");
})

//Custom Routes

app.use("/api/auth", userRoute);
app.use("/api/restaurants", restaurantRoute);

//Port
const port = process.env.PORT || 5000;

//Starting server
app.listen(port, ()=>{
    console.log(`Server Started on the port ${port}`);
})