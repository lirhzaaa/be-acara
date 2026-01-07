import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import OrderModel, { orderDAO, TypeOrder } from "../models/orderModels";
import TicketModel from "../models/ticketModels";

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
  async findAll(req: IReqUser, res: Response) {},
  async findOne(req: IReqUser, res: Response) {},
  async findAllMember(req: IReqUser, res: Response) {},

  async completed(req: IReqUser, res: Response) {},
  async pending(req: IReqUser, res: Response) {},
  async calcelled(req: IReqUser, res: Response) {},
};
