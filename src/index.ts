import { server } from "./app.ts";
import { connectDB } from "./utils/client.ts";
import dotenv from "dotenv";

dotenv.config({path:"./.env"});

connectDB().then(() => {
   server.on("error",() => {
    console.log("Failed to connect with the server");
   });
   server.listen(process.env.PORT,() => {
      console.log(`server started listening at http://localhost:${process.env.PORT}`)
   })
}).catch(() => {
    console.log("MongoDB connection failed");
})