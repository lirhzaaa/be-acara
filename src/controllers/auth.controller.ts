import { Request, Response } from "express";
import UserModel, {
  userDTO,
  userLoginDTO,
  userUpdatePasswordDTO,
} from "../models/usersModels";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";

export default {
  async updateProfile(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const { fullname, profilePicture } = req.body;

      const result = await UserModel.findByIdAndUpdate(
        userId,
        {
          fullname,
          profilePicture,
        },
        {
          new: true,
        }
      );

      if (!result) return response.notFound(res, "user not found");
      response.success(res, result, "Success to update profile");
    } catch (error) {
      response.error(res, error, "Failed to update profile");
    }
  },

  async updatePassword(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const { oldPassword, password, confirmPassword } = req.body;

      await userUpdatePasswordDTO.validate({
        oldPassword,
        password,
        confirmPassword,
      });

      const user = await UserModel.findById(userId);

      if (!user || user.password !== encrypt(oldPassword))
        return response.notFound(res, "user not found");

      const result = await UserModel.findByIdAndUpdate(
        userId,
        {
          password: encrypt(password),
        },
        {
          new: true,
        }
      );
      response.success(res, result, "Success to update password");
    } catch (error) {
      response.error(res, error, "Failed to update password");
    }
  },

  async register(req: Request, res: Response) {
    const { fullname, username, email, password, confirmPassword } = req.body;
    try {
      await userDTO.validate({
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
    const { identifier, password } = req.body;
    try {
      await userLoginDTO.validate({
        identifier,
        password,
      });

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
      response.error(res, error, "Login Failed");
    }
  },

  async me(req: IReqUser, res: Response) {
    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);

      response.success(res, result, "Success get user profile");
    } catch (error) {
      response.error(res, error, "Failed get user profile");
    }
  },

  async activationCode(req: Request, res: Response) {
    try {
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
      response.success(res, user, "Success users activated");
    } catch (error) {
      response.error(res, error, "Failed users acvivated");
    }
  },
};
