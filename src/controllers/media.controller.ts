import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import upload from "../utils/upload";

export default {
  async single(req: IReqUser, res: Response) {
    if (!req.file) {
      return res.status(400).json({
        message: "file is not exist",
        data: null,
      });
    }

    try {
      const result = await upload.uploadSingle(req.file as Express.Multer.File);
      res.status(200).json({
        message: "Success upload file",
        data: result
      });
    } catch {
      res.status(500).json({
        message: "Failed upload a file",
      });
    }
  },

  async multiple(req: IReqUser, res: Response) {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "files are not exist",
        data: null,
      });
    }

    try {
      const result = await upload.uploadMultiple(
        req.files as Express.Multer.File[]
      );
      res.status(200).json({
        message: "Success upload files",
        data: result
      });
    } catch {
      res.status(500).json({
        message: "Failed upload files",
      });
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { fileUrl } = req.body as { fileUrl: string };
      const result = await upload.remove(fileUrl);
      res.status(200).json({
        message: "Success remove file",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed remove file",
        data: null,
      });
    }
  },
};
