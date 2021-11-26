import express from "express";
import pg from "pg";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { router as userRoutes } from "./routes/user.js";
import { router as adminRoutes } from "./routes/admin.js";
import { router as salesRoutes } from "./routes/sales.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const { Pool } = pg;
const pgConfig = {
  user: "bw_unix",
  host: "localhost",
  database: "pos",
  port: 5432,
};
const pool = new Pool(pgConfig);

const app = express();
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(join(__dirname, "/public")));
app.use(express.static(join(__dirname, "/controllers")));
app.use(express.static(join(__dirname, "/node_modules")));
app.use(express.static(join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use((req, res, next) => {
  req.userLoggedIn = false;
  req.cookies.loggedIn ? (req.userLoggedIn = true) : "";
  next();
});

const lockedAccess = (req, res, next) => {
  if (req.userLoggedIn === false) {
    const data = {
      text: "Whatcha doin? You ain't no have access. Go back and try again!",
    };
    return res.render("pages/error", { data });
  } else {
    const userQuery = "SELECT * FROM users WHERE id=$1";
    pool
      .query(userQuery, [req.cookies.userID])
      .then((result) => {
        req.user = result.rows[0];
        next();
      })
      .catch((err) => {
        const data = {
          text: "Something went wrong... go back and try again",
        };
        return res.render("pages/error", { data });
      });
  }
};

app.use("/", userRoutes);
app.use("/admin", lockedAccess, adminRoutes);
app.use("/sales", lockedAccess, salesRoutes);

app.listen(3004);

export { pool };
