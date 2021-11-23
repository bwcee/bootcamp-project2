import express from "express";
import * as userCtrl from "../controllers/userCtrl.js";


let router = express.Router();

router.get("/index", userCtrl.goHome);

router.get("/signup", userCtrl.goSignup);

router.post("/signup", userCtrl.doSignup);

router.get("/signin", userCtrl.goSignin);

router.post("/signin", userCtrl.doSignin);

router.get("/setpass", userCtrl.goSetpass);

router.post("/setpass", userCtrl.doSetpass);

router.post("/logout", userCtrl.doLogout);

export { router };
