import Property from "../models/Property.js";

// CREATE property (agent only)
export const createProperty = async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(property);
  } catch {
    res.status(400).json({ message: "Failed to create property" });
  }
};

// GET agent's properties
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      createdBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(properties);
  } catch {
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

// UPDATE property (only owner)
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch {
    res.status(400).json({ message: "Failed to update property" });
  }
};

// DELETE property (only owner)
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({ message: "Property deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete property" });
  }
};

// GET all properties (public, for users)
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("createdBy", "name email phone") // ✅ FIX HERE
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch {
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

// GET single property (public)
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("createdBy", "name email phone"); // ✅ FIX HERE

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch {
    res.status(500).json({ message: "Failed to fetch property" });
  }
};
