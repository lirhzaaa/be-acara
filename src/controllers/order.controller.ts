import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import OrderModel, {
  orderDAO,
  OrderStatus,
  TypeOrder,
  TypeVoucher,
} from "../models/orderModels";
import TicketModel from "../models/ticketModels";
import { getId } from "../utils/id";

export default {
async create(req: IReqUser, res: Response) {
  try {
    const userId = req.user?.id;
    
    const payload = {
      ...req.body,
      createdBy: userId,
    };

    await orderDAO.validate(payload);

    const ticket = await TicketModel.findById(payload.ticket);

    if (!ticket) return response.notFound(res, "Ticket Not Found");
    if (ticket.quantity < payload.quantity) {
      return response.error(res, null, "Ticket quantity is not enough");
    }
    
    const total: number = +ticket?.price * +payload.quantity;

    const finalPayload = {
      ...payload,
      total,
      orderId: getId(),
    };

    console.log("payload:", finalPayload);

    const result = await OrderModel.create(finalPayload as any);
    
    console.log("success", result);
    
    response.success(res, result, "Success to create an order");
  } catch (error) {
    console.error("error", error);
    response.error(res, error, "Failed to create an order");
  }
},  

  // async findAll(req: IReqUser, res: Response) {
  //   try {
  //     const buildQuery = (filter: any) => {
  //       let query: Record<string, any> = {};

  //       if (filter.search) query.$text = { $search: filter.search };

  //       return query;
  //     };

  //     const { limit = 10, page = 1, search } = req.query;

  //     const query = buildQuery({
  //       search,
  //     });

  //     const result = await OrderModel.find(query)
  //       .limit(+limit)
  //       .skip((+page - 1) * +limit)
  //       .sort({ createdAt: -1 })
  //       .exec();

  //     const count = await OrderModel.countDocuments(query);
  //     response.pagination(
  //       res,
  //       result,
  //       {
  //         current: +page,
  //         total: count,
  //         totalPages: Math.ceil(count / +limit),
  //       },
  //       "Success to find all an order"
  //     );
  //   } catch (error) {
  //     response.error(res, error, "Failed to find all an order");
  //   }
  // },

  // async findOne(req: IReqUser, res: Response) {
  //   try {
  //     const { orderId } = req.params;
  //     const result = await OrderModel.findOne({
  //       orderId,
  //     });

  //     if (!result) return response.notFound(res, "Order Not Found");
  //     response.success(res, result, "Success to find one an order");
  //   } catch (error) {
  //     response.error(res, error, "Failed to find one an order");
  //   }
  // },

  // async findAllMember(req: IReqUser, res: Response) {},

  // async completed(req: IReqUser, res: Response) {
  //   try {
  //     const { orderId } = req.params;
  //     const userId = req.user?.id;

  //     const order = await OrderModel.findOne({
  //       orderId,
  //       createdBy: userId,
  //     });

  //     if (!order) return response.notFound(res, "Order Not Found");
  //     if (order.status === OrderStatus.COMPLETED)
  //       return response.error(res, null, "you have been completed this order");

  //     const vouchers: TypeVoucher[] = Array.from(
  //       { length: order.quantity },
  //       () => {
  //         return {
  //           isPrint: false,
  //           voucherId: getId(),
  //         } as TypeVoucher;
  //       }
  //     );

  //     const result = await OrderModel.findOneAndUpdate(
  //       {
  //         orderId,
  //         createdBy: userId,
  //       },
  //       {
  //         vouchers,
  //         status: OrderStatus.COMPLETED,
  //       },
  //       {
  //         new: true,
  //       }
  //     );

  //     const ticket = await TicketModel.findById(order.ticket)

  //     if (!ticket) return response.notFound(res, "Ticket and Order Not Found")
    
  //       await TicketModel.updateOne({
  //           _id: ticket._id
  //       }, {
  //           quantity: ticket.quantity - order.quantity
  //       })

  //     response.success(res, result, "Success to complete an order")
  //   } catch (error) {
  //     response.error(res, error, "Failed to completed an order");
  //   }
  // },

  // async pending(req: IReqUser, res: Response) {
  //   try {
  //   } catch (error) {
  //     response.error(res, error, "Failed to pending an order");
  //   }
  // },

  // async cancelled(req: IReqUser, res: Response) {
  //   try {
  //   } catch (error) {
  //     response.error(res, error, "Failed to cancelled an order");
  //   }
  // },
};
