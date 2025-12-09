import { CreateMealDto } from "../dto/createMealDto";
import { Meal } from "../entities/Meal";
import { DeleteMealDto } from "../dto/deleteMealDto";
import { UpdateMealDto } from "../dto/updateMealDto";
import {
  GetMealByIdOutput,
  IMealFilters,
  ListMealsOutput,
} from "../dto/mealDto";
import {
  GenerateMealOutput,
  IMealGenerationFilters,
} from "../dto/generateMealDto";

export type IMealRepositorySave = {
  save(mealDto: CreateMealDto): Promise<Meal>;
};

export type IMealRepositoryList = {
  list(
    limit: number,
    offset: number,
    role: string,
    filters: IMealFilters,
  ): Promise<ListMealsOutput>;
};

export type IMealRepositoryFindById = {
  findById(id: string): Promise<GetMealByIdOutput>;
};

export type IMealRepositoryDelete = {
  delete(mealDto: DeleteMealDto): Promise<void>;
};

export type IMealRepositoryUpdate = {
  update(mealDto: UpdateMealDto): Promise<Meal>;
};

export type IMealRepositoryGenerate = {
  generate(
    mealType: string | undefined,
    filters: IMealGenerationFilters,
  ): Promise<GenerateMealOutput>;
};

export type IMealRepository = IMealRepositorySave &
  IMealRepositoryDelete &
  IMealRepositoryList &
  IMealRepositoryUpdate &
  IMealRepositoryFindById &
  IMealRepositoryGenerate;
