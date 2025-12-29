import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import CategoryModel, { categoryDAO } from "../models/categoryModels";
import response from "../utils/response";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      await categoryDAO.validate(req.body);
      const result = await CategoryModel.create(req.body);
      response.success(res, result, "Success create category");
    } catch (error) {
      response.error(res, error, "Failed create category");
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      await categoryDAO.validate(req.body);
      const result = await CategoryModel.find(req.body);
      response.success(res, result, "Success find all category");
    } catch (error) {
      response.error(res, error, "Failed find all category");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      await categoryDAO.validate(req.body);
      const result = await CategoryModel.findOne(req.body);
      response.success(res, result, "Success find one category");
    } catch (error) {
      response.error(res, error, "Failed find one category");
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
    } catch (error) {}
  },
  async delete(req: IReqUser, res: Response) {
    try {
    } catch (error) {}
  },
};
