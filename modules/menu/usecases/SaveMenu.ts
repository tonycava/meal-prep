import {
  InputFactory,
  OutputFactory,
  UseCase,
  UseCaseResponseBuilder,
} from "$lib/common/usecase";
import { CreateMenuDto } from "../dto/createMenu.dto";
import { IMenuRepositorySave } from "../interfaces/IMenuRepository";
import { tryCatch } from "$lib/errors/tryCatch";
import { Menu } from "$modules/menu/entities/Menu.ts";
import { HttpCode } from "$lib/common/api/HttpCode.ts";

type Input = InputFactory<
  { dto: CreateMenuDto; apiKey: string },
  { menuRepository: IMenuRepositorySave }
>;
type Output = OutputFactory<Menu>;

export const SaveMenuUseCase: UseCase<Input, Output> = (dependencies) => {
  const { menuRepository } = dependencies;
  return {
    async execute(data): Promise<Output> {
      const [error, menu] = await tryCatch(
        menuRepository.save(data.dto, data.apiKey),
      );
      if (error)
        return UseCaseResponseBuilder.error(
          HttpCode.BAD_REQUEST,
          "The meal provided for this menu does not exist",
        );

      return UseCaseResponseBuilder.success(HttpCode.CREATED, menu);
    },
  };
};
