import express, { response } from "express";
import jsSHA from "jssha";
import {} from "dotenv/config";
import { pool } from "../app.js";

const getHash = (input) => {
  const SALT = process.env.SALT;
  const shaObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" });
  const saltedInput = input + SALT;
  shaObj.update(saltedInput);
  return shaObj.getHash("HEX");
};

export const goHome = (req, res) => {
  res.render("pages/home");
};

export const goSignup = (req, res) => {
  res.render("pages/signup");
};

export const doSignup = (req, res) => {
  const arr = Object.values(req.body);
  const hashedPass = getHash(arr[1]);
  arr.splice(1, 1, hashedPass);
  const newSignup = `INSERT INTO users (email, password) VALUES ($1, $2)`;
  pool
    .query(newSignup, arr)
    .then((result) => {
      console.log(result);
      return res.redirect(301, "/index");
    })
    .catch((err) => {
      console.error("Error you doofus!", err);
      const data = {
        text: "Sorry there is an error, probably cos email alr taken. Go back to Home page and try again.",
      };
      return res.render("pages/error", { data });
    });
};

export const goSignin = (req, res) => {
  res.render("pages/signin");
};

export const doSignin = (req, res) => {
  const arr = Object.values(req.body);
  const selectUser = "SELECT * FROM users WHERE email=$1";
  pool
    .query(selectUser, [arr[0]])
    .then((result) => {
      if (result.rows.length === 0) {
        throw "The doofus tried a non-existent email";
      }
      const dbPass = result.rows[0].password;
      const hashedPass = getHash(arr[1]);
      const hashedEmail = getHash(arr[0]);
      if (hashedPass === dbPass) {
        res.cookie("loggedIn", true);
        res.cookie("hashedID", hashedEmail);
        res.cookie("userID", result.rows[0].id)
        return res.redirect(301, "/index");
      } else {
        throw "The doofus used a wrong password";
      }
    })
    .catch((err) => {
      console.error("Error you doofus!", err);
      const data = {
        text: "Sorry, login fail. Please try again.",
      };
      return res.render("pages/error", { data });
    });
};

export const doLogout = (req, res) => {
  res.clearCookie("loggedIn");
  res.clearCookie("hashedID");
  res.clearCookie("userID");
  return res.redirect(301, "/index");
};