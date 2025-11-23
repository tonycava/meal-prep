import { InputFactory, OutputFactory, UseCase, UseCaseResponseBuilder } from "../../../lib/common/usecase";
import { IMenuRepositoryDelete } from "../interfaces/IMenuRepository";
import { tryCatch } from "../../../lib/errors/tryCatch";
import { DeleteMenuDto } from "../dto/deleteMenu.dto";
import { StatusCode } from "../../../lib/helpers/http.helper";
import { HttpCode } from "$lib/common/api/HttpCode.ts";

type Input = InputFactory<
	{ dto: DeleteMenuDto },
	{ menuRepository: IMenuRepositoryDelete }
>;
type Output = OutputFactory<boolean>;

export const DeleteMenuUseCase: UseCase<Input, Output> = (dependencies) => {
	const { menuRepository } = dependencies;

	return {
		async execute(data): Promise<Output> {

			const [error] = await tryCatch(
				menuRepository.delete(data.dto),
			);
			if(error) {
				let status: StatusCode = HttpCode.INTERNAL_SERVER_ERROR;

				if(error.name === "Not Found") status = HttpCode.NOT_FOUND;
				if(error.name === "Forbidden") status = HttpCode.FORBIDDEN;
				if(error.name === "Conflict") status = HttpCode.CONFLICT;
				return UseCaseResponseBuilder.error(status, error.userFriendlyMessage);
			}

			return UseCaseResponseBuilder.success(HttpCode.OK, true);
		}
	}
}