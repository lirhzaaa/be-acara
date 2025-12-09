import { Request, Response } from "express";

type TRegister = {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default {
  register(req: Request, res: Response) {
    const { fullname, username, email, password, confirmPassword } =
      req.body as TRegister;
  },
};
