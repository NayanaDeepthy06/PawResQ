import jwt from "jsonwebtoken";

function verifyNGO(
  req,
  res,
  next
) {
    console.log(
    "verifyNGO middleware reached"
  );
  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );
         console.log(
        "JWT VERIFIED:",
        decoded
        ); 

    req.ngo = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });

  }
}

export default verifyNGO;