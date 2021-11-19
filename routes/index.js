import express from "express";
import * as indexCtrl from "../controllers/indexCtrl.js";

let router = express.Router();

router.get("/index", indexCtrl.goHome);

export { router };
