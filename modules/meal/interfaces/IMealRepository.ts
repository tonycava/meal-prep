import { CreateMealDto } from "../dto/createMealDto";
import { Meal } from "../entities/Meal";
import { DeleteMealDto } from "../dto/deleteMealDto";
import { UpdateMealDto } from "../dto/updateMealDto";
import { GetMealByIdOutput, IMealFilters, ListMealsOutput } from "../dto/mealDto";

export type IMealRepositorySave = {
  save(mealDto: CreateMealDto, apiKey: string): Promise<Meal>;
}

export type IMealRepositoryList = {
  list(limit: number, offset: number, filters: IMealFilters, apiKey: string): Promise<ListMealsOutput>;
}

export type IMealRepositoryFindById = {
  findById(id: string, apiKey: string): Promise<GetMealByIdOutput>;
}

export type IMealRepositoryDelete = {
  delete(mealDto: DeleteMealDto): Promise<void>;
}

export type IMealRepositoryUpdate = {
  update(mealDto: UpdateMealDto): Promise<void>;
}

export type IMealRepository =
  IMealRepositorySave &
  IMealRepositoryDelete &
  IMealRepositoryList &
  IMealRepositoryUpdate &
  IMealRepositoryFindById;
