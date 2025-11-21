import { InputFactory, OutputFactory, UseCase, UseCaseResponseBuilder } from "../../../lib/common/usecase";
import { IMenuRepositoryDelete } from "../interfaces/IMenuRepository";
import { tryCatch } from "../../../lib/errors/tryCatch";
import { DeleteMenuDto } from "../dto/deleteMenu.dto";
import { StatusCode } from "../../../lib/helpers/http.helper";

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
				menuRepository.delete(data.dto)
			);
			if(error) {
				let status: StatusCode = 500;

				if(error.name === "Not Found") status = 404;
				if(error.name === "Forbidden") status = 403;
				if(error.name === "Conflict") status = 409;

				return UseCaseResponseBuilder.error(status, error.userFriendlyMessage);
			}

			return UseCaseResponseBuilder.success(200, true);
		}
	}
}