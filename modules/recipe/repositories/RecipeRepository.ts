import { IRecipeRepository } from "../interfaces/IRecipeRepository";
import { CreateRecipeDto } from "../dto/createRecipeDto";
import { RecipeQueryDto } from "../dto/recipeQueryDto";
import { RecipeDto } from "../dto/recipeDto";
import { Recipe } from "../entities/Recipe";
import { prisma } from "$lib/db";

export const RecipeRepository = (): IRecipeRepository => {
      return {
            async save(recipeDto: CreateRecipeDto, apiKey: string): Promise<Recipe> {
                  const createdRecipe = await prisma.recipe.create({
                        data: {
                              title: recipeDto.title,
                              description: recipeDto.description,
                              is_public: false,
                              prepTimeMin: recipeDto.prepTimeMin,
                              cookTimeMin: recipeDto.cookTimeMin,
                              image: recipeDto.image,
                              category: recipeDto.category,
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
            },

            async list(queryDto: RecipeQueryDto): Promise<{ data: Recipe[]; total: number }> {
                  const { limit, offset, search, category, diet } = queryDto;

                  const where: any = {
                        isPublic: true,
                  };

                  if (category) where.category = category;
                  if (diet) where.diet = diet;

                  if (search) {
                        where.OR = [
                              { title: { contains: search, mode: 'insensitive' } },
                              { description: { contains: search, mode: 'insensitive' } },
                        ];
                  }

                  const total = await prisma.recipe.count({ where });

                  const recipes = await prisma.recipe.findMany({
                        where,
                        skip: offset,
                        take: limit,
                        select: {
                              id: true,
                              title: true,
                              description: true,
                              imageUrl: true,
                              prepTimeMin: true,
                              cookTimeMin: true,
                              servings: true,
                              isPublic: true,
                              category: true,
                              diet: true,
                              createdAt: true,
                              updatedAt: true,
                        }
                  });

                  const data: RecipeDto[] = recipes.map(recipe => ({
                        id: recipe.id,
                        title: recipe.title,
                        description: recipe.description || "",
                        imageUrl: recipe.imageUrl,
                        prepTimeMin: recipe.prepTimeMin || 0,
                        cookTimeMin: recipe.cookTimeMin || 0,
                        servings: recipe.servings,
                        isPublic: recipe.isPublic,
                        category: recipe.category || 'OTHER' ,
                        diet: recipe.diet || 'OTHER',
                        createdAt: recipe.createdAt.toISOString(),
                        updatedAt: recipe.updatedAt.toISOString(),
                  }));

                  return { data, total };
            }
      }
}