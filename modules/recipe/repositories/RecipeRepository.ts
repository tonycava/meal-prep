import { IRecipeRepository } from "../interfaces/IRecipeRepository";
import { CreateRecipeDto } from "../dto/createRecipeDto";
import { Recipe } from "../entities/Recipe";
import { prisma } from "$lib/db";
import { DeleteRecipeDto } from "$modules/recipe/dto/deleteRecipeDto.ts";
import { AppError } from "$lib/errors/AppError.ts";
import { ListRecipesOutput, IRecipeFilters, GetRecipeByIdOutput } from "../dto/recipeDto";
import { DietType, RecipeCategory } from "@prisma/client";
import { UpdateRecipeDto } from "$modules/recipe/dto/updateRecipeDto.ts";

export const RecipeRepository = (): IRecipeRepository => {
	return {
    async update(recipeDto: UpdateRecipeDto): Promise<void> {
      try {
        await prisma.recipe.update({
          data: {
            title: recipeDto.title,
          },
          where: { id: recipeDto.id }
        })
      } catch (error) {
        throw new AppError(
          "Internal Server Error",
          "An error occurred while updating recipe",
          "Une erreur est survenue lors de la mise à jour d'une recette.",
          "error"
        )
      }
    },
    async delete(recipeDto: DeleteRecipeDto): Promise<void> {
			try {
				await prisma.recipe.delete({
					where: { id: recipeDto.id },
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
						isPublic: false,
						prepTimeMin: recipeDto.prepTimeMin,
						cookTimeMin: recipeDto.cookTimeMin,
						apiKey: { connect: { key: apiKey } },
					}
				});

				for (const ingredient of recipeDto.ingredients) {
					await prisma.recipeIngredient.create({
						data: {
							quantity: ingredient.quantity,
							ingredient: { connect: { id: ingredient.id } },
							recipe: { connect: { id: createdRecipe.id } }
						}
					})
				}

				return {
          cookTimeMin: createdRecipe.cookTimeMin,
          createdAt: createdRecipe.createdAt,
          description: createdRecipe.description,
          imageUrl: createdRecipe.imageUrl,
          isPublic: createdRecipe.isPublic,
          prepTimeMin: createdRecipe.prepTimeMin,
          servings: createdRecipe.servings,
          title: createdRecipe.title,
          updatedAt: createdRecipe.updatedAt,
          id: createdRecipe.id
        }
			} catch (error) {
        console.log("Error saving recipe:", error);
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
				...(filters.category && { category: filters.category as RecipeCategory }),
				...(filters.diet && { diet: filters.diet as DietType }),
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
				imageUrl: recipe.imageUrl,
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
		},

		async findById(id: string): Promise<GetRecipeByIdOutput> {
			const recipe = await prisma.recipe.findUnique({
				where: { id },
				include: {
					ingredients: {
						include: {
							ingredient: true
						}
					},
					steps: {
						orderBy: { order: 'asc' }
					},
					_count: {
						select: { meals: true }
					}
				}
			});

			if(!recipe) {
				throw new AppError(
					"Not Found",
					"Recipe not found",
					"Recette non trouvée.",
					"warn"
				)
			};

		const recipeDetailDto = {
			id: recipe.id,
			title: recipe.title,
			description: recipe.description || "",
			imageUrl: recipe.imageUrl,
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
				unit: recipeIngredient.unit,
				notes: recipeIngredient.notes || "",
				category: recipeIngredient.ingredient.category || "",
				calories: recipeIngredient.ingredient.calories || 0,
				proteins: recipeIngredient.ingredient.proteins || 0,
				fats: recipeIngredient.ingredient.fats || 0,
				carbs: recipeIngredient.ingredient.carbs || 0,
			})),
			mealCount: recipe._count.meals,
			createdAt: recipe.createdAt,
			updatedAt: recipe.updatedAt,
			steps: recipe.steps.map(step => ({
				id: step.id,
				order: step.order,
				instruction: step.instruction,
				durationMin: step.durationMin,
			}))
		};

		return {
			recipe: recipeDetailDto,
		};
	}
}
}