const db = require("../models");
const bcrypt = require("bcrypt");

const User = db.User;

const firstNames = [
  "Salah",
  "Amira",
  "Youssef",
  "Mariem",
  "Omar",
  "Ines",
  "Ahmed",
  "Nour",
  "Khalil",
  "Fatma",
  "Houssem",
  "Amina",
  "Ali",
  "Dorra",
  "Mehdi",
];

const lastNames = [
  "Ben Ali",
  "Trabelsi",
  "Jaziri",
  "Lahmar",
  "Hamdi",
  "Cherif",
  "Masmoudi",
  "Saidi",
  "Gharbi",
  "Mrad",
];

function randomName() {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
}

function randomEmail(name, i) {
  return name.toLowerCase().replace(" ", ".") + i + "@test.com";
}

function randomBool() {
  return Math.random() < 0.2; // 20% banned users
}

async function seedParticipants() {
  try {
    const password = await bcrypt.hash("123456", 10);

    const participants = [];

    for (let i = 1; i <= 50; i++) {
      const name = randomName();

      participants.push({
        name,
        email: randomEmail(name, i),
        password,
        role: "PARTICIPANT",
        banned: randomBool(),
      });
    }

    await User.bulkCreate(participants);

    console.log("✅ 50 Participants seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seedParticipants();
