import { IMenuRepository, CreateMenuDto } from "../interfaces/IMenuRepository";
import { Menu } from "../entities/Menu";
import { ListMenusOutput } from "$modules/menu/dto/menu.dto";
import { DeleteMenuDto } from "$modules/menu/dto/deleteMenu.dto"
import { prisma } from "$lib/db";
import { AppError } from "$lib/errors/AppError.ts";
import { User } from "$lib/common/User";

export const MenuRepository = (user: User): IMenuRepository => {
	return {
		async list(
			limit: number,
			offset: number,
			apiKey: string,
			role: string,
		): Promise<ListMenusOutput> {
			const where =
				role.toLowerCase() === "user" ? { apiKey: { key: apiKey } } : {};

			const [menus, total] = await Promise.all([
				prisma.menu.findMany({
					where,
					skip: offset,
					take: limit,
					orderBy: { createdAt: "desc" },
					include: {
						menuMeals: {
							select: {
								mealId: true,
								dayNumber: true,
							},
						},
					},
				}),
				prisma.menu.count({ where }),
			]);

			return {
				menus: menus.map((menu) => ({
					id: menu.id,
					name: menu.name,
					description: menu.description,
					duration: menu.duration,
					createdAt: menu.createdAt.toISOString(),
					updatedAt: menu.updatedAt,
					menuMeals: menu.menuMeals,
				})),
				meta: {
					total: total,
					offset: offset,
					limit: limit,
				},
			};
		},

		async save(menuDto: CreateMenuDto, apiKey: string): Promise<Menu> {
			try {
				const createdMenu = await prisma.menu.create({
					data: {
						name: menuDto.name,
						description: menuDto.description,
						duration: menuDto.duration,
						apiKey: { connect: { key: apiKey } },
						menuMeals: {
							create: menuDto.mealIds.map((item) => ({
								meal: { connect: { id: item.mealId } },
								dayNumber: item.dayNumber,
							})),
						},
					},
					include: {
						menuMeals: {
							select: {
								mealId: true,
								dayNumber: true,
							},
						},
					},
				});

				return {
					id: createdMenu.id,
					name: createdMenu.name,
					description: createdMenu.description,
					duration: createdMenu.duration,
					createdAt: createdMenu.createdAt.toISOString(),
					updatedAt: createdMenu.updatedAt,
					menuMeals: createdMenu.menuMeals,
				};
			} catch (error) {
				console.log(error);
				throw new AppError(
					"Internal Server Error",
					"An error occurred while saving the menu.",
					"La création du menu a échoué.",
					"error",
				);
			}
		},

		async delete(menuDto: DeleteMenuDto): Promise<void> {
			
			const menu = await prisma.menu.findUnique({
				where: { id: menuDto.id }
			});

			if(!menu) {
				throw new AppError(
					"Not Found",
					`Menu ${menuDto.id} not found`,
					"Ce menu n'existe pas.",
					"error"
				);
			}

			if(user.role === "user" && menu.apiKeyId != user.apiKey) {
				throw new AppError(
					"Forbidden",
					`User ${user.apiKey} tried to delete menu ${menu.id} owned by ${menu.apiKeyId}`,
					"Vous n'avez pas les autorisations pour supprimer ce menu.",
					"error"
				);
			}

			await prisma.menu.delete({
				where: { id: menuDto.id }
			})
		}
	};
};
