import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';
import asyncHandler from '../utils/asyncHandler';
import sendResponse from '../utils/sendResponse';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().nullable().optional(),
  email: z.string().email('Invalid email').nullable().optional(),
  address: z.string().nullable().optional(),
});

export const getAllCustomers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;

  const skip = (page - 1) * limit;
  const where: Prisma.CustomerWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { sales: true },
        },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    message: 'Customers fetched successfully',
    data: {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getCustomerById = asyncHandler(async (req: Request, res: Response) => {
  const customer = await prisma.customer.findUnique({
    where: { id: req.params.id as string },
    include: {
      _count: {
        select: { sales: true },
      },
    },
  });

  if (!customer) {
    throw new ApiError('Customer not found', 404);
  }

  sendResponse(res, 200, true, 'Customer fetched', customer);
});

export const getCustomerPurchaseHistory = asyncHandler(async (req: Request, res: Response) => {
  const sales = await prisma.sale.findMany({
    where: { customerId: req.params.id as string },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  sendResponse(res, 200, true, 'Customer purchase history fetched', sales);
});

export const createCustomer = asyncHandler(async (req: Request, res: Response) => {
  const parsedData = customerSchema.parse(req.body);

  if (parsedData.phone) {
    const existing = await prisma.customer.findUnique({ where: { phone: parsedData.phone } });
    if (existing) throw new ApiError('Phone number already registered', 400);
  }
  
  if (parsedData.email) {
    const existing = await prisma.customer.findUnique({ where: { email: parsedData.email } });
    if (existing) throw new ApiError('Email already registered', 400);
  }

  const customer = await prisma.customer.create({
    data: parsedData,
  });

  sendResponse(res, 201, true, 'Customer created successfully', customer);
});

export const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const parsedData = customerSchema.parse(req.body);

  const existingCustomer = await prisma.customer.findUnique({
    where: { id: req.params.id as string },
  });

  if (!existingCustomer) {
    throw new ApiError('Customer not found', 404);
  }

  if (parsedData.phone && parsedData.phone !== existingCustomer.phone) {
    const existing = await prisma.customer.findUnique({ where: { phone: parsedData.phone } });
    if (existing) throw new ApiError('Phone number already registered', 400);
  }
  
  if (parsedData.email && parsedData.email !== existingCustomer.email) {
    const existing = await prisma.customer.findUnique({ where: { email: parsedData.email } });
    if (existing) throw new ApiError('Email already registered', 400);
  }

  const updatedCustomer = await prisma.customer.update({
    where: { id: req.params.id as string },
    data: parsedData,
  });

  sendResponse(res, 200, true, 'Customer updated successfully', updatedCustomer);
});

export const deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customer = await prisma.customer.findUnique({
    where: { id: req.params.id as string },
    include: {
      _count: { select: { sales: true } },
    }
  });

  if (!customer) {
    throw new ApiError('Customer not found', 404);
  }

  if (customer._count.sales > 0) {
    throw new ApiError('Cannot delete customer with existing sales records', 400);
  }

  await prisma.customer.delete({
    where: { id: req.params.id as string },
  });

  sendResponse(res, 200, true, 'Customer deleted successfully', null);
});
