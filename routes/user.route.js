import express from "express";
import {userRegister,userLogin, getMe} from '../controllers/user.controller.js'
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post('/register',userRegister);
router.post('/login',userLogin);
router.get('/getme', verifyToken, getMe); 

export default router;