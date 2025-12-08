import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "$lib/common/usecase";
import { IMenuRepositoryGetOne } from "../interfaces/IMenuRepository";
import { tryCatch } from "$lib/errors/tryCatch";
import { HttpCode } from "$lib/common/api/HttpCode";
import { GetMenuByIdOutput } from "../dto/menuDto";

type Input = InputFactory<
  { id: string },
  { menuRepository: IMenuRepositoryGetOne }
>;
type Output = OutputFactory<GetMenuByIdOutput>;

export const GetMenuUseCase: UseCase<Input, Output> = (dependencies) => {
  const { menuRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, menu] = await tryCatch(menuRepository.getOne(data.id));

      if (error) {
        return UseCaseResponseBuilder.error(
          HttpCode.INTERNAL_SERVER_ERROR,
          error.userFriendlyMessage,
        );
      }

      if (!menu) {
        return UseCaseResponseBuilder.error(
          HttpCode.NOT_FOUND,
          "Menu non trouvé.",
        );
      }

      return UseCaseResponseBuilder.success(HttpCode.OK, { menu });
    },
  };
};
