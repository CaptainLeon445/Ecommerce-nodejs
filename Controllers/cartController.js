const session = require("express-session");
const Products = require("../Model/productsModel");
const Cart = require("../Model/cartModel");

exports.getCart = async (req, res) => {
  try {
    const cart = req.session.cart || [];
    res.status(200).json({
      message: "success",
      results: cart.length,
      cart,
    });
  } catch (err) {
    res.status(400).json({
      message: "success",
      err: err.message,
    });
  }
};

exports.createCart = async (req, res) => {
  try {
    req.body.product = req.params.prdId;
    const content = req.body;
    // Retrieve the user's cart from the session or create a new one
    let cart = req.session.cart || [];

    // Check if the product already exists in the cart
    const existingItemIndex = cart.findIndex(
      (item) => item.product === content.product
    );

    if (existingItemIndex !== -1) {
      // If the product exists, update its quantity
      cart[existingItemIndex].quantity += content.quantity;
    } else {
      // If the product is new, add it to the cart
      cart.push(content);
    }

    // Save the updated cart to the session
    req.session.cart = cart;
    res.status(201).json({
      message: "Item added to Cart.",
      cart,
    });
  } catch (err) {
    res.status(400).json({
      message: "success",
      err: err.message,
    });
  }
};

exports.getAReview = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Cart.findById(id);
    res.status(200).json({
      message: "success",
      data,
    });
  } catch (err) {
    res.status(400).json({
      message: "success",
      err: err.message,
    });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const { prdId } = req.params;

    // Retrieve the user's cart from the session
    const cart = req.session.cart || [];

    // Filter out the item to be removed
    const updatedCart = cart.filter((item) => item.product !== prdId);

    // Update the cart in the session
    req.session.cart = updatedCart;
    res.status(204).json({
      message: "Item removed from cart.",
    });
  } catch (err) {
    res.status(400).json({
      message: "success",
      err: err.message,
    });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const id = req.params.id;
    const content = req.body;
    const data = await Cart.findByIdAndUpdate(id, content, {
      new: true,
      runValidators: true,
    });
    await data.save();
    res.status(200).json({
      message: "success",
      data,
    });
  } catch (err) {
    res.status(400).json({
      message: "success",
      err: err.message,
    });
  }
};
