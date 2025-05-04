import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export async function connectDB(){
    try{
      await prisma.$connect();
      console.log("Database connected successfully");
    }catch(error){
      console.log("Database connection failed");
    }
}

export {prisma}