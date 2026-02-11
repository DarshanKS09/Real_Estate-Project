import Property from "../models/Property.js";

// CREATE property (agent only)
export const createProperty = async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(property);
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    res.status(500).json({ message: "Failed to delete property" });
  }
};

// GET all properties (public with filtering + pagination)
export const getAllProperties = async (req, res) => {
  try {
    const {
      search,
      location,
      propertyType,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 6,
    } = req.query;

    const query = {};

    // Title search (case-insensitive)
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Property type filter
    if (propertyType) {
      query.propertyType = propertyType;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting logic
    let sortOption = { createdAt: -1 }; // default newest

    if (sort === "price_asc") {
      sortOption = { price: 1 };
    }

    if (sort === "price_desc") {
      sortOption = { price: -1 };
    }

    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;

    const properties = await Property.find(query)
      .populate("createdBy", "name email phone")
      .sort(sortOption)
      .skip(skip)
      .limit(perPage);

    const total = await Property.countDocuments(query);

    res.json({
      properties,
      total,
      currentPage,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (error) {
    console.error("Get properties error:", error);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

// GET single property (public)
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("createdBy", "name email phone");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch property" });
  }
};
