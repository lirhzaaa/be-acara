import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import { sendEmail, renderMailHTML } from "../utils/mail/mail";
import { ROLES } from "../utils/constant";
import * as Yup from "yup";

const validatePassword = Yup.string()
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
  });

const validateConfirmPassword = Yup.string()
  .required()
  .oneOf([Yup.ref("password"), ""], "Password not matched");

export const USER_MODEL_NAME = "User";

export const userLoginDTO = Yup.object({
  identifier: Yup.string().required(),
  password: validatePassword,
});

export const userUpdatePasswordDTO = Yup.object({
  oldPassword: validatePassword,
  password: validatePassword,
  confirmPassword: validateConfirmPassword,
});

export const userDTO = Yup.object({
  fullname: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().required(),
  password: validatePassword,
  confirmPassword: validateConfirmPassword,
});

export type TypeUser = Yup.InferType<typeof userDTO>

export interface User extends Omit<TypeUser, "confirmPassword"> {
  isActive: boolean;
  activationCode: string;
  createdAt?: string;
  role: string;
  profilePicture: string;
}

const Schema = mongoose.Schema;

const UsersSchema = new Schema<User>(
  {
    fullname: {
      type: Schema.Types.String,
      required: true,
    },
    username: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    role: {
      type: Schema.Types.String,
      enum: [ROLES.ADMIN, ROLES.MEMBER],
      default: ROLES.MEMBER,
    },
    profilePicture: {
      type: Schema.Types.String,
      default: "user.jpg",
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: false,
    },
    activationCode: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: true,
  }
);

UsersSchema.pre("save", async function () {
  const user = this
  user.password = encrypt(user.password);
  user.activationCode = encrypt(user.id);
});

UsersSchema.post("save", async function (doc, next) {
  try {
    const user = doc;
    const contentMail = await renderMailHTML("register-success.ejs", {
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      createdAt: user.createdAt,
      activationLink: `${process.env.PRODUCTION_HOST}/auth/activation?code=${user.activationCode}`,
    });

    await sendEmail({
      from: process.env.EMAIL_SMTP_USER as string,
      to: user.email,
      subject: "Activation your account",
      content: contentMail,
    });
  } catch (error) {
  } finally {
    next();
  }
});

UsersSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model(USER_MODEL_NAME, UsersSchema);

export default UserModel;
