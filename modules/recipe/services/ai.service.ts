import { NutritionalInfo } from "../entities/Nutrition";
import { IngredientWithQuantityAndUnit } from "../../ingredient/entities/Ingredient";
import { generateObject } from "ai";
import { openrouter } from "$lib/openrouter.ts";
import { nutritionalInfoSchema } from "$modules/recipe/dto/nutritionalInfoSchemaDto.ts";

const generateNutritionFacts = async (
  ingredients: IngredientWithQuantityAndUnit[],
): Promise<NutritionalInfo | null> => {
  const lines = ingredients
    .map(
      (ing) =>
        `${ing.name},${ing.category},${ing.proteins},${ing.fats},${ing.carbs},${ing.sugars},${ing.fiber},${ing.salt},${ing.calories}`,
    )
    .join("\n");

  const ingredientList = ingredients.map((ing) => ({
    ingredient: ing.name,
    quantity: ing.quantity,
    unit: ing.unit,
  }));

  const response = await generateObject({
    model: openrouter("google/gemini-2.0-flash-001"),
    prompt: `
    You are a nutrition extraction and matching expert.

Your task:
1. Take a list of recipe ingredients from the user.
2. Take a list of ingredient entries from the user’s database.
3. Match each recipe ingredient to the closest database ingredient (case-insensitive).
4. If no match is found, you must fall back to Ciqual 2020 matching using the reference document provided.
5. Compute nutritional values using the database values (preferred) or Ciqual values (fallback).
6. Output one JSON object per recipe ingredient.

------------------------------------------------------------
DATABASE INGREDIENT FORMAT
------------------------------------------------------------
Each database line uses this CSV structure:

name,category,proteins,fats,carbs,sugars,fiber,salt,calories

Database lines :
${lines}

Important:
- All nutritional values represent nutrients per 100 g.
- Use these values directly if a name match is found.
- Matching is case-insensitive and whitespace-insensitive.
- If no database match exists, switch to Ciqual procedure.

------------------------------------------------------------
RECIPE INGREDIENTS INPUT
------------------------------------------------------------

${JSON.stringify(ingredientList, null, 2)}

------------------------------------------------------------
QUANTITY & UNIT CONVERSION RULES
------------------------------------------------------------
Ciqual and database values are per 100 g of food.

To convert to the actual ingredient quantity:

nutrient_value = (value_per_100g / 100) * ingredient_quantity_in_grams

Unit conversions:
- GRAM → quantity is already grams
- MILLILITER → assume density 1 g/mL unless the DB or Ciqual entry implies otherwise
- LITER → quantity * 1000
- TEASPOON (tsp) → 4 g
- TABLESPOON (tbsp) → 14 g
- CUP → 240 g

------------------------------------------------------------
CIQUAL FALLBACK RULES
------------------------------------------------------------
If the ingredient is not found in the database:
- Match the ingredient name to the closest Ciqual food name
- Interpret Ciqual values:
    "-" → null → treat as 0
    "traces" → 0.01
    "<X" → use X
- Use Ciqual nutrients per 100 g

All values must be rounded to 2 decimals.

------------------------------------------------------------
USER INPUT SECTION
------------------------------------------------------------
The user will provide:
1. recipeIngredients: list of ingredients with quantities and units
2. databaseIngredients: a list of database CSV lines

You must process them and return ONLY the final JSON array.
    `,
    schema: nutritionalInfoSchema,
  });

  return response.object;
};

export default { generateNutritionFacts };
