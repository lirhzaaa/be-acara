import { Request } from "express";
import { Types } from "mongoose";
import { Users } from "../models/usersModels";

export interface IUserToken
  extends Omit<
    Users,
    | "password"
    | "activationCode"
    | "isActive"
    | "email"
    | "fullname"
    | "profilePicture"
    | "username"
  > {
  id?: Types.ObjectId;
}

export interface IReqUser extends Request {
  user?: IUserToken;
}
