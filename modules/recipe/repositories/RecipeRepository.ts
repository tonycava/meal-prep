import { IRecipeRepository } from "../interfaces/IRecipeRepository";
import { CreateRecipeDto } from "../dto/createRecipeDto";
import { Recipe } from "../entities/Recipe";
import { prisma } from "$lib/db";
import { DeleteRecipeDto } from "$modules/recipe/dto/deleteRecipeDto.ts";
import { AppError } from "$lib/errors/AppError.ts";
import { ListRecipesOutput, IRecipeFilters } from "../dto/recipeDto";
import { DietType, RecipeCategory } from "@prisma/client";

export const RecipeRepository = (): IRecipeRepository => {
	return {
		async delete(recipeDto: DeleteRecipeDto): Promise<void> {
			try {
				await prisma.recipe.delete({
					where: { id_recipe: recipeDto.id },
				})
			} catch (error) {
				throw new AppError(
					"Internal Server Error",
					"An error occurred while deleting recipe",
					"Une erreur est survenue lors de la suppression d'une recette.",
					"error"
				)
			}
		},
		async save(recipeDto: CreateRecipeDto, apiKey: string): Promise<Recipe> {
			try {
				const createdRecipe = await prisma.recipe.create({
					data: {
						title: recipeDto.title,
						description: recipeDto.description,
						is_public: false,
						prepTimeMin: recipeDto.prepTimeMin,
						cookTimeMin: recipeDto.cookTimeMin,
						image: recipeDto.image,
						apiKey: { connect: { key: apiKey } },
						ingredients: "",
					}
				});

				for (const ingredient of recipeDto.ingredients) {
					await prisma.recipeIngredient.create({
						data: {
							quantity: ingredient.quantity,
							ingredient: { connect: { id_ingredient: ingredient.id } },
							recipe: { connect: { id_recipe: createdRecipe.id_recipe } }
						}
					})
				}

				return { id: createdRecipe.id_recipe }
			} catch (error) {
				throw new AppError(
					"Internal Server Error",
					"An error occurred while saving recipe",
					"Une erreur est survenue lors de la sauvegarde d'une recette.",
					"error"
				)
			}

		},
		async list(limit: number, offset: number, filters: IRecipeFilters): Promise<ListRecipesOutput> {

			const where = {
				...(filters.category && { category: filters.category  as RecipeCategory }),
				...(filters.diet && { diet: filters.diet as DietType}),
				...(filters.ingredients && {
					ingredients: {
						some: {
							ingredientId: {
								in: filters.ingredients
							}
						}
					}
				}),
				...(filters.search && {
					OR: [
						{ title: { contains: filters.search, mode: 'insensitive' } },
						{ description: { contains: filters.search, mode: 'insensitive' } }
					]
				})
			};

			const [recipes, total] = await Promise.all([
				prisma.recipe.findMany({
					where,
					skip: offset,
					take: limit,
					orderBy: { createdAt: 'desc' },
					include: {
						ingredients: {
							include: {
								ingredient: true
							}
						},
						_count: {
							select: { meals: true }
						}
					}
				}),
				prisma.recipe.count({ where })
			]);

			const data = recipes.map(recipe => ({
				id: recipe.id,
				title: recipe.title,
				description: recipe.description || "",
				imageUrl: recipe.imageUrl ,
				prepTimeMin: recipe.prepTimeMin || 0,
				cookTimeMin: recipe.cookTimeMin || 0,
				servings: recipe.servings,
				isPublic: recipe.isPublic,
				category: recipe.category || 'OTHER',
				diet: recipe.diet || 'OTHER',
				ingredients: recipe.ingredients.map(recipeIngredient => ({
					id: recipeIngredient.ingredient.id,
					name: recipeIngredient.ingredient.name,
					quantity: recipeIngredient.quantity,
					unit: recipeIngredient.unit
				})),
				mealCount: recipe._count.meals,
				createdAt: recipe.createdAt,
				updatedAt: recipe.updatedAt,
			}));

			return { 
				recipes: data, 
				meta: {
					total,
					offset,
					limit
				}
			};
		}
	}
}