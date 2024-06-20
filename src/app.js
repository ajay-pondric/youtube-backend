import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";

const app = express();

app.use(cors({origin: process.env.CORS_ORIGIN, credential: true}));

app.use(express.urlencoded({extended: true, limit: "10kb"}))
app.use(express.static("public"))

app.use(cookieParser());

app.use(express.json({limit: "10kb"}));

export default app;
