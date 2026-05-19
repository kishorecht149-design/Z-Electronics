import { type Request, type Response } from "express";
import { z } from "zod";

import { env } from "../config/env";
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
  let user = await UserModel.findOne({ email: input.email });
  
  // Dynamic administrative bootstrapping for unseeded environments
  if (!user && input.email === env.ADMIN_BOOTSTRAP_EMAIL) {
    user = await UserModel.create({
      name: "Z Admin",
      email: env.ADMIN_BOOTSTRAP_EMAIL,
      password: env.ADMIN_BOOTSTRAP_PASSWORD,
      role: "admin"
    });
  }

  if (!user) return res.status(404).json(failure("User not found"));
  if (!user.isActive) return res.status(403).json(failure("User account is inactive"));

  const isValid = await user.comparePassword(input.password);
  if (!isValid) return res.status(401).json(failure("Invalid credentials"));

  const token = signToken({ userId: user.id, role: user.role });
  
  // Update last login
  user.lastLogin = new Date();
  await user.save();

  return res.json(success({ token, user }, "Signed in"));
}

export async function getMe(req: Request, res: Response) {
  // @ts-ignore - Assuming auth middleware attaches user to req
  const user = req.user;
  if (!user) return res.status(401).json(failure("Not authenticated"));
  
  const fullUser = await UserModel.findById(user.userId || user._id).select("-password");
  if (!fullUser) return res.status(404).json(failure("User not found"));
  
  return res.json(success(fullUser));
}
