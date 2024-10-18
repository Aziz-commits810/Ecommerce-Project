const supplierController = require("../Controller/supplierController");
const express = require("express");

const router = express.Router();

router.post(
  "/requestSupplier",
  authMiddleware,
  supplierController.requestSupplierAccess
);
router.post(
  "/admin/approveSupplier/:id",
  authMiddleware,
  roleMiddleware("admin"),
  supplierController.approveSupplier
);

module.exports = router;
