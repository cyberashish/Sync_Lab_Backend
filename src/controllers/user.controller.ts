import {Request , Response} from "express";
import { ApiError } from "../utils/apiError.ts";
import { prisma } from "../utils/client.ts";
import bcrypt from "bcryptjs";
import { ApiResponse } from "../utils/apiResponse.ts";
import jwt from "jsonwebtoken";


export  function generateJwtToken(user:{fullname:string , email:string} , secretKey:string , expiry:number){
     return new Promise((resolve , reject) => {
         jwt.sign(user, secretKey , {expiresIn:`${expiry}d`}, function( error , token){
           if(error){
            reject(error)
           }else{
            resolve(token)
           }
         })
     })
 }


export const RegisterUser = async (req:Request,res:Response) => {
        const {email , fullname ,password} = req.body;
        if(email && fullname && password){
           try{
             const user = await prisma.user.findUnique({
                where:{
                    email:email
                }
             });
             if(!user){
               const salt = await bcrypt.genSalt(10);
               const hashedPassword = await bcrypt.hash(password , salt);
               try{ 
                  const createdUser = await prisma.user.create({
                    data:{
                        email,
                        fullname,
                        password:hashedPassword
                    }
                  });
                  if(createdUser){
                    try{
                        const accessToken = await generateJwtToken({fullname , email} , process.env.ACCESS_TOKEN_SECRET_KEY , 1);
                        const refreshToken = await generateJwtToken({fullname , email} , process.env.REFRESH_TOKEN_SECRET_KEY , 7);
                        res.cookie("accessToken" , accessToken , {
                            httpOnly: true ,
                            secure: true,
                            sameSite: 'strict'
                        });
                        res.cookie('refreshToken' , refreshToken , {
                            httpOnly: true,
                            secure:true,
                            sameSite:"strict"
                        })
                    }catch(error){
                       res.status(500).json(new ApiResponse(500 , error.message))
                    }
                    res.status(201).json(new ApiResponse(200 , createdUser , "User registered successfully"))
                  }else{
                    res.status(500).json(new ApiError(500 , "Failed to create user"))
                  }
               }catch(error){
                  res.status(500).json(new ApiError(500 , error.message))
               }
             }else{
                res.status(409).json(new ApiError(409 , "User already registered"));
             }

           }catch(error){
              res.status(500).json(new ApiError(500 , error.message))
           }
        }else{
            res.status(422).json(new ApiError(422 , "Missing Required Fields"))
        }
     
}


export const LoginUser = async (req:Request,res:Response) => {
      const {email , password} = req.body;
      if(email && password){
       try{
         const user = await prisma.user.findUnique({
            where:{
                email:email
            }
         });
         if(user){
           const isPasswordValid = await bcrypt.compare(password , user.password);
           if(isPasswordValid){
            try{
                const accessToken = await generateJwtToken({fullname:user.fullname , email:user.email} , process.env.ACCESS_TOKEN_SECRET_KEY , 1);
                const refreshToken = await generateJwtToken({fullname:user.fullname , email:user.email} , process.env.REFRESH_TOKEN_SECRET_KEY , 7);
                res.cookie("accessToken" , accessToken , {
                    httpOnly: true ,
                    secure: true,
                    sameSite: 'strict'
                });
                res.cookie('refreshToken' , refreshToken , {
                    httpOnly: true,
                    secure:true,
                    sameSite:"strict"
                });
                res.status(200).json(new ApiResponse(200 , user, "User logged in successfully"))
            }catch(error){
               res.status(500).json(new ApiError(500 , "Failed to generate tokens"))
            }
           }else{
             res.status(404).json(new ApiError(404,"Email/Password not valid"))
           }
         }else{
             res.status(404).json(new ApiError(404 , "User not found"))
         }

       }catch(error){
         res.status(500).json(new ApiError(500 , error.message))
       }
      }else{
         res.status(422).json(new ApiError(422,"Please provide missing fields"));
      }
}

export const LogoutUser = async (req:Request , res:Response) => {
    try{
       res.clearCookie("accessToken");
       res.clearCookie("refreshToken");
       res.status(200).json(new ApiResponse(200,{},"User loggedout successfully!"));
    }catch(error){
        res.status(500).json(new ApiError(500 , error.message))
    }
}

