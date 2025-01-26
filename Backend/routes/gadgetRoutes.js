const express = require("express");
const router = express.Router();
const gadgetController = require("../controllers/gadgetController");
const authenticate = require("../middlewares/authMiddleware");

router.get("/gadgets", gadgetController.getAllGadgets);
router.post("/gadgets", gadgetController.addGadget);
router.patch("/gadgets/:id", authenticate, gadgetController.updateGadget);
router.delete("/gadgets/:id", authenticate, gadgetController.deleteGadget);
router.post(
  "/gadgets/:id/self-destruct",
  authenticate,
  gadgetController.selfDestruct
);

router.get("/gadgets/status", gadgetController.statusOfGadgets);


module.exports = router;
