const Product = require("../Model/productModel");

//add product controller
const addProduct = async (req, res) => {
  try {
    const { name, price, description, stock, categoryId } = req.body;
    const newProduct = await Product.create({
      name,
      price,
      description,
      stock,
      categoryId,
      supplierId: req.user.id,
    });
    res.status(201).json({
      message: "Product add successfully",
      data: {
        product: newProduct,
      },
    });
  } catch (error) {
    console.error("print the error", error);
    return res.status(500).json({
      message: "Error add product",
    });
  }
};

//update  produdct controller
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, stock } = req.body;
  try {
    const Product = await Product.findbypk(id);
    if (!Product) {
      return res.status(400).json({ message: "product not exist" });
    }
    console.log(Product);

    Product.name = name || Product.name;
    Product.price = price || Product.price;
    Product.description = description || Product.description;
    Product.stock = stock || Product.stock;

    await Product.save();

    return res.status(200).json(Product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "product not updated got an error", error });
  }
};
module.exports = {
  addProduct,
  updateProduct,
};
