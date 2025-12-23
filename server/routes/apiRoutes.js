import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getOwnProfile,
  updateOwnProfile,
} from '../controllers/studentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Health check
router.get('/ping', (req, res) => {
  res.status(200).json({ message: 'Server is awake' });
});

// Student profile
router.get('/profile', protect, getOwnProfile);
router.put('/profile', protect, updateOwnProfile);

// Admin only routes
router.get('/', protect, admin, getAllStudents);
router.post('/', protect, admin, addStudent);
router.put('/:id', protect, admin, updateStudent);
router.delete('/:id', protect, admin, deleteStudent);

export default router;
