const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const csvPath = path.join(__dirname, 'CALNUT.csv');

// Mappings pour les nutriments principaux
const nutrientMappings = {
  '25000': 'proteins', // proteines_g -> proteins
  '40000': 'fats',     // lipides_g -> fats
  '31000': 'carbs',    // glucides_g -> carbs
  '32000': 'sugars',   // sucres_g -> sugars
  '34100': 'fiber',    // fibres_g -> fiber
  '10004': 'salt',     // sel_g -> salt
  '333': 'calories'    // nrj_kcal -> calories
};

const mineralMappings = {
  '10110': 'SODIUM',
  '10120': 'MAGNESIUM',
  '10150': 'PHOSPHORUS',
  '10190': 'POTASSIUM',
  '10200': 'CALCIUM',
  '10260': 'IRON',
  '10300': 'ZINC'
  // Autres minéraux comme OTHER si nécessaire
};

const vitaminMappings = {
  '51200': 'VITAMIN_A',
  '52100': 'VITAMIN_D',
  '53100': 'VITAMIN_E',
  '54101': 'VITAMIN_K',
  '55100': 'VITAMIN_C',
  '56100': 'VITAMIN_B1',
  '56200': 'VITAMIN_B2',
  '56310': 'VITAMIN_B3',
  '56500': 'VITAMIN_B6',
  '56600': 'VITAMIN_B12'
  // Autres vitamines comme OTHER
};

async function importCSV() {
  try {
    // Supprimer les données existantes
    console.log('Suppression des données existantes...');
    await prisma.ingredientMineral.deleteMany();
    await prisma.ingredientVitamin.deleteMany();
    await prisma.ingredient.deleteMany();
    console.log('Données supprimées.');

    const data = fs.readFileSync(csvPath, 'utf8');
    const lines = data.split('\n').filter(line => line.trim());
    const headers = lines[0].split(';');
    const rows = lines.slice(1).map(line => line.split(';'));

    const ingredientsMap = new Map();

    for (const row of rows) {
      const alimCode = row[0];
      const foodLabel = row[1];
      const indicCombl = parseInt(row[2]);
      const lb = parseFloat(row[3].replace(',', '.'));
      const ub = parseFloat(row[4].replace(',', '.'));
      const mb = parseFloat(row[5].replace(',', '.')); // Utiliser la valeur moyenne
      const constCode = row[6];
      const constLabel = row[7];

      if (!ingredientsMap.has(alimCode)) {
        ingredientsMap.set(alimCode, {
          name: foodLabel,
          category: 'OTHER', // Par défaut, ajuster si nécessaire
          proteins: 0,
          fats: 0,
          carbs: 0,
          sugars: 0,
          fiber: 0,
          salt: 0,
          calories: 0,
          minerals: [],
          vitamins: []
        });
      }

      const ingredient = ingredientsMap.get(alimCode);

      // Mapper les nutriments principaux
      if (nutrientMappings[constCode]) {
        const field = nutrientMappings[constCode];
        ingredient[field] = mb;
      }

      // Mapper les minéraux
      if (mineralMappings[constCode]) {
        ingredient.minerals.push({
          mineralType: mineralMappings[constCode],
          value: mb
        });
      }

      // Mapper les vitamines
      if (vitaminMappings[constCode]) {
        ingredient.vitamins.push({
          vitaminType: vitaminMappings[constCode],
          value: mb
        });
      }
    }

    // Insérer dans la BDD
    for (const [alimCode, data] of ingredientsMap) {
      try {
        const ingredient = await prisma.ingredient.create({
          data: {
            name: data.name,
            category: data.category,
            proteins: data.proteins,
            fats: data.fats,
            carbs: data.carbs,
            sugars: data.sugars,
            fiber: data.fiber,
            salt: data.salt,
            calories: data.calories,
            minerals: {
              create: data.minerals
            },
            vitamins: {
              create: data.vitamins
            }
          }
        });
        console.log(`Inséré: ${ingredient.name}`);
      } catch (error) {
        console.error(`Erreur pour ${data.name}:`, error.message);
      }
    }

    console.log('Import terminé.');
  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importCSV();