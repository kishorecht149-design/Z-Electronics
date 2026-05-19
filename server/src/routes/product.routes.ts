import { Router } from "express";

import { getProductById, getProductBySlug, listProducts } from "../controllers/product.controller";
import { parseQuery } from "../middlewares/query-parser";

export const productRouter = Router();

productRouter.get("/", parseQuery, listProducts);
productRouter.get("/id/:id", getProductById);
productRouter.get("/:slug", getProductBySlug);
