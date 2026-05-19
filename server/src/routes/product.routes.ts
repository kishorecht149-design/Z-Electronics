import { Router } from "express";

import { getProductBySlug, listProducts } from "../controllers/product.controller";
import { parseQuery } from "../middlewares/query-parser";

export const productRouter = Router();

productRouter.get("/", parseQuery, listProducts);
productRouter.get("/:slug", getProductBySlug);
