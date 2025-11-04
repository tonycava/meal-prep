export type Recipe = {
	id: string;
	title: string;
	description: string;
	imageUrl: string | null;
	prepTimeMin: number;
	cookTimeMin: number;
	servings: number;
	isPublic: boolean;
	createdAt: Date;
	updatedAt: Date;
}
