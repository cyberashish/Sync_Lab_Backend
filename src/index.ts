// import { server } from "./app.ts";
// import { connectDB } from "./utils/client.ts";
// import dotenv from "dotenv";

// import "./jobs/resetLeaves.ts";

// dotenv.config({path:"./.env"});

// const PORT = process.env.PORT || 8080;

// connectDB().then(() => {
//    server.on("error",() => {
//     console.log("Failed to connect with the server");
//    });
//    server.listen(PORT,() => {
//       console.log(`server started listening at http://localhost:${PORT}`)
//    })
// }).catch(() => {
//     console.log("MongoDB connection failed");
// })


import { server } from "./app.ts";
import { connectDB } from "./utils/client.ts";
import dotenv from "dotenv";

import "./jobs/resetLeaves.ts";

dotenv.config({ path: "./.env" });

const PORT = Number(process.env.PORT) || 8080;

connectDB()
  .then(() => {
    server.on("error", () => {
      console.log("Failed to connect with the server");
    });
    server.listen(PORT, "0.0.0.0", () => { // 👈 Binds to all interfaces
      console.log(`Server started listening at http://0.0.0.0:${PORT}`);
    });
  })
  .catch(() => {
    console.log("MongoDB connection failed");
  });
