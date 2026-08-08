import { Request, Response } from 'express';
import prisma from '../config/prisma';
import asyncHandler from '../utils/asyncHandler';
import sendResponse from '../utils/sendResponse';

export const getDashboardKPIs = asyncHandler(async (_req: Request, res: Response) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // 1. Today's Sales Data (Total Revenue & Order Count)
  const todaySalesStats = await prisma.sale.aggregate({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      }
    },
    _sum: { total: true },
    _count: { id: true },
  });

  const todaySales = todaySalesStats._sum.total ? Number(todaySalesStats._sum.total) : 0;
  const todayOrders = todaySalesStats._count.id;

  // 2. Today's Profit Calculation
  // Profit = SUM(SaleItem.subtotal - (Product.purchasePrice * SaleItem.quantity))
  const todaySaleItems = await prisma.saleItem.findMany({
    where: {
      sale: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        }
      }
    },
    include: { product: true }
  });

  let todayProfit = 0;
  for (const item of todaySaleItems) {
    const cost = Number(item.product.purchasePrice) * item.quantity;
    const revenue = Number(item.subtotal);
    todayProfit += (revenue - cost);
  }

  // 3. Totals (Products & Customers)
  const [totalProducts, totalCustomers] = await Promise.all([
    prisma.product.count(),
    prisma.customer.count()
  ]);

  // 4. Low Stock Count
  // Workaround: We can't directly compare column to column in Prisma aggregate easily for count.
  // We'll fetch products where stock is low or write a raw query.
  // Actually, wait, `where: { stock: { lte: { ... } } }` doesn't work if it's dynamic to another column in Prisma directly without preview features, 
  // wait, we can just fetch all products and filter, or since we need it fast, fetch them:
  const products = await prisma.product.findMany({ select: { stock: true, minimumStock: true } });
  const lowStockCount = products.filter(p => p.stock <= p.minimumStock).length;

  // 5. Recent Sales (Last 5)
  const recentSales = await prisma.sale.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      customer: true,
      items: true
    }
  });

  sendResponse(res, 200, true, 'Dashboard KPIs fetched', {
    todaySales,
    todayProfit,
    todayOrders,
    totalProducts,
    totalCustomers,
    lowStockCount,
    recentSales,
  });
});

export const getDailySales = asyncHandler(async (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string) || 30;
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  // Group by day. Prisma doesn't natively group by date functions easily across all DBs, 
  // so we fetch the raw records within the date range and aggregate in Node.js.
  const sales = await prisma.sale.findMany({
    where: { createdAt: { gte: startDate } },
    select: { createdAt: true, total: true, id: true }
  });

  const dailyMap: Record<string, { date: string; revenue: number; orders: number }> = {};
  
  for (const sale of sales) {
    const dateStr = sale.createdAt.toISOString().split('T')[0];
    if (!dailyMap[dateStr]) {
      dailyMap[dateStr] = { date: dateStr, revenue: 0, orders: 0 };
    }
    dailyMap[dateStr].revenue += Number(sale.total);
    dailyMap[dateStr].orders += 1;
  }

  const result = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

  sendResponse(res, 200, true, 'Daily sales fetched', result);
});

export const getMonthlySales = asyncHandler(async (req: Request, res: Response) => {
  const months = parseInt(req.query.months as string) || 12;
  
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  const sales = await prisma.sale.findMany({
    where: { createdAt: { gte: startDate } },
    select: { createdAt: true, total: true, id: true }
  });

  const monthlyMap: Record<string, { month: string; revenue: number; orders: number }> = {};
  
  for (const sale of sales) {
    // Format: YYYY-MM
    const dateStr = sale.createdAt.toISOString().slice(0, 7);
    if (!monthlyMap[dateStr]) {
      monthlyMap[dateStr] = { month: dateStr, revenue: 0, orders: 0 };
    }
    monthlyMap[dateStr].revenue += Number(sale.total);
    monthlyMap[dateStr].orders += 1;
  }

  const result = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));

  sendResponse(res, 200, true, 'Monthly sales fetched', result);
});

export const getTopProducts = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  
  // Aggregate sales grouped by productId
  const topItems = await prisma.saleItem.groupBy({
    by: ['productId'],
    _sum: { quantity: true, subtotal: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: limit,
  });

  // Fetch product details for these IDs
  const productIds = topItems.map(item => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, purchasePrice: true }
  });

  const result = topItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    const revenue = Number(item._sum.subtotal || 0);
    const qty = item._sum.quantity || 0;
    const cost = Number(product?.purchasePrice || 0) * qty;
    
    return {
      productId: item.productId,
      name: product?.name || 'Unknown',
      unitsSold: qty,
      revenue,
      profit: revenue - cost,
    };
  });

  sendResponse(res, 200, true, 'Top products fetched', result);
});

export const getSalesByCashier = asyncHandler(async (_req: Request, res: Response) => {
  const sales = await prisma.sale.groupBy({
    by: ['userId'],
    _count: { id: true },
    _sum: { total: true },
  });

  const userIds = sales.map(s => s.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true }
  });

  const result = sales.map(s => ({
    userId: s.userId,
    name: users.find(u => u.id === s.userId)?.name || 'Unknown',
    orders: s._count.id,
    revenue: Number(s._sum.total || 0),
  })).sort((a, b) => b.revenue - a.revenue);

  sendResponse(res, 200, true, 'Cashier sales fetched', result);
});

export const getInventoryReport = asyncHandler(async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      stock: true,
      minimumStock: true,
      purchasePrice: true,
      sellingPrice: true,
    },
    orderBy: { stock: 'asc' }
  });

  const result = products.map(p => ({
    ...p,
    status: p.stock === 0 ? 'Out of Stock' : (p.stock <= p.minimumStock ? 'Low Stock' : 'In Stock'),
    stockValue: p.stock * Number(p.purchasePrice),
    retailValue: p.stock * Number(p.sellingPrice),
  }));

  sendResponse(res, 200, true, 'Inventory report fetched', result);
});

export const getLowStock = asyncHandler(async (_req: Request, res: Response) => {
  // Prisma doesn't natively support comparing two columns in the where clause without raw query
  const allProducts = await prisma.product.findMany();
  
  const lowStock = allProducts.filter(p => p.stock <= p.minimumStock).map(p => ({
    ...p,
    deficit: p.minimumStock - p.stock
  })).sort((a, b) => b.deficit - a.deficit);

  sendResponse(res, 200, true, 'Low stock fetched', lowStock);
});
