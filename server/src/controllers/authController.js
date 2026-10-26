import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { Portfolio } from '../models/Portfolio.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'careercraft_jwt_secret_key_b_gopinath_2026_secure', {
    expiresIn: '30d',
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name: name || 'B. Gopinath',
      email,
      password,
      role: 'MERN Stack Developer',
    });

    const token = generateToken(user._id);

    // Initialize default profile for the user
    await Profile.create({
      userId: user._id,
      personalInfo: {
        fullName: user.name,
        email: user.email,
        title: 'MERN Stack Developer',
      },
    });

    // Initialize default portfolio for the user
    const slug = user.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'developer';
    await Portfolio.create({
      userId: user._id,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
