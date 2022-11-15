import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { check } from "express-validator";
import { createExpensesController, getExpensesController, signinController, signOutController, signupController } from "./wealth-manager/controllers";
import { authenticateToken, generateToken } from "./wealth-manager/middlewares";

const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());

// Refresh Access Token 
router.post('/token', generateToken)

// Login USER
router.post("/login", [check("email").isEmail()
.withMessage("the email must be valid.")], signinController)

// Logout USER
router.post("/logout", signOutController)

// SignUP New User
router.post("/signup",[
  check("fullname").isString()
    .isLength({ min: 2 })
    .withMessage("the fullname is too short."),
  check("email").isEmail()
  .withMessage("the email must be valid."),
  check("password").isStrongPassword()
  .withMessage("the password is too weak.")
], signupController)

//Get All Expenses
router.get("/expenses",authenticateToken, getExpensesController);

//Create New Expense
router.post(
  "/expenses",
  authenticateToken,
  [
    check("description").isString()
      .isLength({ min: 5 })
      .withMessage("the description must have min length of 5")
      .isLength({ max: 50 })
      .withMessage("the description cannot have length more than 50"),
    check("amount").isFloat({ min: 1 })
    .withMessage("the amount must greater or equals to 1.")
  ],
  createExpensesController
);

app.use("/.netlify/functions/wealthmanager", router);
module.exports.handler = serverless(app);
