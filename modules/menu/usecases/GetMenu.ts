import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "$lib/common/usecase";
import { IMenuRepositoryGetOne } from "../interfaces/IMenuRepository";
import { tryCatch } from "$lib/errors/tryCatch";
import { Menu } from "../entities/Menu";

type Input = InputFactory<
  { id: string },
  { menuRepository: IMenuRepositoryGetOne }
>;
type Output = OutputFactory<Menu | null>;
export const ListMenusUseCase: UseCase<Input, Output> = (dependencies) => {
  const { menuRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, result] = await tryCatch(menuRepository.getOne(data.id));
      if (error)
        return UseCaseResponseBuilder.error(500, error.userFriendlyMessage);

      return UseCaseResponseBuilder.success(200, result);
    },
  };
};
