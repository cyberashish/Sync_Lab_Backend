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

    const employee = await prisma.employee.create({
     data:{
       employeeId,name , active, email , gender , mobile_number , aadhaar_number , account_number , department , designation , previous_company , pf_number, salary , current_address , permanent_address , employeeDOBDate , employeeJoiningDate,employeePassword:password
     }
    });
    res.status(200).json(new ApiResponse(200, employee , "Employee created successfully !"));

    }else{
     res.status(422).json(new ApiError(401 , "Please provide all valid field!"))
    }

  }catch(error){
    console.log(error);
   res.status(401).json(new ApiError(401 , error.message))
  }
}

export const editEmployee = async (req:Request , res:Response) => {
   try{
    const {id, ...toEditData } = req.body;
    console.log(toEditData);
    if(id && toEditData){
      const updatedEmployee = await prisma.employee.update({
        where:{
          id:id
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
     const {employeeId , name , email, leaveDates, designation , description , leave , requestStatus , isRequestApproved , leaveType} = req.body;
     if(employeeId && name && designation && description && leave && leaveType && email && leaveDates){
      const request = await prisma.request.create({
        data:{
          employeeId , name , designation , date: new Date() , description , leave , requestStatus , isRequestApproved , leaveType , email, leaveDates
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
    console.log(error);
    res.status(500).json(new ApiError(500,error.message))
  }
}

export const updateEmployeeRequest = async (req:Request,res:Response) => {
  try{
     const {id , ...toUpdateData} = req.body;
     console.log(req.body, "mera body");
     if(id){
       try {
        const updatedRequest = await prisma.request.update({
         where:{
           id:id
         },
         data:{...toUpdateData}
        });
        res.status(200).json(new ApiResponse(200 , updatedRequest , "Successfully updated request !"))
       } catch (error) {
        res.status(500).json(new ApiError(500,error.message))
       }
     }else{
      res.status(422).json(new ApiError(422 , "Please provide valid requestId!"))
     }
  }catch(error){
    res.status(500).json(new ApiError(500,error.message))
  }
}
export const getEmployeeByEmail = async (req:Request,res:Response) => {
  try{
     const {email} = req.body;
     if(email){
       try {
        const employee = await prisma.employee.findUnique({
         where:{
           email:email
         }
        })
        res.status(200).json(new ApiResponse(200 , employee , "Successfully updated request !"))
       } catch (error) {
        res.status(500).json(new ApiError(500,error.message))
       }
     }else{
      res.status(422).json(new ApiError(422 , "Please provide valid requestId!"))
     }
  }catch(error){
    res.status(500).json(new ApiError(500,error.message))
  }
}

export const updateEmployeeLeave = async (req:Request , res:Response) => {
  try{
    const {email , leave , leaveType} = req.body;
    if(email && leave && leaveType){
      if(leaveType === "Casual"){
        const updatedEmployeeLeave = await prisma.employee.update({
          where:{
            email:email
          },
          data:{
            totalLeaves:{increment:leave},
            casualLeaves:{increment:leave}
          }
        });
        res.status(200).json(new ApiResponse(200 , updatedEmployeeLeave , "Successfully updated employee!"));
      }else if(leaveType === "Vacation"){
        const updatedEmployeeLeave = await prisma.employee.update({
          where:{
            email:email
          },
          data:{
            totalLeaves:{increment:leave},
            vacationLeaves:{increment:leave}
          }
        });
        res.status(200).json(new ApiResponse(200 , updatedEmployeeLeave , "Successfully updated employee!"));
      }
      else{
        const updatedEmployeeLeave = await prisma.employee.update({
          where:{
            email:email
          },
          data:{
            totalLeaves:{increment:leave},
            sickLeaves:{increment:leave}
          }
        });
        res.status(200).json(new ApiResponse(200 , updatedEmployeeLeave , "Successfully updated employee!"));
      }
    }else{
      res.status(422).json(new ApiError(422, "Please provide valid details!"));
    }
  }catch(error){
    res.status(500).json(new ApiError(500,error.message));
  }
}

export const getEmployeeRequestInfo = async (req:Request , res:Response) =>{
    const {email} = req.body;
    if(email){
      const employeeRequests = await prisma.employee.findUnique({
        where:{
          email
        },
        include:{
          requests:{
            orderBy:{
              createdAt: 'desc'
            }
          }
        }
      });
      res.status(200).json(new ApiResponse(200 , employeeRequests , "Successfully fetched employee requests!"));
    }else{
      res.status(422).json(new ApiError(422 , "Please provide valid fields!"));
    }
}

export const createAdminNotification = async (req:Request , res:Response) => {
    const {title , message , type} = req.body;
    if(title && message && type){
      const admin = await prisma.user.findFirst({
        where:{
          role:"admin"
        }
      });
      try {
        const notification = await prisma.notification.create({
          data:{
            userId: admin.id,
            title,
            message,
            type,
            isRead:false
          }
        })
        res.status(200).json(new ApiResponse(200 , notification, "Successfully fetch all admins !"))
      } catch (error) {
        res.status(500).json(new ApiError(500 , "Internal server error!"));
      }
    }else{
      res.status(422).json(new ApiError(422 , "Please provide all valid fields!"));
    }
}

export const updateAdminNotification = async (req:Request , res:Response) => {
   const {notificationId} = req.body;
   if(notificationId){
     try {
      const updatedNotificatiion = await prisma.notification.update({
       where:{
         id:notificationId
       },
       data:{
         isRead:true
       }
      });
      res.status(200).json(new ApiResponse(200 , updatedNotificatiion , "Successfully updated notification!"));
     } catch (error) {
      res.status(500).json(new ApiError(500 , "Internal Server Error!"))
     }
     
   }else{
     res.status(422).json(new ApiError(422 , "Please provide all valid fields!"));
   }
}

export const getAllAdminNotifications = async (req:Request , res:Response) => {
  try{
    const admin = await prisma.user.findFirst({
      where:{
        role:"admin"
      }
    });
    const allNotifications = await prisma.notification.findMany({
      where:{
        userId:admin.id
      }
    });
    res.status(200).json(new ApiResponse(200 , allNotifications , "Successfully fetched all notifications!"));
  }catch(error){
    res.status(500).json(new ApiError(500 , "Internal server error!"));
  }
}


export const createEmployeeNotification = async (req:Request , res:Response) => {
  const {title , message , type,email} = req.body;
  if(title && message && type && email){
    const user = await prisma.user.findUnique({
     where: {
      email
     }
    })
    try {
      const notification = await prisma.notification.create({
        data:{
          userId: user.id,
          title,
          message,
          type,
          isRead:false
        }
      })
      res.status(200).json(new ApiResponse(200 , notification, "Successfully fetch all admins !"))
    } catch (error) {
      res.status(500).json(new ApiError(500 , "Internal server error!"));
    }
  }else{
    res.status(422).json(new ApiError(422 , "Please provide all valid fields!"));
  }
}

export const updateEmployeeNotification = async (req:Request , res:Response) => {
  const {notificationId} = req.body;
  if(notificationId){
    try {
     const updatedNotificatiion = await prisma.notification.update({
      where:{
        id:notificationId
      },
      data:{
        isRead:true
      }
     });
     res.status(200).json(new ApiResponse(200 , updatedNotificatiion , "Successfully updated notification!"));
    } catch (error) {
     res.status(500).json(new ApiError(500 , "Internal Server Error!"))
    }
    
  }else{
    res.status(422).json(new ApiError(422 , "Please provide all valid fields!"));
  }
}

export const getAllEmployeeNotifications = async (req:Request , res:Response) => {
  const emailQuery = req.query.email;
  const email = typeof emailQuery === "string" ? emailQuery : undefined;
  console.log(email);
  if(email){
    try{
      const user = await prisma.user.findUnique({
        where:{
          email:email
        }
      });
      console.log(user,"My User")
      const allNotifications = await prisma.notification.findMany({
        where:{
          userId:user.id
        }
      });
      res.status(200).json(new ApiResponse(200 , allNotifications , "Successfully fetched all notifications!"));
    }catch(error){
      console.log(error);
      res.status(500).json(new ApiError(500 , "Internal server error!"));
    }
  }else{
    res.status(422).json(new ApiResponse(422 , "All fields are required!"));
  }
}