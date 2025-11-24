const express = require("express");
const genreController = require("../controllers/genre.controller");

const router = express.Router();

router.get("/", genreController.list);
router.get("/:id", genreController.detail);
router.post("/", genreController.create);
router.put("/:id", genreController.update);
router.delete("/:id", genreController.remove);

module.exports = router;
