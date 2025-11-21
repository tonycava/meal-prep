import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "$lib/common/usecase";
import { IMenuRepositoryUpdate } from "../interfaces/IMenuRepository";
import { tryCatch } from "$lib/errors/tryCatch";
import { HttpCode } from "$lib/common/api/HttpCode";
import { CreateMenuPartialDtoWithId } from "../dto/createMenu.dto";

type Input = InputFactory<
  { dto: CreateMenuPartialDtoWithId },
  { menuRepository: IMenuRepositoryUpdate }
>;
type Output = OutputFactory<boolean>;

export const UpdateMenuUseCase: UseCase<Input, Output> = (dependencies) => {
  const { menuRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error] = await tryCatch(menuRepository.update(data.dto));
      if (error)
        return UseCaseResponseBuilder.error(
          HttpCode.INTERNAL_SERVER_ERROR,
          error.userFriendlyMessage,
        );

      return UseCaseResponseBuilder.success(HttpCode.OK, true);
    },
  };
};
