import express from "express";
import { migrateToLatest } from "./migrate";
import {
  createUser,
  findUsers,
  findUserById,
  updateUser,
} from "./UserRepository";
import { validateUser, validatePassword } from "./validation";
import { Jwt, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import {
  generateTokens,
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./jwt";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authMiddleware } from "./authMiddleware";
import { mail } from "./mailer";
import { config } from "./config";
import swaggerUi from "swagger-ui-express";
import path from "path";
import YAML from "yamljs";

let app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(async (req, res, next) => {
  console.log(`[${req.method} ${new Date().toString()}] ${req.url}`);
  next();
});
const swaggerDocument = YAML.load(path.join(__dirname, "../docs/swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/register", async (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const newUserObject = {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: req.body.password, // TODO hash password
      is_confirmed: false,
      middlename: req.body.middlename || null,
      username: req.body.username || null,
    };
    validateUser(newUserObject);
    const user = await createUser(newUserObject);
    const token = generateAccessToken(user.id);
    const url = `${config.server.host}:${config.server.port}/confirm_user/${token}`;
    mail(
      "Registration confirmation",
      `Follow the link to confirm your registration: ${url}`,
      req.body.email
    );
    res.status(200).send("Check your mail for confirmation letter");
  } catch (err) {
    return res.status(400).send((err as Error).message);
  }
});

app.get("/confirm_user/:token", (req, res) => {
  const token = req.params.token;
  try {
    const { userId } = verifyAccessToken(token) as JwtPayload;
    if (!userId) throw new Error("User not found");
    updateUser(userId, { is_confirmed: true });
  } catch (error) {
    return res.status(400).send((error as Error).message);
  }
  res.redirect("/");
});

app.get("/password", (req, res) => {
  return res.render("password", { error: "" });
});

app.post("/password", async (req, res) => {
  try {
    const email = req.body.email;
    const user = (await findUsers({ email: email }))[0];
    if (!user) {
      throw new Error("User not found");
    }
    const token = generateAccessToken(user.id);
    const url = `${config.server.host}:${config.server.port}/confirm_password/${token}`;
    mail(
      "New Password",
      `Follow the link to change the password: ${url}`,
      req.body.email
    );
    res.status(200).send("Check your mail for change the password letter");
  } catch (error) {
    return res.status(400).send((error as Error).message);
  }
});

app.get("/confirm_password/:token", (req, res) => {
  return res.render("confirm_password", { error: "", token: req.params.token });
});

app.post("/confirm_password/:token", (req, res) => {
  const token = req.params.token;
  try {
    const { userid } = verifyAccessToken(token) as JwtPayload;
    const newPassword = req.body.password;
    validatePassword(newPassword);
    updateUser(userid, { password: newPassword });
  } catch (error) {
    return res.render("confirm_password", {
      error: (error as Error).message,
      token: token,
    });
  }
  res.status(200).send("Password have been updated successfully");
});

app.get("/login", async (req, res) => {
  res.render("login", { error: "" });
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

// * ---- Test requiring authorization routes ----
app.use(authMiddleware);
app.get("/", async (req, res) => {
  res.send(`Hello fellow user ${req.cookies["user"].name}`);
});

app.listen(8000, () => {
  migrateToLatest();
  console.log(
    `Server is running on  ${config.server.host}:${config.server.port}`
  );
});
