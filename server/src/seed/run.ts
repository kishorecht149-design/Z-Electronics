import { brands, categories, coupons, orders, products } from "@/lib/mock-data";

import { connectDatabase } from "../config/db";
import { BrandModel } from "../models/Brand";
import { CategoryModel } from "../models/Category";
import { CouponModel } from "../models/Coupon";
import { OrderModel } from "../models/Order";
import { ProductModel } from "../models/Product";
import { UserModel } from "../models/User";

async function seed() {
  await connectDatabase();

  await Promise.all([
    BrandModel.deleteMany({}),
    CategoryModel.deleteMany({}),
    CouponModel.deleteMany({}),
    ProductModel.deleteMany({}),
    OrderModel.deleteMany({}),
    UserModel.deleteMany({})
  ]);

  const seededCategories = await CategoryModel.insertMany(categories);
  const seededBrands = await BrandModel.insertMany(brands);

  const categoryMap = new Map(seededCategories.map((item) => [item.name, item._id]));
  const brandMap = new Map(seededBrands.map((item) => [item.name, item._id]));

  const admin = await UserModel.create({
    name: "Z Admin",
    email: process.env.ADMIN_BOOTSTRAP_EMAIL ?? "admin@zelectronics.dev",
    password: process.env.ADMIN_BOOTSTRAP_PASSWORD ?? "SecurePassword123!",
    role: "admin"
  });

  const customer = await UserModel.create({
    name: "Aarav Iyer",
    email: "aarav@example.com",
    password: "CustomerPass123!",
    role: "user"
  });

  const seededProducts = await ProductModel.insertMany(
    products.map((product) => ({
      ...product,
      category: categoryMap.get(product.category),
      brand: brandMap.get(product.brand)
    }))
  );

  const productMap = new Map(seededProducts.map((item) => [item.name, item._id]));

  await CouponModel.insertMany(coupons);

  await OrderModel.insertMany(
    orders.map((order) => ({
      ...order,
      user: customer._id,
      items: order.items.map((item) => ({
        ...item,
        product: productMap.get(item.name)
      }))
    }))
  );

  console.log(`Seeded admin ${admin.email} and customer ${customer.email}`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
