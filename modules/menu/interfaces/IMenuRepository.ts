import { Menu } from "../entities/Menu";
import { ListMenusOutput } from "../dto/menu.dto";

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

export type IMenuRepository = IMenuRepositoryList & IMenuRepositorySave;
