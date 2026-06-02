const db = require("../models");
const PrestataireProfile = db.PrestataireProfile;

const CATEGORY_WEIGHTS = {
  TRAITEUR: 0.35,
  SALLE: 0.3,
  MUSICIEN: 0.2,
  DECORATION: 0.15,
};

// 🔥 helper
function getCombinations(arr, k) {
  const result = [];

  function helper(start, combo) {
    if (combo.length === k) {
      result.push([...combo]);
      return;
    }

    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      helper(i + 1, combo);
      combo.pop();
    }
  }

  helper(0, []);
  return result;
}

exports.recommendTeams = async (req, res) => {
  try {
    const { budget, categories, location } = req.body;

    // ✅ FIX 1: categories is now OBJECT not array
    if (!budget || !categories || !location) {
      return res.status(400).json({
        message: "budget, location, categories required",
      });
    }

    const categoryKeys = Object.keys(categories);

    // ✅ FIX 2: fetch correctly
    const prestataires = await PrestataireProfile.findAll({
      where: {
        category: categoryKeys,
      },
       include: [
    {
      model: db.User,
      attributes: ["id", "name", "email"], // 👈 what you need
    },
  ],
    });

    // Group by category
    const grouped = {};
    for (const p of prestataires) {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    }

    // ✅ FIX 3: check quantity per category
    for (const cat of categoryKeys) {
      if (!grouped[cat] || grouped[cat].length < categories[cat]) {
        return res.json({
          message: `Not enough prestataires for ${cat}`,
        });
      }
    }

    // 🔥 STEP: generate combinations per category
    const categoryCombinations = {};

    for (const cat of categoryKeys) {
      const list = grouped[cat]
        .sort((a, b) => b.rating - a.rating) // better quality first
        .slice(0, 6); // LIMIT (important for performance)

      const count = categories[cat];

      categoryCombinations[cat] = getCombinations(list, count);
    }

    // 🔥 STEP: build teams dynamically
    const teams = [];

    function buildTeams(index, currentTeam) {
      if (index === categoryKeys.length) {
        teams.push([...currentTeam]);
        return;
      }

      const cat = categoryKeys[index];

      for (const combo of categoryCombinations[cat]) {
        buildTeams(index + 1, [...currentTeam, ...combo]);
      }
    }

    buildTeams(0, []);

    // 🔥 STEP: scoring
    const scoredTeams = [];

    for (const team of teams) {
      const totalPrice = team.reduce(
        (sum, p) => sum + (p.priceMax || 0),
        0
      );

      if (totalPrice > budget) continue;

      let score = 0;

      for (const p of team) {
        const ideal = budget / team.length;

        const budgetScore =
          100 - (Math.abs(p.priceMax - ideal) / ideal) * 100;

        const ratingScore = (p.rating / 5) * 100;

        const locationScore =
          p.location?.toLowerCase() === location.toLowerCase()
            ? 100
            : 50;

        const weight = CATEGORY_WEIGHTS[p.category] || 0.1;

        score +=
          (budgetScore * 0.5 +
            ratingScore * 0.3 +
            locationScore * 0.2) *
          weight;
      }

      scoredTeams.push({
        team,
        totalPrice,
        score: Number(score.toFixed(2)),
      });
    }

    // Sort best
    scoredTeams.sort((a, b) => b.score - a.score);

    return res.json(scoredTeams.slice(0, 5));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.getReplacementCandidates = async (req, res) => {
  try {
    const { eventId, eventPrestataireId } = req.body;

    if (!eventId || !eventPrestataireId) {
      return res.status(400).json({
        message: "eventId and eventPrestataireId required",
      });
    }

    // 1. Get the refused assignment
    const current = await db.EventPrestataire.findByPk(eventPrestataireId, {
      include: [
        {
          model: db.PrestataireProfile,
        },
      ],
    });

    if (!current) {
      return res.status(404).json({ message: "Prestataire not found" });
    }

    const category = current.PrestataireProfile.category;
    const targetPrice = current.proposedPrice;

    // 2. Get event to avoid duplicates
    const event = await db.Event.findByPk(eventId, {
      include: [
        {
          model: db.EventPrestataire,
          include: [db.PrestataireProfile],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const usedIds = event.EventPrestataires.map(
      (ep) => ep.PrestataireProfileId
    );

    // 3. Define price range (±20%)
    const minPrice = targetPrice * 0.8;
    const maxPrice = targetPrice * 1.2;

    // 4. Find similar prestataires
    const candidates = await db.PrestataireProfile.findAll({
      where: {
        category,
        id: {
          [db.Sequelize.Op.notIn]: usedIds,
        },
        priceMax: {
          [db.Sequelize.Op.between]: [minPrice, maxPrice],
        },
      },
      include: [
        {
          model: db.User,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["rating", "DESC"]],
      limit: 10,
    });

    return res.json({
      category,
      targetPrice,
      candidates,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.replacePrestataire = async (req, res) => {
  try {
  const { eventId, eventPrestataireId, newPrestataireId } = req.body;

    if (!eventId || !eventPrestataireId) {
      return res.status(400).json({
        message: "eventId and eventPrestataireId required",
      });
    }

    // 1. Get current assignment
    const current = await db.EventPrestataire.findByPk(eventPrestataireId, {
      include: [
        {
          model: db.PrestataireProfile,
        },
      ],
    });

    if (!current) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const category = current.PrestataireProfile.category;

    // 2. Get event budget + existing selections
    const event = await db.Event.findByPk(eventId, {
      include: [
        {
          model: db.EventPrestataire,
          include: [db.PrestataireProfile],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 3. Get all already selected prestataires (except refused one)
    const usedIds = event.EventPrestataires.map((ep) =>
      ep.PrestataireProfileId
    );

    // 4. Find alternatives in same category
    const alternatives = await db.PrestataireProfile.findAll({
      where: {
        category,
        id: {
          [db.Sequelize.Op.notIn]: usedIds, // avoid duplicates
        },
      },
      include: [
        {
          model: db.User,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["rating", "DESC"]],
      limit: 10,
    });

    if (!alternatives.length) {
      return res.json({
        message: "No replacement available",
      });
    }

    // 5. Pick best alternative (simple scoring)
   let best = null;

if (newPrestataireId) {
  best = alternatives.find(
    (a) => a.id === Number(newPrestataireId)
  );
}

// fallback always safe
if (!best) {
  best = alternatives[0];
}

if (!best) {
  return res.status(400).json({
    message: "No valid prestataire found",
  });
}
    // 6. Update EventPrestataire row
    await current.update({
      PrestataireProfileId: best.id,
      status: "PENDING",
      proposedPrice: best.priceMax,
    });

    return res.json({
      message: "Prestataire replaced successfully",
      newPrestataire: best,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};