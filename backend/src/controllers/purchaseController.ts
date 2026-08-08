import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';
import asyncHandler from '../utils/asyncHandler';
import sendResponse from '../utils/sendResponse';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';

const purchaseItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  price: z.number().nonnegative('Price cannot be negative'),
});

const purchaseSchema = z.object({
  supplierId: z.string().min(1, 'Supplier ID is required'),
  notes: z.string().optional().nullable(),
  items: z.array(purchaseItemSchema).min(1, 'At least one item is required'),
});

export const createPurchase = asyncHandler(async (req: Request, res: Response) => {
  const parsedData = purchaseSchema.parse(req.body);
  const userId = (req as any).auth?.userId;

  if (!userId) {
    throw new ApiError('Unauthorized', 401);
  }

  // Look up user internal ID from Clerk ID
  const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new ApiError('Internal user not found', 404);

  // We use interactive transaction to increment stock and create purchase
  const createdPurchase = await prisma.$transaction(async (tx) => {
    // 1. Validate all products exist
    const productIds = parsedData.items.map(item => item.productId);
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new ApiError('One or more products not found', 404);
    }

    // 2. Validate supplier exists
    const supplier = await tx.supplier.findUnique({ where: { id: parsedData.supplierId } });
    if (!supplier) {
      throw new ApiError('Supplier not found', 404);
    }

    let calculatedTotal = 0;

    // Calculate subtotal for each item and sum them
    const itemsData = parsedData.items.map(item => {
      const subtotal = Number(item.price) * item.quantity;
      calculatedTotal += subtotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        subtotal,
      };
    });

    // 3. Create Purchase and PurchaseItems
    const purchase = await tx.purchase.create({
      data: {
        supplierId: parsedData.supplierId,
        userId: user.id,
        total: calculatedTotal,
        notes: parsedData.notes || null,
        items: {
          create: itemsData,
        },
      },
      include: {
        items: { include: { product: true } },
        supplier: true,
      }
    });

    // 4. Increment stock for each product
    for (const item of parsedData.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    return purchase;
  });

  sendResponse(res, 201, true, 'Purchase logged and stock updated successfully', createdPurchase);
});

export const getAllPurchases = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const supplierId = req.query.supplierId as string;
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;
  
  const skip = (page - 1) * limit;

  const where: Prisma.PurchaseWhereInput = {};

  if (supplierId) {
    where.supplierId = supplierId;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const [items, total] = await Promise.all([
    prisma.purchase.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        supplier: true,
        user: true,
        _count: {
          select: { items: true }
        }
      },
    }),
    prisma.purchase.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    message: 'Purchases fetched successfully',
    data: {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getPurchaseById = asyncHandler(async (req: Request, res: Response) => {
  const purchase = await prisma.purchase.findUnique({
    where: { id: req.params.id as string },
    include: {
      supplier: true,
      user: true,
      items: {
        include: { product: true },
      },
    },
  });

  if (!purchase) {
    throw new ApiError('Purchase not found', 404);
  }

  sendResponse(res, 200, true, 'Purchase fetched', purchase);
});
