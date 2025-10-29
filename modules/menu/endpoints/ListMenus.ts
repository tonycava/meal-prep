import { defaultEndpointsFactory } from "express-zod-api";
import {
  ListMenusInputSchema,
  ListMenusOutputSchema
} from "../dto/menu.dto.ts";
import {prisma} from "$lib/db.ts";

export const ListMenusEndpoint = defaultEndpointsFactory.build({
    method: "get",
    input: ListMenusInputSchema,
    output: ListMenusOutputSchema,
    handler: async ({ input: { limit, offset }, options, logger}) => {
      logger.info(`Fetching menus with limit ${limit} and offset ${offset}`);

      const total = await prisma.menu.count();

      const menus = await prisma.menu.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { items: true }
          }
        }
      })

      logger.info(`Fetched ${menus.length} menus`);
      return {
        menus: menus.map(menu => ({
            id: menu.id,
            name: menu.name,
            description: menu.description,
            createdAt: menu.createdAt.toISOString(),
            updatedAt: menu.updatedAt,
            itemCount: menu._count.items,
        })),
        total,
        limit,
        offset,
      };
    }
});