import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import upload from "../utils/upload";
import response from "../utils/response";

export default {
  async single(req: IReqUser, res: Response) {
    if (!req.file) {
      return response.error(res, null, "file is not exist")
    }

    try {
      const result = await upload.uploadSingle(req.file as Express.Multer.File);
      response.success(res, result, "Success upload file")
    } catch {
      response.error(res, null, "Failed upload a file")
    }
  },

  async multiple(req: IReqUser, res: Response) {
    if (!req.files || req.files.length === 0) {
      return response.error(res, null, "Files are not exist")
    }

    try {
      const result = await upload.uploadMultiple(
        req.files as Express.Multer.File[]
      );
      response.success(res, result, "Success upload files")
    } catch {
      response.error(res, null, "Failed upload files")
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { fileUrl } = req.body as { fileUrl: string };
      const result = await upload.remove(fileUrl);
      response.success(res, result, "Success remove file")
    } catch {
      response.error(res, null, "Failed remove file")
    }
  },
};
