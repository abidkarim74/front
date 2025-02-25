import { Router, Request, Response } from "express";
import { refreshTokenFunc, loginFunc, signupFunc, logoutFunc, getAuthenticatedUser } from "../controllers/authControllers.js";
import verify from "../middleware/protectRoute.js";


const router = Router();

//These routes are not protected
router.post("/login", loginFunc);
router.post("/signup", signupFunc);

//These routes are protected
router.post("/refresh", verify, refreshTokenFunc);
router.post("/logout", verify, logoutFunc);
router.get("/me", verify, getAuthenticatedUser);

export default router;