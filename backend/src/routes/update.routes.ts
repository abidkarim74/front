import { Response, Request, Router } from "express";
import { updateUserProfilePic } from "../controllers/updateControllers.js";
import verify from "../middleware/protectRoute.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req:Request, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


const router = Router();
const upload = multer({ storage });



router.put("/uploads-profilepic/:userId", verify, upload.single("profilePic"), updateUserProfilePic);


export default router;