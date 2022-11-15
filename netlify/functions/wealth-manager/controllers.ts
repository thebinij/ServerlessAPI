import { validationResult } from "express-validator";
import { connectDB } from "./database";
import { Expense, User } from "./model";
import bcrypt from "bcrypt";
import { deleteToken, generateAccessToken, generateRefreshToken } from "./middlewares";

const URI = process.env["MONGO_URI"] || "";

export const signinController = async (req,res)=>{
    const {email,password} = req.body;
    // User info validition
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      return res.status(422).json({ error: error.array() }); 
    }     
    try {
        await connectDB(URI);
        // Existing user check
        const existingUser = await User.findOne({email:email})
        if (!existingUser){
            return res.status(400).json({message: "User not found!"})
        }
        // Check Password
        const matchedPassword = await bcrypt.compare(password, existingUser.password ||'');
        if (!matchedPassword){
            return res.status(400).json({message: "Invalid Credential!"})
        }
        const accessToken = generateAccessToken(existingUser)
        const refreshToken = generateRefreshToken(existingUser);
        res.status(200).json({user:existingUser, token: accessToken, refreshToken: refreshToken});
      } catch (e) {
        console.log(e);
        res.status(500).json({ Error: "Internal Server Error" });
      }
}

export const signupController = async (req,res)=>{
    const {fullname,email,password} = req.body;
    // User info validition
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      return res.status(422).json({ error: error.array() });      
    }
    try {
        await connectDB(URI);
        // Existing user check
        const existingUser = await User.findOne({email:email})
        if (existingUser){
            return res.status(400).json({message: "User already exists!"})
        }
        // Password Hashed
        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = new User({
          fullname: fullname,
          email: email,
          password: hashedPassword
        });
        const result = await newUser.save();
        const accessToken = generateAccessToken(existingUser)
        const refreshToken = generateRefreshToken(existingUser);
        res.status(201).json({user:result, token: accessToken, refreshToken: refreshToken});
      } catch (e) {
        console.log(e);
        res.status(500).json({ Error: "Internal Server Error" });
      }
}


export const signOutController = async (req,res)=>{
  if(!req.body.token) return res.status(400).json({Error: "Something Went Wrong!"})
  deleteToken(req.body.token)
  res.status(200).json({message:"Successfully log out!"})
}


export const getExpensesController = async (req,res)=>{
    await connectDB(URI);
    const allexpenses = await Expense.find().sort({ date: "desc" }).limit(2);
    const totalCount = await Expense.countDocuments();
    res.status(200);
    res.json({data:allexpenses,count:totalCount});
}

export const createExpensesController = async (req,res)=>{
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      return res.status(422).json({ error: error.array() });      
    }
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
            res.status(201).json(result);
          } catch (e) {
            console.log(e);
            res.status(500).json({ Error: "Something Went Wrong!" });
          }
}