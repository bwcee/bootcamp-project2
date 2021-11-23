import express from "express";
import * as posCtrl from "../controllers/posCtrl.js";


let router = express.Router();

router.get("/cashier", posCtrl.goPOS);

export { router };
