export type RecipeIngredient = {
  id: string;
  quantity: number;
  unit: string;
}


export type Recipe = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  prepTimeMin: number | null;
  cookTimeMin: number | null;
  instructions: string | null;
  category: string | null;
  diet: string | null;
  servings: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type RecipeWithIngredients = Recipe & {
  recipeIngredients: RecipeIngredient[];
}