import { defaultEndpointsFactory } from "express-zod-api";
import { z } from "zod";

export const ListRecipeEndpoint = defaultEndpointsFactory.build({
  method: "get",
  output: z.object({
    data: z.array(z.string()),
  }),
  handler: async ({ logger }) => {
    logger.debug("Options:", {});
    return { data: [] };
  },
});