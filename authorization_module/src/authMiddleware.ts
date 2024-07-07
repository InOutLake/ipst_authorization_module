import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} from "./jwt";
import { findUserById } from "./UserRepository";

// TODO review, especialy the way errors are handled
// mb split the logic with external methods
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("Auth middleware have been triggered");
  try {
    const accessToken = req.cookies["accessToken"];
    if (!accessToken) throw new Error("Access token cookie missing");

    const { userId } = verifyAccessToken(accessToken) as JwtPayload;
    const user = await findUserById(userId);
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);
    res.cookie("user", user, {
      expires: expires,
      httpOnly: true,
    });

    console.log("User have logged in successfully!");
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      const refreshToken = req.cookies["refreshToken"];
      if (!refreshToken) throw new Error("Refresh token cookie missing");

      try {
        const { userId } = verifyRefreshToken(refreshToken) as JwtPayload;
        const newAccessToken = generateAccessToken(userId);
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
        });
        const user = findUserById(userId);
        // TODO change garbage storing password info in cookie
        res.cookie("user", user, { httpOnly: true });
      } catch (error) {
        req.cookies["user"] = null;
        console.log("User have been logged out");
        res.redirect("/login");
      }
    } else {
      console.log((error as Error).message);
    }
  }
}
