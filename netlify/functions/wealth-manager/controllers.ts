import { validationResult } from "express-validator";
import { connectDB } from "./database";
import { Expense, Stock, User } from "./model";
import bcrypt from "bcrypt";
import {
  deleteToken,
  generateAccessToken,
  generateRefreshToken,
} from "./middlewares";

const URI = process.env["MONGO_URI"] || "";

export const signinController = async (req, res) => {
  const { email, password } = req.body;
  // User info validition
  const error = validationResult(req).formatWith(({ msg }) => msg);
  const hasError = !error.isEmpty();
  if (hasError) {
    return res.status(422).json({ error: error.array() });
  }
  try {
    await connectDB(URI);
    // Existing user check
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found!" });
    }
    // Check Password
    const matchedPassword = await bcrypt.compare(
      password,
      existingUser.password || ""
    );
    if (!matchedPassword) {
      return res.status(400).json({ message: "Invalid Credential!" });
    }
    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);
    const userCredential = {
      fullname: existingUser.fullname,
      email: existingUser.email,
      isVerified: existingUser.isVerfied,
      token: accessToken,
      refreshToken: refreshToken,
    };
    res.status(200).json({ userCredential });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signupController = async (req, res) => {
  const { fullname, email, password } = req.body;
  // User info validition
  console.log(req.body);
  const error = validationResult(req).formatWith(({ msg }) => msg);
  const hasError = !error.isEmpty();
  if (hasError) {
    return res.status(422).json({ error: error.array() });
  }
  try {
    await connectDB(URI);
    // Existing user check
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }
    // Password Hashed
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname: fullname,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    const createdUser = await newUser.save();
    const accessToken = generateAccessToken(createdUser);
    const refreshToken = generateRefreshToken(createdUser);
    const userCredential = {
      fullname: createdUser.fullname,
      email: createdUser.email,
      isVerified: createdUser.isVerfied,
      token: accessToken,
      refreshToken: refreshToken,
    };
    res.status(201).json({ userCredential });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signOutController = async (req, res) => {
  if (req.body.token) {
    deleteToken(req.body.token);
  }
  res.status(200).json({ message: "Successfully log out!" });
};

export const getExpensesController = async (req, res) => {
  try {
    await connectDB(URI);
    if (!req.user.id) {
      res.status(400).json({ message: "Bad Request" });
    }
    const allexpenses = await Expense.find({ userId: req.user.id }).sort({
      date: "desc",
    });
    // .limit(2); await Expense.countDocuments();
    const totalCount = allexpenses.length;
    res.status(200).json({ data: allexpenses, count: totalCount });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something Went Wrong!" });
  }
};

export const createExpensesController = async (req, res) => {
  const error = validationResult(req).formatWith(({ msg }) => msg);
  const hasError = !error.isEmpty();
  if (hasError) {
    return res.status(422).json({ error: error.array() });
  }
  try {
    await connectDB(URI);
    if (!req.user.id) {
      res.status(400).json({ message: "Bad Request" });
    }
    const newExpense = new Expense({
      userId: req.user.id,
      date: new Date(req.body.date),
      type: req.body.type,
      method: req.body.method,
      description: req.body.description,
      amount: req.body.amount,
    });
    const result = await newExpense.save();
    res.status(201).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something Went Wrong!" });
  }
};

export const getStockController = async (req, res) => {
  try {
    await connectDB(URI);
    if (!req.user.id) {
      res.status(400).json({ message: "Bad Request" });
    }
    const allStocks = await Stock.find({ userId: req.user.id }).sort({
      date: "desc",
    });
    // .limit(2); await Expense.countDocuments();
    const totalCount = allStocks.length;
    res.status(200).json({ data: allStocks, count: totalCount });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something Went Wrong!" });
  }
};

export const createStockPurchaseController = async (req, res) => {
  const error = validationResult(req).formatWith(({ msg }) => msg);
  const hasError = !error.isEmpty();
  if (hasError) {
    return res.status(422).json({ error: error.array() });
  }
  try {
    await connectDB(URI);
    if (!req.user.id) {
      res.status(400).json({ message: "Bad Request" });
    }
    const newStockPurchase = new Stock({
      userId: req.user.id,
      date: new Date(req.body.date),
      ticker: req.body.ticker.toUpperCase(),
      actionType: "Buy",
      stockType: req.body.stockType,
      quantity: req.body.quantity,
      costPrice: req.body.costPrice,
      charges: req.body.charges, // fix auto setting of charges
    });
    const result = await newStockPurchase.save();
    res.status(201).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something Went Wrong!" });
  }
};

export const createStockSoldController = async (req, res) => {
  const error = validationResult(req).formatWith(({ msg }) => msg);
  const hasError = !error.isEmpty();
  if (hasError) {
    return res.status(422).json({ error: error.array() });
  }
  try {
    await connectDB(URI);
    if (!req.user.id) {
      res.status(400).json({ message: "Bad Request" });
    }
    const newStockSold = new Stock({
      userId: req.user.id,
      date: new Date(req.body.date),
      ticker: req.body.ticker.toUpperCase(),
      actionType: "Sell",
      quantity: req.body.quantity,
      soldPrice: req.body.soldPrice,
      netCostPrice: req.body.netCostPrice,
      charges: req.body.charges, // fix auto setting of charges
      taxes: req.body.taxes, // fix auto setting of taxes
    });
    const result = await newStockSold.save();
    res.status(201).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something Went Wrong!" });
  }
};
