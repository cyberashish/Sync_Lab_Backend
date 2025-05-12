import express from "express";
import { getAuthenticatedUser, LoginUser, LogoutUser, RegisterUser } from "../../controllers/user.controller.ts";
import passport from "passport";
import { verifyToken } from "../../middlewares/user.middleware.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import { ApiError } from "../utils/ApiError.ts";
import { employeeProfile } from "../../controllers/employee.controller.ts";

const userRouter = express.Router();

userRouter
.get("/data" , (req,res) => {
    res.json({type:"Get/new"})
})
.post("/register" , RegisterUser)
.post("/login" , LoginUser)
.get("/logout" , LogoutUser)

// Social Auth
.get('/auth/google',
    passport.authenticate('google', {session: false, scope: ['profile' , 'email'] }))
  
.get('/api/auth/callback/google', 
    passport.authenticate('google', {session: false, failureRedirect: `${process.env.FRONTEND_HOST}/auth/login` }),
    (req,res) => {
        let userData:any = req.user;
        res.cookie("accessToken" , userData.accessToken , {
            httpOnly: true,
            secure:false, sameSite:'strict'
        });
        res.cookie("refreshToken" , userData.refreshToken , {
            httpOnly: true,
            secure:false, sameSite:'strict'
        });
        res.redirect(`${process.env.FRONTEND_HOST}/dashboard`);
    }
    )
.get('/token/get-user' , getAuthenticatedUser)
// .post("/add-employee" , addEmployee)
    



export {userRouter}