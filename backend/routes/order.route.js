import express from 'express'
import { createOrder, createStripeSession, getUserOrders } from '../controllers/order.controller.js';
import { verifyToken } from '../utils/verifyToken.js'

const orderRouter = new express.Router();


orderRouter.post('/create-order', verifyToken, createOrder)
orderRouter.post('/stripe', verifyToken, createStripeSession)
orderRouter.get('/user/orders', verifyToken, getUserOrders)



export default orderRouter;