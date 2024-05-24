import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({ message: "You are unauthorized." });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req._id = decoded._id;
    next();
  } catch (err) {
    return res.status(401).send({ message: "You are unauthorized." });
  }
};
