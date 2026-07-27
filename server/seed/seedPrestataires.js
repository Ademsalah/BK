const bcrypt = require("bcryptjs");
const { User, PrestataireProfile } = require("../models");

const categories = [
  "TRAITEUR",
  "Audiovisuel",
  "Photo/Vidéo",
  "Animation",
  "Impression",
  "Marketing digital",
  "Transport",
  "SALLE",
  "Sécurité",
  "Prestataires spécialisés",
  "DECORATION",
];

const companyNames = [
  "Golden Events",
  "Elite Weddings",
  "Prestige Event",
  "Magic Moments",
  "Dream Makers",
  "Royal Events",
  "Event Plus",
  "Vision Event",
  "Lux Event",
  "Prime Services",
  "Event Factory",
  "Smart Events",
  "Infinity Events",
  "Diamond Event",
  "Happy Day",
  "Grand Occasion",
  "Celebration Pro",
  "Perfect Event",
  "Star Production",
  "Elite Production",
  "Creative Studio",
  "Pixel Media",
  "Flash Photography",
  "Wedding Experts",
  "VIP Services",
  "Top Decor",
  "Urban Events",
  "Event Masters",
  "Blue Sky Events",
  "Sunshine Events",
  "Harmony Events",
  "Premium Event",
  "White Rose",
  "Golden Touch",
  "Crystal Event",
  "Next Event",
  "Event Hub",
  "Event Concept",
  "Majestic Events",
  "Dream Wedding",
  "VIP Security",
  "Safe Guard",
  "Quick Transport",
  "Luxury Transport",
  "Digital Boost",
  "Market Vision",
  "Print Factory",
  "Media House",
  "Studio One",
  "Pro Event Tunisia",
  "Event Expert",
  "Event Connect",
  "Bright Event",
  "Event Leaders",
  "Tunisia Event Pro",
  "Event Sphere",
  "Prestige Decor",
  "Elegant Design",
  "Creative Decor",
  "Royal Decoration",
  "Golden Catering",
  "Delice Catering",
  "Chef Services",
  "Premium Catering",
  "Gourmet Events",
  "Audio Vision",
  "Tech Event",
  "Sound Masters",
  "Light & Sound",
  "Event Tech",
  "Security First",
  "Shield Security",
  "Safe Events",
  "Protection Pro",
  "Guardian Services",
  "Photo Prestige",
  "Pixel Wedding",
  "Vision Photography",
  "Dream Capture",
  "Focus Studio",
  "Creative Lens",
  "Memories Studio",
  "Event Stars",
  "Golden Memories",
  "Future Events",
  "Skyline Events",
  "Ocean Events",
  "Elite Solutions",
  "Event Partners",
  "Perfect Moments",
  "Royal Production",
  "Grand Services",
  "Diamond Solutions",
  "Spark Events",
  "Magic Production",
  "Event Point",
  "Smart Production",
  "Ultimate Events",
  "Legend Events",
  "Nova Events",
];

const locations = [
  "Tunis",
  "Sousse",
  "Sfax",
  "Nabeul",
  "Hammamet",
  "Monastir",
  "Mahdia",
  "Bizerte",
  "Djerba",
  "Gabès",
];

const categoryPriceRanges = {
  TRAITEUR: { min: 500, max: 1500 },
  Audiovisuel: { min: 300, max: 1200 },
  "Photo/Vidéo": { min: 200, max: 1000 },
  Animation: { min: 150, max: 800 },
  Impression: { min: 100, max: 500 },
  "Marketing digital": { min: 200, max: 1000 },
  Transport: { min: 150, max: 700 },
  SALLE: { min: 800, max: 1500 },
  Sécurité: { min: 200, max: 900 },
  "Prestataires spécialisés": { min: 300, max: 1500 },
  DECORATION: { min: 250, max: 1200 },
};

function generatePrices(category) {
  const range = categoryPriceRanges[category];

  const priceMin =
    Math.floor(Math.random() * (range.max - range.min + 1)) +
    range.min;

  const gap = Math.floor(Math.random() * 401) + 100; // 100 → 500 DT

  const priceMax = Math.min(priceMin + gap, range.max);

  return {
    priceMin,
    priceMax,
  };
}

function generateRating() {
  return (3.8 + Math.random() * 1.2).toFixed(1);
}

function generateDescription(name, category) {
  const descriptions = [
    `${name} est spécialisé dans les services de ${category} pour les mariages, conférences et événements privés.`,
    `${name} propose des prestations professionnelles de ${category} avec une équipe expérimentée.`,
    `${name} accompagne les entreprises et particuliers dans l'organisation d'événements réussis.`,
    `${name} offre des solutions sur mesure en ${category} pour tout type d'événement.`,
    `${name} est reconnu pour la qualité de ses prestations et son professionnalisme.`,
  ];

  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

async function seedPrestataires() {
  try {
    console.log("🌱 Seeding prestataires...");

    for (let i = 0; i < companyNames.length; i++) {
      const name = companyNames[i];

      const email = `${name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")}@prestataire.tn`;

      const category =
        categories[Math.floor(Math.random() * categories.length)];

      const { priceMin, priceMax } = generatePrices(category);

      const location =
        locations[Math.floor(Math.random() * locations.length)];

      const rating = generateRating();

      const existing = await User.findOne({
        where: { email },
      });

      if (existing) {
        console.log(`⚠️ Skipped ${email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash("123456", 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "PRESTATAIRE",
        mustChangePassword: false,
      });

      await PrestataireProfile.create({
        userId: user.id,
        category,
        priceMin,
        priceMax,
        location,
        description: generateDescription(name, category),
        rating,
      });

      console.log(
        `✅ ${name} | ${category} | ${priceMin}-${priceMax} DT | ⭐ ${rating}`
      );
    }

    console.log(
      `🎉 Successfully seeded ${companyNames.length} prestataires!`
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding prestataires:", error);
    process.exit(1);
  }
}

seedPrestataires();