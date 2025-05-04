import express from "express";
import { LoginUser, RegisterUser } from "../../controllers/user.controller.ts";

const userRouter = express.Router();

userRouter
.get("/" , (req,res) => {
    res.json({type:"Get/new"})
})
.post("/register" , RegisterUser)
.post("/login" , LoginUser)



export {userRouter}