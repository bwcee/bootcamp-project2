import express from "express";
import jsSHA from "jssha";
import {} from "dotenv/config";
import { pool } from "../app.js";

//////////////////////////////////
// error handling
//////////////////////////////////
export const adminErrorHandler = (err, res) => {
  console.error("Error you doofus!", err);
  const data = {
    text: "Sorry there is an error. Go back to dashboard and try again.",
    link: "/admin/dash",
    link_text: "Dash",
  };
  return res.render("pages/error", { data });
};

//////////////////////////////////
// start dashboard controllers
//////////////////////////////////
export const goStart = (req, res) => {
  res.render("pages/dash");
};

//////////////////////////////////
// employee controllers
//////////////////////////////////
export const goAddE = (req, res) => {
  const getEmployees = `SELECT users.*, roles.role FROM users INNER JOIN roles ON users.role_id=roles.id WHERE co_id=${req.user.co_id} AND role_id=2`;
  pool
    .query(getEmployees)
    .then((result) => {
      const allEmployees = result.rows;
      return res.render("pages/employee", { allEmployees });
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

export const doAddE = (req, res) => {
  const arr = Object.values(req.body);
  arr.push(2); // add default role of employee
  arr.push(req.user.co_id); // get co_id from req.user which was created in lockedAccess()
  const addEmployee = `INSERT INTO users (name, email, phone, role_id, co_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  pool
    .query(addEmployee, arr)
    .then(() => {
      return res.redirect(301, "/admin/employee");
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

export const goUpdateE = (req, res) => {
  const { idToUpdate } = req.params;
  const getEmployee = `SELECT * FROM users WHERE id=${idToUpdate}`;
  pool
    .query(getEmployee)
    .then((result) => {
      const editEmployee = result.rows[0];
      return res.render("pages/employee_edit", { editEmployee });
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

export const doUpdateE = (req, res) => {
  const arr = Object.values(req.body);
  const { idToUpdate } = req.params;
  const updateEmployee = `UPDATE users SET name=$1, email=$2, phone=$3 WHERE id=${idToUpdate}`;
  pool
    .query(updateEmployee, arr)
    .then(() => {
      return res.redirect(301, "/admin/employee");
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

export const doDeleteE = (req, res) => {
  const { idToDelete } = req.params;
  const deleteQuery = `DELETE FROM users WHERE id=${idToDelete}`;
  pool
    .query(deleteQuery)
    .then(() => {
      return res.redirect(301, "/admin/employee");
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

//////////////////////////////////
// profile controllers
//////////////////////////////////
export const goUpdateP = (req, res) => {
  const getProfile = `SELECT users.*, companies.name as co_name FROM users INNER JOIN companies ON users.co_id=companies.id WHERE users.id=${req.user.id}`;
  pool
    .query(getProfile)
    .then((result) => {
      const profile = result.rows[0];
      return res.render("pages/profile", { profile });
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

export const doUpdateP = (req, res) => {
  const arr = Object.values(req.body);
  const biz_name = arr.pop();
  const updateProfile = `UPDATE users SET name=$1, email=$2, phone=$3 WHERE id=${req.user.id} RETURNING *`;
  pool
    .query(updateProfile, arr)
    .then((result) => {
      const updateCo = `UPDATE companies SET name=$1 WHERE id=${result.rows[0].co_id}`;
      pool.query(updateCo, [biz_name]);
      return res.redirect(301, "/admin/dash");
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

//////////////////////////////////
// item controllers
//////////////////////////////////
export const goAddItems = (req, res) => {
  const getItems = `SELECT items.*, categories.category FROM items INNER JOIN categories ON items.cat_id=categories.id WHERE items.co_id=${req.user.co_id}`;
  const getCats = `SELECT * FROM categories WHERE co_id=${req.user.co_id}`;
  let reqArr = [];
  pool
    .query(getItems)
    .then((result) => {
      const data = { items: result.rows };
      reqArr.push(data);
      return pool.query(getCats);
    })
    .then((result) => {
      const data = { categories: result.rows };
      reqArr.push(data);
      return res.render("pages/items", { reqArr });
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

export const doAddItems = (req, res) => {
  const itemArr = Object.values(req.body).slice(0, 4);
  itemArr.push(req.user.co_id);
  const addItem = `INSERT INTO items (item, price, cost, cat_id, co_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  pool
    .query(addItem, itemArr)
    .then((result) => {
      const item_id = result.rows[0].id;
      if (req.file !== undefined) {
        const addItemImage = `UPDATE items SET image=$1 WHERE id=${item_id}`;
        pool.query(addItemImage, [req.file.filename]);
      }
      return res.redirect(301, "/admin/items");
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

export const goUpdateItems = (req, res) => {
  const { idToUpdate } = req.params;
  const getitem = `SELECT * FROM items WHERE id=${idToUpdate}`;
  const getCats = `SELECT * FROM categories WHERE co_id=${req.user.co_id}`;
  let reqArr = [];
  pool
    .query(getitem)
    .then((result) => {
      reqArr.push(result.rows[0]);
      return pool.query(getCats);
    })
    .then((result) => {
      const data = { categories: result.rows };
      reqArr.push(data);
      return res.render("pages/items_edit", { reqArr });
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

export const doUpdateItems = (req, res) => {
  const arr = Object.values(req.body).slice(0,4);
  const { idToUpdate } = req.params;
  const updateItem = `UPDATE items SET item=$1, price=$2, cost=$3, cat_id=$4 WHERE id=${idToUpdate} RETURNING *`;
  pool
    .query(updateItem, arr)
    .then((result) => {
      const item_id = result.rows[0].id;
      if (req.file !== undefined) {
        const addItemImage = `UPDATE items SET image=$1 WHERE id=${item_id}`;
        pool.query(addItemImage, [req.file.filename]);
      }
      return res.redirect(301, "/admin/items");
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

export const doDeleteItems = (req, res) => {
  const { idToDelete } = req.params;
  const deleteQuery = `DELETE FROM items WHERE id=${idToDelete}`;
  pool
    .query(deleteQuery)
    .then(() => {
      return res.redirect(301, "/admin/items");
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

//////////////////////////////////
// categories controllers
//////////////////////////////////
export const goAddCat = (req, res) => {
  const getCat = `SELECT * FROM categories WHERE co_id=${req.user.co_id}`;
  pool
    .query(getCat)
    .then((result) => {
      const allCat = result.rows;
      return res.render("pages/cat", { allCat });
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

export const doAddCat = (req, res) => {
  const arr = Object.values(req.body);
  arr.push(req.user.co_id); // get co_id from req.user which was created in lockedAccess()
  const addCat = `INSERT INTO categories (category, co_id) VALUES ($1, $2)`;
  pool
    .query(addCat, arr)
    .then(() => {
      return res.redirect(301, "/admin/cat");
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

export const goUpdateCat = (req, res) => {
  const { idToUpdate } = req.params;
  const getCat = `SELECT * FROM categories WHERE id=${idToUpdate}`;
  pool
    .query(getCat)
    .then((result) => {
      const editCat = result.rows[0];
      return res.render("pages/cat_edit", { editCat });
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

export const doUpdateCat = (req, res) => {
  const arr = Object.values(req.body);
  const { idToUpdate } = req.params;
  const updateCat = `UPDATE categories SET category=$1 WHERE id=${idToUpdate}`;
  pool
    .query(updateCat, arr)
    .then(() => {
      return res.redirect(301, "/admin/cat");
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

export const doDeleteCat = (req, res) => {
  const { idToDelete } = req.params;
  const deleteQuery = `DELETE FROM categories WHERE id=${idToDelete}`;
  pool
    .query(deleteQuery)
    .then(() => {
      return res.redirect(301, "/admin/cat");
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};
