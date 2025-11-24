import { IngredientListQueryDto } from "$modules/ingredient/dto/ingredient.dto";
import { endpointsFactory } from "$lib/common/endpointFactory.ts";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { ListIngredientsUseCase } from "$modules/ingredient/usecases/ListIngredients";
import { IngredientRepository } from "../repositories/IngredientRepository";
import { ApiResponse } from "$lib/common/api/ApiResponse";

export const ListIngredientsEndpoint = endpointsFactory
	.build({
		method: "get",
		input: IngredientListQueryDto,
		output: UseCaseResponseSchema,
		handler: async ({ input }) => {
			const { limit, offset, category, search } = input;

			const filters = {
				...(category && { category }),
				...(search && { search })
			};

			const response = await ListIngredientsUseCase({
				ingredientRepository: IngredientRepository()
			}).execute({
				limit,
				offset,
				filters: Object.keys(filters).length > 0 ? filters : undefined,
			})

			return ApiResponse.send(response);
			// const where: Prisma.IngredientWhereInput = {};

			// if (category) {
			// 	where.category = category;
			// }

			// if (search) {
			// 	where.name = {
			// 		contains: search,
			// 	};
			// }

			// const [ingredients, total] = await Promise.all([
			// 	prisma.ingredient.findMany({
			// 		where,
			// 		take: limit,
			// 		skip: offset,
			// 		orderBy: {
			// 			name: "asc",
			// 		},
			// 		include: {
			// 			minerals: true,
			// 			vitamins: true,
			// 		},
			// 	}),
			// 	prisma.ingredient.count({ where }),
			// ]);

			// logger.debug(
			// 	`Retrieved ${ingredients.length} ingredients out of ${total}`,
			// );

			// return {
			// 	ingredients,
			// 	total,
			// 	limit,
			// 	offset,
			// };
		},
	});
