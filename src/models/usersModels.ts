import mongoose, { mongo } from "mongoose";
import { encrypt } from "../utils/encryption";
import { sendEmail, renderMailHTML } from "../utils/mail/mail";

export interface Users {
  fullname: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  activationCode: string;
  createdAt?: string;
}

const Schema = mongoose.Schema;

const UsersSchema = new Schema<Users>(
  {
    fullname: {
      type: Schema.Types.String,
      required: true,
    },
    username: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    role: {
      type: Schema.Types.String,
      enum: ["admin", "users"],
      default: "users",
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
  this.password = encrypt(this.password);
});

UsersSchema.post("save", async function (doc, next) {
  try {
    const user = doc;
    console.log("Send Email To: ", user);
    const contentMail = await renderMailHTML("register-success.ejs", {
      username: user.username,
      fullName: user.fullname,
      email: user.email,
      createdAt: user.createdAt,
      activationLink: `${process.env.CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
    });

    await sendEmail({
      from: process.env.EMAIL_SMTP_USER as string,
      to: user.email,
      subject: "Activation your account",
      content: contentMail,
    });
  } catch (error) {
    console.log("error: ", error);
  } finally {
    next();
  }
});

UsersSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model("Users", UsersSchema);

export default UserModel;
