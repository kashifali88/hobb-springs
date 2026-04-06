import Order from '../models/order.model.js';
import Stripe from 'stripe';

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

// ================== CREATE ORDER (COD) ==================
export const createOrder = async (req, res) => {
  try {
    const { cartItems, shippingInfo, totalPrice, paymentMethod } = req.body;
    const { id } = req.user;

    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    if (!shippingInfo)
      return res.status(400).json({ message: 'Address info is required' });

    if (!paymentMethod)
      return res.status(400).json({ message: 'Payment method required' });

    // For COD, save directly
    if (paymentMethod === 'cod') {
      const order = new Order({
        user: id,
        cartItems: cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.productImage,
        })),
        shippingInfo,
        totalPrice,
        paymentMethod,
        isPaid: false,
      });

      const savedOrder = await order.save();
      return res.status(201).json({
        success: true,
        message: 'Order placed successfully (COD)',
        order: savedOrder,
      });
    }

    // For Stripe, redirect to payment
    res.status(400).json({ message: 'Use /create-stripe-session for Stripe' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================== CREATE STRIPE SESSION ==================
export const createStripeSession = async (req, res) => {
  try {
    const { cartItems, shippingInfo, totalPrice } = req.body;

    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    // Stripe line items
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: 'usd', // test currency
        product_data: {
          name: item.product.name,
          images: [item.product.productImage],
        },
        unit_amount: Math.round(item.product.price * 100), // in cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: {
        shippingInfo: JSON.stringify(shippingInfo),
        totalPrice,
        cartItems: JSON.stringify(cartItems), // important to save order later
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================== VERIFY STRIPE PAYMENT & SAVE ORDER ==================
export const verifyStripeSession = async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) return res.status(400).json({ message: 'Session ID required' });

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    const shippingInfo = JSON.parse(session.metadata.shippingInfo);
    const totalPrice = session.metadata.totalPrice;
    const cartItems = JSON.parse(session.metadata.cartItems);

    // Save order in DB
    const order = new Order({
      user: req.user._id,
      cartItems: cartItems.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.productImage,
      })),
      shippingInfo,
      totalPrice,
      paymentMethod: 'stripe',
      isPaid: true,
      paidAt: new Date(),
    });

    const savedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'Order placed successfully (Stripe)',
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================== GET USER ORDERS ==================
export const getUserOrders = async (req, res) => {
    const {id} = req.user
  try {
    const orders = await Order.find({ user: id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};