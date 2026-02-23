export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return sendResponse(res, {
      success: false,
      message: "Token tidak ada",
      status: 401,
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return sendResponse(res, {
      success: false,
      message: "Token tidak valid",
      status: 401,
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendResponse(res, {
        success: false,
        message: "Forbidden",
        status: 403,
      });
    }
    next();
  };
};
