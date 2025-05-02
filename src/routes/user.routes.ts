import express from "express";
import { login, registerUser } from "../../controllers/user.controller.ts";

const userRouter = express.Router();

userRouter
.get("/" , (req,res) => {
    res.json({type:"Get/new"})
})
.post("/register" , registerUser)
.post("/login" , login)



export {userRouter}