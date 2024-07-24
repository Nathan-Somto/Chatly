import { NextFunction, Request, Response } from "express";
import { uploadFile } from "../utils/uploadFile";
import fileUpload from "express-fileupload";

export const upload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }
    const file = req.files.file as fileUpload.UploadedFile;
    console.log("[file]: ", file);
    const fileBase64 = Buffer.from(file.data).toString("base64");
    const fileDataURI = `data:${file.mimetype};base64,${fileBase64}`;
    const url = await uploadFile(fileDataURI);
    console.log("[url]", url);
    res.status(200).json({
      success: true,
      message: "successfully uploaded file",
      url,
    });
  } catch (err) {
    next(err);
  }
};
