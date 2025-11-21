import { Menu } from "../entities/Menu";
import { ListMenusOutput } from "../dto/menu.dto";
import { DeleteMenuDto } from "$modules/menu/dto/deleteMenu.dto"
import { CreateMenuPartialDtoWithId } from "$modules/menu/dto/createMenu.dto.ts";

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
    apiKey: string,
    role: string,
  ): Promise<ListMenusOutput>;
};

export type IMenuRepositorySave = {
  save(menuDto: CreateMenuDto, apiKey: string): Promise<Menu>;
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

export type IMenuRepository =
  IMenuRepositoryList &
  IMenuRepositorySave &
  IMenuRepositoryGetOne &
  IMenuRepositoryUpdate &
  IMenuRepositoryDelete;
