import { IMenuRepository, CreateMenuDto, UpdateMenuDto, MenuWithItems } from "../interfaces/IMenuRepository";
import { Menu } from "../entities/Menu";
import { ListMenusOutput } from "../dto/menu.dto";
import { prisma } from "$lib/db";

export const MenuRepository = (): IMenuRepository => {
  return {
    async list(limit: number, offset: number): Promise<ListMenusOutput> {

      const [menus, total] = await Promise.all([
        prisma.menu.findMany({
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: { items: true }
            }
          }
        }),
        prisma.menu.count()
      ]);

      return {
        menus: menus.map(menu => ({
          id: menu.id,
          name: menu.name,
          description: menu.description,
          createdAt: menu.createdAt.toISOString(),
          updatedAt: menu.updatedAt,
          itemCount: menu._count.items
        })),
        meta: {
          total: total,
          offset: offset,
          limit: limit
        }
      };
    },

    async save(menuDto: CreateMenuDto, apiKey: string): Promise<Menu> {
      // Vérifier que l'API key existe
      const existingKey = await prisma.apiKey.findUnique({
        where: { key: apiKey }
      });

      if (!existingKey) {
        throw new Error(`API Key not found: ${apiKey}`);
      }

      const createdMenu = await prisma.menu.create({
        data: {
          name: menuDto.name,
          description: menuDto.description,
          apiKey: { connect: { key: apiKey } },
          items: {
            create: menuDto.items.map(item => ({
              recipeId: item.recipeId,
              mealType: item.mealType,
              dayNumber: item.dayNumber,
              order: item.order
            }))
          }
        }
      });

      return { id: createdMenu.id };
    },

    async findById(id: string): Promise<MenuWithItems | null> {
      const menu = await prisma.menu.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              recipe: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  imageUrl: true
                }
              }
            },
            orderBy: [
              { dayNumber: 'asc' },
              { order: 'asc' }
            ]
          }
        }
      });

      if (!menu) return null;

      return {
        id: menu.id,
        items: menu.items.map(item => ({
          id: item.id,
          recipeId: item.recipeId,
          mealType: item.mealType,
          order: item.order,
          dayNumber: item.dayNumber,
          recipe: {
            id: item.recipe.id,
            title: item.recipe.title,
            description: item.recipe.description,
            imageUrl: item.recipe.imageUrl
          }
        }))
      };
    },

    async update(id: string, menuDto: UpdateMenuDto): Promise<Menu> {
      if (menuDto.items) {
        await prisma.menuItem.deleteMany({
          where: { menuId: id }
        });
      }

      const updatedMenu = await prisma.menu.update({
        where: { id },
        data: {
          ...(menuDto.name && { name: menuDto.name }),
          ...(menuDto.description !== undefined && { description: menuDto.description }),
          ...(menuDto.items && {
            items: {
              create: menuDto.items.map(item => ({
                recipeId: item.recipeId,
                mealType: item.mealType,
                dayNumber: item.dayNumber,
                order: item.order
              }))
            }
          })
        }
      });

      return { id: updatedMenu.id };
    },

    async delete(id: string): Promise<void> {
      await prisma.menu.delete({
        where: { id }
      });
    }
  };
};