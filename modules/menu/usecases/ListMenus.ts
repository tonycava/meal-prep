import { InputFactory, OutputFactory, UseCase, UseCaseResponseBuilder } from "$lib/common/usecase";
import { ListMenusOutput } from "../dto/menu.dto";
import { IMenuRepositoryList } from "../interfaces/IMenuRepository";
import { tryCatch } from "$lib/errors/tryCatch";

type Input = InputFactory<
  { limit: number; offset: number; apiKey: string; role: string },
  { menuRepository: IMenuRepositoryList }
>;
type Output = OutputFactory<ListMenusOutput>;

export const ListMenusUseCase: UseCase<Input, Output> = (dependencies) => {
  const { menuRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, result] = await tryCatch(menuRepository.list(data.limit, data.offset, data.apiKey, data.role));
      if (error) return UseCaseResponseBuilder.error(500, error.userFriendlyMessage);

      return UseCaseResponseBuilder.success(200, result);
    }
  };
};