import express from "express";
import { userRouter } from "./routes/user.routes.ts";
import cors from "cors";
import {fileURLToPath} from "url";
import path from "path";
import cookieParser from 'cookie-parser';

// Resolved paths
const __filename = fileURLToPath(import.meta.url);
const __dirname =  path.dirname(__filename);

export const server = express();

// Middleares
server.use(cors());
server.use(express.json({limit:"16kb"}));
server.use(express.urlencoded({limit:'16kb', extended:true}));
server.use(express.static(path.join(__dirname , "public" )));
server.use(cookieParser());


server.use("/api/v1", userRouter)


