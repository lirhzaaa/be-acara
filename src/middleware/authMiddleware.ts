import { Request, Response, NextFunction } from "express";
import { getUserData } from "../jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";

export default (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers?.authorization;

  if (!authorization) {
    return response.unauthorized(res);
  }

  const [prefix, accessToken] = authorization.split(" ");

  if (!(prefix === "Bearer" && accessToken)) {
    return response.unauthorized(res);
  }

  const user = getUserData(accessToken);

  if (!user) {
    return response.unauthorized(res);
  }

  (req as IReqUser).user = user;

  next();
};
