import jwt from "jsonwebtoken";

export default function verifyVolunteer(
  req,
  res,
  next
) {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({
        message:
          "No token provided",
      });

    }

    const token =
      authHeader.split(" ")[1];

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.volunteer =
      decoded;

    next();

  } catch (error) {

    res.status(401).json({
      message:
        "Invalid token",
    });

  }

}