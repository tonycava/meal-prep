import { z } from 'zod';

export const ListMenusInputSchema = z.object({
  per_page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 20),
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
});

export const MenuDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.coerce.date(),
  itemCount: z.number(),
});

export const ListMenusOutputSchema = z.object({
  data: z.array(MenuDTOSchema),
  meta: z.object({
    total: z.number(),
    count: z.number(),
    page: z.number(),
    per_page: z.number(),
    total_pages: z.number(),
  }),
});

export type ListMenusInput = z.infer<typeof ListMenusInputSchema>;
export type MenuDTO = z.infer<typeof MenuDTOSchema>;
export type ListMenusOutput = z.infer<typeof ListMenusOutputSchema>;