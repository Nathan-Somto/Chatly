import { NextFunction, Request,Response } from "express";

export default function fileUpload(req:Request, res:Response, next:NextFunction){
    next();
}