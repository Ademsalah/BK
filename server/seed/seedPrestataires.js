const bcrypt = require("bcryptjs");
const { User, Prestataire } = require("../models");

const categories = ["TRAITEUR", "MUSICIEN", "SALLE", "DECORATION"];

// 🔥 20+ fake prestataires
const baseNames = [
  "Ali",
  "Youssef",
  "Omar",
  "Khalil",
  "Sami",
  "Amine",
  "Rami",
  "Fares",
  "Houssem",
  "Anis",
  "Nour",
  "Salma",
  "Aya",
  "Leila",
  "Mariam",
  "Karim",
  "Hatem",
  "Mehdi",
  "Saber",
  "Fedi",
  "Nader",
  "Bilel",
  "Ines",
  "Rania",
];

const fakePrestataires = baseNames.map((name, i) => {
  const category = categories[i % categories.length];

  return {
    name: `${name} ${category.toLowerCase()}`,
    email: `${name.toLowerCase()}${i}@test.com`,
    category,
    priceMin: 100 + i * 20,
    priceMax: 300 + i * 50,
    location: i % 2 === 0 ? "Tunis" : "Sousse",
    description: `${category} professional service by ${name}`,
    rating: (4 + Math.random()).toFixed(1),
  };
});

async function seedPrestataires() {
  try {
    console.log("🌱 Seeding 20+ prestataires...");

    for (const item of fakePrestataires) {
      const existing = await User.findOne({
        where: { email: item.email },
      });

      if (existing) {
        console.log(`⚠️ Skipped ${item.email}`);
        continue;
      }

      const hashed = await bcrypt.hash("123456", 10);

      // 1. User
      const user = await User.create({
        name: item.name,
        email: item.email,
        password: hashed,
        role: "PRESTATAIRE",
        mustChangePassword: false,
      });

      // 2. Prestataire
      await Prestataire.create({
        userId: user.id,
        category: item.category,
        priceMin: item.priceMin,
        priceMax: item.priceMax,
        location: item.location,
        description: item.description,
        rating: item.rating,
      });

      console.log(`✅ Created ${item.name}`);
    }

    console.log("🎉 Done seeding 20+ prestataires!");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

seedPrestataires();
