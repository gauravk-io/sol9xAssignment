import Student from '../models/studentModel.js';
import User from '../models/userModel.js';

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add student
const addStudent = async (req, res) => {
  const { name, email, password, course } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'Student',
    });

    const student = await Student.create({
      user: user._id,
      name,
      email,
      course,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update student
const updateStudent = async (req, res) => {
  const { name, email, course } = req.body;

  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      const emailChanged = email && email !== student.email;
      
      student.name = name || student.name;
      student.email = email || student.email;
      student.course = course || student.course;

      const updatedStudent = await student.save();
      
      // Update linked user
      const user = await User.findById(student.user);
      if (user) {
        user.name = name || user.name;
        if (emailChanged) user.email = email;
        await user.save();
      }

      res.json(updatedStudent);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      await User.findByIdAndDelete(student.user);
      await Student.findByIdAndDelete(req.params.id);
      res.json({ message: 'Student removed' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// student profile
const getOwnProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// student profile update
const updateOwnProfile = async (req, res) => {
  const { name, email, course, oldPassword, password } = req.body;

  try {
    const student = await Student.findOne({ user: req.user._id });
    const user = await User.findById(req.user._id);

    if (!student || !user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Handle name/email updates
    if (email && email !== user.email) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
      student.email = email;
    }

    if (name) {
      user.name = name;
      student.name = name;
    }

    // Handle password update
    if (password) {
      if (!oldPassword) {
        return res.status(400).json({ message: 'Old password is required to set a new one' });
      }

      const isMatch = await user.matchPassword(oldPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect old password' });
      }

      user.password = password;
    }

    if (course) {
      student.course = course;
    }

    await user.save();
    await student.save();

    res.json(student);
  } catch (error) {
    console.error('Update own profile error:', error);
    res.status(400).json({ message: error.message });
  }
};

export {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getOwnProfile,
  updateOwnProfile,
};
