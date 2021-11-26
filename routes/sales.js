import express from "express";
import * as salesCtrl from "../controllers/salesCtrl.js";


let router = express.Router();

router.get("/cashier", salesCtrl.goCashier);
// had to use express.json middleware below cos using axios to send json data to this route
router.post("/cashier", express.json(),salesCtrl.doCashier); 
// router.get("/employee/:idToUpdate", adminCtrl.goUpdateE);
// router.put("/employee/:idToUpdate", adminCtrl.doUpdateE);
// router.delete("/employee/delete/:idToDelete", adminCtrl.doDeleteE);

export { router };
