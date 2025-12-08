import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "$lib/common/usecase";
import { IMenuRepositoryUpdate } from "../interfaces/IMenuRepository";
import { tryCatch } from "$lib/errors/tryCatch";
import { HttpCode } from "$lib/common/api/HttpCode.ts";
import { CreateMenuPartialDtoWithId } from "../dto/createMenuDto";
import { Menu } from "../entities/Menu";

type Input = InputFactory<
  { dto: CreateMenuPartialDtoWithId },
  { menuRepository: IMenuRepositoryUpdate }
>;
type Output = OutputFactory<Menu>;

export const UpdateMenuUseCase: UseCase<Input, Output> = (dependencies) => {
  const { menuRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, menu] = await tryCatch(
        menuRepository.update(data.dto),
      );

      if (error) {
        // Check if it's a Not Found error
        if (error.name === "Not Found") {
          return UseCaseResponseBuilder.error(HttpCode.NOT_FOUND, error.userFriendlyMessage);
        }
        return UseCaseResponseBuilder.error(
          HttpCode.INTERNAL_SERVER_ERROR,
          error.userFriendlyMessage,
        );
      }

      if (!menu) {
        return UseCaseResponseBuilder.error(
          HttpCode.INTERNAL_SERVER_ERROR,
          "Error during menu update",
        );
      }

      return UseCaseResponseBuilder.success(HttpCode.OK, menu);
    },
  };
};
