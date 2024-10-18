const express = require("express");
const productController = require("../Controller/productController");

const roleMiddleware = require("../Middleware/roleMiddleware");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();
//admin can add product only
router.post(
  "/admin/addProduct",
  authMiddleware,
  roleMiddleware,
  productController.addProduct
);
//supplier can add after approval of admin
router.post(
  "/supplier/addProduct",
  authMiddleware,
  roleMiddleware,
  productController.addProduct
);

router.post("/updateProduct", productController.updateProduct);

module.exports = router;
