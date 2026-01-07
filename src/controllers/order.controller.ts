import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import OrderModel, { orderDAO, TypeOrder } from "../models/orderModels";
import TicketModel from "../models/ticketModels";
import { QueryFilter } from "mongoose";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const payload = {
        ...req.body,
        createdBy: userId,
      } as TypeOrder;

      await orderDAO.validate(payload);
      const ticket = await TicketModel.findById(payload.ticket);
      if (!ticket) return response.notFound(res, "Ticket Not Found");
      if (ticket.quantity < payload.quantity) {
        return response.error(res, null, "Ticket quantity is not enough");
      }
      const total: number = +ticket?.price * +payload.quantity;

      Object.assign(payload, {
        ...payload,
        total,
      });

      const result = await OrderModel.create(payload);
      response.success(res, result, "Success to create an order");
    } catch (error) {
      response.error(res, error, "Failed to create an order");
    }
  },

  async findAll(req: IReqUser, res: Response) {
    try {
      const buildQuery = (filter: any) => {
        let query: Record<string, any> = {};

        if (filter.search) query.$text = { $search: filter.search };

        return query;
      };

      const { limit = 10, page = 1, search } = req.query;

      const query = buildQuery({
        search,
      });

      const result = await OrderModel.find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await OrderModel.countDocuments(query);
      response.pagination(
        res,
        result,
        {
          current: +page,
          total: count,
          totalPages: Math.ceil(count / +limit),
        },
        "Success to find all an order"
      );
    } catch (error) {
      response.error(res, error, "Failed to find all an order");
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;
      const result = await OrderModel.findOne({
        orderId,
      });

      if (!result) return response.notFound(res, "Order Not Found");
      response.success(res, result, "Success to find one an order");
    } catch (error) {
      response.error(res, error, "Failed to find one an order");
    }
  },

  async findAllMember(req: IReqUser, res: Response) {},

  async completed(req: IReqUser, res: Response) {},

  async pending(req: IReqUser, res: Response) {},

  async calcelled(req: IReqUser, res: Response) {},
};
