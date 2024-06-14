// src/controllers/product.controller.js
import Product from "../models/product.model.js";

// Get all products
export const getAllProducts = async (req, res) => {
  const { page = 1, limit = 10, search = "", category = "" } = req.query;
  try {
    const query = {};
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [{ name: searchRegex }, { description: searchRegex }];
    }
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(query);

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving products", error: err.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching product details", error: err.message });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating product", error: err.message });
  }
};

// Add a new product
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      discountPercentage,
      category,
      stock,
      imageUrl,
    } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      discountPrice,
      discountPercentage,
      category,
      imageUrl,
      stock,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding product", error: err.message });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: err.message });
  }
};
