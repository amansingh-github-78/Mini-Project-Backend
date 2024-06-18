const express = require('express');
const router = express.Router();
const Product = require('../models/productsModel');
const mongoose = require('mongoose');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get products by category
router.get('/category/:categoryId', async (req, res) => {
  const { categoryId } = req.params;

  // Check if the categoryId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    const products = await Product.find({ category: new mongoose.Types.ObjectId(categoryId) }).populate('category');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a product
router.post('/', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    price: req.body.price,
    color: req.body.color,
    badge: req.body.badge,
    description: req.body.description,
    category: req.body.category,
    brand: req.body.brand,
    pdf: req.body.pdf,
    specifications: req.body.specifications
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.body.name != null) {
      product.name = req.body.name;
    }
    if (req.body.image != null) {
      product.image = req.body.image;
    }
    if (req.body.price != null) {
      product.price = req.body.price;
    }
    if (req.body.color != null) {
      product.color = req.body.color;
    }
    if (req.body.badge != null) {
      product.badge = req.body.badge;
    }
    if (req.body.description != null) {
      product.description = req.body.description;
    }
    if (req.body.category != null) {
      product.category = req.body.category;
    }
    if (req.body.brand != null) {
      product.brand = req.body.brand;
    }
    if (req.body.pdf != null) {
      product.pdf = req.body.pdf;
    }
    if (req.body.specifications != null) {
      product.specifications = req.body.specifications;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

