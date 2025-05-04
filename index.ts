import dotenv from "dotenv";
import { connectDB } from "./src/utils/client.ts";
import { server } from "./src/app.ts";

dotenv.config({path:"./.env"});

const port = process.env.PORT || 8000

connectDB().then(() => {
    server.on("error" , () => {
        console.log("Failed to connect with the server")
    });
    server.listen(process.env.PORT , () => {
        console.log(`Server started listening at ${port}`)
    })
}).catch((error) => {
    console.log("Database connection failed",error)
})