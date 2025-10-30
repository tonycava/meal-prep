import { z } from 'zod';

export const ListMenusInputSchema = z.object({
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
  offset: z.string().optional().transform((val) => val ? parseInt(val, 10) : 0),
});

export const MenuDTOSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.date(),
  itemCount: z.number(),
});

export const ListMenusOutputSchema = z.object({
  menus: z.array(MenuDTOSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
});

export type ListMenusInput = z.infer<typeof ListMenusInputSchema>;
export type MenuDTO = z.infer<typeof MenuDTOSchema>;
export type ListMenusOutput = z.infer<typeof ListMenusOutputSchema>;