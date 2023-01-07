import jwt from "jsonwebtoken";
let refreshTokens:string[]= [];

const SECRET_ACCESS_KEY = process.env['ACCESS_TOKEN'] || "secret";
const SECRET_REFRESH_KEY = process.env['REFRESH_TOKEN'] || 'refresh';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized User!" });
  jwt.verify(token, SECRET_ACCESS_KEY, function (err, user) {
    if (err) return res.status(403).json({ message: "Invalid Access!" });
    req.user = user;
    next();
  });
};

export const generateAccessToken = (user) =>{
  return jwt.sign({id: user._id || user.id, email: user.email},SECRET_ACCESS_KEY,{expiresIn: '1h'})
}

export const generateRefreshToken = (user) =>{
  const refreshToken = jwt.sign({email: user.email},SECRET_REFRESH_KEY,{expiresIn: '5m'})
  refreshTokens.push(refreshToken)
  return refreshToken;
}

export const generateToken = (req,res)=>{
  const refreshToken:string = req.body.token;
  if (refreshToken == null) return res.status(401).json({message:"Invalid Refresh Token!"})
  if (!refreshTokens.includes(refreshToken)) return res.status(403).json({message:"Expired Refresh Token!"})
  jwt.verify(refreshToken,SECRET_REFRESH_KEY, function(err,user){
    if (err) return res.status(403).json({message:"Something went wrong!"})
    const accessToken = generateAccessToken(user);
    return res.json({accessToken: accessToken})
  })
}

export const deleteToken = (refreshtoken)=>{
  refreshTokens = refreshTokens.filter(token => token !== refreshtoken)
}

export async function verifyJWT(token: string) {
  try {
    return { payload: jwt.verify(token, SECRET_ACCESS_KEY), expired: false };
  } catch (error) {
    if ((error as Error).name == "TokenExpiredError") {
      return { payload: jwt.decode(token), expired: true };
    }
    throw error;
  }
}
