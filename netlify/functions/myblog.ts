import express from "express";
import serverless from "serverless-http";;
import cors from "cors";
import { validationResult } from "express-validator";
import { check } from "express-validator";
import { generateAccessToken, verifyJWT } from "./wealth-manager/middlewares";
const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());

const validUser = [{email: "shresthabinij@gmail.com", password: "sujeeta"}]

// Login USER
router.post("/login", [check("email").isEmail()
.withMessage("the email must be valid.")], async function(req,res){
    const { email, password } = req.body;

    // User info validition
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      return res.status(422).json({ error: error.array() });
    }

    try {
        const existingUser = validUser.find(user=> user.email==email.toLowerCase())

        if (!existingUser) {
            return res.status(400).json({ message: "User not found!" });
          }
        
        // Check Password
        const matchedPassword = existingUser.password == password
      if (!matchedPassword) {
        return res.status(400).json({ message: "Invalid Credential!" });
      }
      const accessToken = generateAccessToken(existingUser);
      const userCredential = {
        email: existingUser.email,
        token: accessToken,
      };

      res.status(200).json({ userCredential });


    }catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
      }
})

// Validate Token USER
router.post("/validate-token", async function(req,res){
  try {
  const { token } = req.body;
  console.log(token);
  if (!token) {
    return res.status(400).json({ message: "Invalid Token!" });
  }

  const result =  await verifyJWT(token);
  res.status(200).json({result})
}
catch(e){
  res.status(500).json({ message: "Internal Server Error" });
}
})

app.use("/.netlify/functions/myblog", router);
module.exports.handler = serverless(app);

