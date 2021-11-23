import express from "express";
import jsSHA from "jssha";
import {} from "dotenv/config";
import { pool } from "../app.js";

export const goStart = (req, res) => {
  res.render("pages/dash");
};

export const goAddE = (req, res) => {
  const getEmployees = `SELECT users.*, roles.role FROM users INNER JOIN roles ON users.role_id=roles.id WHERE co_id=${req.user.co_id} AND role_id=2`;
  pool
    .query(getEmployees)
    .then((result) => {
      const allEmployees = result.rows;
      return res.render("pages/employee", { allEmployees });
    })
    .catch((err) => {
      console.error("Error you doofus!", err);
      const data = {
        text: "Sorry there is an error. Go back to dashboard and try again.",
        link: "/admin/dash",
        link_text: "Dash",
      };
      return res.render("pages/error", { data });
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
      console.error("Error you doofus!", err);
      const data = {
        text: "Sorry there is an error. Go back to dashboard and try again.",
        link: "/admin/dash",
        link_text: "Dash",
      };
      return res.render("pages/error", { data });
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
      console.error("Error you doofus!", err);
      const data = {
        text: "Sorry there is an error. Go back to dashboard and try again.",
        link: "/admin/dash",
        link_text: "Dash",
      };
      return res.render("pages/error", { data });
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
      console.error("Error you doofus!", err);
      const data = {
        text: "Sorry there is an error. Go back to dashboard and try again.",
        link: "/admin/dash",
        link_text: "Dash",
      };
      return res.render("pages/error", { data });
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
      console.error("Error you doofus!", err);
      const data = {
        text: "Sorry there is an error. Go back to dashboard and try again.",
        link: "/admin/dash",
        link_text: "Dash",
      };
      return res.render("pages/error", { data });
    });
};

export const goUpdateP = (req, res) => {
  const getProfile = `SELECT users.*, companies.name as co_name FROM users INNER JOIN companies ON users.co_id=companies.id WHERE users.id=${req.user.id}`;
  pool
    .query(getProfile)
    .then((result) => {
      const profile = result.rows[0];
      return res.render("pages/profile", { profile });
    })
    .catch((err) => {
      console.error("Error you doofus!", err);
      const data = {
        text: "Sorry there is an error. Go back to dashboard and try again.",
        link: "/admin/dash",
        link_text: "Dash",
      };
      return res.render("pages/error", { data });
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
      pool.query(updateCo, [biz_name])
      return res.redirect(301,"/admin/profile")
    })
    .catch((err) => {
      console.error("Error you doofus!", err);
      const data = {
        text: "Sorry there is an error. Go back to dashboard and try again.",
        link: "/admin/dash",
        link_text: "Dash",
      };
      return res.render("pages/error", { data });
    });
};