import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';
import asyncHandler from '../utils/asyncHandler';
import sendResponse from '../utils/sendResponse';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';

// Zod validation schema for creating/updating products
const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  category: z.string().min(1, 'Category is required'),
  imei: z.string().nullable().optional(),
  ram: z.string().nullable().optional(),
  storage: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  purchasePrice: z.number().positive('Purchase price must be positive'),
  sellingPrice: z.number().positive('Selling price must be positive'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  minimumStock: z.number().int().min(1, 'Minimum stock must be at least 1').default(5),
});

/**
 * @desc    Get all products (with pagination, search, filter)
 * @route   GET /api/products
 * @access  Private
 */
export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;
  const category = req.query.category as string;
  
  const skip = (page - 1) * limit;

  // Build where clause
  const where: Prisma.ProductWhereInput = {};

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { brand: { contains: search, mode: 'insensitive' } },
      { model: { contains: search, mode: 'insensitive' } },
      { imei: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    message: 'Products fetched successfully',
    data: {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Get low stock products
 * @route   GET /api/products/low-stock
 * @access  Private
 */
export const getLowStockProducts = asyncHandler(async (_req: Request, res: Response) => {
  // Prisma doesn't directly support comparing two columns in findMany out of the box easily without raw query
  // However, since Prisma 5, we can use extended where if we do raw, or fetch and filter, or a raw query.
  // Actually, we can use a raw query for efficiency, or just fetch all that might be low stock.
  // To keep it simple and Prisma-native without raw:
  // We'll use a raw query because we need `WHERE stock <= "minimumStock"`
  
  const items = await prisma.$queryRaw`SELECT * FROM "Product" WHERE stock <= "minimumStock" ORDER BY stock ASC`;

  sendResponse(res, 200, true, 'Low stock products fetched', items);
});

/**
 * @desc    Get a single product
 * @route   GET /api/products/:id
 * @access  Private
 */
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id as string },
  });

  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  sendResponse(res, 200, true, 'Product fetched', product);
});

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const parsedData = productSchema.parse(req.body);

  if (parsedData.imei) {
    const existing = await prisma.product.findUnique({ where: { imei: parsedData.imei } });
    if (existing) {
      throw new ApiError('IMEI already registered', 400);
    }
  }

  const product = await prisma.product.create({
    data: parsedData,
  });

  sendResponse(res, 201, true, 'Product created successfully', product);
});

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const parsedData = productSchema.parse(req.body);

  const existingProduct = await prisma.product.findUnique({
    where: { id: req.params.id as string },
  });

  if (!existingProduct) {
    throw new ApiError('Product not found', 404);
  }

  if (parsedData.imei && parsedData.imei !== existingProduct.imei) {
    const duplicateImei = await prisma.product.findUnique({ where: { imei: parsedData.imei } });
    if (duplicateImei) {
      throw new ApiError('IMEI already registered', 400);
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id: req.params.id as string },
    data: parsedData,
  });

  sendResponse(res, 200, true, 'Product updated successfully', updatedProduct);
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id: req.params.id as string },
  });

  if (!existingProduct) {
    throw new ApiError('Product not found', 404);
  }

  await prisma.product.delete({
    where: { id: req.params.id as string },
  });

  sendResponse(res, 200, true, 'Product deleted successfully', null);
});
