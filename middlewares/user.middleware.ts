// Practice middlare function
import {Request , Response , NextFunction} from "express";
import jwt from "jsonwebtoken";
import { getJwtToken } from "../controllers/user.controller.ts";
import { ApiError } from "../src/utils/ApiError.ts";

 function verifyToken(accessToken:string , secretkey:string ){
   return new Promise((resolve , reject) => {
    jwt.verify(accessToken,secretkey,(error , decoded:any) => {
        if(error){
          reject({...error , isVerified:false})
        }else{
          resolve({...decoded , isVerified:true});
        }
    })
 })
 }

const verifyJwt = async (req:Request,res:Response,next:NextFunction) => {
   const {accessToken , refreshToken} = req.cookies;
    // verify accesstoken
    const tokenData:any = await verifyToken(accessToken , process.env.ACCESS_TOKEN_SECRET_KEY);
    console.log(tokenData,"See Data");
    if(tokenData.isVerified){
       next();
    }else{
        const refreshTokenData:any = await verifyToken(refreshToken , process.env.REFRESH_TOKEN_SECRET_KEY);
        if(refreshTokenData.isVerified){
            const accessToken = getJwtToken({fullname:refreshTokenData.fullname , email:refreshTokenData.email} , "1d");
            res.cookie("accessToken" , accessToken , {
                httpOnly: true,
                secure: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            next();
        }
        else{
            res.status(401).json(new ApiError(401 , "Unauthorised acccess"))
        }
    }
} 