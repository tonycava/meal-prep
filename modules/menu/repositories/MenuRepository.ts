import { IMenuRepository, CreateMenuDto } from "../interfaces/IMenuRepository";
import { Menu } from "../entities/Menu";
import { ListMenusOutput } from "$modules/menu/dto/menuDto";
import { DeleteMenuDto } from "$modules/menu/dto/deleteMenuDto"
import { prisma } from "$lib/db";
import { AppError } from "$lib/errors/AppError.ts";
import { CreateMenuPartialDtoWithId } from "$modules/menu/dto/createMenuDto";
import { User } from "$lib/common/User";
import { GenerateMenuOutput, IMenuGenerationFilters } from "../dto/generateMenuDto";
import { MealType, DietType } from "../../../generated/client";

export const MenuRepository = (user: User): IMenuRepository => {

  return {
    async update(menuDto: CreateMenuPartialDtoWithId): Promise<void> {
      const menu = await this.getOne(menuDto.id)
      if (!menu) return;
      const mealsToDelete = menu.menuMeals.filter(child => !menuDto.mealIds?.some(c => c.mealId === child.mealId));
      for (const mealsToDeleteElement of mealsToDelete) {
        await prisma.menuMeal.delete({ where: { menuId_mealId_dayNumber: { menuId: menuDto.id, mealId: mealsToDeleteElement.mealId, dayNumber: mealsToDeleteElement.dayNumber } } });
      }

      const mealsToAdd = menuDto.mealIds?.filter(
        newMeal => !menu.menuMeals.some(existing => existing.mealId === newMeal.mealId)
      ) || [];


      for (const mealToAdd of mealsToAdd) {
        await prisma.menuMeal.create({
          data: {
            menuId: menu.id,
            mealId: mealToAdd.mealId,
            dayNumber: mealToAdd.dayNumber
          }
        })
      }

      await prisma.menu.update({
        data: {
          name: menuDto.name,
          description: menuDto.description,
          duration: menuDto.duration,
        },
        where: { id: menuDto.id },
      })


      return;
    },
    async getOne(menuId: string): Promise<Menu | null> {
      const menu = await prisma.menu.findFirst({
        where: { id: menuId },
        orderBy: { createdAt: "desc" },
        include: {
          menuMeals: {
            select: {
              mealId: true,
              dayNumber: true,
            },
          },
        },
      });

      if (!menu) return null;

      return {
        id: menu.id,
        name: menu.name,
        description: menu.description,
        duration: menu.duration,
        createdAt: menu.createdAt.toISOString(),
        updatedAt: menu.updatedAt,
        menuMeals: menu.menuMeals,
      };
    },
    async list(
      limit: number,
      offset: number,
      role: string,
    ): Promise<ListMenusOutput> {
      const where = role.toLowerCase() === "user" ? { apiKey: { key: user.apiKey } } : {};

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

		async save(menuDto: CreateMenuDto): Promise<Menu> {
			try {
				const createdMenu = await prisma.menu.create({
					data: {
						name: menuDto.name,
						description: menuDto.description,
						duration: menuDto.duration,
						apiKey: { connect: { key: user.apiKey } },
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

			if(user.role.toLowerCase() === "user" && menu.apiKeyId != user.apiKeyId) {
				throw new AppError(
					"Forbidden",
					`User ${user.apiKeyId} tried to delete menu ${menu.id} owned by ${menu.apiKeyId}`,
					"Vous n'avez pas les autorisations pour supprimer ce menu.",
					"error"
				);
			}

			await prisma.menu.delete({
				where: { id: menuDto.id }
			})
		},

		async generate(
			duration: number,
			filters: IMenuGenerationFilters
		): Promise<GenerateMenuOutput> {
			const recipes = await prisma.recipe.findMany({
				where: {
					...(filters.diet && { diet: filters.diet as DietType }),
					isPublic: true,
				},
				include: {
					ingredients: {
						include: {
							ingredient: true,
						},
					},
				},
			});

			if (!recipes || recipes.length === 0) {
				throw new AppError(
					"Not Found",
					"No recipes found with the specified criteria",
					"Aucune recette trouvée avec les critères spécifiés.",
					"error"
				);
			}

			const filteredRecipes = recipes.filter((recipe) => {
				const nutrition = recipe.ingredients.reduce(
					(acc, ri) => {
						const ing = ri.ingredient;
						const quantity = ri.quantity || 100; // Quantité en grammes
						const factor = quantity / 100;

						return {
							calories: acc.calories + ing.calories * factor,
							proteins: acc.proteins + ing.proteins * factor,
							fats: acc.fats + ing.fats * factor,
							carbs: acc.carbs + ing.carbs * factor,
							sugars: acc.sugars + ing.sugars * factor,
							fiber: acc.fiber + ing.fiber * factor,
							salt: acc.salt + ing.salt * factor,
						};
					},
					{
						calories: 0,
						proteins: 0,
						fats: 0,
						carbs: 0,
						sugars: 0,
						fiber: 0,
						salt: 0,
					}
				);

				if (filters.caloriesMin && nutrition.calories < filters.caloriesMin) return false;
				if (filters.caloriesMax && nutrition.calories > filters.caloriesMax) return false;
				if (filters.proteinsMin && nutrition.proteins < filters.proteinsMin) return false;
				if (filters.proteinsMax && nutrition.proteins > filters.proteinsMax) return false;
				if (filters.fatsMin && nutrition.fats < filters.fatsMin) return false;
				if (filters.fatsMax && nutrition.fats > filters.fatsMax) return false;
				if (filters.carbsMin && nutrition.carbs < filters.carbsMin) return false;
				if (filters.carbsMax && nutrition.carbs > filters.carbsMax) return false;
				if (filters.sugarsMin && nutrition.sugars < filters.sugarsMin) return false;
				if (filters.sugarsMax && nutrition.sugars > filters.sugarsMax) return false;
				if (filters.fiberMin && nutrition.fiber < filters.fiberMin) return false;
				if (filters.fiberMax && nutrition.fiber > filters.fiberMax) return false;
				if (filters.saltMin && nutrition.salt < filters.saltMin) return false;
				if (filters.saltMax && nutrition.salt > filters.saltMax) return false;

				return true;
			});

			if (filteredRecipes.length === 0) {
				throw new AppError(
					"Not Found",
					"No recipes match the nutritional criteria",
					"Aucune recette ne correspond aux critères nutritionnels spécifiés.",
					"error"
				);
			}

			const mealTypes = [
				MealType.BREAKFAST,
				MealType.LUNCH,
				MealType.DINNER,
			];
			const generatedMeals: Array<{ mealId: string; dayNumber: number }> = [];

			for (let day = 1; day <= duration; day++) {
				for (const mealType of mealTypes) {
					const randomRecipe =
						filteredRecipes[
							Math.floor(Math.random() * filteredRecipes.length)
						];

					const meal = await prisma.meal.create({
						data: {
							mealType: mealType,
							apiKeyId: user.apiKeyId,
							recipeMeals: {
								create: {
									recipeId: randomRecipe.id,
									type: "MAIN_COURSE",
								},
							},
						},
					});

					generatedMeals.push({
						mealId: meal.id,
						dayNumber: day,
					});
				}
			}

			return {
				id: crypto.randomUUID(),
				name: `Menu généré - ${duration} jour${duration > 1 ? "s" : ""}`,
				description: filters.diet
					? `Menu ${filters.diet} sur ${duration} jours`
					: `Menu équilibré sur ${duration} jours`,
				duration: duration,
				createdAt: new Date().toISOString(),
				updatedAt: new Date(),
				menuMeals: generatedMeals,
			};
		}
	};
};
