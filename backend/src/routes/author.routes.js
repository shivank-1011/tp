const express = require("express");
const authorController = require("../controllers/author.controller");

const router = express.Router();

router.get("/", authorController.list);
router.get("/:id", authorController.detail);
router.post("/", authorController.create);
router.put("/:id", authorController.update);
router.delete("/:id", authorController.remove);

module.exports = router;
