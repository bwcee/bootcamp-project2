import express from "express";
import jsSHA from "jssha";
import {} from "dotenv/config";
import { pool } from "../app.js";

export const goPOS = (req, res) => {
  res.render("pages/pos");
};