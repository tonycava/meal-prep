export type Ingredient = {
  id: string;
  name: string;
  category?: string;
  proteins: number;
  fats: number;
  carbs: number;
  sugars: number;
  fiber: number;
  salt: number;
  calories: number;
  createdAt: Date;
  updatedAt: Date;
};

export type IngredientWithQuantityAndUnit = Ingredient & {
  quantity: number;
  unit: string;
};
