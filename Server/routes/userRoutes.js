import express from 'express';
import { verifyUserToken } from '../middleware/user.middleware.js';
import { registerUser, loginUser, updatePassword } from '../controllers/userController.js';

const router = express.Router();
router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/update-password', verifyUserToken,updatePassword);
// router.post('/delete-account', verifyUserToken,deleteUser);
export default router;