import { NextFunction, Request,Response } from "express";

export default function fileUpload(_req:Request, _res:Response, next:NextFunction){
    next();
}