import express from "express";
import * as adminCtrl from "../controllers/adminCtrl.js";


let router = express.Router();

router.get("/dash", adminCtrl.goStart);

router.get("/add-employee", adminCtrl.goAddE);

router.post("/add-employee", adminCtrl.doAddE);

router.get("/update-employee/:idToUpdate", adminCtrl.goUpdateE);

router.put("/update-employee/:idToUpdate", adminCtrl.doUpdateE);

router.delete("/delete-employee/:idToDelete", adminCtrl.doDeleteE);

router.get("/update-profile", adminCtrl.goUpdateP);

router.put("/update-profile", adminCtrl.doUpdateP);

export { router };
