const session = require("express-session");
const Products = require("../Model/productsModel");
const Cart = require("../Model/cartModel");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");

exports.getCart = catchAsyncError(async (req, res) => {
  const cart = req.session.cart || [];
  res.status(200).json({
    message: "success",
    results: cart.length,
    cart,
  });
});

exports.createCart = catchAsyncError(async (req, res) => {
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
});

exports.getToal = catchAsyncError(async (req, res) => {
  const cart = req.session.cart || [];
  let totalPrice = 0;
  console.log("Cart", cart);
  for (const item of cart) {
    const product = await Products.findById(item.product);
    if (product) {
      const subtotal = item.quantity * product.price;
      totalPrice += subtotal;
    }
  }
  res.status(200).json({
    message: "success",
    results: cart.length,
    totalPrice,
  });
});

exports.deleteCart = catchAsyncError(async (req, res) => {
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
});

exports.updateCart = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const content = req.body;
  const data = await Cart.findByIdAndUpdate(id, content, {
    new: true,
    runValidators: true,
  });
  if (!data) {
    return next(new AppError("No Item with the ID", 400));
  }
  await data.save();
  res.status(200).json({
    message: "success",
    data,
  });
});
