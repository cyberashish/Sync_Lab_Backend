import express from "express";
import { LoginUser, LogoutUser, RegisterUser } from "../controllers/user.controller.ts";
import { verifyJwToken } from "../middlewares/user.middleware.ts";

const userRouter = express.Router();

userRouter
.post("/user/register" , RegisterUser)
.post("/user/login" , LoginUser)
.post("/user/logout" , verifyJwToken , LogoutUser)


export {userRouter}