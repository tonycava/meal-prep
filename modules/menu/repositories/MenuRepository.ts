import {
  IMenuRepository,
  CreateMenuDto,
  UpdateMenuDto,
  MenuWithMeals,
} from "../interfaces/IMenuRepository";
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
          orderBy: { createdAt: "desc" },
          include: {
            _count: {
              select: { meals: true },
            },
          },
        }),
        prisma.menu.count(),
      ]);

      return {
        menus: menus.map((menu) => ({
          id: menu.id,
          name: menu.name,
          description: menu.description,
          createdAt: menu.createdAt.toISOString(),
          updatedAt: menu.updatedAt,
          itemCount: menu._count.meals,
        })),
        meta: {
          total: total,
          offset: offset,
          limit: limit,
        },
      };
    },

    async save(menuDto: CreateMenuDto, apiKey: string): Promise<MenuWithMeals> {
      const createdMenu = await prisma.menu.create({
        data: {
          name: menuDto.name,
          description: menuDto.description,
          apiKey: { connect: { key: apiKey } },
          meals: {
            create: menuDto.meals.map((meal) => ({
              recipeId: meal.recipeId,
              mealType: meal.mealType,
              dayNumber: meal.dayNumber,
              order: meal.order,
            })),
          },
        },
        include: {
          meals: {
            include: {
              recipe: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  imageUrl: true,
                },
              },
            },
            orderBy: [{ dayNumber: "asc" }, { order: "asc" }],
          },
        },
      });

      return {
        id: createdMenu.id,
        name: createdMenu.name,
        description: createdMenu.description,
        createdAt: createdMenu.createdAt.toISOString(),
        updatedAt: createdMenu.updatedAt,
        meals: createdMenu.meals.map((meal) => ({
          id: meal.id,
          recipeId: meal.recipeId,
          mealType: meal.mealType,
          order: meal.order,
          dayNumber: meal.dayNumber,
          recipe: {
            id: meal.recipe.id,
            title: meal.recipe.title,
            description: meal.recipe.description,
            imageUrl: meal.recipe.imageUrl,
          },
        })),
      };
    },

    async findById(id: string): Promise<MenuWithMeals | null> {
      const menu = await prisma.menu.findUnique({
        where: { id },
        include: {
          meals: {
            include: {
              recipe: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  imageUrl: true,
                },
              },
            },
            orderBy: [{ dayNumber: "asc" }, { order: "asc" }],
          },
        },
      });

      if (!menu) return null;

      return {
        id: menu.id,
        name: menu.name,
        description: menu.description,
        createdAt: menu.createdAt.toISOString(),
        updatedAt: menu.updatedAt,
        meals: menu.meals.map((meal) => ({
          id: meal.id,
          recipeId: meal.recipeId,
          mealType: meal.mealType,
          order: meal.order,
          dayNumber: meal.dayNumber,
          recipe: {
            id: meal.recipe.id,
            title: meal.recipe.title,
            description: meal.recipe.description,
            imageUrl: meal.recipe.imageUrl,
          },
        })),
      };
    },

    async update(id: string, menuDto: UpdateMenuDto): Promise<Menu> {
      if (menuDto.meals) {
        await prisma.meal.deleteMany({
          where: { menuId: id },
        });
      }

      const updatedMenu = await prisma.menu.update({
        where: { id },
        data: {
          ...(menuDto.name && { name: menuDto.name }),
          ...(menuDto.description !== undefined && {
            description: menuDto.description,
          }),
          ...(menuDto.meals && {
            meals: {
              create: menuDto.meals.map((meal) => ({
                recipeId: meal.recipeId,
                mealType: meal.mealType,
                dayNumber: meal.dayNumber,
                order: meal.order,
              })),
            },
          }),
        },
      });

      return {
        id: updatedMenu.id,
        name: updatedMenu.name,
        description: updatedMenu.description,
        createdAt: updatedMenu.createdAt.toISOString(),
        updatedAt: updatedMenu.updatedAt,
      };
    },

    async delete(id: string): Promise<void> {
      await prisma.menu.delete({
        where: { id },
      });
    },
  };
};
