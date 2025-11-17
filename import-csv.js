const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("./src/generated/prisma");

const prisma = new PrismaClient();

const csvPath = path.join(__dirname, "CALNUT.csv");

function getCategory(foodLabel) {
  const base = foodLabel.split(',')[0].trim();

  const categoryMap = {
    // MEAT
    "Boeuf": "MEAT",
    "Veau": "MEAT",
    "Agneau": "MEAT",
    "Porc": "MEAT",
    "Poulet": "MEAT",
    "Dinde": "MEAT",
    "Canard": "MEAT",
    "Lapin": "MEAT",
    "Cheval": "MEAT",
    "Chorizo": "MEAT",
    "Merguez": "MEAT",

    // FISH
    "Cabillaud": "FISH",
    "Hareng": "FISH",
    "Hoki": "FISH",
    "Maquereau": "FISH",
    "Sardine": "FISH",
    "Saumon": "FISH",
    "Thon": "FISH",
    "Crevette": "FISH",
    "Huître": "FISH",
    "Moule": "FISH",

    // FRUIT
    "Abricot": "FRUIT",
    "Ananas": "FRUIT",
    "Banane": "FRUIT",
    "Cerise": "FRUIT",
    "Citron": "FRUIT",
    "Fraise": "FRUIT",
    "Kiwi": "FRUIT",
    "Mangue": "FRUIT",
    "Orange": "FRUIT",
    "Pastèque": "FRUIT",
    "Poire": "FRUIT",
    "Pomme": "FRUIT",
    "Prune": "FRUIT",
    "Pruneau": "FRUIT",
    "Pêche": "FRUIT",
    "Raisin": "FRUIT",

    // VEGETABLE
    "Ail": "VEGETABLE",
    "Artichaut": "VEGETABLE",
    "Asperge": "VEGETABLE",
    "Betterave rouge": "VEGETABLE",
    "Brocoli": "VEGETABLE",
    "Carotte": "VEGETABLE",
    "Céleri": "VEGETABLE",
    "Céleri-rave": "VEGETABLE",
    "Champignon": "VEGETABLE",
    "Chicorée": "VEGETABLE",
    "Chou": "VEGETABLE",
    "Chou-fleur": "VEGETABLE",
    "Chou-rave": "VEGETABLE",
    "Concombre": "VEGETABLE",
    "Courgette": "VEGETABLE",
    "Endive": "VEGETABLE",
    "Épinard": "VEGETABLE",
    "Fenouil": "VEGETABLE",
    "Haricot": "VEGETABLE",
    "Laitue": "VEGETABLE",
    "Lentille": "VEGETABLE",
    "Navet": "VEGETABLE",
    "Oignon": "VEGETABLE",
    "Petits pois": "VEGETABLE",
    "Poireau": "VEGETABLE",
    "Poivron": "VEGETABLE",
    "Radis": "VEGETABLE",
    "Salade": "VEGETABLE",
    "Tomate": "VEGETABLE",

    // GRAIN
    "Avoine": "GRAIN",
    "Blé": "GRAIN",
    "Maïs": "GRAIN",
    "Quinoa": "GRAIN",
    "Riz": "GRAIN",
    "Son": "GRAIN",

    // NUT
    "Amande": "NUT",
    "Cacahuète": "NUT",
    "Chia": "NUT",
    "Lin": "NUT",
    "Noix": "NUT",
    "Sésame": "NUT",
    "Tournesol": "NUT",
    "Cucurbitacées": "NUT",

    // DAIRY
    "Oeuf": "DAIRY",
    "Lait": "DAIRY",
    "Fromage": "DAIRY",
    "Yaourt": "DAIRY",
    "Crème": "DAIRY",
    "Beurre": "DAIRY",
    "Faisselle": "DAIRY",
    "Époisses": "DAIRY",

    // SPICE
    "Cannelle": "SPICE",
    "Cumin": "SPICE",
    "Curry": "SPICE",
    "Fenugrec": "SPICE",
    "Paprika": "SPICE",
    "Poivre": "SPICE",
    "Sel": "SPICE",
    "Ail séché": "SPICE",
    "Coriandre": "SPICE",
    "Fenouil": "SPICE",
    "Pavot": "SPICE",
    "Quatre épices": "SPICE",
    "Herbes de Provence": "SPICE",

    // OTHER
    "Compote": "OTHER",
    "Chouquette": "OTHER",
  };

  return categoryMap[base] || "OTHER";
}

async function importCSV() {
  try {
    // Supprimer les données existantes
    console.log("Suppression des données existantes...");
    await prisma.ingredientMineral.deleteMany();
    await prisma.ingredientVitamin.deleteMany();
    await prisma.ingredient.deleteMany();
    console.log("Données supprimées.");

    const data = fs.readFileSync(csvPath, "utf8");
    const lines = data.split("\n").filter((line) => line.trim());
    const headers = lines[0].split(";");
    const rows = lines.slice(1).map((line) => line.split(";"));

    for (const row of rows) {
      const alimCode = row[0];
      const foodLabel = row[1];

      const category = getCategory(foodLabel);
      if (category === "OTHER") continue; // Filtrer pour ne garder que les ingrédients bruts

      // Extraire les nutriments principaux
      const calories = parseFloat(row[3].replace(",", ".")) || 0; // nrj_kcal
      const proteins = parseFloat(row[17].replace(",", ".")) || 0; // proteines_g
      const fats = parseFloat(row[29].replace(",", ".")) || 0; // lipides_g
      const carbs = parseFloat(row[18].replace(",", ".")) || 0; // glucides_g
      const sugars = parseFloat(row[19].replace(",", ".")) || 0; // sucres_g
      const fiber = parseFloat(row[28].replace(",", ".")) || 0; // fibres_g
      const salt = parseFloat(row[5].replace(",", ".")) || 0; // sel_g

      // Minéraux
      const minerals = [];
      minerals.push({ mineralType: "SODIUM", value: parseFloat(row[6].replace(",", ".")) || 0 }); // sodium_mg
      minerals.push({ mineralType: "MAGNESIUM", value: parseFloat(row[7].replace(",", ".")) || 0 }); // magnesium_mg
      minerals.push({ mineralType: "PHOSPHORUS", value: parseFloat(row[8].replace(",", ".")) || 0 }); // phosphore_mg
      minerals.push({ mineralType: "POTASSIUM", value: parseFloat(row[9].replace(",", ".")) || 0 }); // potassium_mg
      minerals.push({ mineralType: "CALCIUM", value: parseFloat(row[10].replace(",", ".")) || 0 }); // calcium_mg
      minerals.push({ mineralType: "IRON", value: parseFloat(row[12].replace(",", ".")) || 0 }); // fer_mg
      minerals.push({ mineralType: "ZINC", value: parseFloat(row[14].replace(",", ".")) || 0 }); // zinc_mg

      // Vitamines
      const vitamins = [];
      vitamins.push({ vitaminType: "VITAMIN_A", value: parseFloat(row[45].replace(",", ".")) || 0 }); // retinol_mcg
      vitamins.push({ vitaminType: "VITAMIN_D", value: parseFloat(row[47].replace(",", ".")) || 0 }); // vitamine_d_mcg
      vitamins.push({ vitaminType: "VITAMIN_E", value: parseFloat(row[48].replace(",", ".")) || 0 }); // vitamine_e_mg
      vitamins.push({ vitaminType: "VITAMIN_K", value: parseFloat(row[49].replace(",", ".")) || 0 }); // vitamine_k1_mcg
      vitamins.push({ vitaminType: "VITAMIN_C", value: parseFloat(row[52].replace(",", ".")) || 0 }); // vitamine_c_mg
      vitamins.push({ vitaminType: "VITAMIN_B1", value: parseFloat(row[53].replace(",", ".")) || 0 }); // vitamine_b1_mg
      vitamins.push({ vitaminType: "VITAMIN_B2", value: parseFloat(row[54].replace(",", ".")) || 0 }); // vitamine_b2_mg
      vitamins.push({ vitaminType: "VITAMIN_B3", value: parseFloat(row[55].replace(",", ".")) || 0 }); // vitamine_b3_mg
      vitamins.push({ vitaminType: "VITAMIN_B6", value: parseFloat(row[57].replace(",", ".")) || 0 }); // vitamine_b6_mg
      vitamins.push({ vitaminType: "VITAMIN_B12", value: parseFloat(row[58].replace(",", ".")) || 0 }); // vitamine_b12_mcg

      try {
        const ingredient = await prisma.ingredient.create({
          data: {
            name: foodLabel,
            category: getCategory(foodLabel),
            proteins,
            fats,
            carbs,
            sugars,
            fiber,
            salt,
            calories,
            minerals: {
              create: minerals.filter(m => m.value > 0),
            },
            vitamins: {
              create: vitamins.filter(v => v.value > 0),
            },
          },
        });
        console.log(`Inséré: ${ingredient.name}`);
      } catch (error) {
        console.error(`Erreur pour ${foodLabel}:`, error.message);
      }
    }

    console.log("Import terminé.");
  } catch (error) {
    console.error("Erreur lors de l'import:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importCSV();