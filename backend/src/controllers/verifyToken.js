import jwt from "jsonwebtoken";
import { secretKey } from "../config/jwt.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if(!authHeader) {
    return res.status(401).json({ message: "Unauthorized: Missing Token" });
  }

  const [bearer, token] = authHeader.split(" ");
  if(bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "Unauthorized: Invalid Token Format" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if(err) {
      return res.status(403).json({ message: "Forbidden: Invalid Token" });
    }
    req.user = user;
    next();
  })
}

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(403).json({ message: "Token verification failed", error: error.message });
  }
};
