const db = require("../models");
const PrestataireProfile = db.PrestataireProfile;

const CATEGORY_WEIGHTS = {
  TRAITEUR: 0.18,
  Audiovisuel: 0.08,
  "Photo/Vidéo": 0.12,
  Animation: 0.08,
  Impression: 0.05,
  "Marketing digital": 0.05,
  Transport: 0.08,
  SALLE: 0.18,
  Sécurité: 0.05,
  "Prestataires spécialisés": 0.04,
  DECORATION: 0.09,
};

// helper
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

    if (!budget || !categories || !location) {
      return res.status(400).json({
        message: "budget, location, categories required",
      });
    }

    const categoryKeys = Object.keys(categories);

    // fetch prestataires
    const prestataires = await PrestataireProfile.findAll({
      where: {
        category: categoryKeys,
      },
      include: [
        {
          model: db.User,
          attributes: ["id", "name", "email"],
        },
      ],
    });

    // group by category
    const grouped = {};

    for (const p of prestataires) {
      if (!grouped[p.category]) {
        grouped[p.category] = [];
      }

      grouped[p.category].push(p);
    }

    // validate quantities
    for (const cat of categoryKeys) {
      if (!grouped[cat] || grouped[cat].length < categories[cat]) {
        return res.json({
          message: `Not enough prestataires for ${cat}`,
        });
      }
    }

    // generate combinations per category
    const categoryCombinations = {};

    for (const cat of categoryKeys) {
      const count = categories[cat];

      // IMPORTANT:
      // limit candidates aggressively to avoid combinatorial explosion
      const list = grouped[cat]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3);

      categoryCombinations[cat] = getCombinations(list, count);
    }

    // store only top results
    const scoredTeams = [];

    function addTopTeam(teamData) {
      scoredTeams.push(teamData);

      scoredTeams.sort((a, b) => b.score - a.score);

      // keep only top 5 in memory
      if (scoredTeams.length > 5) {
        scoredTeams.pop();
      }
    }

    function buildTeams(index, currentTeam, currentPrice = 0) {
      // pruning
      if (currentPrice > budget) {
        return;
      }

      // finished team
      if (index === categoryKeys.length) {
        let score = 0;

        for (const p of currentTeam) {
          const ideal = budget / currentTeam.length;

          const budgetScore =
            100 -
            (Math.abs((p.priceMax || 0) - ideal) / ideal) * 100;

          const ratingScore = ((p.rating || 0) / 5) * 100;

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

        addTopTeam({
          team: [...currentTeam],
          totalPrice: currentPrice,
          score: Number(score.toFixed(2)),
        });

        return;
      }

      const cat = categoryKeys[index];

      for (const combo of categoryCombinations[cat]) {
        const comboPrice = combo.reduce(
          (sum, p) => sum + (p.priceMax || 0),
          0
        );

        buildTeams(
          index + 1,
          [...currentTeam, ...combo],
          currentPrice + comboPrice
        );
      }
    }

    buildTeams(0, [], 0);

    return res.json(scoredTeams);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
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

    // current assignment
    const current = await db.EventPrestataire.findByPk(
      eventPrestataireId,
      {
        include: [
          {
            model: db.PrestataireProfile,
          },
        ],
      }
    );

    if (!current) {
      return res.status(404).json({
        message: "Prestataire not found",
      });
    }

    const category = current.PrestataireProfile.category;
    const targetPrice = current.proposedPrice;

    // event with existing prestataires
    const event = await db.Event.findByPk(eventId, {
      include: [
        {
          model: db.EventPrestataire,
          include: [db.PrestataireProfile],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const usedIds = event.EventPrestataires.map(
      (ep) => ep.PrestataireProfileId
    );

    // price range ±20%
    const minPrice = targetPrice * 0.8;
    const maxPrice = targetPrice * 1.2;

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

    return res.status(500).json({
      error: err.message,
    });
  }
};

exports.replacePrestataire = async (req, res) => {
  try {
    const { eventId, eventPrestataireId, newPrestataireId } =
      req.body;

    if (!eventId || !eventPrestataireId) {
      return res.status(400).json({
        message: "eventId and eventPrestataireId required",
      });
    }

    // current assignment
    const current = await db.EventPrestataire.findByPk(
      eventPrestataireId,
      {
        include: [
          {
            model: db.PrestataireProfile,
          },
        ],
      }
    );

    if (!current) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    const category = current.PrestataireProfile.category;

    // event data
    const event = await db.Event.findByPk(eventId, {
      include: [
        {
          model: db.EventPrestataire,
          include: [db.PrestataireProfile],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const usedIds = event.EventPrestataires.map(
      (ep) => ep.PrestataireProfileId
    );

    // alternatives
    const alternatives = await db.PrestataireProfile.findAll({
      where: {
        category,

        id: {
          [db.Sequelize.Op.notIn]: usedIds,
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

    let best = null;

    if (newPrestataireId) {
      best = alternatives.find(
        (a) => a.id === Number(newPrestataireId)
      );
    }

    if (!best) {
      best = alternatives[0];
    }

    if (!best) {
      return res.status(400).json({
        message: "No valid prestataire found",
      });
    }

    // update assignment
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

    return res.status(500).json({
      error: err.message,
    });
  }
};