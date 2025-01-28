const { Gadget } = require("../models");
const redis = require("../utils/redisClient");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {
  generateRandomName,
  generateRandomCode,
  generateProbability,
} = require("../utils/randomUtils");

// Cache key generator
function getCacheKey(key, value) {
  return value ? `gadget:${key}:${value}` : `gadget:${key}`;
}

// GET - Retrieve all gadgets
exports.getAllGadgets = async (req, res) => {
  try {
    const cacheKey = "gadgets:all";
    const cachedGadgets = await redis.get(cacheKey);
    if (cachedGadgets) {
      return res.json(JSON.parse(cachedGadgets));
    }

    const gadgets = await Gadget.findAll();
    const gadgetsWithProbability = gadgets.map((gadget) => ({
      ...gadget.toJSON(),
      missionSuccessProbability: `${generateProbability()}%`,
    }));

    await redis.set(cacheKey, JSON.stringify(gadgetsWithProbability), "EX", 3600); // Cache for 1 hour
    res.json(gadgetsWithProbability);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve gadgets. " + err.message });
  }
};

// POST - Add a new gadget
exports.addGadget = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Gadget name is required." });
    }
    const newGadget = await Gadget.create({ name: generateRandomName() });

    const token = jwt.sign({ gadgetId: newGadget.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    await redis.del("gadgets:all"); // Invalidate the cache for all gadgets

    res.status(201).json({ newGadget, token });
  } catch (err) {
    res.status(500).json({ error: "Failed to add gadget. " + err.message });
  }
};

// PATCH - Update a gadget
exports.updateGadget = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    if (!name && !status) {
      return res
        .status(400)
        .json({ error: "Name or status is required to update." });
    }
    const updated = await Gadget.update({ name, status }, { where: { id } });

    if (updated[0]) {
      await redis.del("gadgets:all"); // Invalidate the cache for all gadgets
      await redis.del(getCacheKey("id", id)); // Invalidate the cache for the specific gadget
      res.json({ message: "Gadget updated successfully" });
    } else {
      res.status(404).json({ error: "Gadget not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update gadget. " + err.message });
  }
};

// DELETE - Decommission a gadget
exports.deleteGadget = async (req, res) => {
  try {
    const { id } = req.params;
    const gadget = await Gadget.findByPk(id);
    if (gadget) {
      gadget.status = "Decommissioned";
      gadget.decommissionedAt = new Date();
      await gadget.save();

      await redis.del("gadgets:all"); // Invalidate the cache for all gadgets
      await redis.del(getCacheKey("id", id)); // Invalidate the cache for the specific gadget

      res.json({ message: "Gadget decommissioned successfully" });
    } else {
      res.status(404).json({ error: "Gadget not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to decommission gadget. " + err.message });
  }
};

// POST - Self-destruct sequence
exports.selfDestruct = async (req, res) => {
  try {
    const { id } = req.params;
    const confirmationCode = generateRandomCode();
    res.json({
      message: `Self-destruct sequence initiated for gadget ${id}. Confirmation Code: ${confirmationCode}`,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to initiate self-destruct sequence. " + err.message,
    });
  }
};

// GET - Retrieve gadgets by status
exports.statusOfGadgets = async (req, res) => {
  try {
    const { status } = req.query;
    if (!status) {
      return res
        .status(400)
        .json({ error: "Please provide a valid 'status' query parameter." });
    }

    const cacheKey = getCacheKey("status", status);
    const cachedGadgets = await redis.get(cacheKey);
    if (cachedGadgets) {
      return res.json(JSON.parse(cachedGadgets));
    }

    const gadgets = await Gadget.findAll({ where: { status } });

    if (gadgets.length === 0) {
      return res
        .status(404)
        .json({ error: `No gadgets found with status '${status}'.` });
    }

    await redis.set(cacheKey, JSON.stringify(gadgets), "EX", 3600); // Cache for 1 hour
    res.json(gadgets);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve gadgets by status. " + err.message });
  }
};
