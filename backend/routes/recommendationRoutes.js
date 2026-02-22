const express = require("express");
const router = express.Router();
const Contract = require("../models/Contract");
const generateRecommendation = require("../services/comparisonEngine");

router.get("/:id", async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const recommendation = generateRecommendation(contract);

    res.json(recommendation);
  } catch (err) {
    res.status(500).json({ message: "Error generating recommendation" });
  }
});

module.exports = router;