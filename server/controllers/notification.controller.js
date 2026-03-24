const db = require("../models");

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await db.Notification.findAll({
      where: { UserId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// MARK AS READ
exports.markAsRead = async (req, res) => {
  try {
    const notif = await db.Notification.findByPk(req.params.id);

    if (!notif) return res.status(404).json({ message: "Not found" });

    if (notif.UserId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    await notif.update({ status: "read" });

    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
