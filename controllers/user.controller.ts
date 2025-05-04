import { Request, Response } from "express";
import { ApiError } from "../src/utils/ApiError.ts";
import bcrypt from "bcryptjs";
import { prisma } from "../src/utils/client.ts";
import { ApiResponse } from "../src/utils/ApiResponse.ts";
import jwt from "jsonwebtoken";


// Functions to deal with accesstoken and refresh token

 export function getJwtToken(user:{fullname:string , email:string},expiry:any){
        return new Promise((resolve , reject) => {
           jwt.sign({...user} , process.env.ACCESS_TOKEN_SECRET_KEY , {expiresIn:expiry} , (error,token) => {
             if(error){
               reject(error)
             }else{
               resolve(token);
             }
           })
        })
}

// Register controller function

const registerUser = async (req: Request,res: Response) => 
     {
     const {fullname , email , password} = req.body;

     if(fullname && email && password){
        const user = await prisma.user.findUnique({
          where:{ email }
       });
       if(!user){
          const hashedPassword = await bcrypt.hash(password,10);
          try{
               const user = await prisma.user.create({
                    data:{
                         fullname,
                         email,
                         password:hashedPassword
                    }
               });
               const accesstoken = await getJwtToken({fullname,email},process.env.ACCESS_TOKEN_EXPIRY);
               const refreshtoken = await getJwtToken({fullname,email},process.env.REFRESH_TOKEN_EXPIRY);
               
               res.cookie('accessToken' , accesstoken , {
                    httpOnly:true,
                    secure:true,
                    maxAge: 24 * 60 * 60 * 1000
               });
               res.cookie('refreshToken' , refreshtoken , {
                    httpOnly: true,
                    secure: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000
               })
               res.status(200).json(new ApiResponse(200, user , "User registered successfully"));
          }catch(error){
             console.log(error);
             res.status(500).json(new ApiError(500,"Failed to create user"))
          }
       }else{
         res.status(409).json(new ApiError(409,"User already exist"));
       }
     }else{
          res.status(400).json(new ApiError(400,"All data fields are required"));
     }
     
}

// Login controller function

const login = async (req:Request,res:Response) => {
     
     const {email , password} = req.body;
     if(email && password){
       try{
         const user = await prisma.user.findUnique({
          where:{
               email
          }
         });
         if(user){
            const isValidPassword = await bcrypt.compare(password,user.password);
            if(isValidPassword){
              const accessToken = getJwtToken({fullname:user.fullname , email:user.email} ,process.env.ACCESS_TOKEN_EXPIRY);
              const refreshToken = getJwtToken({fullname:user.fullname , email:user.email} ,process.env.REFRESH_TOKEN_EXPIRY);
           // Set token in the cookies
              res.cookie("accessToken" , accessToken , {httpOnly:true, secure:true , maxAge: 24 * 60 * 60 * 1000});
              res.cookie("refreshToken" , refreshToken , {httpOnly:true , secure:true , maxAge: 7 * 24 * 60 * 60 * 1000})  
              
              res.status(200).json(new ApiResponse(200,"User logged in successfully"))
            }else{
             res.status(401).json(new ApiError(401, "Invalid email/password"));
            }
         }else{
          res.status(404).json(new ApiError(404 , "User does not exist"));
         }
       }catch(error){
          res.status(500).json(new ApiError(404,"Failed to do user login"));
       }
     }else{
          res.status(400).json(new ApiError(400 , "All fields are required"));
     }

}




export {registerUser , login};