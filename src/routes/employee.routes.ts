import express from "express";
import { addEmployee, addEmployeesRequest, deleteEmployee, editEmployee, employeeProfile, getAllEmployees, getAllEmployeesRequest, updateEmployeeRequest } from "../../controllers/employee.controller.ts";

const employeeRouter = express.Router();

employeeRouter
.post("/add-employee" , addEmployee)
.put("/edit-employee" , editEmployee)
.get("/profile/:id" , employeeProfile)
.get("/all", getAllEmployees)
.delete("/delete-employee/:id" , deleteEmployee)
.post("/add-request" , addEmployeesRequest)
.get("/all-requests" , getAllEmployeesRequest)
.put("/update-request" , updateEmployeeRequest)

export {employeeRouter}