import { Types } from "mongoose";
import { Users } from "./models/usersModels";
import jwt from "jsonwebtoken";

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

export const generateToken = (user: IUserToken): string => {
  const token = jwt.sign(user, process.env.SECRET as string, {
    expiresIn: "1h",
  });

  return token;
};

export const getUserData = (token: string) => {
  const user = jwt.verify(token, process.env.SECRET as string) as IUserToken;
  return user;
};
