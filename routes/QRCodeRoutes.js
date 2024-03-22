import express  from "express";
import { validateUser } from "../controllers/qrCodeController";
import { createQR } from "../controllers/qrCodeController";

const router = express.Router();

router.post('/createQR', createQR);
router.post('/validate',validateUser)

export default router;