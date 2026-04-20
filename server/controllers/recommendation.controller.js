const db = require("../models");
const Prestataire = db.Prestataire;

exports.recommend = async (req, res) => {
  const { budget, category, location } = req.body;
  console.log("CATEGORY RECEIVED:", category);
  const prestataires = await Prestataire.findAll({
    where: { category },
  });

  const scored = prestataires.map((p) => {
    let score = 0;

    // 💰 budget match
    const budgetScore = 100 - (Math.abs(p.priceMax - budget) / budget) * 100;

    // ⭐ rating
    const ratingScore = (p.rating / 5) * 100;

    // 📍 location match
    const locationScore = p.location === location ? 100 : 50;

    score = budgetScore * 0.5 + ratingScore * 0.3 + locationScore * 0.2;

    return { ...p.dataValues, score };
  });

  scored.sort((a, b) => b.score - a.score);

  res.json(scored.slice(0, 5));
};
