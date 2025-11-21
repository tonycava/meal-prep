import {
  CreateIngredientDtoType,
  UpdateIngredientDtoType,
  IngredientResponseDtoType,
} from "../dto/ingredient.dto";

export type IIngredientRepositoryCreate = {
  create(
    ingredientDto: CreateIngredientDtoType,
  ): Promise<IngredientResponseDtoType>;
};

export type IIngredientRepositoryUpdate = {
  update(
    id: string,
    ingredientDto: UpdateIngredientDtoType,
  ): Promise<IngredientResponseDtoType | null>;
};

export type IIngredientRepositoryDelete = {
  delete(id: string): Promise<boolean>;
};

export type IIngredientRepositorySearch = {
  searchByName(name: string): Promise<IngredientResponseDtoType[]>;
};

export type IIngredientRepositoryGetById = {
  getById(id: string): Promise<IngredientResponseDtoType | null>;
};

export type IIngredientRepository = IIngredientRepositoryCreate &
  IIngredientRepositoryUpdate &
  IIngredientRepositoryDelete &
  IIngredientRepositoryGetById &
  IIngredientRepositorySearch;
