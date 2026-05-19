import { type Request, type Response } from "express";
import { z } from "zod";

import { UserModel } from "../models/User";
import { success, failure } from "../utils/api-response";
import { signToken } from "../utils/jwt";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

const loginSchema = registerSchema.omit({ name: true });

export async function register(req: Request, res: Response) {
  const input = registerSchema.parse(req.body);
  const existing = await UserModel.findOne({ email: input.email });
  if (existing) return res.status(409).json(failure("User already exists"));

  const user = await UserModel.create(input);
  const token = signToken({ userId: user.id, role: user.role });

  return res.status(201).json(success({ token, user }, "Account created"));
}

export async function login(req: Request, res: Response) {
  const input = loginSchema.parse(req.body);
  const user = await UserModel.findOne({ email: input.email });
  if (!user) return res.status(404).json(failure("User not found"));

  const isValid = await user.comparePassword(input.password);
  if (!isValid) return res.status(401).json(failure("Invalid credentials"));

  const token = signToken({ userId: user.id, role: user.role });
  return res.json(success({ token, user }, "Signed in"));
}
