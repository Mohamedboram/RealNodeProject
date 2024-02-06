import createError from "../utlis/createError.js";
import wrappedError from "../utlis/errorHandling.js";

import jwt from "jsonwebtoken";

const verifyIslogin = wrappedError(async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    let error = createError.createError(
      401,
      "Failed to get authorization",
      "Must login first"
    );
    next(error);
  }

  const token = authHeader.split(" ")[1];
  try {
    let payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
   
    req.crrUser = payload;

    next();
  } catch (err) {
    let error = createError.createError(
      401,
      "Failed to get authorization",
      err.message
    );
    next(error);
  }
});
export default verifyIslogin;
export const checkUser = (req, res, next) => {
  if (req.crrUser.id != req.params.id)
    return next(
      createError.createError(
        401,
        "Failed",
        "Not allowed to change data for this user"
      )
    );

  next();
};
