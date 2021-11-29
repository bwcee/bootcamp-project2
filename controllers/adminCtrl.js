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
// goDash() helper function
const whatIsTheDate = (input) => {
  const today = new Date();
  let nowDate;
  if (input === undefined) {
    return (nowDate = today.toLocaleDateString("en-GB"));
  } else {
    return (nowDate = input.split("-").reverse().join("/"));
  }
};

// render dashboard
export const goDash = (req, res) => {
  let desiredSales;
  if (!req.query.date) {
    desiredSales = `SELECT id FROM sales WHERE created>=current_date::timestamp AND user_id=${req.user.id}`;
  } else {
    const searchDate = req.query.date;
    desiredSales = `SELECT id FROM sales WHERE created>='${searchDate}'::date AND user_id=${req.user.id}`;
  }
  pool
    .query(desiredSales)
    .then((result) => {
      const sales = result.rows;
      if (sales.length === 0) {
        return;
      } else {
        const getSalesID = sales.map((el) => Object.values(el)).toString();
        const getSales = 
        `SELECT items.item, items.price, sales_items.count, categories.category, 
        SUM(items.price * sales_items.count) AS total 
        FROM sales_items, items, categories 
        WHERE sales_items.sales_id in(${getSalesID}) 
        AND sales_items.item_id=items.id 
        AND items.cat_id=categories.id 
        GROUP BY categories.category, items.item, items.price , sales_items.count
        ORDER BY categories.category, items.item`;
        // `SELECT items.item, items.price, sales_items.count, categories.category, 
        // SUM(items.price * sales_items.count) AS total 
        // FROM sales_items, items, categories 
        // WHERE sales_items.sales_id in(${getSalesID}) 
        // AND sales_items.item_id=items.id 
        // AND items.cat_id=categories.id 
        // GROUP BY categories.category, items.item, items.price , sales_items.count
        // ORDER BY categories.category, items.item`;
        return pool.query(getSales);
      }
    })
    .then((result) => {
      if (result === undefined) {
        let sales = { data: [] };
        sales.date = whatIsTheDate(req.query.date);
        console.log("No sales results!!");
        return res.render("pages/dash", { sales });
      } else {
        let salesByCat = [];
        console.log("this is result.rows", result.rows);
        result.rows.forEach((el) => {
          let index = salesByCat.findIndex(
            (cat) => cat.category === el.category
          );
          if (index > 0) {
            let itemIndex = salesByCat[index].items.findIndex(
              (ite) => ite.item === el.item
            );
            if (itemIndex < 0) {
              salesByCat[index].items.push({
                item: el.item,
                total: el.total,
                price: el.price,
                count: el.count,
              });
            } else {
              salesByCat[index].items[itemIndex].total = (
                Number(salesByCat[index].items[itemIndex].total) +
                Number(el.total)
              ).toFixed(2);
              salesByCat[index].items[itemIndex].count += el.count;
            }
          } else {
            salesByCat.push({ category: el.category });
            salesByCat[salesByCat.length - 1].items = [];
            salesByCat[salesByCat.length - 1].items.push({
              item: el.item,
              total: el.total,
              price: el.price,
              count: el.count,
            });
          }
        });
        salesByCat.forEach((el) =>
          console.log("this is sales broken down", el.items)
        );
        let sales = { data: salesByCat };
        sales.date = whatIsTheDate(req.query.date);
        console.log("this is sales w date added", sales);
        return res.render("pages/dash", { sales });
      }
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

//////////////////////////////////
// employee controllers
//////////////////////////////////
export const goAddE = (req, res) => {
  const getEmployees = `SELECT users.*, roles.role FROM users INNER JOIN roles ON users.role_id=roles.id WHERE co_id=${req.user.co_id} AND role_id=2 ORDER BY name`;
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
  const deleteQuery = `UPDATE users SET role_id=99 WHERE id=${idToDelete}`;
  pool
    .query(deleteQuery)
    .then(() => {
      return res.redirect(301, "/admin/employee");
    })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

export const showAllE = (req, res) => {
  const getEmployees = `SELECT users.*, roles.role FROM users INNER JOIN roles ON users.role_id=roles.id WHERE co_id=${req.user.co_id} AND role_id>1 ORDER BY name`;
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
  const getItems = `SELECT items.*, categories.category FROM items INNER JOIN categories ON items.cat_id=categories.id WHERE items.co_id=${req.user.co_id} ORDER BY item`;
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
  const arr = Object.values(req.body).slice(0, 4);
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
    // .then(() => {
    //   return res.redirect(301, "/admin/items");
    // })
    .catch((err) => {
      return adminErrorHandler(err, res);
    });
};

//////////////////////////////////
// categories controllers
//////////////////////////////////
export const goAddCat = (req, res) => {
  const getCat = `SELECT * FROM categories WHERE co_id=${req.user.co_id} AND category<>'Nil category'ORDER BY category`;
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
