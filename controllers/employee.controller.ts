import { Request, Response } from "express"
import { ApiError } from "../src/utils/ApiError.ts"
import { prisma } from "../src/utils/client.ts";
import { ApiResponse } from "../src/utils/ApiResponse.ts";
import { generateSimplePassword } from "../src/utils/generatePassword.ts";
import bcrypt, { genSalt } from "bcryptjs";
import { generateEmployeeId } from "../src/utils/generateEmployeeId.ts";

export const addEmployee = async (req:Request , res:Response) => {
  try{
    const {name , email , gender , mobile_number , aadhaar_number , account_number , department , designation , previous_company , pf_number, salary , active, current_address , permanent_address , employeeDOBDate , employeeJoiningDate} = req.body;

    if(name && email && gender && active && mobile_number && aadhaar_number && account_number && department && designation && previous_company && pf_number&& salary && current_address && permanent_address && employeeDOBDate && employeeJoiningDate){
      
   const password = generateSimplePassword(name , email);
    const salt = await genSalt(10);
    const hashedPassword = await bcrypt.hash(password , salt);

    const employeeId = generateEmployeeId();

    const user = await prisma.user.create({
     data:{
        fullname:name,
        email,
        password:hashedPassword
     }
    });
    const employee = await prisma.employee.create({
     data:{
       employeeId,name , active, email , gender , mobile_number , aadhaar_number , account_number , department , designation , previous_company , pf_number, salary , current_address , permanent_address , employeeDOBDate , employeeJoiningDate,employeePassword:password, userId:user.id
     }
    });
    res.status(200).json(new ApiResponse(200, employee , "Employee created successfully !"));

    }else{
     res.status(422).json(new ApiError(401 , "Please provide all valid field!"))
    }

  }catch(error){
   res.status(401).json(new ApiError(401 , error.message))
  }
}

export const editEmployee = async (req:Request , res:Response) => {
   try{
    const {email, leave , id , ...toEditData } = req.body;
    if(email && toEditData){
      const updatedEmployee = await prisma.employee.update({
        where:{
          email:email
        },
        data:{...toEditData}
      });
      res.status(200).json(new ApiResponse(200 , updatedEmployee , "Successfully updated employee!"))
    }else{
      res.status(422).json(new ApiError(422,"Please provide all valid field data !"))
    }
   }catch(error){
    console.log(error);
    res.status(500).json(new ApiError(500,error.message))
   }
}

export const employeeProfile = async (req:Request,res:Response) => {
    try{
       const employeeId = req.params.id;
       if(employeeId){
         const employee = await prisma.employee.findUnique({
            where:{
                id:employeeId
            }
         });
         res.status(200).json(new ApiResponse(200,employee,"Successfully fetched employee"));
       }else{
        res.status(422).json(new ApiError(422 , "Please provide employee id"))
       }
    }catch(error){
      res.status(500).json(new ApiError(500,error.message))
    }
}

export const getAllEmployees = async (req:Request , res:Response) => {
  try{
    const allEmployees = await prisma.employee.findMany();
    res.status(200).json(new ApiResponse(200 , allEmployees , "Successfully fetched all employess!"))
  }catch(error){
    res.status(500).json(new ApiError(500,error.message))
  }
}

export const deleteEmployee = async (req:Request,res:Response) => {
  try{
    console.log(req.params.id,"data");
    if(req.params.id){
      const deletedEmployee = await prisma.employee.delete({
        where:{
          id: req.params.id
        }
       });
       res.status(200).json(new ApiResponse(200,deletedEmployee , "Successfully deleted employee!"))
    }else{
      res.status(422).json(new ApiError(422,"Please provide all valid field data !"))
    }

  }catch(error){
    res.status(500).json(new ApiError(500,error.message))
  }
}

export const addEmployeesRequest = async (req:Request,res:Response) => {
   try{
     const {employeeId , name , designation , date , description , leave , requestStatus , isRequestApproved} = req.body;
     if(employeeId && name && designation && date && description && leave && requestStatus){
      const request = await prisma.request.create({
        data:{
          employeeId , name , designation , date: new Date(date) , description , leave , requestStatus , isRequestApproved
        }
      });
      res.status(200).json(new ApiResponse(200 , request , "Successfully created request!"))
     }else{
      res.status(422).json(new ApiError(422 , "Please provide all valid fields!"))
     }
   }catch(error){
    res.status(500).json(new ApiError(500,error.message))
   }
}

export const getAllEmployeesRequest = async (req:Request,res:Response) => {
  try{
     const allRequests = await prisma.request.findMany();
     res.status(200).json(new ApiResponse(200 , allRequests , "Successfully fetched all requests!"));
  }catch(error){
    res.status(500).json(new ApiError(500,error.message))
  }
}

export const updateEmployeeRequest = async (req:Request,res:Response) => {
  try{
     const {id , ...toUpdateData} = req.body;
     console.log(req.body);
     if(id){
       const updatedRequest = await prisma.request.update({
        where:{
          id:id
        },
        data:{...toUpdateData}
       });
       res.status(200).json(new ApiResponse(200 , updatedRequest , "Successfully updated request !"))
     }else{
      res.status(422).json(new ApiError(422 , "Please provide valid requestId!"))
     }
  }catch(error){
    res.status(500).json(new ApiError(500,error.message))
  }
}