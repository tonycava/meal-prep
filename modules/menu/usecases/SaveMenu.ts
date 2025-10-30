import { InputFactory, OutputFactory, UseCase, UseCaseResponseBuilder } from "$lib/common/usecase";
import { CreateMenuDto } from "../dto/createMenu.dto";
import { IMenuRepositorySave, MenuWithMeals } from "../interfaces/IMenuRepository";
import { tryCatch } from "$lib/errors/tryCatch";

type Input = InputFactory<
  { dto: CreateMenuDto; apiKey: string },
  { menuRepository: IMenuRepositorySave }
>;
type Output = OutputFactory<MenuWithMeals>;

export const SaveMenuUseCase: UseCase<Input, Output> = (dependencies) => {
  const { menuRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, menu] = await tryCatch(menuRepository.save(data.dto, data.apiKey));
      if (error) return UseCaseResponseBuilder.error(500, error.userFriendlyMessage);

      return UseCaseResponseBuilder.success(201, menu);
    }
  };
};