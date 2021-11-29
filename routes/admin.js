import express from "express";
import * as adminCtrl from "../controllers/adminCtrl.js";
import multer from "multer";

const multerUpload = multer({dest:'uploads/'})

let router = express.Router();

router.get("/dash", adminCtrl.goDash);

router.get("/employee", adminCtrl.goAddE);
router.post("/employee", adminCtrl.doAddE);
router.get("/employee/:idToUpdate", adminCtrl.goUpdateE);
router.put("/employee/:idToUpdate", adminCtrl.doUpdateE);
// dun actually delete employee, just update role_id to 99
// cos if employee made sale and delete here, will not be able to match sale to person
router.put("/employee/delete/:idToDelete", adminCtrl.doDeleteE);
// route below orig /employy/all and kept getting syntax error at end of input... looks like /all at end of url is special keyword...
router.get("/employee-all", adminCtrl.showAllE);

router.get("/profile", adminCtrl.goUpdateP);
router.put("/profile", adminCtrl.doUpdateP);

router.get("/items", adminCtrl.goAddItems);
router.post("/items", multerUpload.single("image"), adminCtrl.doAddItems);
router.get("/items/:idToUpdate", adminCtrl.goUpdateItems);
router.put("/items/:idToUpdate", multerUpload.single("image"), adminCtrl.doUpdateItems);
router.delete("/items/delete/:idToDelete", adminCtrl.doDeleteItems);

router.get("/cat", adminCtrl.goAddCat);
router.post("/cat", adminCtrl.doAddCat);
router.get("/cat/:idToUpdate", adminCtrl.goUpdateCat);
router.put("/cat/:idToUpdate", adminCtrl.doUpdateCat);
router.delete("/cat/delete/:idToDelete", adminCtrl.doDeleteCat);

export { router };
