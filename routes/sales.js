import express from "express";
import * as salesCtrl from "../controllers/salesCtrl.js";


let router = express.Router();

router.get("/cashier", salesCtrl.goCashier);

export { router };
