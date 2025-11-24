import {
	CreateIngredientDtoType,
	UpdateIngredientDtoType,
	IngredientResponseDtoType,
	IIngredientFilters,
	ListIngredientsOutput
} from "../dto/ingredient.dto";

export type IIngredientRepositoryList = {
	list(
		limit: number,
		offset: number,
		filters: IIngredientFilters,
	): Promise<ListIngredientsOutput>;
}

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
	IIngredientRepositoryList &
	IIngredientRepositoryUpdate &
	IIngredientRepositoryDelete &
	IIngredientRepositoryGetById &
	IIngredientRepositorySearch;
