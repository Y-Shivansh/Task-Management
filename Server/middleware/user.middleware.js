import jwt from "jsonwebtoken"
import { SECRET_KEY } from "../config/jwt.config.js";

export const verifyUserToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(403).json({ message: "Access denied. No token provided." });
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or Forbidden Token", err });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Invalid or expired token." });
    }
};