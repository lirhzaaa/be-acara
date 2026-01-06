import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import TicketModel, { ticketDAO } from "../models/ticketModels";
import { isValidObjectId } from "mongoose";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      await ticketDAO.validate(req.body);
      const result = await TicketModel.create(req.body);
      response.success(res, result, "Success to create ticket");
    } catch (error) {
      response.error(res, error, "Failed to create ticket");
    }
  },

  async get(req: IReqUser, res: Response) {
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

      const result = await TicketModel.find(query)
        .populate("events")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();
      const count = await TicketModel.countDocuments(query);
      response.pagination(
        res,
        result,
        {
          total: count,
          current: page,
          totalPages: Math.ceil(count / limit),
        },
        "Success to get all ticket"
      );
    } catch (error) {
      response.error(res, error, "Failed to get all ticket");
    }
  },

  async getOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await TicketModel.findById(id);
      response.success(res, result, "Success to get one ticket");
    } catch (error) {
      response.error(res, error, "Failed to get one ticket");
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await TicketModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, "Success to update ticket");
    } catch (error) {
      response.error(res, error, "Failed to update ticket");
    }
  },

  async getOneByEvent(req: IReqUser, res: Response) {
    try {
      const { eventId } = req.params;

      if (!isValidObjectId(eventId)) {
        return response.error(res, null, "ticket not found");
      }

      const result = await TicketModel.find({ events: eventId } as any).exec();
      response.success(res, result, "success to get ticket by event");
    } catch (error) {
      response.error(res, error, "Failed to get ticket by event");
    }
  },

  async delete(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await TicketModel.findByIdAndDelete(id, { new: true });
      response.success(res, result, "Success to delete ticket");
    } catch (error) {
      response.error(res, error, "Failed to delete ticket");
    }
  },
};
