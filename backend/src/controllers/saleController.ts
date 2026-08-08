import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';
import asyncHandler from '../utils/asyncHandler';
import sendResponse from '../utils/sendResponse';
import ApiError from '../utils/ApiError';


const saleItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
  subtotal: z.number().nonnegative(),
});

const saleSchema = z.object({
  customerId: z.string().nullable().optional(),
  discount: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  paymentMethod: z.enum(['cash', 'card', 'other']),
  items: z.array(saleItemSchema).min(1, 'At least one item is required'),
});

// Helper to generate Invoice Number: INV-YYYYMMDD-XXXXX
async function generateInvoiceNumber(): Promise<string> {
  const date = new Date();
  const dateString = date.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
  
  // Find the last sale of today
  const lastSale = await prisma.sale.findFirst({
    where: {
      invoiceNumber: { startsWith: `INV-${dateString}-` },
    },
    orderBy: { invoiceNumber: 'desc' },
  });

  let nextNumber = 1;
  if (lastSale) {
    const lastNumStr = lastSale.invoiceNumber.split('-')[2];
    if (lastNumStr) {
      nextNumber = parseInt(lastNumStr, 10) + 1;
    }
  }

  const paddedNum = nextNumber.toString().padStart(5, '0');
  return `INV-${dateString}-${paddedNum}`;
}

export const createSale = asyncHandler(async (req: Request, res: Response) => {
  const parsedData = saleSchema.parse(req.body);
  const userId = (req as any).auth?.userId;

  if (!userId) {
    throw new ApiError('Unauthorized', 401);
  }

  // Look up user internal ID from Clerk ID
  const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new ApiError('Internal user not found', 404);

  // We use interactive transaction to check stock and decrement
  const createdSale = await prisma.$transaction(async (tx) => {
    // 1. Fetch all products and validate stock
    const productIds = parsedData.items.map(item => item.productId);
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
    });

    let calculatedSubtotal = 0;

    for (const item of parsedData.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new ApiError(`Product not found: ${item.productId}`, 404);
      
      if (product.stock < item.quantity) {
        throw new ApiError(`Insufficient stock for ${product.name}. Available: ${product.stock}`, 400);
      }

      calculatedSubtotal += Number(item.price) * item.quantity;
    }

    const calculatedTotal = calculatedSubtotal - parsedData.discount + parsedData.tax;

    // 2. Generate invoice number inside transaction logic
    const invoiceNumber = await generateInvoiceNumber();

    // 3. Create Sale and SaleItems
    const sale = await tx.sale.create({
      data: {
        invoiceNumber,
        customerId: parsedData.customerId || null,
        userId: user.id,
        subtotal: calculatedSubtotal,
        discount: parsedData.discount,
        tax: parsedData.tax,
        total: calculatedTotal < 0 ? 0 : calculatedTotal,
        paymentMethod: parsedData.paymentMethod,
        items: {
          create: parsedData.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            subtotal: Number(item.price) * item.quantity,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        customer: true,
      }
    });

    // 4. Decrement stock
    for (const item of parsedData.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return sale;
  });

  sendResponse(res, 201, true, 'Sale completed successfully', createdSale);
});

export const getAllSales = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.sale.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        user: true,
        items: true,
      },
    }),
    prisma.sale.count(),
  ]);

  res.status(200).json({
    success: true,
    message: 'Sales fetched successfully',
    data: {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getSaleById = asyncHandler(async (req: Request, res: Response) => {
  const sale = await prisma.sale.findUnique({
    where: { id: req.params.id as string },
    include: {
      customer: true,
      user: true,
      items: {
        include: { product: true },
      },
    },
  });

  if (!sale) {
    throw new ApiError('Sale not found', 404);
  }

  sendResponse(res, 200, true, 'Sale fetched', sale);
});

export const getTodaySales = asyncHandler(async (_req: Request, res: Response) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const sales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      }
    },
    include: {
      items: true
    }
  });

  sendResponse(res, 200, true, 'Today sales fetched', sales);
});
