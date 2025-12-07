import { z } from "zod";

export const deleteMenuDto = z.object({
	id: z.uuid("Un identifiant est requis."),
})

export type DeleteMenuDto = z.infer<typeof deleteMenuDto>;