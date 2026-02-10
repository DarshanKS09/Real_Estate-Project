import User from "../models/User.js";
import Property from "../models/property.js";
import Notification from "../models/notification.js";

/**
 * GET CURRENT USER
 */
export const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE PROFILE
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findById(req.user.id);
    if (!user || !user.isActive) {
      return res.status(403).json({ message: "User not allowed" });
    }

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.address = address ?? user.address;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * SAVE / UNSAVE PROPERTY
 */
export const toggleSaveProperty = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isActive) {
      return res.status(403).json({ message: "User not allowed" });
    }

    const propertyId = req.params.propertyId;

    const property = await Property.findById(propertyId).populate(
      "createdBy",
      "name email"
    );

    if (!property || !property.createdBy) {
      return res.status(404).json({ message: "Property not found" });
    }

    const alreadySaved = user.savedProperties.includes(propertyId);

    if (alreadySaved) {
      user.savedProperties.pull(propertyId);
    } else {
      user.savedProperties.push(propertyId);

      await Notification.create({
        recipient: property.createdBy._id,
        sender: user._id,
        message: `${user.name} saved your listing "${property.title}"`,
      });
    }

    await user.save();

    res.status(200).json({
      saved: !alreadySaved,
      savedProperties: user.savedProperties,
    });
  } catch (error) {
    console.error("Toggle save property error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
