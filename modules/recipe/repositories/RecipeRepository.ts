import { IRecipeRepository } from "../interfaces/IRecipeRepository";
import { CreateRecipeDto } from "../dto/createRecipeDto";
import { GetRecipeByIdDto, RecipeDetailDto } from "../dto/recipeDto";
import { UpdateRecipeOutput } from "$modules/recipe/dto/updateRecipeDto";
import { Recipe } from "../entities/Recipe";
import { prisma } from "$lib/db";
import { DeleteRecipeDto } from "$modules/recipe/dto/deleteRecipeDto";
import { AppError } from "$lib/errors/AppError";
import {
	ListRecipesOutput,
	IRecipeFilters,
	GetRecipeByIdOutput,
} from "../dto/recipeDto";
import {
	RecipeCategory,
	DietType,
	Prisma,
	UnitType,
} from "../../../src/generated/prisma";
import { UpdateRecipeDto } from "$modules/recipe/dto/updateRecipeDto";
import { User } from "$lib/common/User";

export const RecipeRepository = (user: User): IRecipeRepository => {
	return {
		async isUseInOneMenu(recipeId: string): Promise<boolean> {
			const menu = await prisma.recipeMeal.findFirst({ where: { recipeId } });
			return !!menu;
		},
		async update(recipeDto: UpdateRecipeDto): Promise<UpdateRecipeOutput> {
			try {
				const whereCondition: Prisma.RecipeWhereUniqueInput = {
					id: recipeDto.id,
					...(user.role.toLowerCase() === "user" ? {
						apiKeyId: user.apiKeyId
					} : {})
				};

				const recipe = await prisma.recipe.findFirst({
					where: whereCondition,
				});

				if (!recipe) {
					throw new AppError(
						"Not Found",
						"Recipe not found",
						"Recette non trouvée.",
						"warn",
					);
				}

				const updatedRecipe = await prisma.recipe.update({
					data: {
						title: recipeDto.title,
						description: recipeDto.description,
						instructions: recipeDto.instructions,
						imageUrl: recipeDto.imageUrl,
						prepTimeMin: recipeDto.prepTimeMin,
						cookTimeMin: recipeDto.cookTimeMin,
						servings: recipeDto.servings,
						category: recipeDto.category,
						diet: recipeDto.diet,
						isPublic: recipeDto.isPublic,
					},
					where: { id: recipeDto.id },
					include: {
						ingredients: {
							include: {
								ingredient: true
							}
						}
					},
				});

				return {
					id: updatedRecipe.id,
					title: updatedRecipe.title,
					description: updatedRecipe.description,
					instructions: updatedRecipe.instructions,
					imageUrl: updatedRecipe.imageUrl,
					prepTimeMin: updatedRecipe.prepTimeMin,
					cookTimeMin: updatedRecipe.cookTimeMin,
					servings: updatedRecipe.servings,
					category: updatedRecipe.category,
					diet: updatedRecipe.diet,
					isPublic: updatedRecipe.isPublic,
					createdAt: updatedRecipe.createdAt,
					updatedAt: updatedRecipe.updatedAt,
					ingredients: updatedRecipe.ingredients.map(ri => ({
						id: ri.ingredient.id,
						name: ri.ingredient.name,
						quantity: ri.quantity,
						unit: ri.unit as UnitType
					}))
				};

			} catch (error) {
				console.error("An error occurred while updating recipe", error);

				if (error instanceof AppError) {
					throw error;
				}

				throw new AppError(
					"Internal Server Error",
					"An error occurred while updating recipe",
					"Une erreur est survenue lors de la mise à jour d'une recette.",
					"error",
				);
			}
		},
		async delete(recipeDto: DeleteRecipeDto): Promise<boolean> {
			try {
				const whereAppend: Prisma.RecipeWhereUniqueInput = {
					id: recipeDto.id,
					...(user.role.toLowerCase() === "user" ? {
						apiKeyId: user.apiKeyId
					} : {})
				};

				const recipe = await prisma.recipe.findFirst({
					where: whereAppend,
				});

				if (!recipe) {
					throw new AppError(
						"Not Found",
						"Recipe not found",
						"Recipe not found",
						"warn",
					);
				}

				await prisma.recipe.delete({
					where: { id: recipeDto.id },
				});

				return true;
			} catch (error) {
				console.error("An error occurred while deleting recipe", error);

				if (error instanceof AppError) {
					throw error;
				}

				throw new AppError(
					"Internal Server Error",
					"An error occurred while deleting recipe",
					"Une erreur est survenue lors de la suppression d'une recette.",
					"error",
				);
			}
		},
		async save(recipeDto: CreateRecipeDto): Promise<Recipe> {
			try {
				const createdRecipe = await prisma.recipe.create({
					data: {
						title: recipeDto.title,
						description: recipeDto.description,
						instructions: recipeDto.instructions,
						imageUrl: recipeDto.imageUrl,
						prepTimeMin: recipeDto.prepTimeMin,
						cookTimeMin: recipeDto.cookTimeMin,
						servings: recipeDto.servings,
						category: recipeDto.category,
						diet: recipeDto.diet,
						isPublic: recipeDto.isPublic,
						apiKey: { connect: { key: user.apiKey } },
						ingredients: {
							create: await Promise.all(
								recipeDto.ingredients.map(async (ingredient) => {
									if (ingredient.id) {
										return {
											quantity: ingredient.quantity,
											unit: ingredient.unit,
											ingredient: {
												connect: { id: ingredient.id }
											}
										};
									}

									return {
										quantity: ingredient.quantity,
										unit: ingredient.unit,
										ingredient: {
											connectOrCreate: {
												where: { name: ingredient.name! },
												create: { name: ingredient.name! }
											}
										}
									};
								})
							)
						}
					},
					include: {
						ingredients: {
							include: {
								ingredient: true
							}
						}
					}
				});

				return {
					id: createdRecipe.id,
					title: createdRecipe.title,
					description: createdRecipe.description,
					instructions: createdRecipe.instructions,
					imageUrl: createdRecipe.imageUrl,
					prepTimeMin: createdRecipe.prepTimeMin,
					cookTimeMin: createdRecipe.cookTimeMin,
					servings: createdRecipe.servings,
					category: createdRecipe.category,
					diet: createdRecipe.diet,
					isPublic: createdRecipe.isPublic,
					createdAt: createdRecipe.createdAt,
					updatedAt: createdRecipe.updatedAt,
					mealCount: 0,
					ingredients: createdRecipe.ingredients.map(ri => ({
						id: ri.ingredient.id,
						name: ri.ingredient.name,
						quantity: ri.quantity,
						unit: ri.unit as UnitType
					}))
				};
			} catch (error) {
				console.log("Error saving recipe:", error);
				throw new AppError(
					"Internal Server Error",
					"An error occurred while saving recipe",
					"Une erreur est survenue lors de la sauvegarde d'une recette.",
					"error",
				);
			}
		},
		async list(
			limit: number,
			offset: number,
			filters: IRecipeFilters,
		): Promise<ListRecipesOutput> {
			const where: Prisma.RecipeWhereInput = {
				...(filters.category && {
					category: filters.category as RecipeCategory,
				}),
				...(filters.diet && { diet: filters.diet as DietType }),
				...(filters.ingredients && {
					ingredients: {
						some: {
							ingredientId: {
								in: filters.ingredients,
							},
						},
					},
				}),
				AND: [
					...(filters.search
						? [
							{
								OR: [
									{ title: { contains: filters.search } },
									{ description: { contains: filters.search } },
								],
							},
						]
						: []),

					...(user.role.toLowerCase() !== "admin"
						? [
							{
								OR: [
									{ isPublic: true },
									...(user.role.toLowerCase() === "user" ? [{ apiKeyId: user.apiKeyId }] : []),
								],
							},
						]
						: []),
				],
			};

			console.dir(where, { depth: null })

			const [recipes, total] = await Promise.all([
				prisma.recipe.findMany({
					where,
					skip: offset,
					take: limit,
					orderBy: { createdAt: "desc" },
					include: {
						ingredients: {
							include: {
								ingredient: true,
							},
						},
						_count: {
							select: { recipeMeals: true },
						},
					},
				}),
				prisma.recipe.count({ where }),
			]);

			const data = recipes.map((recipe) => ({
				id: recipe.id,
				title: recipe.title,
				description: recipe.description || "",
				imageUrl: recipe.imageUrl,
				prepTimeMin: recipe.prepTimeMin || 0,
				cookTimeMin: recipe.cookTimeMin || 0,
				servings: recipe.servings,
				isPublic: recipe.isPublic,
				category: recipe.category || "OTHER",
				diet: recipe.diet || "OTHER",
				ingredients: recipe.ingredients.map((recipeIngredient) => ({
					id: recipeIngredient.ingredient.id,
					name: recipeIngredient.ingredient.name,
					quantity: recipeIngredient.quantity,
					unit: recipeIngredient.unit,
				})),
				mealCount: recipe._count.recipeMeals,
				createdAt: recipe.createdAt,
				updatedAt: recipe.updatedAt,
			}));

			return {
				recipes: data,
				meta: {
					total,
					offset,
					limit,
				},
			};
		},

		async findById(recipeDto: GetRecipeByIdDto): Promise<RecipeDetailDto> { 
			const whereCondition: Prisma.RecipeWhereInput = {
				id: recipeDto.id,
				...(user.role.toLowerCase() === "user" ? {
					OR: [
						{ apiKeyId: user.apiKeyId },
						{ isPublic: true }
					]
				} : {})
			};

			const recipe = await prisma.recipe.findFirst({
				where: whereCondition,
				include: {
					ingredients: {
						include: {
							ingredient: true,
						},
					},
					_count: {
						select: { recipeMeals: true },
					},
				},
			});

			if (!recipe) {
				throw new AppError(
					"Not Found",
					"Recipe not found",
					"Recette non trouvée.",
					"warn",
				);
			}

			return {
				id: recipe.id,
				title: recipe.title,
				description: recipe.description || "",
				imageUrl: recipe.imageUrl,
				prepTimeMin: recipe.prepTimeMin || 0,
				cookTimeMin: recipe.cookTimeMin || 0,
				servings: recipe.servings,
				isPublic: recipe.isPublic,
				category: recipe.category || "OTHER",
				diet: recipe.diet || "OTHER",
				ingredients: recipe.ingredients.map((recipeIngredient) => ({
					id: recipeIngredient.ingredient.id,
					name: recipeIngredient.ingredient.name,
					quantity: recipeIngredient.quantity,
					unit: recipeIngredient.unit,
					notes: recipeIngredient.notes || "",
					category: recipeIngredient.ingredient.category || "",
					calories: recipeIngredient.ingredient.calories || 0,
					proteins: recipeIngredient.ingredient.proteins || 0,
					fats: recipeIngredient.ingredient.fats || 0,
					carbs: recipeIngredient.ingredient.carbs || 0,
				})),
				mealCount: recipe._count.recipeMeals,
				createdAt: recipe.createdAt,
				updatedAt: recipe.updatedAt,
				instructions: recipe.instructions,
			};
		}
	};
};
