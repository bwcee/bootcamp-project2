import express from "express";
import { pool } from "../app.js";

//////////////////////////////////
// error handling
//////////////////////////////////
export const salesErrorHandler = (err, res) => {
  console.error("Error you doofus!", err);
  const data = {
    text: "Sorry there is an error. Go back to dashboard and try again.",
    link: "/admin/dash",
    link_text: "Dash",
  };
  return res.render("pages/error", { data });
};

//////////////////////////////////
// cashier controllers
//////////////////////////////////
export const goCashier = (req, res) => {
  const getItems = `SELECT items.*, categories.category FROM items INNER JOIN categories ON items.cat_id=categories.id WHERE items.co_id=${req.user.co_id} ORDER BY item`;
  pool
    .query(getItems)
    .then((result) => {
      const allItems = result.rows;
      res.render("pages/cashier", { allItems });
    })
    .catch((err) => {
      return salesErrorHandler(err, res);
    });
};
