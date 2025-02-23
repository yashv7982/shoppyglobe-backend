// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /products - fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /products/:id - fetch product details by id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /products - add a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /products/bulk - insert multiple products at once
router.post('/bulk', async (req, res) => {
  try {
    const products = req.body.products;
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: 'Please provide an array of products under the "products" key.' });
    }
    const insertedProducts = await Product.insertMany(products);
    res.status(201).json(insertedProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
