import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { connectDB } from "./wealth-manager/database";
import { Expense } from "./wealth-manager/model";
import { check, validationResult } from "express-validator";

const URI = process.env["MONGO_URI"] || "";
const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());

router.get("/", (req, res) => {
  res.json({
    path: "json",
    author: "Binij Shrestha",
  });
});

router.get("/expenses", async function (req, res) {
  await connectDB(URI);
  const allexpenses = await Expense.find();
  res.status(200);
  res.json(
    JSON.stringify({
      allexpenses,
    })
  );
});

router.post(
  "/create-expenses",
  [
    check("description").isString()
      .isLength({ min: 5 })
      .withMessage("the description must have min length of 5")
      .isLength({ max: 50 })
      .withMessage("the description cannot have length more than 50"),
    check("amount").isFloat({ min: 1 })
    .withMessage("the amount must greater or equals to 1.")
  ],
  async function (req, res) {
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      res.status(422).json({ error: error.array() });      
    }else{
        try {
            await connectDB(URI);
            const newExpense = new Expense({
              date: new Date(req.body.date),
              type: req.body.type,
              method: req.body.method,
              description: req.body.description,
              amount: req.body.amount,
            });
            const result = await newExpense.save();
            res.status(200);
            res.json(result);
          } catch (e) {
            console.log(e);
            res.status(400);
            res.json({ Erorr: "Something Went Wrong!" });
          }
    }
   
  }
);

app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);
