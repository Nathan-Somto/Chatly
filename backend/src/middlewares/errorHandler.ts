import { PrismaClientInitializationError, PrismaClientValidationError } from "@prisma/client/runtime/library.js";
import { NextFunction, Request, Response } from "express";
const errorHandler = (err: Error,_req:Request, res: Response, _next: NextFunction) => {
    let message = "something went wrong";
    console.error('[Error]: ',err.message);
    let statusCode = err.message === 'Unauthenticated'? 400 : 500;
   if(err instanceof PrismaClientInitializationError){
    message = "could not connect to db"
   }
   if (err instanceof PrismaClientValidationError){
    message = "could not store data in db!"
   }
   res.status(statusCode).json({
    message,
    success:false,
    unauthenticated: err.message === 'Unauthenticated' ? true : false
   })
}
export {
    errorHandler
}