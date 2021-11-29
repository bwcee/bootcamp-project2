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

export const doCashier = (req, res) => {
  const saleItemsArr = Object.values(req.body)[0];
  // console.log("This is req.body", req.body);
  // console.log("This is saleItemsArr", saleItemsArr);
  const addSale = `INSERT INTO sales (user_id) VALUES (${req.user.id}) RETURNING *`;
  pool
    .query(addSale)
    .then((result) => {
      const sale_id = result.rows[0].id;
      const addSaleItem = `INSERT INTO sales_items (sales_id, item_id, count) VALUES ($1, $2, $3)`;
      return Promise.all(
        saleItemsArr.map((sale_row) => {
          return pool.query(addSaleItem, [
            sale_id,
            sale_row.id,
            sale_row.count,
          ]);
        })
      );
    })
    .then((result) => {
      // console.log("This is all the results from Promise.all", result);
      return res.redirect(301, "/sales/cashier");
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};
