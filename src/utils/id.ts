import { customAlphabet } from "nanoid/non-secure";

export const getId = (): string => {
  const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 5);
  return nanoid();
};