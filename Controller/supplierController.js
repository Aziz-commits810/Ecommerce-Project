const supplierRequest = require("../Model/supplierRequest");
const User = require("../Model/userModel");

///here suplier request aceess
const requestSupplierAccess = async (req, res) => {
  const request = await supplierRequest.create({ userId: req.user.id });
  res.status(201).json({ message: "Request sent to admin" });
};

//approve suplier here
const approveSupplier = async (req, res) => {
  const request = await supplierRequest.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  await request.update({ status: "approved" });

  const user = await User.findByPk(request.userId);
  await user.update({ role: "supplier" });

  res.status(200).json({ message: "Supplier approved" });
};

module.exports = {
  requestSupplierAccess,
  approveSupplier,
};
