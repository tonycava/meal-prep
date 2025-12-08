import z from "zod";

export const getByIdDto = z.object({
  id: z.uuid("L'identifiant doit être un UUID valide."),
});

export type GetByIdDto = z.infer<typeof getByIdDto>;