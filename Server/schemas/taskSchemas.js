import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.number().min(1).max(5),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  priority: z.number().min(1).max(5).optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date').optional(),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date').optional(),
  status: z.enum(['pending', 'in-progress', 'completed', 'lapsed']).optional(),
  actualCompletionTime: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date').optional(),
});