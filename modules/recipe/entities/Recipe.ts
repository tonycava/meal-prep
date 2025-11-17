export type Recipe = {
	id: string;
	title: string;
	description: string | null;
	imageUrl: string | null;
	prepTimeMin: number | null;
	cookTimeMin: number | null;
	servings: number;
	isPublic: boolean;
	createdAt: Date;
	updatedAt: Date;
}
