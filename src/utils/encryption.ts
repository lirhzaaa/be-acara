import crypto from "crypto";

export const encrypt = (password: string): string => {
  const secret = process.env.SECRET as string;
  const encrypted = crypto
    .pbkdf2Sync(password, secret, 1000, 64, "sha512")
    .toString("hex");

  return encrypted;
};
