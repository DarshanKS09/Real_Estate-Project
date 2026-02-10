import Notification from "../models/notification.js";

export const getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({
    recipient: req.user.id,
  })
    .populate("sender", "name email")
    .sort({ createdAt: -1 });

  res.json(notifications);
};

export const markAsRead = async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user.id,
  });

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  notification.isRead = true;
  await notification.save();

  res.json({ success: true });
};
