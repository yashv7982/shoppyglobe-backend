// routes/cart.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// POST /cart - add a product to the cart (protected)
router.post('/', auth, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(item =>
      item.product.toString() === productId
    );
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /cart/:id - update quantity for a product in the cart (protected)
router.put('/:id', auth, async (req, res) => {
  const { quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    const itemIndex = cart.items.findIndex(item =>
      item.product.toString() === req.params.id
    );
    if (itemIndex === -1)
      return res.status(404).json({ error: 'Product not found in cart' });
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /cart/:id - remove a product from the cart (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.id
    );
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
