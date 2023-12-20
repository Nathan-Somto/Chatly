import { PrismaClientInitializationError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";

const errorHandler = (err: Error,req:Request, res: Response, next: NextFunction) => {
    let message = "something went wrong";
    console.error(err.message);
   if(err instanceof PrismaClientInitializationError){
    message = "could not connect to db"
   }
   if (err instanceof PrismaClientValidationError){
    message = "could not store data in db!"
   }
   res.status(500).json({
    message,
    success:false
   })
}
export {
    errorHandler
}