import { DietType, RecipeCategory, UnitType } from "src/generated/prisma";

export type RecipeIngredients = {
	id: string,
	name: string,
	quantity: number,
	unit: UnitType
}

export type Recipe = {
	id: string;
	title: string;
	description: string;
	instructions: string;
	imageUrl: string | null;
	prepTimeMin: number | null;
	cookTimeMin: number | null;
	servings: number;
	category: RecipeCategory | null;
	diet: DietType | null;
	isPublic: boolean;
	createdAt: Date;
	updatedAt: Date;
	mealCount: number | 0;
	ingredients: RecipeIngredients
};
