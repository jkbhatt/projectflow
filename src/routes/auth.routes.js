import express from "express";
import { body } from "express-validator";
import { registerUser, loginuser, logoutuser, getCurrentUser } from "../controllers/auth.controller.js";
import { validatorMiddleware } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { forgotPasswordRequest } from "../controllers/auth.controller.js";
import { resetForgottenPassword } from "../controllers/auth.controller.js";


const router = express.Router();

router.post("/forgot-password", forgotPasswordRequest);

router.post("/reset-password/:token", resetForgottenPassword);

// register route
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("username").notEmpty().withMessage("Username required"),
    body("password").isLength({ min: 6 }).withMessage("Password too short"),
  ],
  validatorMiddleware,
  registerUser
);

// login route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  validatorMiddleware,
  loginuser
);

// logout route (protected)
router.post("/logout", verifyJWT, logoutuser);

// get current user (protected)
router.get("/me", verifyJWT, getCurrentUser);

export default router;