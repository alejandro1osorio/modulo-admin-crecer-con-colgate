import express from 'express';
import { getUsers, downloadExcel } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/download', downloadExcel);

export default router;
