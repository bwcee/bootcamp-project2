import express from "express";
import * as adminCtrl from "../controllers/adminCtrl.js";


let router = express.Router();

router.get("/dash", adminCtrl.goStart);

router.get("/employee", adminCtrl.goAddE);

router.post("/employee", adminCtrl.doAddE);

router.get("/employee/:idToUpdate", adminCtrl.goUpdateE);

router.put("/employee/:idToUpdate", adminCtrl.doUpdateE);

router.delete("/employee/delete/:idToDelete", adminCtrl.doDeleteE);

router.get("/profile", adminCtrl.goUpdateP);

router.put("/profile", adminCtrl.doUpdateP);

export { router };
