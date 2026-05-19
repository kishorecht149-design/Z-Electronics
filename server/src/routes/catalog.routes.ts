import { Router } from "express";

import { listPublicBrands, listPublicCategories } from "../controllers/catalog.controller";

export const catalogRouter = Router();

catalogRouter.get("/categories", listPublicCategories);
catalogRouter.get("/brands", listPublicBrands);
