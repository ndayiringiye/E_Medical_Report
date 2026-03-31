import jwt from "jsonwebtoken";
const refreshTokenService = async (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return reject("Invalid token");
        const { userId, email, role } = decoded;
        const newAccessToken = jwt.sign(
          { userId, email, role },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        resolve(newAccessToken);
      });
    });
  };
  export default refreshTokenService;
  