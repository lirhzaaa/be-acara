import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import BannerModel, { bannerDAO } from "../models/bannerModels";
import response from "../utils/response";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      await bannerDAO.validate(req.body);
      const result = await BannerModel.create(req.body);
      response.success(res, result, "Success to create banner");
    } catch (error) {
      response.error(res, error, "Failed to create banner");
    }
  },

  async find(req: IReqUser, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuery;

      const query = {};

      if (search) {
        Object.assign(query),
          {
            ...query,
            $text: {
              $search: search,
            },
          };
      }

      const result = await BannerModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .exec();
      const count = await BannerModel.countDocuments(query);
      response.pagination(
        res,
        result,
        {
          total: count,
          current: page,
          totalPages: Math.ceil(count / limit),
        },
        "Success to find all banner"
      );
    } catch (error) {
      response.error(res, error, "Failed to find all banner");
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await BannerModel.findById(id);
      response.success(res, result, "Success to find one banner");
    } catch (error) {
      response.error(res, error, "Failed to find one banner");
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await BannerModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, "Success to update banner");
    } catch (error) {
      response.error(res, error, "Failed to update banner");
    }
  },

  async delete(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await BannerModel.findByIdAndDelete(id);
      response.success(res, result, "Success to delete banner");
    } catch (error) {
      response.error(res, error, "Failed to delete banner");
    }
  },
};
