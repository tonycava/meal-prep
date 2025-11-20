import { PrismaClient, IngredientCategory, RecipeCategory, DietType, MealType, UnitType, MineralType, VitaminType } from '../src/generated/prisma';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const prisma = new PrismaClient();

function getCategory(foodLabel: string): IngredientCategory {
	const label = foodLabel.toUpperCase();

	if (label.includes("BOEUF") || label.includes("VEAU") || label.includes("PORC") || label.includes("POULET") || label.includes("DINDE") || label.includes("JAMBON") || label.includes("SAUCISSE") || label.includes("VIANDE")) return IngredientCategory.MEAT;
	if (label.includes("SAUMON") || label.includes("THON") || label.includes("CABILLAUD") || label.includes("CREVETTE") || label.includes("POISSON") || label.includes("MOULE")) return IngredientCategory.FISH;
	if (label.includes("POMME") || label.includes("BANANE") || label.includes("ORANGE") || label.includes("FRAISE") || label.includes("FRUIT") || label.includes("RAISIN")) return IngredientCategory.FRUIT;
	if (label.includes("CAROTTE") || label.includes("TOMATE") || label.includes("SALADE") || label.includes("CHOU") || label.includes("HARICOT") || label.includes("EPINARD") || label.includes("LLEGUME")) return IngredientCategory.VEGETABLE;
	if (label.includes("LAIT") || label.includes("YAOURT") || label.includes("FROMAGE") || label.includes("CREME")) return IngredientCategory.DAIRY;
	if (label.includes("RIZ") || label.includes("PATES") || label.includes("PAIN") || label.includes("FARINE") || label.includes("BLE") || label.includes("QUINOA") || label.includes("CEREALE")) return IngredientCategory.GRAIN;
	if (label.includes("NOIX") || label.includes("AMANDE") || label.includes("NOISETTE") || label.includes("ARACHIDE")) return IngredientCategory.NUT;
	if (label.includes("HUILE") || label.includes("BEURRE") || label.includes("MARGARINE")) return IngredientCategory.OTHER;
	if (label.includes("SEL") || label.includes("POIVRE") || label.includes("EPICE") || label.includes("SAUCE")) return IngredientCategory.SPICE;

	return IngredientCategory.OTHER;
}

async function main() {
	console.log('🌱 Début du seeding global...');

	await prisma.menuMeal.deleteMany();
	await prisma.recipeMeal.deleteMany();
	await prisma.menu.deleteMany();
	await prisma.meal.deleteMany();
	await prisma.recipeIngredient.deleteMany();
	await prisma.recipeStep.deleteMany();
	await prisma.recipe.deleteMany();
	await prisma.ingredientMineral.deleteMany();
	await prisma.ingredientVitamin.deleteMany();
	await prisma.ingredient.deleteMany();
	await prisma.apiKey.deleteMany();

	console.log('🧹 Base de données nettoyée.');

	const adminKey = await prisma.apiKey.create({
		data: {
			key: '550e8400-e29b-41d4-a716-446655440000',
			name: 'Administrateur',
			role: 'admin',
			isActive: true
		}
	});

	const userKey = await prisma.apiKey.create({
		data: {
			key: 'd07c22dd-1b98-4741-96f3-23621895672e',
			name: 'Utilisateur Demo',
			role: 'user',
			isActive: true
		}
	});

	console.log('🔑 API Keys créées :');
	console.log('   👉 Admin Key : 550e8400-e29b-41d4-a716-446655440000');
	console.log('   👉 User Key  : d07c22dd-1b98-4741-96f3-23621895672e');

	console.log('📥 Importation des ingrédients depuis CALNUT.csv...');

	const csvFilePath = path.join(__dirname, '../CALNUT.csv');

	if (!fs.existsSync(csvFilePath)) {
		console.error("❌ ERREUR: Le fichier CALNUT.csv est introuvable dans le dossier racine !");
		process.exit(1);
	}

	const fileStream = fs.createReadStream(csvFilePath);
	const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

	let isFirstLine = true;
	let count = 0;

	for await (const line of rl) {
		if (isFirstLine) { isFirstLine = false; continue; }

		const row = line.split(';');
		if (row.length < 10) continue;

		const foodLabel = row[1];
		const parseVal = (val: string) => parseFloat(val?.replace(',', '.') || '0');

		const ingredientData = {
			name: foodLabel.substring(0, 100),
			category: getCategory(foodLabel),
			calories: parseVal(row[3]),
			proteins: parseVal(row[17]),
			carbs: parseVal(row[18]),
			sugars: parseVal(row[19]),
			fiber: parseVal(row[28]),
			fats: parseVal(row[29]),
			salt: parseVal(row[5]),
		};

		try {
			await prisma.ingredient.create({
				data: {
					...ingredientData,
					minerals: {
						create: [
							{ mineralType: MineralType.CALCIUM, value: parseVal(row[10]) },
							{ mineralType: MineralType.MAGNESIUM, value: parseVal(row[8]) },
							{ mineralType: MineralType.IRON, value: parseVal(row[12]) },
							{ mineralType: MineralType.POTASSIUM, value: parseVal(row[9]) },
							{ mineralType: MineralType.SODIUM, value: parseVal(row[6]) },
							{ mineralType: MineralType.ZINC, value: parseVal(row[14]) },
						].filter(m => m.value > 0)
					},
					vitamins: {
						create: [
							{ vitaminType: VitaminType.VITAMIN_C, value: parseVal(row[52]) },
							{ vitaminType: VitaminType.VITAMIN_D, value: parseVal(row[49]) },
							{ vitaminType: VitaminType.VITAMIN_E, value: parseVal(row[50]) },
							{ vitaminType: VitaminType.VITAMIN_K, value: parseVal(row[51]) },
							{ vitaminType: VitaminType.VITAMIN_B1, value: parseVal(row[53]) },
							{ vitaminType: VitaminType.VITAMIN_B12, value: parseVal(row[58]) },
						].filter(v => v.value > 0)
					}
				}
			});
			count++;
			if (count % 500 === 0) process.stdout.write('.');
		} catch (e) { }
	}
	console.log(`\n✅ ${count} Ingrédients importés.`);

	const findIng = async (term: string) => prisma.ingredient.findFirst({ where: { name: { contains: term } } });

	const poulet = await findIng("Poulet") || await findIng("Dinde");
	const riz = await findIng("Riz") || await findIng("Pâtes");
	const tomate = await findIng("Tomate");
	const salade = await findIng("Laitue") || await findIng("Epinard");
	const huile = await findIng("Huile") || await findIng("Beurre");

	let recipePouletId = "";

	if (poulet && riz) {

		const ingredientsList = [
			{ ingredientId: poulet.id, quantity: 200, unit: UnitType.GRAM },
			{ ingredientId: riz.id, quantity: 150, unit: UnitType.GRAM }
		];

		if (huile) {
			ingredientsList.push({ ingredientId: huile.id, quantity: 1, unit: UnitType.GRAM });
		}

		const recipe = await prisma.recipe.create({
			data: {
				title: "Poulet Riz Simple",
				description: "Un classique pour les sportifs.",
				imageUrl: "https://placehold.co/600x400?text=Poulet+Riz",
				prepTimeMin: 10,
				cookTimeMin: 20,
				servings: 2,
				isPublic: true,
				category: RecipeCategory.MAIN_COURSE,
				diet: DietType.GLUTEN_FREE,
				apiKeyId: adminKey.id,
				steps: {
					create: [
						{ order: 1, instruction: "Cuire le riz dans l'eau bouillante.", durationMin: 15 },
						{ order: 2, instruction: "Poêler le poulet.", durationMin: 10 }
					]
				},
				ingredients: {
					create: ingredientsList
				}
			}
		});
		recipePouletId = recipe.id;
		console.log("👨‍🍳 Recette créée : Poulet Riz");
	}

	let recipeSaladeId = "";
	if (salade && tomate) {
		const recipe = await prisma.recipe.create({
			data: {
				title: "Salade Légère",
				description: "Entrée fraîche.",
				prepTimeMin: 5,
				cookTimeMin: 0,
				servings: 1,
				isPublic: true,
				category: RecipeCategory.STARTER,
				diet: DietType.VEGETARIAN,
				apiKeyId: userKey.id,
				ingredients: {
					create: [
						{ ingredientId: salade.id, quantity: 100, unit: UnitType.GRAM },
						{ ingredientId: tomate.id, quantity: 1, unit: UnitType.PIECE }
					]
				},
				steps: {
					create: [{ order: 1, instruction: "Tout mélanger.", durationMin: 2 }]
				}
			}
		});
		recipeSaladeId = recipe.id;
		console.log("👨‍🍳 Recette créée : Salade");
	}

	if (recipePouletId) {
		const meal = await prisma.meal.create({
			data: {
				mealType: MealType.LUNCH,
				apiKeyId: userKey.id,
				recipeMeals: {
					create: [
						{ recipeId: recipePouletId, type: "Plat Principal" }
					]
				}
			}
		});
		console.log("🍽️  Repas créé (Déjeuner)");

		await prisma.menu.create({
			data: {
				name: "Menu Semaine 1",
				description: "Objectif Prise de masse",
				duration: 7,
				apiKeyId: userKey.id,
				menuMeals: {
					create: [
						{ mealId: meal.id, dayNumber: 1 }
					]
				}
			}
		});
		console.log("📅 Menu créé");
	}
	console.log('✅ Seeding terminé avec succès !');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});