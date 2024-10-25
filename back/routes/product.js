const express = require("express");
const router = express.Router();

const productCtrl = require("../controllers/product");

router.get("/", productCtrl.getAllProducts);
router.get("/:id", productCtrl.getOneProduct);
router.post("/order", productCtrl.orderProducts);

module.exports = router;

module.exports = (req, res) => {
  res.status(200).json({ message: "Hello from the product route!" });
};
