import { InputFactory, OutputFactory, UseCase, UseCaseResponseBuilder } from "$lib/common/usecase";
import { ListMenusOutput } from "../dto/menu.dto";
import { IMenuRepositoryList } from "../interfaces/IMenuRepository";
import { tryCatch } from "$lib/errors/tryCatch";

type Input = InputFactory<
  { per_page: number; page: number },
  { menuRepository: IMenuRepositoryList }
>;
type Output = OutputFactory<ListMenusOutput>;

export const ListMenusUseCase: UseCase<Input, Output> = (dependencies) => {
  const { menuRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, result] = await tryCatch(menuRepository.list(data.per_page, data.page));
      if (error) return UseCaseResponseBuilder.error(500, error.userFriendlyMessage);

      return UseCaseResponseBuilder.success(200, result);
    }
  };
};