import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import cors from "cors"

const app = express();

app.use(cors({origin: process.env.CORS_ORIGIN, credential: true}));

app.use(express.urlencoded({extended: true, limit: "10kb"}))
app.use(express.static("public"))
app.use(cookieParser());
app.use(express.json({limit: "10kb"}));

//routes imports
import userRouter from "./routes/user.routes.js";


//routes declaration 
 app.use("/api/v1/users", userRouter);

 // https://localhost:8000/api/v1/users/register

export default app;
