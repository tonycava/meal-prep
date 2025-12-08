import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "$lib/common/usecase";
import { IMenuRepositoryGetOne } from "../interfaces/IMenuRepository";
import { tryCatch } from "$lib/errors/tryCatch";
import { HttpCode } from "$lib/common/api/HttpCode";
import { Menu } from "../entities/Menu";

type Input = InputFactory<
  { id: string },
  { menuRepository: IMenuRepositoryGetOne }
>;
type Output = OutputFactory<Menu | null>;

export const GetMenuUseCase: UseCase<Input, Output> = (dependencies) => {
  const { menuRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, result] = await tryCatch(menuRepository.getOne(data.id));
      if (error)
        return UseCaseResponseBuilder.error(
          HttpCode.INTERNAL_SERVER_ERROR,
          error.userFriendlyMessage,
        );

      return UseCaseResponseBuilder.success(HttpCode.OK, result);
    },
  };
};
