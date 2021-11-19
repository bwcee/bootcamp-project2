import express from "express";
import { pool } from "../app.js";

export const goHome = (req, res) => {
  res.render("pages/home");
};
