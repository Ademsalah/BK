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

const firstNames = [
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
  "Ahmed",
  "Walid",
  "Zied",
  "Ons",
  "Rahma",
  "Skander",
];

const lastNames = [
  "Events",
  "Pro",
  "Services",
  "Studio",
  "Agency",
  "Group",
  "Expert",
  "Production",
  "Design",
  "Solutions",
];

// 🔥 Generate 100 prestataires
const fakePrestataires = [];

for (let i = 0; i < 100; i++) {
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[i % lastNames.length];
  const category = categories[i % categories.length];

  // Generate realistic prices
  const priceMin = Math.floor(Math.random() * 9200) + 800;

  const priceMax = priceMin + Math.floor(Math.random() * (10000 - priceMin));

  fakePrestataires.push({
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}${i}@test.com`,
    category,
    priceMin,
    priceMax,
    location:
      i % 4 === 0
        ? "Tunis"
        : i % 4 === 1
          ? "Sousse"
          : i % 4 === 2
            ? "Sfax"
            : "Nabeul",

    description: `${category} professional service by ${firstName}`,
    rating: (4 + Math.random()).toFixed(1),
  });
}

async function seedPrestataires() {
  try {
    console.log("🌱 Seeding 100 prestataires...");

    for (const item of fakePrestataires) {
      const existing = await User.findOne({
        where: { email: item.email },
      });

      if (existing) {
        console.log(`⚠️ Skipped ${item.email}`);
        continue;
      }

      const hashed = await bcrypt.hash("123456", 10);

      // 1. Create User
      const user = await User.create({
        name: item.name,
        email: item.email,
        password: hashed,
        role: "PRESTATAIRE",
        mustChangePassword: false,
      });

      // 2. Create Prestataire Profile
      await PrestataireProfile.create({
        userId: user.id,
        category: item.category,
        priceMin: item.priceMin,
        priceMax: item.priceMax,
        location: item.location,
        description: item.description,
        rating: item.rating,
      });

      console.log(
        `✅ Created ${item.name} | ${item.category} | ${item.priceMin} - ${item.priceMax} DT`,
      );
    }

    console.log("🎉 Done seeding 100 prestataires!");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

seedPrestataires();
