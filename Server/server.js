import dotenv from "dotenv";
import { ConnectDb } from "./config/db.config.js";
import app from "./app.js";
dotenv.config();
ConnectDb();

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`App is listening on ${PORT}`);
})