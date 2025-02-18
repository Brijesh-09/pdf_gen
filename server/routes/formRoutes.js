const express = require("express");
const router = express.Router();
const {
  create,
  newCreate,
  update,
  list,
  one
} = require("../controllers/fromController.js");
const { authenticateToken } = require("../controllers/userController.js");

router.get("/list", authenticateToken, list);
router.get("/list/:id", authenticateToken, one);
router.post("/create", create);
router.put("/update/:id", authenticateToken, update);



router.post("/newCreate", newCreate);


module.exports = router;
