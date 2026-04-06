import { errorHandler } from "./errorHandler.js";
import jwt from 'jsonwebtoken';



export const verifyToken = async (req, res, next) => {
    const token  = req.cookies.token;
    if(!token) return next(errorHandler(401, 'Not authorized'))
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, 'forbidden'))
        req.user = user;
    next()
        })
}