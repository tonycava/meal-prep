import { Menu } from "../entities/Menu";
import { ListMenusOutput } from "../dto/menuDto";
import { DeleteMenuDto } from "$modules/menu/dto/deleteMenuDto"
import { CreateMenuPartialDtoWithId } from "$modules/menu/dto/createMenuDto";
import { GenerateMenuOutput, IMenuGenerationFilters } from "../dto/generateMenuDto";

export type CreateMenuDto = {
  name: string;
  description?: string;
  duration?: number;
  mealIds: {
    mealId: string;
    dayNumber: number;
  }[];
};

export type IMenuRepositoryList = {
  list(
    limit: number,
    offset: number,
    role: string,
  ): Promise<ListMenusOutput>;
};

export type IMenuRepositorySave = {
  save(menuDto: CreateMenuDto): Promise<Menu>;
};

export type IMenuRepositoryUpdate = {
  update(menuDto: CreateMenuPartialDtoWithId): Promise<void>;
};

export type IMenuRepositoryGetOne = {
  getOne(menuId: string): Promise<Menu | null>;
}

export type IMenuRepositoryDelete = {
  delete(menuDto: DeleteMenuDto): Promise<void>;
};

export type IMenuRepositoryGenerate = {
  generate(duration: number, filters: IMenuGenerationFilters): Promise<GenerateMenuOutput>;
};

export type IMenuRepository =
  IMenuRepositoryList &
  IMenuRepositorySave &
  IMenuRepositoryGetOne &
  IMenuRepositoryUpdate &
  IMenuRepositoryDelete &
  IMenuRepositoryGenerate;
