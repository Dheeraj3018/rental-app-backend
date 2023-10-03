import express from 'express';
import { registerController, loginController, testController, forgotPasswordController } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';


const router = express.Router();



router.post("/register", registerController);

router.post("/login", loginController);

router.post("/forgotpassword", forgotPasswordController);

router.get('/test', requireSignIn, isAdmin, testController);

router.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
})

export default router;
