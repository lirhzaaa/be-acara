import jwt from "jsonwebtoken";
import { IUserToken } from "./utils/interfaces";

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
