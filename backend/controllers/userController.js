import User from "../models/user.js";
import Property from "../models/property.js";
import Notification from "../models/notification.js";

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  const { name, phone, address } = req.body;

  const user = await User.findById(req.user.id);

  user.name = name ?? user.name;
  user.phone = phone ?? user.phone;
  user.address = address ?? user.address;

  await user.save();

  res.json(user);
};

export const toggleSaveProperty = async (req, res) => {
  const user = await User.findById(req.user.id);
  const propertyId = req.params.propertyId;

  const property = await Property.findById(propertyId).populate(
    "createdBy",
    "name"
  );

  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  const alreadySaved = user.savedProperties.includes(propertyId);

  if (alreadySaved) {
    user.savedProperties.pull(propertyId);
  } else {
    user.savedProperties.push(propertyId);

    await Notification.create({
      recipient: property.createdBy._id,
      sender: user._id, // ✅ WHO triggered it
      message: `${user.name} saved your listing "${property.title}"`,
    });
  }

  await user.save();

  res.json({
    saved: !alreadySaved,
    savedProperties: user.savedProperties,
  });
};
