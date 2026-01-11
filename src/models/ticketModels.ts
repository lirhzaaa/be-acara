import mongoose, { Schema } from "mongoose";
import * as Yup from "yup";
import { EVENT_NAME_MODELS } from "./eventModels";

export const TICKET_MODEL_NAME = "Ticket";

export const ticketDTO = Yup.object({
  price: Yup.number().required(),
  name: Yup.string().required(),
  events: Yup.string().required(),
  description: Yup.string().required(),
  quantity: Yup.number().required(),
});

export type ITicket = Yup.InferType<typeof ticketDTO>;

export interface Ticket extends Omit<ITicket, "events"> {
  events: Schema.Types.ObjectId;
}

const TicketSchema = new Schema<Ticket>(
  {
    price: {
      type: Schema.Types.Number,
      required: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    events: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: EVENT_NAME_MODELS,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    quantity: {
      type: Schema.Types.Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
).index({ name: "text" });

const TicketModel = mongoose.model(TICKET_MODEL_NAME, TicketSchema);
export default TicketModel;
