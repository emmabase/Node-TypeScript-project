import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../model/userModel";
import { generateToken, isAuthenticated } from "../utils/authentication";

const userRoute = express.Router();


userRoute.get("/", async (req: Request, res: Response) => {
  res.status(202).send({ message: "Welcome to Amazon EC2 Deployment with Node" });
})

userRoute.get("/products", isAuthenticated, async (req: Request, res: Response) => {
  const products = [{productName: "HD Monitor", price: "$1,000", rating: 5, reviews: 200}];
  if (products) {
      return res.status(200).send(products);
  }
  res.status(202).send({ message: "Products not available" });
})

userRoute.post("/register", async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        message: "Already registered. Please Signin to Your Account",
        success: true
      }).status(400);
    }
    const user = new User({ fullName, email, password: bcrypt.hashSync(password, 8), });
    const createdUser = await user.save();
    if (createdUser) {
      const { _id, fullName, email, password, createdAt } = user;
      return res.status(201).json({
        _id, fullName, email, password, createdAt,
        message: `Registration was successful`,
        success: true,
      });
    }
    return res.status(400).json({ message: "Failed to create user data" })

  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
}
);

userRoute.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if (user) {
      const { _id, fullName, email, createdAt} = user;
      if (bcrypt.compareSync(password, user.password)) {
        return res.status(200).send({
          _id, fullName, createdAt,
          token: generateToken({ _id, fullName, email}),
          message: "successfully loggedin",
          success: true
        })
      }
      return res.status(401).json({ message: "Invalid email or password", success: false })
    }
    return res.status(401).json({ message: "Invalid email or password", success: false })
  } catch (error: any) {
    return res.status(500).send({ error: error.message })
  }
});

export default userRoute;
