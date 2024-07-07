import express from "express";
import { migrateToLatest } from "./migrate";
import {
  createUser,
  findUsers,
  findUserById,
  updateUser,
} from "./UserRepository";
import { validateUser, validatePassword } from "./validation";
import { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import {
  generateTokens,
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./jwt";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authMiddleware } from "./authMiddleware";

let app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(async (req, res, next) => {
  console.log(`[${new Date().toString()}] ${req.url}`);
  next();
});

app.get("/login", async (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  let users = await findUsers({
    name: req.body.username,
    password: req.body.password, // TODO password should be hashed
  });
  if (users.length === 0) {
    res.render("login", { error: "Invalid username or password" });
  }
  let user = users[0];
  const { accessToken, refreshToken } = generateTokens(user.id);
  res.cookie("accessToken", accessToken, { httpOnly: true });
  res.cookie("refreshToken", refreshToken, { httpOnly: true });
  res.redirect("/");
});

app.get("/register", async (req, res) => {
  res.render("register");
});

// ! Not tested, prbbl wont work
app.post("/register", async (req, res) => {
  try {
    validateUser(req.body); // TODO create user object beforehead

    const newUserObject = {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: req.body.password, // TODO hash password
      is_confirmed: false,
      middlename: req.body.middlename || null,
      username: req.body.username || null,
    };

    createUser(newUserObject);
  } catch (err) {
    return res.status(400).send((err as Error).message);
  }

  res.redirect("/login");
});

app.post("/password", async (req, res) => {
  try {
    const newPassword = req.body.password;
    validatePassword(newPassword);
    const email = req.body.email;
    const user = (await findUsers({ email: email }))[0];
    if (!user) {
      throw new Error("User not found");
    }
    updateUser(user.id, { password: newPassword }); // TODO hash password
  } catch (error) {
    // TODO handle error
  }
});

// * ---- Routes require authorization ----
app.use(authMiddleware);
app.get("/", async (req, res) => {
  res.send(`Hello fellow user ${req.cookies["user"].name}`);
});

app.listen(8000, () => {
  migrateToLatest();
  console.log("Server is running on port 8000");
});
