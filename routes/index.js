const router = require("express").Router();
const authRoutes = require("./auth");
const flashCardRoutes = require('./flashcards');

router.use("/v1/auth",authRoutes);
router.use("/v1/card",flashCardRoutes);

module.exports = router;
