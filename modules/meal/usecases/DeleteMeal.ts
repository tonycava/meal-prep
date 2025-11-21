import { InputFactory, OutputFactory, UseCase, UseCaseResponseBuilder } from "../../../lib/common/usecase";
import { IMealRepositoryDelete } from "../interfaces/IMealRepository";
import { tryCatch } from "../../../lib/errors/tryCatch";
import { DeleteMealDto } from "../dto/deleteMealDto";

type Input = InputFactory<
  {dto: DeleteMealDto},
  { mealRepository: IMealRepositoryDelete }
>;
type Output = OutputFactory<boolean>;

export const DeleteMealUseCase: UseCase<Input, Output> = (dependencies) => {
  const { mealRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error] = await tryCatch(mealRepository.delete(data.dto.id));
      if (error) return UseCaseResponseBuilder.error(500, error.userFriendlyMessage);

      return UseCaseResponseBuilder.success(200, true);
    },
  };
};
