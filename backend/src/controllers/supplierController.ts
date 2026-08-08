import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';
import asyncHandler from '../utils/asyncHandler';
import sendResponse from '../utils/sendResponse';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';

const supplierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().nullable().optional(),
  email: z.string().email('Invalid email').nullable().optional().or(z.literal('')),
  address: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
});

export const getAllSuppliers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;

  const skip = (page - 1) * limit;
  const where: Prisma.SupplierWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.supplier.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { purchases: true },
        },
      },
    }),
    prisma.supplier.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    message: 'Suppliers fetched successfully',
    data: {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getSupplierById = asyncHandler(async (req: Request, res: Response) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id: req.params.id as string },
  });

  if (!supplier) {
    throw new ApiError('Supplier not found', 404);
  }

  sendResponse(res, 200, true, 'Supplier fetched', supplier);
});

export const createSupplier = asyncHandler(async (req: Request, res: Response) => {
  // If email is empty string, parse as null
  const bodyData = { ...req.body };
  if (bodyData.email === '') bodyData.email = null;

  const parsedData = supplierSchema.parse(bodyData);

  const supplier = await prisma.supplier.create({
    data: parsedData,
  });

  sendResponse(res, 201, true, 'Supplier created successfully', supplier);
});

export const updateSupplier = asyncHandler(async (req: Request, res: Response) => {
  const bodyData = { ...req.body };
  if (bodyData.email === '') bodyData.email = null;
  const parsedData = supplierSchema.parse(bodyData);

  const existingSupplier = await prisma.supplier.findUnique({
    where: { id: req.params.id as string },
  });

  if (!existingSupplier) {
    throw new ApiError('Supplier not found', 404);
  }

  const updatedSupplier = await prisma.supplier.update({
    where: { id: req.params.id as string },
    data: parsedData,
  });

  sendResponse(res, 200, true, 'Supplier updated successfully', updatedSupplier);
});

export const deleteSupplier = asyncHandler(async (req: Request, res: Response) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id: req.params.id as string },
    include: {
      _count: { select: { purchases: true } },
    }
  });

  if (!supplier) {
    throw new ApiError('Supplier not found', 404);
  }

  if (supplier._count.purchases > 0) {
    throw new ApiError('Cannot delete supplier with existing purchase records', 400);
  }

  await prisma.supplier.delete({
    where: { id: req.params.id as string },
  });

  sendResponse(res, 200, true, 'Supplier deleted successfully', null);
});
