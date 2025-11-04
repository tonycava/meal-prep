import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
	console.log('🌱 Début du seeding...');

	// 1. Créer des API Keys
	const apiKey1 = await prisma.apiKey.create({
		data: {
			key: 'test-api-key-123',
			name: 'API Key de test',
			isActive: true
		}
	});

	console.log('✅ API Key créée');

	// 2. Créer des ingrédients
	const flour = await prisma.ingredient.create({
		data: {
			name: 'Farine de blé',
			category: 'GRAIN',
			proteins: 10.3,
			fats: 1.2,
			carbs: 72.5,
			sugars: 0.3,
			fiber: 2.7,
			salt: 0.01,
			calories: 364
		}
	});

	const sugar = await prisma.ingredient.create({
		data: {
			name: 'Sucre blanc',
			category: 'OTHER',
			proteins: 0,
			fats: 0,
			carbs: 99.8,
			sugars: 99.8,
			fiber: 0,
			salt: 0,
			calories: 387
		}
	});

	const butter = await prisma.ingredient.create({
		data: {
			name: 'Beurre doux',
			category: 'DAIRY',
			proteins: 0.9,
			fats: 82,
			carbs: 0.1,
			sugars: 0.1,
			fiber: 0,
			salt: 0.01,
			calories: 717
		}
	});

	const eggs = await prisma.ingredient.create({
		data: {
			name: 'Œufs',
			category: 'DAIRY',
			proteins: 12.6,
			fats: 10.6,
			carbs: 0.7,
			sugars: 0.4,
			fiber: 0,
			salt: 0.14,
			calories: 143
		}
	});

	const apple = await prisma.ingredient.create({
		data: {
			name: 'Pommes',
			category: 'FRUIT',
			proteins: 0.3,
			fats: 0.2,
			carbs: 14,
			sugars: 10.4,
			fiber: 2.4,
			salt: 0.001,
			calories: 52
		}
	});

	const chicken = await prisma.ingredient.create({
		data: {
			name: 'Blanc de poulet',
			category: 'MEAT',
			proteins: 31,
			fats: 3.6,
			carbs: 0,
			sugars: 0,
			fiber: 0,
			salt: 0.07,
			calories: 165
		}
	});

	const tomato = await prisma.ingredient.create({
		data: {
			name: 'Tomates',
			category: 'VEGETABLE',
			proteins: 0.9,
			fats: 0.2,
			carbs: 3.9,
			sugars: 2.6,
			fiber: 1.2,
			salt: 0.005,
			calories: 18
		}
	});

	const rice = await prisma.ingredient.create({
		data: {
			name: 'Riz basmati',
			category: 'GRAIN',
			proteins: 7.1,
			fats: 0.7,
			carbs: 78,
			sugars: 0.1,
			fiber: 1.3,
			salt: 0.01,
			calories: 349
		}
	});

	console.log('✅ 8 ingrédients créés');

	// 3. Ajouter des minéraux et vitamines aux ingrédients
	await prisma.ingredientMineral.createMany({
		data: [
			{ ingredientId: flour.id, mineralType: 'CALCIUM', value: 15 },
			{ ingredientId: flour.id, mineralType: 'IRON', value: 1.2 },
			{ ingredientId: eggs.id, mineralType: 'CALCIUM', value: 56 },
			{ ingredientId: eggs.id, mineralType: 'IRON', value: 1.75 },
			{ ingredientId: apple.id, mineralType: 'POTASSIUM', value: 107 }
		]
	});

	await prisma.ingredientVitamin.createMany({
		data: [
			{ ingredientId: eggs.id, vitaminType: 'VITAMIN_A', value: 160 },
			{ ingredientId: eggs.id, vitaminType: 'VITAMIN_D', value: 2 },
			{ ingredientId: apple.id, vitaminType: 'VITAMIN_C', value: 4.6 },
			{ ingredientId: tomato.id, vitaminType: 'VITAMIN_C', value: 13.7 },
			{ ingredientId: tomato.id, vitaminType: 'VITAMIN_A', value: 42 }
		]
	});

	console.log('✅ Minéraux et vitamines ajoutés');

	// 4. Créer des recettes
	const tartePommes = await prisma.recipe.create({
		data: {
			title: 'Tarte aux pommes classique',
			description: 'Une délicieuse tarte aux pommes maison avec une pâte brisée croustillante',
			category: 'DESSERT',
			diet: 'VEGETARIAN',
			prepTimeMin: 30,
			cookTimeMin: 45,
			servings: 8,
			isPublic: true,
			imageUrl: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9',
			apiKeyId: apiKey1.id,
			steps: {
				create: [
					{
						order: 1,
						instruction: 'Préparer la pâte brisée en mélangeant la farine, le beurre et un peu d\'eau froide',
						durationMin: 10
					},
					{
						order: 2,
						instruction: 'Laisser reposer la pâte au frais pendant 30 minutes',
						durationMin: 30
					},
					{
						order: 3,
						instruction: 'Éplucher et couper les pommes en lamelles',
						durationMin: 10
					},
					{
						order: 4,
						instruction: 'Étaler la pâte dans un moule et disposer les pommes',
						durationMin: 5
					},
					{
						order: 5,
						instruction: 'Saupoudrer de sucre et enfourner à 180°C pendant 45 minutes',
						durationMin: 45
					}
				]
			},
			ingredients: {
				create: [
					{
						ingredientId: flour.id,
						quantity: 250,
						unit: 'GRAM',
						notes: 'Farine type 45 ou 55'
					},
					{
						ingredientId: butter.id,
						quantity: 125,
						unit: 'GRAM',
						notes: 'Beurre froid coupé en dés'
					},
					{
						ingredientId: sugar.id,
						quantity: 100,
						unit: 'GRAM'
					},
					{
						ingredientId: apple.id,
						quantity: 800,
						unit: 'GRAM',
						notes: 'Environ 5-6 pommes'
					},
					{
						ingredientId: eggs.id,
						quantity: 1,
						unit: 'PIECE',
						notes: 'Pour dorer la pâte'
					}
				]
			}
		}
	});

	const pouletRiz = await prisma.recipe.create({
		data: {
			title: 'Poulet grillé avec riz basmati',
			description: 'Blanc de poulet mariné et grillé, servi avec du riz parfumé',
			category: 'MAIN_COURSE',
			diet: 'GLUTEN_FREE',
			prepTimeMin: 15,
			cookTimeMin: 25,
			servings: 4,
			isPublic: true,
			imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6',
			apiKeyId: apiKey1.id,
			steps: {
				create: [
					{
						order: 1,
						instruction: 'Faire mariner le poulet avec des épices pendant 30 minutes',
						durationMin: 30
					},
					{
						order: 2,
						instruction: 'Cuire le riz basmati selon les instructions du paquet',
						durationMin: 15
					},
					{
						order: 3,
						instruction: 'Griller le poulet à feu moyen pendant 6-7 minutes de chaque côté',
						durationMin: 15
					},
					{
						order: 4,
						instruction: 'Servir le poulet avec le riz et des légumes',
						durationMin: 2
					}
				]
			},
			ingredients: {
				create: [
					{
						ingredientId: chicken.id,
						quantity: 600,
						unit: 'GRAM',
						notes: '4 blancs de poulet'
					},
					{
						ingredientId: rice.id,
						quantity: 300,
						unit: 'GRAM',
						notes: 'Riz basmati sec'
					}
				]
			}
		}
	});

	const saladeCesar = await prisma.recipe.create({
		data: {
			title: 'Salade César au poulet',
			description: 'La célèbre salade César avec poulet grillé, croûtons et parmesan',
			category: 'APPETIZER',
			prepTimeMin: 20,
			cookTimeMin: 10,
			servings: 4,
			isPublic: true,
			imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
			apiKeyId: apiKey1.id,
			steps: {
				create: [
					{
						order: 1,
						instruction: 'Griller les blancs de poulet et les couper en lamelles',
						durationMin: 10
					},
					{
						order: 2,
						instruction: 'Préparer la sauce césar',
						durationMin: 5
					},
					{
						order: 3,
						instruction: 'Mélanger la salade avec la sauce, ajouter le poulet et les croûtons',
						durationMin: 5
					}
				]
			},
			ingredients: {
				create: [
					{
						ingredientId: chicken.id,
						quantity: 400,
						unit: 'GRAM'
					}
				]
			}
		}
	});

	console.log('✅ 3 recettes créées avec leurs étapes et ingrédients');

	// 5. Créer des menus
	const menuSemaine = await prisma.menu.create({
		data: {
			name: 'Menu de la semaine',
			description: 'Menu équilibré pour 7 jours',
			apiKeyId: apiKey1.id,
			meals: {
				create: [
					{
						recipeId: saladeCesar.id,
						mealType: 'LUNCH',
						dayNumber: 1,
						order: 1
					},
					{
						recipeId: pouletRiz.id,
						mealType: 'DINNER',
						dayNumber: 1,
						order: 1
					},
					{
						recipeId: tartePommes.id,
						mealType: 'SNACK',
						dayNumber: 2,
						order: 1
					},
					{
						recipeId: pouletRiz.id,
						mealType: 'LUNCH',
						dayNumber: 3,
						order: 1
					}
				]
			}
		}
	});

	console.log('✅ Menu créé avec 4 repas');

	console.log('\n🎉 Seeding terminé avec succès !');
}

main()
	.catch((e) => {
		console.error('❌ Erreur lors du seeding :', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});