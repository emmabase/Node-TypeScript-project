import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from 'mongodb';

interface userDetails {
  _id: ObjectId;
  fullName: string;
  email: string;
 
}

export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const generateToken = (user: userDetails) => {
  const { _id, fullName, email } = user;
  return jwt.sign(
    { _id, fullName, email},
    process.env.JWT_SECRET || "averysecretkey",
    {
      expiresIn: "30d",
    }
  );
};

export const isAuthenticated: MiddlewareFunction = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(
      token,
      process.env.JWT_SECRET || "averysecretkey",
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: "Invalid token supplied" });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).send({ message: "Unauthorized operation to protected resource" });
  }
};





