import {} from 'dotenv/config';
import express from "express";
import pg from "pg";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { router as indexRoutes } from "./routes/index.js";

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
app.use(express.static(join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(cookieParser());

app.use("/", indexRoutes);

app.listen(3004);

export { pool };
