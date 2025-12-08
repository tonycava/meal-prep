import { IIngredientRepository } from "../interfaces/IIngredientRepository";
import { CreateIngredientDtoType, IngredientResponseDtoType, IIngredientFilters, ListIngredientsOutput } from "$modules/ingredient/dto/ingredient.dto";
import { PatchIngredientDtoType } from "$modules/ingredient/dto/patchIngredient.dto";
import { prisma } from "$lib/db";
import { IngredientCategory, Prisma } from "../../../generated/client"
import { AppError } from "$lib/errors/AppError";

export const IngredientRepository = (): IIngredientRepository => {
	return {
		async create(
			ingredientDto: CreateIngredientDtoType,
		): Promise<IngredientResponseDtoType> {
			try {
				const createdIngredient = await prisma.ingredient.create({
					data: {
						name: ingredientDto.name!,
						category: ingredientDto.category!,
						proteins: ingredientDto.proteins!,
						fats: ingredientDto.fats!,
						carbs: ingredientDto.carbs!,
						sugars: ingredientDto.sugars!,
						fiber: ingredientDto.fiber!,
						salt: ingredientDto.salt!,
						calories: ingredientDto.calories!,
						minerals: ingredientDto.minerals
							? {
								create: ingredientDto.minerals.map((mineral) => ({
									mineralType: mineral.mineralType,
									value: mineral.value,
								})),
							}
							: undefined,
						vitamins: ingredientDto.vitamins
							? {
								create: ingredientDto.vitamins.map((vitamin) => ({
									vitaminType: vitamin.vitaminType,
									value: vitamin.value,
								})),
							}
							: undefined,
					},
					include: {
						minerals: true,
						vitamins: true,
					},
				});

				return createdIngredient;
			} catch (error) {
				console.log("Error saving recipe:", error);
				throw new AppError(
					"Internal Server Error",
					"An error occurred while saving the menu.",
					"La création de l'ingrédient a échoué.",
					"error",
				);
			}
		},

		async list(
			limit: number,
			offset: number,
			filters: IIngredientFilters,
		): Promise<ListIngredientsOutput> {
			const where: Prisma.IngredientWhereInput = {
				...(filters.category && {
					category: filters.category as IngredientCategory,
				}),
				...(filters.search && {
					name: {
						contains: filters.search.toLowerCase(),
					},
				}),
			};

			console.dir(where, { depth: null })

			const [ingredients, total] = await Promise.all([
				prisma.ingredient.findMany({
					where,
					skip: offset,
					take: limit,
					orderBy: { createdAt: "desc" },
				}),
				prisma.ingredient.count({ where }),
			]);

			const data = ingredients.map((ingredient) => ({
				id: ingredient.id,
				name: ingredient.name,
				category: ingredient.category || "OTHER",
				proteins: ingredient.proteins,
				fats: ingredient.fats,
				carbs: ingredient.carbs,
				sugars: ingredient.sugars,
				fiber: ingredient.fiber,
				salt: ingredient.salt,
				calories: ingredient.calories,
				createdAt: ingredient.createdAt,
				updatedAt: ingredient.updatedAt,
			}));

			return {
				ingredients: data,
				meta: {
					total,
					offset,
					limit,
				},
			};
		},

		async update(
			ingredientDto: PatchIngredientDtoType,
		): Promise<IngredientResponseDtoType | null> {
			const dto = ingredientDto as PatchIngredientDtoType & { id: string };

			const existingIngredient = await prisma.ingredient.findUnique({
				where: {
					id: dto.id
				}
			});

			if (!existingIngredient) {
				return null;
			}

			const { id, minerals, vitamins, ...updateData } = dto;

			const prismaUpdateData: any = {
				...updateData,
			};

			if (minerals !== undefined) {
				prismaUpdateData.minerals = {
					deleteMany: {},
					create: minerals,
				};
			}

			if (vitamins !== undefined) {
				prismaUpdateData.vitamins = {
					deleteMany: {},
					create: vitamins,
				};
			}

			const updatedIngredient = await prisma.ingredient.update({
				where: { id },
				data: prismaUpdateData,
				include: {
					minerals: true,
					vitamins: true,
				},
			});
			return updatedIngredient as IngredientResponseDtoType;
		},

		async delete(id: string): Promise<boolean> {
			// Check if ingredient exists
			const existingIngredient = await prisma.ingredient.findUnique({
				where: { id },
			});
			if (!existingIngredient) {
				return false;
			}

			await prisma.ingredient.delete({
				where: { id },
			});
			return true;
		},

		async getById(id: string): Promise<IngredientResponseDtoType | null> {
			const ingredient = await prisma.ingredient.findUnique({
				where: { id },
				include: {
					minerals: true,
					vitamins: true,
				},
			});

			return ingredient;
		},

		async searchByName(name: string): Promise<IngredientResponseDtoType[]> {
			const ingredients = await prisma.ingredient.findMany({
				where: { name: { contains: name } },
				include: {
					minerals: true,
					vitamins: true,
				},
			});

			return ingredients;
		},
	};
};
