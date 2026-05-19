import { type NextFunction, type Request, type Response } from "express";

export interface ParsedQueryRequest extends Request {
  parsedQuery?: {
    filter: Record<string, any>;
    sort: Record<string, 1 | -1>;
    skip: number;
    limit: number;
    page: number;
  };
}

export function parseQuery(req: ParsedQueryRequest, res: Response, next: NextFunction) {
  const { page = "1", limit = "10", sort = "-createdAt", ...filters } = req.query;

  // Pagination logic
  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
  const skip = (pageNum - 1) * limitNum;

  // Sorting logic (e.g. sort=-price,createdAt -> { price: -1, createdAt: 1 })
  const sortObj: Record<string, 1 | -1> = {};
  if (typeof sort === "string") {
    sort.split(",").forEach((field) => {
      if (field.startsWith("-")) {
        sortObj[field.substring(1)] = -1;
      } else {
        sortObj[field] = 1;
      }
    });
  } else {
    sortObj["createdAt"] = -1;
  }

  // Filtering logic
  const filterObj: Record<string, any> = {};
  
  // Handle basic exact matches and simple gt/lt queries if needed
  // For production we might use a dedicated library like 'query-to-mongo'
  // But for now, we'll map existing filters
  for (const [key, value] of Object.entries(filters)) {
    if (typeof value === "string") {
      // Basic support for boolean
      if (value === "true") filterObj[key] = true;
      else if (value === "false") filterObj[key] = false;
      // Basic support for in queries (comma separated)
      else if (value.includes(",")) filterObj[key] = { $in: value.split(",") };
      else filterObj[key] = value;
    }
  }

  req.parsedQuery = {
    filter: filterObj,
    sort: sortObj,
    skip,
    limit: limitNum,
    page: pageNum
  };

  next();
}
