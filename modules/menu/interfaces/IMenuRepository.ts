import { Menu } from "../entities/Menu";
import { ListMenusOutput } from "../dto/menu.dto";

export type MenuWithItems = Menu & {
  items: {
    id: string;
    recipeId: string;
    mealType: string;
    order: number;
    dayNumber: number;
    recipe: {
      id: string;
      title: string;
      description: string | null;
      imageUrl: string | null;
    };
  }[];
};

export type CreateMenuDto = {
  name: string;
  description?: string;
  items: {
    recipeId: string;
    mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
    dayNumber: number;
    order: number;
  }[];
};

export type UpdateMenuDto = {
  name?: string;
  description?: string;
  items?: {
    recipeId: string;
    mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
    dayNumber: number;
    order: number;
  }[];
};

export type IMenuRepositoryList = {
  list(limit: number, offset: number): Promise<ListMenusOutput>;
};

export type IMenuRepositorySave = {
  save(menuDto: CreateMenuDto, apiKey: string): Promise<Menu>;
};

export type IMenuRepositoryFindById = {
  findById(id: string): Promise<MenuWithItems | null>;
};

export type IMenuRepositoryUpdate = {
  update(id: string, menuDto: UpdateMenuDto): Promise<Menu>;
};

export type IMenuRepositoryDelete = {
  delete(id: string): Promise<void>;
};

export type IMenuRepository = IMenuRepositoryList &
  IMenuRepositorySave &
  IMenuRepositoryFindById &
  IMenuRepositoryUpdate &
  IMenuRepositoryDelete;