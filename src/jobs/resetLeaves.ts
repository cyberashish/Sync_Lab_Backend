import cron from "node-cron";
import { prisma } from "../utils/client.ts";

cron.schedule("0 0 1 1 *" , async () => {
    console.log("Running Yearly rest leaves");

    try{
     const result =  await prisma.employee.updateMany({
        data:{
            totalLeaves:0,
            casualLeaves:0,
            sickLeaves:0,
            overtimeDays:0,
            allottedLeaves:18
        }
       });

       console.log(`Leave balances reset for ${result.count} employees.`)
    }catch(error){
        console.log("Failed to resest Leaves" , error);
    }
})
