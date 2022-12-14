import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { check } from "express-validator";
import { createExpensesController, createStockPurchaseController, createStockSoldController, getExpensesController, getStockController,  signinController, signOutController, signupController } from "./wealth-manager/controllers";
import { authenticateToken, generateToken } from "./wealth-manager/middlewares";

const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());

// Refresh Access Token 
router.post('/token', generateToken)

// Login USER
router.post("/auth/login", [check("email").isEmail()
.withMessage("the email must be valid.")], signinController)

// Logout USER
router.post("/auth/logout", signOutController)

// SignUP New User
router.post("/auth/signup",[
  check("fullname").isString()
    .isLength({ min: 2 })
    .withMessage("the fullname is too short."),
  check("email").isEmail()
  .withMessage("the email must be valid."),
  check("password").isLength({min:8})
  .withMessage("the password should be at least 8 character long.")
], signupController)

//Get All Expenses
router.get("/expenses",authenticateToken, getExpensesController);

//Get All Stocks
router.get("/stocks",authenticateToken, getStockController);

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

//Create New Stock Purchase
router.post(
  "/stocks-purchases",
  authenticateToken,
  [
    check("quantity").isFloat({ min: 0 })
    .withMessage("the amount must greater or equals to 0."),
    check("costPrice").isFloat({ min: 0 })
    .withMessage("the costprice must greater or equals to 0.")
  ],
  createStockPurchaseController);

app.use("/.netlify/functions/wealthmanager", router);
module.exports.handler = serverless(app);


//Create New Stock Sold
router.post(
  "/stocks-sold",
  authenticateToken,
  [
    check("quantity").isFloat({ min: 0 })
    .withMessage("the amount must greater or equals to 0."),
    check("netCostPrice").isFloat({ min: 0 })
    .withMessage("the amount must greater or equals to 0."),
    check("soldPrice").isFloat({ min: 0 })
    .withMessage("the amount must greater or equals to 0.")
  ],
  createStockSoldController);

app.use("/.netlify/functions/wealthmanager", router);
module.exports.handler = serverless(app);

