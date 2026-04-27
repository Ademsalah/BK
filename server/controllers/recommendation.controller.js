const db = require("../models");
const Prestataire = db.Prestataire;

const CATEGORY_WEIGHTS = {
  TRAITEUR: 0.35,
  SALLE: 0.3,
  MUSICIEN: 0.2,
  DECORATION: 0.15,
};

exports.recommendTeams = async (req, res) => {
  try {
    const { budget, categories, location } = req.body;

    if (!budget || !categories?.length || !location) {
      return res.status(400).json({
        message: "budget, location, categories required",
      });
    }

    // 1. Fetch all prestataires for selected categories
    const prestataires = await Prestataire.findAll({
      where: {
        category: categories,
      },
    });

    // 2. Group by category
    const grouped = {};
    for (const p of prestataires) {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    }

    // 3. If missing a category → impossible to build team
    for (const cat of categories) {
      if (!grouped[cat] || grouped[cat].length === 0) {
        return res.json({
          message: `No prestataires found for ${cat}`,
        });
      }
    }

    // 4. Generate combinations (LIMITED for performance)
    const teams = [];

    const salleList = grouped["SALLE"] || [];
    const traiteurList = grouped["TRAITEUR"] || [];
    const musicList = grouped["MUSICIEN"] || [];
    const decoList = grouped["DECORATION"] || [];

    for (const salle of salleList.slice(0, 3)) {
      for (const traiteur of traiteurList.slice(0, 3)) {
        for (const music of musicList.slice(0, 3)) {
          for (const deco of decoList.slice(0, 3)) {
            const team = [salle, traiteur, music, deco];

            // 5. Calculate total price
            const totalPrice = team.reduce(
              (sum, p) => sum + (p.priceMax || 0),
              0,
            );

            // skip if over budget
            if (totalPrice > budget) continue;

            // 6. Score team
            let score = 0;

            for (const p of team) {
              const budgetScore =
                100 - (Math.abs(p.priceMax - budget / 4) / (budget / 4)) * 100;

              const ratingScore = (p.rating / 5) * 100;

              const locationScore =
                p.location?.toLowerCase() === location.toLowerCase() ? 100 : 50;

              const weight = CATEGORY_WEIGHTS[p.category] || 0.1;

              const final =
                (budgetScore * 0.5 + ratingScore * 0.3 + locationScore * 0.2) *
                weight;

              score += final;
            }

            teams.push({
              team: {
                salle,
                traiteur,
                musicien: music,
                decoration: deco,
              },
              totalPrice,
              score: Number(score.toFixed(2)),
            });
          }
        }
      }
    }

    // 7. Sort best teams
    teams.sort((a, b) => b.score - a.score);

    // 8. Return top 5 teams
    res.json(teams.slice(0, 5));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
