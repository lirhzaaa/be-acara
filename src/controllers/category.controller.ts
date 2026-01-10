import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import CategoryModel, { categoryDAO } from "../models/categoryModels";
import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import OrderModel, { orderDAO } from "../models/orderModels";
import TicketModel from "../models/ticketModels";
import { getId } from "../utils/id";

export default {
async create(req: IReqUser, res: Response) {
  try {
    const userId = req.user?.id;
    
    await orderDAO.validate(req.body);

    const ticket = await TicketModel.findById(req.body.ticket);

    if (!ticket) return response.notFound(res, "Ticket Not Found");
    if (ticket.quantity < req.body.quantity) {
      return response.error(res, null, "Ticket quantity is not enough");
    }
    
    const total: number = +ticket?.price * +req.body.quantity;

    const payload = {
      events: req.body.events,
      ticket: req.body.ticket,
      quantity: req.body.quantity,
      total,
      createdBy: userId,
      orderId: getId(),
    };

    const result = await OrderModel.create(payload as any);
    response.success(res, result, "Success to create an order");
  } catch (error) {
    response.error(res, error, "Failed to create an order");
  }
},
  async findAll(req: IReqUser, res: Response) {
    const {
      page = 1,
      limit = 10,
      search,
    } = req.query as unknown as IPaginationQuery;
    try {
      const query = {};
      if (search) {
        Object.assign(query, {
          $or: [
            {
              name: { $regex: search, $options: "i" },
            },
            {
              description: { $regex: search, $options: "i" },
            },
          ],
        });
      }
      const result = await CategoryModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await CategoryModel.countDocuments(query);
      response.pagination(
        res,
        result,
        {
          total: count,
          totalPages: Math.ceil(count / limit),
          current: page,
        },
        "Success find all category"
      );
    } catch (error) {
      response.error(res, error, "Failed find all category");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, "Failed find one category");
      }

      const result = await CategoryModel.findById(id);

      if (!result) {
        return response.notFound(res, "Failed find one category");
      }

      response.success(res, result, "Success find one category");
    } catch (error) {
      response.error(res, error, "Failed find one category");
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, "Failed update category");
      }

      const result = await CategoryModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, "Success update category");
    } catch (error) {
      response.error(res, error, "Failed find one category");
    }
  },
  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, "Failed delete category");
      }

      const result = await CategoryModel.findByIdAndDelete(id, {
        new: true,
      });
      response.success(res, result, "Success delete category");
    } catch (error) {
      response.error(res, error, "Failed delete category");
    }
  },
};
