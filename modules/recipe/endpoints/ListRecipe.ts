import { defaultEndpointsFactory } from "express-zod-api";
import { z } from "zod";
import { prisma } from "$lib/db.ts";

export const ListRecipeEndpoint = defaultEndpointsFactory.build({
  method: "get",
  output: z.object({
    data: z.array(z.string()),
  }),
  handler: async ({ options, logger }) => {
    return { data: [] };
  },
});