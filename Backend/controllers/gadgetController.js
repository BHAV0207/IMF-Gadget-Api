const { Gadget } = require("../models");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {
  generateRandomName,
  generateRandomCode,
  generateProbability,
} = require("../utils/randomUtils");

// GET
exports.getAllGadgets = async (req, res) => {
  try {
    const gadgets = await Gadget.findAll();
    const gadgetsWithProbability = gadgets.map((gadget) => ({
      ...gadget.toJSON(),
      missionSuccessProbability: `${generateProbability()}%`,
    }));
    res.json(gadgetsWithProbability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST 
exports.addGadget = async (req, res) => {
  try {
    const { name } = req.body;
    const newGadget = await Gadget.create({ name: generateRandomName() });

    const token = jwt.sign({ gadgetId: newGadget.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ newGadget, token });
  } catch (err) {
    res.status(500).json({ error: err.message + "checking this log" });
  }
};

// PATCH
exports.updateGadget = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    const updated = await Gadget.update({ name, status }, { where: { id } });
    if (updated[0]) {
      res.json({ message: "Gadget updated successfully" });
    } else {
      res.status(404).json({ error: "Gadget not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE 
exports.deleteGadget = async (req, res) => {
  try {
    const { id } = req.params;
    const gadget = await Gadget.findByPk(id);
    if (gadget) {
      gadget.status = "Decommissioned";
      gadget.decommissionedAt = new Date();
      await gadget.save();
      res.json({ message: "Gadget decommissioned successfully" });
    } else {
      res.status(404).json({ error: "Gadget not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST
exports.selfDestruct = async (req, res) => {
  try {
    const { id } = req.params;
    const confirmationCode = generateRandomCode();
    res.json({
      message: `Self-destruct sequence initiated for gadget ${id}. Confirmation Code: ${confirmationCode}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
