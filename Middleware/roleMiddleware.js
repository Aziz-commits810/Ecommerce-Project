const roleMiddleware = async (req, res, next) => {
  const role = req.user;
  if (!role) {
    return res.status(403).json({ message: "forbidden" });
  }
  req.user.role;
  next();
};
module.exports = roleMiddleware;
