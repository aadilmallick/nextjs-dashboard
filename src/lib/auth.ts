import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  email?: string;
  password?: string;
  firstName?: string | null;
  lastName?: string | null;
  [key: string]: any;
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePasswords = (
  plainTextPassword: string,
  hashedPassword: string
) => bcrypt.compare(plainTextPassword, hashedPassword);

export function generateToken(user: IUser) {
  return jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
}

export function decodeToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as string);
}
