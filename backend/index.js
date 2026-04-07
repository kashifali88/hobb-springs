import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import categoryRouter from './routes/category.route.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';
import orderRouter from './routes/order.route.js';
import cors from 'cors'

dotenv.config();
const server = express();

// parsers
server.use(express.json());
server.use(cookieParser());
server.use(cors({
  origin: [
    "http://localhost:5173",
    "https://hobb-springs-ecommerce.onrender.com"
  ],
  credentials: true
}));


// API routes
server.use('/api/user', userRouter);
server.use('/api/auth', authRouter);
server.use('/api/category', categoryRouter);
server.use('/api/products', productRouter);
server.use('/api/cart', cartRouter);
server.use('/api/order', orderRouter);

// Global error handler
server.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "something went wrong"
    res.status(status).json({
        success: false,
        message,
        stack: err.stack
    })
})

// MongoDB connection
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Successfully connected to MongoDB");
        
    } catch (error) {
        console.log("MongoDB connection failed", error);
        
    }
}

const PORT = process.env.PORT || 5000;
server.listen(PORT,() => {
console.log(`Server is working on PORT:${PORT}`);
connect()
})

