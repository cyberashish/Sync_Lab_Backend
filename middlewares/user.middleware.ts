import jwt from "jsonwebtoken";
import { Request , Response , NextFunction } from "express";
import { generateJwtToken } from "../controllers/user.controller.ts";
import { ApiError } from "../src/utils/ApiError.ts";

function verifyToken(token:string , secretKey:string){
  return new Promise((resolve , reject) => {
   jwt.verify(token , secretKey , function(error , decoded){
       if(error){
           reject(error)
       }else{
           resolve(decoded);
       }
   })
  })
}

export async function verifyJwToken(req:Request,res:Response,next:NextFunction){
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if(accessToken && refreshToken){
  const accessTokenDecodedInfo = await verifyToken(accessToken , process.env.ACCESS_TOKEN_SECRET_KEY);
  if(accessTokenDecodedInfo){
    next();
  }else{
   const refreshTokenDecodedInfo:any = await verifyToken(refreshToken , process.env.REFRESH_TOKEN_SECRET_KEY);
   if(refreshTokenDecodedInfo){
    const accessToken = await generateJwtToken({fullname : refreshTokenDecodedInfo.fullname , email: refreshTokenDecodedInfo.email}, process.env.ACCESS_TOKEN_SECRET_KEY , 1);
    res.cookie("accessToken" , accessToken , {
       httpOnly: true ,
       secure: true ,
       sameSite: "strict"
    });
    next();
   }else{
       res.status(401).json(new ApiError(401,"Jwt tokens expired!"))
   }
  }
}else{
   res.status(401).json(new ApiError(422 , "Must provide Jwt Token"));
}
}