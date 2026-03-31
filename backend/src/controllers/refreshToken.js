import { refreshTokenService } from "../services/refreshTokenService.js";
export const refreshToken = async (req, res) => {
    try {
      const { token } = req.body;
      const newToken = await refreshTokenService(token);
      res.json({ newToken: newToken });
    } catch (error) {
      res.status(401).json({ message: "Invalid Token" });
    }
  };
  
