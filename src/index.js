import dotenv from "dotenv"
import connectDB from "./db/index.js";
import app from "./app.js"

dotenv.config({path: ".env"})



connectDB()
.then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log(`server is running on https://localhost:${process.env.PORT}`)
  })
})
.catch((err) => {
  console.log("mongoDB connection failed !!! err", err);
});
















// const app = express();

// (async () => {
//      try{
//       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//       app.on("error", (error) => {
//         console.log("Error", error);
//         throw error;
//       });

//       app.listen(process.env.PORT, () => {
//         console.log(`app is listing on ${process.env.PORT}`);
//       })

//      } catch (error) {
//       console.error("ERROR", error);
//       throw error;
//      }
// }) ();