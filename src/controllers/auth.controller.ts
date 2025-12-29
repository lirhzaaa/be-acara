import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/usersModels";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";

type TRegister = {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

const registerValidateSchema = Yup.object({
  fullname: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string()
    .required()
    .min(6, "Password must be at least 6 characters")
    .test(
      'at-least-one-uppercase-letter, "Contains at least one uppercase letter',
      (value) => {
        if (!value) return false;
        const regex = /^(?=.*[A-Z])/;
        return regex.test(value);
      }
    )
    .test('at-least-one-number, "Contains at least one Number', (value) => {
      if (!value) return false;
      const regex = /^(?=.*\d)/;
      return regex.test(value);
    }),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), ""], "Password not matched"),
});

export default {
  async register(req: Request, res: Response) {
    /**
     #swagger.tags = ['Auth']
     */
    const { fullname, username, email, password, confirmPassword } =
      req.body as TRegister;

    try {
      await registerValidateSchema.validate({
        fullname,
        username,
        email,
        password,
        confirmPassword,
      });

      const result = await UserModel.create({
        fullname,
        username,
        email,
        password,
      });

      response.success(res, result, "Success Registration!");
    } catch (error) {
      response.error(res, error, "Failed Registration!");
    }
  },

  async login(req: Request, res: Response) {
    /**
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
     required: true,
     schema: {$ref: "#/components/schemas/LoginRequest"}
     }
     */

    try {
      const { identifier, password } = req.body as unknown as TLogin;

      const userByIdentifier = await UserModel.findOne({
        $or: [
          {
            email: identifier,
          },
          {
            username: identifier,
          },
        ],
        isActive: true,
      });

      if (!userByIdentifier) {
        return response.unauthorized(res, "User Not Found");
      }

      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
        return response.unauthorized(res, "Password Not Found");
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      response.success(res, token, "Login Success");
    } catch (error) {
      response.error(res, error, "Login Failed")
    }
  },

  async me(req: IReqUser, res: Response) {
    /**
     #swagger.tags = ['Auth']
     #swagger.security = [{
     "bearerAuth": []
     }]
     */
    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);

      response.success(res, result, "Success get user profile")
    } catch (error) {
      response.error(res, error, "Failed get user profile")
    }
  },

  async activationCode(req: Request, res: Response) {
    try {
      /**
        #swagger.tags = ['Auth']
        #swagger.requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: '#/components/schemas/ActivationRequest' }
            }
          }
        }
      */

      const { code } = req.body as { code: string };
      const user = await UserModel.findOneAndUpdate(
        {
          activationCode: code,
        },
        {
          isActive: true,
        },
        {
          new: true,
        }
      );
      response.success(res, user, "Success users activated")
    } catch (error) {
      response.error(res, error, "Failed users acvivated")
    }
  },
};