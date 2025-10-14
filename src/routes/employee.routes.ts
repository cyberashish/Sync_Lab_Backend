import express from "express";
import { addEmployee, addEmployeesRequest, createAdminNotification, createEmployeeNotification, deleteEmployee, editEmployee, employeeProfile, getAllAdminNotifications, getAllEmployeeNotifications, getAllEmployees, getAllEmployeesRequest, getEmployeeByEmail, getEmployeeRequestInfo, updateAdminNotification, updateEmployeeLeave, updateEmployeeNotification, updateEmployeeRequest } from "../../controllers/employee.controller.ts";

const employeeRouter = express.Router();

employeeRouter
.post("/add-employee" , addEmployee)
.put("/edit-employee" , editEmployee)
.get("/profile/:id" , employeeProfile)
.get("/all", getAllEmployees)
.post("/get-employee", getEmployeeByEmail)
.delete("/delete-employee/:id" , deleteEmployee)
.post("/add-request" , addEmployeesRequest)
.post("/get-employee/requests" , getEmployeeRequestInfo)
.get("/all-requests" , getAllEmployeesRequest)
.put("/update-request" , updateEmployeeRequest)
.put("/update-employee-leave" , updateEmployeeLeave)
.post("/add-notification/admin" , createAdminNotification)
.put("/update-notification/admin" , updateAdminNotification)
.get("/all-notifications/admin" , getAllAdminNotifications)
.post("/add-notification" , createEmployeeNotification)
.put("/update-notification" , updateEmployeeNotification)
.get("/all-notifications" , getAllEmployeeNotifications)

export {employeeRouter}